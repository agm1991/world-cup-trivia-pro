import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types.js';

export function normalizePurchaseEmail(email: string): string {
  return email.trim().toLowerCase();
}

function paymentIntentId(session: Stripe.Checkout.Session): string | null {
  if (typeof session.payment_intent === 'string') {
    return session.payment_intent;
  }
  return session.payment_intent?.id ?? null;
}

export function extractCheckoutEmail(session: Stripe.Checkout.Session): string | null {
  const customer =
    typeof session.customer === 'object' && session.customer && !session.customer.deleted
      ? session.customer
      : null;
  const paymentIntent =
    typeof session.payment_intent === 'object' && session.payment_intent ? session.payment_intent : null;

  const candidates = [
    session.customer_details?.email,
    session.customer_email,
    customer?.email ?? null,
    paymentIntent?.receipt_email ?? null,
  ];

  for (const raw of candidates) {
    if (raw?.trim()) {
      return normalizePurchaseEmail(raw);
    }
  }

  return null;
}

export function isKickOffSessionPaid(session: Stripe.Checkout.Session): boolean {
  const amount = session.amount_total ?? session.amount_subtotal;
  return (
    session.payment_status === 'paid' &&
    session.mode === 'payment' &&
    session.status === 'complete' &&
    amount === 100 &&
    session.currency?.toLowerCase() === 'gbp'
  );
}

type RecordPurchaseInput = {
  email: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  paidAt: string;
};

/** Idempotent — safe to call on every verify retry or webhook delivery. */
export async function recordKickOffPurchase(
  admin: SupabaseClient<Database>,
  input: RecordPurchaseInput,
): Promise<{ recorded: boolean; email: string }> {
  const email = normalizePurchaseEmail(input.email);

  const { data: existingSession } = await admin
    .from('kick_off_purchases')
    .select('email')
    .eq('stripe_checkout_session_id', input.stripeCheckoutSessionId)
    .maybeSingle();

  if (existingSession) {
    return { recorded: true, email: existingSession.email };
  }

  const { data: existingEmail } = await admin
    .from('kick_off_purchases')
    .select('email')
    .ilike('email', email)
    .maybeSingle();

  if (existingEmail) {
    return { recorded: true, email: existingEmail.email };
  }

  const { error } = await admin.from('kick_off_purchases').insert({
    email,
    stripe_checkout_session_id: input.stripeCheckoutSessionId,
    stripe_payment_intent_id: input.stripePaymentIntentId,
    amount_pence: 100,
    currency: 'gbp',
    paid_at: input.paidAt,
  });

  if (error) {
    if (error.code === '23505') {
      return { recorded: true, email };
    }
    throw error;
  }

  return { recorded: true, email };
}

export async function persistKickOffPurchaseFromSession(
  stripe: Stripe,
  admin: SupabaseClient<Database>,
  session: Stripe.Checkout.Session,
): Promise<{ email: string }> {
  let resolvedSession = session;
  let email = extractCheckoutEmail(resolvedSession);

  if (!email) {
    resolvedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['customer', 'payment_intent'],
    });
    email = extractCheckoutEmail(resolvedSession);
  }

  if (!email) {
    throw new Error('No customer email on Stripe checkout session.');
  }

  await recordKickOffPurchase(admin, {
    email,
    stripeCheckoutSessionId: resolvedSession.id,
    stripePaymentIntentId: paymentIntentId(resolvedSession),
    paidAt: new Date(resolvedSession.created * 1000).toISOString(),
  });

  return { email };
}

function escapeStripeSearchValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function findPaidKickOffSessionByEmail(
  stripe: Stripe,
  email: string,
): Promise<Stripe.Checkout.Session | null> {
  const normalized = normalizePurchaseEmail(email);

  try {
    const search = await stripe.checkout.sessions.search({
      query: `customer_details.email:'${escapeStripeSearchValue(normalized)}' AND status:'complete'`,
      limit: 20,
    });

    for (const session of search.data) {
      if (isKickOffSessionPaid(session)) {
        return session;
      }
    }
  } catch {
    // Stripe Search may be unavailable — fall back to customer lookup.
  }

  const customers = await stripe.customers.list({ email: normalized, limit: 10 });
  for (const customer of customers.data) {
    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 20,
      status: 'complete',
    });

    for (const session of sessions.data) {
      if (isKickOffSessionPaid(session)) {
        return session;
      }
    }
  }

  return null;
}

/** Returns true when a purchase row exists (or was backfilled from Stripe). */
export async function ensureKickOffPurchaseForEmail(
  stripe: Stripe,
  admin: SupabaseClient<Database>,
  email: string,
): Promise<boolean> {
  const normalized = normalizePurchaseEmail(email);

  const { data: existing } = await admin
    .from('kick_off_purchases')
    .select('id')
    .ilike('email', normalized)
    .maybeSingle();

  if (existing) {
    return true;
  }

  const session = await findPaidKickOffSessionByEmail(stripe, normalized);
  if (!session) {
    return false;
  }

  await persistKickOffPurchaseFromSession(stripe, admin, session);
  return true;
}

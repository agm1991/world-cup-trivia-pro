import Stripe from 'stripe';
import { getSupabaseAdmin } from './lib/supabaseAdmin.js';
import { isKickOffSessionPaid, persistKickOffPurchaseFromSession } from './lib/kickOffPurchase.js';

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: string | Buffer;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: Record<string, unknown>) => void;
  send: (body: string) => void;
};

function rawBody(req: VercelRequest): string {
  if (typeof req.body === 'string') {
    return req.body;
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }
  return '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecretKey || !webhookSecret) {
    return res.status(500).json({ error: 'Stripe webhook is not configured.' });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return res.status(500).json({ error: 'Purchase database is not configured.' });
  }

  const signatureHeader = req.headers['stripe-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  if (!signature) {
    return res.status(400).send('Missing Stripe signature.');
  }

  const stripe = new Stripe(stripeSecretKey);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody(req), signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature.';
    return res.status(400).send(message);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (isKickOffSessionPaid(session)) {
      try {
        await persistKickOffPurchaseFromSession(stripe, admin, session);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not record purchase.';
        return res.status(500).json({ error: message });
      }
    }
  }

  return res.status(200).json({ received: true });
}

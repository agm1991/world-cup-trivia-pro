import Stripe from 'stripe';
import { getSupabaseAdmin } from './lib/supabaseAdmin.js';
import { isKickOffSessionPaid, persistKickOffPurchaseFromSession } from './lib/kickOffPurchase.js';

type VerifyBody = {
  sessionId?: string;
};

type VercelRequest = {
  method?: string;
  body?: VerifyBody | string;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: Record<string, unknown>) => void;
};

function parseBody(req: VercelRequest): VerifyBody {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as VerifyBody;
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'Stripe secret key is not configured.', paid: false });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return res.status(500).json({ error: 'Purchase database is not configured.', paid: false });
  }

  const sessionId = parseBody(req).sessionId?.trim();
  if (!sessionId?.startsWith('cs_')) {
    return res.status(400).json({ error: 'Invalid checkout session id.', paid: false });
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent'],
    });

    if (!isKickOffSessionPaid(session)) {
      return res.status(402).json({ error: 'Payment not completed.', paid: false });
    }

    const { email } = await persistKickOffPurchaseFromSession(stripe, admin, session);

    return res.status(200).json({ paid: true, email });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not verify checkout session.';
    return res.status(500).json({ error: message, paid: false });
  }
}

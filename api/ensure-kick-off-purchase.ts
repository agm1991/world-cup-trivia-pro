import Stripe from 'stripe';
import { getSupabaseAdmin } from './lib/supabaseAdmin.js';
import { ensureKickOffPurchaseForEmail, normalizePurchaseEmail } from './lib/kickOffPurchase.js';

type EnsureBody = {
  email?: string;
};

type VercelRequest = {
  method?: string;
  body?: EnsureBody | string;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: Record<string, unknown>) => void;
};

function parseBody(req: VercelRequest): EnsureBody {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as EnsureBody;
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
    return res.status(500).json({ error: 'Stripe secret key is not configured.', found: false });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return res.status(500).json({ error: 'Purchase database is not configured.', found: false });
  }

  const rawEmail = parseBody(req).email?.trim() ?? '';
  const email = normalizePurchaseEmail(rawEmail);
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Enter the email you used at Stripe checkout.', found: false });
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const found = await ensureKickOffPurchaseForEmail(stripe, admin, email);
    return res.status(200).json({ found });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not look up purchase.';
    return res.status(500).json({ error: message, found: false });
  }
}

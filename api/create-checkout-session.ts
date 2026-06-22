import Stripe from 'stripe';

type CheckoutBody = {
  successUrl?: string;
  cancelUrl?: string;
};

type VercelRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: CheckoutBody | string;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: Record<string, unknown>) => void;
};

function getRequestOrigin(req: VercelRequest): string {
  const host = req.headers.host;
  if (!host || Array.isArray(host)) {
    return '';
  }
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) ?? 'https';
  return `${proto}://${host}`;
}

function isSameOriginUrl(url: string, origin: string): boolean {
  if (!origin) return false;
  try {
    return new URL(url).origin === origin;
  } catch {
    return false;
  }
}

function parseBody(req: VercelRequest): CheckoutBody {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as CheckoutBody;
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
    return res.status(500).json({ error: 'Stripe secret key is not configured.' });
  }

  try {
    const body = parseBody(req);
    const origin = getRequestOrigin(req);
    const successUrl =
      typeof body.successUrl === 'string' && isSameOriginUrl(body.successUrl, origin)
        ? body.successUrl
        : `${origin}/?checkout=success`;
    const cancelUrl =
      typeof body.cancelUrl === 'string' && isSameOriginUrl(body.cancelUrl, origin)
        ? body.cancelUrl
        : `${origin}/?checkout=cancelled`;

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_creation: 'always',
      metadata: { product: 'kick-off' },
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: 100,
            product_data: {
              name: 'World Cup Showdown — Kick Off',
              description: 'Full access to World Cup Showdown trivia',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      return res.status(500).json({ error: 'Stripe session created without a redirect URL.' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe checkout failed.';
    return res.status(500).json({ error: message });
  }
}

const PUBLISHABLE_KEY =
  (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) ??
  'pk_live_51TibPUKCwnMclQMARdv6fXsmuxS4piE1SB1Q3tag0uT5W9sNVWOX0ooYaB2yfJ3eL7YmjtjKmoVlxNS0Ssr5knc000xp2XCr2K';

function appOrigin(): string {
  return typeof window !== 'undefined' ? window.location.origin : '';
}

/** Create a Stripe Checkout session and hard-redirect the browser to it. */
export async function startKickOffCheckout(): Promise<void> {
  if (!PUBLISHABLE_KEY.startsWith('pk_')) {
    throw new Error('Stripe publishable key is not configured.');
  }

  const origin = appOrigin();
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      successUrl: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/?checkout=cancelled`,
    }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    let message = bodyText || `Checkout failed (${response.status}).`;
    try {
      const parsed = JSON.parse(bodyText) as { error?: string };
      if (parsed.error) {
        message = parsed.error;
      }
    } catch {
      // keep raw body as message
    }
    throw new Error(message);
  }

  let checkoutUrl: string | undefined;
  try {
    checkoutUrl = (JSON.parse(bodyText) as { url?: string }).url;
  } catch {
    throw new Error('Invalid checkout response from server.');
  }

  if (!checkoutUrl) {
    throw new Error('Stripe did not return a checkout URL.');
  }

  window.location.replace(checkoutUrl);
}

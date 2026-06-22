-- Cross-device £1 Kick Off purchase records (written server-side after Stripe verify).
CREATE TABLE public.kick_off_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_checkout_session_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  amount_pence INTEGER NOT NULL DEFAULT 100,
  currency TEXT NOT NULL DEFAULT 'gbp',
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Normalized email uniqueness — one purchase per checkout email.
CREATE UNIQUE INDEX kick_off_purchases_email_lower_idx ON public.kick_off_purchases (lower(email));
CREATE UNIQUE INDEX kick_off_purchases_stripe_session_idx ON public.kick_off_purchases (stripe_checkout_session_id);

ALTER TABLE public.kick_off_purchases ENABLE ROW LEVEL SECURITY;

-- Authenticated users may read their own purchase (magic-link restore flow).
CREATE POLICY "Users can read own kick off purchase"
ON public.kick_off_purchases
FOR SELECT
TO authenticated
USING (
  lower(email) = lower((auth.jwt() ->> 'email'))
  OR user_id = auth.uid()
);

-- Link auth user to purchase row after magic-link login (email must match JWT).
CREATE OR REPLACE FUNCTION public.link_kick_off_purchase()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.kick_off_purchases
  SET user_id = auth.uid()
  WHERE lower(email) = lower(auth.jwt() ->> 'email')
    AND user_id IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_kick_off_purchase() TO authenticated;

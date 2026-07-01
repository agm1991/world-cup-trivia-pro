-- Cross-device profile sync via 6-character link codes (no auth required).
CREATE TABLE public.shared_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  game_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  recent_completions JSONB NOT NULL DEFAULT '[]'::jsonb,
  fastest_timer_run_sec INTEGER,
  fastest_timer_by_category JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.device_link_codes (
  code TEXT NOT NULL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.shared_profiles(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT device_link_codes_code_format CHECK (code ~ '^[A-Z0-9]{6}$')
);

CREATE INDEX device_link_codes_profile_id_idx ON public.device_link_codes (profile_id);
CREATE INDEX device_link_codes_expires_at_idx ON public.device_link_codes (expires_at);

ALTER TABLE public.shared_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_link_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shared profiles are viewable by everyone"
ON public.shared_profiles
FOR SELECT
USING (true);

CREATE POLICY "Clients can insert shared profiles"
ON public.shared_profiles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Clients can update shared profiles"
ON public.shared_profiles
FOR UPDATE
USING (true);

CREATE TRIGGER update_shared_profiles_updated_at
BEFORE UPDATE ON public.shared_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Link codes are viewable by everyone"
ON public.device_link_codes
FOR SELECT
USING (true);

CREATE POLICY "Clients can insert link codes"
ON public.device_link_codes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Clients can update link codes"
ON public.device_link_codes
FOR UPDATE
USING (true);

-- Extend profiles with cross-device game progress (linked to auth.users via user_id / email login).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS game_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS recent_completions JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS fastest_timer_run_sec INTEGER,
  ADD COLUMN IF NOT EXISTS fastest_timer_by_category JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Game data is private — only the signed-in owner may read their row.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

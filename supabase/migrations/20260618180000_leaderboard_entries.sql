-- Public leaderboard rows synced from client profiles (name, country, score, speed).
CREATE TABLE public.leaderboard_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  levels_completed INTEGER NOT NULL DEFAULT 0,
  fastest_time_sec INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX leaderboard_entries_country_idx ON public.leaderboard_entries (country);
CREATE INDEX leaderboard_entries_total_score_idx ON public.leaderboard_entries (total_score DESC);
CREATE INDEX leaderboard_entries_fastest_time_idx ON public.leaderboard_entries (fastest_time_sec ASC NULLS LAST);

ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leaderboard entries are viewable by everyone"
ON public.leaderboard_entries
FOR SELECT
USING (true);

CREATE POLICY "Clients can insert leaderboard entries"
ON public.leaderboard_entries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Clients can update leaderboard entries"
ON public.leaderboard_entries
FOR UPDATE
USING (true);

CREATE TRIGGER update_leaderboard_entries_updated_at
BEFORE UPDATE ON public.leaderboard_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

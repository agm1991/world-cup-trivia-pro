-- Per-category leaderboard rows (points + optional Timer Challenge best time).
CREATE TABLE public.leaderboard_category_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  category TEXT NOT NULL,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  levels_completed INTEGER NOT NULL DEFAULT 0,
  fastest_time_sec INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (player_id, category)
);

CREATE INDEX leaderboard_category_entries_category_idx ON public.leaderboard_category_entries (category);
CREATE INDEX leaderboard_category_entries_category_score_idx ON public.leaderboard_category_entries (category, total_score DESC);
CREATE INDEX leaderboard_category_entries_category_fastest_idx ON public.leaderboard_category_entries (category, fastest_time_sec ASC NULLS LAST);

ALTER TABLE public.leaderboard_category_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Category leaderboard entries are viewable by everyone"
ON public.leaderboard_category_entries
FOR SELECT
USING (true);

CREATE POLICY "Clients can insert category leaderboard entries"
ON public.leaderboard_category_entries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Clients can update category leaderboard entries"
ON public.leaderboard_category_entries
FOR UPDATE
USING (true);

CREATE TRIGGER update_leaderboard_category_entries_updated_at
BEFORE UPDATE ON public.leaderboard_category_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

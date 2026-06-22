/** Human-readable log of finished runs (complements per-level `wcq_game_stats`). */
/** v3 — cleared again so profile “Recent quiz results” is empty before online launch. */
export const RECENT_COMPLETIONS_KEY = 'wcq_recent_completions_v3';

export type RecentCompletion = {
  id: string;
  at: string;
  title: string;
  score: number;
  detail?: string;
};

const MAX = 40;

export function readRecentCompletions(): RecentCompletion[] {
  try {
    const raw = localStorage.getItem(RECENT_COMPLETIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is RecentCompletion =>
        e &&
        typeof e === 'object' &&
        typeof (e as RecentCompletion).id === 'string' &&
        typeof (e as RecentCompletion).title === 'string' &&
        typeof (e as RecentCompletion).score === 'number',
    );
  } catch {
    return [];
  }
}

/** Deterministic level slot for modes without a numeric level (e.g. manager name). */
export function stableLevelFromKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i) * (i + 1)) % 100000;
  return h + 1;
}

export function appendRecentCompletion(entry: Omit<RecentCompletion, 'id' | 'at'>): RecentCompletion {
  const row: RecentCompletion = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    at: new Date().toISOString(),
    ...entry,
  };
  const next = [row, ...readRecentCompletions()].slice(0, MAX);
  try {
    localStorage.setItem(RECENT_COMPLETIONS_KEY, JSON.stringify(next));
  } catch {
    // ignore quota
  }
  return row;
}

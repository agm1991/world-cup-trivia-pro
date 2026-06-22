import type { Category } from '@/types/game';

export interface LevelStatsPersisted {
  completed: boolean;
  bestScore: number;
  attempts: number;
}

export interface CategoryStatsPersisted {
  levels: Record<number, LevelStatsPersisted>;
  totalScore: number;
  highestLevel: number;
}

export type GameStatsPersisted = Record<string, CategoryStatsPersisted>;

export const STATS_STORAGE_KEY = 'wcq_game_stats';

/** Normalize parsed localStorage JSON into a consistent GameStats shape. */
export function normalizeGameStatsFromStorage(parsed: unknown): GameStatsPersisted {
  if (!parsed || typeof parsed !== 'object') return {};
  const out: GameStatsPersisted = {};
  for (const [key, raw] of Object.entries(parsed as Record<string, CategoryStatsPersisted>)) {
    const c = raw as CategoryStatsPersisted;
    out[key] = {
      levels: c?.levels && typeof c.levels === 'object' ? c.levels : {},
      totalScore: typeof c?.totalScore === 'number' ? c.totalScore : 0,
      highestLevel: typeof c?.highestLevel === 'number' ? c.highestLevel : 0,
    };
  }
  return out;
}

export function readGameStatsFromStorage(): GameStatsPersisted {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return {};
    return normalizeGameStatsFromStorage(JSON.parse(raw));
  } catch {
    return {};
  }
}

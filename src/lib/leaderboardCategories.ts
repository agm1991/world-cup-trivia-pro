import type { CategoryStatsPersisted, GameStatsPersisted } from '@/lib/gameStatsStorage';
import { CATEGORIES_PAGE_DISPLAY_ITEMS } from '@/lib/categoryNavigation';

/** Quiz modes shown on the category leaderboard filter (excludes Squad Predictor). */
export const LEADERBOARD_CATEGORY_OPTIONS = CATEGORIES_PAGE_DISPLAY_ITEMS.filter(
  (item) => item.category !== 'squad-predictor',
).map((item) => ({
  id: item.category,
  label: item.title,
}));

const LABEL_BY_ID = Object.fromEntries(LEADERBOARD_CATEGORY_OPTIONS.map((o) => [o.id, o.label]));

export function leaderboardCategoryLabel(categoryId: string): string {
  if (LABEL_BY_ID[categoryId]) return LABEL_BY_ID[categoryId];
  if (categoryId.startsWith('player-')) return 'PLAYERS';
  return categoryId;
}

/** Map stored stats keys (e.g. player-messi) → leaderboard category id (player). */
export function normalizeLeaderboardCategoryKey(statsKey: string): string {
  if (statsKey.startsWith('player-')) return 'player';
  return statsKey;
}

export type AggregatedCategoryStats = {
  totalScore: number;
  levelsCompleted: number;
};

function aggregateCategoryBucket(
  bucket: AggregatedCategoryStats,
  cat: CategoryStatsPersisted,
): AggregatedCategoryStats {
  const levels = cat.levels ?? {};
  const completed = Object.values(levels).filter((l) => l.completed).length;
  return {
    totalScore: bucket.totalScore + (cat.totalScore ?? 0),
    levelsCompleted: bucket.levelsCompleted + completed,
  };
}

/** Roll local game stats into one row per playable category. */
export function aggregateCategoryStatsFromGameStats(
  gameStats: GameStatsPersisted,
): Record<string, AggregatedCategoryStats> {
  const out: Record<string, AggregatedCategoryStats> = {};
  for (const [key, cat] of Object.entries(gameStats)) {
    if (!cat) continue;
    const categoryId = normalizeLeaderboardCategoryKey(key);
    out[categoryId] = aggregateCategoryBucket(out[categoryId] ?? { totalScore: 0, levelsCompleted: 0 }, cat);
  }
  return out;
}

export function isActiveCategoryStats(totalScore: number, levelsCompleted: number): boolean {
  return totalScore > 0 || levelsCompleted > 0;
}

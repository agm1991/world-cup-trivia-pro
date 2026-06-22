import { Category } from '@/types/game';
import { GUESS_PHOTO_LEVEL_COUNT } from '@/data/guessWhoPhotoQuestions';
import { BINGO_LEVEL_COUNT } from '@/data/worldCupBingoQuestions';
import { DESTINY_ROUTE_LEVEL_COUNT } from '@/data/destinyRouteQuestions';
import { WORLD_CUP_LEVEL_COUNT } from '@/data/worldCupLevelConfig';

const PLAYER_MAX_LEVELS = 250;

interface CategoryStatsLike {
  highestLevel: number;
}

interface GameStatsEntry {
  highestLevel?: number;
}

/** Max levels used for % complete on the categories grid (aligned with Navigation / routes). */
export function getMaxLevelsForCategory(category: Category): number {
  const map: Record<string, number> = {
    'world-cup-bingo': BINGO_LEVEL_COUNT,
    'world-cup': WORLD_CUP_LEVEL_COUNT,
    'guess-scoreline': 50,
    'guess-who': 30,
    'guess-who-photo': GUESS_PHOTO_LEVEL_COUNT,
    'guess-the-scorer': 10,
    'destiny-route': DESTINY_ROUTE_LEVEL_COUNT,
    player: PLAYER_MAX_LEVELS,
    'country-history': 30,
    'world-cup-winners': 30,
    managers: 30,
    stadiums: 30,
    'missing-player': 30,
    'squad-predictor': 100,
  };
  return map[category] ?? 30;
}

/**
 * Progress % for a mode card (0–100). Player mode sums `player-*` category stats.
 */
export function getCategoryProgressPercent(
  category: Category,
  getCategoryStats: (c: Category) => CategoryStatsLike | null | undefined,
  gameStats: Record<string, { highestLevel?: number } | undefined>
): number {
  const maxLevels = getMaxLevelsForCategory(category);
  if (category === 'player') {
    const playerTotalLevels = Object.entries(gameStats).reduce(
      (sum, [k, s]) => (k.startsWith('player-') ? sum + (s?.highestLevel ?? 0) : sum),
      0
    );
    return Math.min(100, Math.round((playerTotalLevels / maxLevels) * 100));
  }
  const stats = getCategoryStats(category) as CategoryStatsLike | null | undefined;
  if (!stats) return 0;
  return Math.min(100, Math.round((stats.highestLevel / maxLevels) * 100));
}

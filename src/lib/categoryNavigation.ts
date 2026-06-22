import type { NavigateFunction } from 'react-router-dom';
import type { Category } from '@/types/game';
import worldCupTrophyHeroImg from '@/assets/world-cup-trophy.jpg';
import zidaneImg from '@/assets/zidane.jpg';
import categoryPlayersMessiImg from '@/assets/players/Argentina/Lionel_Messi.webp';
import categoryWinnersRonaldoR9Img from '@/assets/ronaldo-r9.jpg';
import lippiImg from '@/assets/managers/lippi.jpg';
import missingPlayerHeroImg from '@/assets/missing-player-category.jpg';
import fieldBackground from '@/assets/field-background.jpg';
import wembleyStadiumImg from '@/assets/wembley.jpg';
import spain2010SquadImg from '@/assets/spain-2010.png';
import beckenbauerHeroImg from '@/assets/beckenbauer.jpg';
import peleHeroImg from '@/assets/pele-new.webp';
import scorelineHeroImg from '@/assets/cristiano-ronaldo.webp';
import { WORLD_CUP_LEVEL_COUNT } from '@/data/worldCupLevelConfig';
import { BINGO_LEVEL_COUNT } from '@/data/worldCupBingoQuestions';
import { DESTINY_ROUTE_LEVEL_COUNT } from '@/data/destinyRouteQuestions';

export type HomeCategoryItem = {
  id: string;
  title: string;
  path: string;
  description?: string;
};

export type HomeCategoryDisplayItem = HomeCategoryItem & {
  category: Category;
  backgroundImage: string;
  image?: string;
  imageVariant?: 'default' | 'flag';
  totalLevels: number;
};

/** Home "Quick play" grid — does not include every mode on the full /categories catalog. */
export const HOME_CATEGORY_DISPLAY_ITEMS: HomeCategoryDisplayItem[] = [
  {
    id: 'world-cup',
    title: 'WORLD CUP',
    path: '/world-cup',
    category: 'world-cup',
    backgroundImage: worldCupTrophyHeroImg,
    totalLevels: 500,
    description: 'Hosts, records, iconic matches, stats, and tournament history',
  },
  {
    id: 'guess-who',
    title: 'GUESS WHO',
    path: '/guess-who',
    category: 'guess-who',
    backgroundImage: zidaneImg,
    totalLevels: 500,
    description: 'Identify players, coaches, or referees from trivia clues',
  },
  {
    id: 'players',
    title: 'PLAYERS',
    path: '/players',
    category: 'player',
    backgroundImage: categoryPlayersMessiImg,
    totalLevels: 500,
    description: 'Legendary World Cup careers — match-log trivia per tournament',
  },
  {
    id: 'winners',
    title: 'WINNERS',
    path: '/winners',
    category: 'winners',
    backgroundImage: categoryWinnersRonaldoR9Img,
    totalLevels: 500,
    description: 'Championship nations — routes, finals, and glory',
  },
];

/** Full `/categories` catalog — every playable mode plus 2026 Squad & Predictor. */
export const CATEGORIES_PAGE_DISPLAY_ITEMS: HomeCategoryDisplayItem[] = [
  {
    id: 'world-cup',
    title: 'WORLD CUP',
    path: '/world-cup',
    category: 'world-cup',
    backgroundImage: worldCupTrophyHeroImg,
    totalLevels: WORLD_CUP_LEVEL_COUNT,
    description: 'Hosts, records, iconic matches, stats, and tournament history',
  },
  {
    id: 'guess-who',
    title: 'GUESS WHO',
    path: '/guess-who',
    category: 'guess-who',
    backgroundImage: zidaneImg,
    totalLevels: 40,
    description: 'Identify players, coaches, or referees from trivia clues',
  },
  {
    id: 'players',
    title: 'PLAYERS',
    path: '/players',
    category: 'player',
    backgroundImage: categoryPlayersMessiImg,
    totalLevels: 250,
    description: 'Legendary World Cup careers — match-log trivia per tournament',
  },
  {
    id: 'winners',
    title: 'WINNERS',
    path: '/winners',
    category: 'world-cup-winners',
    backgroundImage: categoryWinnersRonaldoR9Img,
    totalLevels: 30,
    description: 'Championship nations — routes, finals, and glory',
  },
  {
    id: 'guess-scoreline',
    title: 'SCORELINE',
    path: '/levels/guess-scoreline',
    category: 'guess-scoreline',
    backgroundImage: scorelineHeroImg,
    totalLevels: 50,
    description: 'Flags and line-ups — predict the final score.',
  },
  {
    id: 'country-history',
    title: 'COUNTRY HISTORY',
    path: '/country-history',
    category: 'country-history',
    backgroundImage: peleHeroImg,
    totalLevels: 30,
    description: 'Every nation that has played in a World Cup.',
  },
  {
    id: 'managers',
    title: 'MANAGERS',
    path: '/managers-select',
    category: 'managers',
    backgroundImage: lippiImg,
    totalLevels: 30,
    description: 'Famous coaches and their World Cup achievements.',
  },
  {
    id: 'missing-player',
    title: 'MISSING PLAYERS',
    path: '/missing-player',
    category: 'missing-player',
    backgroundImage: missingPlayerHeroImg,
    totalLevels: 30,
    description: 'Guess the missing name from historic lineups.',
  },
  {
    id: 'stadiums',
    title: 'STADIUMS',
    path: '/levels/stadiums',
    category: 'stadiums',
    backgroundImage: wembleyStadiumImg,
    totalLevels: 30,
    description: 'Iconic World Cup venues from around the world.',
  },
  {
    id: 'destiny-route',
    title: 'DESTINY ROUTE',
    path: '/destiny',
    category: 'destiny-route',
    backgroundImage: fieldBackground,
    totalLevels: DESTINY_ROUTE_LEVEL_COUNT,
    description: "Order each nation's path from kickoff to the final.",
  },
  {
    id: 'world-cup-bingo',
    title: 'WORLD CUP BINGO',
    path: '/levels/world-cup-bingo',
    category: 'world-cup-bingo',
    backgroundImage: beckenbauerHeroImg,
    totalLevels: BINGO_LEVEL_COUNT,
    description: 'Mixed trivia across World Cup formats.',
  },
  {
    id: 'squad-predictor',
    title: '2026 SQUAD & PREDICTOR',
    path: '/squad-predictor',
    category: 'squad-predictor',
    backgroundImage: spain2010SquadImg,
    totalLevels: 100,
    description: 'Build squads for all 48 nations. Predict the full 2026 route.',
  },
];
export function findCategoryDisplayItemById(id: string): HomeCategoryDisplayItem | undefined {
  return CATEGORIES_PAGE_DISPLAY_ITEMS.find((c) => c.id === id);
}

export function findCategoryDisplayItemByCategory(category: Category): HomeCategoryDisplayItem | undefined {
  return (
    CATEGORIES_PAGE_DISPLAY_ITEMS.find((c) => c.category === category) ??
    HOME_CATEGORY_DISPLAY_ITEMS.find((c) => c.category === category)
  );
}

export const HOME_CATEGORY_ITEMS: readonly HomeCategoryItem[] = HOME_CATEGORY_DISPLAY_ITEMS.map(
  ({ id, title, path, description }) => ({ id, title, path, description }),
);

export const LEVEL_GRID_CATEGORIES: Category[] = [
  'world-cup',
  'guess-who',
  'world-cup-winners',
  'player',
];

const LEGACY_ROUTES: Record<string, string> = {
  player: '/players',
  players: '/players',
  winners: '/winners',
  'squad-predictor': '/squad-predictor',
  'world-cup-2026-squad-predictor': '/squad-predictor',
  managers: '/managers-select',
  stadiums: '/levels/stadiums',
  'missing-player': '/missing-player',
  'country-history': '/country-history',
  'guess-scoreline': '/levels/guess-scoreline',
  'destiny-route': '/destiny',
  'world-cup-bingo': '/levels/world-cup-bingo',
};

export function navigateToCategory(navigate: NavigateFunction, category: Category): void {
  if (LEVEL_GRID_CATEGORIES.includes(category)) {
    if (category === 'player') {
      navigate('/levels/player');
    } else if (category === 'country-history') {
      navigate('/country-history');
    } else if (category === 'world-cup-winners') {
      navigate('/world-cup-winners');
    } else {
      navigate(`/levels/${category}`);
    }
    return;
  }

  const legacyRoute = LEGACY_ROUTES[category];
  if (legacyRoute) {
    navigate(legacyRoute);
    return;
  }

  navigate(`/levels/${category}`);
}

export function navigateCategoryItem(navigate: NavigateFunction, item: HomeCategoryItem | HomeCategoryDisplayItem): void {
  if (item.path) {
    navigate(item.path);
    return;
  }
  const meta = findCategoryDisplayItemById(item.id);
  navigateToCategory(navigate, meta?.category ?? 'world-cup');
}

export function getHomePrimaryCategoryCards(): HomeCategoryDisplayItem[] {
  return [...HOME_CATEGORY_DISPLAY_ITEMS];
}

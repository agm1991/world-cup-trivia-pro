import type { Question } from '@/types/game';
import curated from './scorelineLevels25to50Curated.json';

/** User-authored Guess the Scoreline curriculum — levels 25–50 (10 questions × 26 levels). */
export const curatedScorelineLevels25to50 = curated as Question[][];

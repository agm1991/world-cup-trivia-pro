import type { Question } from '@/types/game';
import curated from './scorelineLevels11to30Curated.json';

/** User-authored Guess the Scoreline curriculum — levels 11–30 (10 questions × 20 levels). */
export const curatedScorelineLevels11to30 = curated as Question[][];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'tricky' | 'ultimate';

export type Category = 
  | 'world-cup'
  | 'guess-scoreline'
  | 'guess-who'
  | 'player'
  | 'country-history'
  | 'world-cup-winners'
  | 'managers'
  | 'stadiums'
  | 'missing-player'
  | 'destiny-route'
  | 'world-cup-bingo'
  | string; // Allow dynamic player categories like 'player-pele', 'player-messi', etc.

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  image?: string;
  questionType?: 'text' | 'image' | 'half-image'; // For guess-who questions: text, full image, or half image
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  hint1: string;
  hint2: string;
  hint3: string;
  /** Original category before tagging (e.g. World Cup Bingo mixed pool) */
  sourceCategory?: string;
  /** Guess the Scoreline: heading badge when inference from options is insufficient */
  scorelineResultNote?: 'aet' | 'pens';
  /** Select a Legend: lock question to a World Cup finals year */
  eventYear?: number;
}

export interface PlayerProfile {
  name: string;
  country: string;
  countryFlag: string;
  totalScore: number;
  categoryScores: {
    [key in Category]: number;
  };
}

export interface GameState {
  currentCategory: Category | null;
  currentLevel: number;
  currentQuestion: Question | null;
  lives: number;
  hintsRemaining: number;
  score: number;
}

/** Hint uses allowed per level (shared across all questions in that level). */
export const HINTS_PER_LEVEL = 3;

/** Standard MCQ count per level; profile credit requires a perfect run (all correct). */
export const QUIZ_QUESTIONS_PER_LEVEL = 10;

export const COINS_PER_CORRECT_QUIZ_ANSWER = 5;

export const QUIZ_PERFECT_LEVEL_SCORE = QUIZ_QUESTIONS_PER_LEVEL * COINS_PER_CORRECT_QUIZ_ANSWER;

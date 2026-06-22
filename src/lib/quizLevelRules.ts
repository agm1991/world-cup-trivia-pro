import type { Question } from '@/types/game';
import {
  COINS_PER_CORRECT_QUIZ_ANSWER,
  QUIZ_PERFECT_LEVEL_SCORE,
  QUIZ_QUESTIONS_PER_LEVEL,
} from '@/constants/gameplay';

/** Ten-question levels only; shorter banks cannot earn completion credit. */
export function normalizeQuizQuestionsForLevel(questions: Question[]): Question[] {
  if (questions.length < QUIZ_QUESTIONS_PER_LEVEL) return [];
  return questions.slice(0, QUIZ_QUESTIONS_PER_LEVEL);
}

export function meetsPerfectQuizLevelCompletion(totalQuestions: number, score: number): boolean {
  return (
    totalQuestions === QUIZ_QUESTIONS_PER_LEVEL &&
    score === QUIZ_PERFECT_LEVEL_SCORE
  );
}

/** Wrong answers allowed per question before the level fails (all quiz categories except Squad Predictor). */
export const QUIZ_ATTEMPTS_PER_QUESTION = 2;

export function shouldFailQuizLevelAfterWrong(wrongAttempts: number): boolean {
  return wrongAttempts >= QUIZ_ATTEMPTS_PER_QUESTION;
}

/** Award points once per question index (re-answering after nav does not stack score). */
export function applyQuizCorrectScore(
  questionIndex: number,
  currentScore: number,
  scoredQuestionIndices: Set<number>,
): { score: number; pointsAwarded: number } {
  if (scoredQuestionIndices.has(questionIndex)) {
    return { score: currentScore, pointsAwarded: 0 };
  }
  scoredQuestionIndices.add(questionIndex);
  return {
    score: currentScore + COINS_PER_CORRECT_QUIZ_ANSWER,
    pointsAwarded: COINS_PER_CORRECT_QUIZ_ANSWER,
  };
}

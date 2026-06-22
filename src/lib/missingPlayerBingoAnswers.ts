import type { Question } from '@/types/game';

/** Names from the correct multiple-choice option (e.g. "Ayala · Batista · Verón"). */
export function getCorrectAnswerPlayerNames(question: Question): string[] {
  const key = question.correctAnswer;
  const text =
    key === 'A'
      ? question.optionA
      : key === 'B'
        ? question.optionB
        : key === 'C'
          ? question.optionC
          : question.optionD;
  if (!text) return [];
  return text
    .split(/\s*[·&]\s*|\s*,\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

/**
 * Validates Guess the Scoreline levels 1–50: count, fields, answer keys, duplicate ids per level.
 * Run: npx tsx scripts/validate-scoreline-levels-1-50.mts
 */
import { getScorelineQuestionsByLevel } from '../src/data/scorelineQuestions.ts';
import type { Question } from '../src/types/game.ts';

const EXPECT = 10;
let errors = 0;

function fail(msg: string) {
  console.error(msg);
  errors++;
}

function validateQuestion(q: Question, level: number, index: number) {
  const prefix = `L${level} [${index}] ${q.id}`;
  if (!q.id?.startsWith('sc-')) fail(`${prefix}: id should start with sc-`);
  if (!q.question?.trim()) fail(`${prefix}: empty question`);
  if (q.category !== 'guess-scoreline') fail(`${prefix}: category must be guess-scoreline`);
  const opts = ['A', 'B', 'C', 'D'] as const;
  for (const k of opts) {
    const key = `option${k}` as keyof Question;
    const v = q[key];
    if (typeof v !== 'string' || !String(v).trim()) fail(`${prefix}: missing or empty ${key}`);
  }
  if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
    fail(`${prefix}: invalid correctAnswer ${String(q.correctAnswer)}`);
  } else {
    const key = `option${q.correctAnswer}` as keyof Question;
    const v = q[key];
    if (typeof v !== 'string' || !String(v).trim()) fail(`${prefix}: correct option ${key} empty`);
  }
  for (let h = 1; h <= 3; h++) {
    const hk = `hint${h}` as keyof Question;
    const v = q[hk];
    if (typeof v !== 'string' || !String(v).trim()) fail(`${prefix}: missing ${hk}`);
  }
}

for (let level = 1; level <= 50; level++) {
  const qs = getScorelineQuestionsByLevel(level);
  if (qs.length !== EXPECT) {
    fail(`Level ${level}: expected ${EXPECT} questions, got ${qs.length}`);
  }
  const ids = new Set<string>();
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i];
    if (ids.has(q.id)) fail(`Level ${level}: duplicate id ${q.id}`);
    ids.add(q.id);
    validateQuestion(q, level, i);
  }
}

if (errors === 0) {
  console.log('OK: All levels 1–50 have exactly 10 valid scoreline questions each.');
} else {
  console.error(`\nFailed with ${errors} error(s).`);
  process.exitCode = 1;
}

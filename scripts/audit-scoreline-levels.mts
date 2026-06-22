/**
 * Duplicate check for Guess the Scoreline levels 1–50.
 * Keys by (tournament year from id + normalized question) so the same fixture label
 * in different World Cups (e.g. Brazil vs Cameroon) is not a false positive.
 * Run: npx tsx scripts/audit-scoreline-levels.mts
 */
import { getScorelineQuestionsByLevel } from '../src/data/scorelineQuestions.ts';

function norm(s: string): string {
  return s
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '')
    .replace(/🏴[^\s]*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function yearFromId(id: string): string | null {
  const m = /^sc-(\d{4})-/.exec(id);
  return m ? m[1] : null;
}

const byKey = new Map<string, { id: string; level: number }[]>();

for (let L = 1; L <= 50; L++) {
  for (const q of getScorelineQuestionsByLevel(L)) {
    const y = yearFromId(q.id);
    const key = y ? `${y}|${norm(q.question)}` : norm(q.question);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push({ id: q.id, level: L });
  }
}

let dups = 0;
for (const [, arr] of byKey) {
  if (arr.length > 1 && new Set(arr.map((x) => x.id)).size > 1) {
    console.log(arr.map((x) => `${x.id}@L${x.level}`).join(' | '));
    dups++;
  }
}

if (dups === 0) {
  console.log('OK: no duplicate (year + question) pairs across levels 1–50.');
} else {
  console.log(`\nFound ${dups} duplicate group(s) (same tournament year + same question text).`);
  process.exitCode = 1;
}

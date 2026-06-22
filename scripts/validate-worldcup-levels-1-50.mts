#!/usr/bin/env npx tsx
/**
 * Deep sanity check for World Cup category levels 1–50 (runtime slices).
 * Run: npx tsx scripts/validate-worldcup-levels-1-50.mts
 */

import { getWorldCupQuestionsByLevel } from '../src/data/worldCupQuestions.ts';
import { primaryWorldCupEraYear } from '../src/lib/worldCupLevels31to40Interleave.ts';
import type { Question } from '../src/types/game.ts';

const norm = (s: string) =>
  s
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const opts = (q: Question) =>
  ({ A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD }) as const;

const errors: string[] = [];
const warnings: string[] = [];

for (let lv = 1; lv <= 50; lv++) {
  const qs = getWorldCupQuestionsByLevel(lv);
  if (qs.length !== 10) errors.push(`Level ${lv}: expected 10 questions, got ${qs.length}`);

  const stems = new Set<string>();
  const ids = new Set<string>();

  for (const q of qs) {
    const st = norm(q.question);
    if (stems.has(st)) errors.push(`Level ${lv}: duplicate stem in level (${q.id})`);
    stems.add(st);
    if (ids.has(q.id)) errors.push(`Level ${lv}: duplicate id (${q.id})`);
    ids.add(q.id);

    const ca = norm(opts(q)[q.correctAnswer]);
    if (ca.length >= 2) {
      ([1, 2, 3] as const).forEach((n) => {
        const h = norm(q[`hint${n}` as 'hint1']);
        if (h.includes(ca)) errors.push(`${q.id}: hint${n} contains full correct option text`);
      });
    }
    if (st.includes(ca) && ca.length > 3) errors.push(`${q.id}: question stem contains correct option text`);

    for (const L of ['A', 'B', 'C', 'D'] as const) {
      const t = norm(opts(q)[L]);
      if (t.length < 4 || L === q.correctAnswer) continue;
      ([1, 2, 3] as const).forEach((n) => {
        if (norm(q[`hint${n}` as 'hint1']).includes(t)) {
          warnings.push(`${q.id}: hint${n} mentions wrong option (${L})`);
        }
      });
    }

    if (lv >= 31 && lv <= 40) {
      try {
        primaryWorldCupEraYear(q);
      } catch (e) {
        errors.push(`${q.id}: primaryWorldCupEraYear — ${e}`);
      }
    }
  }
}

const globalStem = new Map<string, number>();
const globalId = new Map<string, number>();
for (let lv = 1; lv <= 50; lv++) {
  for (const q of getWorldCupQuestionsByLevel(lv)) {
    globalStem.set(norm(q.question), (globalStem.get(norm(q.question)) ?? 0) + 1);
    globalId.set(q.id, (globalId.get(q.id) ?? 0) + 1);
  }
}
for (const [k, v] of globalStem) {
  if (v > 1) errors.push(`Duplicate question stem (${v}×): ${k.slice(0, 80)}…`);
}
for (const [k, v] of globalId) {
  if (v > 1) errors.push(`Duplicate id ${k} (${v}×)`);
}

// Difficulty bands
for (let lv = 1; lv <= 50; lv++) {
  for (const q of getWorldCupQuestionsByLevel(lv)) {
    if (lv <= 10 && q.difficulty !== 'easy') errors.push(`${q.id} L${lv}: expected easy`);
    if (lv >= 11 && lv <= 20 && q.difficulty !== 'medium') errors.push(`${q.id} L${lv}: expected medium`);
    if (lv >= 21 && lv <= 30 && q.difficulty !== 'hard') errors.push(`${q.id} L${lv}: expected hard`);
    if (lv >= 31 && lv <= 40 && q.difficulty !== 'ultimate') errors.push(`${q.id} L${lv}: expected ultimate`);
    if (lv >= 41 && lv <= 50 && q.difficulty !== 'hard') errors.push(`${q.id} L${lv}: expected hard (finals)`);
  }
}

console.log(`Errors: ${errors.length}`);
console.log(`Distractor-in-hint warnings: ${warnings.length}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
if (warnings.length) {
  console.warn(warnings.slice(0, 50).join('\n'));
  if (warnings.length > 50) console.warn(`… and ${warnings.length - 50} more`);
  process.exit(2);
}
console.log('OK — World Cup levels 1–50 pass deep checks.');

#!/usr/bin/env node
/**
 * Sanity-check the first 100 wc-easy questions in src/data/worldCupQuestions.ts:
 *  - IDs wc-easy-1 … wc-easy-100 are present in order
 *  - correctAnswer is A/B/C/D
 *  - No duplicate question text
 *  - No two consecutive questions share the same "pattern" key
 *  - Each level (10 questions) has at most 2 questions in a row with the same key
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TARGET = resolve(__dirname, '..', 'src', 'data', 'worldCupQuestions.ts');
const src = readFileSync(TARGET, 'utf8');

// Extract each wc-easy block (payload fields we care about).
const blockRe =
  /id:\s*'wc-easy-(\d+)'[\s\S]*?question:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?optionA:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?optionB:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?optionC:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?optionD:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?correctAnswer:\s*'([ABCD])'/g;

const items = [];
for (const m of src.matchAll(blockRe)) {
  const [, idStr, q, a, b, c, d, ans] = m;
  items.push({
    id: Number(idStr),
    q,
    options: { A: a, B: b, C: c, D: d },
    ans,
  });
  if (items.length === 100) break;
}

const errors = [];

if (items.length !== 100) {
  errors.push(`Expected 100 wc-easy items, found ${items.length}`);
}

items.forEach((it, idx) => {
  if (it.id !== idx + 1) errors.push(`Index ${idx}: id=${it.id} out of order`);
  if (!['A', 'B', 'C', 'D'].includes(it.ans))
    errors.push(`Q${it.id}: bad correctAnswer ${it.ans}`);
  if (!it.options[it.ans])
    errors.push(`Q${it.id}: correctAnswer ${it.ans} has empty option`);
});

// Duplicate question text
const byQuestion = new Map();
for (const it of items) {
  const norm = it.q.trim().toLowerCase();
  if (byQuestion.has(norm)) {
    errors.push(
      `Duplicate question text: Q${byQuestion.get(norm)} and Q${it.id}`
    );
  } else {
    byQuestion.set(norm, it.id);
  }
}

// Crude "pattern" classifier for same-stem detection.
function patternKey(q) {
  const s = q.toLowerCase();
  if (/who won the \d{4} fifa world cup|which country won the \d{4}/.test(s))
    return 'who-won-wc-year';
  if (
    /beat which (nation|country|team) .* world cup final(?!.*semi)/.test(s)
  )
    return 'final-opponent';
  if (/beat which (nation|country|team) .* semi-final/.test(s))
    return 'semi-opponent';
  if (/who managed .* world cup/.test(s)) return 'who-managed';
  if (/who captained .* world cup/.test(s)) return 'who-captained';
  if (/which stadium hosted/.test(s)) return 'which-stadium';
  if (/which country hosted|which nation staged/.test(s))
    return 'host-country';
  if (/golden boot/.test(s)) return 'golden-boot';
  if (/golden ball/.test(s)) return 'golden-ball';
  if (/^what was the (final )?score/.test(s) || /score after extra time/.test(s))
    return 'final-score';
  if (/how many .* world cup titles/.test(s)) return 'titles-count';
  if (/which two teams .* final/.test(s)) return 'two-teams-final';
  if (/who scored .* world cup final/.test(s)) return 'who-scored-final';
  if (/who scored .* world cup semi-final/.test(s)) return 'who-scored-semi';
  return null;
}

for (let i = 1; i < items.length; i += 1) {
  const a = items[i - 1];
  const b = items[i];
  const levelA = Math.ceil(a.id / 10);
  const levelB = Math.ceil(b.id / 10);
  if (levelA !== levelB) continue; // only check within the same level
  const ka = patternKey(a.q);
  const kb = patternKey(b.q);
  if (ka && ka === kb) {
    errors.push(
      `Level ${levelA}: Q${a.id} and Q${b.id} share pattern "${ka}"\n  Q${a.id}: ${a.q}\n  Q${b.id}: ${b.q}`
    );
  }
}

if (errors.length) {
  console.error(`FAILED with ${errors.length} issue(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
} else {
  console.log(`OK: ${items.length} questions validated, no back-to-back pattern repeats.`);
}

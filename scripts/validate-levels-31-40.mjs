#!/usr/bin/env node
// Quick validator for World Cup Ultimate-Mode Levels 31–40.
// Checks: total counts, era distribution (1950/1954/1958/1962/1966 must each have ≥10),
// duplicate IDs, duplicate prompts, and duplicate answer/fact fingerprints.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const files = [
  'src/data/worldCupQuestionsLevels31to34.ts',
  'src/data/worldCupQuestionsLevels35to40.ts',
];

const ERA_YEARS = [1950, 1954, 1958, 1962, 1966];
const YEAR_OVERRIDES = {
  'wc-ult-34-2': 1962,
  'wc-ult-34-8': 1950,
  'wc-ult-34-10': 1962,
};

function parseQuestions(src) {
  const lines = src.split('\n');
  const questions = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('id: ')) {
      if (current) questions.push(current);
      current = {};
      current.id = line.replace(/^id:\s*['"`]/, '').replace(/['"`],?\s*$/, '');
    } else if (!current) continue;
    else if (line.startsWith('question:')) {
      // question may span multiple lines, capture start
      current._qStart = true;
      const m = line.match(/^question:\s*['"`](.*)['"`],?\s*$/);
      if (m) current.question = m[1];
      else {
        const m2 = line.match(/^question:\s*['"`](.*)$/);
        if (m2) current.question = m2[1];
      }
    } else if (current._qStart && current.question == null) {
      const m = line.match(/^['"`]?(.*?)['"`],?\s*$/);
      if (m) current.question = (current.question || '') + m[1];
    } else if (line.startsWith("correctAnswer:")) {
      const m = line.match(/correctAnswer:\s*['"`]([A-D])['"`]/);
      if (m) current.correctAnswer = m[1];
    } else if (line.startsWith('optionA:')) current.optionA = line.replace(/^optionA:\s*['"`]/, '').replace(/['"`],?\s*$/, '');
    else if (line.startsWith('optionB:')) current.optionB = line.replace(/^optionB:\s*['"`]/, '').replace(/['"`],?\s*$/, '');
    else if (line.startsWith('optionC:')) current.optionC = line.replace(/^optionC:\s*['"`]/, '').replace(/['"`],?\s*$/, '');
    else if (line.startsWith('optionD:')) current.optionD = line.replace(/^optionD:\s*['"`]/, '').replace(/['"`],?\s*$/, '');
  }
  if (current) questions.push(current);
  return questions.filter((q) => q.id && q.question);
}

function primaryYear(q) {
  if (YEAR_OVERRIDES[q.id]) return YEAR_OVERRIDES[q.id];
  for (const y of ERA_YEARS) if (q.question.includes(String(y))) return y;
  return null;
}

function fingerprint(q) {
  const correct = q['option' + q.correctAnswer];
  return `${primaryYear(q)}|${(correct || '').toLowerCase().trim()}`;
}

const issues = [];
const all = [];
for (const f of files) {
  const src = readFileSync(join(root, f), 'utf8');
  const qs = parseQuestions(src);
  all.push(...qs);
}

console.log(`Parsed ${all.length} questions.`);

if (all.length !== 100) issues.push(`Expected 100 questions, got ${all.length}.`);

const byEra = Object.fromEntries(ERA_YEARS.map((y) => [y, 0]));
const untagged = [];
for (const q of all) {
  const y = primaryYear(q);
  if (!y) untagged.push(q.id);
  else byEra[y]++;
}
if (untagged.length) issues.push(`Untagged questions (no era year): ${untagged.join(', ')}`);
for (const y of ERA_YEARS) {
  if (byEra[y] < 10) issues.push(`Era ${y} has only ${byEra[y]} tagged questions (need ≥10).`);
}
console.log('Era distribution:', byEra);

const ids = new Set();
for (const q of all) {
  if (ids.has(q.id)) issues.push(`Duplicate id: ${q.id}`);
  ids.add(q.id);
}

const prompts = new Map();
for (const q of all) {
  const key = q.question.toLowerCase().replace(/\s+/g, ' ').trim();
  if (prompts.has(key)) issues.push(`Duplicate prompt: "${q.question}" (${prompts.get(key)} + ${q.id})`);
  else prompts.set(key, q.id);
}

const fps = new Map();
for (const q of all) {
  const key = fingerprint(q);
  if (!key.startsWith('null')) {
    if (fps.has(key)) issues.push(`Duplicate fingerprint ${key}: ${fps.get(key)} + ${q.id}`);
    else fps.set(key, q.id);
  }
}

if (issues.length === 0) {
  console.log('OK: No issues found.');
  process.exit(0);
} else {
  console.log('Issues:');
  for (const i of issues) console.log(' - ' + i);
  process.exit(1);
}

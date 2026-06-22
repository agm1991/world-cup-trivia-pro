#!/usr/bin/env node
/**
 * Lists World Cup Bingo levels 1–202 that contain missing-player questions,
 * and which had the old text-only UI (non-XI prompts) before the pitch fix.
 * Run: node scripts/list-bingo-missing-player-levels.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const BINGO_SHUFFLE_SEED = 0xb1e60226;
const BINGO_QUESTIONS_PER_LEVEL = 10;
const TARGET = 202 * BINGO_QUESTIONS_PER_LEVEL;

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleDeterministic(items, seed) {
  const out = [...items];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function normalizeQuestionSeparators(s) {
  return s.replace(/\u2019/g, "'").replace(/\u2013/g, '\u2014').replace(/\u2014{2,}/g, '\u2014');
}

function parseOldXiOnly(question) {
  const raw = normalizeQuestionSeparators(question.trim());
  const triple = raw.split(/\s*—\s*/);
  if (triple.length < 3) return false;
  const rest = triple.slice(2).join(' — ');
  return /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:/is.test(rest);
}

function parseAnyMp(question) {
  const raw = normalizeQuestionSeparators(question.trim());
  const triple = raw.split(/\s*—\s*/);
  if (triple.length < 3) return false;
  return /___/.test(raw) || /\bXI\b/i.test(raw) || /\bthree\b/i.test(raw);
}

const mpPool = fs.readFileSync(path.join(root, 'src/data/missingPlayerQuestions.ts'), 'utf8');
const mpById = new Map();
for (const m of mpPool.matchAll(/id: '(mp-[^']+)'[\s\S]*?question:\s*\n\s*'([\s\S]*?)',/g)) {
  mpById.set(m[1], m[2].replace(/\s+/g, ' ').trim());
}

const sources = [
  ['worldCupQuestions', 350],
  ['guessWhoPhotoQuestions', null],
  ['guessWhoQuestions', 450],
  ['scorelineQuestions', null],
  ['managersQuestions', 280],
  ['stadiumsQuestions', 200],
  ['winnersQuestions', null],
  ['missingPlayerQuestions', 250],
  ['countryHistoryQuestions', 200],
];

const acc = [];
for (const [name, take] of sources) {
  const text = fs.readFileSync(path.join(root, `src/data/${name}.ts`), 'utf8');
  const matches = [...text.matchAll(/category:\s*'([^']+)'[\s\S]*?id:\s*'([^']+)'/g)];
  const slice = take != null ? matches.slice(0, take) : matches;
  for (const m of slice) acc.push({ category: m[1], id: m[2] });
}

const seen = new Set();
const deduped = [];
for (const q of acc) {
  const key = `${q.category}::${q.id}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(q);
}

const shuffled = shuffleDeterministic(deduped, BINGO_SHUFFLE_SEED);
const padded = [];
let i = 0;
while (padded.length < TARGET) {
  padded.push(shuffled[i % shuffled.length]);
  i++;
}

const anyMp = [];
const fixedLevels = [];
const detail = [];

for (let lv = 1; lv <= 202; lv++) {
  const qs = padded.slice((lv - 1) * BINGO_QUESTIONS_PER_LEVEL, lv * BINGO_QUESTIONS_PER_LEVEL);
  const mpRows = qs
    .map((q, qi) => ({ qi: qi + 1, ...q, text: mpById.get(q.id) ?? '' }))
    .filter((q) => q.category === 'missing-player');

  if (mpRows.length === 0) continue;
  anyMp.push(lv);

  const broken = mpRows.filter((r) => !parseOldXiOnly(r.text));
  if (broken.length > 0) {
    fixedLevels.push(lv);
    detail.push({
      level: lv,
      broken: broken.map((r) => `Q${r.qi} ${r.id}`),
    });
  }
}

console.log('=== World Cup Bingo: missing-player levels (1–202) ===\n');
console.log(`All levels with ≥1 missing-player question (${anyMp.length} levels):`);
console.log(anyMp.join(', '));
console.log(`\nLevels that had the OLD text-only screen — now pitch UI (${fixedLevels.length} levels):`);
console.log(fixedLevels.join(', '));
console.log('\n--- Per-level (old UI → pitch) ---');
for (const d of detail) {
  console.log(`Level ${d.level}: ${d.broken.join('; ')}`);
}

// Notable IDs from your screenshots
const lookup = ['mp-h-22', 'mp-m-14'];
console.log('\n--- Screenshot prompts ---');
for (const id of lookup) {
  for (let lv = 1; lv <= 202; lv++) {
    const qs = padded.slice((lv - 1) * BINGO_QUESTIONS_PER_LEVEL, lv * BINGO_QUESTIONS_PER_LEVEL);
    qs.forEach((q, qi) => {
      if (q.id === id) console.log(`${id} → Level ${lv}, Question ${qi + 1}`);
    });
  }
}

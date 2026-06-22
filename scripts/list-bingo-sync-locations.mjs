#!/usr/bin/env node
/**
 * Accurate World Cup Bingo level/question map (matches worldCupBingoQuestions.ts pool build).
 * Run: node scripts/list-bingo-sync-locations.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const data = path.join(root, 'src/data');

const BINGO_SHUFFLE_SEED = 0xb1e60226;
const BINGO_MAX_LEVELS = 204;
const BINGO_QUESTIONS_PER_LEVEL = 10;
const TARGET = BINGO_MAX_LEVELS * BINGO_QUESTIONS_PER_LEVEL;

const SYNCED_MP = new Set([
  'mp-e-19', 'mp-e-14', 'mp-e-17', 'mp-easy-025', 'mp-easy-028', 'mp-easy-031', 'mp-easy-032',
  'mp-easy-034', 'mp-easy-035', 'mp-easy-037', 'mp-easy-041', 'mp-easy-042', 'mp-easy-043',
  'mp-easy-047', 'mp-easy-049', 'mp-easy-055', 'mp-easy-061', 'mp-easy-065', 'mp-easy-073',
  'mp-easy-079', 'mp-easy-082', 'mp-easy-086', 'mp-easy-089', 'mp-easy-091', 'mp-easy-095',
  'mp-easy-097', 'mp-m-21', 'mp-m-23', 'mp-m-25', 'mp-m-26', 'mp-m-43',
]);

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

/** Parse one question object block (handles id before/after category, single or multiline). */
function parseQuestionBlock(block) {
  const id = block.match(/id:\s*'([^']+)'/)?.[1];
  const category = block.match(/category:\s*'([^']+)'/)?.[1];
  const qSingle = block.match(/question:\s*'((?:\\'|[^'])*)'/);
  const qMulti = block.match(/question:\s*\n\s*'([\s\S]*?)',/);
  const question = (qSingle?.[1] ?? qMulti?.[1])?.replace(/\\'/g, "'").replace(/\s+/g, ' ').trim();
  if (!id || !category || !question) return null;
  return { category, id, question };
}

/** Split TS question arrays into `{ ... }` blocks and parse in file order. */
function parseQuestionsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const out = [];
  for (const block of text.matchAll(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g)) {
    const q = parseQuestionBlock(block[0]);
    if (q && /^(world-cup|guess-who|guess-who-photo|guess-scoreline|managers|stadiums|world-cup-winners|missing-player|country-history)/.test(q.category)) {
      out.push(q);
    }
  }
  return out;
}

/** scorelineQuestions = inline array + ...scoreline2006And2010 spread */
function loadScorelineQuestions() {
  const main = parseQuestionsFromFile(path.join(data, 'scorelineQuestions.ts'));
  const spread = parseQuestionsFromFile(path.join(data, 'scorelineQuestions2006_2010.ts'));
  // Main file regex also picks spread file content if inlined — use only questions BEFORE spread marker
  const mainText = fs.readFileSync(path.join(data, 'scorelineQuestions.ts'), 'utf8');
  const spreadIdx = mainText.indexOf('...scoreline2006And2010');
  const beforeSpread = spreadIdx >= 0 ? mainText.slice(0, spreadIdx) : mainText;
  const inline = parseQuestionsFromFile(path.join(data, 'scorelineQuestions.ts')).filter((q) => {
    // Re-parse only inline portion (exclude spread file content parsed from imports)
    const idx = beforeSpread.indexOf(`id: '${q.id}'`);
    return idx >= 0;
  });
  return [...inline, ...spread];
}

function buildBingoPool() {
  const acc = [];
  const add = (arr, take) => {
    acc.push(...(take != null ? arr.slice(0, take) : arr));
  };

  add(parseQuestionsFromFile(path.join(data, 'worldCupQuestions.ts')), 350);
  add(parseQuestionsFromFile(path.join(data, 'guessWhoPhotoQuestions.ts')));
  add(parseQuestionsFromFile(path.join(data, 'guessWhoQuestions.ts')), 450);
  add(loadScorelineQuestions());
  add(parseQuestionsFromFile(path.join(data, 'managersQuestions.ts')), 280);
  add(parseQuestionsFromFile(path.join(data, 'stadiumsQuestions.ts')), 200);
  add(parseQuestionsFromFile(path.join(data, 'winnersQuestions.ts')));
  add(parseQuestionsFromFile(path.join(data, 'missingPlayerQuestions.ts')), 250);
  add(parseQuestionsFromFile(path.join(data, 'countryHistoryQuestions.ts')), 200);

  const seen = new Set();
  const deduped = [];
  for (const q of acc) {
    const key = `${q.category}::${q.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(q);
  }

  const shuffled = shuffleDeterministic(deduped, BINGO_SHUFFLE_SEED);
  if (shuffled.length >= TARGET) return shuffled.slice(0, TARGET);
  const out = [];
  let i = 0;
  while (out.length < TARGET) {
    out.push(shuffled[i % shuffled.length]);
    i++;
  }
  return out;
}

const pool = buildBingoPool();

// Verify level 6 against user screenshot
console.log('=== World Cup Bingo Level 6 (verify) ===');
pool.slice(50, 60).forEach((q, i) => {
  console.log(`Question ${i + 1}: [${q.category}] ${q.question.slice(0, 80)}`);
});

console.log('\n=== Synced missing-player edits (green pitch only) ===');
const hits = [];
pool.forEach((q, i) => {
  if (q.category !== 'missing-player' || !SYNCED_MP.has(q.id)) return;
  const level = Math.floor(i / BINGO_QUESTIONS_PER_LEVEL) + 1;
  const qNum = (i % BINGO_QUESTIONS_PER_LEVEL) + 1;
  hits.push({ level, qNum, id: q.id, question: q.question });
});

hits.sort((a, b) => a.level - b.level || a.qNum - b.qNum);
for (const h of hits) {
  const snippet = h.question.match(/\d{4}[^—]*—\s*([^—]+)—/)?.[1]?.trim() ?? h.question.slice(0, 55);
  console.log(`Bingo Level ${h.level} Question ${h.qNum} — ${snippet}`);
}

console.log(`\nTotal synced missing-player spots in Bingo: ${hits.length}`);
console.log(`Total pool questions parsed: ${pool.length}`);

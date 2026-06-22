#!/usr/bin/env node
/**
 * Reports World Cup Bingo missing-player rows with empty vs full pitch (levels 1–202).
 * Run: node scripts/audit-bingo-pitch-coverage.mjs
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

// --- minimal copies of parser + resolve heuristics (keep in sync with src) ---
function normalizeQuestionSeparators(s) {
  return s.replace(/\u2019/g, "'").replace(/\u2013/g, '\u2014').replace(/\u2014{2,}/g, '\u2014');
}

function isMissingToken(s) {
  return /___|---|\?\?\?/.test(s);
}

function expandSlotsFromXiBody(body) {
  const segments = body.split(';').map((x) => x.trim()).filter(Boolean);
  const out = [];
  for (const seg of segments) {
    for (const part of seg.split(',').map((p) => p.trim())) {
      if (!part) continue;
      const cleaned = part.replace(/\?+$/, '').trim();
      out.push({ isMissing: isMissingToken(part) || isMissingToken(cleaned) });
    }
  }
  return out;
}

function parseMissingPlayerPromptForBingo(question) {
  const raw = normalizeQuestionSeparators(question.trim());
  const triple = raw.split(/\s*—\s*/);
  if (triple.length < 3) return null;
  const restJoined = triple.slice(2).join(' — ');
  const xi =
    /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:\s*(.+)$/is.exec(restJoined) ??
    /^(.+?)\s+XI\s*:\s*(.+)$/is.exec(restJoined);
  if (xi) {
    const slots = expandSlotsFromXiBody(xi[2]);
    if (slots.length > 0) return { slots };
  }
  if (/___/.test(restJoined)) return { slots: [{ isMissing: true }] };
  return null;
}

function getCorrectAnswerNames(q) {
  const text =
    q.correctAnswer === 'A'
      ? q.optionA
      : q.correctAnswer === 'B'
        ? q.optionB
        : q.correctAnswer === 'C'
          ? q.optionC
          : q.optionD;
  if (!text) return [];
  return text
    .split(/\s*[·&]\s*|\s*,\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function foldName(s) {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

function playerNameMatches(displayName, answerName) {
  const a = foldName(answerName);
  const d = foldName(displayName);
  if (!a || !d) return false;
  if (d.includes(a) || a.includes(d)) return true;
  const surname = (n) => {
    const p = foldName(n).split(/\s+/);
    return p[p.length - 1] ?? foldName(n);
  };
  return surname(d) === surname(a);
}

const mpText = fs.readFileSync(path.join(root, 'src/data/missingPlayerQuestions.ts'), 'utf8');
const mpById = new Map();
const mpMeta = new Map();
for (const m of mpText.matchAll(
  /id: '(mp-[^']+)'[\s\S]*?question:\s*\n\s*'([\s\S]*?)',[\s\S]*?correctAnswer: '([ABCD])',[\s\S]*?optionA: '([^']*)'/g,
)) {
  mpById.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  mpMeta.set(m[1], { correctAnswer: m[3], optionA: m[4] });
}

// Load lineup defs from medium files + supplements (displayName only)
const lineupDefs = [];
for (const rel of fs.readdirSync(path.join(root, 'src/data/mediumLineups'))) {
  if (!rel.endsWith('.ts')) continue;
  const text = fs.readFileSync(path.join(root, `src/data/mediumLineups/${rel}`), 'utf8');
  for (const block of text.matchAll(
    /id: '(level-[^']+)'[\s\S]*?year: (\d+),[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
  )) {
    const names = [...block[6].matchAll(/displayName: '([^']+)'/g)].map((x) => x[1]);
    lineupDefs.push({
      id: block[1],
      year: +block[2],
      team1: block[3],
      team2: block[4],
      focusTeam: block[5],
      names,
    });
  }
}
const supText = fs.readFileSync(
  path.join(root, 'src/data/bingoMissingPlayerLineupSupplements.ts'),
  'utf8',
);
for (const block of supText.matchAll(
  /id: '(bingo-sup-[^']+)'[\s\S]*?year: (\d+),[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
)) {
  const names = [...block[6].matchAll(/displayName: '([^']+)'/g)].map((x) => x[1]);
  lineupDefs.push({
    id: block[1],
    year: +block[2],
    team1: block[3],
    team2: block[4],
    focusTeam: block[5],
    names,
  });
}

const OVERRIDES = {
  'mp-easy-022': 'bingo-sup-ger-bra-2002-final',
  'mp-easy-024': 'bingo-sup-ger-bra-2002-final',
  'mp-easy-023': 'level-19-match-7',
  'mp-easy-059': 'level-19-match-7',
  'mp-m-15': 'bingo-sup-ita-spa-1994-qf',
};

function teamsMatch(def, t1, t2) {
  const n = (s) => s.trim().toLowerCase();
  const a = n(def.team1);
  const b = n(def.team2);
  const x = n(t1);
  const y = n(t2);
  return (a === x && b === y) || (a === y && b === x);
}

function wouldResolvePitch(mpId, questionText) {
  const parsed = parseMissingPlayerPromptForBingo(questionText);
  if (!parsed) return { kind: 'no-parse', count: 0 };

  if (parsed.slots.length === 11) return { kind: 'xi-fallback', count: 11 };

  const meta = mpMeta.get(mpId);
  const answers = meta
    ? getCorrectAnswerNames({ correctAnswer: meta.correctAnswer, optionA: meta.optionA })
    : [];

  const overrideId = OVERRIDES[mpId];
  if (overrideId) {
    const def = lineupDefs.find((d) => d.id === overrideId);
    if (def && def.names.length === 11) return { kind: 'override', count: 11 };
  }

  const parts = questionText.split(/\s*—\s*/)[1]?.split(/\s+vs\s+/i) ?? [];
  const year = +(questionText.match(/(\d{4})/)?.[1] ?? 0);
  const focus = parts[0]?.trim().toLowerCase();
  const pool = lineupDefs.filter(
    (d) => d.year === year && teamsMatch(d, parts[0] ?? '', parts[1] ?? ''),
  );
  const candidates = pool.filter((d) => d.focusTeam.toLowerCase() === focus);
  const search = candidates.length ? candidates : pool;

  let best = null;
  let bestScore = -1;
  for (const def of search) {
    const score = answers.filter((a) => def.names.some((n) => playerNameMatches(n, a))).length;
    if (score > bestScore) {
      bestScore = score;
      best = def;
    }
  }
  if (best && bestScore >= 1 && best.names.length === 11) return { kind: 'catalog', count: 11 };

  return { kind: 'empty', count: 0 };
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

const padded = [];
const shuffled = shuffleDeterministic(deduped, BINGO_SHUFFLE_SEED);
let i = 0;
while (padded.length < TARGET) {
  padded.push(shuffled[i % shuffled.length]);
  i++;
}

const empty = [];
const full = [];

for (let lv = 1; lv <= 202; lv++) {
  const qs = padded.slice((lv - 1) * BINGO_QUESTIONS_PER_LEVEL, lv * BINGO_QUESTIONS_PER_LEVEL);
  qs.forEach((q, qi) => {
    if (q.category !== 'missing-player') return;
    const text = mpById.get(q.id) ?? '';
    const res = wouldResolvePitch(q.id, text);
    const label = `Level ${lv} · Question ${qi + 1}`;
    if (res.count === 11) full.push(label);
    else empty.push({ label, mpId: q.id, kind: res.kind });
  });
}

console.log(`Full pitch (11 players): ${full.length}`);
console.log(`Empty / broken pitch: ${empty.length}\n`);
if (empty.length) {
  console.log('--- Still empty ---');
  for (const e of empty) console.log(`${e.label} (${e.mpId}, ${e.kind})`);
}

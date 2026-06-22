#!/usr/bin/env node
/**
 * Audits World Cup Bingo missing-player prompts (levels 1–202).
 * Run: node scripts/audit-bingo-missing-player-lineups.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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

function inferTeamFromRest(rest, matchup) {
  const m1 =
    /^([A-Za-z][A-Za-z\s.'-]+?)\s+three:/i.exec(rest) ??
    /^([A-Za-z][A-Za-z\s.'-]+?)\s+XI\b/i.exec(rest);
  if (m1) return m1[1].trim();
  const m2 =
    /^([A-Za-z][A-Za-z\s.'-]+?)\s+missing\b/i.exec(rest) ??
    /^Missing\s+([A-Za-z][A-Za-z\s.'-]+?)(?:'s|'s)?\s/i.exec(rest);
  if (m2) return m2[1].trim();
  const m3 = /^([A-Za-z][A-Za-z\s.'-]+?):\s*(?:RW|LW|CB|AM|CM|DM|SW|ST|DF|MF|FW)/i.exec(rest);
  if (m3) return m3[1].trim();
  const m4 = /^([A-Za-z][A-Za-z\s.'-]+?)(?:'s|'s)\s+/i.exec(rest);
  if (m4) return m4[1].trim();
  const m5 = /^([A-Za-z][A-Za-z\s.'-]+?)\s+box-to-box/i.exec(rest);
  if (m5) return m5[1].trim();
  if (/miracle of bern|west germany/i.test(rest)) {
    const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
    return /germany/i.test(parts[0] ?? '') ? parts[0] : parts[1] ?? 'West Germany';
  }
  return null;
}

function parseMissingPlayerPromptForBingo(question) {
  const raw = normalizeQuestionSeparators(question.trim());
  if (!raw) return null;
  const triple = raw.split(/\s*—\s*/);
  if (triple.length < 3) return null;
  const matchup = triple[1].trim();
  const restJoined = triple.slice(2).join(' — ');

  const xi =
    /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:\s*(.+)$/is.exec(restJoined) ??
    /^(.+?)\s+XI\s*:\s*(.+)$/is.exec(restJoined);
  if (xi && expandSlotsFromXiBody(xi[2]).length > 0) return { team: xi[1].trim() };

  const dashIdx = restJoined.indexOf(' — ');
  if (dashIdx >= 0) {
    const body = restJoined.slice(dashIdx + 3).trim();
    if (body.includes(';') && expandSlotsFromXiBody(body).length > 0) {
      const prefix = restJoined.slice(0, dashIdx).trim();
      const team = inferTeamFromRest(prefix, matchup) ?? matchup.split(/\s+vs\s+/i)[0]?.trim();
      if (team) return { team };
    }
  }

  const team = inferTeamFromRest(restJoined, matchup) ?? matchup.split(/\s+vs\s+/i)[0]?.trim();
  if (!team) return null;
  if (/___/.test(restJoined)) return { team };
  return null;
}

const BINGO_MAX_LEVELS = 204;
const BINGO_QUESTIONS_PER_LEVEL = 10;
const BINGO_SHUFFLE_SEED = 0xb1e60226;

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

const mpPool = fs.readFileSync(path.join(root, 'src/data/missingPlayerQuestions.ts'), 'utf8');
const mpById = new Map();
for (const m of mpPool.matchAll(/id: '(mp-[^']+)'[\s\S]*?question:\s*\n\s*'([\s\S]*?)',/g)) {
  mpById.set(m[1], m[2].replace(/\s+/g, ' ').trim());
}

const sources = [
  'worldCupQuestions',
  'guessWhoPhotoQuestions',
  'guessWhoQuestions',
  'scorelineQuestions',
  'managersQuestions',
  'stadiumsQuestions',
  'winnersQuestions',
  'missingPlayerQuestions',
  'countryHistoryQuestions',
];
const acc = [];
for (const name of sources) {
  const text = fs.readFileSync(path.join(root, `src/data/${name}.ts`), 'utf8');
  for (const m of text.matchAll(/category:\s*'([^']+)'[\s\S]*?id:\s*'([^']+)'[\s\S]*?question:\s*\n\s*'([\s\S]*?)',/g)) {
    acc.push({ category: m[1], id: m[2], question: m[3].replace(/\s+/g, ' ').trim() });
  }
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
const bingoPool = shuffled.slice(0, BINGO_MAX_LEVELS * BINGO_QUESTIONS_PER_LEVEL);

const failures = [];
let mpCount = 0;

for (const q of bingoPool.slice(0, 202 * BINGO_QUESTIONS_PER_LEVEL)) {
  if (q.category !== 'missing-player') continue;
  mpCount++;
  const text = mpById.get(q.id) ?? q.question;
  if (!parseMissingPlayerPromptForBingo(text)) {
    failures.push(q.id);
  }
}

if (failures.length === 0) {
  console.log(`OK: ${mpCount} bingo missing-player rows in levels 1–202 parse for pitch UI.`);
  process.exit(0);
}

console.error(`FAIL: ${failures.length}/${mpCount} missing-player bingo rows won't render pitch UI:`);
failures.slice(0, 25).forEach((id) => console.error(`  ${id}`));
process.exit(1);

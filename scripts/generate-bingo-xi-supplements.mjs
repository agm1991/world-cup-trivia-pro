#!/usr/bin/env node
/**
 * Generates curated pitch supplements for World Cup Bingo XI-format rows.
 * Run: node scripts/generate-bingo-xi-supplements.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const BINGO_SHUFFLE_SEED = 0xb1e60226;
const BINGO_QUESTIONS_PER_LEVEL = 10;
const TARGET = 202 * BINGO_QUESTIONS_PER_LEVEL;

const BASE_OVERRIDES = {
  'mp-e-14': 'level-10-match-2',
  'mp-e-17': 'level-8-match-9',
  'mp-e-19': 'bingo-verified-mp-sync-mp-e-19',
  'mp-easy-021': 'level-19-match-6',
  'mp-easy-022': 'bingo-sup-ger-bra-2002-final',
  'mp-easy-023': 'level-19-match-7',
  'mp-easy-024': 'bingo-sup-ger-bra-2002-final',
  'mp-easy-025': 'bingo-verified-mp-sync-mp-easy-025',
  'mp-easy-028': 'bingo-verified-mp-sync-mp-easy-028',
  'mp-easy-031': 'bingo-verified-mp-sync-mp-easy-031',
  'mp-easy-032': 'level-8-match-3',
  'mp-easy-034': 'bingo-verified-mp-sync-mp-easy-034',
  'mp-easy-035': 'bingo-verified-mp-sync-mp-easy-035',
  'mp-easy-036': 'bingo-verified-1998-final-bra-fra-bra-dunga',
  'mp-easy-037': 'bingo-verified-mp-sync-mp-easy-037',
  'mp-easy-041': 'level-8-match-7',
  'mp-easy-042': 'level-8-match-7',
  'mp-easy-043': 'bingo-verified-mp-sync-mp-easy-043',
  'mp-easy-047': 'level-8-match-10',
  'mp-easy-049': 'bingo-verified-mp-sync-mp-easy-049',
  'mp-easy-055': 'level-9-match-1',
  'mp-easy-059': 'level-19-match-7',
  'mp-easy-060': 'bingo-verified-2014-final-ger-arg-ger-sweini',
  'mp-easy-065': 'level-10-match-3',
  'mp-easy-073': 'level-8-match-5',
  'mp-easy-079': 'level-8-match-6',
  'mp-easy-082': 'bingo-verified-mp-sync-mp-easy-082',
  'mp-easy-086': 'bingo-verified-mp-sync-mp-easy-086',
  'mp-easy-089': 'level-9-match-7',
  'mp-easy-091': 'level-9-match-6',
  'mp-easy-095': 'level-9-match-10',
  'mp-easy-097': 'level-10-match-9',
  'mp-h-01': 'level-26-match-4',
  'mp-h-02': 'level-26-match-3',
  'mp-h-03': 'level-16-match-2',
  'mp-h-04': 'level-19-match-2',
  'mp-h-05': 'level-16-match-3',
  'mp-h-09': 'level-16-match-2',
  'mp-h-10': 'level-22-match-7',
  'mp-h-11': 'bingo-sup-bra-fra-1986',
  'mp-h-12': 'level-19-match-3',
  'mp-h-16': 'level-26-match-4',
  'mp-h-17': 'level-26-match-3',
  'mp-h-18': 'level-16-match-2',
  'mp-h-19': 'level-19-match-2',
  'mp-h-22': 'bingo-sup-arg-eng-2002',
  'mp-h-26': 'level-20-match-4',
  'mp-h-30': 'level-16-match-7',
  'mp-m-06': 'level-19-match-8',
  'mp-m-07': 'bingo-sup-france-2006-final',
  'mp-m-10': 'level-19-match-1',
  'mp-m-11': 'level-16-match-4',
  'mp-m-14': 'bingo-sup-uru-ned-2010',
  'mp-m-15': 'bingo-sup-ita-spa-1994-qf',
  'mp-m-16': 'level-22-match-1',
  'mp-m-18': 'level-27-match-1',
  'mp-m-21': 'level-8-match-8',
  'mp-m-23': 'bingo-verified-mp-sync-mp-m-23',
  'mp-m-25': 'level-9-match-3',
  'mp-m-26': 'level-8-match-4',
  'mp-m-34': 'bingo-sup-eng-fra-2022-qf-eng',
  'mp-m-35': 'bingo-sup-eng-fra-2022-qf-fra',
  'mp-m-43': 'level-9-match-4',
};

const MANUAL_OVERRIDE_IDS = new Set([
  'mp-m-34',
  'mp-m-35',
  'mp-easy-036',
  'mp-easy-060',
  'bingo-sup-eng-fra-2022-qf-eng',
  'bingo-sup-eng-fra-2022-qf-fra',
  ...Object.keys(BASE_OVERRIDES),
]);

const SEMICOLON_LINE_Y = {
  4: [90, 74, 52, 20],
  5: [90, 74, 54, 42, 22],
  6: [90, 74, 54, 44, 32, 18],
};

function xCoordsForLine(playerCount, lineIndex, lineCount) {
  if (playerCount === 1) return [50];
  if (playerCount === 2) return [42, 58];
  if (playerCount === 3) {
    if (lineIndex === lineCount - 1) return [78, 50, 22];
    return [30, 50, 70];
  }
  if (playerCount === 4) return [82, 65, 35, 18];
  if (playerCount === 5) return [85, 68, 50, 32, 15];
  return Array.from({ length: playerCount }, (_, i) =>
    playerCount === 1 ? 50 : 18 + (64 * i) / (playerCount - 1),
  );
}

function buildSemicolonLineCoords(body) {
  let cleanBody = body.trim();
  const paren = /\(([^)]+)\)\s*$/.exec(cleanBody);
  if (paren && paren.index != null) cleanBody = cleanBody.slice(0, paren.index).trim();

  const lines = cleanBody.split(';').map((line) => line.trim()).filter(Boolean);
  if (lines.length < 4) return [];

  const counts = lines.map((line) => line.split(',').map((p) => p.trim()).filter(Boolean).length);
  const countKey = counts.join(',');

  // 4-2-3-1 (1-4-2-4 in question text: pivot pair then three + striker)
  if (countKey === '1,4,2,4') {
    return [
      { x: 50, y: 90 },
      { x: 82, y: 74 },
      { x: 65, y: 74 },
      { x: 35, y: 74 },
      { x: 18, y: 74 },
      { x: 42, y: 54 },
      { x: 58, y: 54 },
      { x: 78, y: 28 },
      { x: 50, y: 36 },
      { x: 22, y: 28 },
      { x: 50, y: 16 },
    ];
  }

  // 3-4-3 (1-3-4-3)
  if (countKey === '1,3,4,3') {
    return [
      { x: 50, y: 90 },
      { x: 30, y: 74 },
      { x: 50, y: 74 },
      { x: 70, y: 74 },
      { x: 82, y: 52 },
      { x: 65, y: 52 },
      { x: 35, y: 52 },
      { x: 18, y: 52 },
      { x: 78, y: 20 },
      { x: 50, y: 20 },
      { x: 22, y: 20 },
    ];
  }

  // 4-3-1-2 (1-4-3-1-2)
  if (countKey === '1,4,3,1,2') {
    return [
      { x: 50, y: 90 },
      { x: 82, y: 74 },
      { x: 65, y: 74 },
      { x: 35, y: 74 },
      { x: 18, y: 74 },
      { x: 30, y: 54 },
      { x: 50, y: 54 },
      { x: 70, y: 54 },
      { x: 50, y: 42 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
    ];
  }

  // 3-5-2 (1-3-5-2)
  if (countKey === '1,3,5,2') {
    return [
      { x: 50, y: 90 },
      { x: 30, y: 74 },
      { x: 50, y: 74 },
      { x: 70, y: 74 },
      { x: 82, y: 52 },
      { x: 65, y: 54 },
      { x: 50, y: 52 },
      { x: 35, y: 54 },
      { x: 18, y: 52 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
    ];
  }

  const yValues =
    SEMICOLON_LINE_Y[lines.length] ?? lines.map((_, i) => Math.max(18, 90 - i * 14));
  const coords = [];

  lines.forEach((line, lineIndex) => {
    const parts = line.split(',').map((part) => part.trim()).filter(Boolean);
    const xs = xCoordsForLine(parts.length, lineIndex, lines.length);
    parts.forEach((_, i) => {
      coords.push({ x: xs[i] ?? 50, y: yValues[lineIndex] ?? 50 });
    });
  });

  return coords.length === 11 ? coords : [];
}

function fillXiNames(rawParts, answers) {
  let missingIdx = 0;
  return rawParts.map((part) => {
    if (/___/.test(part)) {
      return answers[missingIdx++] ?? 'Missing';
    }
    return cleanLabel(part);
  });
}

function findVerifiedPool(parsed, verifiedDefs) {
  const focusPool = verifiedDefs.filter(
    (d) =>
      d.year === parsed.year &&
      teamsMatch(d, parsed.team1, parsed.team2) &&
      fold(d.focusTeam) === fold(parsed.focusTeam),
  );
  if (focusPool.length > 0) return focusPool;
  return verifiedDefs.filter(
    (d) => d.year === parsed.year && teamsMatch(d, parsed.team1, parsed.team2),
  );
}

function scoreVerifiedDef(def, allNames, answers) {
  const nameHits = allNames.filter((n) => def.slots.some((s) => nameMatch(s.displayName, n))).length;
  const answerHits = answers.filter((n) => def.slots.some((s) => nameMatch(s.displayName, n))).length;
  const verifiedBonus = def.id.startsWith('bingo-verified-') ? 3 : def.id.startsWith('bingo-sup-') ? 2 : 0;
  return nameHits * 10 + answerHits * 5 + verifiedBonus;
}

function buildSlotsFromVerified(def, rawParts, answers, semicolonCoords) {
  const allNames = fillXiNames(rawParts, answers);
  let missingIdx = 0;
  const targetKeys = [];
  const slots = rawParts.map((part, idx) => {
    const missing = /___/.test(part);
    const displayName = allNames[idx];
    const matched = def.slots.find((s) => nameMatch(s.displayName, displayName));
    const fallback = semicolonCoords[idx] ?? { x: 50, y: 50 };
    const key = matched?.key ?? slotKey(displayName, idx);
    if (missing) targetKeys.push(key);
    return {
      key,
      displayName,
      x: matched?.x ?? fallback.x,
      y: matched?.y ?? fallback.y,
    };
  });
  return { slots, targetKeys };
}

function fold(s) {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

function nameMatch(a, b) {
  const x = fold(a);
  const y = fold(b);
  if (!x || !y) return false;
  if (x.includes(y) || y.includes(x)) return true;
  const surname = (n) => {
    const p = fold(n).split(/\s+/);
    return p[p.length - 1] ?? fold(n);
  };
  const sa = surname(a);
  const sb = surname(b);
  if (sa === sb) return true;
  if (sa.length >= 4 && sb.length >= 4 && (sa.startsWith(sb.slice(0, 4)) || sb.startsWith(sa.slice(0, 4)))) {
    return true;
  }
  return false;
}

function teamsMatch(def, t1, t2) {
  const n = (s) => s.trim().toLowerCase();
  return (
    (n(def.team1) === n(t1) && n(def.team2) === n(t2)) ||
    (n(def.team1) === n(t2) && n(def.team2) === n(t1))
  );
}

function parseQuoted(block, field) {
  const re = new RegExp(`${field}:\\s*'((?:\\\\'|[^'])*)'`);
  return block.match(re)?.[1]?.replace(/\\'/g, "'") ?? '';
}

function loadDefs() {
  const defs = [];
  const slotPat = /\{ key: '([^']+)', displayName: '((?:\\'|[^'])*)', x: (\d+), y: (\d+) \}/g;
  const load = (filePath, idPat) => {
    const text = fs.readFileSync(filePath, 'utf8');
    for (const block of text.matchAll(idPat)) {
      const slots = [...block[7].matchAll(slotPat)].map((m) => ({
        key: m[1],
        displayName: m[2].replace(/\\'/g, "'"),
        x: +m[3],
        y: +m[4],
      }));
      defs.push({
        id: block[1],
        year: +block[2],
        stage: block[3],
        team1: block[4],
        team2: block[5],
        focusTeam: block[6],
        slots,
        names: slots.map((s) => s.displayName),
        verified: !block[1].startsWith('bingo-auto-'),
      });
    }
  };

  load(
    path.join(root, 'src/data/missingPlayerLineupLevels7to17.ts'),
    /id: '(level-[0-9]+-match-[0-9]+)'[\s\S]*?year: (\d+),[\s\S]*?stage: '([^']+)'[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
  );

  for (const rel of [
    'missingPlayerLineupLevels7.frozen.ts',
    'missingPlayerLineupLevels8.frozen.ts',
    'missingPlayerLineupLevels9.frozen.ts',
    'missingPlayerLineupLevels10.frozen.ts',
    'missingPlayerLineupLevels11.frozen.ts',
    'missingPlayerLineupLevels12.frozen.ts',
    'missingPlayerLineupLevels13.frozen.ts',
    'missingPlayerLineupLevels14.frozen.ts',
    'missingPlayerLineupLevels15.frozen.ts',
    'missingPlayerLineupLevels16.frozen.ts',
    'missingPlayerLineupLevels17.frozen.ts',
  ]) {
    load(
      path.join(root, 'src/data', rel),
      /id: '(level-[0-9]+-match-[0-9]+)'[\s\S]*?year: (\d+),[\s\S]*?stage: '([^']+)'[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
    );
  }

  for (const rel of fs.readdirSync(path.join(root, 'src/data/mediumLineups'))) {
    if (!rel.endsWith('.ts')) continue;
    load(
      path.join(root, 'src/data/mediumLineups', rel),
      /id: '(level-[^']+)'[\s\S]*?year: (\d+),[\s\S]*?stage: '([^']+)'[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
    );
  }

  load(
    path.join(root, 'src/data/bingoMissingPlayerLineupSupplements.ts'),
    /id: '(bingo-sup-[^']+)'[\s\S]*?year: (\d+),[\s\S]*?stage: '([^']+)'[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
  );

  load(
    path.join(root, 'src/data/bingoMissingPlayerLineupVerifiedFixtures.ts'),
    /id: '(bingo-verified-[^']+)'[\s\S]*?year: (\d+),[\s\S]*?stage: '([^']+)'[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g,
  );

  return defs;
}

function parseMpQuestions() {
  const text = fs.readFileSync(path.join(root, 'src/data/missingPlayerQuestions.ts'), 'utf8');
  const blocks = text.split(/\n  \{\n    id: '/).slice(1);
  const out = new Map();

  for (const block of blocks) {
    const id = block.match(/^([^']+)'/)?.[1];
    if (!id?.startsWith('mp-')) continue;

    const qMatch = block.match(/question:\s*\n\s*'([\s\S]*?)',/);
    const ca = block.match(/correctAnswer: '([ABCD])'/)?.[1];
    const oA = parseQuoted(block, 'optionA');
    const oB = parseQuoted(block, 'optionB');
    const oC = parseQuoted(block, 'optionC');
    const oD = parseQuoted(block, 'optionD');
    const h1 = parseQuoted(block, 'hint1');
    const h2 = parseQuoted(block, 'hint2');
    const h3 = parseQuoted(block, 'hint3');
    if (!qMatch || !ca) continue;

    out.set(id, {
      id,
      question: qMatch[1].replace(/\s+/g, ' ').trim(),
      correctAnswer: ca,
      optionA: oA ?? '',
      optionB: oB ?? '',
      optionC: oC ?? '',
      optionD: oD ?? '',
      hint1: h1 ?? '',
      hint2: h2 ?? '',
      hint3: h3 ?? '',
    });
  }
  return out;
}

function parseXi(q) {
  const triple = q.split(/\s*—\s*/);
  if (triple.length < 3) return null;
  const rest = triple.slice(2).join(' — ');
  const xi =
    /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:\s*(.+)$/is.exec(rest) ??
    /^(.+?)\s+XI\s*:\s*(.+)$/is.exec(rest);
  if (!xi) return null;

  let body = xi[2].trim();
  let footnote = null;
  const paren = /\(([^)]+)\)\s*$/.exec(body);
  if (paren && paren.index != null) {
    footnote = paren[1].trim();
    body = body.slice(0, paren.index).trim();
  }

  const rawParts = body.split(';').flatMap((s) => s.split(',').map((p) => p.trim())).filter(Boolean);
  if (rawParts.length !== 11) return null;

  const stageMatch = triple[0].match(
    /Quarter-Final|Semi-Final|Final|Round of 16|Group Stage|Group [A-Z]/i,
  );
  const stage = stageMatch?.[0] ?? 'Match';
  const parts = triple[1].split(/\s+vs\s+/i).map((s) => s.trim());

  return {
    event: triple[0].trim(),
    matchup: triple[1].trim(),
    team1: parts[0] ?? '',
    team2: parts[1] ?? '',
    focusTeam: xi[1].trim(),
    year: +(q.match(/(\d{4})/)?.[1] ?? 0),
    stage,
    body,
    footnote,
    rawParts,
  };
}

function getAnswers(meta) {
  const text = meta[`option${meta.correctAnswer}`] ?? meta.optionA;
  return text
    .split(/\s*[·&]\s*|\s*,\s*|\s+and\s+/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function slotKey(name, i) {
  const base = fold(name)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24);
  return base || `slot_${i}`;
}

function cleanLabel(part) {
  return part.replace(/\?+$/, '').replace(/___/g, '').trim() || '???';
}

function isMissingToken(part) {
  return /___|---|\?\?\?/.test(part) || /\?$/.test(part.replace(/\?+$/, '') && false);
}

function scoreDef(def, answers, visible) {
  const a = answers.filter((n) => def.names.some((d) => nameMatch(d, n))).length;
  const v = visible.filter((n) => def.names.some((d) => nameMatch(d, n))).length;
  return Math.max(a >= 1 ? a + 100 : 0, v >= 6 ? v : 0);
}

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

const defs = loadDefs();
const verifiedDefs = defs.filter((d) => d.verified !== false);
const questions = parseMpQuestions();

const sources = [
  ['worldCupQuestions', 350],
  ['guessWhoPhotoQuestions', null],
  ['guessWhoQuestions', 450],
  ['scorelineQuestions', null],
  ['managersQuestions', 280],
  ['stadiumsQuestions', 200],
  ['winnersQuestions', null],
  ['missingPlayerQuestions', 250],
  ['genericCountryQuestions', 200],
];

const acc = [];
for (const [name, take] of sources) {
  const fileName = name === 'genericCountryQuestions' ? 'countryHistoryQuestions' : name;
  const text = fs.readFileSync(path.join(root, `src/data/${fileName}.ts`), 'utf8');
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

const existingOverrides = { ...BASE_OVERRIDES };

const xiRows = [];
for (let lv = 1; lv <= 202; lv++) {
  const qs = padded.slice((lv - 1) * BINGO_QUESTIONS_PER_LEVEL, lv * BINGO_QUESTIONS_PER_LEVEL);
  qs.forEach((q, qi) => {
    if (q.category !== 'missing-player') return;
    const meta = questions.get(q.id);
    if (!meta) return;
    const parsed = parseXi(meta.question);
    if (!parsed) return;
    xiRows.push({ lv, qi: qi + 1, meta, parsed });
  });
}

const generated = [];
const overrides = { ...existingOverrides };
const usedIds = new Set(Object.values(existingOverrides));
const processedMp = new Set();
let directVerified = 0;
let clonedVerified = 0;

for (const row of xiRows) {
  const { meta, parsed } = row;
  const id = meta.id;
  if (processedMp.has(id)) {
    if (overrides[id]) continue;
  }
  processedMp.add(id);

  if (MANUAL_OVERRIDE_IDS.has(id) && existingOverrides[id]) continue;

  const answers = getAnswers(meta);
  const visible = parsed.rawParts
    .filter((p) => !/___/.test(p))
    .map((p) => cleanLabel(p))
    .filter(Boolean);
  const allNames = fillXiNames(parsed.rawParts, answers);
  const semicolonCoords = buildSemicolonLineCoords(parsed.body);
  if (semicolonCoords.length !== 11) continue;

  const pool = findVerifiedPool(parsed, verifiedDefs);
  let best = null;
  let bestScore = -1;
  for (const d of pool) {
    const score = scoreVerifiedDef(d, allNames, answers);
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }

  if (best && !MANUAL_OVERRIDE_IDS.has(best.id)) {
    const answerMatch = answers.filter((n) => best.slots.some((s) => nameMatch(s.displayName, n))).length;
    const nameMatchCount = allNames.filter((n) => best.slots.some((s) => nameMatch(s.displayName, n))).length;
    if (answerMatch >= answers.length && answers.length > 0 && nameMatchCount >= 10) {
      overrides[id] = best.id;
      directVerified++;
      continue;
    }
    if (answerMatch >= answers.length && nameMatchCount >= 8) {
      overrides[id] = best.id;
      directVerified++;
      continue;
    }
  }

  if (best && bestScore >= 70) {
    const { slots, targetKeys } = buildSlotsFromVerified(best, parsed.rawParts, answers, semicolonCoords);
    const genId = `bingo-auto-${id.replace(/[^a-z0-9]+/gi, '-')}`;
    if (!usedIds.has(genId)) {
      usedIds.add(genId);
      const tp =
        targetKeys.length >= 3
          ? targetKeys.slice(0, 3)
          : targetKeys.length >= 2
            ? targetKeys.slice(0, 2)
            : targetKeys.length === 1
              ? [targetKeys[0], targetKeys[0]]
              : ['missing_a', 'missing_b'];
      generated.push({
        id: genId,
        year: parsed.year,
        stage: parsed.stage,
        team1: parsed.team1,
        team2: parsed.team2,
        focusTeam: parsed.focusTeam,
        targetPlayers: tp,
        slots,
        optionA: meta.optionA,
        optionB: meta.optionB,
        optionC: meta.optionC,
        optionD: meta.optionD,
        correctAnswer: meta.correctAnswer,
        hint1: meta.hint1,
        hint2: meta.hint2,
        hint3: meta.hint3,
      });
      clonedVerified++;
    }
    overrides[id] = genId;
    continue;
  }

  const genId = `bingo-auto-${id.replace(/[^a-z0-9]+/gi, '-')}`;
  if (usedIds.has(genId)) {
    overrides[id] = genId;
    continue;
  }
  usedIds.add(genId);

  let missingIdx = 0;
  const targetKeys = [];
  const slots = parsed.rawParts.map((part, idx) => {
    const missing = /___/.test(part);
    let displayName = cleanLabel(part);
    if (missing) {
      displayName = answers[missingIdx] ?? `Missing ${missingIdx + 1}`;
      missingIdx++;
    }
    const key = slotKey(displayName, idx);
    if (missing) targetKeys.push(key);
    return {
      key,
      displayName,
      x: semicolonCoords[idx].x,
      y: semicolonCoords[idx].y,
    };
  });

  const tp =
    targetKeys.length >= 3
      ? targetKeys.slice(0, 3)
      : targetKeys.length >= 2
        ? targetKeys.slice(0, 2)
        : targetKeys.length === 1
          ? [targetKeys[0], targetKeys[0]]
          : ['missing_a', 'missing_b'];

  generated.push({
    id: genId,
    year: parsed.year,
    stage: parsed.stage,
    team1: parsed.team1,
    team2: parsed.team2,
    focusTeam: parsed.focusTeam,
    targetPlayers: tp,
    slots,
    optionA: meta.optionA,
    optionB: meta.optionB,
    optionC: meta.optionC,
    optionD: meta.optionD,
    correctAnswer: meta.correctAnswer,
    hint1: meta.hint1,
    hint2: meta.hint2,
    hint3: meta.hint3,
  });

  overrides[id] = genId;
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const lines = [];
lines.push("import type { MissingPlayerLineupMatchDef } from './missingPlayerLineupMatchTypes';");
lines.push('');
lines.push('/** Auto-generated XI pitch layouts for World Cup Bingo (do not edit by hand). */');
lines.push('export const BINGO_MISSING_PLAYER_LINEUP_AUTO: MissingPlayerLineupMatchDef[] = [');

for (const g of generated) {
  lines.push('  {');
  lines.push(`    id: '${g.id}',`);
  lines.push(`    year: ${g.year},`);
  lines.push(`    stage: '${esc(g.stage)}',`);
  lines.push(`    team1: '${esc(g.team1)}',`);
  lines.push(`    team2: '${esc(g.team2)}',`);
  lines.push(`    focusTeam: '${esc(g.focusTeam)}',`);
  lines.push(`    targetPlayers: [${g.targetPlayers.map((k) => `'${k}'`).join(', ')}],`);
  lines.push('    slots: [');
  for (const s of g.slots) {
    lines.push(
      `      { key: '${s.key}', displayName: '${esc(s.displayName)}', x: ${s.x}, y: ${s.y} },`,
    );
  }
  lines.push('    ],');
  lines.push(`    optionA: '${esc(g.optionA)}',`);
  lines.push(`    optionB: '${esc(g.optionB)}',`);
  lines.push(`    optionC: '${esc(g.optionC)}',`);
  lines.push(`    optionD: '${esc(g.optionD)}',`);
  lines.push(`    correctAnswer: '${g.correctAnswer}',`);
  lines.push(`    hint1: '${esc(g.hint1)}',`);
  lines.push(`    hint2: '${esc(g.hint2)}',`);
  lines.push(`    hint3: '${esc(g.hint3)}',`);
  lines.push('  },');
}

lines.push('];');
lines.push('');

fs.writeFileSync(
  path.join(root, 'src/data/bingoMissingPlayerLineupAuto.ts'),
  lines.join('\n'),
);

const overrideLines = Object.entries(overrides)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `  '${k}': '${v}',`)
  .join('\n');

fs.writeFileSync(
  path.join(root, 'src/data/bingoMissingPlayerLineupOverrides.generated.ts'),
  `/** Auto-generated mp-id → lineup def overrides for World Cup Bingo XI rows.\n * Run: node scripts/generate-bingo-xi-supplements.mjs */\nexport const BINGO_MP_LINEUP_OVERRIDES_GENERATED: Record<string, string> = {\n${overrideLines}\n};\n`,
);

console.log(`XI bingo rows: ${xiRows.length}`);
console.log(`Direct verified overrides: ${directVerified}`);
console.log(`Cloned from verified: ${clonedVerified}`);
console.log(`Semicolon fallback supplements: ${generated.length - clonedVerified}`);
console.log(`Generated supplements: ${generated.length}`);
console.log(`Total overrides: ${Object.keys(overrides).length}`);

const allDefs = new Map([
  ...defs.map((d) => [d.id, d]),
  ...generated.map((g) => [g.id, { id: g.id, names: g.slots.map((s) => s.displayName) }]),
]);
let resolved = 0;
const unresolved = [];
for (const row of xiRows) {
  const id = row.meta.id;
  const defId = overrides[id];
  const def = allDefs.get(defId);
  const answers = getAnswers(row.meta);
  if (!def || def.names.length !== 11) {
    unresolved.push({ id, defId, reason: 'missing def' });
    continue;
  }
  const matched = answers.filter((n) => def.names.some((d) => nameMatch(d, n))).length;
  if (matched >= answers.length && answers.length > 0) resolved++;
  else unresolved.push({ id, defId, matched, answers: answers.join(' · ') });
}
console.log(`Resolved with answer match: ${resolved}/${xiRows.length}`);
if (unresolved.length) {
  console.log('Unresolved:');
  for (const u of unresolved) console.log(`  ${u.id}: ${JSON.stringify(u)}`);
}

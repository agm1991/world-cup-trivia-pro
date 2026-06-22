#!/usr/bin/env node
/**
 * Sync World Cup Bingo missing-player pitch layouts from Missing Player levels 1–17.
 * Only updates mp-* rows that match a frozen level 1–17 lineup (fixture + XI names).
 * Run: node scripts/sync-bingo-from-mp-levels-1-17.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const BINGO_SHUFFLE_SEED = 0xb1e60226;
const BINGO_QUESTIONS_PER_LEVEL = 10;
const TARGET = 202 * BINGO_QUESTIONS_PER_LEVEL;

const MANUAL_MP_IDS = new Set(['mp-m-34', 'mp-m-35', 'mp-easy-036', 'mp-easy-060']);

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

function slotKey(name, i) {
  const base = fold(name)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24);
  return base || `slot_${i}`;
}

function parseQuoted(block, field) {
  const re = new RegExp(`${field}:\\s*'((?:\\\\'|[^'])*)'`);
  return block.match(re)?.[1]?.replace(/\\'/g, "'") ?? '';
}

function parseTeamFromMatch(matchStr) {
  const cleaned = matchStr.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
  const vsParts = cleaned.split(/\s+vs\s+/i);
  const team1 = vsParts[0]?.replace(/\s+/g, ' ').trim() ?? '';
  let team2 = vsParts[1] ?? '';
  team2 = team2
    .replace(/\s*[-–—]\s*\d{4}\s+.*$/i, '')
    .replace(/\s*-\s*\d{4}\s+.*$/i, '')
    .replace(/\s+\d{4}\s+World Cup.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { team1, team2 };
}

function loadLevel7to17() {
  const defs = [];
  const slotPat = /\{ key: '([^']+)', displayName: '((?:\\'|[^'])*)', x: (\d+), y: (\d+) \}/g;
  const idPat =
    /id: '(level-([0-9]+)-match-[0-9]+)'[\s\S]*?year: (\d+),[\s\S]*?stage: '([^']+)'[\s\S]*?team1: '([^']+)'[\s\S]*?team2: '([^']+)'[\s\S]*?focusTeam: '([^']+)'[\s\S]*?slots: \[([\s\S]*?)\],/g;

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
    const text = fs.readFileSync(path.join(root, 'src/data', rel), 'utf8');
    for (const block of text.matchAll(idPat)) {
      const levelNum = +block[2];
      const slots = [...block[8].matchAll(slotPat)].map((m) => ({
        key: m[1],
        displayName: m[2].replace(/\\'/g, "'"),
        x: +m[3],
        y: +m[4],
      }));
      defs.push({
        id: block[1],
        levelNum,
        year: +block[3],
        stage: block[4],
        team1: block[5],
        team2: block[6],
        focusTeam: block[7],
        slots,
        names: slots.map((s) => s.displayName),
      });
    }
  }
  return defs;
}

function loadLevel1to6() {
  const defs = [];
  const text = fs.readFileSync(
    path.join(root, 'src/data/missingPlayerLineupLevels1to6.frozen.ts'),
    'utf8',
  );
  const blocks = text.split(/\n  \{\n    id: /).slice(1);

  for (const block of blocks) {
    const idMatch = block.match(/^(\d+),/);
    if (!idMatch) continue;
    const qId = +idMatch[1];
    const year = +(block.match(/year: (\d+)/)?.[1] ?? 0);
    const team = block.match(/team: "([^"]+)"/)?.[1] ?? '';
    const matchStr = block.match(/match: "([^"]+)"/)?.[1] ?? '';
    const { team1, team2 } = parseTeamFromMatch(matchStr);

    const posBlock = block.match(/positions: \[([\s\S]*?)\],/)?.[1] ?? '';
    const posPat = /\{ name: "([^"]+)", flag: "[^"]+", x: (\d+), y: (\d+) \}/g;
    const positions = [...posBlock.matchAll(posPat)].map((m) => ({
      displayName: m[1],
      x: +m[2],
      y: +m[3],
    }));
    if (positions.length !== 11) continue;

    const slots = positions.map((p, i) => ({
      key: slotKey(p.displayName === '???' ? `missing_${i}` : p.displayName, i),
      displayName: p.displayName === '???' ? '???' : p.displayName,
      x: p.x,
      y: p.y,
    }));

    let levelNum = 0;
    for (let lv = 1; lv <= 6; lv++) {
      const re = new RegExp(`MISSING_PLAYER_LEVEL_${lv}:[\\s\\S]*?id: ${qId},`);
      if (re.test(text)) {
        levelNum = lv;
        break;
      }
    }
    if (!levelNum) continue;

    const stageMatch = matchStr.match(
      /Quarter-Final|Semi-Final|Final|Round of 16|Group Stage|Group [A-Z]/i,
    );

    defs.push({
      id: `level-${levelNum}-q-${qId}`,
      levelNum,
      year,
      stage: stageMatch?.[0] ?? 'Match',
      team1,
      team2,
      focusTeam: team,
      slots,
      names: slots.map((s) => (s.displayName === '???' ? '' : s.displayName)).filter(Boolean),
    });
  }
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
  const paren = /\(([^)]+)\)\s*$/.exec(body);
  if (paren && paren.index != null) body = body.slice(0, paren.index).trim();
  const rawParts = body.split(';').flatMap((s) => s.split(',').map((p) => p.trim())).filter(Boolean);
  if (rawParts.length !== 11) return null;
  const stageMatch = triple[0].match(
    /Quarter-Final|Semi-Final|Final|Round of 16|Group Stage|Group [A-Z]/i,
  );
  const parts = triple[1].split(/\s+vs\s+/i).map((s) => s.trim());
  return {
    team1: parts[0] ?? '',
    team2: parts[1] ?? '',
    focusTeam: xi[1].trim(),
    year: +(q.match(/(\d{4})/)?.[1] ?? 0),
    stage: stageMatch?.[0] ?? 'Match',
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

function cleanLabel(part) {
  return part.replace(/\?+$/, '').replace(/___/g, '').trim() || '???';
}

function fillXiNames(rawParts, answers) {
  let missingIdx = 0;
  return rawParts.map((part) => {
    if (/___/.test(part)) return answers[missingIdx++] ?? 'Missing';
    return cleanLabel(part);
  });
}

function scoreDef(def, allNames, answers) {
  const visible = allNames.filter(Boolean);
  const nameHits = visible.filter((n) => def.slots.some((s) => nameMatch(s.displayName, n))).length;
  const answerHits = answers.filter((n) => def.slots.some((s) => nameMatch(s.displayName, n))).length;
  return nameHits * 10 + answerHits * 5 - def.levelNum;
}

function findPool(parsed, mpDefs) {
  const focusPool = mpDefs.filter(
    (d) =>
      d.year === parsed.year &&
      teamsMatch(d, parsed.team1, parsed.team2) &&
      fold(d.focusTeam) === fold(parsed.focusTeam),
  );
  if (focusPool.length > 0) return focusPool;
  return mpDefs.filter((d) => d.year === parsed.year && teamsMatch(d, parsed.team1, parsed.team2));
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

function getBingoMpRows(questions) {
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
  const mpIds = new Set();
  for (const q of padded) {
    if (q.category === 'missing-player') mpIds.add(q.id);
  }
  return [...mpIds].map((id) => ({ id, meta: questions.get(id) })).filter((r) => r.meta);
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildVerifiedEntry(mpId, meta, parsed, def) {
  const answers = getAnswers(meta);
  const allNames = fillXiNames(parsed.rawParts, answers);
  const targetKeys = [];
  const slots = parsed.rawParts.map((part, idx) => {
    const missing = /___/.test(part);
    const displayName = allNames[idx];
    const matched = def.slots.find((s) => nameMatch(s.displayName, displayName));
    const key = matched?.key ?? slotKey(displayName, idx);
    if (missing) targetKeys.push(key);
    return {
      key,
      displayName,
      x: matched?.x ?? def.slots[idx]?.x ?? 50,
      y: matched?.y ?? def.slots[idx]?.y ?? 50,
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

  return {
    id: `bingo-verified-mp-sync-${mpId.replace(/[^a-z0-9]+/gi, '-')}`,
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
    mpId,
    sourceDefId: def.id,
  };
}

function formatVerifiedDef(g) {
  const lines = [];
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
  return lines.join('\n');
}

function isLevel1to17Target(defId) {
  if (defId.startsWith('bingo-verified-mp-sync-')) return true;
  const m = defId.match(/^level-(\d+)/);
  return m != null && +m[1] <= 17;
}

function isLevel18PlusTarget(defId) {
  const m = defId.match(/^level-(\d+)/);
  return m != null && +m[1] > 17;
}

// --- main ---
const mpDefs = [...loadLevel1to6(), ...loadLevel7to17()];
const questions = parseMpQuestions();
const bingoRows = getBingoMpRows(questions);

const matches = [];

for (const row of bingoRows) {
  if (MANUAL_MP_IDS.has(row.id)) continue;
  const parsed = parseXi(row.meta.question);
  if (!parsed) continue;
  const answers = getAnswers(row.meta);
  const allNames = fillXiNames(parsed.rawParts, answers);
  const pool = findPool(parsed, mpDefs);
  let best = null;
  let bestScore = -1;
  for (const d of pool) {
    const score = scoreDef(d, allNames, answers);
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  const answerMatch = answers.filter((n) => best?.slots.some((s) => nameMatch(s.displayName, n))).length;
  const nameMatchCount = allNames.filter((n) => best?.slots.some((s) => nameMatch(s.displayName, n))).length;
  const ok =
    best &&
    answerMatch >= answers.length &&
    answers.length > 0 &&
    nameMatchCount >= 8 &&
    bestScore >= 80;
  if (ok) {
    matches.push({ mpId: row.id, def: best, answerMatch, nameMatchCount });
  }
}

console.log(`MP levels 1–17 defs: ${mpDefs.length}`);
console.log(`Bingo missing-player mp ids: ${bingoRows.length}`);
console.log(`Matched to level 1–17: ${matches.length}`);

const overridePath = path.join(root, 'src/data/bingoMissingPlayerLineupOverrides.generated.ts');
const overrideText = fs.readFileSync(overridePath, 'utf8');
const currentOverrides = {};
for (const m of overrideText.matchAll(/'([^']+)': '([^']+)'/g)) {
  currentOverrides[m[1]] = m[2];
}

const genPath = path.join(root, 'scripts/generate-bingo-xi-supplements.mjs');
const genText = fs.readFileSync(genPath, 'utf8');
const baseMatch = genText.match(/const BASE_OVERRIDES = \{([\s\S]*?)\};/);
const baseOverrides = {};
if (baseMatch) {
  for (const m of baseMatch[1].matchAll(/'([^']+)': '([^']+)'/g)) {
    baseOverrides[m[1]] = m[2];
  }
}

const syncOverrides = {};
const level1to6Verified = [];

for (const m of matches) {
  if (m.def.levelNum <= 6) {
    const parsed = parseXi(questions.get(m.mpId).question);
    const entry = buildVerifiedEntry(m.mpId, questions.get(m.mpId), parsed, m.def);
    level1to6Verified.push(entry);
    syncOverrides[m.mpId] = entry.id;
  } else {
    syncOverrides[m.mpId] = m.def.id;
  }
}

const newBaseOverrides = { ...baseOverrides };
let added = 0;
let updated = 0;

for (const [mpId, defId] of Object.entries(syncOverrides)) {
  if (MANUAL_MP_IDS.has(mpId)) continue;
  if (!isLevel1to17Target(defId)) continue;

  const existing = newBaseOverrides[mpId] ?? currentOverrides[mpId];
  if (existing === defId) continue;

  if (existing && isLevel18PlusTarget(existing)) {
    newBaseOverrides[mpId] = defId;
    updated++;
    continue;
  }

  if (!(mpId in newBaseOverrides)) added++;
  else if (newBaseOverrides[mpId] !== defId) updated++;
  newBaseOverrides[mpId] = defId;
}

const overrideEntries = Object.entries(newBaseOverrides)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `  '${k}': '${v}',`)
  .join('\n');

const newGenText = genText.replace(
  /const BASE_OVERRIDES = \{[\s\S]*?\};/,
  `const BASE_OVERRIDES = {\n${overrideEntries}\n};`,
);
fs.writeFileSync(genPath, newGenText);

const verifiedPath = path.join(root, 'src/data/bingoMissingPlayerLineupVerifiedFixtures.ts');
let verifiedText = fs.readFileSync(verifiedPath, 'utf8');
verifiedText = verifiedText.replace(
  /\n  \/\/ ——— synced from Missing Player levels 1–6[\s\S]*?(?=\n\];)/,
  '',
);

if (level1to6Verified.length > 0) {
  const block =
    '\n  // ——— synced from Missing Player levels 1–6 (auto — do not edit by hand) ———\n' +
    level1to6Verified.map(formatVerifiedDef).join('\n');
  verifiedText = verifiedText.replace(/\n\];/, `${block}\n];`);
  fs.writeFileSync(verifiedPath, verifiedText);
  console.log(`L1–6 verified entries written: ${level1to6Verified.length}`);
}

console.log(`BASE_OVERRIDES added: ${added}, updated: ${updated}`);
console.log('\nSync map (mp-id → level def):');
for (const m of matches) {
  const target = syncOverrides[m.mpId];
  console.log(`  ${m.mpId} → ${target} (from ${m.def.id}, names ${m.nameMatchCount}/11)`);
}

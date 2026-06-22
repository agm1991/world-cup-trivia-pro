#!/usr/bin/env node
/**
 * Generates bingoMissingPlayerLineupFrozenL1to6.ts from missingPlayerLineupLevels1to6.frozen.ts
 * Run: node scripts/generate-bingo-l1to6-catalog.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function fold(s) {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

function slotKey(name, i) {
  const base = fold(name)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24);
  return base || `slot_${i}`;
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

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const text = fs.readFileSync(
  path.join(root, 'src/data/missingPlayerLineupLevels1to6.frozen.ts'),
  'utf8',
);

const defs = [];
const blocks = text.split(/\n  \{\n    id: /).slice(1);

for (const block of blocks) {
  const idMatch = block.match(/^(\d+),/);
  if (!idMatch) continue;
  const qId = +idMatch[1];
  const year = +(block.match(/year: (\d+)/)?.[1] ?? 0);
  const team = block.match(/team: "([^"]+)"/)?.[1] ?? '';
  const matchStr = block.match(/match: "([^"]+)"/)?.[1] ?? '';
  const { team1, team2 } = parseTeamFromMatch(matchStr);
  const missingIndex = +(block.match(/missingIndex: (\d+)/)?.[1] ?? -1);
  const missingIndex2 = block.match(/missingIndex2: (\d+)/)?.[1];
  const missingIndex3 = block.match(/missingIndex3: (\d+)/)?.[1];

  const posBlock = block.match(/positions: \[([\s\S]*?)\],/)?.[1] ?? '';
  const posPat = /\{ name: "([^"]+)", flag: "[^"]+", x: (\d+), y: (\d+) \}/g;
  const positions = [...posBlock.matchAll(posPat)].map((m) => ({
    displayName: m[1],
    x: +m[2],
    y: +m[3],
  }));
  if (positions.length !== 11) continue;

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

  const missingIdx = new Set([missingIndex]);
  if (missingIndex2 != null) missingIdx.add(+missingIndex2);
  if (missingIndex3 != null) missingIdx.add(+missingIndex3);

  const slots = positions.map((p, i) => ({
    key: slotKey(p.displayName === '???' ? `missing_${i}` : p.displayName, i),
    displayName: p.displayName === '???' ? '???' : p.displayName,
    x: p.x,
    y: p.y,
    isMissing: p.displayName === '???' || missingIdx.has(i),
  }));

  const targetKeys = slots.filter((s) => s.isMissing).map((s) => s.key);
  const tp =
    targetKeys.length >= 3
      ? targetKeys.slice(0, 3)
      : targetKeys.length >= 2
        ? targetKeys.slice(0, 2)
        : targetKeys.length === 1
          ? [targetKeys[0], targetKeys[0], targetKeys[0]]
          : ['missing_a', 'missing_b', 'missing_c'];

  const oA = block.match(/optionA: "([^"]+)"/)?.[1] ?? '';
  const oB = block.match(/optionB: "([^"]+)"/)?.[1] ?? '';
  const oC = block.match(/optionC: "([^"]+)"/)?.[1] ?? '';
  const oD = block.match(/optionD: "([^"]+)"/)?.[1] ?? '';
  const ca = block.match(/correctAnswer: '([ABCD])'/)?.[1] ?? 'A';
  const h1 = block.match(/hint1: "([^"]+)"/)?.[1] ?? '';
  const h2 = block.match(/hint2: "([^"]+)"/)?.[1] ?? '';
  const h3 = block.match(/hint3: "([^"]+)"/)?.[1] ?? '';

  defs.push({
    id: `level-${levelNum}-q-${qId}`,
    year,
    stage: stageMatch?.[0] ?? 'Match',
    team1,
    team2,
    focusTeam: team,
    targetPlayers: tp,
    slots,
    optionA: oA,
    optionB: oB,
    optionC: oC,
    optionD: oD,
    correctAnswer: ca,
    hint1: h1,
    hint2: h2,
    hint3: h3,
  });
}

const lines = [
  '/**',
  ' * READ-ONLY copy of Missing Player levels 1–6 pitch layouts for World Cup Bingo.',
  ' * Source: missingPlayerLineupLevels1to6.frozen.ts — DO NOT EDIT BY HAND.',
  ' * Regenerate: node scripts/generate-bingo-l1to6-catalog.mjs',
  ' */',
  "import type { MissingPlayerLineupMatchDef } from './missingPlayerLineupMatchTypes';",
  '',
  'export const BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO6: MissingPlayerLineupMatchDef[] = [',
];

for (const d of defs) {
  lines.push('  {');
  lines.push(`    id: '${d.id}',`);
  lines.push(`    year: ${d.year},`);
  lines.push(`    stage: '${esc(d.stage)}',`);
  lines.push(`    team1: '${esc(d.team1)}',`);
  lines.push(`    team2: '${esc(d.team2)}',`);
  lines.push(`    focusTeam: '${esc(d.focusTeam)}',`);
  lines.push(`    targetPlayers: [${d.targetPlayers.map((k) => `'${k}'`).join(', ')}],`);
  lines.push('    slots: [');
  for (const s of d.slots) {
    lines.push(
      `      { key: '${s.key}', displayName: '${esc(s.displayName)}', x: ${s.x}, y: ${s.y} },`,
    );
  }
  lines.push('    ],');
  lines.push(`    optionA: '${esc(d.optionA)}',`);
  lines.push(`    optionB: '${esc(d.optionB)}',`);
  lines.push(`    optionC: '${esc(d.optionC)}',`);
  lines.push(`    optionD: '${esc(d.optionD)}',`);
  lines.push(`    correctAnswer: '${d.correctAnswer}',`);
  lines.push(`    hint1: '${esc(d.hint1)}',`);
  lines.push(`    hint2: '${esc(d.hint2)}',`);
  lines.push(`    hint3: '${esc(d.hint3)}',`);
  lines.push('  },');
}

lines.push('];');
lines.push('');

const outPath = path.join(root, 'src/data/bingoMissingPlayerLineupFrozenL1to6.ts');
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Wrote ${defs.length} L1–6 lineup defs → ${path.relative(root, outPath)}`);

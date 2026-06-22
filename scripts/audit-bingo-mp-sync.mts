#!/usr/bin/env npx vite-node
/**
 * Audit: do Bingo missing-player pitches match their Missing Player level 1–17 source?
 */
import { ORDERED_WORLD_CUP_BINGO_QUESTIONS } from '../src/data/worldCupBingoQuestions.ts';
import {
  extractNativeMpId,
  BINGO_MP_LINEUP_OVERRIDES,
  findBingoMpLineupPitch,
} from '../src/data/bingoMpLineupCatalog.ts';
import { LEVEL_16 } from '../src/data/missingPlayerLineupLevels16.frozen.ts';
import { LEVEL_7 } from '../src/data/missingPlayerLineupLevels7.frozen.ts';
import { LEVEL_8 } from '../src/data/missingPlayerLineupLevels8.frozen.ts';
import { LEVEL_9 } from '../src/data/missingPlayerLineupLevels9.frozen.ts';
import { LEVEL_10 } from '../src/data/missingPlayerLineupLevels10.frozen.ts';
import { BINGO_MISSING_PLAYER_LINEUP_VERIFIED_FIXTURES } from '../src/data/bingoMissingPlayerLineupVerifiedFixtures.ts';

import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt.ts';
import { LEVEL_11 } from '../src/data/missingPlayerLineupLevels11.frozen.ts';
import { LEVEL_12 } from '../src/data/missingPlayerLineupLevels12.frozen.ts';
import { LEVEL_13 } from '../src/data/missingPlayerLineupLevels13.frozen.ts';
import { LEVEL_14 } from '../src/data/missingPlayerLineupLevels14.frozen.ts';
import { LEVEL_15 } from '../src/data/missingPlayerLineupLevels15.frozen.ts';
import { LEVEL_17 } from '../src/data/missingPlayerLineupLevels17.frozen.ts';

const DEF_BY_ID = new Map(
  [
    ...LEVEL_7,
    ...LEVEL_8,
    ...LEVEL_9,
    ...LEVEL_10,
    ...LEVEL_11,
    ...LEVEL_12,
    ...LEVEL_13,
    ...LEVEL_14,
    ...LEVEL_15,
    ...LEVEL_16,
    ...LEVEL_17,
    ...BINGO_MISSING_PLAYER_LINEUP_VERIFIED_FIXTURES,
  ].map((d) => [d.id, d]),
);

let total = 0;
let hasPitch = 0;
let matchesSource = 0;
let wrongSource = 0;
let noOverrideL1to17 = 0;
const wrong: string[] = [];

ORDERED_WORLD_CUP_BINGO_QUESTIONS.forEach((q, i) => {
  if (q.sourceCategory !== 'missing-player') return;
  total++;
  const mp = extractNativeMpId(q.id);
  if (!mp) return;
  const parsed = parseMissingPlayerPromptForBingo(q.question);
  if (!parsed) return;
  const pitch = findBingoMpLineupPitch(parsed, q);
  if (!pitch || pitch.length !== 11) return;
  hasPitch++;

  const level = Math.floor(i / 10) + 1;
  const qNum = (i % 10) + 1;
  const overrideId = BINGO_MP_LINEUP_OVERRIDES[mp];
  const def = overrideId ? DEF_BY_ID.get(overrideId) : undefined;
  const isL1to17 =
    overrideId?.match(/^level-([1-9]|1[0-7])-/) ||
    overrideId?.startsWith('bingo-verified-mp-sync-');

  if (!isL1to17) {
    noOverrideL1to17++;
    return;
  }

  if (!def || def.slots.length !== 11) {
    wrong.push(`L${level} Q${qNum} ${mp}: override ${overrideId} has no def`);
    wrongSource++;
    return;
  }

  let ok = true;
  for (let s = 0; s < 11; s++) {
    const ds = def.slots[s]!;
    const ps = pitch[s]!;
    if (ds.x !== ps.x || ds.y !== ps.y) {
      ok = false;
      break;
    }
  }
  if (ok) matchesSource++;
  else {
    wrongSource++;
    wrong.push(`L${level} Q${qNum} ${mp}: coords differ from ${overrideId}`);
  }
});

console.log('Bingo missing-player rows:', total);
console.log('With full 11 pitch:', hasPitch);
console.log('Override to level 1–17:', matchesSource + wrongSource);
console.log('Coords match source:', matchesSource);
console.log('Coords WRONG vs source:', wrongSource);
console.log('No level 1–17 override (uses other/fallback):', noOverrideL1to17);
if (wrong.length) {
  console.log('\nMismatches:');
  wrong.slice(0, 30).forEach((w) => console.log(' ', w));
}

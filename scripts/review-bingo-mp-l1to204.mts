#!/usr/bin/env npx vite-node
/** Summary stats for frozen bingo missing-player rows L1–204. */
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { BINGO_MP_QUESTIONS_FROZEN_L1TO204 } from '../src/data/bingoMissingPlayerQuestionsFrozenL1to204';
import { BINGO_MP_FROZEN_L1TO204_OVERRIDES } from '../src/data/bingoMissingPlayerLineupFrozenL1to204';

const byLevel: { level: number; mpId: string; matchup: string }[] = [];

for (let level = 1; level <= 204; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id)!;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    const pitch = parsed ? resolveBingoLineupPitch(parsed, q) : [];
    byLevel.push({
      level,
      mpId,
      matchup: `${parsed?.matchup ?? '?'} (${pitch.length}/11 pitch)`,
    });
  });
}

const ranges = [
  [1, 50],
  [51, 100],
  [101, 150],
  [151, 198],
  [199, 204],
] as const;

console.log('=== World Cup Bingo Missing Player — L1–204 Review ===\n');
console.log(`Total MP rows in bingo: ${byLevel.length}`);
console.log(`Unique mp-ids frozen: ${Object.keys(BINGO_MP_QUESTIONS_FROZEN_L1TO204).length}`);
console.log(`Pitch override entries: ${Object.keys(BINGO_MP_FROZEN_L1TO204_OVERRIDES).length}`);
console.log('');

for (const [a, b] of ranges) {
  const slice = byLevel.filter((r) => r.level >= a && r.level <= b);
  console.log(`Levels ${a}–${b}: ${slice.length} missing-player questions`);
}

const noPitch = byLevel.filter((r) => !r.matchup.includes('11/11'));
console.log(`\nRows without 11-player pitch: ${noPitch.length}`);

const frozenIds = new Set(Object.keys(BINGO_MP_QUESTIONS_FROZEN_L1TO204));
const liveIds = new Set(byLevel.map((r) => r.mpId));
const missingFrozen = [...liveIds].filter((id) => !frozenIds.has(id));
const extraFrozen = [...frozenIds].filter((id) => !liveIds.has(id));
console.log(`Live mp-ids missing from frozen map: ${missingFrozen.length}`);
if (missingFrozen.length) console.log(missingFrozen.join(', '));
console.log(`Frozen mp-ids not in live L1–204: ${extraFrozen.length}`);

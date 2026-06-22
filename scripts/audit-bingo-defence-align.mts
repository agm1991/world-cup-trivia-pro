#!/usr/bin/env npx vite-node
/**
 * Flag missing-player bingo pitches (L16+) where defenders are misaligned on y-axis.
 * Flat back 4: all def y should be 72–76. Wing-back systems: paired at 68.
 */
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId, findBingoMpLineupPitch } from '../src/data/bingoMpLineupCatalog';

const MIN_LEVEL = 16;

type Slot = { name: string; x: number; y: number; isMissing: boolean };

for (let level = MIN_LEVEL; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    if (!parsed) return;
    const pitch = resolveBingoLineupPitch(parsed, q);
    if (pitch.length !== 11) return;
    const mpId = extractNativeMpId(q.id);

    // Defenders: outfield players with y >= 68 (excluding GK at ~90)
    const defs = pitch.filter((p) => p.y >= 68 && p.y < 85);
    if (defs.length < 3) return;

    const ys = defs.map((d) => d.y);
    const spread = Math.max(...ys) - Math.min(...ys);
    if (spread > 6) {
      const defList = defs.map((d) => `${d.isMissing ? '?' : d.name}@${d.x},${d.y}`).join(' | ');
      console.log(`L${level} Q${qi + 1} ${mpId} spread=${spread}`);
      console.log(`  ${parsed.year} ${parsed.team} — ${defList}`);
    }
  });
}

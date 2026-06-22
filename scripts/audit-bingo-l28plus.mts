#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';

const MIN_DIST = 10;

for (let level = 28; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id);
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    const pitch = parsed ? resolveBingoLineupPitch(parsed, q) : [];
    const qn = qi + 1;
    if (pitch.length !== 11) {
      console.log(`L${level} Q${qn} ${mpId} BROKEN pitch=${pitch.length}`);
      return;
    }
    for (let i = 0; i < pitch.length; i++) {
      for (let j = i + 1; j < pitch.length; j++) {
        const a = pitch[i]!;
        const b = pitch[j]!;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < MIN_DIST) {
          console.log(
            `L${level} Q${qn} ${mpId} OVERLAP "${a.name}"↔"${b.name}" dist=${dist.toFixed(1)}`,
          );
        }
      }
    }
  });
}

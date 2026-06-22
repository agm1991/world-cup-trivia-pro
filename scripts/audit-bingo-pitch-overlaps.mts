#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';

const MIN_DIST = 12;

type Issue = {
  level: number;
  q: number;
  mpId: string | null;
  a: string;
  b: string;
  dist: number;
};

const issues: Issue[] = [];

for (let level = 1; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    if (!parsed) return;
    const pitch = resolveBingoLineupPitch(parsed, q);
    if (pitch.length !== 11) return;
    const mpId = extractNativeMpId(q.id);
    for (let i = 0; i < pitch.length; i++) {
      for (let j = i + 1; j < pitch.length; j++) {
        const a = pitch[i]!;
        const b = pitch[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MIN_DIST) {
          issues.push({
            level,
            q: qi + 1,
            mpId,
            a: a.name,
            b: b.name,
            dist: Math.round(dist * 10) / 10,
          });
        }
      }
    }
  });
}

console.log(`Overlaps (< ${MIN_DIST} units): ${issues.length}`);
for (const i of issues) {
  console.log(`L${i.level} Q${i.q} ${i.mpId ?? '?'}: "${i.a}" ↔ "${i.b}" dist=${i.dist}`);
}

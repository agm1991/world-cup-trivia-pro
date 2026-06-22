#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';

const mpIds = new Map<string, { level: number; qi: number }>();
const noPitch: { level: number; qi: number; mpId: string }[] = [];

for (let level = 1; level <= 204; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id);
    if (!mpId) return;
    if (!mpIds.has(mpId)) mpIds.set(mpId, { level, qi: qi + 1 });
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    const pitch = parsed ? resolveBingoLineupPitch(parsed, q) : [];
    if (pitch.length !== 11) noPitch.push({ level, qi: qi + 1, mpId });
  });
}

console.log('Unique mp ids in bingo L1–204:', mpIds.size);
console.log('Rows without full pitch:', noPitch.length);
if (noPitch.length) {
  for (const r of noPitch) console.log(`  L${r.level} Q${r.qi} ${r.mpId}`);
}

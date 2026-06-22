#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';

const levelsWithMp: { level: number; count: number; mpIds: string[] }[] = [];

for (let level = 1; level <= 204; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  const mpIds: string[] = [];
  qs.forEach((q) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id);
    if (mpId) mpIds.push(mpId);
  });
  if (mpIds.length > 0) {
    levelsWithMp.push({ level, count: mpIds.length, mpIds });
  }
}

console.log(`World Cup Bingo levels with missing-player questions: ${levelsWithMp.length}\n`);

for (const row of levelsWithMp) {
  const slots = row.mpIds.join(', ');
  console.log(`Level ${row.level} (${row.count}): ${slots}`);
}

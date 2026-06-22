#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';
import { getCorrectAnswerPlayerNames } from '../src/lib/missingPlayerBingoAnswers';

const levels = [2, 5, 28, 30, 35, 36];
for (const level of levels) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  console.log(`\n=== LEVEL ${level} ===`);
  qs.forEach((q, i) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id);
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    const pitch = parsed ? resolveBingoLineupPitch(parsed, q) : [];
    const ans = getCorrectAnswerPlayerNames(q);
    const visible = pitch.filter((p) => !p.isMissing).map((p) => p.name);
    const missing = pitch.filter((p) => p.isMissing).map((p) => `${p.name}@${p.x},${p.y}`);
    console.log(`Q${i + 1} ${mpId} ans=${ans.join('|')} slots=${pitch.length}`);
    console.log(`  vis: ${visible.join(', ')}`);
    console.log(`  miss: ${missing.join(', ')}`);
  });
}

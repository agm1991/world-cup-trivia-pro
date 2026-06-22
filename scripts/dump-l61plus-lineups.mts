#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';

const MIN = Number(process.argv[2] ?? 61);

for (let level = MIN; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q) => {
    if (q.sourceCategory !== 'missing-player') return;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    if (!parsed) return;
    const pitch = resolveBingoLineupPitch(parsed, q);
    if (pitch.length !== 11) return;
    const names = pitch
      .map((p) => (p.isMissing ? '?' : p.name))
      .join(', ');
    console.log(`Level ${level} | Q${qs.indexOf(q) + 1} | ${parsed.year} ${parsed.team} | ${names}`);
  });
}

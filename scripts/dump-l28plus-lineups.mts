#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId, BINGO_MP_LINEUP_OVERRIDES } from '../src/data/bingoMpLineupCatalog';

for (let level = 28; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id)!;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    if (!parsed) return;
    const defId = BINGO_MP_LINEUP_OVERRIDES[mpId] ?? '?';
    const pitch = resolveBingoLineupPitch(parsed, q);
    const slots = pitch
      .map((p) => `${p.isMissing ? '?' : p.name}@${p.x},${p.y}`)
      .join(' | ');
    console.log(`L${level} Q${qi + 1} ${mpId} -> ${defId}`);
    console.log(`  ${parsed.year} ${parsed.matchup} | focus: ${parsed.team}`);
    console.log(`  ${slots}`);
    console.log('');
  });
}

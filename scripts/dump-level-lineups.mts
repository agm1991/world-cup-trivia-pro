#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId, BINGO_MP_LINEUP_OVERRIDES } from '../src/data/bingoMpLineupCatalog';

const level = Number(process.argv[2] ?? 61);

const qs = getWorldCupBingoQuestionsByLevel(level);
qs.forEach((q, i) => {
  if (q.sourceCategory !== 'missing-player') return;
  const qi = qs.indexOf(q) + 1;
  const mpId = extractNativeMpId(q.id)!;
  const parsed = parseMissingPlayerPromptForBingo(q.question)!;
  const defId = BINGO_MP_LINEUP_OVERRIDES[mpId] ?? '?';
  const pitch = resolveBingoLineupPitch(parsed, q);
  console.log(`L${level} Q${qi} ${mpId} -> ${defId}`);
  console.log(`  ${parsed.year} ${parsed.team}`);
  console.log(`  ${pitch.map((p) => (p.isMissing ? '?' : p.name) + '@' + p.x + ',' + p.y).join(' | ')}`);
  console.log('');
});

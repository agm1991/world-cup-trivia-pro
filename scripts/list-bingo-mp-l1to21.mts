#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { extractNativeMpId, findBingoMpLineupPitch } from '../src/data/bingoMpLineupCatalog';

for (let level = 1; level <= 21; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  const mp = qs.filter((q) => q.sourceCategory === 'missing-player');
  if (!mp.length) continue;
  console.log(`Level ${level}:`);
  mp.forEach((q) => {
    const qi = qs.indexOf(q) + 1;
    const mpId = extractNativeMpId(q.id)!;
    const parsed = parseMissingPlayerPromptForBingo(q.question)!;
    const def = findBingoMpLineupPitch(parsed, mpId);
    const defId = def?.id ?? '?';
    let file = 'default';
    if (defId.startsWith('bingo-sup-')) file = 'Supplements';
    else if (defId.startsWith('bingo-verified-')) file = 'VerifiedFixtures';
    else if (defId.startsWith('level-')) file = 'Frozen default';
    const short = (parsed.matchup.split('—').pop()?.trim() ?? parsed.team).slice(0, 40);
    const changed = file !== 'Frozen default' && file !== 'default' ? ' ✓ CHANGED' : '';
    console.log(`  Q${qi} — ${short}${changed}`);
    if (changed) console.log(`         → src/data/bingoMissingPlayerLineup${file === 'Supplements' ? 'Supplements' : 'VerifiedFixtures'}.ts`);
  });
  console.log('');
}

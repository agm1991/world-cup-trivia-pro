#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { extractNativeMpId, BINGO_MP_LINEUP_OVERRIDES, findBingoMpLineupPitch } from '../src/data/bingoMpLineupCatalog';

const MANUAL_OVERRIDES = new Set([
  'mp-h-03', 'mp-h-06', 'mp-h-07', 'mp-h-08', 'mp-h-09', 'mp-h-13', 'mp-h-14', 'mp-h-15',
  'mp-h-18', 'mp-h-20', 'mp-h-21', 'mp-h-23', 'mp-h-24', 'mp-h-27', 'mp-h-28', 'mp-h-29',
  'mp-easy-044', 'mp-easy-053', 'mp-easy-068', 'mp-m-12', 'mp-m-13', 'mp-m-17', 'mp-m-20',
  'mp-m-24', 'mp-m-41', 'mp-m-49', 'mp-m-10', 'mp-easy-005', 'mp-easy-006',
  'mp-easy-026', 'mp-easy-030', 'mp-easy-032', 'mp-easy-059', 'mp-easy-007', 'mp-m-09', 'mp-m-16',
]);

function fileFor(defId: string): string {
  if (defId.startsWith('bingo-sup-')) return 'Supplements';
  if (defId.startsWith('bingo-verified-')) return 'VerifiedFixtures';
  if (defId.startsWith('bingo-auto-')) return 'Auto';
  if (defId.startsWith('level-')) return 'Frozen (default)';
  return 'Auto-match';
}

console.log('LEVEL | Q | MATCH | FILE');
console.log('------|---|-------|-----');

for (let level = 1; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id)!;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    if (!parsed) return;
    const def = findBingoMpLineupPitch(parsed, mpId);
    const defId = def?.id ?? BINGO_MP_LINEUP_OVERRIDES[mpId] ?? '?';
    const isCustom =
      MANUAL_OVERRIDES.has(mpId) ||
      defId.startsWith('bingo-sup-') ||
      defId.startsWith('bingo-verified-') ||
      defId.startsWith('bingo-auto-');
    if (!isCustom) return;
    const match = `${parsed.year} ${parsed.team}`.slice(0, 40);
    console.log(
      `${String(level).padStart(5)} | ${String(qi + 1).padStart(1)} | ${match.padEnd(40)} | ${fileFor(defId)}`,
    );
  });
}

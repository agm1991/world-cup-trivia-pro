#!/usr/bin/env npx vite-node
/**
 * Full World Cup Bingo missing-player list with pitch status.
 * Run: npx vite-node scripts/print-bingo-mp-full-list.mts
 */
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog';

type Row = {
  level: number;
  q: number;
  mpId: string;
  status: 'FULL' | 'PARTIAL' | 'NONE';
  missing: number;
};

const rows: Row[] = [];

for (let level = 1; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;
    const mpId = extractNativeMpId(q.id);
    if (!mpId) return;
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    const pitch = parsed ? resolveBingoLineupPitch(parsed, q) : [];
    const missing = pitch.filter((s) => s.isMissing).length;
    let status: Row['status'] = 'NONE';
    if (pitch.length === 11) status = 'FULL';
    else if (pitch.length > 0) status = 'PARTIAL';
    rows.push({ level, q: qi + 1, mpId, status, missing });
  });
}

console.log('Level | Q | mp-id | Status | Missing');
console.log('------|---|-------|--------|--------');
for (const r of rows) {
  console.log(
    `${String(r.level).padStart(5)} | ${String(r.q).padStart(1)} | ${r.mpId.padEnd(14)} | ${r.status.padEnd(6)} | ${r.missing}`,
  );
}
console.log(`\nTotal: ${rows.length} missing-player rows`);
console.log(`FULL: ${rows.filter((r) => r.status === 'FULL').length}`);
console.log(`PARTIAL: ${rows.filter((r) => r.status === 'PARTIAL').length}`);
console.log(`NONE: ${rows.filter((r) => r.status === 'NONE').length}`);

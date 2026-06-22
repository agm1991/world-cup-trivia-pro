#!/usr/bin/env npx vite-node
/**
 * LIVE World Cup Bingo level map — uses the same TS modules as the running app.
 * Run: npx vite-node scripts/audit-bingo-locations.mts
 */
import { getWorldCupBingoQuestionsByLevel, ORDERED_WORLD_CUP_BINGO_QUESTIONS } from '../src/data/worldCupBingoQuestions.ts';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog.ts';

import { BINGO_MP_LINEUP_OVERRIDES } from '../src/data/bingoMpLineupCatalog.ts';

const SYNCED_MP = new Set(
  Object.entries(BINGO_MP_LINEUP_OVERRIDES)
    .filter(([_, v]) => {
      const m = v.match(/^level-(\d+)/);
      return (m && +m[1] <= 17) || v.startsWith('bingo-verified-mp-sync-');
    })
    .map(([k]) => k),
);

console.log('=== LIVE Level 6 (all 10) ===');
getWorldCupBingoQuestionsByLevel(6).forEach((q, i) => {
  const mp = extractNativeMpId(q.id);
  const cat = q.sourceCategory ?? q.category;
  console.log(`Q${i + 1}: [${cat}] ${(q.question ?? '').replace(/\s+/g, ' ').slice(0, 75)}`);
});

console.log('\n=== Synced missing-player pitch edits ===');
ORDERED_WORLD_CUP_BINGO_QUESTIONS.forEach((q, i) => {
  const mp = extractNativeMpId(q.id);
  if (!mp || !SYNCED_MP.has(mp)) return;
  if (q.sourceCategory !== 'missing-player') return;
  const level = Math.floor(i / 10) + 1;
  const qNum = (i % 10) + 1;
  const snippet = (q.question ?? '').match(/\d{4}[^—]*—\s*([^—]+)—/)?.[1]?.trim() ?? '';
  const def = mp ? BINGO_MP_LINEUP_OVERRIDES[mp] : '';
  console.log(`Bingo Level ${level} Question ${qNum} — ${snippet}${def ? ` (from ${def})` : ''}`);
});

#!/usr/bin/env npx vite-node
/**
 * Missing Player L18 ↔ World Cup Bingo fixture cross-check (live app data).
 * Run: npx vite-node scripts/audit-mp-18-bingo.mts
 */
import { ORDERED_WORLD_CUP_BINGO_QUESTIONS } from '../src/data/worldCupBingoQuestions.ts';
import {
  BINGO_MP_LINEUP_OVERRIDES,
  extractNativeMpId,
} from '../src/data/bingoMpLineupCatalog.ts';
import { LEVEL_18 } from '../src/data/missingPlayerLineupLevels18.frozen.ts';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt.ts';
import type { MissingPlayerLineupMatchDef } from '../src/data/missingPlayerLineupMatchTypes.ts';

const fold = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/west germany/g, 'germany')
    .replace(/republic of ireland/g, 'ireland');

function teamsMatch(a: string, b: string, c: string, d: string): boolean {
  const t1 = fold(a);
  const t2 = fold(b);
  const u1 = fold(c);
  const u2 = fold(d);
  return (t1 === u1 && t2 === u2) || (t1 === u2 && t2 === u1);
}

type BingoHit = {
  bingoLevel: number;
  bingoQuestion: number;
  bingoId: string;
  promptSnippet: string;
  overrideDefId: string | null;
  coordsSynced: boolean;
};

function findBingoHits(def: MissingPlayerLineupMatchDef): BingoHit[] {
  const hits: BingoHit[] = [];

  ORDERED_WORLD_CUP_BINGO_QUESTIONS.forEach((q, i) => {
    if (q.sourceCategory !== 'missing-player') return;
    const parsed = parseMissingPlayerPromptForBingo(q.question ?? '');
    if (!parsed) return;
    if (parsed.year !== def.year) return;
    if (fold(parsed.team) !== fold(def.focusTeam)) return;

    const matchup = parsed.matchup.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
    const parts = matchup.split(/\s+vs\.?\s+/i);
    if (parts.length !== 2) return;
    const [a, b] = parts;
    if (!teamsMatch(a, b, def.team1, def.team2)) return;

    const mpId = extractNativeMpId(q.id);
    const overrideDefId = mpId ? BINGO_MP_LINEUP_OVERRIDES[mpId] ?? null : null;
    const coordsSynced = overrideDefId === def.id;

    hits.push({
      bingoLevel: Math.floor(i / 10) + 1,
      bingoQuestion: (i % 10) + 1,
      bingoId: q.id,
      promptSnippet: (q.question ?? '').replace(/\s+/g, ' ').slice(0, 90),
      overrideDefId,
      coordsSynced,
    });
  });

  return hits;
}

console.log('Missing Player Level 18 ↔ World Cup Bingo (live fixtures)\n');
console.log('HOW TO OPEN:');
console.log('  Missing Player  → /missing-player/18  then Question #');
console.log('  World Cup Bingo → /game/world-cup-bingo?level={L}&timer=false  then Question #\n');

let anyHit = false;

LEVEL_18.forEach((def, i) => {
  const mpQuestion = i + 1;
  const fixture = `${def.focusTeam} — ${def.team1} vs ${def.team2} (${def.year})`;
  const hits = findBingoHits(def);

  console.log(`MP L18 Q${mpQuestion}: ${fixture}`);
  console.log(`  Match id: ${def.id}`);

  if (hits.length === 0) {
    console.log('  Bingo: — (no matching missing-player row in any Bingo level)\n');
    return;
  }

  anyHit = true;
  for (const h of hits) {
    const sync = h.coordsSynced
      ? 'SAME lineup override (level-*-match-*)'
      : h.overrideDefId
        ? `override points elsewhere: ${h.overrideDefId}`
        : 'fixture only — no pitch override yet';
    console.log(`  Bingo L${h.bingoLevel} Q${h.bingoQuestion} [${h.bingoId}] — ${sync}`);
  }
  console.log('');
});

if (!anyHit) {
  console.log('No Level 18 fixtures appear in World Cup Bingo missing-player pool.');
  console.log('Safe to continue Missing Player levels 19–20 without Bingo sync for L18.');
}

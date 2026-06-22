#!/usr/bin/env npx vite-node
/**
 * Side-by-side list: Missing Player L1–17 ↔ World Cup Bingo (live app data).
 * Run: npx vite-node scripts/list-bingo-mp-compare.mts
 */
import { ORDERED_WORLD_CUP_BINGO_QUESTIONS } from '../src/data/worldCupBingoQuestions.ts';
import {
  BINGO_MP_LINEUP_OVERRIDES,
  extractNativeMpId,
} from '../src/data/bingoMpLineupCatalog.ts';
import { getMissingPlayerLineupQuestionsForLevel1to6 } from '../src/data/missingPlayerLineupLevels1to6.frozen.ts';
import { getMissingPlayerLineupQuestionsForLevel } from '../src/data/missingPlayerLineupLevels7to17.ts';
import { LEVEL_7 } from '../src/data/missingPlayerLineupLevels7.frozen.ts';
import { LEVEL_8 } from '../src/data/missingPlayerLineupLevels8.frozen.ts';
import { LEVEL_9 } from '../src/data/missingPlayerLineupLevels9.frozen.ts';
import { LEVEL_10 } from '../src/data/missingPlayerLineupLevels10.frozen.ts';
import { LEVEL_11 } from '../src/data/missingPlayerLineupLevels11.frozen.ts';
import { LEVEL_12 } from '../src/data/missingPlayerLineupLevels12.frozen.ts';
import { LEVEL_13 } from '../src/data/missingPlayerLineupLevels13.frozen.ts';
import { LEVEL_14 } from '../src/data/missingPlayerLineupLevels14.frozen.ts';
import { LEVEL_15 } from '../src/data/missingPlayerLineupLevels15.frozen.ts';
import { LEVEL_16 } from '../src/data/missingPlayerLineupLevels16.frozen.ts';
import { LEVEL_17 } from '../src/data/missingPlayerLineupLevels17.frozen.ts';
import { BINGO_MISSING_PLAYER_LINEUP_VERIFIED_FIXTURES } from '../src/data/bingoMissingPlayerLineupVerifiedFixtures.ts';
import type { MissingPlayerLineupMatchDef } from '../src/data/missingPlayerLineupMatchTypes.ts';

const FROZEN_BY_LEVEL: Record<number, MissingPlayerLineupMatchDef[]> = {
  7: LEVEL_7,
  8: LEVEL_8,
  9: LEVEL_9,
  10: LEVEL_10,
  11: LEVEL_11,
  12: LEVEL_12,
  13: LEVEL_13,
  14: LEVEL_14,
  15: LEVEL_15,
  16: LEVEL_16,
  17: LEVEL_17,
};

type MpLoc = { mpLevel: number; mpQuestion: number; fixture: string };

function buildDefIdToMpLoc(): Map<string, MpLoc> {
  const map = new Map<string, MpLoc>();

  for (let lv = 1; lv <= 6; lv++) {
    const qs = getMissingPlayerLineupQuestionsForLevel1to6(lv);
    qs.forEach((q, i) => {
      const fixture = q.match.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
      map.set(`level-${lv}-q-${q.id}`, { mpLevel: lv, mpQuestion: i + 1, fixture });
    });
  }

  for (let lv = 7; lv <= 17; lv++) {
    const defs = FROZEN_BY_LEVEL[lv] ?? [];
    defs.forEach((d, i) => {
      const fixture = `${d.team1} vs ${d.team2} (${d.year})`;
      map.set(d.id, { mpLevel: lv, mpQuestion: i + 1, fixture });
    });
  }

  return map;
}

function isSyncedOverride(defId: string): boolean {
  if (defId.startsWith('bingo-verified-mp-sync-')) return true;
  const m = defId.match(/^level-(\d+)/);
  return m != null && +m[1]! <= 17;
}

function fixtureFromBingoQuestion(q: string): string {
  const m = q.match(/\d{4}[^—]*—\s*([^—]+)—/);
  return m?.[1]?.trim() ?? q.replace(/\s+/g, ' ').slice(0, 60);
}

function mpLocForVerifiedDef(
  year: number,
  team1: string,
  team2: string,
  focusTeam: string,
): MpLoc | null {
  const fold = (s: string) => s.trim().toLowerCase();
  for (let lv = 1; lv <= 17; lv++) {
    if (lv <= 6) {
      const qs = getMissingPlayerLineupQuestionsForLevel1to6(lv);
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i]!;
        if (q.year !== year || fold(q.team) !== fold(focusTeam)) continue;
        const match = q.match.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '');
        const hasT1 = match.toLowerCase().includes(fold(team1));
        const hasT2 = match.toLowerCase().includes(fold(team2));
        if (hasT1 && hasT2) {
          return { mpLevel: lv, mpQuestion: i + 1, fixture: match.trim() };
        }
      }
    } else {
      const defs = FROZEN_BY_LEVEL[lv] ?? [];
      for (let i = 0; i < defs.length; i++) {
        const d = defs[i]!;
        if (d.year !== year || fold(d.focusTeam) !== fold(focusTeam)) continue;
        if (
          (fold(d.team1) === fold(team1) && fold(d.team2) === fold(team2)) ||
          (fold(d.team1) === fold(team2) && fold(d.team2) === fold(team1))
        ) {
          return {
            mpLevel: lv,
            mpQuestion: i + 1,
            fixture: `${d.team1} vs ${d.team2} (${d.year})`,
          };
        }
      }
    }
  }
  return null;
}

const defToMp = buildDefIdToMpLoc();
const verifiedById = new Map(BINGO_MISSING_PLAYER_LINEUP_VERIFIED_FIXTURES.map((d) => [d.id, d]));

type Row = {
  fixture: string;
  mpLevel: number;
  mpQuestion: number;
  bingoLevel: number;
  bingoQuestion: number;
};

const rows: Row[] = [];

ORDERED_WORLD_CUP_BINGO_QUESTIONS.forEach((q, i) => {
  if (q.sourceCategory !== 'missing-player') return;
  const mpId = extractNativeMpId(q.id);
  if (!mpId) return;
  const defId = BINGO_MP_LINEUP_OVERRIDES[mpId];
  if (!defId || !isSyncedOverride(defId)) return;

  const bingoLevel = Math.floor(i / 10) + 1;
  const bingoQuestion = (i % 10) + 1;
  const fixture = fixtureFromBingoQuestion(q.question ?? '');

  let loc = defToMp.get(defId);
  if (!loc && defId.startsWith('bingo-verified-mp-sync-')) {
    const v = verifiedById.get(defId);
    if (v) {
      loc = mpLocForVerifiedDef(v.year, v.team1, v.team2, v.focusTeam) ?? undefined;
    }
  }
  if (!loc) return;

  rows.push({
    fixture,
    mpLevel: loc.mpLevel,
    mpQuestion: loc.mpQuestion,
    bingoLevel,
    bingoQuestion,
  });
});

rows.sort(
  (a, b) =>
    a.mpLevel - b.mpLevel ||
    a.mpQuestion - b.mpQuestion ||
    a.bingoLevel - b.bingoLevel,
);

console.log(`Compare list: ${rows.length} pairs (from live app code)\n`);
console.log('HOW TO OPEN:');
console.log('  Missing Player  → /missing-player/{level}  then tap to Question #');
console.log('  World Cup Bingo → /game/world-cup-bingo?level={level}&timer=false  then tap to Question #\n');

rows.forEach((r, idx) => {
  console.log(`${String(idx + 1).padStart(2, ' ')}. ${r.fixture}`);
  console.log(`    Missing Player:  Level ${r.mpLevel}, Question ${r.mpQuestion}`);
  console.log(`    World Cup Bingo: Level ${r.bingoLevel}, Question ${r.bingoQuestion}`);
  console.log('');
});

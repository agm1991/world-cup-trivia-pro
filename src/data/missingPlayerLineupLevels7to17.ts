/**
 * Missing Player mode — levels 7–30: 10 matches per level, 2–3 blanks per match.
 * focusTeam is always team1 or team2; lineups are starters for that side in the stated match.
 */

import {
  LEVEL_10,
  LEVEL_11,
  LEVEL_12,
  LEVEL_13,
  LEVEL_14,
  LEVEL_15,
  LEVEL_16,
  LEVEL_17,
  LEVEL_18,
  LEVEL_19,
  LEVEL_20,
  LEVEL_21,
  LEVEL_22,
  LEVEL_23,
  LEVEL_24,
  LEVEL_25,
  LEVEL_26,
  LEVEL_27,
  LEVEL_28,
  LEVEL_29,
  LEVEL_30,
} from './missingPlayerLineupMedium10to20';
import { LEVEL_7 } from './missingPlayerLineupLevels7.frozen';
import { LEVEL_8 } from './missingPlayerLineupLevels8.frozen';
import { LEVEL_9 } from './missingPlayerLineupLevels9.frozen';
import type {
  MissingPlayerLineupMatchDef,
  MissingPlayerLineupGameQuestion,
} from './missingPlayerLineupMatchTypes';
import { getMissingPlayerTeamFlag } from '@/lib/countryFlags';

export type {
  MissingPlayerLineupSlot,
  MissingPlayerLineupMatchDef,
  MissingPlayerLineupGameQuestion,
} from './missingPlayerLineupMatchTypes';

const FLAG: Record<string, string> = {
  Argentina: '🇦🇷',
  Austria: '🇦🇹',
  Australia: '🇦🇺',
  Belgium: '🇧🇪',
  Brazil: '🇧🇷',
  Cameroon: '🇨🇲',
  Chile: '🇨🇱',
  Colombia: '🇨🇴',
  'Costa Rica': '🇨🇷',
  Croatia: '🇭🇷',
  Denmark: '🇩🇰',
  Ecuador: '🇪🇨',
  England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Ghana: '🇬🇭',
  Greece: '🇬🇷',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Mexico: '🇲🇽',
  Netherlands: '🇳🇱',
  Nigeria: '🇳🇬',
  Paraguay: '🇵🇾',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Russia: '🇷🇺',
  'Saudi Arabia': '🇸🇦',
  Senegal: '🇸🇳',
  Serbia: '🇷🇸',
  Slovakia: '🇸🇰',
  'South Korea': '🇰🇷',
  Spain: '🇪🇸',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Turkey: '🇹🇷',
  Ukraine: '🇺🇦',
  Uruguay: '🇺🇾',
  USA: '🇺🇸',
  Morocco: '🇲🇦',
  Iran: '🇮🇷',
  Tunisia: '🇹🇳',
  Algeria: '🇩🇿',
  Angola: '🇦🇴',
  'Bosnia and Herzegovina': '🇧🇦',
  China: '🇨🇳',
  'Czech Republic': '🇨🇿',
  Iceland: '🇮🇸',
  Ireland: '🇮🇪',
  'Ivory Coast': '🇨🇮',
  'New Zealand': '🇳🇿',
  'South Africa': '🇿🇦',
  Slovenia: '🇸🇮',
  Qatar: '🇶🇦',
  Togo: '🇹🇬',
  'Trinidad and Tobago': '🇹🇹',
  Romania: '🇷🇴',
  Bulgaria: '🇧🇬',
  'West Germany': '🇩🇪',
  Czechoslovakia: '🇨🇿',
  Yugoslavia: '🇷🇸',
  'Soviet Union': '🇷🇺',
  Zaire: '🇨🇩',
  Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  Norway: '🇳🇴',
  'Northern Ireland': getMissingPlayerTeamFlag('Northern Ireland'),
  Peru: '🇵🇪',
  'East Germany': '🇩🇪',
  Hungary: '🇭🇺',
  'Republic of Ireland': '🇮🇪',
  'North Korea': '🇰🇵',
  Honduras: '🇭🇳',
  'El Salvador': '🇸🇻',
  Bolivia: '🇧🇴',
  Egypt: '🇪🇬',
  Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Dutch East Indies': '🇮🇩',
};

function assertFocus(m: MissingPlayerLineupMatchDef): void {
  if (m.focusTeam !== m.team1 && m.focusTeam !== m.team2) {
    throw new Error(`focusTeam must be team1 or team2: ${m.id}`);
  }
  const tlen = m.targetPlayers.length;
  if (tlen !== 2 && tlen !== 3) throw new Error(`Need 2 or 3 targetPlayers: ${m.id}`);
  const keys = new Set(m.slots.map((s) => s.key));
  for (const t of m.targetPlayers) {
    if (!keys.has(t)) throw new Error(`targetPlayers must match slot keys: ${m.id}`);
  }
  if (m.slots.length !== 11) throw new Error(`Need 11 slots: ${m.id}`);
}

export function missingPlayerMatchDefToGameQuestion(
  numericId: number,
  m: MissingPlayerLineupMatchDef,
): MissingPlayerLineupGameQuestion {
  assertFocus(m);
  const f = getMissingPlayerTeamFlag(m.focusTeam);
  const f1 = getMissingPlayerTeamFlag(m.team1);
  const f2 = getMissingPlayerTeamFlag(m.team2);
  const targets = m.targetPlayers;
  const targetSet = new Set<string>(targets);
  const mi: number[] = [];
  m.slots.forEach((s, i) => {
    if (targetSet.has(s.key)) mi.push(i);
  });
  if (mi.length !== targets.length) throw new Error(`Missing indices: ${m.id}`);
  const positions = m.slots.map((s) => ({
    name: targetSet.has(s.key) ? '???' : s.displayName,
    flag: f,
    x: s.x,
    y: s.y,
  }));
  const match = `${m.team1} vs ${m.team2} - ${m.year} World Cup ${m.stage}`;
  return {
    id: numericId,
    match,
    year: m.year,
    team: m.focusTeam,
    teamFlag: f,
    team1: m.team1,
    team2: m.team2,
    team1Flag: f1,
    team2Flag: f2,
    positions,
    missingIndex: mi[0],
    missingIndex2: mi[1],
    missingIndex3: targets.length === 3 ? mi[2] : undefined,
    optionA: m.optionA,
    optionB: m.optionB,
    optionC: m.optionC,
    optionD: m.optionD,
    correctAnswer: m.correctAnswer,
    hint1: m.hint1,
    hint2: m.hint2,
    hint3: m.hint3,
  };
}

function levelToMatches(
  level: number,
  defs: MissingPlayerLineupMatchDef[],
): MissingPlayerLineupGameQuestion[] {
  if (defs.length !== 10) {
    throw new Error(`Level ${level} must have exactly 10 matches, got ${defs.length}`);
  }
  return defs.map((d, i) => missingPlayerMatchDefToGameQuestion(level * 1000 + i + 1, d));
}

// ——— Level 7 ——— FROZEN in missingPlayerLineupLevels7.frozen.ts

// ——— Level 8 ——— FROZEN in missingPlayerLineupLevels8.frozen.ts

// ——— Level 9 ——— FROZEN in missingPlayerLineupLevels9.frozen.ts

export const MISSING_PLAYER_LINEUP_LEVELS_7_TO_20: Record<number, MissingPlayerLineupGameQuestion[]> = {
  7: levelToMatches(7, LEVEL_7),
  8: levelToMatches(8, LEVEL_8),
  9: levelToMatches(9, LEVEL_9),
  10: levelToMatches(10, LEVEL_10),
  11: levelToMatches(11, LEVEL_11),
  12: levelToMatches(12, LEVEL_12),
  13: levelToMatches(13, LEVEL_13),
  14: levelToMatches(14, LEVEL_14),
  15: levelToMatches(15, LEVEL_15),
  16: levelToMatches(16, LEVEL_16),
  17: levelToMatches(17, LEVEL_17),
  18: levelToMatches(18, LEVEL_18),
  19: levelToMatches(19, LEVEL_19),
  20: levelToMatches(20, LEVEL_20),
  21: levelToMatches(21, LEVEL_21),
  22: levelToMatches(22, LEVEL_22),
  23: levelToMatches(23, LEVEL_23),
  24: levelToMatches(24, LEVEL_24),
  25: levelToMatches(25, LEVEL_25),
  26: levelToMatches(26, LEVEL_26),
  27: levelToMatches(27, LEVEL_27),
  28: levelToMatches(28, LEVEL_28),
  29: levelToMatches(29, LEVEL_29),
  30: levelToMatches(30, LEVEL_30),
};

/** @deprecated Use MISSING_PLAYER_LINEUP_LEVELS_7_TO_20 */
export const MISSING_PLAYER_LINEUP_LEVELS_7_TO_17 = MISSING_PLAYER_LINEUP_LEVELS_7_TO_20;

export function getMissingPlayerLineupQuestionsForLevel(
  level: number,
): MissingPlayerLineupGameQuestion[] {
  if (level < 7 || level > 30) return [];
  return MISSING_PLAYER_LINEUP_LEVELS_7_TO_20[level] ?? [];
}

/** Used by bingo missing-player pitch catalog (levels 7–9). LEVEL_7/8 are frozen separately. */
export { LEVEL_7 } from './missingPlayerLineupLevels7.frozen';
export { LEVEL_8 } from './missingPlayerLineupLevels8.frozen';
export { LEVEL_9 } from './missingPlayerLineupLevels9.frozen';

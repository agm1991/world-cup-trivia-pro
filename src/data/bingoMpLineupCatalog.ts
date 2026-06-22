/**
 * Resolves World Cup Bingo missing-player rows to full 11-a-side pitch layouts
 * (same data as Missing Player mode levels 7–30).
 */
import type { Question } from '@/types/game';
import type { ParsedBingoMissingPlayerPrompt } from '@/lib/missingPlayerBingoPrompt';
import { getCorrectAnswerPlayerNames } from '@/lib/missingPlayerBingoAnswers';
import type { MissingPlayerPitchSlot } from '@/components/missing-player/MissingPlayerLineupPitch';
import { getMissingPlayerTeamFlag } from '@/lib/countryFlags';
import type { MissingPlayerLineupMatchDef } from './missingPlayerLineupMatchTypes';
import { BINGO_MISSING_PLAYER_LINEUP_SUPPLEMENTS } from './bingoMissingPlayerLineupSupplements';
import { BINGO_MISSING_PLAYER_LINEUP_VERIFIED_FIXTURES } from './bingoMissingPlayerLineupVerifiedFixtures';
import { BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO6 } from './bingoMissingPlayerLineupFrozenL1to6';
import {
  BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204,
  BINGO_MP_FROZEN_L1TO204_OVERRIDES,
} from './bingoMissingPlayerLineupFrozenL1to204';
import { BINGO_MISSING_PLAYER_LINEUP_AUTO } from './bingoMissingPlayerLineupAuto';
import { BINGO_MP_LINEUP_OVERRIDES_GENERATED } from './bingoMissingPlayerLineupOverrides.generated';
import { LEVEL_7 } from './missingPlayerLineupLevels7.frozen';
import { LEVEL_8 } from './missingPlayerLineupLevels8.frozen';
import { LEVEL_9 } from './missingPlayerLineupLevels9.frozen';
import { LEVEL_10 } from './missingPlayerLineupLevels10.frozen';
import { LEVEL_11 } from './missingPlayerLineupLevels11.frozen';
import { LEVEL_12 } from './missingPlayerLineupLevels12.frozen';
import { LEVEL_13 } from './missingPlayerLineupLevels13.frozen';
import { LEVEL_14 } from './missingPlayerLineupLevels14.frozen';
import { LEVEL_15 } from './missingPlayerLineupLevels15.frozen';
import { LEVEL_16 } from './missingPlayerLineupLevels16.frozen';
import { LEVEL_17 } from './missingPlayerLineupLevels17.frozen';
import { LEVEL_18 } from './missingPlayerLineupLevels18.frozen';
import {
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

/** Explicit mp-id → lineup def when auto-match is ambiguous. Manual entries win over generated. */
const BINGO_MP_MANUAL_OVERRIDES: Record<string, string> = {
  // Hard "three blanks" rows — full XI from supplements (same pitch as Missing Player mode)
  'mp-h-03': 'bingo-sup-ned-swe-1974-2nd-ned',
  'mp-h-06': 'bingo-sup-fra-wger-1982-sf-fra',
  'mp-h-07': 'bingo-sup-pol-fra-1982-3rd-pol',
  'mp-h-08': 'bingo-sup-wger-yug-1954-qf-wger',
  'mp-h-09': 'bingo-sup-ned-bul-1974-grp-ned',
  'mp-h-13': 'bingo-sup-wger-aut-1954-sf-wger',
  'mp-h-14': 'bingo-sup-pol-swe-1974-2nd-pol',
  'mp-h-15': 'bingo-sup-arg-bel-1982-grp-arg',
  'mp-h-18': 'bingo-sup-ned-swe-1974-2nd-ned',
  'mp-h-20': 'bingo-sup-col-cmr-1990-r16-col',
  'mp-h-21': 'bingo-sup-ger-bel-1994-r16-ger',
  'mp-h-23': 'bingo-sup-sui-esp-2010-grp-sui',
  'mp-easy-040': 'bingo-sup-ned-arg-2014-sf-ned',
  'mp-h-24': 'bingo-sup-ned-arg-2014-sf-ned',
  'mp-h-27': 'bingo-sup-ukr-ita-2006-qf-ukr',
  'mp-h-28': 'bingo-sup-wger-yug-1954-qf-wger',
  'mp-h-29': 'bingo-sup-yug-wger-1974-2nd-yug',
  // Broken pitch fixes (Bingo-only supplements — frozen Missing Player untouched)
  'mp-easy-044': 'bingo-sup-2014-final-arg-lavezzi',
  'mp-easy-053': 'bingo-sup-2022-semi-cro-perisic',
  'mp-easy-068': 'bingo-sup-2014-r16-ned-mex-ned',
  'mp-m-12': 'bingo-sup-1978-final-arg-passarella',
  'mp-m-13': 'bingo-sup-2014-semi-bra-silva-neymar',
  'mp-m-17': 'bingo-sup-1974-final-ned-krol-rep',
  'mp-m-20': 'bingo-sup-2002-grp-kor-pol',
  'mp-m-24': 'bingo-sup-2022-qf-bra-casemiro-paquetá',
  'mp-h-02': 'bingo-sup-1954-grp-hun-wger-hun',
  'mp-easy-020': 'bingo-sup-1998-final-fra-zidane',
  'mp-m-41': 'bingo-sup-2018-semi-fra-kante-pogba',
  'mp-m-49': 'bingo-sup-2010-r16-usa-bradley-clark',
  'mp-m-10': 'bingo-sup-1990-final-wger-kohler-littbarski',
  'mp-easy-051': 'bingo-sup-2018-final-fra-lloris',
  'mp-easy-005': 'bingo-sup-1990-semi-ita-arg-ita',
  'mp-easy-006': 'bingo-sup-1990-semi-ita-arg-ita',
  // Levels 1–21 — Wikipedia XI + aligned coords (screenshot fixes)
  'mp-easy-026': 'bingo-sup-2006-semi-ger-ita-pirlo',
  'mp-easy-030': 'bingo-sup-2006-final-ita-materazzi',
  'mp-easy-032': 'bingo-sup-2010-semi-esp-villa',
  'mp-easy-059': 'bingo-sup-2002-final-bra-kleberson',
  'mp-easy-007': 'bingo-sup-1990-semi-wger-eng-matthaus',
  'mp-m-09': 'bingo-sup-1998-final-bra-aldair-ronaldo',
  'mp-m-16': 'bingo-sup-1982-semi-pol-ita-scirea-conti',
  // Level 61 — Wikipedia XI + attacker alignment
  'mp-h-12': 'bingo-sup-1982-final-ita-gentile-tardelli-rossi',
  // Level 74 / 81 / 83 — attacker & tactics alignment
  'mp-m-21': 'bingo-verified-2018-qf-bra-bel-bel',
  'mp-e-14': 'bingo-verified-2018-r16-bel-jpn-jpn',
  // Level 181 — Uruguay 2010 QF (Wikipedia 4-2-3-1; frozen level-8 had wrong targets)
  'mp-m-26': 'bingo-sup-2010-qf-uru-gha-uru',
  // Level 182 — France 1998 semi (Zidane central AM, not RW)
  'mp-easy-016': 'bingo-sup-1998-semi-fra-cro-fra',
  // Level 183 — Germany 2006 semi (4-4-2; Frings/Borowski started, Schweinsteiger/Ballack missing)
  'mp-m-45': 'bingo-sup-2006-semi-ger-ita-ger',
};

export const BINGO_MP_LINEUP_OVERRIDES: Record<string, string> = {
  ...BINGO_MP_LINEUP_OVERRIDES_GENERATED,
  ...BINGO_MP_MANUAL_OVERRIDES,
  ...BINGO_MP_FROZEN_L1TO204_OVERRIDES,
};

const ALL_LINEUP_DEFS: MissingPlayerLineupMatchDef[] = [
  ...LEVEL_7,
  ...LEVEL_8,
  ...LEVEL_9,
  ...LEVEL_10,
  ...LEVEL_11,
  ...LEVEL_12,
  ...LEVEL_13,
  ...LEVEL_14,
  ...LEVEL_15,
  ...LEVEL_16,
  ...LEVEL_17,
  ...LEVEL_18,
  ...LEVEL_19,
  ...LEVEL_20,
  ...LEVEL_21,
  ...LEVEL_22,
  ...LEVEL_23,
  ...LEVEL_24,
  ...LEVEL_25,
  ...LEVEL_26,
  ...LEVEL_27,
  ...LEVEL_28,
  ...LEVEL_29,
  ...LEVEL_30,
  ...BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO6,
  ...BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204,
  ...BINGO_MISSING_PLAYER_LINEUP_SUPPLEMENTS,
  ...BINGO_MISSING_PLAYER_LINEUP_VERIFIED_FIXTURES,
  ...BINGO_MISSING_PLAYER_LINEUP_AUTO,
];

const DEF_BY_ID = new Map(ALL_LINEUP_DEFS.map((d) => [d.id, d]));

export function extractNativeMpId(questionId: string): string | null {
  const embedded = questionId.match(/(mp-(?:easy-\d+|e-\d+|m-\d+|h-\d+))/);
  if (embedded) return embedded[1]!;
  return questionId.startsWith('mp-') ? questionId : null;
}

function normalizeTeam(name: string): string {
  return name.trim().toLowerCase();
}

function foldName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

function surnameOf(name: string): string {
  const parts = foldName(name).split(/\s+/);
  return parts[parts.length - 1] ?? foldName(name);
}

function playerNameMatches(displayName: string, answerName: string): boolean {
  const a = foldName(answerName);
  const d = foldName(displayName);
  if (!a || !d) return false;
  if (d === a) return true;
  if (d.includes(a) || a.includes(d)) return true;
  const aParts = a.split(/\s+/).filter(Boolean);
  const dParts = d.split(/\s+/).filter(Boolean);
  // Avoid false positives when two starters share a surname (e.g. Álvaro vs Máximo Pereira).
  if (aParts.length >= 2 && dParts.length >= 2) {
    const aFirst = aParts[0]!;
    const dFirst = dParts[0]!;
    if (aFirst !== dFirst && aFirst[0] !== dFirst[0]) return false;
  }
  const sa = surnameOf(d);
  const sb = surnameOf(a);
  if (sa === sb) return true;
  if (sa.length >= 4 && sb.length >= 4 && (sa.startsWith(sb.slice(0, 4)) || sb.startsWith(sa.slice(0, 4)))) {
    return true;
  }
  return false;
}

function teamsMatch(
  def: MissingPlayerLineupMatchDef,
  t1: string,
  t2: string,
): boolean {
  const a = normalizeTeam(def.team1);
  const b = normalizeTeam(def.team2);
  const n1 = normalizeTeam(t1);
  const n2 = normalizeTeam(t2);
  return (a === n1 && b === n2) || (a === n2 && b === n1);
}

function targetKeysFromAnswer(
  def: MissingPlayerLineupMatchDef,
  answerNames: string[],
): string[] {
  const keys: string[] = [];
  for (const name of answerNames) {
    const slot = def.slots.find((s) => playerNameMatches(s.displayName, name));
    if (slot) keys.push(slot.key);
  }
  return keys;
}

/** Full XI pitch — same rendering as Missing Player mode (flags + gold ?). */
export function lineupDefToPitchSlots(
  def: MissingPlayerLineupMatchDef,
  answerNames: string[],
): MissingPlayerPitchSlot[] | null {
  const targetKeys = new Set(targetKeysFromAnswer(def, answerNames));
  if (targetKeys.size < 1) return null;

  const flag = getMissingPlayerTeamFlag(def.focusTeam);
  return def.slots.map((s) => ({
    name: targetKeys.has(s.key) ? '???' : s.displayName,
    flag,
    x: s.x,
    y: s.y,
    isMissing: targetKeys.has(s.key),
  }));
}

function scoreDefForAnswer(def: MissingPlayerLineupMatchDef, answerNames: string[]): number {
  return answerNames.filter((n) =>
    def.slots.some((s) => playerNameMatches(s.displayName, n)),
  ).length;
}

function visibleXiNames(parsed: ParsedBingoMissingPlayerPrompt): string[] {
  return parsed.slots
    .filter((s) => !s.isMissing)
    .map((s) => s.label.replace(/\?+$/, '').replace(/___/g, '').trim())
    .filter(Boolean);
}

function scoreDefForVisibleXi(
  def: MissingPlayerLineupMatchDef,
  visibleNames: string[],
): number {
  return visibleNames.filter((n) =>
    def.slots.some((s) => playerNameMatches(s.displayName, n)),
  ).length;
}

function scoreDefForCatalogMatch(
  def: MissingPlayerLineupMatchDef,
  answerNames: string[],
  visibleNames: string[],
): number {
  const answerScore = scoreDefForAnswer(def, answerNames);
  const visibleScore = scoreDefForVisibleXi(def, visibleNames);
  if (answerScore >= 1) return answerScore + 100;
  if (visibleScore >= 7) return visibleScore;
  return 0;
}

/**
 * Returns a full Missing Player pitch def for this bingo row, or null.
 */
export function findBingoMpLineupPitch(
  parsed: ParsedBingoMissingPlayerPrompt,
  question: Question,
): MissingPlayerPitchSlot[] | null {
  const answerNames = getCorrectAnswerPlayerNames(question);
  if (answerNames.length < 1) return null;

  const mpId = extractNativeMpId(question.id);
  const overrideId = mpId ? BINGO_MP_LINEUP_OVERRIDES[mpId] : undefined;
  if (overrideId) {
    const def = DEF_BY_ID.get(overrideId);
    if (def) {
      const pitch = lineupDefToPitchSlots(def, answerNames);
      if (pitch) return pitch;
    }
  }

  const year = parseInt(parsed.year, 10);
  if (!Number.isFinite(year)) return null;

  const parts = parsed.matchup.split(/\s+vs\s+/i).map((s) => s.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const focus = normalizeTeam(parsed.team);
  const fixtureDefs = ALL_LINEUP_DEFS.filter(
    (d) => d.year === year && teamsMatch(d, parts[0]!, parts[1]!),
  );
  const candidates = fixtureDefs.filter((d) => normalizeTeam(d.focusTeam) === focus);
  const pool = candidates.length > 0 ? candidates : fixtureDefs;

  const visibleNames = visibleXiNames(parsed);

  let best: MissingPlayerLineupMatchDef | null = null;
  let bestScore = -1;
  for (const def of pool) {
    const score = scoreDefForCatalogMatch(def, answerNames, visibleNames);
    if (score > bestScore) {
      bestScore = score;
      best = def;
    }
  }

  if (best && bestScore >= 1) {
    return lineupDefToPitchSlots(best, answerNames);
  }

  // Same fixture + focus: try every candidate (handles accent / spelling mismatches).
  for (const def of pool) {
    const pitch = lineupDefToPitchSlots(def, answerNames);
    if (pitch) return pitch;
  }

  // Fixture only: best-effort XI when focus label differs slightly (e.g. "West Germany").
  for (const def of fixtureDefs) {
    const pitch = lineupDefToPitchSlots(def, answerNames);
    if (pitch) return pitch;
  }

  return null;
}

/** Resolved lineup def for a bingo missing-player row (for freeze tooling). */
export function findBingoMpLineupDef(
  parsed: ParsedBingoMissingPlayerPrompt,
  question: Question,
): MissingPlayerLineupMatchDef | null {
  const answerNames = getCorrectAnswerPlayerNames(question);
  if (answerNames.length < 1) return null;

  const mpId = extractNativeMpId(question.id);
  const overrideId = mpId ? BINGO_MP_LINEUP_OVERRIDES[mpId] : undefined;
  if (overrideId) {
    const def = DEF_BY_ID.get(overrideId);
    if (def && lineupDefToPitchSlots(def, answerNames)) return def;
  }

  const year = parseInt(parsed.year, 10);
  if (!Number.isFinite(year)) return null;

  const parts = parsed.matchup.split(/\s+vs\s+/i).map((s) => s.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  const focus = normalizeTeam(parsed.team);
  const fixtureDefs = ALL_LINEUP_DEFS.filter(
    (d) => d.year === year && teamsMatch(d, parts[0]!, parts[1]!),
  );
  const candidates = fixtureDefs.filter((d) => normalizeTeam(d.focusTeam) === focus);
  const pool = candidates.length > 0 ? candidates : fixtureDefs;
  const visibleNames = visibleXiNames(parsed);

  let best: MissingPlayerLineupMatchDef | null = null;
  let bestScore = -1;
  for (const def of pool) {
    const score = scoreDefForCatalogMatch(def, answerNames, visibleNames);
    if (score > bestScore) {
      bestScore = score;
      best = def;
    }
  }

  if (best && bestScore >= 1 && lineupDefToPitchSlots(best, answerNames)) return best;

  for (const def of pool) {
    if (lineupDefToPitchSlots(def, answerNames)) return def;
  }
  for (const def of fixtureDefs) {
    if (lineupDefToPitchSlots(def, answerNames)) return def;
  }

  return null;
}

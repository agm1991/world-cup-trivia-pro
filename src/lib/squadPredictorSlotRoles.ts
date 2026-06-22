import type { MockPlayer, SquadPosition } from '@/data/squadPredictorMockPlayers';
import type { FootballRoleCode } from '@/data/squadPredictorPlayerRoleHints';
import { lookupFootballRoleForPlayerName } from '@/data/squadPredictorExpandedTacticalRoles';
import { isValidFormation, type SquadPredictorFormationId } from '@/lib/squadPredictorFormations';

/** When a player has no explicit role hint, allow any natural role in that outfield line. */
export type PlayerRoleForMatch = FootballRoleCode | 'DEF_ANY' | 'MID_ANY' | 'FWD_ANY';

const DEF_SLOTS = new Set<FootballRoleCode>(['CB', 'LB', 'RB', 'LWB', 'RWB']);
const MID_SLOTS = new Set<FootballRoleCode>(['DM', 'DMC', 'CM', 'AMC']);
const FWD_SLOTS = new Set<FootballRoleCode>(['LW', 'RW', 'LF', 'RF', 'ST', 'CF', 'SS']);

/** Holding / box-to-central roles — interchangeable with each other, but not with AMC (#10) slots. */
const DEEP_CENTRAL = new Set<FootballRoleCode>(['DM', 'DMC', 'CM']);
const STRIKERISH = new Set<FootballRoleCode>(['ST', 'CF', 'SS']);

/**
 * Each starting slot expects one tactical role. Order matches `PITCH_SLOTS_BY_FORMATION`
 * (GK, then defensive line left-to-right, then midfield, then attack).
 */
export const STARTING_SLOT_ROLES: Record<SquadPredictorFormationId, readonly FootballRoleCode[]> = {
  '4-3-3': ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW'],
  '4-4-2': ['GK', 'LB', 'CB', 'CB', 'RB', 'LW', 'CM', 'CM', 'RW', 'ST', 'ST'],
  '3-5-2': ['GK', 'CB', 'CB', 'CB', 'LWB', 'CM', 'CM', 'CM', 'RWB', 'ST', 'ST'],
  '4-2-3-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'DM', 'DM', 'LW', 'AMC', 'RW', 'ST'],
  '5-3-2': ['GK', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'CM', 'ST', 'ST'],
  '3-4-3': ['GK', 'CB', 'CB', 'CB', 'LW', 'CM', 'CM', 'RW', 'LW', 'ST', 'RW'],
  '4-1-4-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'DM', 'LW', 'CM', 'CM', 'RW', 'ST'],
  '4-5-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'LW', 'CM', 'AMC', 'CM', 'RW', 'ST'],
  '3-4-2-1': ['GK', 'CB', 'CB', 'CB', 'LW', 'CM', 'CM', 'RW', 'SS', 'SS', 'ST'],
  '4-3-2-1': ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'SS', 'SS', 'ST'],
} as const;

export function getStartingSlotRole(formation: string, slotIndex: number): FootballRoleCode {
  const id = (isValidFormation(formation) ? formation : '4-3-3') as SquadPredictorFormationId;
  const row = STARTING_SLOT_ROLES[id] ?? STARTING_SLOT_ROLES['4-3-3'];
  const code = row[slotIndex];
  if (!code) return 'CM';
  return code;
}

export function getPlayerRoleForMatch(
  name: string,
  squadPosition: SquadPosition,
  tactical?: FootballRoleCode,
  nation?: string,
): PlayerRoleForMatch {
  const explicit = lookupFootballRoleForPlayerName(name, tactical, nation);
  if (explicit) return explicit;
  if (squadPosition === 'GK') return 'GK';
  if (squadPosition === 'DEF') return 'DEF_ANY';
  if (squadPosition === 'MID') return 'MID_ANY';
  return 'FWD_ANY';
}

export function footballRoleFitsSlot(player: PlayerRoleForMatch, slot: FootballRoleCode): boolean {
  /** Unhinted defenders: only unknown CBs — full-backs / wing-backs need an explicit role. */
  if (player === 'DEF_ANY') return slot === 'CB';
  /** Unhinted midfielders: deep / central only — not AMC or wings. */
  if (player === 'MID_ANY') return DEEP_CENTRAL.has(slot);
  /** Unhinted forwards: striker line / second striker — wings need explicit LW/RW/LF/RF. */
  if (player === 'FWD_ANY') return STRIKERISH.has(slot);

  const p = player;

  if (p === slot) return true;

  // LB / RB (and wing-backs): full-back slots stay paired with their side + WB overlap
  if (slot === 'LB' && (p === 'LB' || p === 'LWB')) return true;
  if (slot === 'RB' && (p === 'RB' || p === 'RWB')) return true;
  if (slot === 'LWB' && (p === 'LWB' || p === 'LB')) return true;
  if (slot === 'RWB' && (p === 'RWB' || p === 'RB')) return true;

  /** Attacking mids (#10): AMC slots only — not striker line or deeper mids. */
  if (p === 'AMC') {
    return slot === 'AMC';
  }

  /** DM / DMC / CM — each can cover the other deep roles, but not AMC-only slots. */
  if (DEEP_CENTRAL.has(p) && DEEP_CENTRAL.has(slot)) return true;

  // LW and RW can play on either wing slot
  if ((p === 'LW' || p === 'RW') && (slot === 'LW' || slot === 'RW')) return true;

  // LF / RF stay on their side (LW/LF or RW/RF slots)
  if ((p === 'LW' || p === 'LF') && (slot === 'LW' || slot === 'LF')) return true;
  if ((p === 'RW' || p === 'RF') && (slot === 'RW' || slot === 'RF')) return true;

  // CF can lead the line (ST/CF/SS) or drop into AMC
  if (p === 'CF' && (STRIKERISH.has(slot) || slot === 'AMC')) return true;

  if (STRIKERISH.has(p) && STRIKERISH.has(slot)) return true;

  return false;
}

const ROLE_LABEL_EN: Partial<Record<FootballRoleCode, string>> = {
  GK: 'goalkeeper',
  CB: 'center back',
  LB: 'left back',
  RB: 'right back',
  LWB: 'left wing-back',
  RWB: 'right wing-back',
  DM: 'defensive midfielder',
  DMC: 'defensive midfielder',
  CM: 'central midfielder',
  AMC: 'attacking midfielder',
  LW: 'left winger',
  RW: 'right winger',
  LF: 'left forward',
  RF: 'right forward',
  CF: 'center forward',
  ST: 'striker',
  SS: 'second striker',
};

export function describeStartingSlotRole(slot: FootballRoleCode): string {
  return ROLE_LABEL_EN[slot] ?? slot.toLowerCase();
}

/** Whether this player’s tactical role fits the starting slot for the given formation. */
export function playerFitsStartingSlot(formation: string, slotIndex: number, player: MockPlayer): boolean {
  const pr = getPlayerRoleForMatch(player.name, player.position, player.tactical, player.nation);
  const slot = getStartingSlotRole(formation, slotIndex);
  return footballRoleFitsSlot(pr, slot);
}

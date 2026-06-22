import { findPlayerInNation } from '@/data/squadPredictorMockPlayers';
import type { AwardPoolEntry } from '@/data/squadPredictor2026AwardPool';
import {
  squadPositionFromFootballRole,
  type HintSquadPosition,
} from '@/data/squadPredictorPlayerRoleHints';

/** Parse stored label `Name (Nation)` → bare player name. */
export function playerNameFromAwardLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** Nation segment from `Name (Nation)` picks; undefined if not in that form. */
export function nationFromPlayerAwardLabel(label: string): string | undefined {
  const m = label.match(/\(([^)]+)\)\s*$/);
  return m?.[1]?.trim();
}

/**
 * Primary position bucket: explicit football role first (LW/RW/LF/RF→FWD; CM/DMC/AMC→MID; CB/LB→DEF),
 * else roster position from the 35-man mock pool.
 */
export function awardPositionBucket(playerName: string, nation: string): HintSquadPosition | undefined {
  const fromRole = squadPositionFromFootballRole(playerName);
  if (fromRole) return fromRole;
  const mp = findPlayerInNation(playerName, nation);
  return mp?.position;
}

export type AwardPositionFilter = 'DEF' | 'MID' | 'FWD';

export function filterAwardPoolByNationAndPosition(
  items: AwardPoolEntry[],
  nation: string,
  position: AwardPositionFilter,
): AwardPoolEntry[] {
  if (!nation) return [];
  return items.filter((item) => {
    if (item.nation !== nation) return false;
    const raw = playerNameFromAwardLabel(item.label);
    const bucket = awardPositionBucket(raw, nation);
    if (!bucket || bucket === 'GK') return false;
    return bucket === position;
  });
}

/** Keepers only (GK from role hints or 35-man roster position). */
export function filterAwardPoolGoalkeepers(items: AwardPoolEntry[], nation: string): AwardPoolEntry[] {
  if (!nation) return [];
  return items.filter((item) => {
    if (item.nation !== nation) return false;
    const raw = playerNameFromAwardLabel(item.label);
    const bucket = awardPositionBucket(raw, nation);
    return bucket === 'GK';
  });
}

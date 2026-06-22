import { findPlayerInNation, type SquadPosition } from '@/data/squadPredictorMockPlayers';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import type { SquadPayload } from '@/pages/squadPredictorHubTypes';

/** Same shape as pitch slot cards — defined here so lib code never imports `Pitch` (avoids circular init). */
export type SquadPlayerSlotFace = {
  shortName: string;
  flag: string;
  position: SquadPosition;
  nationLabel: string;
};

export function shortSquadPlayerName(name: string): string {
  if (name.length <= 20) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1]!;
    return `${parts[0]} ${last.charAt(0)}.`;
  }
  return `${name.slice(0, 15)}…`;
}

export function startingFaceFromSquadSlot(
  squad: Pick<SquadPayload, 'starting11' | 'worldXiNations'>,
  idx: number,
  worldXi: boolean,
  selectedCountry: string,
): SquadPlayerSlotFace | null {
  const name = squad.starting11[idx] ?? '';
  if (!name) return null;
  const nation = worldXi
    ? (squad.worldXiNations[idx] || selectedCountry || '').trim()
    : selectedCountry.trim();
  if (!nation) {
    return {
      shortName: shortSquadPlayerName(name),
      flag: '🏳️',
      position: 'MID',
      nationLabel: '',
    };
  }
  const p = findPlayerInNation(name, nation);
  return {
    shortName: shortSquadPlayerName(name),
    flag: squadPredictorTeamFlag(nation),
    position: p?.position ?? 'MID',
    nationLabel: nation,
  };
}

export function subFaceFromSquadSlot(
  squad: Pick<SquadPayload, 'subs' | 'subsNations'>,
  idx: number,
  worldXi: boolean,
  selectedCountry: string,
): SquadPlayerSlotFace | null {
  const name = squad.subs[idx] ?? '';
  if (!name) return null;
  const nation = worldXi
    ? (squad.subsNations[idx] || selectedCountry || '').trim()
    : selectedCountry.trim();
  if (!nation) {
    return {
      shortName: shortSquadPlayerName(name),
      flag: '🏳️',
      position: 'MID',
      nationLabel: '',
    };
  }
  const p = findPlayerInNation(name, nation);
  return {
    shortName: shortSquadPlayerName(name),
    flag: squadPredictorTeamFlag(nation),
    position: p?.position ?? 'MID',
    nationLabel: nation,
  };
}

import type { MockPlayer } from '@/data/squadPredictorMockPlayers';

export function playerMatchesSlot(
  name: string,
  nation: string,
  worldXi: boolean,
  p: MockPlayer,
): boolean {
  if (name !== p.name) return false;
  if (worldXi && nation !== p.nation) return false;
  return true;
}

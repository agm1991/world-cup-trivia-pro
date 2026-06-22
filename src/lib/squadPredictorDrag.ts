import type { DragEvent } from 'react';
import type { MockPlayer } from '@/data/squadPredictorMockPlayers';

const DRAG_TYPE = 'application/x-squad-predictor-player';

export function setDragPlayerData(e: DragEvent, player: MockPlayer) {
  e.dataTransfer.setData(DRAG_TYPE, JSON.stringify(player));
  e.dataTransfer.effectAllowed = 'copy';
}

export function getDragPlayerData(e: DragEvent): MockPlayer | null {
  const raw = e.dataTransfer.getData(DRAG_TYPE);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as MockPlayer;
    if (p?.id && p?.name && p?.nation && p?.position) return p;
    return null;
  } catch {
    return null;
  }
}

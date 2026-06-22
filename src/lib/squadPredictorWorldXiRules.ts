/**
 * World XI hub rules: limited saves before the edit window closes (3 days after kickoff).
 * 2026 tournament — kickoff is the opening match window (adjust if FIFA publishes a different first whistle).
 */

/** When true: World XI deadline and save caps are off — full squad predictor editing. */
export const SQUAD_PREDICTOR_UNLOCKED = true;

export const WC_2026_FIRST_MATCH_START_MS = Date.parse('2026-06-11T19:00:00.000Z');

/** Edits allowed through the first three full days of the tournament (72h after first match start). */
export const WORLD_XI_EDIT_DEADLINE_MS = WC_2026_FIRST_MATCH_START_MS + 3 * 24 * 60 * 60 * 1000;

/** First committed World XI lineup + two further saves = 3 commits total (“change twice” after the first). */
export const WORLD_XI_MAX_COMMITTED_SAVES = SQUAD_PREDICTOR_UNLOCKED
  ? Number.MAX_SAFE_INTEGER
  : 3;

export function isPastWorldXiEditDeadline(nowMs: number = Date.now()): boolean {
  if (SQUAD_PREDICTOR_UNLOCKED) return false;
  return nowMs > WORLD_XI_EDIT_DEADLINE_MS;
}

export function worldXiSavesRemaining(committed: number): number {
  if (SQUAD_PREDICTOR_UNLOCKED) return 3;
  return Math.max(0, WORLD_XI_MAX_COMMITTED_SAVES - committed);
}

export function formatWorldXiDeadline(): string {
  try {
    return new Date(WORLD_XI_EDIT_DEADLINE_MS).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return 'end of day 3 of the tournament';
  }
}

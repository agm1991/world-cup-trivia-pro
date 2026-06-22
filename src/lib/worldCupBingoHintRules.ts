/** World Cup Bingo hint budget — levels 1–50: 3 per level; levels 51–204: 2 per level. */
const STORAGE_PREFIX = 'wcq_world_cup_bingo_hints_v1_';

export type WorldCupBingoHintScope = {
  maxHints: number;
  scopeKey: string;
};

export function getWorldCupBingoHintScope(level: number): WorldCupBingoHintScope {
  return {
    maxHints: level <= 50 ? 3 : 2,
    scopeKey: `level-${level}`,
  };
}

export function readWorldCupBingoHintsUsed(scopeKey: string, maxHints: number): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + scopeKey);
    const n = raw ? parseInt(raw, 10) : 0;
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, maxHints);
  } catch {
    return 0;
  }
}

export function writeWorldCupBingoHintsUsed(scopeKey: string, used: number, maxHints: number): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + scopeKey, String(Math.min(Math.max(0, used), maxHints)));
  } catch {
    /* ignore */
  }
}

export function clearWorldCupBingoHintsUsed(scopeKey: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + scopeKey);
  } catch {
    /* ignore */
  }
}

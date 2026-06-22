/** World Cup hint budget — levels 1–25: per level; levels 26–50: per mode (Hard / Ultimate / Finals). */
const STORAGE_PREFIX = 'wcq_world_cup_hints_v1_';

export type WorldCupHintScope = {
  maxHints: number;
  scopeKey: string;
};

export function getWorldCupHintScope(level: number): WorldCupHintScope {
  if (level <= 25) {
    return { maxHints: 3, scopeKey: `level-${level}` };
  }
  if (level <= 30) {
    return { maxHints: 3, scopeKey: 'mode-hard' };
  }
  if (level <= 40) {
    return { maxHints: 3, scopeKey: 'mode-ultimate' };
  }
  return { maxHints: 3, scopeKey: 'mode-finals' };
}

export function readWorldCupHintsUsed(scopeKey: string): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + scopeKey);
    const n = raw ? parseInt(raw, 10) : 0;
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, 3);
  } catch {
    return 0;
  }
}

export function writeWorldCupHintsUsed(scopeKey: string, used: number): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + scopeKey, String(Math.min(Math.max(0, used), 3)));
  } catch {
    /* ignore */
  }
}

export function clearWorldCupHintsUsed(scopeKey: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + scopeKey);
  } catch {
    /* ignore */
  }
}

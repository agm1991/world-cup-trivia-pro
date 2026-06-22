/** Guess Who hint budget — levels 1–20: per level; levels 21–40: per mode (Hard / Extra). */
const STORAGE_PREFIX = 'wcq_guess_who_hints_v1_';

export type GuessWhoHintScope = {
  maxHints: number;
  scopeKey: string;
};

export function getGuessWhoHintScope(level: number): GuessWhoHintScope {
  if (level <= 20) {
    return { maxHints: 3, scopeKey: `level-${level}` };
  }
  if (level <= 30) {
    return { maxHints: 3, scopeKey: 'mode-hard' };
  }
  return { maxHints: 3, scopeKey: 'mode-extra' };
}

export function readGuessWhoHintsUsed(scopeKey: string): number {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + scopeKey);
    const n = raw ? parseInt(raw, 10) : 0;
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, 3);
  } catch {
    return 0;
  }
}

export function writeGuessWhoHintsUsed(scopeKey: string, used: number): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + scopeKey, String(Math.min(Math.max(0, used), 3)));
  } catch {
    /* ignore */
  }
}

export function clearGuessWhoHintsUsed(scopeKey: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + scopeKey);
  } catch {
    /* ignore */
  }
}

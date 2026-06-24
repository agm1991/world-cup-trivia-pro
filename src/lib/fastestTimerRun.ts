/** Player's best Timer Challenge run (total level elapsed seconds) for Speed leaderboard. */
export const FASTEST_TIMER_RUN_KEY = 'wcq_fastest_timer_run_sec';
const FASTEST_TIMER_BY_CATEGORY_KEY = 'wcq_fastest_timer_by_category_v1';

function readCategoryFastestMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(FASTEST_TIMER_BY_CATEGORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    const out: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const n = typeof value === 'number' ? value : parseInt(String(value), 10);
      if (Number.isFinite(n) && n > 0) out[key] = Math.floor(n);
    }
    return out;
  } catch {
    return {};
  }
}

function writeCategoryFastestMap(map: Record<string, number>): void {
  try {
    localStorage.setItem(FASTEST_TIMER_BY_CATEGORY_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }
}

export function readFastestTimerRunSec(category?: string): number | undefined {
  if (category) {
    return readCategoryFastestMap()[category];
  }
  try {
    const raw = localStorage.getItem(FASTEST_TIMER_RUN_KEY);
    if (raw == null) return undefined;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  } catch {
    return undefined;
  }
}

export function readAllCategoryFastestTimes(): Record<string, number> {
  return readCategoryFastestMap();
}

/** Persist if this run is the player's new personal best (lower is faster). Returns the stored best. */
export function recordFastestTimerRun(elapsedSec: number, category?: string): number | undefined {
  const elapsed = Math.max(1, Math.floor(elapsedSec));

  const prevGlobal = readFastestTimerRunSec();
  if (prevGlobal == null || elapsed < prevGlobal) {
    try {
      localStorage.setItem(FASTEST_TIMER_RUN_KEY, String(elapsed));
    } catch {
      /* ignore quota */
    }
  }

  if (!category) return readFastestTimerRunSec();

  const map = readCategoryFastestMap();
  const prevCategory = map[category];
  if (prevCategory != null && elapsed >= prevCategory) return prevCategory;
  map[category] = elapsed;
  writeCategoryFastestMap(map);
  return elapsed;
}

export function clearFastestTimerRun(): void {
  try {
    localStorage.removeItem(FASTEST_TIMER_RUN_KEY);
    localStorage.removeItem(FASTEST_TIMER_BY_CATEGORY_KEY);
  } catch {
    /* ignore */
  }
}

/** Apply cloud-synced timer bests to localStorage (cross-device restore). */
export function applyFastestTimerData(
  globalSec?: number,
  byCategory?: Record<string, number>,
): void {
  try {
    if (globalSec != null && globalSec > 0) {
      localStorage.setItem(FASTEST_TIMER_RUN_KEY, String(Math.floor(globalSec)));
    } else {
      localStorage.removeItem(FASTEST_TIMER_RUN_KEY);
    }

    const map = byCategory ?? {};
    if (Object.keys(map).length > 0) {
      writeCategoryFastestMap(map);
    } else {
      localStorage.removeItem(FASTEST_TIMER_BY_CATEGORY_KEY);
    }
  } catch {
    /* ignore quota */
  }
}

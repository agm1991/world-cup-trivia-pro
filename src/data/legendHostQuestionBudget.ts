import type { Question } from '@/types/game';

/** Max times a generic “who hosted the World Cup?” style filler may appear across all of Select a Legend. */
export const LEGEND_HOST_FILLER_CAP = 6;

/** Cleared with full game progress reset (see LocalProfileContext). */
export const LEGEND_HOST_FILLER_STORAGE_KEY = 'wcq-legend-host-filler-shown-count';
const STORAGE_KEY = LEGEND_HOST_FILLER_STORAGE_KEY;

export function isHostNationFillerQuestion(q: Question): boolean {
  const t = q.question.trim();
  const tl = t.toLowerCase();
  if (/^supplemental\s+\d+:/i.test(t)) return true;
  if (/hosted by which country/i.test(tl)) return true;
  if (/where was the \d{4} fifa world cup held/i.test(tl)) return true;
  if (/who hosted the world cup/i.test(tl)) return true;
  return false;
}

export function getLegendHostFillerShownCount(): number {
  try {
    return Math.max(0, parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0);
  } catch {
    return 0;
  }
}

export function recordLegendHostFillerShown(): void {
  try {
    const n = getLegendHostFillerShownCount();
    if (n < LEGEND_HOST_FILLER_CAP) {
      localStorage.setItem(STORAGE_KEY, String(n + 1));
    }
  } catch {
    /* ignore */
  }
}

export function filterPoolForHostBudget<T extends Pick<Question, 'question'>>(pool: T[]): T[] {
  if (getLegendHostFillerShownCount() >= LEGEND_HOST_FILLER_CAP) {
    return pool.filter((q) => !isHostNationFillerQuestion(q as Question));
  }
  return pool;
}

/** Keeps at most N host-style fillers per player pool (baked data + padding used to spam the same host fact). */
export function limitHostFillersPerPlayer(questions: Question[], maxHosts = 1): Question[] {
  let n = 0;
  return questions.filter((q) => {
    if (!isHostNationFillerQuestion(q)) return true;
    n += 1;
    return n <= maxHosts;
  });
}

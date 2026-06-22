import type { Question } from '@/types/game';

/** Only these five World Cups appear in category levels 31–40. */
const WC_ERA_YEARS = [1950, 1954, 1958, 1962, 1966] as const;
export type WorldCupEraYear = (typeof WC_ERA_YEARS)[number];

/**
 * Which of the five era tournaments a prompt is *about* (for round-robin mixing).
 * Uses the first matching year in the question text, except where that would be wrong
 * (e.g. “before 1966” would steal 1966 from a 1950 answer prompt).
 */
const PRIMARY_YEAR_OVERRIDE: Partial<Record<string, WorldCupEraYear>> = {
  'wc-ult-34-2': 1962,
  'wc-ult-34-8': 1950,
  'wc-ult-34-10': 1962,
};

export function primaryWorldCupEraYear(q: Question): WorldCupEraYear {
  const o = PRIMARY_YEAR_OVERRIDE[q.id];
  if (o) return o;
  for (const y of WC_ERA_YEARS) {
    if (q.question.includes(String(y))) return y;
  }
  throw new Error(`[worldCup] Missing 1950–1966 era tag for question ${q.id}`);
}

/**
 * Reorders the pool so **each** of levels 31–40 includes at least one question “about”
 * each of the five tournaments (1950, 1954, 1958, 1962, 1966), then fills the other five
 * slots per level from what remains — so years are mixed, not grouped chronologically.
 */
export function interleaveWorldCupLevels3140Questions(pool: Question[]): Question[] {
  const buckets: Record<WorldCupEraYear, Question[]> = {
    1950: [],
    1954: [],
    1958: [],
    1962: [],
    1966: [],
  };
  for (const q of pool) {
    buckets[primaryWorldCupEraYear(q)].push(q);
  }

  for (const y of WC_ERA_YEARS) {
    if (buckets[y].length < 10) {
      throw new Error(
        `[worldCup] Need at least 10 questions tagged ${y} for levels 31–40 (have ${buckets[y].length})`,
      );
    }
  }

  const levels: Question[][] = Array.from({ length: 10 }, () => []);

  for (let levelIdx = 0; levelIdx < 10; levelIdx++) {
    for (const y of WC_ERA_YEARS) {
      const q = buckets[y].shift();
      if (!q) throw new Error(`[worldCup] Missing ${y} for level slot ${levelIdx}`);
      levels[levelIdx].push(q);
    }
  }

  const rest: Question[] = WC_ERA_YEARS.flatMap((y) => buckets[y]);
  for (let i = 0; i < rest.length; i++) {
    levels[i % 10].push(rest[i]);
  }

  return levels.flat();
}

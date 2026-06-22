import type { Category, Question } from '@/types/game';
import { worldCupQuestions } from './worldCupQuestions';
import { guessWhoPhotoQuestions } from './guessWhoPhotoQuestions';
import { guessWhoQuestions } from './guessWhoQuestions';
import { scorelineQuestions } from './scorelineQuestions';
import { managersQuestions } from './managersQuestions';
import { stadiumsQuestions } from './stadiumsQuestions';
import { winnersQuestions } from './winnersQuestions';
import { missingPlayerQuestions } from './missingPlayerQuestions';
import { genericCountryQuestions } from './countryHistoryQuestions';
import { WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204 } from './worldCupBingoLevels199to204.frozen';
import { BINGO_MP_QUESTIONS_FROZEN_L1TO204 } from './bingoMissingPlayerQuestionsFrozenL1to204';
import { extractNativeMpId } from './bingoMpLineupCatalog';

const BINGO: Category = 'world-cup-bingo';

/** Fixed cap: 204 levels × 10 questions (expand source pool if padding cycles). */
export const BINGO_MAX_LEVELS = 204;

/** Seed for deterministic shuffle — same build always yields the same level/question mapping. */
const BINGO_SHUFFLE_SEED = 0xb1e60226;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleDeterministic<T>(items: T[], seed: number): T[] {
  const out = [...items];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function tagBingo(q: Question, slot: number): Question {
  const safeId = `bingo-${slot}-${q.id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  return {
    ...q,
    id: safeId,
    category: BINGO,
    sourceCategory: typeof q.category === 'string' ? q.category : String(q.category),
  };
}

/** Unmixed source rows (deduped by native category + id), then shuffled and sliced/padded to 2040. */
function buildUnmixedSourcePool(): Question[] {
  const acc: Question[] = [];
  const add = (arr: Question[], take?: number) => {
    const slice = take != null ? arr.slice(0, take) : [...arr];
    acc.push(...slice);
  };
  add(worldCupQuestions, 350);
  add(guessWhoPhotoQuestions);
  add(guessWhoQuestions, 450);
  add(scorelineQuestions);
  add(managersQuestions, 280);
  add(stadiumsQuestions, 200);
  add(winnersQuestions);
  add(missingPlayerQuestions, 250);
  add(genericCountryQuestions, 200);

  const seen = new Set<string>();
  const deduped: Question[] = [];
  for (const q of acc) {
    const key = `${String(q.category)}::${q.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(q);
  }
  return deduped;
}

const UNMIXED_SOURCE_POOL = buildUnmixedSourcePool();
const SHUFFLED_SOURCE_POOL = shuffleDeterministic(UNMIXED_SOURCE_POOL, BINGO_SHUFFLE_SEED);

export const BINGO_QUESTIONS_PER_LEVEL = 10;

const TARGET_BINGO_QUESTION_COUNT = BINGO_MAX_LEVELS * BINGO_QUESTIONS_PER_LEVEL;

function pickQuestionsForBingoLevels(): Question[] {
  if (SHUFFLED_SOURCE_POOL.length >= TARGET_BINGO_QUESTION_COUNT) {
    return SHUFFLED_SOURCE_POOL.slice(0, TARGET_BINGO_QUESTION_COUNT);
  }
  const out: Question[] = [];
  let i = 0;
  while (out.length < TARGET_BINGO_QUESTION_COUNT) {
    out.push(SHUFFLED_SOURCE_POOL[i % SHUFFLED_SOURCE_POOL.length]!);
    i++;
  }
  return out;
}

/**
 * Full bingo run: mixed (shuffled) pool split into 204 levels of 10.
 * Ordering is stable for a given app build.
 */
export const ORDERED_WORLD_CUP_BINGO_QUESTIONS: Question[] = pickQuestionsForBingoLevels().map((q, i) =>
  tagBingo(q, i),
);

export const BINGO_LEVEL_COUNT = BINGO_MAX_LEVELS;

function applyFrozenMissingPlayerQuestions(questions: Question[]): Question[] {
  return questions.map((q) => {
    if (q.sourceCategory !== 'missing-player') return q;
    const mpId = extractNativeMpId(q.id);
    if (!mpId) return q;
    const frozen = BINGO_MP_QUESTIONS_FROZEN_L1TO204[mpId];
    if (!frozen) return q;
    return { ...frozen, id: q.id };
  });
}

export function getWorldCupBingoQuestionsByLevel(level: number): Question[] {
  if (level >= 199 && level <= 204) {
    return applyFrozenMissingPlayerQuestions(WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204[level]!);
  }
  const start = (level - 1) * BINGO_QUESTIONS_PER_LEVEL;
  return applyFrozenMissingPlayerQuestions(
    ORDERED_WORLD_CUP_BINGO_QUESTIONS.slice(start, start + BINGO_QUESTIONS_PER_LEVEL),
  );
}

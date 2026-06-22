import type { Question } from '@/types/game';
import { defaultCountries } from '@/data/selectLegendCountries';
import peleImg from '@/assets/kickoff-portraits/pele-wc1958.jpg';
import zidaneImg from '@/assets/zidane-new.jpg';
import cruyffImg from '@/assets/players/cruyff.jpg';
import beckenbauerImg from '@/assets/beckenbauer.jpg';

/** World-famous names without a World Cup winner badge in Select a Legend, or global icons we always treat as "early levels". */
const EXTRA_ICON_PLAYER_IDS = new Set<string>([
  'neymar',
  'zico',
  'cristiano',
  'javier-zanetti',
  'gabriel-batistuta',
  'javier-mascherano',
  'paolo-maldini',
  'roberto-baggio',
  'michel-platini',
  'jay-jay-okocha',
  'nwankwo-kanu',
  'carlos-valderrama',
  'hugo-sanchez',
  'luis-suarez',
  'zlatan-ibrahimovic',
  'ferenc-puskas',
  'enzo-francescoli',
  'luka-modric',
  'davor-suker',
  'james-rodriguez',
  'radamel-falcao',
  'rafa-marquez',
  'javier-hernandez',
  'kevin-de-bruyne',
  'eden-hazard',
  'robert-lewandowski',
  'son-heung-min',
  'tim-cahill',
  'sadio-mane',
  'samuel-etoo',
  'rabah-madjer',
  'achraf-hakimi',
]);

export type LegendPlayer = {
  id: string;
  name: string;
  image: string;
  achievement: string;
  country: string;
  isWorldCupWinner?: boolean;
};

function flattenLegends(): LegendPlayer[] {
  return defaultCountries.flatMap((c) =>
    c.players.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      achievement: p.achievement,
      country: c.name,
      isWorldCupWinner: p.isWorldCupWinner,
    }))
  );
}

/** True when the card uses the same stock photo as another legend (not a real portrait). */
export function hasRealLegendPortrait(p: LegendPlayer): boolean {
  if (p.image === peleImg && p.id !== 'pele') return false;
  if (p.image === zidaneImg && p.id !== 'zidane') return false;
  if (p.image === beckenbauerImg && p.id !== 'beckenbauer') return false;
  if (p.image === cruyffImg && p.id !== 'cruyff') return false;
  return true;
}

export function isHouseholdLegend(p: LegendPlayer): boolean {
  if (p.isWorldCupWinner) return true;
  return EXTRA_ICON_PLAYER_IDS.has(p.id);
}

export function isDeepCutLegend(p: LegendPlayer): boolean {
  return !isHouseholdLegend(p);
}

/** Deterministic pseudo-random 0..n-1 from level + salt. */
function slotSeed(level: number, salt: number): number {
  return (level * 7919 + salt * 9973) % 100000;
}

function pickDistractors(correct: LegendPlayer, pool: LegendPlayer[], level: number, qIndex: number): string[] {
  const sameCountry = pool.filter((x) => x.country === correct.country && x.id !== correct.id);
  const others = pool.filter((x) => x.id !== correct.id);
  const ordered = [...sameCountry, ...others.filter((o) => o.country !== correct.country)];
  const names: string[] = [];
  const used = new Set<string>();
  let s = slotSeed(level, qIndex * 17);
  let i = 0;
  while (names.length < 3 && i < ordered.length * 3) {
    const idx = (s + i * 31) % Math.max(ordered.length, 1);
    s = (s + 17) % 100000;
    const n = ordered[idx]!.name;
    if (!used.has(n)) {
      used.add(n);
      names.push(n);
    }
    i++;
  }
  return names.slice(0, 3);
}

function shuffleOptions(
  correct: string,
  wrong: string[],
  level: number,
  qIndex: number
): { optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: 'A' | 'B' | 'C' | 'D' } {
  const opts = [correct, ...wrong.slice(0, 3)];
  let s = slotSeed(level, qIndex * 13 + 5);
  for (let i = opts.length - 1; i > 0; i--) {
    const j = (s % (i + 1) + i + 1) % (i + 1);
    s = (s * 1103515245 + 12345) % 2147483647;
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const letters = ['A', 'B', 'C', 'D'] as const;
  const correctLetter = letters[opts.indexOf(correct)]!;
  return {
    optionA: opts[0],
    optionB: opts[1],
    optionC: opts[2],
    optionD: opts[3],
    correctAnswer: correctLetter,
  };
}

function difficultyForLevel(level: number): 'easy' | 'medium' | 'hard' {
  if (level <= 10) return 'easy';
  if (level <= 20) return 'medium';
  return 'hard';
}

/**
 * Builds relatable "Guess who I am" prompts from Select a Legend roster.
 * Levels 1–14: household / WC-winner legends only.
 * Levels 15+: deeper cuts (non-icon); household names are excluded unless the pool is too small.
 */
export function generateLegendGuessWhoQuestions(level: number, count: number): Question[] {
  const all = flattenLegends();
  const useDeep = level >= 15;
  let pool = useDeep ? all.filter(isDeepCutLegend) : all.filter(isHouseholdLegend);
  if (pool.length < 4) {
    pool = all;
  }

  const out: Question[] = [];
  const start = slotSeed(level, 0) % Math.max(pool.length, 1);

  for (let i = 0; i < count; i++) {
    const idx = (start + i * 7) % pool.length;
    const subject = pool[idx]!;
    const wrong = pickDistractors(subject, pool, level, i);
    const opts = shuffleOptions(subject.name, wrong, level, i);
    const diff = difficultyForLevel(level);
    const portrait = hasRealLegendPortrait(subject);
    const useHalf = portrait && (slotSeed(level, i + 2) % 2 === 0);

    const hint1 = `${subject.country} national team`;
    const hint2 = subject.achievement.length > 60 ? subject.achievement.slice(0, 57) + '…' : subject.achievement;
    const hint3 = subject.isWorldCupWinner ? 'I won the World Cup with my country.' : 'My World Cup story matches the clue above.';

    const base: Question = {
      id: `gw-legend-${level}-${i + 1}`,
      category: 'guess-who',
      difficulty: diff,
      question: portrait ? 'Who am I?' : `I represented ${subject.country} at the World Cup. ${hint2} Who am I?`,
      questionType: portrait ? (useHalf ? 'half-image' : 'image') : 'text',
      image: portrait ? subject.image : undefined,
      ...opts,
      hint1,
      hint2,
      hint3,
    };

    out.push(base);
  }

  return out;
}

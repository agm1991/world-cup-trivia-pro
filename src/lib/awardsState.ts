/**
 * Tournament awards shape + persistence normalizer.
 * Kept out of `AwardsTab.tsx` so hub/storage can import without loading the full Awards UI module.
 */

export type AwardsState = {
  goldenBootNation: string;
  goldenBoot: string;
  bestGoalkeeperNation: string;
  bestGoalkeeper: string;
  bestDefenderNation: string;
  bestDefender: string;
  bestMidfielderNation: string;
  bestMidfielder: string;
  bestStrikerNation: string;
  bestStriker: string;
  tournamentWinner: string;
  tournamentRunnerUp: string;
  thirdPlace: string;
};

const EMPTY_AWARDS: AwardsState = {
  goldenBootNation: '',
  goldenBoot: '',
  bestGoalkeeperNation: '',
  bestGoalkeeper: '',
  bestDefenderNation: '',
  bestDefender: '',
  bestMidfielderNation: '',
  bestMidfielder: '',
  bestStrikerNation: '',
  bestStriker: '',
  tournamentWinner: '',
  tournamentRunnerUp: '',
  thirdPlace: '',
};

/** Blank awards tab — used when resetting picks for a fresh online launch. */
export function emptyAwardsState(): AwardsState {
  return { ...EMPTY_AWARDS };
}

type LegacyAwards = {
  goldenBoot?: string;
  playmaker?: string;
  bestManager?: string;
  underdog?: string;
};

/**
 * Player-award nation fields only load if explicitly stored. We never infer a nation from a player label.
 * If a nation is missing, the matching player pick is cleared so the UI stays nation-first.
 */
export function normalizeAwardsFromPersisted(raw: unknown): AwardsState {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_AWARDS };
  const o = raw as Record<string, unknown>;

  if (
    'goldenBootNation' in o ||
    'awardsPlayerNation' in o ||
    'bestGoalkeeper' in o ||
    'bestDefender' in o ||
    'tournamentWinner' in o ||
    typeof o.bestDefender === 'string'
  ) {
    const goldenBootNation = typeof o.goldenBootNation === 'string' ? o.goldenBootNation : '';
    const bestGoalkeeperNation = typeof o.bestGoalkeeperNation === 'string' ? o.bestGoalkeeperNation : '';
    const bestDefenderNation = typeof o.bestDefenderNation === 'string' ? o.bestDefenderNation : '';
    const bestMidfielderNation = typeof o.bestMidfielderNation === 'string' ? o.bestMidfielderNation : '';
    const bestStrikerNation = typeof o.bestStrikerNation === 'string' ? o.bestStrikerNation : '';

    const gb = typeof o.goldenBoot === 'string' ? o.goldenBoot : '';
    const gk = typeof o.bestGoalkeeper === 'string' ? o.bestGoalkeeper : '';
    const bd = typeof o.bestDefender === 'string' ? o.bestDefender : '';
    const bm = typeof o.bestMidfielder === 'string' ? o.bestMidfielder : '';
    const bs = typeof o.bestStriker === 'string' ? o.bestStriker : '';

    return {
      goldenBootNation,
      goldenBoot: goldenBootNation.trim() ? gb : '',
      bestGoalkeeperNation,
      bestGoalkeeper: bestGoalkeeperNation.trim() ? gk : '',
      bestDefenderNation,
      bestDefender: bestDefenderNation.trim() ? bd : '',
      bestMidfielderNation,
      bestMidfielder: bestMidfielderNation.trim() ? bm : '',
      bestStrikerNation,
      bestStriker: bestStrikerNation.trim() ? bs : '',
      tournamentWinner: typeof o.tournamentWinner === 'string' ? o.tournamentWinner : '',
      tournamentRunnerUp: typeof o.tournamentRunnerUp === 'string' ? o.tournamentRunnerUp : '',
      thirdPlace: typeof o.thirdPlace === 'string' ? o.thirdPlace : '',
    };
  }
  const legacy = o as LegacyAwards;
  const oldUnderdog = typeof legacy.underdog === 'string' ? legacy.underdog : '';
  return {
    ...EMPTY_AWARDS,
    thirdPlace: oldUnderdog,
  };
}

/**
 * Shared state for all Squad & Predictor hub pages (squad, tournament, awards, community).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useLocation, useNavigate, type NavigateFunction } from 'react-router-dom';
import {
  SQUAD_PREDICTOR_ALL_NATIONS,
  SQUAD_PREDICTOR_GROUPS,
  SQUAD_PREDICTOR_GROUP_MATCH_PAIRS,
} from '@/data/squadPredictor2026Groups';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import {
  buildRoundOf32PairingsFromScores,
  computeBracket32,
  groupStageMatchKey,
  isGroupStageComplete,
  pairQuarterFinalsFromR16,
  pairRoundOf16FromR32,
  pairSemiFinalsFromQuarter,
  pairThirdPlaceFromSemi,
  pairWinnersSequential,
  resolveKnockout,
} from '@/lib/squadPredictorBracket';
import { isValidFormation } from '@/lib/squadPredictorFormations';
import { findPlayerInNation, getPlayersForNation, type MockPlayer } from '@/data/squadPredictorMockPlayers';
import { startingFaceFromSquadSlot, subFaceFromSquadSlot } from '@/lib/squadPredictorPlayerFaces';
import { getAwardPoolPlayersFlat } from '@/data/squadPredictor2026AwardPool';
import { playerMatchesSlot } from '@/lib/squadPredictorAssign';
import {
  describeStartingSlotRole,
  footballRoleFitsSlot,
  getPlayerRoleForMatch,
  getStartingSlotRole,
} from '@/lib/squadPredictorSlotRoles';
import {
  PREDICTOR_PATHS,
  PREDICTOR_SECTION_LABELS,
  type PredictorSection,
  predictorSectionFromPathname,
} from '@/lib/squadPredictorHubRoutes';
import { emptyAwardsState, normalizeAwardsFromPersisted, type AwardsState } from '@/lib/awardsState';
import { PREDICTOR_TACTICS, type SquadPayload, type Tactic } from '@/pages/squadPredictorHubTypes';
import {
  addNamedSave,
  linkNamedSaveToCommunityEntry,
  publishToCommunity,
  type SquadPredictorSnapshot,
} from '@/lib/squadPredictorSocialStorage';
import {
  formatWorldXiDeadline,
  isPastWorldXiEditDeadline,
  SQUAD_PREDICTOR_UNLOCKED,
  WORLD_XI_MAX_COMMITTED_SAVES,
  worldXiSavesRemaining,
} from '@/lib/squadPredictorWorldXiRules';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'wp_squad_predictor_v1';

/** Publish dialog: use in-memory editor state (not a `savedSquads` key). */
export const PUBLISH_SQUAD_SOURCE_CURRENT = '__current__';
/** One-shot: clear stored player-award nations so Nation boxes start empty until the user picks (persist then saves the blank state). */
const AWARDS_PLAYER_NATIONS_START_BLANK_KEY = 'wcq_awards_player_nations_start_blank_v2';
/** One-shot: Best goalkeeper nation used to persist oddly; reset so the field starts at “Select nation (A–Z)”, not a pre-filled nation. */
const AWARDS_BEST_GK_NATION_RESET_V1 = 'wcq_awards_best_gk_nation_reset_v1';
/**
 * Stored on the saved payload — when missing or stale, group scores reset to blank and knockouts clear.
 * (Separate localStorage flags were consumed without clearing scores; this field is the source of truth.)
 */
const TOURNAMENT_SCORES_SEED = 6;
/** Mismatch clears every Awards-tab pick (player awards + podium nations) once per deploy. */
const AWARDS_PICKS_SEED = 1;

function stripPlayerAwardNationsForFreshNationUi(a: AwardsState): AwardsState {
  return {
    ...a,
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
  };
}

type KnockMatch = {
  teamA: string;
  teamB: string;
  sA: string;
  sB: string;
  tie: '' | 'A' | 'B';
};

type Persisted = {
  v: 1;
  worldXi: boolean;
  /** Committed World XI quick/profile saves (capped at WORLD_XI_MAX_COMMITTED_SAVES). */
  worldXiCommittedSaves: number;
  selectedCountry: string;
  squad: SquadPayload;
  savedSquads: Record<string, SquadPayload>;
  groupScores: Record<string, string>;
  ro32: KnockMatch[];
  ro16: KnockMatch[];
  qf: KnockMatch[];
  sf: KnockMatch[];
  thirdPlace: KnockMatch;
  final: KnockMatch;
  awards: AwardsState;
  /** {@link TOURNAMENT_SCORES_SEED} — mismatch triggers a one-time 0-0 tournament reset. */
  tournamentScoresSeed?: number;
  /** {@link AWARDS_PICKS_SEED} — mismatch triggers a one-time blank Awards tab. */
  awardsPicksSeed?: number;
};

function emptySquad(): SquadPayload {
  return {
    starting11: Array(11).fill(''),
    subs: Array(7).fill(''),
    subsNations: Array(7).fill(''),
    formation: '4-3-3',
    tactic: 'Possession',
    worldXiNations: Array(11).fill(''),
  };
}

function normalizeSquad(p: Partial<SquadPayload> | undefined): SquadPayload {
  const e = emptySquad();
  if (!p) return e;
  return {
    starting11: Array.from({ length: 11 }, (_, i) => p.starting11?.[i] ?? ''),
    subs: Array.from({ length: 7 }, (_, i) => p.subs?.[i] ?? ''),
    subsNations: Array.from({ length: 7 }, (_, i) => p.subsNations?.[i] ?? ''),
    formation: isValidFormation(p.formation ?? '') ? p.formation! : e.formation,
    tactic: PREDICTOR_TACTICS.includes(p.tactic as Tactic) ? (p.tactic as Tactic) : e.tactic,
    worldXiNations: Array.from({ length: 11 }, (_, i) => p.worldXiNations?.[i] ?? ''),
  };
}

function emptyKnockMatch(): KnockMatch {
  return { teamA: 'TBD', teamB: 'TBD', sA: '0', sB: '0', tie: '' };
}

/** Every group fixture key → blank until the user saves a scoreline (12 groups × 6 matches). */
function buildEmptyGroupScores(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const g of SQUAD_PREDICTOR_GROUPS) {
    for (const [i, j] of SQUAD_PREDICTOR_GROUP_MATCH_PAIRS) {
      out[groupStageMatchKey(g.id, i, j)] = '';
    }
  }
  return out;
}

/** Unplayed default is shown as 0-0 in the UI — never store 0-0 as a saved draw. */
function normalizeStoredGroupScores(scores: Record<string, string> | undefined): Record<string, string> {
  const out = { ...buildEmptyGroupScores(), ...scores };
  for (const key of Object.keys(out)) {
    if ((out[key] ?? '').trim() === '0-0') out[key] = '';
  }
  return out;
}

function normalizeMatchScoreForStorage(value: string): string {
  const t = value.trim();
  if (t === '' || t === '0-0') return '';
  return t;
}

/** Reset tournament score inputs to blank; squads and awards are untouched. */
function resetTournamentScoresToEmpty(p: Partial<Persisted>): Partial<Persisted> {
  return {
    ...p,
    groupScores: buildEmptyGroupScores(),
    ro32: [],
    ro16: [],
    qf: [],
    sf: [],
    thirdPlace: emptyKnockMatch(),
    final: emptyKnockMatch(),
  };
}

function clearKnockoutBracket(p: Partial<Persisted>): Partial<Persisted> {
  return {
    ...p,
    ro32: [],
    ro16: [],
    qf: [],
    sf: [],
    thirdPlace: emptyKnockMatch(),
    final: emptyKnockMatch(),
  };
}

function hasStoredKnockoutBracket(p: Partial<Persisted>): boolean {
  return (
    (p.ro32?.length ?? 0) > 0 ||
    (p.ro16?.length ?? 0) > 0 ||
    (p.qf?.length ?? 0) > 0 ||
    (p.sf?.length ?? 0) > 0 ||
    (p.thirdPlace?.teamA ?? 'TBD') !== 'TBD' ||
    (p.final?.teamA ?? 'TBD') !== 'TBD'
  );
}

function savePersistedPartial(p: Partial<Persisted>, raw: string | null): void {
  const merged = {
    v: 1 as const,
    ...(raw ? (JSON.parse(raw) as object) : {}),
    ...p,
    tournamentScoresSeed: TOURNAMENT_SCORES_SEED,
    awardsPicksSeed: AWARDS_PICKS_SEED,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

type LoadPersistedResult = {
  data: Partial<Persisted>;
  /** True when saved data was just zeroed — React state must match on mount. */
  forceTournamentZeroZero: boolean;
};

function loadPersisted(): LoadPersistedResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let p: Partial<Persisted> = raw ? (JSON.parse(raw) as Partial<Persisted>) : {};
    let forceTournamentReset = false;

    const needsTournamentSeedReset = (p.tournamentScoresSeed ?? 0) !== TOURNAMENT_SCORES_SEED;
    const needsAwardsReset = (p.awardsPicksSeed ?? 0) !== AWARDS_PICKS_SEED;

    if (needsTournamentSeedReset) {
      p = resetTournamentScoresToEmpty(p);
      forceTournamentReset = true;
    } else if (!isGroupStageComplete(p.groupScores ?? {}) && hasStoredKnockoutBracket(p)) {
      p = clearKnockoutBracket(p);
      forceTournamentReset = true;
    }

    p = {
      ...p,
      groupScores: normalizeStoredGroupScores(p.groupScores),
    };

    if (needsAwardsReset) {
      p = { ...p, awards: emptyAwardsState() };
    }

    if (needsTournamentSeedReset || needsAwardsReset || forceTournamentReset) {
      p = {
        ...p,
        tournamentScoresSeed: TOURNAMENT_SCORES_SEED,
        awardsPicksSeed: AWARDS_PICKS_SEED,
      };
      savePersistedPartial(p, raw);
      return { data: p, forceTournamentZeroZero: forceTournamentReset };
    }

    return { data: p, forceTournamentZeroZero: false };
  } catch {
    const fresh = {
      ...resetTournamentScoresToEmpty({}),
      awards: emptyAwardsState(),
      tournamentScoresSeed: TOURNAMENT_SCORES_SEED,
      awardsPicksSeed: AWARDS_PICKS_SEED,
    };
    return { data: fresh, forceTournamentZeroZero: true };
  }
}

export type SquadPredictorHubValue = {
  hubTab: PredictorSection;
  navigate: NavigateFunction;
  location: ReturnType<typeof useLocation>;
  PREDICTOR_PATHS: typeof PREDICTOR_PATHS;
  PREDICTOR_SECTION_LABELS: typeof PREDICTOR_SECTION_LABELS;
  profile: ReturnType<typeof useLocalProfile>['profile'];
  toast: ReturnType<typeof useToast>['toast'];
  saveProfileOpen: boolean;
  setSaveProfileOpen: Dispatch<SetStateAction<boolean>>;
  publishOpen: boolean;
  setPublishOpen: Dispatch<SetStateAction<boolean>>;
  profileSquadTitle: string;
  setProfileSquadTitle: Dispatch<SetStateAction<string>>;
  worldXi: boolean;
  setWorldXi: Dispatch<SetStateAction<boolean>>;
  selectedCountry: string;
  setSelectedCountry: Dispatch<SetStateAction<string>>;
  squad: SquadPayload;
  setSquad: Dispatch<SetStateAction<SquadPayload>>;
  savedSquads: Record<string, SquadPayload>;
  groupScores: Record<string, string>;
  ro32: KnockMatch[];
  setRo32: Dispatch<SetStateAction<KnockMatch[]>>;
  ro16: KnockMatch[];
  setRo16: Dispatch<SetStateAction<KnockMatch[]>>;
  qf: KnockMatch[];
  setQf: Dispatch<SetStateAction<KnockMatch[]>>;
  sf: KnockMatch[];
  setSf: Dispatch<SetStateAction<KnockMatch[]>>;
  thirdPlace: KnockMatch;
  setThirdPlace: Dispatch<SetStateAction<KnockMatch>>;
  final: KnockMatch;
  setFinal: Dispatch<SetStateAction<KnockMatch>>;
  awards: AwardsState;
  setAwards: Dispatch<SetStateAction<AwardsState>>;
  browseNation: string;
  setBrowseNation: Dispatch<SetStateAction<string>>;
  awardPoolPlayers: ReturnType<typeof getAwardPoolPlayersFlat>;
  nationAwardItems: { id: string; label: string; nation: string; display: string }[];
  bracket: ReturnType<typeof computeBracket32>;
  listPlayers: MockPlayer[];
  buildSnapshot: () => SquadPredictorSnapshot;
  applySnapshot: (snap: SquadPredictorSnapshot) => void;
  getStartingFace: (idx: number) => {
    shortName: string;
    flag: string;
    position: string;
    nationLabel: string;
  } | null;
  getSubFace: (idx: number) => {
    shortName: string;
    flag: string;
    position: string;
    nationLabel: string;
  } | null;
  usedNames: Set<string>;
  assignStarting: (slotIndex: number, player: MockPlayer) => void;
  assignSub: (slotIndex: number, player: MockPlayer) => void;
  clearStarting: (slotIndex: number) => void;
  clearSub: (slotIndex: number) => void;
  clearPitch: () => void;
  saveCurrentSquad: () => void;
  loadSavedForCountry: (name: string) => void;
    saveGroupMatchScore: (key: string, value: string) => void;
  openSaveProfileDialog: () => void;
  openPublishDialog: () => void;
  confirmProfileSave: () => void;
  confirmPublish: () => void;
  worldXiCommittedSaves: number;
  worldXiSavesRemaining: number;
  worldXiEditLocked: boolean;
  /** `PUBLISH_SQUAD_SOURCE_CURRENT` or a `savedSquads` key (e.g. `England`, `__world_xi__`). */
  publishSquadSource: string;
  setPublishSquadSource: Dispatch<SetStateAction<string>>;
  publishableSavedSquads: { key: string; label: string }[];
  buildSnapshotForPublish: (source: string) => SquadPredictorSnapshot;
  /** Profile named save + community feed entry for tournament award picks (Awards tab). */
  shareAwardsToCommunity: () => void;
};

const SquadPredictorHubContext = createContext<SquadPredictorHubValue | null>(null);

export function SquadPredictorHubProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { profile } = useLocalProfile();
  const hubTab: PredictorSection = useMemo(
    () => predictorSectionFromPathname(location.pathname) ?? 'squad',
    [location.pathname],
  );

  const [saveProfileOpen, setSaveProfileOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishSquadSource, setPublishSquadSource] = useState<string>(PUBLISH_SQUAD_SOURCE_CURRENT);
  const [profileSquadTitle, setProfileSquadTitle] = useState('');
  const { data: initial, forceTournamentZeroZero } = loadPersisted();
  const skipKnockScorePreserve = useRef(forceTournamentZeroZero);

  const [worldXi, setWorldXi] = useState(initial.worldXi ?? false);
  const [selectedCountry, setSelectedCountry] = useState(initial.selectedCountry ?? '');
  const [squad, setSquad] = useState<SquadPayload>(() => normalizeSquad(initial.squad));
  const [savedSquads, setSavedSquads] = useState<Record<string, SquadPayload>>(
    () => initial.savedSquads ?? {},
  );
  const [groupScores, setGroupScores] = useState<Record<string, string>>(() =>
    normalizeStoredGroupScores(initial.groupScores),
  );
  const [ro32, setRo32] = useState<KnockMatch[]>(() =>
    forceTournamentZeroZero ? [] : (initial.ro32 ?? []),
  );
  const [ro16, setRo16] = useState<KnockMatch[]>(() =>
    forceTournamentZeroZero ? [] : (initial.ro16 ?? []),
  );
  const [qf, setQf] = useState<KnockMatch[]>(() => (forceTournamentZeroZero ? [] : (initial.qf ?? [])));
  const [sf, setSf] = useState<KnockMatch[]>(() => (forceTournamentZeroZero ? [] : (initial.sf ?? [])));
  const [thirdPlace, setThirdPlace] = useState<KnockMatch>(() =>
    forceTournamentZeroZero ? emptyKnockMatch() : (initial.thirdPlace ?? emptyKnockMatch()),
  );
  const [final, setFinal] = useState<KnockMatch>(() =>
    forceTournamentZeroZero ? emptyKnockMatch() : (initial.final ?? emptyKnockMatch()),
  );

  useEffect(() => {
    if (!forceTournamentZeroZero) return;
    setGroupScores(buildEmptyGroupScores());
    setRo32([]);
    setRo16([]);
    setQf([]);
    setSf([]);
    setThirdPlace(emptyKnockMatch());
    setFinal(emptyKnockMatch());
    skipKnockScorePreserve.current = true;
  }, [forceTournamentZeroZero]);
  const [awards, setAwards] = useState<AwardsState>(() => {
    let fromDisk = normalizeAwardsFromPersisted(initial.awards);
    try {
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(AWARDS_PLAYER_NATIONS_START_BLANK_KEY)) {
        localStorage.setItem(AWARDS_PLAYER_NATIONS_START_BLANK_KEY, '1');
        fromDisk = stripPlayerAwardNationsForFreshNationUi(fromDisk);
      }
      if (typeof localStorage !== 'undefined' && !localStorage.getItem(AWARDS_BEST_GK_NATION_RESET_V1)) {
        localStorage.setItem(AWARDS_BEST_GK_NATION_RESET_V1, '1');
        fromDisk = { ...fromDisk, bestGoalkeeperNation: '', bestGoalkeeper: '' };
      }
    } catch {
      /* ignore quota */
    }
    return fromDisk;
  });
  const [worldXiCommittedSaves, setWorldXiCommittedSaves] = useState(
    () => initial.worldXiCommittedSaves ?? 0,
  );
  const [browseNation, setBrowseNation] = useState(() => initial.selectedCountry ?? '');

  const worldXiEditLocked = useMemo(
    () =>
      !SQUAD_PREDICTOR_UNLOCKED &&
      worldXi &&
      (isPastWorldXiEditDeadline() || worldXiCommittedSaves >= WORLD_XI_MAX_COMMITTED_SAVES),
    [worldXi, worldXiCommittedSaves],
  );

  const worldXiSavesRemainingCount = useMemo(
    () => worldXiSavesRemaining(worldXiCommittedSaves),
    [worldXiCommittedSaves],
  );

  useEffect(() => {
    if (!worldXi) {
      setSquad((s) => ({
        ...s,
        worldXiNations: Array(11).fill(''),
        subsNations: Array(7).fill(''),
      }));
    }
  }, [worldXi]);

  useEffect(() => {
    if (!worldXi) setBrowseNation(selectedCountry);
  }, [selectedCountry, worldXi]);

  const awardPoolPlayers = useMemo(() => getAwardPoolPlayersFlat(), []);
  const nationAwardItems = useMemo(
    () =>
      [...SQUAD_PREDICTOR_ALL_NATIONS]
        .sort((a, b) => a.localeCompare(b))
        .map((n) => ({
          id: `nat-${n}`,
          label: n,
          nation: n,
          display: `${squadPredictorTeamFlag(n)} ${n}`,
        })),
    [],
  );

  const bracket = useMemo(() => computeBracket32(groupScores), [groupScores]);
  const ro32Pairings = useMemo(
    () =>
      isGroupStageComplete(groupScores)
        ? buildRoundOf32PairingsFromScores(groupScores)
        : [],
    [groupScores],
  );

  const pairKey = useMemo(() => ro32Pairings.map((p) => p.join('∙')).join('|'), [ro32Pairings]);

  useEffect(() => {
    setRo32((prev) => {
      const preserve = !skipKnockScorePreserve.current;
      const next = ro32Pairings.map(([teamA, teamB], i) => {
        const old = prev[i];
        if (preserve && old && old.teamA === teamA && old.teamB === teamB) return old;
        return { teamA, teamB, sA: '0', sB: '0', tie: '' };
      });
      if (preserve && prev.length === next.length && next.every((m, i) => m === prev[i])) return prev;
      skipKnockScorePreserve.current = false;
      return next;
    });
  }, [pairKey, ro32Pairings]);

  const ro32Winners = useMemo(() => {
    return ro32.map((m) => {
      const r = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
      if ('winner' in r) return r.winner;
      return null;
    });
  }, [ro32]);

  const ro16Pairings = useMemo(() => pairRoundOf16FromR32(ro32Winners), [ro32Winners]);

  useEffect(() => {
    if (!ro16Pairings) {
      setRo16((prev) => (prev.length === 0 ? prev : []));
      return;
    }
    setRo16((prev) => {
      const preserve = !skipKnockScorePreserve.current;
      const next = ro16Pairings.map(([teamA, teamB], i) => {
        const old = prev[i];
        if (preserve && old && old.teamA === teamA && old.teamB === teamB) return old;
        return { teamA, teamB, sA: '0', sB: '0', tie: '' };
      });
      if (preserve && prev.length === next.length && next.every((m, i) => m === prev[i])) return prev;
      return next;
    });
  }, [ro16Pairings]);

  const ro16Winners = useMemo(() => {
    return ro16.map((m) => {
      const r = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
      if ('winner' in r) return r.winner;
      return null;
    });
  }, [ro16]);

  const qfPairings = useMemo(() => pairQuarterFinalsFromR16(ro16Winners), [ro16Winners]);

  useEffect(() => {
    if (!qfPairings) {
      setQf((prev) => (prev.length === 0 ? prev : []));
      return;
    }
    setQf((prev) => {
      const preserve = !skipKnockScorePreserve.current;
      const next = qfPairings.map(([teamA, teamB], i) => {
        const old = prev[i];
        if (preserve && old && old.teamA === teamA && old.teamB === teamB) return old;
        return { teamA, teamB, sA: '0', sB: '0', tie: '' };
      });
      if (preserve && prev.length === next.length && next.every((m, i) => m === prev[i])) return prev;
      return next;
    });
  }, [qfPairings]);

  const qfWinners = useMemo(() => {
    return qf.map((m) => {
      const r = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
      if ('winner' in r) return r.winner;
      return null;
    });
  }, [qf]);

  const sfPairings = useMemo(() => pairSemiFinalsFromQuarter(qfWinners), [qfWinners]);

  useEffect(() => {
    if (!sfPairings) {
      setSf((prev) => (prev.length === 0 ? prev : []));
      return;
    }
    setSf((prev) => {
      const preserve = !skipKnockScorePreserve.current;
      const next = sfPairings.map(([teamA, teamB], i) => {
        const old = prev[i];
        if (preserve && old && old.teamA === teamA && old.teamB === teamB) return old;
        return { teamA, teamB, sA: '0', sB: '0', tie: '' };
      });
      if (preserve && prev.length === next.length && next.every((m, i) => m === prev[i])) return prev;
      return next;
    });
  }, [sfPairings]);

  const sfWinners = useMemo(() => {
    return sf.map((m) => {
      const r = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
      if ('winner' in r) return r.winner;
      return null;
    });
  }, [sf]);

  const finalPair = useMemo(() => pairWinnersSequential(sfWinners), [sfWinners]);

  const thirdPlacePairing = useMemo(() => pairThirdPlaceFromSemi(sf), [sf]);

  useEffect(() => {
    if (!thirdPlacePairing) {
      setThirdPlace((prev) => {
        if (
          prev.teamA === 'TBD' &&
          prev.teamB === 'TBD' &&
          prev.sA === '0' &&
          prev.sB === '0' &&
          prev.tie === ''
        ) {
          return prev;
        }
        return emptyKnockMatch();
      });
      return;
    }
    const [teamA, teamB] = thirdPlacePairing;
    setThirdPlace((prev) => {
      if (!skipKnockScorePreserve.current && prev.teamA === teamA && prev.teamB === teamB) return prev;
      return { teamA, teamB, sA: '0', sB: '0', tie: '' };
    });
  }, [thirdPlacePairing]);

  useEffect(() => {
    if (!finalPair || finalPair.length !== 1) {
      setFinal((f) => {
        if (f.teamA === 'TBD' && f.teamB === 'TBD' && f.sA === '0' && f.sB === '0' && f.tie === '') return f;
        return emptyKnockMatch();
      });
      return;
    }
    const [[teamA, teamB]] = finalPair;
    setFinal((prev) => {
      if (!skipKnockScorePreserve.current && prev.teamA === teamA && prev.teamB === teamB) return prev;
      return { teamA, teamB, sA: '0', sB: '0', tie: '' };
    });
  }, [finalPair]);

  const persist = useCallback(() => {
    const payload: Persisted = {
      v: 1,
      worldXi,
      worldXiCommittedSaves,
      selectedCountry,
      squad,
      savedSquads,
      groupScores,
      ro32,
      ro16,
      qf,
      sf,
      thirdPlace,
      final,
      awards,
      tournamentScoresSeed: TOURNAMENT_SCORES_SEED,
      awardsPicksSeed: AWARDS_PICKS_SEED,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota */
    }
  }, [
    awards,
    final,
    thirdPlace,
    groupScores,
    qf,
    ro16,
    ro32,
    savedSquads,
    sf,
    squad,
    worldXi,
    worldXiCommittedSaves,
    selectedCountry,
  ]);

  useEffect(() => {
    persist();
  }, [persist]);

  const applySquad = useCallback((p: SquadPayload) => {
    setSquad(normalizeSquad(p));
  }, []);

  const saveCurrentSquad = useCallback(() => {
    if (worldXi) {
      if (isPastWorldXiEditDeadline()) {
        toast({
          title: 'World XI editing closed',
          description: `Changes were allowed until ${formatWorldXiDeadline()} (3 days after kickoff).`,
          variant: 'destructive',
        });
        return;
      }
      if (worldXiCommittedSaves >= WORLD_XI_MAX_COMMITTED_SAVES) {
        toast({
          title: 'World XI save limit reached',
          description:
            'You can commit a World XI lineup three times: your first save plus two changes. Turn off World XI to work on national squads.',
          variant: 'destructive',
        });
        return;
      }
      setSavedSquads((prev) => ({ ...prev, __world_xi__: { ...squad } }));
      setWorldXiCommittedSaves((c) => c + 1);
      return;
    }
    if (!selectedCountry.trim()) {
      toast({
        title: 'Pick a nation',
        description: 'Choose a country from the grid before saving.',
        variant: 'destructive',
      });
      return;
    }
    setSavedSquads((prev) => ({ ...prev, [selectedCountry]: { ...squad } }));
  }, [worldXi, worldXiCommittedSaves, squad, selectedCountry, toast]);

  const loadSavedForCountry = (name: string) => {
    const p = savedSquads[name];
    if (p) applySquad(p);
  };

  const saveGroupMatchScore = useCallback((key: string, value: string) => {
    const stored = normalizeMatchScoreForStorage(value);
    setGroupScores((prev) => ({ ...prev, [key]: stored }));
  }, []);

  const listPlayers = useMemo(() => {
    const nation = worldXi ? browseNation : selectedCountry;
    if (!nation.trim()) return [];
    return getPlayersForNation(nation);
  }, [worldXi, browseNation, selectedCountry]);

  const buildSnapshot = useCallback((): SquadPredictorSnapshot => {
    return JSON.parse(
      JSON.stringify({
        v: 1 as const,
        worldXi,
        worldXiCommittedSaves,
        selectedCountry,
        squad,
        savedSquads,
        groupScores,
        ro32,
        ro16,
        qf,
        sf,
        thirdPlace,
        final,
        awards,
      }),
    ) as SquadPredictorSnapshot;
  }, [
    awards,
    final,
    thirdPlace,
    groupScores,
    qf,
    ro16,
    ro32,
    savedSquads,
    selectedCountry,
    sf,
    squad,
    worldXi,
    worldXiCommittedSaves,
  ]);

  const publishableSavedSquads = useMemo(() => {
    const keys = Object.keys(savedSquads);
    const sorted = [...keys].sort((a, b) => {
      if (a === '__world_xi__') return -1;
      if (b === '__world_xi__') return 1;
      return a.localeCompare(b, 'en');
    });
    return sorted.map((key) => ({
      key,
      label: key === '__world_xi__' ? 'World XI (quick save)' : key,
    }));
  }, [savedSquads]);

  const buildSnapshotForPublish = useCallback(
    (source: string): SquadPredictorSnapshot => {
      const base = buildSnapshot();
      if (source === PUBLISH_SQUAD_SOURCE_CURRENT) return base;
      const raw = savedSquads[source];
      if (!raw) return base;
      const squadNorm = normalizeSquad(raw);
      if (source === '__world_xi__') {
        return { ...base, worldXi: true, squad: squadNorm };
      }
      return { ...base, worldXi: false, selectedCountry: source, squad: squadNorm };
    },
    [buildSnapshot, savedSquads],
  );

  const applySnapshot = useCallback((snap: SquadPredictorSnapshot) => {
    setWorldXi(snap.worldXi);
    setWorldXiCommittedSaves(snap.worldXiCommittedSaves ?? 0);
    setSelectedCountry(snap.selectedCountry);
    setBrowseNation(snap.selectedCountry);
    setSquad(normalizeSquad(snap.squad as Partial<SquadPayload>));
    const nextSaved: Record<string, SquadPayload> = {};
    for (const [k, v] of Object.entries(snap.savedSquads ?? {})) {
      nextSaved[k] = normalizeSquad(v as Partial<SquadPayload>);
    }
    setSavedSquads(nextSaved);
    setGroupScores(snap.groupScores ?? {});
    setRo32(snap.ro32 ?? []);
    setRo16(snap.ro16 ?? []);
    setQf(snap.qf ?? []);
    setSf(snap.sf ?? []);
    setThirdPlace(
      snap.thirdPlace ?? {
        teamA: 'TBD',
        teamB: 'TBD',
        sA: '',
        sB: '',
        tie: '',
      },
    );
    setFinal(
      snap.final ?? {
        teamA: 'TBD',
        teamB: 'TBD',
        sA: '',
        sB: '',
        tie: '',
      },
    );
    setAwards(normalizeAwardsFromPersisted(snap.awards ?? {}));
  }, []);

  /* `toast` omitted from deps: it is the stable module function from `useToast`. */
  useEffect(() => {
    const st = (location.state as { loadSnapshot?: SquadPredictorSnapshot } | null)?.loadSnapshot;
    if (!st) return;
    applySnapshot(st);
    navigate(PREDICTOR_PATHS.squad, { replace: true, state: {} });
    toast({ title: 'Squad loaded', description: 'Your predictor setup was restored.' });
  }, [location.state, applySnapshot, navigate]);

  const getStartingFace = useCallback(
    (idx: number) => startingFaceFromSquadSlot(squad, idx, worldXi, selectedCountry),
    [squad, worldXi, selectedCountry],
  );

  const getSubFace = useCallback(
    (idx: number) => subFaceFromSquadSlot(squad, idx, worldXi, selectedCountry),
    [squad, worldXi, selectedCountry],
  );

  const usedNames = useMemo(() => {
    const set = new Set<string>();
    for (const n of squad.starting11) {
      if (n) set.add(n);
    }
    for (const n of squad.subs) {
      if (n) set.add(n);
    }
    return set;
  }, [squad.starting11, squad.subs]);

  const assignStarting = useCallback(
    (slotIndex: number, player: MockPlayer) => {
      if (worldXiEditLocked) {
        toast({
          title: 'World XI is locked',
          description: isPastWorldXiEditDeadline()
            ? `Editing ended after ${formatWorldXiDeadline()}.`
            : 'You used all three World XI commits.',
          variant: 'destructive',
        });
        return;
      }
      const slotRole = getStartingSlotRole(squad.formation, slotIndex);
      const pr = getPlayerRoleForMatch(player.name, player.position, player.tactical, player.nation);
      if (!footballRoleFitsSlot(pr, slotRole)) {
        toast({
          title: 'Wrong position for this slot',
          description: `${player.name} cannot play as ${describeStartingSlotRole(slotRole)} here.`,
          variant: 'destructive',
        });
        return;
      }
      setSquad((s) => {
        const next = [...s.starting11];
        const wn = [...s.worldXiNations];
        const sn = [...s.subs];
        const subNat = [...s.subsNations];
        for (let i = 0; i < 11; i++) {
          if (playerMatchesSlot(next[i]!, wn[i]!, worldXi, player)) {
            next[i] = '';
            wn[i] = '';
          }
        }
        for (let i = 0; i < 7; i++) {
          if (playerMatchesSlot(sn[i]!, subNat[i]!, worldXi, player)) {
            sn[i] = '';
            subNat[i] = '';
          }
        }
        next[slotIndex] = player.name;
        wn[slotIndex] = worldXi ? player.nation : '';
        return { ...s, starting11: next, worldXiNations: wn, subs: sn, subsNations: subNat };
      });
    },
    [worldXi, worldXiEditLocked, toast, squad.formation],
  );

  const assignSub = useCallback(
    (slotIndex: number, player: MockPlayer) => {
      if (worldXiEditLocked) {
        toast({
          title: 'World XI is locked',
          description: isPastWorldXiEditDeadline()
            ? `Editing ended after ${formatWorldXiDeadline()}.`
            : 'You used all three World XI commits.',
          variant: 'destructive',
        });
        return;
      }
      setSquad((s) => {
        const next = [...s.starting11];
        const wn = [...s.worldXiNations];
        const sn = [...s.subs];
        const subNat = [...s.subsNations];
        for (let i = 0; i < 11; i++) {
          if (playerMatchesSlot(next[i]!, wn[i]!, worldXi, player)) {
            next[i] = '';
            wn[i] = '';
          }
        }
        for (let i = 0; i < 7; i++) {
          if (playerMatchesSlot(sn[i]!, subNat[i]!, worldXi, player)) {
            sn[i] = '';
            subNat[i] = '';
          }
        }
        sn[slotIndex] = player.name;
        subNat[slotIndex] = worldXi ? player.nation : '';
        return { ...s, starting11: next, worldXiNations: wn, subs: sn, subsNations: subNat };
      });
    },
    [worldXi, worldXiEditLocked, toast],
  );

  const clearStarting = useCallback(
    (slotIndex: number) => {
      if (worldXiEditLocked) {
        toast({
          title: 'World XI is locked',
          description: isPastWorldXiEditDeadline()
            ? `Editing ended after ${formatWorldXiDeadline()}.`
            : 'You used all three World XI commits.',
          variant: 'destructive',
        });
        return;
      }
      setSquad((s) => {
        const next = [...s.starting11];
        const wn = [...s.worldXiNations];
        next[slotIndex] = '';
        wn[slotIndex] = '';
        return { ...s, starting11: next, worldXiNations: wn };
      });
    },
    [worldXiEditLocked, toast],
  );

  const clearSub = useCallback(
    (slotIndex: number) => {
      if (worldXiEditLocked) {
        toast({
          title: 'World XI is locked',
          description: isPastWorldXiEditDeadline()
            ? `Editing ended after ${formatWorldXiDeadline()}.`
            : 'You used all three World XI commits.',
          variant: 'destructive',
        });
        return;
      }
      setSquad((s) => {
        const sn = [...s.subs];
        const subNat = [...s.subsNations];
        sn[slotIndex] = '';
        subNat[slotIndex] = '';
        return { ...s, subs: sn, subsNations: subNat };
      });
    },
    [worldXiEditLocked, toast],
  );

  const clearPitch = useCallback(() => {
    if (worldXiEditLocked) {
      toast({
        title: 'World XI is locked',
        description: isPastWorldXiEditDeadline()
          ? `Editing ended after ${formatWorldXiDeadline()}.`
          : 'You used all three World XI commits.',
        variant: 'destructive',
      });
      return;
    }
    setSquad((s) => ({
      ...s,
      starting11: Array(11).fill(''),
      subs: Array(7).fill(''),
      subsNations: Array(7).fill(''),
      worldXiNations: Array(11).fill(''),
    }));
  }, [worldXiEditLocked, toast]);

  const openSaveProfileDialog = () => {
    if (!profile) {
      toast({
        title: 'Profile required',
        description: 'Create a profile from the Profile page first.',
        variant: 'destructive',
      });
      return;
    }
    if (worldXi && worldXiEditLocked) {
      toast({
        title: 'World XI is locked',
        description: isPastWorldXiEditDeadline()
          ? `No more edits after ${formatWorldXiDeadline()}.`
          : 'You used all three World XI commits.',
        variant: 'destructive',
      });
      return;
    }
    const nationLabel = worldXi ? 'World XI' : selectedCountry.trim() || 'National squad';
    setProfileSquadTitle(`${nationLabel} — ${new Date().toLocaleDateString()}`);
    setSaveProfileOpen(true);
  };

  const openPublishDialog = () => {
    if (!profile) {
      toast({
        title: 'Profile required',
        description: 'Create a profile from the Profile page first.',
        variant: 'destructive',
      });
      return;
    }
    setPublishSquadSource(PUBLISH_SQUAD_SOURCE_CURRENT);
    const nationLabel = worldXi ? 'World XI' : selectedCountry.trim() || 'National squad';
    setProfileSquadTitle(`${nationLabel} — ${new Date().toLocaleDateString()}`);
    setPublishOpen(true);
  };

  const confirmProfileSave = () => {
    if (!profile) return;
    if (worldXi && worldXiEditLocked) {
      toast({
        title: 'Cannot save World XI',
        description: isPastWorldXiEditDeadline()
          ? `Editing closed after ${formatWorldXiDeadline()}.`
          : 'Save limit reached.',
        variant: 'destructive',
      });
      return;
    }
    const titleTrim = profileSquadTitle.trim() || 'My squad';
    let snapshot: SquadPredictorSnapshot;

    if (worldXi) {
      if (isPastWorldXiEditDeadline()) {
        toast({
          title: 'Cannot save World XI',
          description: `Editing closed after ${formatWorldXiDeadline()}.`,
          variant: 'destructive',
        });
        return;
      }
      if (worldXiCommittedSaves >= WORLD_XI_MAX_COMMITTED_SAVES) {
        toast({
          title: 'World XI save limit reached',
          description: 'First lineup plus two changes — limit reached.',
          variant: 'destructive',
        });
        return;
      }
      const nextSaved = { ...savedSquads, __world_xi__: { ...squad } };
      const nextCommits = worldXiCommittedSaves + 1;
      setSavedSquads(nextSaved);
      setWorldXiCommittedSaves(nextCommits);
      snapshot = { ...buildSnapshot(), savedSquads: nextSaved, worldXiCommittedSaves: nextCommits };
    } else {
      if (!selectedCountry.trim()) {
        toast({
          title: 'Pick a nation',
          description: 'Choose a country from the grid before saving.',
          variant: 'destructive',
        });
        return;
      }
      const nextSaved = { ...savedSquads, [selectedCountry]: { ...squad } };
      setSavedSquads(nextSaved);
      snapshot = { ...buildSnapshot(), savedSquads: nextSaved };
    }

    const named = addNamedSave(
      titleTrim,
      snapshot,
      profile ? { name: profile.name, country: profile.country } : undefined,
    );
    const published = publishToCommunity({
      authorName: profile.name,
      authorCountry: profile.country,
      title: titleTrim,
      nation: worldXi ? 'World XI' : selectedCountry.trim() || 'National squad',
      worldXi,
      kind: 'squads',
      snapshot,
    });
    linkNamedSaveToCommunityEntry(named.id, published.id);
    setSaveProfileOpen(false);
    toast({
      title: 'Saved & shared locally',
      description: 'Profile save + Community feed (this device). Rate under Community → Published feed.',
    });
    navigate(PREDICTOR_PATHS.community);
  };

  const confirmPublish = () => {
    if (!profile) return;
    const src = publishSquadSource;
    if (src === PUBLISH_SQUAD_SOURCE_CURRENT) {
      if (worldXi && worldXiEditLocked) {
        toast({
          title: 'World XI is locked',
          description: 'Pick a saved squad below, or load a national team.',
          variant: 'destructive',
        });
        return;
      }
      if (!worldXi && !selectedCountry.trim()) {
        toast({
          title: 'Pick a nation',
          description: 'Choose a country first, or publish a saved squad from the list.',
          variant: 'destructive',
        });
        return;
      }
    } else if (!savedSquads[src]) {
      toast({
        title: 'Save missing',
        description: 'That squad is no longer in Quick save — pick another.',
        variant: 'destructive',
      });
      return;
    }

    const snapshot = buildSnapshotForPublish(src);
    const nationLabel = snapshot.worldXi
      ? 'World XI'
      : snapshot.selectedCountry.trim() || (src !== PUBLISH_SQUAD_SOURCE_CURRENT ? src : 'National squad');

    publishToCommunity({
      authorName: profile.name,
      authorCountry: profile.country,
      title: profileSquadTitle.trim() || `Shared · ${nationLabel}`,
      nation: nationLabel,
      worldXi: snapshot.worldXi,
      kind: 'squads',
      snapshot,
    });
    setPublishOpen(false);
    toast({ title: 'Published', description: 'Others on this device can rate it in the Community tab.' });
    navigate(PREDICTOR_PATHS.community);
  };

  const shareAwardsToCommunity = useCallback(() => {
    if (!profile) {
      toast({
        title: 'Profile required',
        description: 'Create a profile from the Profile page first.',
        variant: 'destructive',
      });
      return;
    }
    const title = `Tournament awards — ${new Date().toLocaleDateString()}`;
    const snapshot = buildSnapshot();
    const named = addNamedSave(title, snapshot, { name: profile.name, country: profile.country });
    const published = publishToCommunity({
      authorName: profile.name,
      authorCountry: profile.country,
      title,
      nation: 'Awards',
      worldXi: false,
      kind: 'awards',
      snapshot,
    });
    linkNamedSaveToCommunityEntry(named.id, published.id);
    toast({
      title: 'Awards saved & shared',
      description: 'Check Community → Published feed (Awards picks) and Player profile → 2026 squads.',
    });
    navigate(PREDICTOR_PATHS.community);
  }, [profile, buildSnapshot, toast, navigate]);

  const value: SquadPredictorHubValue = {
    hubTab,
    navigate,
    location,
    PREDICTOR_PATHS,
    PREDICTOR_SECTION_LABELS,
    profile,
    toast,
    saveProfileOpen,
    setSaveProfileOpen,
    publishOpen,
    setPublishOpen,
    profileSquadTitle,
    setProfileSquadTitle,
    worldXi,
    setWorldXi,
    selectedCountry,
    setSelectedCountry,
    squad,
    setSquad,
    savedSquads,
    groupScores,
    ro32,
    setRo32,
    ro16,
    setRo16,
    qf,
    setQf,
    sf,
    setSf,
    thirdPlace,
    setThirdPlace,
    final,
    setFinal,
    awards,
    setAwards,
    browseNation,
    setBrowseNation,
    awardPoolPlayers,
    nationAwardItems,
    bracket,
    listPlayers,
    buildSnapshot,
    applySnapshot,
    getStartingFace,
    getSubFace,
    usedNames,
    assignStarting,
    assignSub,
    clearStarting,
    clearSub,
    clearPitch,
    saveCurrentSquad,
    loadSavedForCountry,
    saveGroupMatchScore,
    openSaveProfileDialog,
    openPublishDialog,
    confirmProfileSave,
    confirmPublish,
    worldXiCommittedSaves,
    worldXiSavesRemaining: worldXiSavesRemainingCount,
    worldXiEditLocked,
    publishSquadSource,
    setPublishSquadSource,
    publishableSavedSquads,
    buildSnapshotForPublish,
    shareAwardsToCommunity,
  };

  return <SquadPredictorHubContext.Provider value={value}>{children}</SquadPredictorHubContext.Provider>;
}

export function useSquadPredictorHub(): SquadPredictorHubValue {
  const ctx = useContext(SquadPredictorHubContext);
  if (!ctx) {
    throw new Error('useSquadPredictorHub must be used within SquadPredictorHubProvider');
  }
  return ctx;
}

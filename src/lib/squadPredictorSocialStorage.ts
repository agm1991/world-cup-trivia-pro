import type { AwardsState } from '@/lib/awardsState';

const NAMED_SAVES_KEY = 'wcq_squad_predictor_named_saves_v1';
const COMMUNITY_KEY = 'wcq_squad_predictor_community_v1';

export type SquadPredictorSnapshot = {
  v: 1;
  worldXi: boolean;
  /** Quick save / profile save commits while in World XI (max 3). Omitted in older snapshots. */
  worldXiCommittedSaves?: number;
  selectedCountry: string;
  squad: {
    starting11: string[];
    subs: string[];
    subsNations: string[];
    formation: string;
    tactic: string;
    worldXiNations: string[];
  };
  savedSquads: Record<
    string,
    {
      starting11: string[];
      subs: string[];
      subsNations: string[];
      formation: string;
      tactic: string;
      worldXiNations: string[];
    }
  >;
  groupScores: Record<string, string>;
  ro32: { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' }[];
  ro16: { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' }[];
  qf: { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' }[];
  sf: { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' }[];
  /** M103 third-place playoff; omitted in older snapshots. */
  thirdPlace?: { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' };
  final: { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' };
  awards: AwardsState;
};

export type NamedProfileSquad = {
  id: string;
  title: string;
  snapshot: SquadPredictorSnapshot;
  savedAt: number;
  /** From profile when using Save to profile — used to show “your” squads on Community. */
  authorName?: string;
  authorCountry?: string;
  /** Local Community feed entry id when Save to profile also published to the board. */
  communityEntryId?: string;
};

export type CommunitySquad = {
  id: string;
  authorName: string;
  authorCountry: string;
  title: string;
  nation: string;
  worldXi: boolean;
  /** Omitted or `squads` = lineup posts; `awards` = tournament award picks (same snapshot shape). */
  kind?: 'squads' | 'awards';
  snapshot: SquadPredictorSnapshot;
  createdAt: number;
  ratings: number[];
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

export function loadNamedSaves(): NamedProfileSquad[] {
  return readJson<NamedProfileSquad[]>(NAMED_SAVES_KEY, []);
}

export function addNamedSave(
  title: string,
  snapshot: SquadPredictorSnapshot,
  author?: { name: string; country: string },
): NamedProfileSquad {
  const entry: NamedProfileSquad = {
    id: crypto.randomUUID(),
    title: title.trim() || 'My squad',
    snapshot,
    savedAt: Date.now(),
    ...(author
      ? { authorName: author.name.trim() || undefined, authorCountry: author.country.trim() || undefined }
      : {}),
  };
  const next = [entry, ...loadNamedSaves()].slice(0, 40);
  writeJson(NAMED_SAVES_KEY, next);
  return entry;
}

export function deleteNamedSave(id: string) {
  writeJson(
    NAMED_SAVES_KEY,
    loadNamedSaves().filter((e) => e.id !== id),
  );
}

export function linkNamedSaveToCommunityEntry(namedSaveId: string, communityEntryId: string) {
  const list = loadNamedSaves();
  writeJson(
    NAMED_SAVES_KEY,
    list.map((e) => (e.id === namedSaveId ? { ...e, communityEntryId } : e)),
  );
}

export function loadCommunity(): CommunitySquad[] {
  return readJson<CommunitySquad[]>(COMMUNITY_KEY, []);
}

export function publishToCommunity(
  entry: Omit<CommunitySquad, 'id' | 'createdAt' | 'ratings'>,
): CommunitySquad {
  const full: CommunitySquad = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ratings: [],
  };
  const next = [full, ...loadCommunity()].slice(0, 100);
  writeJson(COMMUNITY_KEY, next);
  return full;
}

export function rateCommunitySquad(id: string, stars: number) {
  const s = Math.min(5, Math.max(1, Math.round(stars)));
  const list = loadCommunity();
  const next = list.map((c) =>
    c.id === id ? { ...c, ratings: [...c.ratings, s] } : c,
  );
  writeJson(COMMUNITY_KEY, next);
}

export function deleteCommunitySquad(id: string) {
  writeJson(
    COMMUNITY_KEY,
    loadCommunity().filter((c) => c.id !== id),
  );
}

export function communityAverageRating(c: CommunitySquad): number | null {
  if (!c.ratings.length) return null;
  return c.ratings.reduce((a, b) => a + b, 0) / c.ratings.length;
}

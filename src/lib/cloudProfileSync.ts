import { supabase } from '@/integrations/supabase/client';
import {
  normalizeGameStatsFromStorage,
  type GameStatsPersisted as GameStats,
  type LevelStatsPersisted as LevelStats,
} from '@/lib/gameStatsStorage';
import type { RecentCompletion } from '@/lib/recentCompletionsStorage';
import {
  applyFastestTimerData,
  readAllCategoryFastestTimes,
  readFastestTimerRunSec,
} from '@/lib/fastestTimerRun';
import { GUEST_PROFILE_COUNTRY, GUEST_PROFILE_NAME } from '@/constants/profileGate';

export interface UserProfile {
  name: string;
  country: string;
  gender?: string;
  age?: number;
}

export interface CloudProfilePayload {
  profile: UserProfile | null;
  gameStats: GameStats;
  recentCompletions: RecentCompletion[];
  fastestTimerRunSec?: number;
  fastestTimerByCategory: Record<string, number>;
  updatedAt: string | null;
}

export type CloudProfileRow = {
  user_id: string;
  display_name: string;
  country: string;
  gender: string | null;
  age: number | null;
  game_stats: unknown;
  recent_completions: unknown;
  fastest_timer_run_sec: number | null;
  fastest_timer_by_category: unknown;
  updated_at: string;
};

const PROFILE_SELECT =
  'user_id, display_name, country, gender, age, game_stats, recent_completions, fastest_timer_run_sec, fastest_timer_by_category, updated_at';

function isGuestProfile(profile: UserProfile | null): boolean {
  if (!profile) return true;
  return profile.name === GUEST_PROFILE_NAME && profile.country === GUEST_PROFILE_COUNTRY;
}

export function hasMeaningfulProfile(profile: UserProfile | null): boolean {
  return !isGuestProfile(profile);
}

export function getTotalScoreFromGameStats(gameStats: GameStats): number {
  return Object.values(gameStats).reduce((sum, category) => sum + (category?.totalScore ?? 0), 0);
}

export function isCloudPayloadProgressEmpty(payload: CloudProfilePayload): boolean {
  return getTotalScoreFromGameStats(payload.gameStats) <= 0 && payload.recentCompletions.length === 0;
}

export function isCloudPayloadEmpty(payload: CloudProfilePayload): boolean {
  return isCloudPayloadProgressEmpty(payload) && !hasMeaningfulProfile(payload.profile);
}

function normalizeRecentCompletions(raw: unknown): RecentCompletion[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (e): e is RecentCompletion =>
      e &&
      typeof e === 'object' &&
      typeof (e as RecentCompletion).id === 'string' &&
      typeof (e as RecentCompletion).title === 'string' &&
      typeof (e as RecentCompletion).score === 'number',
  );
}

function normalizeCategoryFastestMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    if (Number.isFinite(n) && n > 0) out[key] = Math.floor(n);
  }
  return out;
}

function rowToPayload(row: CloudProfileRow): CloudProfilePayload {
  const profile: UserProfile = {
    name: row.display_name,
    country: row.country,
    ...(row.gender ? { gender: row.gender } : {}),
    ...(typeof row.age === 'number' && row.age > 0 ? { age: row.age } : {}),
  };

  return {
    profile: isGuestProfile(profile) ? null : profile,
    gameStats: normalizeGameStatsFromStorage(row.game_stats),
    recentCompletions: normalizeRecentCompletions(row.recent_completions),
    fastestTimerRunSec:
      typeof row.fastest_timer_run_sec === 'number' && row.fastest_timer_run_sec > 0
        ? row.fastest_timer_run_sec
        : undefined,
    fastestTimerByCategory: normalizeCategoryFastestMap(row.fastest_timer_by_category),
    updatedAt: row.updated_at,
  };
}

function mergeLevelStats(a: LevelStats, b: LevelStats): LevelStats {
  return {
    completed: a.completed || b.completed,
    bestScore: Math.max(a.bestScore, b.bestScore),
    attempts: Math.max(a.attempts, b.attempts),
  };
}

function recalcCategoryStats(levels: Record<number, LevelStats>) {
  const totalScore = Object.values(levels).reduce((sum, level) => sum + level.bestScore, 0);
  const highestLevel = Object.entries(levels)
    .filter(([, level]) => level.completed)
    .reduce((max, [lvl]) => Math.max(max, parseInt(lvl, 10)), 0);
  return { levels, totalScore, highestLevel };
}

export function mergeGameStats(local: GameStats, remote: GameStats): GameStats {
  const categories = new Set([...Object.keys(local), ...Object.keys(remote)]);
  const merged: GameStats = {};

  for (const category of categories) {
    const localCategory = local[category];
    const remoteCategory = remote[category];

    if (!localCategory) {
      merged[category] = remoteCategory;
      continue;
    }
    if (!remoteCategory) {
      merged[category] = localCategory;
      continue;
    }

    const levelKeys = new Set([
      ...Object.keys(localCategory.levels ?? {}),
      ...Object.keys(remoteCategory.levels ?? {}),
    ]);
    const levels: Record<number, LevelStats> = {};

    for (const levelKey of levelKeys) {
      const level = Number(levelKey);
      const localLevel = localCategory.levels?.[level];
      const remoteLevel = remoteCategory.levels?.[level];

      if (!localLevel) {
        levels[level] = remoteLevel!;
        continue;
      }
      if (!remoteLevel) {
        levels[level] = localLevel;
        continue;
      }
      levels[level] = mergeLevelStats(localLevel, remoteLevel);
    }

    merged[category] = recalcCategoryStats(levels);
  }

  return merged;
}

export function mergeRecentCompletions(
  local: RecentCompletion[],
  remote: RecentCompletion[],
): RecentCompletion[] {
  const byId = new Map<string, RecentCompletion>();
  for (const entry of [...local, ...remote]) {
    byId.set(entry.id, entry);
  }
  return [...byId.values()]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 40);
}

export function mergeFastestTimerByCategory(
  local: Record<string, number>,
  remote: Record<string, number>,
): Record<string, number> {
  const keys = new Set([...Object.keys(local), ...Object.keys(remote)]);
  const merged: Record<string, number> = {};
  for (const key of keys) {
    const localSec = local[key];
    const remoteSec = remote[key];
    if (localSec == null) {
      merged[key] = remoteSec;
      continue;
    }
    if (remoteSec == null) {
      merged[key] = localSec;
      continue;
    }
    merged[key] = Math.min(localSec, remoteSec);
  }
  return merged;
}

function mergeFastestTimerRunSec(local?: number, remote?: number): number | undefined {
  if (local == null) return remote;
  if (remote == null) return local;
  return Math.min(local, remote);
}

function pickProfile(local: UserProfile | null, remote: UserProfile | null): UserProfile | null {
  const localMeaningful = hasMeaningfulProfile(local);
  const remoteMeaningful = hasMeaningfulProfile(remote);

  if (!localMeaningful && !remoteMeaningful) return null;
  if (!localMeaningful) return remote;
  if (!remoteMeaningful) return local;

  const localComplete = Boolean(local!.gender && local!.age);
  const remoteComplete = Boolean(remote!.gender && remote!.age);
  if (localComplete && !remoteComplete) return local;
  if (remoteComplete && !localComplete) return remote;

  return {
    name: remote!.name || local!.name,
    country: remote!.country || local!.country,
    gender: remote!.gender ?? local!.gender,
    age: remote!.age ?? local!.age,
  };
}

export function mergeCloudAndLocal(
  local: CloudProfilePayload,
  remote: CloudProfilePayload,
): CloudProfilePayload {
  return {
    profile: pickProfile(local.profile, remote.profile),
    gameStats: mergeGameStats(local.gameStats, remote.gameStats),
    recentCompletions: mergeRecentCompletions(local.recentCompletions, remote.recentCompletions),
    fastestTimerRunSec: mergeFastestTimerRunSec(local.fastestTimerRunSec, remote.fastestTimerRunSec),
    fastestTimerByCategory: mergeFastestTimerByCategory(
      local.fastestTimerByCategory,
      remote.fastestTimerByCategory,
    ),
    updatedAt: remote.updatedAt ?? local.updatedAt,
  };
}

export function buildLocalCloudPayload(
  profile: UserProfile | null,
  gameStats: GameStats,
  recentCompletions: RecentCompletion[],
): CloudProfilePayload {
  return {
    profile: isGuestProfile(profile) ? null : profile,
    gameStats,
    recentCompletions,
    fastestTimerRunSec: readFastestTimerRunSec(),
    fastestTimerByCategory: readAllCategoryFastestTimes(),
    updatedAt: null,
  };
}

export function applyCloudPayloadToLocalStorage(payload: CloudProfilePayload): void {
  if (payload.profile) {
    localStorage.setItem('wcq_user_profile', JSON.stringify(payload.profile));
  }

  localStorage.setItem('wcq_game_stats', JSON.stringify(payload.gameStats));
  localStorage.setItem('wcq_recent_completions_v3', JSON.stringify(payload.recentCompletions));
  applyFastestTimerData(payload.fastestTimerRunSec, payload.fastestTimerByCategory);
}

export type FetchCloudProfileResult =
  | { status: 'found'; payload: CloudProfilePayload }
  | { status: 'missing' }
  | { status: 'error'; message: string };

export async function fetchCloudProfile(userId: string): Promise<FetchCloudProfileResult> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch cloud profile:', error.message);
    return { status: 'error', message: error.message };
  }

  if (!data) return { status: 'missing' };
  return { status: 'found', payload: rowToPayload(data as CloudProfileRow) };
}

function profileToRowFields(profile: UserProfile | null) {
  if (!profile) {
    return {
      display_name: GUEST_PROFILE_NAME,
      country: GUEST_PROFILE_COUNTRY,
      gender: null,
      age: null,
    };
  }

  return {
    display_name: profile.name,
    country: profile.country,
    gender: profile.gender ?? null,
    age: typeof profile.age === 'number' && profile.age > 0 ? profile.age : null,
  };
}

export async function upsertCloudProfile(
  userId: string,
  payload: CloudProfilePayload,
): Promise<boolean> {
  const profileFields = profileToRowFields(payload.profile);

  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      ...profileFields,
      game_stats: payload.gameStats,
      recent_completions: payload.recentCompletions,
      fastest_timer_run_sec: payload.fastestTimerRunSec ?? null,
      fastest_timer_by_category: payload.fastestTimerByCategory,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('Failed to upsert cloud profile:', error.message);
    return false;
  }

  return true;
}

export async function syncProfileWithCloud(
  userId: string,
  local: CloudProfilePayload,
): Promise<CloudProfilePayload | null> {
  const remoteResult = await fetchCloudProfile(userId);
  if (remoteResult.status === 'error') {
    return null;
  }

  const localHasData = !isCloudPayloadEmpty(local);

  if (remoteResult.status === 'missing') {
    const uploaded = await upsertCloudProfile(userId, local);
    return uploaded ? local : null;
  }

  const remote = remoteResult.payload;
  const remoteHasData = !isCloudPayloadEmpty(remote);

  // Empty cloud shell — push local progress/profile instead of merging zeros over local data.
  if (!remoteHasData && localHasData) {
    const uploaded = await upsertCloudProfile(userId, local);
    return uploaded ? local : null;
  }

  // Fresh device with no local progress — pull cloud snapshot.
  if (!localHasData && remoteHasData) {
    const uploaded = await upsertCloudProfile(userId, remote);
    return uploaded ? remote : null;
  }

  const merged = mergeCloudAndLocal(local, remote);
  const uploaded = await upsertCloudProfile(userId, merged);
  return uploaded ? merged : null;
}

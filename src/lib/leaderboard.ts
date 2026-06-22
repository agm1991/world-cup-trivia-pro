import { supabase } from '@/integrations/supabase/client';
import { getCountryFlag } from './countryFlags';
import type { GameStatsPersisted } from '@/lib/gameStatsStorage';
import {
  aggregateCategoryStatsFromGameStats,
  isActiveCategoryStats,
} from '@/lib/leaderboardCategories';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  country: string;
  score: number;
  level: number;
  fastestTime?: number;
  isCurrentUser?: boolean;
  playerId?: string;
}

export interface CountryActivity {
  country: string;
  playerCount: number;
  totalScore: number;
  avgLevel: number;
  rank: number;
}

export interface SpeedLeaderEntry {
  name: string;
  country: string;
  fastestTime: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardSnapshot {
  entries: LeaderboardEntry[];
  activity: CountryActivity[];
  speedLeaders: SpeedLeaderEntry[];
  source: 'online' | 'local' | 'empty';
}

type RawCategoryLeaderboardRow = {
  player_id: string;
  category: string;
  display_name: string;
  country: string;
  total_score: number;
  levels_completed: number;
  fastest_time_sec: number | null;
};

type RawLeaderboardRow = {
  player_id: string;
  display_name: string;
  country: string;
  total_score: number;
  levels_completed: number;
  fastest_time_sec: number | null;
};

const LEADERBOARD_PLAYER_ID_KEY = 'wcq_leaderboard_player_id';

function isActiveLeaderboardStats(totalScore: number, levelsCompleted: number): boolean {
  return totalScore > 0 || levelsCompleted > 0;
}

export function isSupabaseLeaderboardConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
}

/** Stable anonymous id for upserting this browser's row when online. */
export function getLeaderboardPlayerId(): string {
  try {
    let id = localStorage.getItem(LEADERBOARD_PLAYER_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `wcq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(LEADERBOARD_PLAYER_ID_KEY, id);
    }
    return id;
  } catch {
    return `wcq-fallback-${Date.now()}`;
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function rowToEntry(row: RawLeaderboardRow, currentPlayerId: string): Omit<LeaderboardEntry, 'rank'> {
  return {
    name: row.display_name,
    country: row.country,
    score: row.total_score,
    level: row.levels_completed,
    fastestTime: row.fastest_time_sec ?? undefined,
    isCurrentUser: row.player_id === currentPlayerId,
    playerId: row.player_id,
  };
}

function rankByScore(
  rows: Omit<LeaderboardEntry, 'rank'>[],
  filterCountry?: string,
): LeaderboardEntry[] {
  const filtered = filterCountry
    ? rows.filter((e) => e.country.toLowerCase() === filterCountry.toLowerCase())
    : rows;
  const sorted = [...filtered].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.level !== a.level) return b.level - a.level;
    return a.name.localeCompare(b.name);
  });
  return sorted.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function getCountryActivityFromEntries(entries: Omit<LeaderboardEntry, 'rank'>[]): CountryActivity[] {
  const byCountry = new Map<string, { players: number; totalScore: number; totalLevel: number }>();
  entries.forEach((e) => {
    const cur = byCountry.get(e.country) || { players: 0, totalScore: 0, totalLevel: 0 };
    byCountry.set(e.country, {
      players: cur.players + 1,
      totalScore: cur.totalScore + e.score,
      totalLevel: cur.totalLevel + e.level,
    });
  });
  const list: CountryActivity[] = Array.from(byCountry.entries()).map(([country, data]) => ({
    country,
    playerCount: data.players,
    totalScore: data.totalScore,
    avgLevel: data.players > 0 ? Math.round(data.totalLevel / data.players) : 0,
    rank: 0,
  }));
  list.sort((a, b) => b.totalScore - a.totalScore);
  return list.map((c, i) => ({ ...c, rank: i + 1 }));
}

export function getSpeedLeadersFromEntries(
  entries: Omit<LeaderboardEntry, 'rank'>[],
  currentPlayerId: string,
  filterCountry?: string,
): SpeedLeaderEntry[] {
  const withTime = entries.filter(
    (e) =>
      e.fastestTime != null &&
      e.fastestTime > 0 &&
      (!filterCountry || e.country.toLowerCase() === filterCountry.toLowerCase()),
  );
  withTime.sort((a, b) => (a.fastestTime ?? 999999) - (b.fastestTime ?? 999999));
  return withTime.map((e, i) => ({
    name: e.name,
    country: e.country,
    fastestTime: e.fastestTime!,
    rank: i + 1,
    isCurrentUser: e.playerId === currentPlayerId,
  }));
}

export function clearLeaderboardPlayerId(): void {
  try {
    localStorage.removeItem(LEADERBOARD_PLAYER_ID_KEY);
  } catch {
    /* ignore */
  }
}

/** Remove this browser's row from Supabase (best-effort; no-op if offline). */
export async function deleteLeaderboardEntry(playerId: string): Promise<void> {
  if (!isSupabaseLeaderboardConfigured() || !playerId.trim()) return;
  const { error } = await supabase.from('leaderboard_entries').delete().eq('player_id', playerId);
  if (error) {
    console.warn('[leaderboard] delete failed:', error.message);
  }
}

/** Push the signed-in local profile + stats to Supabase (no-op if offline / no profile). */
export async function syncLeaderboardProfile(params: {
  name: string;
  country: string;
  totalScore: number;
  levelsCompleted: number;
  fastestTime?: number;
}): Promise<void> {
  if (!isSupabaseLeaderboardConfigured()) return;
  if (!params.name.trim() || !params.country.trim()) return;

  const playerId = getLeaderboardPlayerId();

  if (!isActiveLeaderboardStats(params.totalScore, params.levelsCompleted)) {
    await deleteLeaderboardEntry(playerId);
    return;
  }

  let fastestTimeSec: number | null = null;
  if (params.fastestTime != null && params.fastestTime > 0) {
    const candidate = Math.floor(params.fastestTime);
    const { data: existing } = await supabase
      .from('leaderboard_entries')
      .select('fastest_time_sec')
      .eq('player_id', playerId)
      .maybeSingle();
    const prior = existing?.fastest_time_sec;
    fastestTimeSec =
      prior != null && prior > 0 ? Math.min(prior, candidate) : candidate;
  } else {
    const { data: existing } = await supabase
      .from('leaderboard_entries')
      .select('fastest_time_sec')
      .eq('player_id', playerId)
      .maybeSingle();
    fastestTimeSec =
      existing?.fastest_time_sec != null && existing.fastest_time_sec > 0
        ? existing.fastest_time_sec
        : null;
  }

  const payload = {
    player_id: playerId,
    display_name: params.name.trim(),
    country: params.country.trim(),
    total_score: Math.max(0, params.totalScore),
    levels_completed: Math.max(0, params.levelsCompleted),
    fastest_time_sec: fastestTimeSec,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('leaderboard_entries').upsert(payload, { onConflict: 'player_id' });
  if (error) {
    console.warn('[leaderboard] sync failed:', error.message);
  }
}

async function fetchOnlineRows(): Promise<RawLeaderboardRow[]> {
  if (!isSupabaseLeaderboardConfigured()) return [];

  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select('player_id, display_name, country, total_score, levels_completed, fastest_time_sec')
    .order('total_score', { ascending: false });

  if (error) {
    console.warn('[leaderboard] fetch failed:', error.message);
    return [];
  }

  return (data ?? []) as RawLeaderboardRow[];
}

function localOnlyEntry(params: {
  name: string;
  country: string;
  totalScore: number;
  levelsCompleted: number;
  fastestTime?: number;
  playerId: string;
}): Omit<LeaderboardEntry, 'rank'> {
  return {
    name: params.name,
    country: params.country,
    score: params.totalScore,
    level: params.levelsCompleted,
    fastestTime: params.fastestTime,
    isCurrentUser: true,
    playerId: params.playerId,
  };
}

/** Load all player rows once (syncs current profile when online). */
export async function loadLeaderboardBase(params: {
  currentUserName: string;
  currentUserCountry: string;
  currentUserScore: number;
  currentUserLevelsCompleted: number;
  currentUserFastestTime?: number;
}): Promise<{ rows: Omit<LeaderboardEntry, 'rank'>[]; source: LeaderboardSnapshot['source']; playerId: string }> {
  const playerId = getLeaderboardPlayerId();
  const hasProfile = Boolean(params.currentUserName.trim() && params.currentUserCountry.trim());

  if (hasProfile) {
    await syncLeaderboardProfile({
      name: params.currentUserName,
      country: params.currentUserCountry,
      totalScore: params.currentUserScore,
      levelsCompleted: params.currentUserLevelsCompleted,
      fastestTime: params.currentUserFastestTime,
    });
  }

  const onlineRows = await fetchOnlineRows();
  const activeOnlineRows = onlineRows.filter((row) =>
    isActiveLeaderboardStats(row.total_score, row.levels_completed),
  );
  if (activeOnlineRows.length > 0) {
    return {
      rows: activeOnlineRows.map((row) => rowToEntry(row, playerId)),
      source: 'online',
      playerId,
    };
  }
  const hasActiveStats = isActiveLeaderboardStats(params.currentUserScore, params.currentUserLevelsCompleted);
  if (hasProfile && hasActiveStats) {
    return {
      rows: [
        localOnlyEntry({
          name: params.currentUserName,
          country: params.currentUserCountry,
          totalScore: params.currentUserScore,
          levelsCompleted: params.currentUserLevelsCompleted,
          fastestTime: params.currentUserFastestTime,
          playerId,
        }),
      ],
      source: 'local',
      playerId,
    };
  }
  return { rows: [], source: 'empty', playerId };
}

export { rankByScore as rankLeaderboardEntries };

/** Load worldwide standings, activity, and speed tables — online when Supabase is live. */
export async function loadLeaderboardSnapshot(params: {
  currentUserName: string;
  currentUserCountry: string;
  currentUserScore: number;
  currentUserLevelsCompleted: number;
  currentUserFastestTime?: number;
  filterCountry?: string;
}): Promise<LeaderboardSnapshot> {
  const { rows, source, playerId } = await loadLeaderboardBase(params);

  const entries = rankByScore(rows, params.filterCountry);
  const activityAll = getCountryActivityFromEntries(rows);
  const activity = params.filterCountry
    ? activityAll.filter((c) => c.country.toLowerCase() === params.filterCountry!.toLowerCase())
    : activityAll;
  const speedLeaders = getSpeedLeadersFromEntries(rows, playerId, params.filterCountry);

  return { entries, activity, speedLeaders, source };
}

/** @deprecated Use {@link loadLeaderboardSnapshot} — kept for any legacy imports. */
export function getLeaderboardData(
  currentUserName: string,
  currentUserCountry: string,
  currentUserScore: number,
  currentUserLevelsCompleted: number,
  filterCountry?: string,
  currentUserFastestTime?: number,
): LeaderboardEntry[] {
  const playerId = getLeaderboardPlayerId();
  const hasProfile = Boolean(currentUserName.trim() && currentUserCountry.trim());
  if (!hasProfile) return [];
  return rankByScore(
    [
      localOnlyEntry({
        name: currentUserName,
        country: currentUserCountry,
        totalScore: currentUserScore,
        levelsCompleted: currentUserLevelsCompleted,
        fastestTime: currentUserFastestTime,
        playerId,
      }),
    ],
    filterCountry,
  );
}

export function getStageFromScore(totalScore: number): { stage: string; color: string; nextThreshold?: number } {
  if (totalScore >= 2000) return { stage: 'Legend', color: 'text-amber-400', nextThreshold: undefined };
  if (totalScore >= 1000) return { stage: 'Champion', color: 'text-yellow-500', nextThreshold: 2000 };
  if (totalScore >= 500) return { stage: 'Rising Star', color: 'text-green-500', nextThreshold: 1000 };
  if (totalScore >= 100) return { stage: 'Rookie', color: 'text-blue-400', nextThreshold: 500 };
  return { stage: 'Newcomer', color: 'text-muted-foreground', nextThreshold: 100 };
}

function categoryRowToEntry(row: RawCategoryLeaderboardRow, currentPlayerId: string): Omit<LeaderboardEntry, 'rank'> {
  return {
    name: row.display_name,
    country: row.country,
    score: row.total_score,
    level: row.levels_completed,
    fastestTime: row.fastest_time_sec ?? undefined,
    isCurrentUser: row.player_id === currentPlayerId,
    playerId: row.player_id,
  };
}

/** Remove test Guest rows from Supabase (one-shot local wipe companion). */
export async function purgeGuestLeaderboardRowsFromSupabase(): Promise<void> {
  if (!isSupabaseLeaderboardConfigured()) return;
  const { error: overallErr } = await supabase.from('leaderboard_entries').delete().eq('display_name', 'Guest');
  if (overallErr) console.warn('[leaderboard] purge guest overall failed:', overallErr.message);
  const { error: catErr } = await supabase.from('leaderboard_category_entries').delete().eq('display_name', 'Guest');
  if (catErr) console.warn('[leaderboard] purge guest category failed:', catErr.message);
}

export async function deleteLeaderboardCategoryEntriesForPlayer(playerId: string): Promise<void> {
  if (!isSupabaseLeaderboardConfigured() || !playerId.trim()) return;
  const { error } = await supabase.from('leaderboard_category_entries').delete().eq('player_id', playerId);
  if (error) console.warn('[leaderboard] delete category rows failed:', error.message);
}

export async function syncLeaderboardCategoriesFromLocal(params: {
  name: string;
  country: string;
  gameStats: GameStatsPersisted;
  categoryFastestTimes: Record<string, number>;
}): Promise<void> {
  if (!isSupabaseLeaderboardConfigured()) return;
  if (!params.name.trim() || !params.country.trim()) return;

  const playerId = getLeaderboardPlayerId();
  const aggregated = aggregateCategoryStatsFromGameStats(params.gameStats);
  const categoryIds = new Set([
    ...Object.keys(aggregated),
    ...Object.keys(params.categoryFastestTimes),
  ]);

  for (const category of categoryIds) {
    const stats = aggregated[category] ?? { totalScore: 0, levelsCompleted: 0 };
    const hasPoints = isActiveCategoryStats(stats.totalScore, stats.levelsCompleted);
    const candidateFastest = params.categoryFastestTimes[category];
    const hasSpeed = candidateFastest != null && candidateFastest > 0;

    if (!hasPoints && !hasSpeed) {
      await supabase.from('leaderboard_category_entries').delete().eq('player_id', playerId).eq('category', category);
      continue;
    }

    let fastestTimeSec: number | null = null;
    if (hasSpeed) {
      const candidate = Math.floor(candidateFastest!);
      const { data: existing } = await supabase
        .from('leaderboard_category_entries')
        .select('fastest_time_sec')
        .eq('player_id', playerId)
        .eq('category', category)
        .maybeSingle();
      const prior = existing?.fastest_time_sec;
      fastestTimeSec = prior != null && prior > 0 ? Math.min(prior, candidate) : candidate;
    } else {
      const { data: existing } = await supabase
        .from('leaderboard_category_entries')
        .select('fastest_time_sec')
        .eq('player_id', playerId)
        .eq('category', category)
        .maybeSingle();
      fastestTimeSec =
        existing?.fastest_time_sec != null && existing.fastest_time_sec > 0
          ? existing.fastest_time_sec
          : null;
    }

    const payload = {
      player_id: playerId,
      category,
      display_name: params.name.trim(),
      country: params.country.trim(),
      total_score: Math.max(0, stats.totalScore),
      levels_completed: Math.max(0, stats.levelsCompleted),
      fastest_time_sec: fastestTimeSec,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('leaderboard_category_entries')
      .upsert(payload, { onConflict: 'player_id,category' });
    if (error) console.warn('[leaderboard] category sync failed:', category, error.message);
  }
}

async function fetchCategoryRows(category: string): Promise<RawCategoryLeaderboardRow[]> {
  if (!isSupabaseLeaderboardConfigured()) return [];
  const { data, error } = await supabase
    .from('leaderboard_category_entries')
    .select(
      'player_id, category, display_name, country, total_score, levels_completed, fastest_time_sec',
    )
    .eq('category', category)
    .order('total_score', { ascending: false });
  if (error) {
    console.warn('[leaderboard] category fetch failed:', error.message);
    return [];
  }
  return (data ?? []) as RawCategoryLeaderboardRow[];
}

export type CategoryLeaderboardSnapshot = {
  points: LeaderboardEntry[];
  speed: SpeedLeaderEntry[];
  playerId: string;
  source: 'online' | 'local' | 'empty';
};

export async function loadCategoryLeaderboardSnapshot(params: {
  category: string;
  currentUserName: string;
  currentUserCountry: string;
  gameStats: GameStatsPersisted;
  categoryFastestTimes: Record<string, number>;
}): Promise<CategoryLeaderboardSnapshot> {
  const playerId = getLeaderboardPlayerId();
  const hasProfile = Boolean(params.currentUserName.trim() && params.currentUserCountry.trim());

  if (hasProfile) {
    await syncLeaderboardCategoriesFromLocal({
      name: params.currentUserName,
      country: params.currentUserCountry,
      gameStats: params.gameStats,
      categoryFastestTimes: params.categoryFastestTimes,
    });
  }

  const onlineRows = await fetchCategoryRows(params.category);
  const activeRows = onlineRows.filter(
    (row) =>
      isActiveCategoryStats(row.total_score, row.levels_completed) ||
      (row.fastest_time_sec != null && row.fastest_time_sec > 0),
  );

  if (activeRows.length > 0) {
    const entries = activeRows.map((row) => categoryRowToEntry(row, playerId));
    return {
      points: rankByScore(
        entries.filter((e) => isActiveCategoryStats(e.score, e.level)),
      ),
      speed: getSpeedLeadersFromEntries(entries, playerId),
      playerId,
      source: 'online',
    };
  }

  const aggregated = aggregateCategoryStatsFromGameStats(params.gameStats);
  const localStats = aggregated[params.category];
  const localFastest = params.categoryFastestTimes[params.category];
  const hasLocalPoints =
    localStats != null && isActiveCategoryStats(localStats.totalScore, localStats.levelsCompleted);
  const hasLocalSpeed = localFastest != null && localFastest > 0;

  if (hasProfile && (hasLocalPoints || hasLocalSpeed)) {
    const entry = localOnlyEntry({
      name: params.currentUserName,
      country: params.currentUserCountry,
      totalScore: localStats?.totalScore ?? 0,
      levelsCompleted: localStats?.levelsCompleted ?? 0,
      fastestTime: localFastest,
      playerId,
    });
    return {
      points: hasLocalPoints ? rankByScore([entry]) : [],
      speed: hasLocalSpeed ? getSpeedLeadersFromEntries([entry], playerId) : [],
      playerId,
      source: 'local',
    };
  }

  return { points: [], speed: [], playerId, source: 'empty' };
}

export { getCountryFlag };

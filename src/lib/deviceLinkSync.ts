import { supabase } from '@/integrations/supabase/client';
import {
  applyCloudPayloadToLocalStorage,
  buildLocalCloudPayload,
  isCloudPayloadEmpty,
  mergeCloudAndLocal,
  type CloudProfilePayload,
  type UserProfile,
} from '@/lib/cloudProfileSync';
import {
  normalizeGameStatsFromStorage,
  type GameStatsPersisted as GameStats,
} from '@/lib/gameStatsStorage';
import type { RecentCompletion } from '@/lib/recentCompletionsStorage';
import { GUEST_PROFILE_COUNTRY, GUEST_PROFILE_NAME } from '@/constants/profileGate';

export const SHARED_PROFILE_ID_KEY = 'wcq_shared_profile_id';

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 6;
const CODE_TTL_MS = 15 * 60 * 1000;
const MAX_CODE_COLLISION_RETRIES = 8;

const SHARED_PROFILE_SELECT =
  'id, display_name, country, gender, age, game_stats, recent_completions, fastest_timer_run_sec, fastest_timer_by_category, updated_at';

type SharedProfileRow = {
  id: string;
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

type DeviceLinkCodeRow = {
  code: string;
  profile_id: string;
  expires_at: string;
  redeemed_at: string | null;
};

export type GenerateLinkCodeResult =
  | { ok: true; code: string; expiresAt: Date; profileId: string }
  | { ok: false; error: string };

export type RedeemLinkCodeResult =
  | { ok: true; profileId: string; payload: CloudProfilePayload }
  | { ok: false; reason: 'invalid' | 'expired' | 'network'; message: string };

function isGuestProfile(profile: UserProfile | null): boolean {
  if (!profile) return true;
  return profile.name === GUEST_PROFILE_NAME && profile.country === GUEST_PROFILE_COUNTRY;
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

function rowToPayload(row: SharedProfileRow): CloudProfilePayload {
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

export function getSharedProfileId(): string | null {
  try {
    return localStorage.getItem(SHARED_PROFILE_ID_KEY);
  } catch {
    return null;
  }
}

export function setSharedProfileId(id: string): void {
  localStorage.setItem(SHARED_PROFILE_ID_KEY, id);
}

export function normalizeLinkCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH);
}

function generateRandomCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
}

export async function upsertSharedProfile(
  profileId: string,
  payload: CloudProfilePayload,
): Promise<boolean> {
  const profileFields = profileToRowFields(payload.profile);

  const { error } = await supabase.from('shared_profiles').upsert(
    {
      id: profileId,
      ...profileFields,
      game_stats: payload.gameStats,
      recent_completions: payload.recentCompletions,
      fastest_timer_run_sec: payload.fastestTimerRunSec ?? null,
      fastest_timer_by_category: payload.fastestTimerByCategory,
    },
    { onConflict: 'id' },
  );

  if (error) {
    console.error('Failed to upsert shared profile:', error.message);
    return false;
  }

  return true;
}

export async function fetchSharedProfile(
  profileId: string,
): Promise<CloudProfilePayload | null> {
  const { data, error } = await supabase
    .from('shared_profiles')
    .select(SHARED_PROFILE_SELECT)
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch shared profile:', error.message);
    return null;
  }

  if (!data) return null;
  return rowToPayload(data as SharedProfileRow);
}

export async function syncLocalWithSharedProfile(
  profileId: string,
  local: CloudProfilePayload,
): Promise<CloudProfilePayload | null> {
  const remote = await fetchSharedProfile(profileId);
  if (remote === null) {
    const uploaded = await upsertSharedProfile(profileId, local);
    return uploaded ? local : null;
  }

  const localHasData = !isCloudPayloadEmpty(local);
  const remoteHasData = !isCloudPayloadEmpty(remote);

  if (!remoteHasData && localHasData) {
    const uploaded = await upsertSharedProfile(profileId, local);
    return uploaded ? local : null;
  }

  if (!localHasData && remoteHasData) {
    const uploaded = await upsertSharedProfile(profileId, remote);
    return uploaded ? remote : null;
  }

  const merged = mergeCloudAndLocal(local, remote);
  const uploaded = await upsertSharedProfile(profileId, merged);
  return uploaded ? merged : null;
}

export async function generateDeviceLinkCode(
  profile: UserProfile | null,
  gameStats: GameStats,
  recentCompletions: RecentCompletion[],
): Promise<GenerateLinkCodeResult> {
  const local = buildLocalCloudPayload(profile, gameStats, recentCompletions);
  let profileId = getSharedProfileId();

  if (!profileId) {
    profileId = crypto.randomUUID();
  }

  const uploaded = await upsertSharedProfile(profileId, local);
  if (!uploaded) {
    return { ok: false, error: 'Could not save your profile to the cloud. Check your connection and try again.' };
  }

  setSharedProfileId(profileId);

  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  for (let attempt = 0; attempt < MAX_CODE_COLLISION_RETRIES; attempt++) {
    const code = generateRandomCode();
    const { error } = await supabase.from('device_link_codes').insert({
      code,
      profile_id: profileId,
      expires_at: expiresAt.toISOString(),
    });

    if (!error) {
      return { ok: true, code, expiresAt, profileId };
    }

    if (error.code !== '23505') {
      console.error('Failed to create link code:', error.message);
      return { ok: false, error: 'Could not generate a link code. Please try again.' };
    }
  }

  return { ok: false, error: 'Could not generate a unique link code. Please try again.' };
}

function isCodeExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export async function redeemDeviceLinkCode(rawCode: string): Promise<RedeemLinkCodeResult> {
  const code = normalizeLinkCode(rawCode);
  if (code.length !== CODE_LENGTH) {
    return { ok: false, reason: 'invalid', message: 'Enter a valid 6-character link code.' };
  }

  const { data: codeRow, error: codeError } = await supabase
    .from('device_link_codes')
    .select('code, profile_id, expires_at, redeemed_at')
    .eq('code', code)
    .maybeSingle();

  if (codeError) {
    console.error('Failed to look up link code:', codeError.message);
    return {
      ok: false,
      reason: 'network',
      message: 'Could not verify the code. Check your connection and try again.',
    };
  }

  const row = codeRow as DeviceLinkCodeRow | null;
  if (!row) {
    return { ok: false, reason: 'invalid', message: 'That code was not found. Double-check and try again.' };
  }

  if (row.redeemed_at) {
    return {
      ok: false,
      reason: 'expired',
      message: 'This code has already been used. Generate a new code on your other device.',
    };
  }

  if (isCodeExpired(row.expires_at)) {
    return {
      ok: false,
      reason: 'expired',
      message: 'This code has expired. Generate a fresh code on your other device.',
    };
  }

  const payload = await fetchSharedProfile(row.profile_id);
  if (!payload) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'No profile was found for this code. It may have expired or been removed.',
    };
  }

  const { error: redeemError } = await supabase
    .from('device_link_codes')
    .update({ redeemed_at: new Date().toISOString() })
    .eq('code', code)
    .is('redeemed_at', null);

  if (redeemError) {
    console.error('Failed to mark link code redeemed:', redeemError.message);
    return {
      ok: false,
      reason: 'network',
      message: 'Could not complete linking. Check your connection and try again.',
    };
  }

  applyCloudPayloadToLocalStorage(payload);
  setSharedProfileId(row.profile_id);

  return { ok: true, profileId: row.profile_id, payload };
}

export function applySharedProfilePayload(payload: CloudProfilePayload): void {
  applyCloudPayloadToLocalStorage(payload);
}

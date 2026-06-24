import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { Category } from '@/types/game';
import {
  readGameStatsFromStorage,
  STATS_STORAGE_KEY,
  type CategoryStatsPersisted as CategoryStats,
  type GameStatsPersisted as GameStats,
  type LevelStatsPersisted as LevelStats,
} from '@/lib/gameStatsStorage';
import {
  appendRecentCompletion,
  readRecentCompletions,
  RECENT_COMPLETIONS_KEY,
  type RecentCompletion,
} from '@/lib/recentCompletionsStorage';
import {
  clearLeaderboardPlayerId,
  deleteLeaderboardCategoryEntriesForPlayer,
  deleteLeaderboardEntry,
  purgeGuestLeaderboardRowsFromSupabase,
} from '@/lib/leaderboard';
import { clearFastestTimerRun, readFastestTimerRunSec } from '@/lib/fastestTimerRun';
import { hasGameAccess } from '@/lib/gameAccess';
import {
  AUTO_GUEST_PROFILE,
  GUEST_PROFILE_COUNTRY,
  GUEST_PROFILE_NAME,
} from '@/constants/profileGate';
import { useGameAccess } from '@/contexts/GameAccessContext';
import {
  buildLocalCloudPayload,
  syncProfileWithCloud,
  upsertCloudProfile,
  applyCloudPayloadToLocalStorage,
} from '@/lib/cloudProfileSync';

interface LocalProfile {
  name: string;
  country: string;
  gender?: string;
  age?: number;
}

export function isProfileComplete(profile: LocalProfile | null): profile is LocalProfile & { gender: string; age: number } {
  return !!(profile?.name?.trim() && profile?.country && profile?.gender && profile?.age && profile.age > 0);
}

interface LocalProfileContextType {
  profile: LocalProfile | null;
  /** True after the initial client read of `wcq_user_profile` (sync in state initializer; avoids a bogus loading gate). */
  isProfileHydrated: boolean;
  createProfile: (name: string, country: string, gender?: string, age?: number) => void;
  clearProfile: () => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  /** Session-only score for in-progress rounds (header / games); reset when leaving a round */
  liveSessionScore: number;
  setLiveSessionScore: (score: number) => void;
  // Stats
  gameStats: GameStats;
  refreshGameStatsFromStorage: () => void;
  saveLevelStats: (category: Category, level: number, score: number, completed: boolean) => void;
  getLevelStats: (category: Category, level: number) => LevelStats | null;
  getCategoryStats: (category: Category) => CategoryStats | null;
  getTotalStats: () => {
    totalScore: number;
    levelsCompleted: number;
    categoriesPlayed: number;
    fastestTimerRunSec?: number;
  };
  /** Short log lines for Profile “Recent results”. */
  recentCompletions: RecentCompletion[];
  refreshRecentCompletionsFromStorage: () => void;
  recordGameCompletion: (entry: Omit<RecentCompletion, 'id' | 'at'>) => void;
  /** True when signed in with email — profile and stats sync to Supabase. */
  isCloudSyncEnabled: boolean;
  /** Pull from cloud, merge with local, and apply — for manual sync while signed in. */
  syncAccountWithCloud: () => Promise<{ ok: true } | { ok: false; error: string }>;
}

const LocalProfileContext = createContext<LocalProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'wcq_user_profile';
const TEMP_CLEAR_SAVED_PROFILE_ONCE = false;
const TEMP_PROFILE_CLEAR_DONE_KEY = 'wcq_temp_profile_clear_done_v1';
const SCORE_COINS_RESET_KEY = 'wcq_score_coins_reset_v1';
const PROFILE_FORM_RESET_KEY = 'wcq_profile_form_reset_v1';
const PRE_ONLINE_DATA_RESET_KEY = 'wcq_pre_online_data_reset_v1';
const LEADERBOARD_PLAYER_ID_KEY = 'wcq_leaderboard_player_id';
/** One-shot: wipe Guest/Brazil test leaderboard data after QA. */
const LEADERBOARD_TEST_DATA_WIPE_KEY = 'wcq_leaderboard_test_data_wipe_v1';
const SUPPRESS_AUTO_GUEST_KEY = 'wcq_suppress_auto_guest_v1';

function wipeLeaderboardTestDataSync(): void {
  try {
    if (localStorage.getItem(LEADERBOARD_TEST_DATA_WIPE_KEY)) return;
    const oldPlayerId = localStorage.getItem(LEADERBOARD_PLAYER_ID_KEY);
    if (oldPlayerId) {
      void deleteLeaderboardEntry(oldPlayerId);
      void deleteLeaderboardCategoryEntriesForPlayer(oldPlayerId);
    }
    void purgeGuestLeaderboardRowsFromSupabase();
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem(RECENT_COMPLETIONS_KEY);
    clearFastestTimerRun();
    clearLeaderboardPlayerId();
    localStorage.setItem(SUPPRESS_AUTO_GUEST_KEY, '1');
    localStorage.setItem(LEADERBOARD_TEST_DATA_WIPE_KEY, '1');
  } catch {
    /* ignore */
  }
}

function applyPreOnlineDataResetSync(): void {
  try {
    if (localStorage.getItem(PRE_ONLINE_DATA_RESET_KEY)) return;
    const oldPlayerId = localStorage.getItem(LEADERBOARD_PLAYER_ID_KEY);
    if (oldPlayerId) {
      void deleteLeaderboardEntry(oldPlayerId);
    }
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem(RECENT_COMPLETIONS_KEY);
    clearFastestTimerRun();
    clearLeaderboardPlayerId();
    localStorage.setItem(PRE_ONLINE_DATA_RESET_KEY, '1');
  } catch {
    /* ignore */
  }
}

function buildGuestProfile(): LocalProfile {
  return { name: GUEST_PROFILE_NAME, country: GUEST_PROFILE_COUNTRY };
}

function persistGuestProfile(): LocalProfile {
  const guest = buildGuestProfile();
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(guest));
  } catch {
    /* ignore quota / private-mode errors */
  }
  return guest;
}

/** Read saved profile; when {@link AUTO_GUEST_PROFILE} is on, create a guest row if none exists. */
function hydrateProfileFromStorage(): LocalProfile | null {
  const stored = readStoredProfile();
  if (stored) return stored;
  if (localStorage.getItem(SUPPRESS_AUTO_GUEST_KEY)) return null;
  if (!AUTO_GUEST_PROFILE) return null;
  return persistGuestProfile();
}

function readStoredProfile(): LocalProfile | null {
  try {
    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!storedProfile) return null;
    const parsed = JSON.parse(storedProfile) as {
      name?: string;
      country?: string;
      gender?: string;
      age?: number;
    };
    if (parsed?.name && parsed?.country) {
      return {
        name: parsed.name,
        country: parsed.country,
        gender: parsed.gender,
        age: typeof parsed.age === 'number' ? parsed.age : undefined,
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to parse stored profile:', e);
    return null;
  }
}

export const useLocalProfile = () => {
  const context = useContext(LocalProfileContext);
  if (!context) {
    throw new Error('useLocalProfile must be used within a LocalProfileProvider');
  }
  return context;
};

const createEmptyCategoryStats = (): CategoryStats => ({
  levels: {},
  totalScore: 0,
  highestLevel: 0,
});

export const LocalProfileProvider = ({ children }: { children: ReactNode }) => {
  const { authUser } = useGameAccess();
  const cloudSaveTimerRef = useRef<number | null>(null);
  const cloudSyncInFlightRef = useRef(false);
  const cloudInitialSyncDoneRef = useRef<string | null>(null);
  const isCloudSyncEnabled = Boolean(authUser?.id);

  const [profile, setProfile] = useState<LocalProfile | null>(() => {
    try {
      applyPreOnlineDataResetSync();
      wipeLeaderboardTestDataSync();
      if (TEMP_CLEAR_SAVED_PROFILE_ONCE && !localStorage.getItem(TEMP_PROFILE_CLEAR_DONE_KEY)) {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        localStorage.setItem(TEMP_PROFILE_CLEAR_DONE_KEY, '1');
        return hydrateProfileFromStorage();
      }
      if (!localStorage.getItem(PROFILE_FORM_RESET_KEY)) {
        localStorage.setItem(PROFILE_FORM_RESET_KEY, '1');
        return hydrateProfileFromStorage();
      }
      return hydrateProfileFromStorage();
    } catch {
      return null;
    }
  });
  const isProfileHydrated = true;
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [liveSessionScore, setLiveSessionScore] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>({});
  const [recentCompletions, setRecentCompletions] = useState<RecentCompletion[]>(() => {
    applyPreOnlineDataResetSync();
    return readRecentCompletions();
  });

  // Refresh stats (and profile, e.g. other-tab edits) from localStorage after mount
  useEffect(() => {
    try {
      wipeLeaderboardTestDataSync();
      if (TEMP_CLEAR_SAVED_PROFILE_ONCE && !localStorage.getItem(TEMP_PROFILE_CLEAR_DONE_KEY)) {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        localStorage.setItem(TEMP_PROFILE_CLEAR_DONE_KEY, '1');
        setProfile(hydrateProfileFromStorage());
      } else if (!localStorage.getItem(PROFILE_FORM_RESET_KEY)) {
        localStorage.setItem(PROFILE_FORM_RESET_KEY, '1');
        setProfile(hydrateProfileFromStorage());
      } else {
        setProfile(hydrateProfileFromStorage());
      }

      if (!localStorage.getItem(SCORE_COINS_RESET_KEY)) {
        localStorage.removeItem(STATS_STORAGE_KEY);
        clearFastestTimerRun();
        localStorage.setItem(SCORE_COINS_RESET_KEY, '1');
        setGameStats({});
      } else {
        setGameStats(readGameStatsFromStorage());
      }
      setRecentCompletions(readRecentCompletions());
    } catch (e) {
      console.error('Failed to hydrate from localStorage:', e);
    }
  }, []);

  // If a profile exists (saved or freshly created), do not force the onboarding dialog open — fixes stuck modal after localStorage hydrate.
  useEffect(() => {
    if (profile) {
      setShowProfileModal(false);
    }
  }, [profile]);

  const refreshGameStatsFromStorage = useCallback(() => {
    setGameStats(readGameStatsFromStorage());
  }, []);

  const refreshRecentCompletionsFromStorage = useCallback(() => {
    setRecentCompletions(readRecentCompletions());
  }, []);

  const recordGameCompletion = useCallback((entry: Omit<RecentCompletion, 'id' | 'at'>) => {
    appendRecentCompletion(entry);
    setRecentCompletions(readRecentCompletions());
  }, []);

  const pushToCloud = useCallback(async (userId: string) => {
    const payload = buildLocalCloudPayload(
      readStoredProfile(),
      readGameStatsFromStorage(),
      readRecentCompletions(),
    );
    await upsertCloudProfile(userId, payload);
  }, []);

  const runCloudSync = useCallback(async (
    userId: string,
    options?: { isCancelled?: () => boolean },
  ): Promise<boolean> => {
    if (cloudSyncInFlightRef.current) return false;

    cloudSyncInFlightRef.current = true;
    cloudInitialSyncDoneRef.current = null;

    try {
      const localPayload = buildLocalCloudPayload(
        readStoredProfile(),
        readGameStatsFromStorage(),
        readRecentCompletions(),
      );

      const merged = await syncProfileWithCloud(userId, localPayload);
      if (!merged || options?.isCancelled?.()) return false;

      applyCloudPayloadToLocalStorage(merged);
      setProfile(readStoredProfile());
      setGameStats(merged.gameStats);
      setRecentCompletions(merged.recentCompletions);
      cloudInitialSyncDoneRef.current = userId;
      return true;
    } finally {
      cloudSyncInFlightRef.current = false;
    }
  }, []);

  const syncAccountWithCloud = useCallback(async (): Promise<
    { ok: true } | { ok: false; error: string }
  > => {
    const userId = authUser?.id;
    if (!userId) {
      return { ok: false, error: 'Sign in with your email first.' };
    }
    if (cloudSyncInFlightRef.current) {
      return { ok: false, error: 'Sync already in progress.' };
    }

    const success = await runCloudSync(userId);
    if (!success) {
      return { ok: false, error: 'Could not sync. Check your connection and try again.' };
    }
    return { ok: true };
  }, [authUser?.id, runCloudSync]);

  const scheduleCloudSave = useCallback(() => {
    const userId = authUser?.id;
    if (!userId || cloudInitialSyncDoneRef.current !== userId) return;

    if (cloudSaveTimerRef.current != null) {
      window.clearTimeout(cloudSaveTimerRef.current);
    }

    cloudSaveTimerRef.current = window.setTimeout(() => {
      cloudSaveTimerRef.current = null;
      void pushToCloud(userId);
    }, 1500);
  }, [authUser?.id, pushToCloud]);

  // Pull from cloud on email login, merge with this device, then push merged snapshot back.
  useEffect(() => {
    const userId = authUser?.id;
    if (!userId) {
      cloudInitialSyncDoneRef.current = null;
      return;
    }

    if (cloudSyncInFlightRef.current) return;

    let cancelled = false;

    void (async () => {
      await runCloudSync(userId, { isCancelled: () => cancelled });
    })();

    return () => {
      cancelled = true;
    };
  }, [authUser?.id, runCloudSync]);

  // Push local edits to cloud while signed in (debounced).
  useEffect(() => {
    scheduleCloudSave();
    return () => {
      if (cloudSaveTimerRef.current != null) {
        window.clearTimeout(cloudSaveTimerRef.current);
      }
    };
  }, [profile, gameStats, recentCompletions, scheduleCloudSave]);

  // Same-tab: games write to localStorage; re-read when tab becomes visible again.
  useEffect(() => {
    const sync = () => {
      if (document.visibilityState === 'visible') {
        refreshGameStatsFromStorage();
        refreshRecentCompletionsFromStorage();
      }
    };
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('focus', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('focus', sync);
    };
  }, [refreshGameStatsFromStorage, refreshRecentCompletionsFromStorage]);

  // Other tabs / windows update localStorage; `storage` fires here when key changes.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STATS_STORAGE_KEY) {
        refreshGameStatsFromStorage();
      }
      if (e.key === RECENT_COMPLETIONS_KEY) {
        refreshRecentCompletionsFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshGameStatsFromStorage, refreshRecentCompletionsFromStorage]);

  // Auto-save gameStats to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(gameStats).length > 0) {
      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(gameStats));
      } catch (e) {
        console.error('Failed to save game stats:', e);
      }
    }
  }, [gameStats]);

  // Force save on page close/unload
  useEffect(() => {
    const persistLocal = () => {
      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(gameStats));
        if (profile) {
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        }
      } catch (e) {
        console.error('Failed to save on page unload:', e);
      }
    };

    const handleBeforeUnload = () => {
      persistLocal();
      if (authUser?.id) {
        void pushToCloud(authUser.id);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        persistLocal();
        if (authUser?.id) {
          void pushToCloud(authUser.id);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameStats, profile, authUser?.id, pushToCloud]);

  const createProfile = (name: string, country: string, gender?: string, age?: number) => {
    if (!hasGameAccess()) {
      return;
    }
    const newProfile: LocalProfile = {
      name,
      country,
      ...(gender ? { gender } : {}),
      ...(typeof age === 'number' && age > 0 ? { age } : {}),
    };
    setProfile(newProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    localStorage.removeItem(SUPPRESS_AUTO_GUEST_KEY);
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  const saveLevelStats = (category: Category, level: number, score: number, completed: boolean) => {
    setGameStats(prev => {
      const categoryStats = prev[category] || createEmptyCategoryStats();
      const priorLevels = categoryStats.levels ?? {};
      const existingLevel = priorLevels[level] || { completed: false, bestScore: 0, attempts: 0 };

      const updatedLevel: LevelStats = {
        completed: completed || existingLevel.completed,
        bestScore: Math.max(score, existingLevel.bestScore),
        attempts: existingLevel.attempts + 1,
      };

      const updatedLevels = {
        ...priorLevels,
        [level]: updatedLevel,
      };

      // Calculate total score from all completed levels
      const totalScore = Object.values(updatedLevels).reduce((sum, l) => sum + l.bestScore, 0);
      
      // Find highest completed level
      const highestLevel = Object.entries(updatedLevels)
        .filter(([_, l]) => l.completed)
        .reduce((max, [lvl, _]) => Math.max(max, parseInt(lvl)), 0);

      const updatedCategoryStats: CategoryStats = {
        levels: updatedLevels,
        totalScore,
        highestLevel,
      };

      const newStats = {
        ...prev,
        [category]: updatedCategoryStats,
      };

      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    });
  };

  const getLevelStats = (category: Category, level: number): LevelStats | null => {
    return gameStats[category]?.levels?.[level] ?? null;
  };

  const getCategoryStats = (category: Category): CategoryStats | null => {
    return gameStats[category] || null;
  };

  const getTotalStats = () => {
    let totalScore = 0;
    let levelsCompleted = 0;
    let categoriesPlayed = 0;

    Object.values(gameStats).forEach(categoryStats => {
      const levels = categoryStats.levels ?? {};
      totalScore += categoryStats.totalScore;
      levelsCompleted += Object.values(levels).filter(l => l.completed).length;
      if (Object.keys(levels).length > 0) {
        categoriesPlayed++;
      }
    });

    return { totalScore, levelsCompleted, categoriesPlayed, fastestTimerRunSec: readFastestTimerRunSec() };
  };

  return (
    <LocalProfileContext.Provider
      value={{
        profile,
        isProfileHydrated,
        createProfile,
        clearProfile,
        showProfileModal,
        setShowProfileModal,
        liveSessionScore,
        setLiveSessionScore,
        gameStats,
        refreshGameStatsFromStorage,
        saveLevelStats,
        getLevelStats,
        getCategoryStats,
        getTotalStats,
        recentCompletions,
        refreshRecentCompletionsFromStorage,
        recordGameCompletion,
        isCloudSyncEnabled,
        syncAccountWithCloud,
      }}
    >
      {children}
    </LocalProfileContext.Provider>
  );
};

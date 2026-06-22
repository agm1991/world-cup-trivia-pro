import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { REQUIRE_PROFILE_TO_PLAY } from '@/constants/profileGate';

/** Re-export for screens that gated on compile-time toggle (often `false`). */
export { REQUIRE_PROFILE_TO_PLAY } from '@/constants/profileGate';

export type RequireProfileStatus = {
  /** True after the first synchronous read of `wcq_user_profile` from localStorage. */
  isProfileHydrated: boolean;
  hasProfile: boolean;
};

/**
 * Hydration status for games that optionally gate on profile. Does not open the create-profile modal —
 * users create a profile from Menu / Create profile on their own.
 */
export const useRequireProfile = (): RequireProfileStatus => {
  const { profile, isProfileHydrated: hydratedFlag } = useLocalProfile();
  const isProfileHydrated = hydratedFlag ?? true;

  return { isProfileHydrated, hasProfile: !REQUIRE_PROFILE_TO_PLAY || !!profile };
};

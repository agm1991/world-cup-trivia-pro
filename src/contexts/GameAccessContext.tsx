import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { BYPASS_PAYMENT, hasGameAccess, subscribeGameAccessUnlock } from '@/lib/gameAccess';
import { signOutSession, syncGameAccessFromSupabase } from '@/lib/restorePurchase';

type GameAccessContextValue = {
  /** False while checking Supabase for a cross-device purchase. */
  ready: boolean;
  hasAccess: boolean;
  /** Active Supabase auth session (magic-link login). */
  authUser: User | null;
  refreshAccess: () => Promise<boolean>;
  signOut: () => Promise<{ ok: true } | { ok: false; error: string }>;
};

const GameAccessContext = createContext<GameAccessContextValue | null>(null);

export function GameAccessProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => BYPASS_PAYMENT || hasGameAccess());
  const [hasAccess, setHasAccess] = useState(() => hasGameAccess());
  const [authUser, setAuthUser] = useState<User | null>(null);

  const refreshAuthUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setAuthUser(session?.user ?? null);
  }, []);

  const refreshAccess = useCallback(async (): Promise<boolean> => {
    if (BYPASS_PAYMENT) {
      setHasAccess(true);
      setReady(true);
      return true;
    }

    if (hasGameAccess()) {
      setHasAccess(true);
      setReady(true);
      return true;
    }

    const unlocked = await syncGameAccessFromSupabase();
    setHasAccess(unlocked);
    setReady(true);
    return unlocked;
  }, []);

  const signOut = useCallback(async () => {
    setHasAccess(false);
    setAuthUser(null);
    const result = await signOutSession();
    setReady(true);
    return result;
  }, []);

  useEffect(() => {
    void refreshAuthUser();

    if (BYPASS_PAYMENT || hasGameAccess()) {
      setHasAccess(true);
      setReady(true);
    }

    let cancelled = false;

    if (!BYPASS_PAYMENT && !hasGameAccess()) {
      refreshAccess().finally(() => {
        if (!cancelled) {
          setReady(true);
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setAuthUser(session?.user ?? null);
      void refreshAccess();
    });

    const unsubscribeUnlock = subscribeGameAccessUnlock(() => {
      if (cancelled) return;
      setHasAccess(true);
      setReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      unsubscribeUnlock();
    };
  }, [refreshAccess, refreshAuthUser]);

  return (
    <GameAccessContext.Provider value={{ ready, hasAccess, authUser, refreshAccess, signOut }}>
      {children}
    </GameAccessContext.Provider>
  );
}

export function useGameAccess(): GameAccessContextValue {
  const context = useContext(GameAccessContext);
  if (!context) {
    throw new Error('useGameAccess must be used within a GameAccessProvider');
  }
  return context;
}

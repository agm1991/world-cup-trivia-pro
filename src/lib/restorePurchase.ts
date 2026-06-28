import { supabase } from '@/integrations/supabase/client';
import { clearGameAccess, hasGameAccess, setGameAccessUnlocked } from '@/lib/gameAccess';

let signOutInProgress = false;

const MAGIC_LINK_INTENT_KEY = 'wcq_magic_link_intent';

export type MagicLinkIntent = 'sync' | 'restore';

export function setMagicLinkIntent(intent: MagicLinkIntent): void {
  try {
    sessionStorage.setItem(MAGIC_LINK_INTENT_KEY, intent);
  } catch {
    /* ignore */
  }
}

/** Read and clear the intent stored when the magic link was sent (fallback if redirect params are stripped). */
export function consumeMagicLinkIntent(): MagicLinkIntent | null {
  try {
    const intent = sessionStorage.getItem(MAGIC_LINK_INTENT_KEY);
    sessionStorage.removeItem(MAGIC_LINK_INTENT_KEY);
    if (intent === 'sync' || intent === 'restore') return intent;
    return null;
  } catch {
    return null;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function ensurePurchaseRecorded(email: string): Promise<boolean> {
  try {
    const response = await fetch('/api/ensure-kick-off-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizeEmail(email) }),
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { found?: boolean };
    return Boolean(payload.found);
  } catch {
    return false;
  }
}

/** Wait until Supabase has a signed-in session (magic-link ?code= exchange). */
export async function waitForAuthSession(timeoutMs = 15000): Promise<{ userId: string; email: string | null } | null> {
  const {
    data: { session: initialSession },
  } = await supabase.auth.getSession();

  if (initialSession?.user?.id) {
    return { userId: initialSession.user.id, email: initialSession.user.email ?? null };
  }

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      subscription.unsubscribe();
      resolve(null);
    }, timeoutMs);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session?.user?.id &&
        (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')
      ) {
        window.clearTimeout(timer);
        subscription.unsubscribe();
        resolve({ userId: session.user.id, email: session.user.email ?? null });
      }
    });
  });
}

/** Magic-link redirects include ?code= — wait until Supabase finishes exchanging it. */
async function waitForAuthEmail(timeoutMs = 10000): Promise<string | null> {
  const {
    data: { session: initialSession },
  } = await supabase.auth.getSession();

  if (initialSession?.user?.email) {
    return initialSession.user.email;
  }

  return new Promise((resolve) => {
    const timer = window.setTimeout(() => {
      subscription.unsubscribe();
      resolve(null);
    }, timeoutMs);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        window.clearTimeout(timer);
        subscription.unsubscribe();
        resolve(session.user.email);
      }
    });
  });
}

/** After magic-link login, confirm purchase in Supabase and unlock this device. */
export async function syncGameAccessFromSupabase(): Promise<boolean> {
  if (signOutInProgress) {
    return false;
  }

  if (hasGameAccess()) {
    return true;
  }

  const email = await waitForAuthEmail();
  if (!email) {
    return false;
  }

  const normalized = normalizeEmail(email);
  const purchaseReady = await ensurePurchaseRecorded(normalized);
  if (!purchaseReady) {
    return false;
  }

  await supabase.rpc('link_kick_off_purchase');

  const { data, error } = await supabase
    .from('kick_off_purchases')
    .select('id')
    .ilike('email', normalized)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  setGameAccessUnlocked();
  return true;
}

export async function sendRestoreMagicLink(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = normalizeEmail(email);
  if (!normalized.includes('@') || !normalized.includes('.')) {
    return { ok: false, error: 'Enter the email you used at Stripe checkout.' };
  }

  const purchaseReady = await ensurePurchaseRecorded(normalized);
  if (!purchaseReady) {
    return {
      ok: false,
      error: 'No purchase found for this email. Use the same email from Stripe checkout.',
    };
  }

  const redirectTo = `${window.location.origin}/?restore=success`;
  setMagicLinkIntent('restore');

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** Magic link for cross-device profile/score sync — separate redirect from purchase restore. */
export async function sendAccountSyncMagicLink(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = normalizeEmail(email);
  if (!normalized.includes('@') || !normalized.includes('.')) {
    return { ok: false, error: 'Enter a valid email address.' };
  }

  const redirectTo = `${window.location.origin}/?sync=success`;
  setMagicLinkIntent('sync');

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

/** Resolve why the user returned from a magic link (URL param wins over sessionStorage). */
export function resolveMagicLinkReturn(
  syncParam: string | null,
  restoreParam: string | null,
): MagicLinkIntent | null {
  if (syncParam === 'success') {
    consumeMagicLinkIntent();
    return 'sync';
  }
  if (restoreParam === 'success') {
    consumeMagicLinkIntent();
    return 'restore';
  }
  return consumeMagicLinkIntent();
}

/** Sign out of Supabase and clear local game access on this device. */
export async function signOutSession(): Promise<{ ok: true } | { ok: false; error: string }> {
  signOutInProgress = true;

  try {
    clearGameAccess();

    const { error } = await supabase.auth.signOut();
    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } finally {
    signOutInProgress = false;
  }
}

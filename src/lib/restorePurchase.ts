import { supabase } from '@/integrations/supabase/client';
import { clearGameAccess, hasGameAccess, setGameAccessUnlocked } from '@/lib/gameAccess';

let signOutInProgress = false;

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

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
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

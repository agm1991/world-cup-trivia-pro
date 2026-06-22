/** Screenshot mode — bypass £1 gate. Set back to false when done, then redeploy. */
export const BYPASS_PAYMENT = false;

/** Set after Stripe confirms payment or Supabase restore succeeds. */
export const PAID_STORAGE_KEY = 'wc-showdown-paid-v1';

const unlockListeners = new Set<() => void>();

/** Subscribe when local access is unlocked (payment verify or restore). */
export function subscribeGameAccessUnlock(listener: () => void): () => void {
  unlockListeners.add(listener);
  return () => {
    unlockListeners.delete(listener);
  };
}

export function setGameAccessUnlocked(): void {
  try {
    localStorage.setItem(PAID_STORAGE_KEY, 'verified');
  } catch {
    // ignore storage failures
  }
  unlockListeners.forEach((listener) => listener());
}

export function hasGameAccess(): boolean {
  if (BYPASS_PAYMENT) return true;
  try {
    return localStorage.getItem(PAID_STORAGE_KEY) === 'verified';
  } catch {
    return false;
  }
}

/** Clear local unlock (e.g. on log out). Does not touch Supabase session. */
export function clearGameAccess(): void {
  try {
    localStorage.removeItem(PAID_STORAGE_KEY);
  } catch {
    // ignore storage failures
  }
}

/** Verify a Stripe Checkout session server-side, persist to Supabase, then unlock this device. */
export async function confirmPaidCheckout(sessionId: string): Promise<boolean> {
  const trimmed = sessionId.trim();
  if (!trimmed.startsWith('cs_')) {
    return false;
  }

  try {
    const response = await fetch('/api/verify-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: trimmed }),
    });

    const payload = (await response.json()) as { paid?: boolean; error?: string };

    if (!response.ok || !payload.paid) {
      return false;
    }

    setGameAccessUnlocked();
    return true;
  } catch {
    return false;
  }
}

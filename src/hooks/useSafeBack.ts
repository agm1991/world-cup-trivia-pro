import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { goBackWithFallback } from '@/lib/safeBack';

/** Returns a stable back handler that never relies on an empty browser history stack. */
export function useSafeBack(fallbackTo: string) {
  const navigate = useNavigate();
  return useCallback(() => goBackWithFallback(navigate, fallbackTo), [navigate, fallbackTo]);
}

import type { NavigateFunction } from 'react-router-dom';

/**
 * In-app “Back” always goes to an explicit parent route. `navigate(-1)` plus `history.length`
 * is unreliable and often pops to a blank or wrong screen; callers already pass the correct hub.
 */
export function goBackWithFallback(navigate: NavigateFunction, fallbackTo: string): void {
  navigate(fallbackTo, { replace: true });
}

/** `/squad-predictor` → first hub page; preserves `location.state` (e.g. profile snapshot load). */
import { Navigate, useLocation } from 'react-router-dom';

export function SquadPredictorHubIndex() {
  const { state } = useLocation();
  return <Navigate to="squad" replace state={state} />;
}

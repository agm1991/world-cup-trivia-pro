import { Navigate } from 'react-router-dom';

/** @deprecated Bookmarks only — unified tournament page uses `?view=knockout`. */
export default function SquadPredictorKnockoutRoadPage() {
  return <Navigate to="/squad-predictor/tournament?view=knockout" replace />;
}

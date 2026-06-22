import { CommunityTab } from '@/pages/CommunityTab';
import { PREDICTOR_PATHS } from '@/lib/squadPredictorHubRoutes';
import { useSquadPredictorHub } from '@/contexts/SquadPredictorHubContext';

export default function SquadPredictorCommunityPage() {
  const { applySnapshot, navigate, toast } = useSquadPredictorHub();

  return (
    <CommunityTab
      onLoadSquad={(entry) => {
        applySnapshot(entry.snapshot);
        navigate(PREDICTOR_PATHS.squad);
        toast({ title: 'Squad loaded', description: entry.title });
      }}
      onLoadNamedSave={(entry) => {
        applySnapshot(entry.snapshot);
        navigate(PREDICTOR_PATHS.squad);
        toast({ title: 'Squad loaded', description: entry.title });
      }}
    />
  );
}

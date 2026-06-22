import { AwardsTab } from '@/pages/AwardsTab';
import { useSquadPredictorHub } from '@/contexts/SquadPredictorHubContext';

export default function SquadPredictorAwardsPage() {
  const { awards, setAwards, awardPoolPlayers, nationAwardItems, shareAwardsToCommunity } = useSquadPredictorHub();

  return (
    <AwardsTab
      awards={awards}
      setAwards={setAwards}
      awardPoolPlayers={awardPoolPlayers}
      nationItems={nationAwardItems}
      onShareAwardsToCommunity={shareAwardsToCommunity}
    />
  );
}

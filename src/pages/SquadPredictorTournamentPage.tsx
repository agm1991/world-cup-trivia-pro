import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TournamentTab } from '@/pages/TournamentTab';
import { useSquadPredictorHub } from '@/contexts/SquadPredictorHubContext';
import { isGroupStageComplete } from '@/lib/squadPredictorBracket';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SquadPredictorTournamentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    bracket,
    groupScores,
    saveGroupMatchScore,
    ro32,
    ro16,
    qf,
    sf,
    thirdPlace,
    final,
    setRo32,
    setRo16,
    setQf,
    setSf,
    setThirdPlace,
    setFinal,
  } = useSquadPredictorHub();

  const groupStageDone = useMemo(() => isGroupStageComplete(groupScores), [groupScores]);
  const bracketView = searchParams.get('view') === 'knockout' ? 'knockouts' : 'group';

  const setBracketView = (next: 'group' | 'knockouts') => {
    if (next === 'knockouts') setSearchParams({ view: 'knockout' });
    else setSearchParams({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <Button
          type="button"
          size="sm"
          variant={bracketView === 'group' ? 'default' : 'outline'}
          className={cn('font-semibold', bracketView === 'group' && 'shadow-sm')}
          onClick={() => setBracketView('group')}
        >
          Group stage
        </Button>
        <Button
          type="button"
          size="sm"
          variant={bracketView === 'knockouts' ? 'default' : 'outline'}
          className={cn('font-semibold', bracketView === 'knockouts' && 'shadow-sm')}
          onClick={() => setBracketView('knockouts')}
        >
          Knockout bracket
          {!groupStageDone && (
            <span className="ml-1.5 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">
              preview
            </span>
          )}
        </Button>
      </div>

      <TournamentTab
        bracketView={bracketView}
        bracket={bracket}
        groupScores={groupScores}
        onSaveMatch={saveGroupMatchScore}
        ro32={ro32}
        ro16={ro16}
        qf={qf}
        sf={sf}
        thirdPlace={thirdPlace}
        final={final}
        onRo32Change={(i, m) => setRo32((prev) => prev.map((x, j) => (j === i ? m : x)))}
        onRo16Change={(i, m) => setRo16((prev) => prev.map((x, j) => (j === i ? m : x)))}
        onQfChange={(i, m) => setQf((prev) => prev.map((x, j) => (j === i ? m : x)))}
        onSfChange={(i, m) => setSf((prev) => prev.map((x, j) => (j === i ? m : x)))}
        onThirdPlaceChange={setThirdPlace}
        onFinalChange={setFinal}
        onRequestGroupView={() => setBracketView('group')}
        onRequestKnockoutView={() => setBracketView('knockouts')}
      />
    </div>
  );
}

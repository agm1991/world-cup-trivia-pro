import { useCallback } from 'react';
import { Pitch } from '@/components/SquadPredictor/Pitch';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import { startingFaceFromSquadSlot, subFaceFromSquadSlot } from '@/lib/squadPredictorPlayerFaces';
import type { SquadPredictorSnapshot } from '@/lib/squadPredictorSocialStorage';
import { normalizeAwardsFromPersisted, type AwardsState } from '@/lib/awardsState';
import { cn } from '@/lib/utils';

const AWARD_ROWS: { key: keyof AwardsState; label: string }[] = [
  { key: 'goldenBoot', label: 'Golden Boot' },
  { key: 'bestGoalkeeper', label: 'Best goalkeeper' },
  { key: 'bestDefender', label: 'Best defender' },
  { key: 'bestMidfielder', label: 'Best midfielder' },
  { key: 'bestStriker', label: 'Best striker' },
];

function AwardsSnapshotBody({ snapshot, className }: { snapshot: SquadPredictorSnapshot; className?: string }) {
  const a = normalizeAwardsFromPersisted(snapshot.awards);
  const rows = [
    ...AWARD_ROWS.map(({ key, label }) => ({ label, value: a[key]?.trim() || '' })),
    { label: 'Winner', value: a.tournamentWinner?.trim() || '' },
    { label: 'Runner-up', value: a.tournamentRunnerUp?.trim() || '' },
    { label: 'Third place', value: a.thirdPlace?.trim() || '' },
  ];
  const any = rows.some((r) => r.value);
  if (!any) {
    return <p className={cn('text-xs text-muted-foreground', className)}>No award picks in this share.</p>;
  }
  return (
    <dl className={cn('grid gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2', className)}>
      {rows.map(({ label, value }) =>
        value ? (
          <div key={label} className="min-w-0 sm:contents">
            <dt className="text-muted-foreground font-medium shrink-0">{label}</dt>
            <dd className="font-medium text-foreground min-w-0 break-words">{value}</dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}

export function SquadSnapshotQuickView({
  snapshot,
  mode,
  className,
}: {
  snapshot: SquadPredictorSnapshot;
  mode: 'lineup' | 'awards';
  className?: string;
}) {
  const squad = snapshot.squad;
  const wx = snapshot.worldXi;
  const country = snapshot.selectedCountry ?? '';

  const getStartingFace = useCallback(
    (idx: number) => startingFaceFromSquadSlot(squad, idx, wx, country),
    [squad, wx, country],
  );
  const getSubFace = useCallback(
    (idx: number) => subFaceFromSquadSlot(squad, idx, wx, country),
    [squad, wx, country],
  );

  if (mode === 'awards') {
    return <AwardsSnapshotBody snapshot={snapshot} className={className} />;
  }

  const natLabel = wx ? 'World XI' : country.trim() || 'National squad';

  return (
    <div className={cn('space-y-3 min-w-0', className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
          <span className="text-base leading-none" aria-hidden>
            {wx ? '🌍' : squadPredictorTeamFlag(country)}
          </span>
          {natLabel}
        </span>
        {squad.formation?.trim() ? (
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">Formation</span> {squad.formation.trim()}
          </span>
        ) : null}
        {squad.tactic?.trim() ? (
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">Tactic</span> {squad.tactic.trim()}
          </span>
        ) : null}
      </div>
      <div className="w-full min-w-0 overflow-x-auto pb-1">
        <Pitch
          readOnly
          formation={squad.formation}
          starting11={squad.starting11}
          worldXi={wx}
          worldXiNations={squad.worldXiNations}
          subs={squad.subs}
          subsNations={squad.subsNations}
          onOpenStartingPicker={() => {}}
          onOpenSubPicker={() => {}}
          onClearStarting={() => {}}
          onClearSub={() => {}}
          getStartingFace={getStartingFace}
          getSubFace={getSubFace}
          className="min-w-[280px]"
        />
      </div>
    </div>
  );
}

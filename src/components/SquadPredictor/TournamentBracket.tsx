import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SQUAD_PREDICTOR_GROUPS,
  SQUAD_PREDICTOR_GROUP_MATCH_PAIRS,
} from '@/data/squadPredictor2026Groups';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import { RoadToFinalHero } from '@/components/SquadPredictor/RoadToFinalHero';
import {
  computeGroupStandings,
  getFirstIncompleteGroupId,
  isGroupStageComplete,
  resolveKnockout,
  type QualifiedSlot,
} from '@/lib/squadPredictorBracket';
import { PREDICTOR_KNOCKOUT_ROAD_PATH } from '@/lib/squadPredictorHubRoutes';
import { cn } from '@/lib/utils';

const GROUP_TOUR_ORDER = SQUAD_PREDICTOR_GROUPS.map((g) => g.id);

export type BracketSnapshot = {
  qualifiers: QualifiedSlot[];
  thirdPlaceOut: QualifiedSlot[];
};

function matchKey(groupId: string, i: number, j: number): string {
  const [lo, hi] = i < j ? [i, j] : [j, i];
  return `${groupId}-${lo}-${hi}`;
}

const GROUPS_LEFT = SQUAD_PREDICTOR_GROUPS.slice(0, 6);
const GROUPS_RIGHT = SQUAD_PREDICTOR_GROUPS.slice(6);

const KNOCKOUT_SECTION = {
  ro32: 'squad-predictor-knockout-ro32',
  ro16: 'squad-predictor-knockout-ro16',
  qf: 'squad-predictor-knockout-qf',
  sf: 'squad-predictor-knockout-sf',
  third: 'squad-predictor-knockout-third',
  final: 'squad-predictor-knockout-final',
} as const;

function scrollToKnockoutSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToQuarterFinals() {
  scrollToKnockoutSection(KNOCKOUT_SECTION.qf);
}

function scrollToRoundOf16() {
  scrollToKnockoutSection(KNOCKOUT_SECTION.ro16);
}

function scrollToRoundOf32() {
  scrollToKnockoutSection(KNOCKOUT_SECTION.ro32);
}

function scrollToSemiFinals() {
  scrollToKnockoutSection(KNOCKOUT_SECTION.sf);
}

function scrollToThirdPlaceMatch() {
  scrollToKnockoutSection(KNOCKOUT_SECTION.third);
}

function scrollToFinalMatch() {
  scrollToKnockoutSection(KNOCKOUT_SECTION.final);
}

function KnockoutPhaseNavBar({
  onRequestGroupView,
}: {
  onRequestGroupView?: () => void;
}) {
  const btn =
    'h-8 shrink-0 rounded-md border border-border/80 bg-card/90 px-2.5 text-[10px] font-bold uppercase tracking-wide text-foreground shadow-sm backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 sm:h-9 sm:px-3 sm:text-[11px]';
  return (
    <div
      className="sticky top-2 z-20 -mx-1 rounded-xl border border-border/60 bg-background/80 p-2 shadow-md backdrop-blur-md sm:-mx-0"
      role="navigation"
      aria-label="Jump to knockout round"
    >
      <p className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
        Jump between rounds (scores stay saved)
      </p>
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {onRequestGroupView && (
          <button type="button" className={btn} onClick={onRequestGroupView}>
            Group stage
          </button>
        )}
        <button type="button" className={btn} onClick={scrollToRoundOf32}>
          R32
        </button>
        <button type="button" className={btn} onClick={scrollToRoundOf16}>
          R16
        </button>
        <button type="button" className={btn} onClick={scrollToQuarterFinals}>
          QF
        </button>
        <button type="button" className={btn} onClick={scrollToSemiFinals}>
          SF
        </button>
        <button type="button" className={btn} onClick={scrollToThirdPlaceMatch}>
          Third
        </button>
        <button type="button" className={btn} onClick={scrollToFinalMatch}>
          Final
        </button>
      </div>
    </div>
  );
}

function KnockoutCenterTrophy({
  ariaLabel,
  onTrophyClick,
  caption,
  children,
}: {
  ariaLabel: string;
  onTrophyClick?: () => void;
  caption: string;
  children?: ReactNode;
}) {
  const trophyImg = (
    <>
      <div className="wc-trophy-radial-glow rounded-2xl" aria-hidden />
      <img
        src="/images/world-cup-trophy.jpg"
        alt=""
        className="relative z-[1] h-full w-full rounded-2xl object-cover object-center"
      />
    </>
  );
  return (
    <div className="mx-auto flex w-full max-w-[200px] flex-col items-center justify-center gap-2 xl:sticky xl:top-20 xl:self-start">
      {onTrophyClick ? (
        <button
          type="button"
          onClick={onTrophyClick}
          className="wc-trophy-shine-wrap trophy-pulse group relative aspect-[4/5] w-full max-w-[160px] cursor-pointer rounded-2xl border-2 border-transparent text-left transition-all hover:border-primary/50 hover:shadow-[0_0_32px_hsl(45_93%_47%/0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:max-w-[180px]"
          aria-label={ariaLabel}
        >
          {trophyImg}
          <span className="pointer-events-none absolute bottom-1 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-[8px] font-bold uppercase text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Next round
          </span>
        </button>
      ) : (
        <div
          className="wc-trophy-shine-wrap relative aspect-[4/5] w-full max-w-[160px] rounded-2xl sm:max-w-[180px]"
          aria-hidden
        >
          {trophyImg}
        </div>
      )}
      <p className="text-center text-[10px] text-muted-foreground">{caption}</p>
      {children}
    </div>
  );
}

function GroupLetterRow({
  g,
  active,
  onSelect,
}: {
  g: { id: string; teams: readonly string[] };
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Group ${g.id}: open match results and standings`}
      onClick={onSelect}
      className={cn(
        'flex w-full items-stretch gap-2 rounded-lg border p-2 text-left transition-all',
        active
          ? 'border-primary bg-primary/15 shadow-[0_0_0_1px_hsl(45_93%_47%/0.35)] ring-2 ring-primary/45'
          : 'border-border/80 bg-muted/10 hover:border-primary/45 hover:bg-muted/20',
      )}
    >
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-xl font-black tabular-nums shadow-sm',
          active ? 'bg-primary text-primary-foreground' : 'bg-white/95 text-background',
        )}
      >
        {g.id}
      </span>
      <ul className="min-w-0 flex-1 space-y-0.5">
        {g.teams.map((t) => (
          <li key={t} className="flex min-h-[1.25rem] items-center gap-1.5 truncate text-[11px] font-medium leading-tight sm:text-xs">
            <span className="text-base leading-none sm:text-lg" aria-hidden>
              {squadPredictorTeamFlag(t)}
            </span>
            <span className="truncate">{t}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

function savedScoreToDraft(saved: string): string {
  return (saved ?? '').trim() === '' ? '0-0' : saved;
}

function draftScoreToSaved(draft: string): string {
  const t = draft.trim();
  if (t === '' || t === '0-0') return '';
  return t;
}

function matchDraftHasChanges(draft: string, saved: string): boolean {
  return draftScoreToSaved(draft) !== (saved ?? '').trim();
}

function GroupFixtureRow({
  fixtureKey,
  teamA,
  teamB,
  savedScore,
  onSaveMatch,
}: {
  fixtureKey: string;
  teamA: string;
  teamB: string;
  savedScore: string;
  onSaveMatch: (key: string, value: string) => void;
}) {
  const [draft, setDraft] = useState(() => savedScoreToDraft(savedScore));
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setDraft(savedScoreToDraft(savedScore));
    setJustSaved(false);
  }, [savedScore]);

  const dirty = matchDraftHasChanges(draft, savedScore);

  const revertDraft = () => {
    setDraft(savedScoreToDraft(savedScore));
    setJustSaved(false);
  };

  const handleSave = () => {
    onSaveMatch(fixtureKey, draft);
    setJustSaved(true);
  };

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border/70 bg-muted/10 px-2 py-1.5 text-[11px] sm:text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        <TeamWithFlag name={teamA} compact />
        <Input
          className="h-8 min-w-[3.75rem] max-w-[5rem] px-1 text-center font-mono text-[11px]"
          placeholder="0-0"
          title={`Goals: ${teamA} – ${teamB}`}
          value={draft}
          onChange={(e) => {
            setJustSaved(false);
            setDraft(e.target.value);
          }}
          onBlur={() => {
            if (dirty) revertDraft();
          }}
          aria-label={`Scoreline ${teamA} versus ${teamB}`}
        />
        <span className="text-muted-foreground shrink-0 text-[10px]">vs</span>
        <TeamWithFlag name={teamB} align="right" compact />
      </div>
      <Button
        type="button"
        size="sm"
        variant={dirty ? 'default' : 'secondary'}
        className="h-7 w-full text-[10px] font-bold uppercase tracking-wide"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSave}
        disabled={!dirty && justSaved}
      >
        {justSaved && !dirty ? 'Saved' : 'Save result'}
      </Button>
    </div>
  );
}

function GroupStageDetail({
  g,
  groupScores,
  onSaveMatch,
}: {
  g: { id: string; teams: readonly string[] };
  groupScores: Record<string, string>;
  onSaveMatch: (key: string, value: string) => void;
}) {
  const standings = computeGroupStandings(g.id, g.teams, groupScores);

  return (
    <div
      id={`group-inline-results-${g.id}`}
      className="space-y-3 rounded-xl border border-primary/40 bg-black/30 p-3 shadow-[inset_0_1px_0_hsl(45_93%_47%/0.12)] sm:p-3.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
        <h4 className="text-sm font-bold text-primary">Group {g.id} — fixtures &amp; table</h4>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {SQUAD_PREDICTOR_GROUP_MATCH_PAIRS.map(([i, j]) => {
          const key = matchKey(g.id, i, j);
          const a = g.teams[i]!;
          const b = g.teams[j]!;
          return (
            <GroupFixtureRow
              key={key}
              fixtureKey={key}
              teamA={a}
              teamB={b}
              savedScore={groupScores[key] ?? ''}
              onSaveMatch={onSaveMatch}
            />
          );
        })}
      </div>
      <div className="overflow-x-auto rounded-md border border-border/80">
        <table className="w-full text-[11px] sm:text-xs">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-1.5 text-left font-semibold">Team</th>
              <th className="p-1.5">P</th>
              <th className="p-1.5">W</th>
              <th className="p-1.5">D</th>
              <th className="p-1.5">L</th>
              <th className="p-1.5">GF</th>
              <th className="p-1.5">GA</th>
              <th className="p-1.5">GD</th>
              <th className="p-1.5 font-bold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.name} className="border-t border-border/60">
                <td className="p-1.5 font-medium">
                  <span className="mr-1 inline-block text-sm leading-none align-middle" aria-hidden>
                    {squadPredictorTeamFlag(row.name)}
                  </span>
                  {row.name}
                </td>
                <td className="p-1.5 text-center">{row.played}</td>
                <td className="p-1.5 text-center">{row.won}</td>
                <td className="p-1.5 text-center">{row.drawn}</td>
                <td className="p-1.5 text-center">{row.lost}</td>
                <td className="p-1.5 text-center">{row.gf}</td>
                <td className="p-1.5 text-center">{row.ga}</td>
                <td className="p-1.5 text-center">{row.gf - row.ga}</td>
                <td className="p-1.5 text-center font-bold">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamWithFlag({
  name,
  align = 'left',
  compact,
}: {
  name: string;
  align?: 'left' | 'right';
  compact?: boolean;
}) {
  const flag = squadPredictorTeamFlag(name);
  return (
    <span
      className={cn(
        'flex min-w-0 flex-1 items-center gap-1.5 font-medium',
        compact ? 'text-[11px] sm:text-xs' : 'gap-2 text-sm',
        align === 'right' ? 'flex-row-reverse text-right' : '',
      )}
    >
      <span className={cn('leading-none shrink-0', compact ? 'text-lg' : 'text-2xl')} aria-hidden>
        {flag}
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}

type KnockMatch = {
  teamA: string;
  teamB: string;
  sA: string;
  sB: string;
  tie: '' | 'A' | 'B';
};

function KnockRow({
  label,
  m,
  onChange,
}: {
  label?: string;
  m: KnockMatch;
  onChange: (next: KnockMatch) => void;
}) {
  const res = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
  const showHeader = Boolean(label) || ('needTieBreak' in res && res.needTieBreak);
  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-card/90 to-muted/20 p-3 space-y-2">
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
          {label ? <span className="text-muted-foreground">{label}</span> : <span />}
          {'needTieBreak' in res && res.needTieBreak && (
            <span className="text-xs font-medium text-amber-400">Draw — pick who advances</span>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <TeamWithFlag name={m.teamA} />
        <Input
          inputMode="numeric"
          className="w-14 h-9 text-center shrink-0"
          placeholder="—"
          value={m.sA}
          onChange={(e) => onChange({ ...m, sA: e.target.value })}
          aria-label={`${m.teamA} goals`}
        />
        <span className="text-muted-foreground text-xs shrink-0">vs</span>
        <Input
          inputMode="numeric"
          className="w-14 h-9 text-center shrink-0"
          placeholder="—"
          value={m.sB}
          onChange={(e) => onChange({ ...m, sB: e.target.value })}
          aria-label={`${m.teamB} goals`}
        />
        <TeamWithFlag name={m.teamB} align="right" />
      </div>
      {'needTieBreak' in res && res.needTieBreak && (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant={m.tie === 'A' ? 'default' : 'outline'} onClick={() => onChange({ ...m, tie: 'A' })}>
            Advance {m.teamA}
          </Button>
          <Button type="button" size="sm" variant={m.tie === 'B' ? 'default' : 'outline'} onClick={() => onChange({ ...m, tie: 'B' })}>
            Advance {m.teamB}
          </Button>
        </div>
      )}
      {'winner' in res && res.winner && (
        <p className="text-xs text-primary font-semibold">Winner: {res.winner}</p>
      )}
    </div>
  );
}

/** Compact fixture row — no FIFA match numbers on the card (labels clutter the Nation view). */
function KnockRowCompact({
  m,
  onChange,
}: {
  m: KnockMatch;
  onChange: (next: KnockMatch) => void;
}) {
  const res = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
  return (
    <div className="rounded-lg border border-border/90 bg-gradient-to-b from-card/90 to-muted/10 px-2 py-1.5 shadow-sm">
      {'needTieBreak' in res && res.needTieBreak && (
        <div className="mb-1 flex items-center justify-end gap-1">
          <span className="text-[8px] font-medium text-amber-400">PK</span>
        </div>
      )}
      <div className="flex items-center gap-0.5">
        <span className="text-base leading-none" aria-hidden>
          {squadPredictorTeamFlag(m.teamA)}
        </span>
        <span className="min-w-0 flex-1 truncate text-[10px] font-semibold leading-tight sm:text-[11px]">{m.teamA}</span>
        <Input
          inputMode="numeric"
          className="h-7 w-8 shrink-0 px-0 text-center text-[11px]"
          placeholder="—"
          value={m.sA}
          onChange={(e) => onChange({ ...m, sA: e.target.value })}
          aria-label={`${m.teamA} goals`}
        />
        <span className="shrink-0 text-[9px] text-muted-foreground">-</span>
        <Input
          inputMode="numeric"
          className="h-7 w-8 shrink-0 px-0 text-center text-[11px]"
          placeholder="—"
          value={m.sB}
          onChange={(e) => onChange({ ...m, sB: e.target.value })}
          aria-label={`${m.teamB} goals`}
        />
        <span className="min-w-0 flex-1 truncate text-right text-[10px] font-semibold leading-tight sm:text-[11px]">
          {m.teamB}
        </span>
        <span className="text-base leading-none" aria-hidden>
          {squadPredictorTeamFlag(m.teamB)}
        </span>
      </div>
      {'needTieBreak' in res && res.needTieBreak && (
        <div className="mt-1 flex flex-wrap gap-1">
          <Button
            type="button"
            size="sm"
            className="h-6 min-h-0 px-2 text-[9px]"
            variant={m.tie === 'A' ? 'default' : 'outline'}
            onClick={() => onChange({ ...m, tie: 'A' })}
          >
            {m.teamA}
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-6 min-h-0 px-2 text-[9px]"
            variant={m.tie === 'B' ? 'default' : 'outline'}
            onClick={() => onChange({ ...m, tie: 'B' })}
          >
            {m.teamB}
          </Button>
        </div>
      )}
      {'winner' in res && res.winner && (
        <p className="mt-0.5 truncate text-[9px] font-semibold text-primary">→ {res.winner}</p>
      )}
    </div>
  );
}

type Props = {
  /** Group stage only vs full FIFA knockout bracket (R32→final). */
  view: 'group' | 'knockouts';
  bracket: BracketSnapshot;
  groupScores: Record<string, string>;
  onSaveMatch: (key: string, value: string) => void;
  ro32: KnockMatch[];
  ro16: KnockMatch[];
  qf: KnockMatch[];
  sf: KnockMatch[];
  thirdPlace: KnockMatch;
  final: KnockMatch;
  onRo32Change: (i: number, m: KnockMatch) => void;
  onRo16Change: (i: number, m: KnockMatch) => void;
  onQfChange: (i: number, m: KnockMatch) => void;
  onSfChange: (i: number, m: KnockMatch) => void;
  onThirdPlaceChange: (m: KnockMatch) => void;
  onFinalChange: (m: KnockMatch) => void;
  /** Switch parent to group-stage tab from knockout view. */
  onRequestGroupView?: () => void;
  /** After last group (or when complete), open knockout tab instead of navigating away. */
  onRequestKnockoutView?: () => void;
};

export function TournamentBracket({
  view,
  bracket,
  groupScores,
  onSaveMatch,
  ro32,
  ro16,
  qf,
  sf,
  thirdPlace,
  final,
  onRo32Change,
  onRo16Change,
  onQfChange,
  onSfChange,
  onThirdPlaceChange,
  onFinalChange,
  onRequestGroupView,
  onRequestKnockoutView,
}: Props) {
  const navigate = useNavigate();
  const [activeGroupId, setActiveGroupId] = useState<string>('A');
  const qualifiersOrdered = bracket.qualifiers;
  const groupStageDone = useMemo(() => isGroupStageComplete(groupScores), [groupScores]);

  const advanceGroupTour = () => {
    const idx = GROUP_TOUR_ORDER.indexOf(activeGroupId);
    const nextPos = idx < 0 ? 0 : idx + 1;
    if (nextPos >= GROUP_TOUR_ORDER.length) {
      if (groupStageDone) {
        if (onRequestKnockoutView) onRequestKnockoutView();
        else navigate(PREDICTOR_KNOCKOUT_ROAD_PATH, { replace: true });
      } else {
        const fix = getFirstIncompleteGroupId(groupScores);
        if (fix) {
          setActiveGroupId(fix);
          requestAnimationFrame(() => {
            document.getElementById(`group-inline-results-${fix}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          });
        }
      }
      return;
    }
    const next = GROUP_TOUR_ORDER[nextPos]!;
    setActiveGroupId(next);
    requestAnimationFrame(() => {
      document.getElementById(`group-inline-results-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  /** R16 array order is FIFA M89–M96; left / right columns follow the draw (odd vs even slots). */
  const r16LeftIndices = [0, 2, 4, 6] as const;
  const r16RightIndices = [1, 3, 5, 7] as const;

  return (
    <div className="space-y-6">
      {view === 'knockouts' && (
        <div className="space-y-4">
          <RoadToFinalHero />
          <KnockoutPhaseNavBar onRequestGroupView={onRequestGroupView} />
          <p className="text-center text-xs text-muted-foreground">
            Bracket order matches FIFA: R32 M73–M88, R16 M89–M96, QF M97–M100, SF M101–M102, third place M103, final M104.
          </p>
        </div>
      )}

      {view === 'group' && (
      <Card className="border-border bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight">2026 FIFA World Cup — group stage</CardTitle>
          <CardDescription>
            Groups <span className="font-semibold text-foreground/90">A–F</span> left and{' '}
            <span className="font-semibold text-foreground/90">G–L</span> right. Tap a letter for results, or the{' '}
            <span className="font-semibold text-foreground/90">trophy</span> to step A→L. Enter every score (
            <span className="font-mono text-foreground/90">0-0</span>
            ), then tap <span className="font-semibold text-foreground/90">Save result</span> on each match. Use{' '}
            <span className="font-semibold text-foreground/90">Knockout bracket</span> above anytime to see or edit
            M73–M104 — full tables still recommended for correct Round of 32 thirds (FIFA Annex C).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="rounded-2xl border border-border/90 bg-gradient-to-b from-[hsl(222_47%_9%)] via-card/95 to-[hsl(222_47%_6%)] p-4 shadow-inner sm:p-6">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
              2026 FIFA World Cup
            </p>
            <h3 className="mt-1 text-center text-lg font-black uppercase tracking-[0.14em] text-foreground sm:text-xl">
              Group stage
            </h3>

            <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-center xl:gap-5">
              <div className="flex min-w-0 flex-1 flex-col gap-3 xl:max-w-md">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground xl:mb-0">
                  Groups A–F
                </p>
                {GROUPS_LEFT.map((g) => (
                  <div key={g.id} className="space-y-2">
                    <GroupLetterRow
                      g={g}
                      active={activeGroupId === g.id}
                      onSelect={() => setActiveGroupId(g.id)}
                    />
                    {activeGroupId === g.id && (
                      <GroupStageDetail
                        g={g}
                        groupScores={groupScores}
                        onSaveMatch={onSaveMatch}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex w-full shrink-0 flex-col items-center justify-center gap-4 xl:sticky xl:top-20 xl:w-[min(100%,300px)] xl:self-start">
                <button
                  type="button"
                  onClick={advanceGroupTour}
                  className="wc-trophy-shine-wrap trophy-pulse group relative mx-auto aspect-[4/5] w-full max-w-[220px] cursor-pointer rounded-2xl border-2 border-transparent text-left transition-all hover:border-primary/60 hover:shadow-[0_0_40px_hsl(45_93%_47%/0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-[260px]"
                  aria-label="Next group for results. After group L, opens the knockout bracket if all scores are entered."
                >
                  <div className="wc-trophy-radial-glow rounded-2xl" aria-hidden />
                  <img
                    src="/images/world-cup-trophy.jpg"
                    alt=""
                    className="relative z-[1] h-full w-full rounded-2xl object-cover object-center"
                  />
                  <span className="pointer-events-none absolute bottom-2 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:text-[10px]">
                    Next group
                  </span>
                </button>
                <div className="space-y-1 text-center">
                  <p className="text-xs font-semibold text-foreground">Road to the final</p>
                  <p className="text-[11px] text-muted-foreground">
                    After group L, the trophy moves you to the knockout tab (when every score is in). You can also switch
                    tabs yourself anytime.
                  </p>
                  {onRequestKnockoutView && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="mt-1 text-[10px] font-bold uppercase tracking-wide"
                      onClick={onRequestKnockoutView}
                    >
                      Open knockout bracket
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 xl:max-w-md">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground xl:mb-0">
                  Groups G–L
                </p>
                {GROUPS_RIGHT.map((g) => (
                  <div key={g.id} className="space-y-2">
                    <GroupLetterRow
                      g={g}
                      active={activeGroupId === g.id}
                      onSelect={() => setActiveGroupId(g.id)}
                    />
                    {activeGroupId === g.id && (
                      <GroupStageDetail
                        g={g}
                        groupScores={groupScores}
                        onSaveMatch={onSaveMatch}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Knockout seeding</p>
            <p className="text-xs text-muted-foreground">
              Top 12 group winners, 12 runners-up, and 8 best third-placed teams advance to 32 teams.
            </p>
            {bracket.thirdPlaceOut.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Third-place teams not advancing: {bracket.thirdPlaceOut.map((t) => t.name).join(', ')}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {qualifiersOrdered.length} qualifiers — Round of 32 uses FIFA match slots 73–88 (fixed runners, winners, and
              third-place pools from the regulations). Later rounds follow the published M89–M102 and final M104.
            </p>
          </div>
        </CardContent>
      </Card>
      )}

      {view === 'knockouts' && (
      <>
      <Card
        id="squad-predictor-knockout-ro32"
        className="border-border bg-card/80 backdrop-blur-sm scroll-mt-24"
      >
        <CardHeader>
          <CardTitle className="text-xl">Round of 32</CardTitle>
          <CardDescription>
            {onRequestGroupView && (
              <>
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                  onClick={onRequestGroupView}
                >
                  Group stage
                </button>
                <span className="text-muted-foreground"> · </span>
              </>
            )}
            FIFA matches M73–M88 from your group tables. Extra time / penalties resolved with the pick buttons.{' '}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToRoundOf16}
            >
              Round of 16 bracket
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-xl border border-border/60 bg-gradient-to-b from-[hsl(222_47%_8%)] to-card/90 p-3 sm:p-4">
          {ro32.length === 0 ? (
            <p className="text-sm text-muted-foreground">Complete the group stage so qualifiers can fill the Round of 32.</p>
          ) : (
            <div className="rounded-2xl border border-border/90 bg-[radial-gradient(ellipse_at_50%_0%,hsl(222_60%_18%/0.45),transparent_55%),linear-gradient(180deg,hsl(222_47%_9%),hsl(222_47%_5%))] p-3 shadow-inner sm:p-5">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
                Road to the World Cup final
              </p>
              <h3 className="mt-1 text-center text-base font-black uppercase tracking-[0.12em] text-foreground sm:text-lg">
                Round of 32
              </h3>
              <div className="mt-4 flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_minmax(140px,200px)_1fr] xl:items-start xl:gap-3">
                <div className="grid grid-cols-2 gap-2 border-l-4 border-amber-500/85 pl-2 sm:gap-2.5 sm:pl-3">
                  {ro32.slice(0, 8).map((m, i) => (
                    <KnockRowCompact
                      key={`${m.teamA}-${m.teamB}-${i}`}
                      m={m}
                      onChange={(next) => onRo32Change(i, next)}
                    />
                  ))}
                </div>
                <KnockoutCenterTrophy
                  ariaLabel="Scroll to Round of 16"
                  onTrophyClick={scrollToRoundOf16}
                  caption="Round of 32 · 32 nations"
                >
                  <div className="flex w-full flex-col gap-1.5">
                    {onRequestGroupView && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[9px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                        onClick={onRequestGroupView}
                      >
                        ← Group stage
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/50 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
                      onClick={scrollToRoundOf16}
                    >
                      Round of 16 →
                    </Button>
                  </div>
                </KnockoutCenterTrophy>
                <div className="grid grid-cols-2 gap-2 border-r-4 border-rose-600/85 pr-2 sm:gap-2.5 sm:pr-3">
                  {ro32.slice(8, 16).map((m, i) => (
                    <KnockRowCompact
                      key={`${m.teamA}-${m.teamB}-${8 + i}`}
                      m={m}
                      onChange={(next) => onRo32Change(8 + i, next)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card
        id="squad-predictor-knockout-ro16"
        className="border-border bg-card/80 backdrop-blur-sm scroll-mt-24"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Round of 16</CardTitle>
          <CardDescription>
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToRoundOf32}
            >
              ← Round of 32
            </button>
            <span className="text-muted-foreground"> · </span>
            Winners of M73–M88 feed M89–M96 per FIFA (e.g. M89 = W73 vs W75). Gold column vs red column — centre trophy
            opens quarter-finals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ro16.length === 0 ? (
            <p className="text-sm text-muted-foreground">Complete Round of 32 to populate.</p>
          ) : (
            <div className="rounded-2xl border border-border/90 bg-[radial-gradient(ellipse_at_50%_0%,hsl(222_60%_18%/0.5),transparent_55%),linear-gradient(180deg,hsl(222_47%_9%),hsl(222_47%_5%))] p-3 shadow-inner sm:p-5">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
                Road to the World Cup final
              </p>
              <h3 className="mt-1 text-center text-base font-black uppercase tracking-[0.12em] text-foreground sm:text-lg">
                Round of 16
              </h3>
              <div className="mt-4 flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_minmax(140px,200px)_1fr] xl:items-start xl:gap-3">
                <div className="grid grid-cols-2 gap-2 border-l-4 border-amber-500/85 pl-2 sm:gap-2.5 sm:pl-3">
                  {r16LeftIndices.map((idx) => {
                    const m = ro16[idx]!;
                    return (
                      <KnockRowCompact
                        key={`r16-L-${idx}`}
                        m={m}
                        onChange={(next) => onRo16Change(idx, next)}
                      />
                    );
                  })}
                </div>
                <KnockoutCenterTrophy
                  ariaLabel="Scroll to quarter-finals"
                  onTrophyClick={scrollToQuarterFinals}
                  caption="Round of 16 · 16 nations"
                >
                  <div className="flex w-full flex-col gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[9px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                      onClick={scrollToRoundOf32}
                    >
                      ← Round of 32
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/50 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
                      onClick={scrollToQuarterFinals}
                    >
                      Quarter-finals →
                    </Button>
                  </div>
                </KnockoutCenterTrophy>
                <div className="grid grid-cols-2 gap-2 border-r-4 border-rose-600/85 pr-2 sm:gap-2.5 sm:pr-3">
                  {r16RightIndices.map((idx) => {
                    const m = ro16[idx]!;
                    return (
                      <KnockRowCompact
                        key={`r16-R-${idx}`}
                        m={m}
                        onChange={(next) => onRo16Change(idx, next)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card id="squad-predictor-knockout-qf" className="border-border bg-card/80 backdrop-blur-sm scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-xl">Quarter-finals</CardTitle>
          <CardDescription className="text-xs">
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToRoundOf16}
            >
              ← Round of 16
            </button>
            <span className="text-muted-foreground"> · </span>
            M97–M100: W89 vs W90, W93 vs W94, W91 vs W92, W95 vs W96.{' '}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToSemiFinals}
            >
              Semi-finals
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qf.length === 0 && <p className="text-sm text-muted-foreground">Complete Round of 16 to populate.</p>}
          {qf.length > 0 && (
            <div className="rounded-2xl border border-border/90 bg-[radial-gradient(ellipse_at_50%_0%,hsl(222_60%_18%/0.45),transparent_55%),linear-gradient(180deg,hsl(222_47%_9%),hsl(222_47%_5%))] p-3 shadow-inner sm:p-5">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
                Road to the World Cup final
              </p>
              <h3 className="mt-1 text-center text-base font-black uppercase tracking-[0.12em] text-foreground sm:text-lg">
                Quarter-finals
              </h3>
              <div className="mt-4 flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_minmax(140px,200px)_1fr] xl:items-start xl:gap-3">
                <div className="space-y-3 border-l-4 border-amber-500/85 pl-2 sm:space-y-3.5 sm:pl-3">
                  {qf.slice(0, 2).map((m, i) => (
                    <KnockRow key={`qf-L-${i}`} m={m} onChange={(next) => onQfChange(i, next)} />
                  ))}
                </div>
                <KnockoutCenterTrophy
                  ariaLabel="Scroll to semi-finals"
                  onTrophyClick={scrollToSemiFinals}
                  caption="Quarter-finals · 8 nations"
                >
                  <div className="flex w-full flex-col gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[9px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                      onClick={scrollToRoundOf16}
                    >
                      ← Round of 16
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/50 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
                      onClick={scrollToSemiFinals}
                    >
                      Semi-finals →
                    </Button>
                  </div>
                </KnockoutCenterTrophy>
                <div className="space-y-3 border-r-4 border-rose-600/85 pr-2 sm:space-y-3.5 sm:pr-3">
                  {qf.slice(2, 4).map((m, i) => (
                    <KnockRow key={`qf-R-${i + 2}`} m={m} onChange={(next) => onQfChange(i + 2, next)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card id="squad-predictor-knockout-sf" className="border-border bg-card/80 backdrop-blur-sm scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-xl">Semi-finals</CardTitle>
          <CardDescription className="text-xs">
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToQuarterFinals}
            >
              ← Quarter-finals
            </button>
            <span className="text-muted-foreground"> · </span>
            M101–M102: W97 vs W98, W99 vs W100.{' '}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToThirdPlaceMatch}
            >
              Third place
            </button>
            {' · '}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToFinalMatch}
            >
              Final
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sf.length === 0 && <p className="text-sm text-muted-foreground">Complete quarter-finals to populate.</p>}
          {sf.length > 0 && (
            <div className="rounded-2xl border border-border/90 bg-[radial-gradient(ellipse_at_50%_0%,hsl(222_60%_18%/0.45),transparent_55%),linear-gradient(180deg,hsl(222_47%_9%),hsl(222_47%_5%))] p-3 shadow-inner sm:p-5">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
                Road to the World Cup final
              </p>
              <h3 className="mt-1 text-center text-base font-black uppercase tracking-[0.12em] text-foreground sm:text-lg">
                Semi-finals
              </h3>
              <div className="mt-4 flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_minmax(140px,200px)_1fr] xl:items-start xl:gap-3">
                <div className="border-l-4 border-amber-500/85 pl-2 sm:pl-3">
                  {sf[0] && <KnockRow key="sf-L" m={sf[0]} onChange={(next) => onSfChange(0, next)} />}
                </div>
                <KnockoutCenterTrophy
                  ariaLabel="Scroll to third-place match"
                  onTrophyClick={scrollToThirdPlaceMatch}
                  caption="Semi-finals · 4 nations"
                >
                  <div className="flex w-full flex-col gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[9px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                      onClick={scrollToQuarterFinals}
                    >
                      ← Quarter-finals
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/50 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
                      onClick={scrollToThirdPlaceMatch}
                    >
                      Third place →
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/40 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary/90 hover:bg-primary/15"
                      onClick={scrollToFinalMatch}
                    >
                      Final →
                    </Button>
                  </div>
                </KnockoutCenterTrophy>
                <div className="border-r-4 border-rose-600/85 pr-2 sm:pr-3">
                  {sf[1] && <KnockRow key="sf-R" m={sf[1]} onChange={(next) => onSfChange(1, next)} />}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card id="squad-predictor-knockout-third" className="border-border bg-card/80 backdrop-blur-sm scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-xl">Third place</CardTitle>
          <CardDescription className="text-xs">
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToSemiFinals}
            >
              ← Semi-finals
            </button>
            <span className="text-muted-foreground"> · </span>
            Losers of the two semi-finals (runners-up).{' '}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToFinalMatch}
            >
              Final →
            </button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {thirdPlace.teamA === 'TBD' ? (
            <p className="text-sm text-muted-foreground">Complete both semi-finals to populate.</p>
          ) : (
            <div className="rounded-2xl border border-border/90 bg-[radial-gradient(ellipse_at_50%_0%,hsl(222_60%_18%/0.45),transparent_55%),linear-gradient(180deg,hsl(222_47%_9%),hsl(222_47%_5%))] p-3 shadow-inner sm:p-5">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
                Road to the World Cup final
              </p>
              <h3 className="mt-1 text-center text-base font-black uppercase tracking-[0.12em] text-foreground sm:text-lg">
                Third place
              </h3>
              <div className="mt-4 flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_minmax(140px,200px)_1fr] xl:items-start xl:gap-3">
                <div className="flex justify-center xl:justify-end xl:pr-2">
                  <div className="w-full max-w-lg">
                    <KnockRow m={thirdPlace} onChange={onThirdPlaceChange} />
                  </div>
                </div>
                <KnockoutCenterTrophy
                  ariaLabel="Scroll to final"
                  onTrophyClick={scrollToFinalMatch}
                  caption="Third-place match"
                >
                  <div className="flex w-full flex-col gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[9px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                      onClick={scrollToSemiFinals}
                    >
                      ← Semi-finals
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-primary/50 bg-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
                      onClick={scrollToFinalMatch}
                    >
                      Final →
                    </Button>
                  </div>
                </KnockoutCenterTrophy>
                <div className="hidden min-h-[1px] xl:block" aria-hidden />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card id="squad-predictor-knockout-final" className="border-border bg-card/80 backdrop-blur-sm scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-xl">Final</CardTitle>
          <CardDescription className="text-xs">
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={scrollToThirdPlaceMatch}
            >
              ← Third place
            </button>
            <span className="text-muted-foreground"> · </span>
            M104: W101 vs W102. Entry here follows your semi-final scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {final.teamA === 'TBD' ? (
            <p className="text-sm text-muted-foreground">Complete semi-finals to populate.</p>
          ) : (
            <div className="rounded-2xl border border-border/90 bg-[radial-gradient(ellipse_at_50%_0%,hsl(222_60%_18%/0.45),transparent_55%),linear-gradient(180deg,hsl(222_47%_9%),hsl(222_47%_5%))] p-3 shadow-inner sm:p-5">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
                Road to the World Cup final
              </p>
              <h3 className="mt-1 text-center text-base font-black uppercase tracking-[0.12em] text-foreground sm:text-lg">
                Final
              </h3>
              <div className="mt-4 flex flex-col gap-4 xl:grid xl:grid-cols-[1fr_minmax(140px,200px)_1fr] xl:items-start xl:gap-3">
                <div className="hidden min-h-[1px] xl:block" aria-hidden />
                <KnockoutCenterTrophy
                  ariaLabel="2026 FIFA World Cup trophy"
                  caption="World Cup final · 2 nations"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[9px] font-bold uppercase tracking-wide text-muted-foreground hover:text-primary"
                    onClick={scrollToThirdPlaceMatch}
                  >
                    ← Third place
                  </Button>
                </KnockoutCenterTrophy>
                <div className="flex justify-center xl:justify-start xl:pl-2">
                  <div className="w-full max-w-lg">
                    <KnockRow m={final} onChange={onFinalChange} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}

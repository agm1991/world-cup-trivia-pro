import { Fragment, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { MockPlayer, SquadPosition } from '@/data/squadPredictorMockPlayers';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';

const POS_STYLE: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-200 border-amber-500/35',
  DEF: 'bg-sky-500/20 text-sky-100 border-sky-500/35',
  MID: 'bg-emerald-500/20 text-emerald-100 border-emerald-500/35',
  FWD: 'bg-rose-500/20 text-rose-100 border-rose-500/35',
};

const SECTION_LABEL: Record<SquadPosition, string> = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  FWD: 'Forwards',
};

function SectionHeader({ position }: { position: SquadPosition }) {
  return (
    <li className="list-none pt-3 first:pt-0 pb-1.5">
      <div className="flex items-center gap-2 px-0.5">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary/80">
          {SECTION_LABEL[position]}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/25 to-transparent" />
      </div>
    </li>
  );
}

type Props = {
  players: MockPlayer[];
  usedNames: ReadonlySet<string>;
  browseNation: string;
  worldXi: boolean;
  className?: string;
};

export function PlayerList({ players, usedNames, browseNation, worldXi, className }: Props) {
  const rows = useMemo(() => {
    return players.map((p) => ({ p, used: usedNames.has(p.name) }));
  }, [players, usedNames]);

  const flag = squadPredictorTeamFlag(browseNation);

  if (!browseNation.trim()) {
    return (
      <div
        className={cn(
          'flex flex-col rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 min-h-[min(440px,58vh)] justify-center px-6 py-10 text-center',
          className,
        )}
      >
        <p className="text-sm font-semibold text-foreground mb-1">No nation selected</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {worldXi
            ? 'Choose a country from the grid above (A–Z) to load that squad pool.'
            : 'Tap a country in the grid above to load its 35-player pool — lists start blank until you pick.'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border-2 border-primary/15 bg-gradient-to-b from-card/95 via-card/80 to-muted/25 min-h-0 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      <div className="shrink-0 border-b border-border/80 px-4 py-3 bg-muted/20 rounded-t-2xl">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary/90 mb-2">
          {worldXi ? 'Roster browser' : 'National squad pool'}
        </p>
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl leading-none shrink-0 drop-shadow-md" aria-hidden>
            {flag}
          </span>
          <div className="min-w-0">
            <p className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">{browseNation}</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-prose">
              35 players · goalkeepers first, forwards last — tap the pitch to assign by position.
            </p>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[min(440px,58vh)] sm:h-[min(520px,62vh)]">
        <ul className="p-3 space-y-1">
          {rows.map(({ p, used }, i) => (
            <Fragment key={p.id}>
              {(i === 0 || p.position !== rows[i - 1]!.p.position) && <SectionHeader position={p.position} />}
              <li>
                <div
                  className={cn(
                    'w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all',
                    used ? 'opacity-40 border-border/50 bg-muted/10' : 'border-border/60 bg-card/40',
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        'mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide',
                        POS_STYLE[p.position] ?? 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {p.position}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-foreground block truncate leading-snug">{p.name}</span>
                      <span className="text-[0.65rem] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <span aria-hidden className="opacity-80">
                          {flag}
                        </span>
                        {p.nation}
                        {used && <span className="text-amber-600/90 dark:text-amber-400"> · in lineup</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </Fragment>
          ))}
        </ul>
      </ScrollArea>
      <p className="shrink-0 border-t border-border/60 px-4 py-2.5 text-[0.65rem] leading-relaxed bg-muted/10 rounded-b-2xl">
        <span className="text-muted-foreground">
          Tap an empty or filled slot on the pitch or bench to add or change a player.{' '}
        </span>
        <span className="font-medium text-destructive">
          Roles must match the slot (e.g. center backs only in CB positions).
        </span>
      </p>
    </div>
  );
}

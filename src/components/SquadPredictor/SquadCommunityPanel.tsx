import { useMemo, useState } from 'react';
import { ChevronDown, Radio, Shield, Star, Trash2 } from 'lucide-react';
import { SquadSnapshotQuickView } from '@/components/SquadPredictor/SquadSnapshotQuickView';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import {
  communityAverageRating,
  deleteCommunitySquad,
  loadCommunity,
  rateCommunitySquad,
  type CommunitySquad,
} from '@/lib/squadPredictorSocialStorage';
import { cn } from '@/lib/utils';

export function SquadCommunityPanel({
  onLoadSquad,
  viewerProfile,
}: {
  onLoadSquad: (entry: CommunitySquad) => void;
  /** When set, cards you authored show a “Your post” marker. */
  viewerProfile?: { name: string; country: string } | null;
}) {
  const [list, setList] = useState(() => loadCommunity());
  const refresh = () => setList(loadCommunity());

  const awardsOnly = useMemo(() => list.filter((c) => c.kind === 'awards'), [list]);

  const groupedSquads = useMemo(() => {
    const squadFeed = list.filter((c) => c.kind !== 'awards');
    const map = new Map<string, CommunitySquad[]>();
    for (const c of squadFeed) {
      const key = c.worldXi ? 'World XI' : c.nation.trim() || 'National squad';
      const bucket = map.get(key) ?? [];
      bucket.push(c);
      map.set(key, bucket);
    }
    const headings = [...map.keys()].sort((a, b) => {
      if (a === 'World XI') return -1;
      if (b === 'World XI') return 1;
      return a.localeCompare(b, 'en');
    });
    return headings.map((heading) => ({ heading, entries: map.get(heading)! }));
  }, [list]);

  const worldXiGroup = groupedSquads.find((g) => g.heading === 'World XI');
  const nationGroups = groupedSquads.filter((g) => g.heading !== 'World XI');

  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Community squads</CardTitle>
        <CardDescription>
          Order: <span className="font-medium text-foreground">World XI</span> lineups, then{' '}
          <span className="font-medium text-foreground">Awards</span> picks, then national squads A–Z. Each card shows whether
          it&apos;s a <span className="font-medium text-foreground">World XI</span> mix or a specific nation. Use{' '}
          <span className="font-medium text-foreground">Quick view</span> for a pitch-level preview (read-only);{' '}
          <span className="font-medium text-foreground">Load in builder</span> opens it in the editor. Stored on this device —
          remove anytime. Anyone on this browser can rate 1–5 stars.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[min(520px,70vh)]">
          <div className="space-y-6 pr-3">
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nothing published yet. Use Squad → Publish, or Awards → Save &amp; share to community.
              </p>
            ) : (
              <>
                {worldXiGroup && (
                  <section
                    className={cn(
                      'space-y-3 rounded-xl p-3 -mx-1 border-2 border-primary/35 bg-gradient-to-br from-primary/15 to-primary/5 shadow-sm',
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-1">
                      <span className="text-lg" aria-hidden>
                        🌍
                      </span>
                      <h3 className="text-xs font-black uppercase tracking-[0.12em] text-foreground">World XI</h3>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-primary">
                        Main
                      </span>
                      <span className="text-xs text-muted-foreground">({worldXiGroup.entries.length})</span>
                    </div>
                    <ul className="space-y-4">
                      {worldXiGroup.entries.map((c) => (
                        <CommunitySquadCard
                          key={c.id}
                          entry={c}
                          viewerProfile={viewerProfile}
                          onRated={refresh}
                          onLoad={() => onLoadSquad(c)}
                        />
                      ))}
                    </ul>
                  </section>
                )}

                {awardsOnly.length > 0 && (
                  <section className="space-y-3 rounded-xl border border-amber-500/35 bg-gradient-to-br from-amber-500/10 to-transparent p-3 -mx-1 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-1">
                      <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden />
                      <h3 className="text-xs font-black uppercase tracking-[0.12em] text-foreground">Awards predictions</h3>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-100">
                        Awards tab
                      </span>
                      <span className="text-xs text-muted-foreground">({awardsOnly.length})</span>
                    </div>
                    <ul className="space-y-4">
                      {awardsOnly.map((c) => (
                        <CommunitySquadCard
                          key={c.id}
                          entry={c}
                          viewerProfile={viewerProfile}
                          onRated={refresh}
                          onLoad={() => onLoadSquad(c)}
                        />
                      ))}
                    </ul>
                  </section>
                )}

                {nationGroups.map(({ heading, entries }) => (
                  <section key={heading} className="space-y-3 rounded-xl p-3 -mx-1">
                    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-1">
                      <span className="text-lg" aria-hidden>
                        {squadPredictorTeamFlag(heading)}
                      </span>
                      <h3 className="text-xs font-black uppercase tracking-[0.12em] text-foreground">{heading}</h3>
                      <span className="text-xs text-muted-foreground">({entries.length})</span>
                    </div>
                    <ul className="space-y-4">
                      {entries.map((c) => (
                        <CommunitySquadCard
                          key={c.id}
                          entry={c}
                          viewerProfile={viewerProfile}
                          onRated={refresh}
                          onLoad={() => onLoadSquad(c)}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function CommunitySquadTypeBanner({ entry }: { entry: CommunitySquad }) {
  if (entry.kind === 'awards') {
    return (
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/45 bg-amber-500/15 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-amber-950 dark:text-amber-50">
          <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Awards · not a lineup
        </span>
        <span className="text-[0.7rem] text-muted-foreground">Tournament award picks from the Awards tab</span>
      </div>
    );
  }
  if (entry.worldXi) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/55 bg-gradient-to-r from-primary/20 to-primary/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-primary shadow-sm">
          <span aria-hidden>🌍</span>
          World XI squad
        </span>
        <span className="text-[0.7rem] text-muted-foreground">Players from multiple qualified nations on one pitch</span>
      </div>
    );
  }
  const nation = entry.nation.trim() || 'National squad';
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
      <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/12 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-50">
        National squad
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground">
        <span className="text-lg leading-none" aria-hidden>
          {squadPredictorTeamFlag(nation)}
        </span>
        {nation}
      </span>
      <span className="text-[0.7rem] text-muted-foreground">One country · official pool</span>
    </div>
  );
}

function CommunitySquadCard({
  entry,
  viewerProfile,
  onRated,
  onLoad,
}: {
  entry: CommunitySquad;
  viewerProfile?: { name: string; country: string } | null;
  onRated: () => void;
  onLoad: () => void;
}) {
  const [quickOpen, setQuickOpen] = useState(false);
  const avg = communityAverageRating(entry);
  const n = entry.ratings.length;
  const quickMode = entry.kind === 'awards' ? 'awards' : 'lineup';
  const isYours =
    !!viewerProfile &&
    entry.authorName.trim() === viewerProfile.name.trim() &&
    entry.authorCountry.trim() === viewerProfile.country.trim();

  const deleteDescription =
    entry.kind === 'awards'
      ? 'Remove these award picks from the community feed on this device?'
      : entry.worldXi
        ? 'Remove this World XI lineup from the community feed on this device?'
        : `Remove this ${entry.nation.trim() || 'national'} squad from the community feed on this device?`;

  return (
    <li
      className={cn(
        'rounded-xl border-y border-r border-border/80 border-l-4 border-l-emerald-500/75 bg-muted/15 p-4 shadow-sm',
        isYours && 'ring-1 ring-primary/35 bg-primary/5',
      )}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-100">
          <Radio className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
          On board
        </span>
        {isYours && (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-primary">
            Your post
          </span>
        )}
      </div>
      <CommunitySquadTypeBanner entry={entry} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-bold text-foreground truncate">{entry.title}</p>
          <p className="text-xs text-muted-foreground">
            {entry.authorName} · {entry.authorCountry}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1 text-amber-400">
            <Star className="h-4 w-4 fill-current" aria-hidden />
            <span className="text-sm font-semibold">
              {avg != null ? avg.toFixed(1) : '—'}
              {n > 0 && <span className="text-muted-foreground font-normal"> ({n})</span>}
            </span>
          </div>
        </div>
      </div>
      <Collapsible open={quickOpen} onOpenChange={setQuickOpen}>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">Rate</span>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                rateCommunitySquad(entry.id, s);
                onRated();
              }}
              className={cn(
                'rounded-md border px-2 py-1 text-xs font-semibold transition-colors',
                'border-border hover:border-amber-500/60 hover:bg-amber-500/10',
              )}
            >
              {s}★
            </button>
          ))}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button type="button" size="sm" variant="outline" className="gap-1">
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 transition-transform', quickOpen && 'rotate-180')}
                  aria-hidden
                />
                Quick view
              </Button>
            </CollapsibleTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 sm:mr-1" aria-hidden />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove from community?</AlertDialogTitle>
                  <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      deleteCommunitySquad(entry.id);
                      onRated();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="button" size="sm" variant="secondary" onClick={onLoad}>
              Load in builder
            </Button>
          </div>
        </div>
        <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden transition-all">
          <div className="mt-3 rounded-lg border border-border/60 bg-muted/25 p-3">
            <SquadSnapshotQuickView snapshot={entry.snapshot} mode={quickMode} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Radio, Trash2 } from 'lucide-react';
import { SquadSnapshotQuickView } from '@/components/SquadPredictor/SquadSnapshotQuickView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { SquadCommunityPanel } from '@/components/SquadPredictor/SquadCommunityPanel';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import {
  deleteNamedSave,
  loadCommunity,
  loadNamedSaves,
  type CommunitySquad,
  type NamedProfileSquad,
} from '@/lib/squadPredictorSocialStorage';
import { cn } from '@/lib/utils';

function YourSquadProfileCard({
  entry,
  communityIds,
  onDeleted,
  onLoad,
}: {
  entry: NamedProfileSquad;
  communityIds: Set<string>;
  onDeleted: () => void;
  onLoad: () => void;
}) {
  const [quickOpen, setQuickOpen] = useState(false);
  const snap = entry.snapshot;
  const country = snap.selectedCountry.trim() || 'National squad';
  const deleteProfileDesc = snap.worldXi
    ? 'Delete this World XI save from this device?'
    : `Delete this ${country} national squad save from this device?`;
  const onCommunityBoard =
    Boolean(entry.communityEntryId) && communityIds.has(entry.communityEntryId!);
  const quickMode = entry.title.includes('Tournament awards') ? ('awards' as const) : ('lineup' as const);

  return (
    <li
      className={cn(
        'rounded-xl border border-border/80 bg-muted/15 p-4',
        onCommunityBoard && 'border-l-4 border-l-emerald-500/70 ring-1 ring-emerald-500/20',
      )}
    >
      {onCommunityBoard && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-100">
            <Radio className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
            On community board
          </span>
        </div>
      )}
      {snap.worldXi ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-primary/55 bg-gradient-to-r from-primary/20 to-primary/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-primary shadow-sm">
            <span aria-hidden>🌍</span>
            World XI squad
          </span>
          <span className="text-[0.7rem] text-muted-foreground">Mixed nations · not a single-country lineup</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
          <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/12 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-50">
            National squad
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground">
            <span className="text-lg leading-none" aria-hidden>
              {squadPredictorTeamFlag(country)}
            </span>
            {country}
          </span>
          <span className="text-[0.7rem] text-muted-foreground">One country’s official pool</span>
        </div>
      )}
      <Collapsible open={quickOpen} onOpenChange={setQuickOpen}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-foreground truncate">{entry.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {entry.authorName ? `${entry.authorName} · ` : ''}
              {new Date(entry.savedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
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
                  <AlertDialogTitle>Delete saved squad?</AlertDialogTitle>
                  <AlertDialogDescription>{deleteProfileDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      deleteNamedSave(entry.id);
                      onDeleted();
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
            <SquadSnapshotQuickView snapshot={snap} mode={quickMode} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

export type CommunityTabProps = {
  onLoadSquad: (entry: CommunitySquad) => void;
  onLoadNamedSave: (entry: NamedProfileSquad) => void;
};

export function CommunityTab({ onLoadSquad, onLoadNamedSave }: CommunityTabProps) {
  const location = useLocation();
  const { profile } = useLocalProfile();
  const [namedList, setNamedList] = useState<NamedProfileSquad[]>(() => loadNamedSaves());

  useEffect(() => {
    setNamedList(loadNamedSaves());
  }, [location.pathname, location.key]);

  const yourSquads = useMemo(() => {
    const name = profile?.name?.trim();
    if (!name) return namedList;
    return namedList.filter((e) => !e.authorName || e.authorName.trim() === name);
  }, [namedList, profile?.name]);

  const communityIds = useMemo(
    () => new Set(loadCommunity().map((c) => c.id)),
    [location.pathname, location.key, namedList],
  );

  const yourSquadsByNation = useMemo(() => {
    const map = new Map<string, NamedProfileSquad[]>();
    for (const e of yourSquads) {
      const snap = e.snapshot;
      const key = snap.worldXi ? 'World XI' : snap.selectedCountry.trim() || 'National squad';
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    const headings = [...map.keys()].sort((a, b) => {
      if (a === 'World XI') return -1;
      if (b === 'World XI') return 1;
      return a.localeCompare(b, 'en');
    });
    return headings.map((heading) => ({ heading, entries: map.get(heading)! }));
  }, [yourSquads]);

  return (
    <div className="space-y-8 outline-none pt-1 sm:pt-2">
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 mb-1">Community</p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">SHARED SQUADS</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
          The <span className="font-semibold text-foreground">Published feed</span> is first —{' '}
          <span className="font-semibold text-foreground">World XI</span>, then <span className="font-semibold text-foreground">Awards</span>{' '}
          picks, then national squads. Share awards from the Awards tab. Your{' '}
          <span className="font-semibold text-foreground">Save to profile</span> list is below for quick reload.
        </p>
      </div>

      <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card shadow-sm">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-lg font-black uppercase tracking-[0.12em]">Published feed</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Star ratings from Squad → Publish to community. <span className="font-medium text-foreground">World XI</span>{' '}
            posts are highlighted first — then every other nation A–Z.
          </CardDescription>
        </CardHeader>
      </Card>
      <SquadCommunityPanel
        onLoadSquad={onLoadSquad}
        viewerProfile={profile ? { name: profile.name, country: profile.country } : null}
      />

      <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm">
        <CardHeader className="space-y-2 pb-2">
          <CardTitle className="text-lg font-black uppercase tracking-[0.12em]">Your squads</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Grouped A–Z by nation (World XI first). Each row shows{' '}
            <span className="font-medium text-foreground">World XI</span> vs a{' '}
            <span className="font-medium text-foreground">national squad</span> (country named).{' '}
            <span className="font-medium text-foreground">Quick view</span> shows the XI here without loading the builder. Delete
            removes the save on this device only. Same snapshots as Player profile → 2026 squads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {yourSquads.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No saves yet — build a squad (pick a nation or World XI on the Squad tab), then Save to profile.
            </p>
          ) : (
            <ScrollArea className="h-[min(420px,55vh)]">
              <div className="space-y-6 pr-3">
                {yourSquadsByNation.map(({ heading, entries }) => (
                  <section key={heading} className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-border/60 pb-1">
                      <span className="text-lg" aria-hidden>
                        {heading === 'World XI' ? '🌍' : squadPredictorTeamFlag(heading)}
                      </span>
                      <h3 className="text-sm font-black uppercase tracking-[0.12em] text-foreground">{heading}</h3>
                      <span className="text-xs text-muted-foreground">({entries.length})</span>
                    </div>
                    <ul className="space-y-3">
                      {entries.map((e) => (
                        <YourSquadProfileCard
                          key={e.id}
                          entry={e}
                          communityIds={communityIds}
                          onDeleted={() => setNamedList(loadNamedSaves())}
                          onLoad={() => onLoadNamedSave(e)}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Search, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { SQUAD_PREDICTOR_ALL_NATIONS } from '@/data/squadPredictor2026Groups';
import { SQUAD_PREDICTOR_FORMATIONS } from '@/lib/squadPredictorFormations';
import { findPlayerInNation, type MockPlayer } from '@/data/squadPredictorMockPlayers';
import { Pitch } from '@/components/SquadPredictor/Pitch';
import { SlotPlayerPickDialog } from '@/components/SquadPredictor/SlotPlayerPickDialog';
import {
  footballRoleFitsSlot,
  getPlayerRoleForMatch,
  getStartingSlotRole,
  playerFitsStartingSlot,
} from '@/lib/squadPredictorSlotRoles';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import { PREDICTOR_TACTICS, type SquadPayload, type Tactic } from '@/pages/squadPredictorHubTypes';

export type SquadTabProps = {
  worldXi: boolean;
  setWorldXi: (v: boolean) => void;
  selectedCountry: string;
  setSelectedCountry: (n: string) => void;
  browseNation: string;
  setBrowseNation: (n: string) => void;
  squad: SquadPayload;
  setSquad: Dispatch<SetStateAction<SquadPayload>>;
  listPlayers: MockPlayer[];
  assignStarting: (slotIndex: number, player: MockPlayer) => void;
  assignSub: (slotIndex: number, player: MockPlayer) => void;
  clearStarting: (slotIndex: number) => void;
  clearSub: (slotIndex: number) => void;
  clearPitch: () => void;
  getStartingFace: (idx: number) => {
    shortName: string;
    flag: string;
    position: string;
    nationLabel: string;
  } | null;
  getSubFace: (idx: number) => {
    shortName: string;
    flag: string;
    position: string;
    nationLabel: string;
  } | null;
  usedNames: Set<string>;
  saveCurrentSquad: () => void;
  openSaveProfileDialog: () => void;
  openPublishDialog: () => void;
  loadSavedForCountry: (name: string) => void;
  savedSquads: Record<string, SquadPayload>;
  /** World XI rules (ignored when not in World XI mode). */
  worldXiCommittedSaves: number;
  worldXiSavesRemaining: number;
  worldXiEditLocked: boolean;
  worldXiDeadlineLabel: string;
};

export function SquadTab({
  worldXi,
  setWorldXi,
  selectedCountry,
  setSelectedCountry,
  browseNation,
  setBrowseNation,
  squad,
  setSquad,
  listPlayers,
  assignStarting,
  assignSub,
  clearStarting,
  clearSub,
  clearPitch,
  getStartingFace,
  getSubFace,
  usedNames,
  saveCurrentSquad,
  openSaveProfileDialog,
  openPublishDialog,
  loadSavedForCountry,
  savedSquads,
  worldXiEditLocked,
}: SquadTabProps) {
  const [nationSearch, setNationSearch] = useState('');
  const activeNation = worldXi ? browseNation : selectedCountry;

  const nationsSortedAZ = useMemo(
    () => [...SQUAD_PREDICTOR_ALL_NATIONS].sort((a, b) => a.localeCompare(b, 'en')),
    [],
  );

  const filteredNations = useMemo(() => {
    const q = nationSearch.trim().toLowerCase();
    if (!q) return nationsSortedAZ;
    return nationsSortedAZ.filter((n) => n.toLowerCase().includes(q));
  }, [nationSearch, nationsSortedAZ]);

  const [slotPick, setSlotPick] = useState<{ kind: 'starting' | 'sub'; index: number } | null>(null);
  const rosterNation = worldXi ? browseNation : selectedCountry;

  const pickDialogPlayers = useMemo(() => {
    if (!slotPick || !rosterNation.trim()) return [];
    if (slotPick.kind === 'sub') {
      return listPlayers.filter((p) => !usedNames.has(p.name));
    }
    const slotRole = getStartingSlotRole(squad.formation, slotPick.index);
    return listPlayers.filter((p) => {
      if (usedNames.has(p.name)) return false;
      const pr = getPlayerRoleForMatch(p.name, p.position, p.tactical, p.nation);
      return footballRoleFitsSlot(pr, slotRole);
    });
  }, [slotPick, rosterNation, listPlayers, usedNames, squad.formation]);

  return (
    <div className="space-y-8 outline-none pt-1 sm:pt-2">
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex shrink-0 justify-center sm:justify-start">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 shadow-sm sm:h-16 sm:w-16">
              <Trophy className="h-6 w-6 text-primary sm:h-7 sm:w-7" aria-hidden />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">Squad Builder</p>
            <h2 className="text-balance text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              2026 SQUAD &amp; PREDICTOR
            </h2>
            <p className="max-w-2xl pt-0.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Build squads from each nation&apos;s official pool. Use World XI to mix qualified nations on one pitch.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm">
        <CardHeader className="space-y-3 pb-2 sm:pb-4">
          <CardTitle className="text-lg font-black uppercase tracking-[0.12em] sm:text-xl">Squad &amp; tactics</CardTitle>
          <CardDescription>
            Choose any of the 48 qualified nations, or use World XI to mix players from different countries into one dream
            team. Save squads for multiple nations and reload them anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pb-8 sm:pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4">
            <div className="space-y-1">
              <Label htmlFor="world-xi" className="text-sm font-semibold">
                World XI mode
              </Label>
              <p className="text-xs text-muted-foreground">Any player from any qualified nation.</p>
            </div>
            <Switch
              id="world-xi"
              checked={worldXi}
              onCheckedChange={(v) => {
                setWorldXi(v);
                if (v) setBrowseNation(selectedCountry);
              }}
            />
          </div>

          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/10 p-4 sm:p-5">
            <Label htmlFor="nation-squad-search">{worldXi ? 'Browse nations' : 'Nation squad'}</Label>
            <p className="text-xs text-muted-foreground">
              {worldXi
                ? "Search and pick a country to load that nation's official FIFA squad."
                : 'Search the 48 qualified nations. Each squad lists the official 26-man World Cup roster.'}
            </p>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="nation-squad-search"
                type="search"
                value={nationSearch}
                onChange={(e) => setNationSearch(e.target.value)}
                placeholder="Search countries…"
                className="pl-9"
                autoComplete="off"
                aria-label="Search countries"
              />
            </div>
            {filteredNations.length === 0 ? (
              <p className="rounded-lg border border-border/60 bg-background/80 py-10 text-center text-sm text-muted-foreground">
                No countries match your search.
              </p>
            ) : (
              <ScrollArea className="h-[min(360px,52vh)] rounded-xl border border-border/60 bg-background/80 pr-3 shadow-inner">
                <div
                  className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  role="listbox"
                  aria-label="Qualified nations"
                >
                  {filteredNations.map((n) => {
                    const active = n === activeNation;
                    return (
                      <button
                        key={n}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          if (worldXi) setBrowseNation(n);
                          else setSelectedCountry(n);
                        }}
                        className={cn(
                          'flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center text-xs font-semibold leading-snug transition-all shadow-sm sm:min-h-[4.75rem] sm:text-[0.8rem]',
                          active
                            ? 'border-primary bg-primary/15 text-foreground shadow-[0_0_0_2px_hsl(var(--primary)/0.35)] scale-[1.02]'
                            : 'border-border/70 bg-muted/35 text-muted-foreground hover:border-primary/45 hover:bg-muted/55 hover:text-foreground',
                        )}
                      >
                        <span className="text-2xl leading-none sm:text-[1.65rem]" aria-hidden>
                          {squadPredictorTeamFlag(n)}
                        </span>
                        <span className="line-clamp-2 w-full px-0.5">{n}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
            {!activeNation && (
              <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
                No country selected yet — tap one in the grid (A–Z). The builder stays neutral until you choose.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Formation</Label>
              <Select
                value={squad.formation}
                onValueChange={(v) =>
                  setSquad((s) => {
                    const next11 = [...s.starting11];
                    const nextWn = [...s.worldXiNations];
                    for (let i = 0; i < 11; i++) {
                      const name = next11[i];
                      if (!name) continue;
                      const nationRaw = worldXi ? (nextWn[i] || selectedCountry) : selectedCountry;
                      const nation = nationRaw.trim();
                      if (!nation) {
                        next11[i] = '';
                        nextWn[i] = '';
                        continue;
                      }
                      const p = findPlayerInNation(name, nation);
                      if (!p || !playerFitsStartingSlot(v, i, p)) {
                        next11[i] = '';
                        nextWn[i] = '';
                      }
                    }
                    return { ...s, formation: v, starting11: next11, worldXiNations: nextWn };
                  })
                }
                disabled={worldXi && worldXiEditLocked}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SQUAD_PREDICTOR_FORMATIONS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Playstyle</Label>
              <ToggleGroup
                type="single"
                value={squad.tactic}
                onValueChange={(v) => {
                  if (v) setSquad((s) => ({ ...s, tactic: v as Tactic }));
                }}
                className="flex flex-wrap justify-start gap-2"
                disabled={worldXi && worldXiEditLocked}
              >
                {PREDICTOR_TACTICS.map((t) => (
                  <ToggleGroupItem
                    key={t}
                    value={t}
                    className={cn('px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground')}
                  >
                    {t}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm">
        <CardHeader className="space-y-3 pb-2 sm:pb-4">
          <CardTitle className="text-xl">Starting XI &amp; pitch</CardTitle>
          <CardDescription>
            Slots follow your formation and tactical role. Tap a slot on the pitch or bench to pick a valid player. Save per
            nation; World XI stores separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pb-8 sm:pb-10">
          <div className="w-full min-w-0 overflow-x-auto xl:overflow-visible">
            <Pitch
              formation={squad.formation}
              starting11={squad.starting11}
              worldXi={worldXi}
              subs={squad.subs}
              subsNations={squad.subsNations}
              onOpenStartingPicker={(idx) => setSlotPick({ kind: 'starting', index: idx })}
              onOpenSubPicker={(idx) => setSlotPick({ kind: 'sub', index: idx })}
              onClearStarting={clearStarting}
              onClearSub={clearSub}
              getStartingFace={getStartingFace}
              getSubFace={getSubFace}
              onClearPitch={clearPitch}
              className="min-w-0 xl:max-w-none"
            />
          </div>

          <SlotPlayerPickDialog
            open={slotPick !== null}
            onOpenChange={(open) => {
              if (!open) setSlotPick(null);
            }}
            kind={slotPick?.kind ?? 'starting'}
            formation={squad.formation}
            slotIndex={slotPick?.index ?? 0}
            nationLabel={rosterNation.trim() || '—'}
            players={pickDialogPlayers}
            worldXi={worldXi}
            usedNames={usedNames}
            onPick={(p) => {
              if (!slotPick) return;
              if (slotPick.kind === 'starting') assignStarting(slotPick.index, p);
              else assignSub(slotPick.index, p);
              setSlotPick(null);
            }}
          />

          <div className="flex flex-wrap gap-3 pt-2 border-t border-border/60">
            <Button
              type="button"
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold"
              onClick={saveCurrentSquad}
              disabled={worldXi && worldXiEditLocked}
            >
              Quick save
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={openSaveProfileDialog}
              disabled={worldXi && worldXiEditLocked}
            >
              Save to profile
            </Button>
            <Button type="button" variant="outline" onClick={openPublishDialog}>
              Publish to community
            </Button>
            {!worldXi && savedSquads[selectedCountry] && (
              <Button type="button" variant="outline" onClick={() => loadSavedForCountry(selectedCountry)}>
                Load saved for {selectedCountry}
              </Button>
            )}
            {worldXi && savedSquads.__world_xi__ && (
              <Button type="button" variant="outline" onClick={() => loadSavedForCountry('__world_xi__')}>
                Load saved World XI
              </Button>
            )}
          </div>

          {Object.keys(savedSquads).length > 0 && (
            <div className="rounded-xl border border-border/80 bg-muted/15 p-4">
              <p className="text-sm font-semibold mb-2">Saved squads</p>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(savedSquads).map((k) => (
                    <Button key={k} type="button" size="sm" variant="secondary" onClick={() => loadSavedForCountry(k)}>
                      {k === '__world_xi__' ? 'World XI' : k}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

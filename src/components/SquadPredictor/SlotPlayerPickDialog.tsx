import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { getPlayersForNation, type MockPlayer } from '@/data/squadPredictorMockPlayers';
import { SQUAD_PREDICTOR_ALL_NATIONS } from '@/data/squadPredictor2026Groups';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';
import {
  describeStartingSlotRole,
  footballRoleFitsSlot,
  getPlayerRoleForMatch,
  getStartingSlotRole,
} from '@/lib/squadPredictorSlotRoles';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const POS_STYLE: Record<string, string> = {
  GK: 'bg-amber-500/20 text-amber-200 border-amber-500/35',
  DEF: 'bg-sky-500/20 text-sky-100 border-sky-500/35',
  MID: 'bg-emerald-500/20 text-emerald-100 border-emerald-500/35',
  FWD: 'bg-rose-500/20 text-rose-100 border-rose-500/35',
};

const NATIONS_AZ = [...SQUAD_PREDICTOR_ALL_NATIONS].sort((a, b) => a.localeCompare(b, 'en'));

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: 'starting' | 'sub';
  formation: string;
  slotIndex: number;
  nationLabel: string;
  players: MockPlayer[];
  onPick: (player: MockPlayer) => void;
  worldXi?: boolean;
  usedNames?: Set<string>;
};

export function SlotPlayerPickDialog({
  open,
  onOpenChange,
  kind,
  formation,
  slotIndex,
  nationLabel,
  players,
  onPick,
  worldXi = false,
  usedNames,
}: Props) {
  const [q, setQ] = useState('');
  const [nationSearch, setNationSearch] = useState('');
  const [pickNation, setPickNation] = useState('');

  useEffect(() => {
    if (open) {
      setPickNation(worldXi ? '' : nationLabel && nationLabel !== '—' ? nationLabel : '');
      setNationSearch('');
      setQ('');
    }
  }, [open, nationLabel, worldXi]);

  const activeNation = worldXi ? pickNation : nationLabel;
  const flag = squadPredictorTeamFlag(activeNation);

  const titleBits = useMemo(() => {
    if (kind === 'sub') {
      return {
        title: `Substitute slot ${slotIndex + 1}`,
        hint: worldXi ? 'Pick a nation, then choose any unused player' : 'Any unused player from this squad pool',
      };
    }
    const role = getStartingSlotRole(formation, slotIndex);
    return {
      title: `Starting XI · Slot ${slotIndex + 1}`,
      hint: worldXi
        ? `Pick a nation, then choose a ${describeStartingSlotRole(role)} for ${formation}`
        : `Needs a ${describeStartingSlotRole(role)} for ${formation}`,
    };
  }, [kind, formation, slotIndex, worldXi]);

  const filteredNations = useMemo(() => {
    const s = nationSearch.trim().toLowerCase();
    if (!s) return NATIONS_AZ;
    return NATIONS_AZ.filter((n) => n.toLowerCase().includes(s));
  }, [nationSearch]);

  const filtered = useMemo(() => {
    let pool = players;
    if (worldXi) {
      if (!pickNation.trim()) return [];
      pool = getPlayersForNation(pickNation).filter((p) => !usedNames?.has(p.name));
      if (kind === 'starting') {
        const slotRole = getStartingSlotRole(formation, slotIndex);
        pool = pool.filter((p) => {
          const pr = getPlayerRoleForMatch(p.name, p.position, p.tactical, p.nation);
          return footballRoleFitsSlot(pr, slotRole);
        });
      }
    }
    const s = q.trim().toLowerCase();
    if (!s) return pool;
    return pool.filter((p) => p.name.toLowerCase().includes(s));
  }, [worldXi, pickNation, players, usedNames, kind, formation, slotIndex, q]);

  const resetAndClose = () => {
    setQ('');
    setNationSearch('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetAndClose();
      }}
    >
      <DialogContent
        className={cn(
          'max-h-[min(92vh,640px)] gap-0 overflow-hidden p-0',
          worldXi ? 'sm:max-w-lg' : 'sm:max-w-md',
        )}
      >
        <DialogHeader className="border-b border-border/60 px-5 py-4 text-left">
          <DialogTitle className="text-lg">{titleBits.title}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">{titleBits.hint}</DialogDescription>

          {worldXi ? (
            <div className="mt-3 space-y-2">
              <Label htmlFor="slot-pick-nation-search" className="text-xs font-semibold uppercase tracking-wider">
                Select country
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="slot-pick-nation-search"
                  value={nationSearch}
                  onChange={(e) => setNationSearch(e.target.value)}
                  placeholder="Search countries…"
                  className="pl-9"
                  autoComplete="off"
                  aria-label="Search countries"
                />
              </div>
              <ScrollArea className="h-36 rounded-lg border border-border/60 bg-muted/15">
                <div className="grid grid-cols-2 gap-1.5 p-2">
                  {filteredNations.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setPickNation(n);
                        setNationSearch('');
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs transition-colors',
                        pickNation === n
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border/60 bg-background/80 hover:bg-muted',
                      )}
                    >
                      <span className="text-lg leading-none shrink-0">{squadPredictorTeamFlag(n)}</span>
                      <span className="font-medium truncate">{n}</span>
                    </button>
                  ))}
                  {filteredNations.length === 0 && (
                    <p className="col-span-2 py-4 text-center text-xs text-muted-foreground">No countries found</p>
                  )}
                </div>
              </ScrollArea>
              {pickNation && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                  <span className="text-xl leading-none">{squadPredictorTeamFlag(pickNation)}</span>
                  <span className="text-sm font-semibold text-foreground">{pickNation}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-2xl leading-none" aria-hidden>
                {flag}
              </span>
              <span className="text-sm font-semibold text-foreground truncate">{nationLabel}</span>
            </div>
          )}

          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search players…"
            className="mt-3"
            autoComplete="off"
            aria-label="Filter players"
            disabled={worldXi && !pickNation.trim()}
          />
        </DialogHeader>
        <ScrollArea className="max-h-[min(50vh,320px)] px-2">
          <ul className="space-y-1 p-3">
            {worldXi && !pickNation.trim() ? (
              <li className="rounded-lg border border-dashed border-border/70 px-3 py-8 text-center text-sm text-muted-foreground">
                Choose a country above to browse players for this slot.
              </li>
            ) : filtered.length === 0 ? (
              <li className="rounded-lg border border-dashed border-border/70 px-3 py-8 text-center text-sm text-muted-foreground">
                No matching players for this slot. Try another search or pick a different position.
              </li>
            ) : (
              filtered.map((p) => (
                <li key={p.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-xl border border-border/60 bg-muted/10 px-3 py-2.5 text-left font-normal hover:bg-primary/10"
                    onClick={() => {
                      onPick(p);
                      onOpenChange(false);
                      resetAndClose();
                    }}
                  >
                    <div className="flex w-full items-start gap-2.5">
                      <span
                        className={cn(
                          'mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide',
                          POS_STYLE[p.position] ?? 'bg-muted text-muted-foreground border-border',
                        )}
                      >
                        {p.tactical ?? p.position}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground block truncate leading-snug">{p.name}</span>
                        <span className="text-[0.65rem] text-muted-foreground mt-0.5 block truncate">{p.nation}</span>
                      </div>
                    </div>
                  </Button>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

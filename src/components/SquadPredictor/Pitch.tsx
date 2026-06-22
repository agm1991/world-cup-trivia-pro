import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSlotsForFormation } from '@/lib/squadPredictorFormations';
import type { SquadPosition } from '@/data/squadPredictorMockPlayers';
import type { SquadPlayerSlotFace } from '@/lib/squadPredictorPlayerFaces';

export type SlotFace = SquadPlayerSlotFace;

type Props = {
  formation: string;
  starting11: string[];
  worldXi: boolean;
  worldXiNations: string[];
  subs: string[];
  subsNations: string[];
  onOpenStartingPicker: (slotIndex: number) => void;
  onOpenSubPicker: (slotIndex: number) => void;
  onClearStarting: (slotIndex: number) => void;
  onClearSub: (slotIndex: number) => void;
  getStartingFace: (slotIndex: number) => SlotFace | null;
  getSubFace: (slotIndex: number) => SlotFace | null;
  onClearPitch?: () => void;
  /** Read-only pitch + bench (e.g. Community quick view) — no taps or clears. */
  readOnly?: boolean;
  className?: string;
};

const POS_BADGE: Record<SquadPosition, string> = {
  GK: 'bg-amber-400/90 text-black',
  DEF: 'bg-sky-400/90 text-black',
  MID: 'bg-emerald-400/90 text-black',
  FWD: 'bg-rose-400/90 text-black',
};

export function Pitch({
  formation,
  starting11,
  worldXi,
  worldXiNations,
  subs,
  subsNations,
  onOpenStartingPicker,
  onOpenSubPicker,
  onClearStarting,
  onClearSub,
  getStartingFace,
  getSubFace,
  onClearPitch,
  readOnly = false,
  className,
}: Props) {
  const slots = getSlotsForFormation(formation);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-2xl border border-border/70 bg-muted/15 p-4 shadow-sm sm:p-5">
        {!readOnly && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p className="text-xs leading-relaxed text-muted-foreground max-w-xl">
              Tap a slot to choose a player for that position. Only players who fit the role can be placed. Use ✕ on a card to
              remove.
            </p>
            {onClearPitch && (
              <Button type="button" variant="outline" size="sm" className="shrink-0 self-start" onClick={onClearPitch}>
                Clear pitch &amp; bench
              </Button>
            )}
          </div>
        )}
        {readOnly && (
          <p className="text-xs font-medium text-muted-foreground max-w-xl mb-1">
            Pitch preview — same layout as in the builder (read-only).
          </p>
        )}

        <div
          className="relative isolate mx-auto mt-5 w-full max-w-[min(100%,42rem)] overflow-hidden rounded-2xl border border-emerald-900/50 shadow-[0_12px_40px_-8px_rgba(0,40,20,0.55)] ring-1 ring-white/10"
          style={{ aspectRatio: '3 / 4' }}
        >
          {/* Grass + mowing stripes */}
          <div
            className="absolute inset-0"
            style={{
              background: `
              repeating-linear-gradient(
                90deg,
                hsl(145 42% 26%) 0px,
                hsl(145 42% 26%) 14px,
                hsl(145 38% 24%) 14px,
                hsl(145 38% 24%) 28px
              ),
              radial-gradient(ellipse 120% 80% at 50% 0%, hsl(145 50% 32%) 0%, transparent 55%),
              linear-gradient(180deg, hsl(145 45% 30%) 0%, hsl(150 38% 22%) 100%)
            `,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)]" />

          {/* Pitch lines */}
          <div className="pointer-events-none absolute inset-[5%] rounded-[40%] border-2 border-white/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.06)]" />
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-white/35" />
          <div className="pointer-events-none absolute left-1/2 top-[5%] h-[40%] w-[38%] -translate-x-1/2 rounded-b-[100%] border-2 border-white/30 border-t-0" />
          {/* Penalty arcs (simplified) */}
          <div className="pointer-events-none absolute left-1/2 top-[5%] h-[18%] w-[62%] -translate-x-1/2 border-x border-b border-white/25 rounded-b-3xl" />
          <div className="pointer-events-none absolute bottom-[5%] left-1/2 h-[18%] w-[62%] -translate-x-1/2 border-x border-t border-white/25 rounded-t-3xl" />

          {slots.map((pos, idx) => {
            const name = starting11[idx] ?? '';
            const filled = Boolean(name);
            const face = filled ? getStartingFace(idx) : null;
            const label = idx === 0 ? 'GK' : `${idx + 1}`;

            const slotInner = (
              <>
                <span className="pointer-events-none absolute left-1/2 top-1 z-[1] -translate-x-1/2 text-[0.55rem] font-bold uppercase tracking-wide text-emerald-100/95">
                  {label}
                </span>
                {filled && face && (
                  <span
                    className={cn(
                      'pointer-events-none absolute right-0.5 top-0.5 z-[1] rounded px-0.5 py-0.5 text-[0.5rem] font-bold uppercase leading-none',
                      POS_BADGE[face.position],
                    )}
                  >
                    {face.position}
                  </span>
                )}
                {!readOnly && filled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0.5 top-0.5 z-[2] h-5 w-5 shrink-0 opacity-90 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearStarting(idx);
                    }}
                    aria-label="Remove player"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                <div className="flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-1 px-1 text-center">
                  {filled && face ? (
                    <>
                      <span className="text-xl leading-none drop-shadow-md select-none sm:text-2xl" aria-hidden>
                        {face.flag}
                      </span>
                      <span className="w-full max-w-full text-center break-words text-[0.65rem] font-semibold leading-snug text-white [overflow-wrap:anywhere] line-clamp-2">
                        {face.shortName}
                      </span>
                      {worldXi && (
                        <span className="line-clamp-1 w-full text-center text-[0.55rem] font-medium text-emerald-200/90">
                          {face.nationLabel}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[0.65rem] font-medium text-emerald-100/50">
                      {readOnly ? 'Empty' : 'Tap to pick'}
                    </span>
                  )}
                </div>
              </>
            );

            return (
              <div
                key={`${formation}-${idx}`}
                className="absolute z-[2] w-[min(19%,5.5rem)] max-w-[5.5rem] -translate-x-1/2 -translate-y-1/2 hover:z-[4]"
                style={{ top: pos.top, left: pos.left }}
              >
                {readOnly ? (
                  <div className="group relative flex w-full flex-col items-center justify-center gap-0 rounded-lg border px-1 pb-2 pt-6 text-center shadow-lg border-white/30 bg-black/55">
                    {slotInner}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenStartingPicker(idx)}
                    className="group relative flex w-full touch-manipulation flex-col items-center justify-center gap-0 rounded-lg border px-1 pb-2 pt-6 text-center shadow-lg transition-all cursor-pointer border-white/30 bg-black/55 hover:border-amber-400/50 hover:ring-2 hover:ring-amber-400/25"
                  >
                    {slotInner}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/10 p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Substitutes (7)</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
          {subs.map((name, idx) => {
            const nation = subsNations[idx] ?? '';
            const filled = Boolean(name);
            const face = filled ? getSubFace(idx) : null;
            const benchInner = (
              <>
                <span className="pointer-events-none absolute left-1/2 top-1 z-[1] -translate-x-1/2 text-[0.6rem] font-bold text-muted-foreground">
                  S{idx + 1}
                </span>
                {face && (
                  <span
                    className={cn(
                      'pointer-events-none absolute right-0.5 top-0.5 z-[1] rounded px-0.5 py-0.5 text-[0.5rem] font-bold uppercase leading-none',
                      POS_BADGE[face.position],
                    )}
                  >
                    {face.position}
                  </span>
                )}
                <div className="flex w-full flex-col items-center justify-center gap-1 px-0.5 text-center">
                  {filled && face ? (
                    <>
                      <span className="text-lg leading-none drop-shadow-sm sm:text-xl" aria-hidden>
                        {face.flag}
                      </span>
                      <span className="line-clamp-2 w-full max-w-full text-center break-words text-[0.65rem] font-semibold leading-snug [overflow-wrap:anywhere]">
                        {face.shortName}
                      </span>
                      {worldXi && nation && (
                        <span className="line-clamp-1 w-full text-center text-[0.58rem] text-muted-foreground">
                          {nation}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">{readOnly ? '—' : 'Tap'}</span>
                  )}
                </div>
                {!readOnly && filled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0.5 top-0.5 z-[2] h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSub(idx);
                    }}
                    aria-label="Remove substitute"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </>
            );

            return (
              <div key={`sub-${idx}`}>
                {readOnly ? (
                  <div className="relative flex min-h-[4.75rem] w-full flex-col items-center justify-center rounded-xl border px-1.5 pb-2 pt-6 text-center text-xs border-border bg-muted/20">
                    {benchInner}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenSubPicker(idx)}
                    className="relative flex min-h-[4.75rem] w-full flex-col items-center justify-center rounded-xl border px-1.5 pb-2 pt-6 text-center text-xs transition-colors cursor-pointer border-border bg-muted/20 hover:border-amber-400/40 hover:bg-muted/30"
                  >
                    {benchInner}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

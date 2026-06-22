import { cn } from '@/lib/utils';
import { squadPredictorTeamFlag } from '@/data/squadPredictorTeamFlags';

type Props = {
  nations: readonly string[];
  selected: string;
  onSelect: (nation: string) => void;
  className?: string;
};

export function NationFlagStrip({ nations, selected, onSelect, className }: Props) {
  return (
    <div
      className={cn(
        'flex gap-1.5 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      role="listbox"
      aria-label="Choose nation"
    >
      {nations.map((n) => {
        const active = n === selected;
        return (
          <button
            key={n}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => onSelect(n)}
            className={cn(
              'flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-2 py-1.5 text-[0.65rem] font-semibold transition-all',
              active
                ? 'border-primary bg-primary/15 text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.35)]'
                : 'border-border/70 bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-muted/50',
            )}
          >
            <span className="text-xl leading-none drop-shadow-sm" aria-hidden>
              {squadPredictorTeamFlag(n)}
            </span>
            <span className="max-w-[3.25rem] truncate">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

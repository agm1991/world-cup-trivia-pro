import type { ReactNode } from 'react';
import { Award, Coins } from 'lucide-react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { cn } from '@/lib/utils';

type HeaderTopStatsProps = {
  transparent?: boolean;
  className?: string;
};

export const HeaderTopStats = ({ transparent = false, className }: HeaderTopStatsProps) => {
  const { getTotalStats } = useLocalProfile();
  const { totalScore } = getTotalStats();
  const coins = Math.max(0, Math.floor(totalScore / 10));

  return (
    <div
      role="status"
      aria-label={`Total score ${totalScore.toLocaleString()}, coins ${coins.toLocaleString()}`}
      className={cn(
        'flex items-stretch gap-0 rounded-xl sm:rounded-2xl border shrink-0 overflow-hidden text-sm shadow-sm',
        transparent
          ? 'border-white/12 bg-black/25 backdrop-blur-xl shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.07)]'
          : 'border-border/70 bg-card/60 backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 sm:gap-2 sm:pl-2 sm:pr-2.5 sm:py-1.5 md:pl-2.5 md:pr-3 md:py-2">
        <div
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border shrink-0 bg-amber-500/[0.08] border-amber-500/20"
          aria-hidden
        >
          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400/95" strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 text-left">
          <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90 leading-none">
            Score
          </span>
          <span className="font-semibold tabular-nums text-[13px] sm:text-[15px] md:text-base text-foreground leading-none tracking-tight">
            {totalScore.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="w-px bg-border/50 self-stretch my-1.5 sm:my-2" aria-hidden />
      <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 sm:gap-2 sm:pl-2 sm:pr-2.5 sm:py-1.5 md:pl-2.5 md:pr-3 md:py-2">
        <div
          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border shrink-0 bg-amber-500/[0.08] border-amber-500/20"
          aria-hidden
        >
          <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400/95" strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 text-left">
          <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/90 leading-none">
            Coins
          </span>
          <span className="font-semibold tabular-nums text-[13px] sm:text-[15px] md:text-base text-foreground leading-none tracking-tight">
            {coins.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

type HeaderProps = {
  transparent?: boolean;
  left?: ReactNode;
  right?: ReactNode;
};

export const Header = ({ transparent = false, left, right }: HeaderProps) => {
  const navClasses = transparent
    ? 'relative z-50 bg-background/20 backdrop-blur-xl border-b border-foreground/10'
    : 'relative z-50 bg-card/80 backdrop-blur-md border-b border-border';

  return (
    <header className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-wrap items-center justify-between gap-3">
        {left}
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2 md:gap-4 min-w-0">
          {right ?? <HeaderTopStats transparent={transparent} />}
        </div>
      </div>
    </header>
  );
};

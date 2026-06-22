import { useNavigate, useParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, ChevronRight, Trophy } from 'lucide-react';
import { WORLD_CUP_NATIONS } from '@/data/worldCupAppearances';
import { getBundledCountryFlagImage } from '@/lib/countryFlags';
import { cn } from '@/lib/utils';

/** Historical / subnational flags whose emoji renders poorly — use bundled assets instead. */
function CountryHistoryFlag({
  name,
  emoji,
  className,
}: {
  name: string;
  emoji: string;
  className?: string;
}) {
  const bundled = getBundledCountryFlagImage(name);
  if (bundled) {
    return (
      <img
        src={bundled}
        alt=""
        className={cn(
          'h-16 w-[5.5rem] sm:h-[4.25rem] sm:w-[6rem] object-cover rounded-lg shadow-lg ring-1 ring-white/10',
          className,
        )}
        aria-hidden
      />
    );
  }
  return <span className={cn('text-6xl sm:text-7xl drop-shadow-lg leading-none', className)}>{emoji}</span>;
}

const CountryHistoryYears = () => {
  const navigate = useNavigate();
  const { countryCode: codeParam } = useParams<{ countryCode: string }>();
  const goBack = useSafeBack('/country-history');

  const normalized = typeof codeParam === 'string' ? codeParam.toUpperCase() : '';
  const country = WORLD_CUP_NATIONS.find((r) => r.code.toUpperCase() === normalized);

  const handleYearClick = (countryCode: string, year: number) => {
    navigate(`/country-game/${countryCode}/${year}`);
  };

  if (!country) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        <Navigation />
        <div className="relative py-16 px-4 text-center">
          <p className="text-muted-foreground mb-6 text-lg">Country not found.</p>
          <Button variant="outline" onClick={goBack} className="rounded-xl border-primary/30">
            Back to Country History
          </Button>
        </div>
      </div>
    );
  }

  const years = [...country.worldCupYears].sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -top-28 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-[90px]" aria-hidden />
      <div className="pointer-events-none absolute top-40 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[min(100%,56rem)] -translate-x-1/2 rounded-t-[100%] bg-gradient-to-t from-muted/40 to-transparent" aria-hidden />

      <Navigation />

      <div className="relative py-8 sm:py-10 px-4 pb-14">
        <div className="max-w-3xl lg:max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="h-11 w-11 shrink-0 rounded-xl border-primary/25 bg-card/80 shadow-sm hover:bg-muted hover:border-primary/45"
              aria-label="Back to all countries"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 space-y-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary/90">Country History</p>
              <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black tracking-tight uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent [word-spacing:0.06em]">
                Choose a year
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-xl pt-1">
                Each button opens a 10-question quiz for that World Cup campaign.
              </p>
            </div>
          </div>

          <div
            className={cn(
              'rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card/95 to-primary/[0.06]',
              'shadow-[0_12px_48px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_hsl(190_95%_45%/0.08)]',
              'overflow-hidden',
            )}
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

            <div className="p-5 sm:p-7 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 mb-7">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-2xl border border-white/10',
                    'bg-gradient-to-br from-muted/90 via-muted/50 to-background/80',
                    'p-5 sm:p-6 shadow-inner min-h-[7.5rem] sm:min-w-[8.5rem]',
                  )}
                >
                  <CountryHistoryFlag name={country.name} emoji={country.flag} />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-[1.85rem] font-black text-foreground tracking-tight uppercase">
                      {country.name}
                    </h2>
                    <div className="mt-2 h-px w-full max-w-xs bg-gradient-to-r from-amber-500/50 via-primary/35 to-transparent rounded-full" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border border-amber-500/35',
                        'bg-gradient-to-r from-amber-500/12 via-amber-500/5 to-transparent',
                        'pl-3 pr-3 py-1.5 text-sm font-semibold text-amber-200/95 dark:text-amber-100',
                        'shadow-sm shadow-amber-900/10',
                      )}
                    >
                      <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                      {country.worldCupYears.length}{' '}
                      {country.worldCupYears.length === 1 ? 'appearance' : 'appearances'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Finals tournaments
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    Pick a tournament year below to dive into quiz questions about {country.name}&apos;s squad,
                    matches, and story from that edition.
                  </p>
                </div>
              </div>

              <div className="relative mb-1">
                <div className="absolute inset-x-0 -top-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border/70" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                    Select campaign
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border/70" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-4">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearClick(country.code, year)}
                    className={cn(
                      'group relative flex items-center justify-between gap-1 rounded-xl border px-3 py-3.5 sm:py-4',
                      'border-border/80 bg-gradient-to-b from-card/90 to-muted/30',
                      'text-left font-black tabular-nums text-base sm:text-lg text-foreground',
                      'shadow-sm transition-all duration-200',
                      'hover:border-primary/55 hover:bg-primary/10 hover:shadow-[0_0_28px_hsl(190_95%_45%/0.18)]',
                      'hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    )}
                  >
                    <span>{year}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
            <p className="text-center text-[0.65rem] text-muted-foreground/80 uppercase tracking-[0.15em] py-3 px-4 bg-muted/20">
              World Cup trivia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryHistoryYears;

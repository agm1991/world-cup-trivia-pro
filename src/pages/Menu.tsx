import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  LineChart,
  Trophy,
  User,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { hasSavedProfile, useLocalProfile } from '@/contexts/LocalProfileContext';
import { cn } from '@/lib/utils';

const Menu = () => {
  const navigate = useNavigate();
  const { profile } = useLocalProfile();
  const profileLocked = hasSavedProfile(profile);

  const menuItems = [
    {
      label: profileLocked ? 'My profile' : 'Create profile',
      description: profileLocked
        ? 'View your permanent player identity'
        : 'Set up your name & country once',
      path: '/create-profile',
      icon: User,
      accent: 'from-sky-500/20 via-sky-950/25 to-card/90 border-sky-500/30',
      iconBg: 'from-sky-400/20 to-sky-600/10 border-sky-400/25',
      iconClass: 'text-sky-300',
      hoverGlow: 'group-hover:shadow-[0_16px_48px_-12px_hsl(198_93%_60%/0.4)]',
    },
    {
      label: 'Stats',
      description: 'Scores, coins & progress',
      path: '/profile',
      icon: LineChart,
      accent: 'from-amber-500/25 via-amber-950/30 to-card/90 border-amber-500/35',
      iconBg: 'from-amber-400/25 to-amber-600/10 border-amber-400/30',
      iconClass: 'text-amber-300',
      hoverGlow: 'group-hover:shadow-[0_16px_48px_-12px_hsl(45_93%_50%/0.45)]',
    },
    {
      label: 'Leaderboard',
      description: 'Worldwide challenge',
      path: '/leaderboard',
      icon: BarChart3,
      accent: 'from-emerald-500/20 via-emerald-950/25 to-card/90 border-emerald-500/30',
      iconBg: 'from-emerald-400/20 to-emerald-600/10 border-emerald-400/25',
      iconClass: 'text-emerald-300',
      hoverGlow: 'group-hover:shadow-[0_16px_48px_-12px_hsl(160_84%_45%/0.4)]',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse 90% 55% at 50% 0%, hsl(45 93% 47% / 0.2), transparent 65%), radial-gradient(ellipse 45% 40% at 0% 80%, hsl(198 93% 50% / 0.1), transparent 55%), radial-gradient(ellipse 45% 40% at 100% 80%, hsl(160 84% 40% / 0.1), transparent 55%)',
            }}
          />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-64 w-[min(100%,720px)] rounded-full bg-amber-500/[0.08] blur-3xl" />
        </div>

        <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-5 sm:px-6 md:py-6 lg:max-w-5xl">
          <div className="mb-5 flex shrink-0 items-center gap-4 md:mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="border-border hover:bg-muted shrink-0"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0 text-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Menu
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg mt-2 tracking-wide">
                Build your legacy. Chase the crown.
              </p>
            </div>
            <div className="w-10 shrink-0" aria-hidden />
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-amber-500/15 bg-card/50 backdrop-blur-md shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55),0_0_0_1px_hsl(45_93%_47%/0.06)_inset]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
              aria-hidden
            />

            <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5 md:p-6">
              <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
                {menuItems.map(({ label, description, path, icon: Icon, accent, iconBg, iconClass, hoverGlow }, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => navigate(path, { state: { returnTo: '/menu' } })}
                    className={cn(
                      'group relative flex min-h-[5.5rem] flex-1 w-full overflow-hidden rounded-xl border bg-gradient-to-br text-left sm:min-h-[6.5rem] md:min-h-[7rem]',
                      'transition-all duration-300 ease-out',
                      'hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/45',
                      accent,
                      hoverGlow,
                    )}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-white/[0.07] via-white/[0.03] to-transparent"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute left-0 top-0 h-full w-1 scale-y-0 bg-gradient-to-b from-amber-300 to-amber-600 transition-transform duration-300 group-hover:scale-y-100 origin-top"
                      aria-hidden
                    />

                    <div className="relative flex h-full w-full items-center gap-4 p-5 sm:gap-5 sm:p-6 md:p-7">
                      <div
                        className={cn(
                          'relative flex h-14 w-14 sm:h-16 sm:w-16 md:h-[4.25rem] md:w-[4.25rem] shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:scale-105',
                          iconBg,
                        )}
                      >
                        <Icon className={cn('h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9', iconClass)} aria-hidden />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-xl sm:text-2xl uppercase tracking-[0.08em] text-foreground">
                            {label}
                          </p>
                          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/40">
                            0{index + 1}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">{description}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <ChevronRight
                          className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-400"
                          aria-hidden
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-amber-500/10 bg-amber-500/[0.04] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:py-4">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <Trophy className="h-4 w-4 text-amber-400/90 shrink-0" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  World Cup Quiz
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

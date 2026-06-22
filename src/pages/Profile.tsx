import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Navigation } from '@/components/Navigation';
import {
  ArrowLeft,
  Trophy,
  Target,
  Users,
  Star,
  Globe,
  Award,
  Flag,
  UserCog,
  Building2,
  UserX,
  Route,
  Grid3x3,
  Coins,
  Layers,
  LayoutGrid,
  ChevronDown,
  Check,
  Loader2,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { hasGameAccess } from '@/lib/gameAccess';
import { CATEGORIES_PAGE_DISPLAY_ITEMS } from '@/lib/categoryNavigation';
import { cn } from '@/lib/utils';
import { allPlayers } from '@/data/playerQuestions';

const categoryIcons: Record<string, typeof Trophy> = {
  'world-cup': Trophy,
  'guess-scoreline': Target,
  'guess-who': Users,
  player: Star,
  players: Star,
  'country-history': Globe,
  'world-cup-winners': Award,
  winners: Award,
  managers: UserCog,
  stadiums: Building2,
  'missing-player': UserX,
  'destiny-route': Route,
  'world-cup-bingo': Grid3x3,
  'world-cup-2026-squad-predictor': LayoutGrid,
  'squad-predictor': LayoutGrid,
};

type LevelBreakdown = {
  level: number;
  bestScore: number;
  attempts: number;
  /** Set for aggregated Players mode (per-legend level) */
  subtitle?: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/';
  const {
    getTotalStats,
    gameStats,
    refreshGameStatsFromStorage,
    recentCompletions,
    refreshRecentCompletionsFromStorage,
  } = useLocalProfile();
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => new Set());

  const totalStats = getTotalStats();
  const coins = Math.max(0, Math.floor(totalStats.totalScore / 10));
  const avgPerLevel =
    totalStats.levelsCompleted > 0
      ? Math.round(totalStats.totalScore / totalStats.levelsCompleted)
      : 0;

  useEffect(() => {
    if (!hasGameAccess()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    refreshGameStatsFromStorage();
    refreshRecentCompletionsFromStorage();
  }, [refreshGameStatsFromStorage, refreshRecentCompletionsFromStorage, location.key]);

  const categoryRows = useMemo(() => {
    return CATEGORIES_PAGE_DISPLAY_ITEMS.filter(
      (item) =>
        item.category !== 'squad-predictor' && item.category !== 'world-cup-2026-squad-predictor',
    ).map((item) => {
      if (item.category === 'player') {
        let score = 0;
        let highest = 0;
        const flat: {
          level: number;
          bestScore: number;
          attempts: number;
          completed: boolean;
          subtitle: string;
        }[] = [];

        for (const [key, raw] of Object.entries(gameStats)) {
          if (!key.startsWith('player-')) continue;
          const pid = key.slice('player-'.length);
          const label = allPlayers.find((p) => p.id === pid)?.name ?? pid;
          score += raw.totalScore ?? 0;
          highest = Math.max(highest, raw.highestLevel ?? 0);
          for (const [lvl, l] of Object.entries(raw.levels ?? {})) {
            flat.push({
              level: Number(lvl),
              bestScore: l.bestScore,
              attempts: l.attempts,
              completed: l.completed,
              subtitle: label,
            });
          }
        }

        const completedLevels = flat.filter((l) => l.completed).length;
        const catCoins = Math.max(0, Math.floor(score / 10));
        const progressPct =
          item.totalLevels > 0
            ? Math.min(100, Math.round((completedLevels / item.totalLevels) * 100))
            : 0;

        const clearedLevels: LevelBreakdown[] = flat
          .filter((e) => e.completed)
          .sort((a, b) => a.subtitle.localeCompare(b.subtitle) || a.level - b.level)
          .map(({ level, bestScore, attempts, subtitle }) => ({ level, bestScore, attempts, subtitle }));

        const inProgressLevels: LevelBreakdown[] = flat
          .filter((e) => !e.completed && e.attempts > 0)
          .sort((a, b) => a.subtitle.localeCompare(b.subtitle) || a.level - b.level)
          .map(({ level, bestScore, attempts, subtitle }) => ({ level, bestScore, attempts, subtitle }));

        return {
          ...item,
          score,
          catCoins,
          completedLevels,
          highest,
          progressPct,
          played: completedLevels > 0 || score > 0,
          clearedLevels,
          inProgressLevels,
        };
      }

      const stats = gameStats[item.category] ?? null;
      const levelsMap = stats?.levels ?? {};
      const completedLevels = Object.values(levelsMap).filter((l) => l.completed).length;
      const score = stats?.totalScore ?? 0;
      const highest = stats?.highestLevel ?? 0;
      const catCoins = Math.max(0, Math.floor(score / 10));
      const progressPct =
        item.totalLevels > 0
          ? Math.min(100, Math.round((completedLevels / item.totalLevels) * 100))
          : 0;

      const entries = Object.entries(levelsMap).map(([lvl, l]) => ({
        level: Number(lvl),
        bestScore: l.bestScore,
        attempts: l.attempts,
        completed: l.completed,
      }));

      const clearedLevels: LevelBreakdown[] = entries
        .filter((e) => e.completed)
        .sort((a, b) => a.level - b.level)
        .map(({ level, bestScore, attempts }) => ({ level, bestScore, attempts }));

      const inProgressLevels: LevelBreakdown[] = entries
        .filter((e) => !e.completed && e.attempts > 0)
        .sort((a, b) => a.level - b.level)
        .map(({ level, bestScore, attempts }) => ({ level, bestScore, attempts }));

      return {
        ...item,
        score,
        catCoins,
        completedLevels,
        highest,
        progressPct,
        played: completedLevels > 0 || score > 0,
        clearedLevels,
        inProgressLevels,
      };
    });
  }, [gameStats]);

  const setCategoryOpen = (category: string, open: boolean) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (open) next.add(category);
      else next.delete(category);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(45 93% 45% / 0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 0%, hsl(210 80% 40% / 0.12), transparent 50%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(returnTo)}
              className="border-border hover:bg-muted shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0 text-center">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" aria-hidden />
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Stats
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg mt-2">
                Scores, coins, and progress saved locally on this device.
              </p>
            </div>
            <div className="w-10 shrink-0" aria-hidden />
          </div>

          <Card className="p-6 md:p-8 mb-8 shadow-card border-border/80 rounded-2xl bg-card/60 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <Clock className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Recent quiz results</h2>
            </div>
            {recentCompletions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No results yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {recentCompletions.slice(0, 9).map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border border-border/80 bg-muted/15 px-3 py-2.5 text-center"
                  >
                    <p className="text-xs font-semibold truncate leading-tight" title={e.title}>
                      {e.title}
                    </p>
                    <p className="text-xl font-black tabular-nums text-primary mt-1">
                      {e.score.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {new Date(e.at).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Stats depth — high-contrast hero */}
          <div className="relative mb-10 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-card/90 via-card/70 to-muted/30 p-1 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_hsl(45_100%_70%/0.08)]">
            <div
              className="rounded-[0.9rem] border border-border/50 bg-gradient-to-b from-background/85 to-background/95 px-5 py-8 md:px-8 md:py-10"
              style={{
                boxShadow: 'inset 0 0 80px -20px hsl(45 93% 40% / 0.07)',
              }}
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90 mb-2">
                    Career total
                  </p>
                  <p
                    className="text-5xl sm:text-6xl md:text-7xl font-black tabular-nums tracking-tight leading-none bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_2px_24px_hsl(45_93%_50%/0.25)]"
                    aria-live="polite"
                  >
                    {totalStats.totalScore.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground mt-2">Total score</p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200/95">
                    <Sparkles className="h-3.5 w-3.5 opacity-90" aria-hidden />
                    Live stats
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="rounded-xl border border-border/60 bg-muted/25 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-muted/35">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Coins className="h-4 w-4 text-amber-400 shrink-0" aria-hidden />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Coins</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">{coins.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/25 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-muted/35">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Layers className="h-4 w-4 text-primary shrink-0" aria-hidden />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Levels</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {totalStats.levelsCompleted.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Cleared</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/25 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-muted/35">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <LayoutGrid className="h-4 w-4 text-primary shrink-0" aria-hidden />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Modes</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {totalStats.categoriesPlayed.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Touched</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/25 px-4 py-4 backdrop-blur-sm transition-colors hover:bg-muted/35 col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Trophy className="h-4 w-4 text-amber-400 shrink-0" aria-hidden />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Average</span>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">
                    {avgPerLevel > 0 ? avgPerLevel.toLocaleString() : '—'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Pts / level cleared</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-x-4 -top-6 bottom-0 rounded-3xl opacity-90"
              style={{
                background:
                  'radial-gradient(ellipse 90% 70% at 50% 0%, hsl(45 100% 52% / 0.09), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 20%, hsl(38 92% 50% / 0.05), transparent 50%)',
              }}
              aria-hidden
            />
            <div className="relative flex items-end justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.04em] bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_28px_hsl(45_93%_48%/0.35)]">
                  Category performance
                </h2>
                <div className="mt-3 h-px w-full max-w-xs bg-gradient-to-r from-amber-500/50 via-amber-400/30 to-transparent rounded-full" />
                <p className="text-sm text-amber-100/75 mt-3 leading-relaxed max-w-xl">
                  Expand any mode to see which levels you&apos;ve cleared or started — view only, no jump to play.
                </p>
              </div>
            </div>

            <div className="relative flex flex-col gap-3 md:gap-4">
              {categoryRows.map((row) => {
                const Icon = categoryIcons[row.category] ?? Trophy;
                const isOpen = openCategories.has(row.category);
                const hasDetail =
                  row.clearedLevels.length > 0 || row.inProgressLevels.length > 0;
                return (
                  <Collapsible
                    key={row.category}
                    open={isOpen}
                    onOpenChange={(open) => setCategoryOpen(row.category, open)}
                  >
                    <div
                      className={cn(
                        'rounded-2xl border transition-all duration-300',
                        'border-amber-500/20 bg-gradient-to-br from-card/85 via-card/50 to-amber-950/15',
                        'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_hsl(45_100%_70%/0.06)]',
                        isOpen &&
                          'border-amber-400/45 shadow-[0_16px_44px_-12px_rgba(0,0,0,0.55),0_0_0_1px_hsl(45_93%_55%/0.18),0_0_40px_-8px_hsl(45_93%_45%/0.12)]',
                      )}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          className={cn(
                            'group w-full text-left rounded-2xl transition-all duration-300',
                            'hover:border-amber-500/35 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55),0_0_0_1px_hsl(45_93%_47%/0.12)]',
                            'hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          )}
                        >
                          <div className="relative overflow-hidden rounded-2xl">
                            <div
                              className={cn(
                                'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400/90 to-amber-600/40 opacity-60 transition-opacity group-hover:opacity-100 group-data-[state=open]:opacity-100',
                                !row.played && 'from-muted-foreground/30 to-muted-foreground/10 opacity-40',
                              )}
                              aria-hidden
                            />
                            <div className="pl-5 pr-4 py-5 md:pl-6 md:pr-5">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                  <div
                                    className={cn(
                                      'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border shadow-inner',
                                      'bg-gradient-to-br from-amber-400/25 to-amber-700/10 border-amber-500/25',
                                      !row.played && 'from-muted/40 to-muted/20 border-border/60',
                                    )}
                                  >
                                    <Icon
                                      className={cn(
                                        'h-7 w-7 text-amber-200',
                                        !row.played && 'text-muted-foreground',
                                      )}
                                      strokeWidth={2}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3
                                        className={cn(
                                          'font-bold text-lg md:text-xl uppercase tracking-wide md:tracking-wider bg-clip-text text-transparent',
                                          row.played
                                            ? 'bg-gradient-to-br from-amber-50 via-amber-200 to-amber-400 drop-shadow-[0_1px_14px_hsl(45_93%_50%/0.25)]'
                                            : 'bg-gradient-to-br from-amber-200/85 via-amber-400/75 to-amber-600/80',
                                        )}
                                      >
                                        {row.title}
                                      </h3>
                                      {row.progressPct >= 100 ? (
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/95 border border-emerald-500/40 bg-emerald-500/12 rounded-full px-2 py-0.5 shadow-[inset_0_1px_0_hsl(142_76%_50%/0.12)]">
                                          Complete
                                        </span>
                                      ) : (
                                        !row.played && (
                                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90 border border-amber-500/35 bg-amber-500/10 rounded-full px-2 py-0.5 shadow-[inset_0_1px_0_hsl(45_100%_70%/0.12)]">
                                            Not started
                                          </span>
                                        )
                                      )}
                                    </div>
                                    <p className="text-sm text-amber-100/50 mt-1">
                                      <span className="tabular-nums font-medium text-amber-50/95">
                                        {row.completedLevels.toLocaleString()}
                                      </span>
                                      {' / '}
                                      <span className="tabular-nums text-amber-100/70">
                                        {row.totalLevels.toLocaleString()}
                                      </span>
                                      {' levels cleared'}
                                      {row.highest > 0 && (
                                        <span className="text-amber-100/45">
                                          {' '}
                                          · deepest{' '}
                                          <span className="tabular-nums font-medium text-amber-100/80">
                                            L{row.highest}
                                          </span>
                                        </span>
                                      )}
                                    </p>

                                    <div className="mt-3">
                                      <div className="flex justify-between text-[11px] uppercase tracking-wider mb-1.5">
                                        <span className="text-amber-200/85 font-semibold">Progress</span>
                                        <span className="tabular-nums text-amber-100/95 font-semibold">
                                          {row.progressPct}%
                                        </span>
                                      </div>
                                      <div className="h-2 w-full rounded-full bg-muted/70 overflow-hidden border border-amber-900/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
                                        <div
                                          className={cn(
                                            'h-full rounded-full transition-all duration-500 ease-out',
                                            row.progressPct >= 100
                                              ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400'
                                              : row.played
                                                ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300'
                                                : 'bg-muted-foreground/25',
                                          )}
                                          style={{ width: `${row.progressPct}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-1 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-amber-500/15 pt-4 sm:pt-0">
                                  <div className="text-right">
                                    <p className="text-2xl md:text-3xl font-black tabular-nums bg-gradient-to-br from-amber-50 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_20px_hsl(45_93%_52%/0.45)]">
                                      {row.catCoins.toLocaleString()}
                                    </p>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300/90 mt-0.5">
                                      Coins
                                    </p>
                                    <p className="text-[11px] text-amber-100/55 mt-0.5 tabular-nums">
                                      {row.score.toLocaleString()} pts
                                    </p>
                                  </div>
                                  <ChevronDown
                                    className={cn(
                                      'h-5 w-5 text-muted-foreground group-data-[state=open]:rotate-180 group-hover:text-amber-400/90 transition-all shrink-0 sm:mt-2',
                                    )}
                                    aria-hidden
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden transition-all">
                        <div className="border-t border-border/50 bg-muted/15 px-5 py-5 md:px-6 md:pb-6 rounded-b-2xl">
                          {!hasDetail ? (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              No level progress recorded here yet. When you play this mode, cleared and in-progress
                              levels will show up in this breakdown.
                            </p>
                          ) : (
                            <div className="space-y-5">
                              {row.clearedLevels.length > 0 && (
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/95 mb-3 flex items-center gap-2">
                                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                                    Cleared list ({row.clearedLevels.length})
                                  </p>
                                  <div className="max-h-52 overflow-y-auto pr-1">
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 list-none p-0 m-0">
                                      {row.clearedLevels.map((lv) => (
                                        <li
                                          key={lv.level}
                                          className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-2.5 py-2 text-center"
                                        >
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/90 block">
                                            {lv.subtitle ? `${lv.subtitle} · L${lv.level}` : `Level ${lv.level}`}
                                          </span>
                                          <span className="text-xs tabular-nums font-semibold text-foreground mt-0.5 block">
                                            {lv.bestScore.toLocaleString()} pts
                                          </span>
                                          {lv.attempts > 1 && (
                                            <span className="text-[10px] text-muted-foreground tabular-nums">
                                              {lv.attempts} runs
                                            </span>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                              {row.inProgressLevels.length > 0 && (
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300/90 mb-3 flex items-center gap-2">
                                    <Loader2
                                      className="h-3.5 w-3.5 opacity-90 shrink-0"
                                      aria-hidden
                                    />
                                    Started, not cleared ({row.inProgressLevels.length})
                                  </p>
                                  <div className="max-h-40 overflow-y-auto pr-1">
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 list-none p-0 m-0">
                                      {row.inProgressLevels.map((lv) => (
                                        <li
                                          key={lv.level}
                                          className="rounded-lg border border-amber-500/15 bg-amber-500/[0.06] px-2.5 py-2 text-center"
                                        >
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100/85 block">
                                            {lv.subtitle ? `${lv.subtitle} · L${lv.level}` : `Level ${lv.level}`}
                                          </span>
                                          <span className="text-xs tabular-nums text-muted-foreground mt-0.5 block">
                                            best {lv.bestScore.toLocaleString()} · {lv.attempts}{' '}
                                            {lv.attempts === 1 ? 'try' : 'tries'}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

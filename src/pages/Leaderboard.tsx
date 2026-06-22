import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Trophy, Zap, BarChart3, Goal, Globe, RefreshCw, LayoutGrid } from 'lucide-react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import {
  formatTime,
  getCountryActivityFromEntries,
  getSpeedLeadersFromEntries,
  loadCategoryLeaderboardSnapshot,
  loadLeaderboardBase,
  rankLeaderboardEntries,
  type CategoryLeaderboardSnapshot,
  type CountryActivity,
  type LeaderboardEntry,
  type LeaderboardSnapshot,
  type SpeedLeaderEntry,
} from '@/lib/leaderboard';
import { LEADERBOARD_CATEGORY_OPTIONS } from '@/lib/leaderboardCategories';
import { readAllCategoryFastestTimes } from '@/lib/fastestTimerRun';
import { WorldCountryFlag, WorldCountrySelect } from '@/components/WorldCountrySelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Navigation } from '@/components/Navigation';
import { hasGameAccess } from '@/lib/gameAccess';
import { WhatsNextSection } from '@/components/WhatsNextSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const emptySnapshot: LeaderboardSnapshot = {
  entries: [],
  activity: [],
  speedLeaders: [],
  source: 'empty',
};

const emptyCategorySnapshot: CategoryLeaderboardSnapshot = {
  points: [],
  speed: [],
  playerId: '',
  source: 'empty',
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/categories';
  const { profile, gameStats, getTotalStats } = useLocalProfile();
  const [filterCountry, setFilterCountry] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [speedFilter, setSpeedFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(LEADERBOARD_CATEGORY_OPTIONS[0]?.id ?? 'world-cup');
  const [snapshot, setSnapshot] = useState<LeaderboardSnapshot>(emptySnapshot);
  const [categorySnapshot, setCategorySnapshot] = useState<CategoryLeaderboardSnapshot>(emptyCategorySnapshot);
  const [overallEntries, setOverallEntries] = useState<LeaderboardEntry[]>([]);
  const [activityRows, setActivityRows] = useState<CountryActivity[]>([]);
  const [speedRows, setSpeedRows] = useState<SpeedLeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const totalStats = getTotalStats();

  useEffect(() => {
    if (!hasGameAccess()) {
      navigate('/', { replace: true });
      return;
    }
    if (!profile?.name?.trim() || !profile?.country) {
      navigate('/create-profile', { replace: true });
    }
  }, [navigate, profile]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { rows, source, playerId } = await loadLeaderboardBase({
        currentUserName: profile?.name || '',
        currentUserCountry: profile?.country || '',
        currentUserScore: totalStats.totalScore,
        currentUserLevelsCompleted: totalStats.levelsCompleted,
        currentUserFastestTime: totalStats.fastestTimerRunSec,
      });

      setOverallEntries(rankLeaderboardEntries(rows, filterCountry || undefined));
      setSnapshot({
        entries: rankLeaderboardEntries(rows, filterCountry || undefined),
        activity: activityFilter
          ? getCountryActivityFromEntries(rows).filter(
              (c) => c.country.toLowerCase() === activityFilter.toLowerCase(),
            )
          : getCountryActivityFromEntries(rows),
        speedLeaders: getSpeedLeadersFromEntries(rows, playerId, speedFilter || undefined),
        source,
      });
      setActivityRows(
        activityFilter
          ? getCountryActivityFromEntries(rows).filter(
              (c) => c.country.toLowerCase() === activityFilter.toLowerCase(),
            )
          : getCountryActivityFromEntries(rows),
      );
      setSpeedRows(getSpeedLeadersFromEntries(rows, playerId, speedFilter || undefined));

      const categoryFastestTimes = readAllCategoryFastestTimes();
      const catSnap = await loadCategoryLeaderboardSnapshot({
        category: categoryFilter,
        currentUserName: profile?.name || '',
        currentUserCountry: profile?.country || '',
        gameStats,
        categoryFastestTimes,
      });
      setCategorySnapshot(catSnap);
    } finally {
      setLoading(false);
    }
  }, [
    profile?.name,
    profile?.country,
    totalStats.totalScore,
    totalStats.levelsCompleted,
    totalStats.fastestTimerRunSec,
    categoryFilter,
    gameStats,
    filterCountry,
    activityFilter,
    speedFilter,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const countrySelectClass = 'sm:min-w-[220px]';

  const countryFilter = (
    value: string,
    onChange: (v: string) => void,
    emptyLabel: string,
    id: string,
  ) => (
    <WorldCountrySelect
      id={id}
      value={value}
      onChange={onChange}
      emptyLabel={emptyLabel}
      className={countrySelectClass}
    />
  );

  const sourceHint =
    snapshot.source === 'online'
      ? 'Live worldwide rankings'
      : snapshot.source === 'local' && profile
        ? 'Showing your profile — other players appear when they sync online'
        : 'Create a profile and play to appear on the board';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-10 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(returnTo)}
            className="border-border hover:bg-muted hover:border-primary/50 transition-all p-2 shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0 text-center">
            <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" aria-hidden />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              Worldwide Challenge
            </h1>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg">
              Compete globally and see where you rank — points, levels, and speed
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => void refresh()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <WhatsNextSection className="mb-10 scroll-mt-28" />

        {/* Activity */}
        <section className="mb-10 rounded-2xl border border-primary/20 bg-gradient-to-b from-card/90 to-card/40 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="rounded-[14px] bg-background/60 backdrop-blur-sm px-4 py-5 md:px-6 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </span>
                  Activity
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                  Players and total points by nation — pick a country or view all.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Country
                </Label>
                {countryFilter(activityFilter, setActivityFilter, 'All countries', 'activity-country-filter')}
              </div>
            </div>
            <Card className="overflow-hidden border-border/80 rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent bg-muted/30">
                    <TableHead className="w-16 text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Country</TableHead>
                    <TableHead className="text-right text-muted-foreground">Players</TableHead>
                    <TableHead className="text-right text-muted-foreground">Total pts</TableHead>
                    <TableHead className="text-right text-muted-foreground">Avg levels</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityRows.length === 0 ? (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                        {activityFilter
                          ? `No players from ${activityFilter} on the board yet.`
                          : 'Nation activity appears as players sync their scores online.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    activityRows.map((row) => (
                      <TableRow key={row.country} className="border-border hover:bg-muted/30">
                        <TableCell className="font-medium">{row.rank}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <WorldCountryFlag name={row.country} />
                            {row.country}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{row.playerCount}</TableCell>
                        <TableCell className="text-right font-medium">{row.totalScore}</TableCell>
                        <TableCell className="text-right">{row.avgLevel}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </section>

        {/* Overall — worldwide rank by highest score */}
        <section className="mb-10 rounded-2xl border border-amber-400/25 bg-gradient-to-b from-amber-500/10 via-card/90 to-card/40 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="rounded-[14px] bg-background/60 backdrop-blur-sm px-4 py-5 md:px-6 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25">
                    <Globe className="w-5 h-5 text-amber-400" />
                  </span>
                  Overall
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl">{sourceHint}</p>
              </div>
              <div className="w-full sm:w-auto">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Country
                </Label>
                {countryFilter(filterCountry, setFilterCountry, 'All countries (Global)', 'overall-country-filter')}
              </div>
            </div>

            <Card className="overflow-hidden border-border rounded-xl shadow-inner">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent bg-muted/30">
                    <TableHead className="w-16 text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Player</TableHead>
                    <TableHead className="text-muted-foreground">Country</TableHead>
                    <TableHead className="text-right text-muted-foreground">Score</TableHead>
                    <TableHead className="text-right text-muted-foreground">Levels</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overallEntries.length === 0 ? (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-10">
                        {filterCountry
                          ? `No players from ${filterCountry} on the board yet.`
                          : profile
                            ? 'Play levels to earn points — your row syncs here automatically when online.'
                            : 'Save a profile first, then play to join the worldwide rankings.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    overallEntries.map((entry) => (
                      <TableRow
                        key={`overall-${entry.playerId ?? entry.name}-${entry.rank}`}
                        className={`border-border ${entry.isCurrentUser ? 'bg-primary/15 font-semibold' : 'hover:bg-muted/30'}`}
                      >
                        <TableCell>
                          {entry.rank <= 3 ? (
                            <span className="text-2xl">{['🥇', '🥈', '🥉'][entry.rank - 1]}</span>
                          ) : (
                            <span className="font-medium">{entry.rank}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            {entry.name}
                            {entry.isCurrentUser && (
                              <span className="text-xs bg-primary/30 px-2 py-0.5 rounded">You</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <WorldCountryFlag name={entry.country} />
                            {entry.country}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">{entry.score}</TableCell>
                        <TableCell className="text-right">{entry.level}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </section>

        {/* By category — points (no timer) + speed (Timer Challenge) */}
        <section className="mb-10 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-card/90 to-sky-950/10 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="rounded-[14px] bg-background/60 backdrop-blur-sm px-4 py-5 md:px-6 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 border border-sky-500/25">
                    <LayoutGrid className="w-5 h-5 text-sky-400" />
                  </span>
                  By category
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                  Compare skill per game mode — points without a timer, and fastest Timer Challenge runs.
                </p>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[240px]">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Category
                </Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-leaderboard-filter" className={countrySelectClass}>
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="max-h-[min(20rem,70vh)] min-w-[var(--radix-select-trigger-width)]"
                  >
                    {LEADERBOARD_CATEGORY_OPTIONS.map(({ id, label }) => (
                      <SelectItem
                        key={id}
                        value={id}
                        className="py-2.5 text-xs font-semibold uppercase tracking-wider"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Points (no timer)</h3>
                <Card className="overflow-hidden border-border/80 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent bg-muted/30">
                        <TableHead className="w-14 text-muted-foreground">Rank</TableHead>
                        <TableHead className="text-muted-foreground">Player</TableHead>
                        <TableHead className="text-right text-muted-foreground">Score</TableHead>
                        <TableHead className="text-right text-muted-foreground">Levels</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categorySnapshot.points.length === 0 ? (
                        <TableRow className="border-border hover:bg-transparent">
                          <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                            No points recorded for this category yet — play levels to rank here.
                          </TableCell>
                        </TableRow>
                      ) : (
                        categorySnapshot.points.map((entry) => (
                          <TableRow
                            key={`cat-points-${entry.playerId ?? entry.name}-${entry.rank}`}
                            className={`border-border ${entry.isCurrentUser ? 'bg-primary/15 font-semibold' : 'hover:bg-muted/30'}`}
                          >
                            <TableCell className="font-medium">{entry.rank}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-2">
                                {entry.name}
                                {entry.isCurrentUser && (
                                  <span className="text-xs bg-primary/30 px-2 py-0.5 rounded">You</span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">{entry.score}</TableCell>
                            <TableCell className="text-right">{entry.level}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Speed (Timer Challenge)</h3>
                <Card className="overflow-hidden border-border/80 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent bg-muted/30">
                        <TableHead className="w-14 text-muted-foreground">Rank</TableHead>
                        <TableHead className="text-muted-foreground">Player</TableHead>
                        <TableHead className="text-right text-muted-foreground">Best time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categorySnapshot.speed.length === 0 ? (
                        <TableRow className="border-border hover:bg-transparent">
                          <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-8">
                            No Timer Challenge times for this category yet — enable the timer on level intro.
                          </TableCell>
                        </TableRow>
                      ) : (
                        categorySnapshot.speed.map((row) => (
                          <TableRow
                            key={`cat-speed-${row.name}-${row.rank}`}
                            className={`border-border ${row.isCurrentUser ? 'bg-primary/15 font-semibold' : 'hover:bg-muted/30'}`}
                          >
                            <TableCell className="font-medium">{row.rank}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-2">
                                {row.name}
                                {row.isCurrentUser && (
                                  <span className="text-xs bg-primary/30 px-2 py-0.5 rounded">You</span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-mono">{formatTime(row.fastestTime)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Speed */}
        <section className="mb-10 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-card/90 to-amber-950/10 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="rounded-[14px] bg-background/60 backdrop-blur-sm px-4 py-5 md:px-6 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </span>
                  Speed
                </h2>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                  Fastest level times — filter by country or view global leaders.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Country
                </Label>
                {countryFilter(speedFilter, setSpeedFilter, 'All countries', 'speed-country-filter')}
              </div>
            </div>
            <Card className="overflow-hidden border-border/80 rounded-xl">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent bg-muted/30">
                    <TableHead className="w-16 text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Player</TableHead>
                    <TableHead className="text-muted-foreground">Country</TableHead>
                    <TableHead className="text-right text-muted-foreground">Best time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {speedRows.length === 0 ? (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                        {speedFilter
                          ? `No speed times recorded for ${speedFilter} yet.`
                          : 'Speed rankings fill in when players complete levels with timed runs.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    speedRows.map((row) => (
                      <TableRow
                        key={`speed-${row.name}-${row.rank}`}
                        className={`border-border ${row.isCurrentUser ? 'bg-primary/15 font-semibold' : 'hover:bg-muted/30'}`}
                      >
                        <TableCell className="font-medium">{row.rank}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            {row.name}
                            {row.isCurrentUser && (
                              <span className="text-xs bg-primary/30 px-2 py-0.5 rounded">You</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-2">
                            <WorldCountryFlag name={row.country} />
                            {row.country}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatTime(row.fastestTime)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 pb-8">
          <Button
            size="lg"
            onClick={() => navigate('/categories')}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
          >
            <Goal className="w-5 h-5 mr-2" />
            Play Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/profile')}
            className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 font-semibold"
          >
            View Full Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { Trophy, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  allPlayers,
  formatPlayerLevelLabel,
  getPlayerFullLevelCount,
  getPlayerWorldCupYearForLevel,
  getPlayerWorldCupYearsForLevelsSorted,
  getPlayerWorldCupYearsSorted,
  isThinLegendPlayer,
} from '@/data/playerQuestions';
import { getWorldCupHostFlagImageUrl, getWorldCupHostKickoffLabel } from '@/lib/worldCupHosts';
import { ProfileModal } from '@/components/ProfileModal';
import { REQUIRE_PROFILE_TO_PLAY } from '@/constants/profileGate';
import { getCountrySlug } from '@/pages/PlayerLevels';

const PlayerLevelSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playerId } = useParams<{ playerId: string }>();
  const {
    getCategoryStats,
    refreshGameStatsFromStorage,
    gameStats,
    profile,
    setShowProfileModal,
    showProfileModal,
  } = useLocalProfile();

  useEffect(() => {
    refreshGameStatsFromStorage();
  }, [refreshGameStatsFromStorage, playerId, location.key]);

  const player = playerId ? allPlayers.find((p) => p.id === playerId) : undefined;
  const countryLegendPath = player?.country
    ? `/levels/player/${getCountrySlug(player.country)}`
    : '/levels/player';
  const goBack = useSafeBack(countryLegendPath);
  const categoryKey = `player-${playerId}` as Category;
  const categoryStats = getCategoryStats(categoryKey);
  const levelProgress = gameStats[categoryKey]?.levels ?? {};

  if (!player || !playerId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <Navigation />
        <p className="text-foreground">Player not found</p>
        <Button variant="outline" onClick={goBack} className="gap-2" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
          Back to countries
        </Button>
      </div>
    );
  }

  const thin = isThinLegendPlayer(playerId);
  const fullLevelCount = getPlayerFullLevelCount(playerId);
  const wcYearsSorted = getPlayerWorldCupYearsSorted(playerId);
  const wcYearsForLevels = getPlayerWorldCupYearsForLevelsSorted(playerId);

  type YearTile = { navLevel: number; wcYear: number; reactKey: string };
  const yearTiles: YearTile[] = [];
  if (fullLevelCount >= 1) {
    for (let level = 1; level <= fullLevelCount; level++) {
      const wcYear = getPlayerWorldCupYearForLevel(playerId, level);
      if (wcYear != null) yearTiles.push({ navLevel: level, wcYear, reactKey: `lvl-${level}` });
    }
  } else {
    wcYearsForLevels.forEach((wcYear, i) => {
      yearTiles.push({ navLevel: 1, wcYear, reactKey: `thin-${wcYear}-${i}` });
    });
  }

  const tileCount = yearTiles.length;
  /** One WC campaign → center the host-flag card (multi-column grid would leave it left-aligned). */
  const singleCampaignTile = tileCount === 1;
  /** Two or three campaigns → flex row centered (4-col grid would leave tiles hugging the left). */
  const centeredFewTiles = tileCount === 2 || tileCount === 3;

  const handleYearTileClick = (navLevel: number, wcYear: number) => {
    if (REQUIRE_PROFILE_TO_PLAY && !profile) {
      setShowProfileModal(true);
      return;
    }
    if (!playerId) return;
    if (thin) {
      const multi = wcYearsForLevels.length > 1;
      const idx = multi ? wcYearsForLevels.indexOf(wcYear) : 0;
      const level = multi && idx >= 0 ? idx + 1 : 1;
      navigate(`/player-game/${playerId}/${level}`);
      return;
    }
    navigate(`/player-kickoff/${playerId}/${navLevel}`);
  };

  if (yearTiles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
        <Navigation />
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 px-4">
          <p className="text-muted-foreground text-center max-w-md">
            This legend uses one continuous quiz with every available question.
          </p>
          <Button
            onClick={() => {
              if (REQUIRE_PROFILE_TO_PLAY && !profile) {
                setShowProfileModal(true);
                return;
              }
              navigate(`/player-game/${playerId}/1`);
            }}
          >
            Start quiz
          </Button>
          <Button variant="outline" onClick={goBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="border-border hover:bg-muted mb-4"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase category-title-animated">
                {player.name}
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                {player.country} • World Cup finals appearances:{' '}
                {wcYearsSorted.length > 0 ? wcYearsSorted.join(', ') : player.worldCupYears?.join(', ') ?? '—'}
              </p>
              <div className="flex justify-center gap-6 mt-4 flex-wrap">
                <div className="flex items-center gap-2 text-foreground">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="font-bold">{categoryStats?.totalScore ?? 0}</span>
                  <span className="text-muted-foreground text-sm">Total Score</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-bold">
                    {categoryStats ? formatPlayerLevelLabel(categoryStats.highestLevel) : '—'}
                  </span>
                  <span className="text-muted-foreground text-sm">Highest level</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'mb-8 gap-4 md:gap-6',
              singleCampaignTile || centeredFewTiles
                ? 'flex flex-wrap justify-center'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            )}
          >
            {yearTiles.map(({ navLevel, wcYear, reactKey }) => {
              const completed = levelProgress[navLevel]?.completed ?? false;
              return (
                <button
                  key={reactKey}
                  type="button"
                  onClick={() => handleYearTileClick(navLevel, wcYear)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)]',
                    'min-h-[min(42vw,300px)] sm:min-h-[260px]',
                    'text-center transition-transform duration-300 hover:scale-[1.02]',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/60',
                    singleCampaignTile && 'w-full max-w-lg',
                    centeredFewTiles && 'w-full sm:w-[min(100%,320px)]',
                    completed
                      ? 'border-emerald-400/70 hover:border-emerald-300/80 ring-2 ring-emerald-500/35'
                      : 'border-amber-400/45 hover:border-amber-300/70',
                  )}
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${getWorldCupHostFlagImageUrl(wcYear, 1280)})` }}
                    aria-hidden
                  />
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/88 via-black/40 to-black/25',
                      completed && 'from-emerald-950/90 via-emerald-950/45 to-emerald-900/30',
                    )}
                    aria-hidden
                  />
                  {completed && (
                    <CheckCircle className="absolute top-3 right-3 z-20 h-6 w-6 text-emerald-400 drop-shadow-md" />
                  )}
                  <div className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center gap-1 px-4 py-10">
                    <span className="animate-flicker-gold text-5xl sm:text-6xl font-black tabular-nums leading-none tracking-tight">
                      {wcYear}
                    </span>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-amber-200/95 sm:text-xs">
                      {getWorldCupHostKickoffLabel(wcYear)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-muted-foreground text-sm text-center">
            {thin
              ? 'Each tile is a World Cup finals year for this legend — host flag matches that tournament. Tap any year to start the quiz.'
              : 'Each tile is a World Cup year this player contested — host flag matches that tournament. Tap a year to continue.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerLevelSelection;

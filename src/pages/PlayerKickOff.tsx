import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  allPlayers,
  getPlayerFullLevelCount,
  getPlayerWorldCupYearForLevel,
  isThinLegendPlayer,
} from '@/data/playerQuestions';
import { getWorldCupHostFlagImageUrl, getWorldCupHostKickoffLabel } from '@/lib/worldCupHosts';
import { cn } from '@/lib/utils';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { REQUIRE_PROFILE_TO_PLAY } from '@/constants/profileGate';
import { ProfileModal } from '@/components/ProfileModal';

const PlayerKickOff = () => {
  const navigate = useNavigate();
  const { playerId, level: levelParam } = useParams<{ playerId: string; level: string }>();
  const { profile, showProfileModal, setShowProfileModal } = useLocalProfile();

  const level = parseInt(levelParam || '1', 10);
  const player = playerId ? allPlayers.find((p) => p.id === playerId) : undefined;
  const fullLevelCount = playerId ? getPlayerFullLevelCount(playerId) : 0;
  const thin = !!(playerId && isThinLegendPlayer(playerId));
  const wcYear = playerId ? getPlayerWorldCupYearForLevel(playerId, level) : undefined;

  const kickoffShortLabel =
    wcYear != null
      ? `${getWorldCupHostKickoffLabel(wcYear)} ${wcYear}`.replace(/\s+/g, ' ').trim()
      : '';

  const handleKickOff = () => {
    if (REQUIRE_PROFILE_TO_PLAY && !profile) {
      setShowProfileModal(true);
      return;
    }
    if (!playerId) return;
    if (thin) {
      navigate(`/player-game/${playerId}/1`);
      return;
    }
    navigate(`/player-game/${playerId}/${level}`);
  };

  if (!player || !playerId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Player not found</p>
      </div>
    );
  }

  if (thin || fullLevelCount < 1 || level < 1 || level > fullLevelCount || wcYear == null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <Navigation />
        <p className="text-muted-foreground text-center">This screen doesn’t apply to this legend.</p>
        <Button variant="outline" onClick={() => navigate(`/player-levels/${playerId}`)}>
          Back to levels
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      <Navigation />
      <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-6">
        <Button
          variant="outline"
          className="absolute left-4 top-4 z-30 border-border/80 bg-background/80 text-foreground shadow-sm backdrop-blur-md hover:bg-muted/80 sm:left-6 sm:top-6"
          onClick={() => navigate(`/player-levels/${playerId}`)}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Same full-bleed host flag + gradient overlay as PlayerLevelSelection level cards */}
        <div
          className={cn(
            'relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl border-2 border-white/25',
            'shadow-[0_24px_80px_-12px_rgba(0,0,0,0.55)]',
            'min-h-[min(72vh,560px)] sm:min-h-[min(70vh,600px)]',
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${getWorldCupHostFlagImageUrl(wcYear)})` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(155deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.62) 38%, rgba(0,0,0,0.82) 100%)',
            }}
            aria-hidden
          />

          <div className="relative z-10 flex min-h-[inherit] flex-1 flex-col px-5 pb-10 pt-8 text-center sm:px-8 sm:pb-12 sm:pt-10">
            {/* Sits below midline: breathing room up top, hero + CTA feel grounded */}
            <div className="flex flex-1 flex-col items-center justify-start gap-5 pt-[clamp(1.75rem,10vh,4.5rem)] sm:gap-6 sm:pt-[clamp(2.25rem,11vh,5rem)]">
              <div className="flex max-w-[18rem] flex-col gap-1.5 sm:max-w-[20rem] sm:gap-2">
                <p className="category-title-animated text-[0.7rem] font-black uppercase tracking-[0.32em] text-white/90 sm:text-[0.75rem]">
                  FIFA World Cup
                </p>
                <h2 className="category-title-animated text-[1.65rem] font-black uppercase leading-[1.1] tracking-tight text-white sm:text-3xl md:text-[2rem]">
                  {player.name}
                </h2>
              </div>

              {profile || !REQUIRE_PROFILE_TO_PLAY ? (
                <div className="flex flex-col items-center gap-3 sm:gap-3.5">
                  <button
                    type="button"
                    onClick={handleKickOff}
                    aria-label={`Play ${kickoffShortLabel}`}
                    className={cn(
                      'group flex w-auto min-w-[11.5rem] flex-col items-center gap-1 rounded-2xl border-2 border-white/38',
                      'bg-black/28 px-6 py-4 backdrop-blur-md transition-[box-shadow,border-color,background-color] duration-300 ease-out sm:min-w-[13rem] sm:px-8 sm:py-5',
                      'hover:border-amber-200/50 hover:bg-black/38 hover:shadow-[0_0_36px_rgba(250,204,21,0.22)]',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200/55',
                      'active:bg-black/42',
                    )}
                  >
                    <span className="animate-flicker-gold block text-[1.75rem] font-black uppercase leading-none tracking-tight sm:text-[2rem]">
                      {getWorldCupHostKickoffLabel(wcYear)}
                    </span>
                    <span className="animate-flicker-gold block text-5xl tabular-nums leading-none sm:text-6xl md:text-7xl">
                      {wcYear}
                    </span>
                  </button>
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-amber-200/85 sm:text-sm">
                    Play now
                  </p>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-4">
                  <div
                    className={cn(
                      'flex w-auto min-w-[11.5rem] flex-col items-center gap-1 rounded-2xl border-2 border-white/38',
                      'bg-black/28 px-6 py-4 backdrop-blur-md sm:min-w-[13rem] sm:px-8 sm:py-5',
                    )}
                  >
                    <span className="animate-flicker-gold block text-[1.75rem] font-black uppercase leading-none tracking-tight sm:text-[2rem]">
                      {getWorldCupHostKickoffLabel(wcYear)}
                    </span>
                    <span className="animate-flicker-gold block text-5xl tabular-nums leading-none sm:text-6xl md:text-7xl">
                      {wcYear}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full max-w-sm font-black uppercase tracking-wide"
                    onClick={() => setShowProfileModal(true)}
                  >
                    Create profile to play
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerKickOff;

import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Trophy, Lock, Timer, ArrowLeft } from 'lucide-react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { REQUIRE_PROFILE_TO_PLAY } from '@/hooks/useRequireProfile';
import { Switch } from '@/components/ui/switch';
import { Category } from '@/types/game';

const LevelIntro = () => {
  const navigate = useNavigate();
  const { category, level } = useParams();
  const currentLevel = parseInt(level || '1', 10);
  const { profile, setShowProfileModal, getLevelStats } = useLocalProfile();
  const [timerEnabled, setTimerEnabled] = useState(false);

  // Check if this is a player category (format: player-{playerId})
  const isPlayerCategory = category?.startsWith('player-');
  const playerId = isPlayerCategory ? category.replace('player-', '') : null;
  
  // Check if this is missing-player category
  const isMissingPlayerCategory = category === 'missing-player';

  const backFallback = useMemo(() => {
    if (isPlayerCategory && playerId) return `/player-levels/${playerId}`;
    if (isMissingPlayerCategory) return '/missing-player';
    if (category) return `/levels/${category}`;
    return '/categories';
  }, [category, isPlayerCategory, isMissingPlayerCategory, playerId]);

  const goBack = useSafeBack(backFallback);

  const getDifficultyLabel = () => {
    if (category === 'world-cup-bingo') {
      return null;
    }
    if (isPlayerCategory) {
      // For players, all levels are easy mode
      return 'Easy Mode';
    }
    if (isMissingPlayerCategory) {
      if (currentLevel <= 12) return 'Easy Mode';
      if (currentLevel <= 18) return 'Medium Mode';
      return 'Hard Mode';
    }
    // Levels 1-10 are all easy mode
    if (currentLevel <= 10) return 'Easy Mode';
    if (currentLevel <= 20) return 'Medium Mode';
    return 'Hard Mode';
  };

  const getDifficultyColor = () => {
    if (category === 'world-cup-bingo') {
      return 'text-muted-foreground';
    }
    if (isPlayerCategory) {
      return 'text-green-500';
    }
    if (isMissingPlayerCategory) {
      if (currentLevel <= 12) return 'text-green-500';
      if (currentLevel <= 18) return 'text-yellow-500';
      return 'text-red-500';
    }
    // Levels 1-10 are all easy mode (green)
    if (currentLevel <= 10) return 'text-green-500';
    if (currentLevel <= 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const levelStats = getLevelStats(category as Category, currentLevel);
  const bestScore = levelStats?.bestScore || 0;

  const difficultyLabel = getDifficultyLabel();

  const handleStartChallenge = () => {
    if (REQUIRE_PROFILE_TO_PLAY && !profile) {
      setShowProfileModal(true);
      return;
    }
    if (isPlayerCategory && playerId) {
      navigate(`/player-game/${playerId}/${currentLevel}${timerEnabled ? '?timer=true' : ''}`);
    } else if (isMissingPlayerCategory) {
      navigate(`/missing-player/${currentLevel}`);
    } else {
      navigate(`/game/${category}?level=${currentLevel}&timer=${timerEnabled}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        {/* Back Button */}
        <button
          type="button"
          onClick={goBack}
          className="absolute top-24 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center space-y-10">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Level Display */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-lg uppercase tracking-widest font-medium">Get Ready</p>
            <h1 className="text-8xl md:text-9xl font-bold text-foreground uppercase tracking-tight">
              Level {currentLevel}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-primary uppercase tracking-wide">
              Start Now
            </p>
            {difficultyLabel != null && (
              <p className={`text-sm uppercase tracking-wider font-medium ${getDifficultyColor()}`}>
                {difficultyLabel}
              </p>
            )}
            {bestScore > 0 && (
              <p className="text-muted-foreground text-sm">Best Score: <span className="text-primary font-bold">{bestScore}</span></p>
            )}
          </div>

          {/* Timer Toggle */}
          <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
            <Timer className={`w-5 h-5 ${timerEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`font-medium ${timerEnabled ? 'text-foreground' : 'text-muted-foreground'}`}>
              Enable Timer Challenge ⏱️
            </span>
            <Switch
              checked={timerEnabled}
              onCheckedChange={setTimerEnabled}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-green-500"
            />
          </div>
          {timerEnabled && (
            <p className="text-xs text-muted-foreground">15 seconds per question</p>
          )}

          {/* Arcade Style Button */}
          {profile || !REQUIRE_PROFILE_TO_PLAY ? (
            <button
              onClick={handleStartChallenge}
              className="arcade-button group relative px-16 py-6 text-2xl font-black uppercase tracking-wider rounded-2xl
                bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600
                text-amber-950
                shadow-[0_8px_0_0_hsl(35_80%_35%),0_12px_20px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                hover:shadow-[0_6px_0_0_hsl(35_80%_35%),0_10px_16px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                hover:translate-y-[2px]
                active:shadow-[0_2px_0_0_hsl(35_80%_35%),0_4px_8px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                active:translate-y-[6px]
                transition-all duration-100 ease-out
                animate-[arcade-pulse_2s_ease-in-out_infinite]"
            >
              <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
                Kick Off
              </span>
            </button>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="w-5 h-5" />
                <span>Create a profile to start</span>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="arcade-button group relative px-16 py-6 text-2xl font-black uppercase tracking-wider rounded-2xl
                  bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600
                  text-amber-950
                  shadow-[0_8px_0_0_hsl(35_80%_35%),0_12px_20px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                  hover:shadow-[0_6px_0_0_hsl(35_80%_35%),0_10px_16px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                  hover:translate-y-[2px]
                  active:shadow-[0_2px_0_0_hsl(35_80%_35%),0_4px_8px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                  active:translate-y-[6px]
                  transition-all duration-100 ease-out
                  animate-[arcade-pulse_2s_ease-in-out_infinite]"
              >
                <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
                  Create Profile
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelIntro;

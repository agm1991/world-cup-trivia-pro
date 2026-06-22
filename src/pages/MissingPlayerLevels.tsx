import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { Trophy, Lock, CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MissingPlayersPitchBanner } from '@/components/missing-player/MissingPlayersPitchBanner';
import { UNLOCK_ALL_LEVELS } from '@/lib/unlockAllLevels';

const MissingPlayerLevels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = useSafeBack('/categories');
  const { getCategoryStats, refreshGameStatsFromStorage, gameStats } = useLocalProfile();

  useEffect(() => {
    refreshGameStatsFromStorage();
  }, [refreshGameStatsFromStorage, location.key]);

  const categoryStats = getCategoryStats('missing-player' as Category);
  const levelProgress = gameStats['missing-player']?.levels ?? {};
  
  const handleLevelClick = (level: number) => {
    if (!UNLOCK_ALL_LEVELS && level > 1) {
      const prevLevelStats = levelProgress[level - 1];
      if (!prevLevelStats?.completed) {
        return;
      }
    }
    
    // Navigate to level intro first (like other game types)
    navigate(`/level/missing-player/${level}`);
  };

  const isLevelUnlocked = (level: number): boolean => {
    if (UNLOCK_ALL_LEVELS) return true;
    if (level === 1) return true;
    const prevLevelStats = levelProgress[level - 1];
    return prevLevelStats?.completed || false;
  };

  const getDifficultyLabel = (level: number): string => {
    if (level <= 12) return 'Easy';
    if (level <= 18) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (level: number): string => {
    // Levels 1-10 are all easy mode (green)
    if (level <= 10) return 'text-green-500';
    if (level <= 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="border-border hover:bg-muted shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
            <MissingPlayersPitchBanner />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent pt-2">
              Missing Players
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Guess the missing names on a chess-style pitch — historic World Cup starting XIs
            </p>
            
            {categoryStats && (
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-foreground">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="font-bold">{categoryStats.totalScore}</span>
                  <span className="text-muted-foreground text-sm">Total Score</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-bold">{categoryStats.highestLevel}</span>
                  <span className="text-muted-foreground text-sm">Highest Level</span>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Difficulty Sections */}
          {['Easy', 'Medium', 'Hard'].map((difficulty, sectionIndex) => {
            const startLevel = sectionIndex * 10 + 1;
            const endLevel = (sectionIndex + 1) * 10;
            
            return (
              <div key={difficulty} className="mb-8">
                <h2 className={`text-xl font-bold mb-4 ${getDifficultyColor(startLevel)}`}>
                  {difficulty} Mode (Levels {startLevel}-{endLevel})
                </h2>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                  {Array.from({ length: 10 }, (_, i) => startLevel + i).map((level) => {
                    const levelStats = levelProgress[level] ?? null;
                    const unlocked = isLevelUnlocked(level);
                    const completed = levelStats?.completed || false;
                    
                    return (
                      <button
                        key={level}
                        onClick={() => handleLevelClick(level)}
                        disabled={!unlocked && !completed}
                        className={`
                          relative aspect-square rounded-xl font-bold text-lg transition-all
                          ${completed
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 hover:scale-105'
                            : unlocked
                              ? 'bg-gradient-to-br from-primary/80 to-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl'
                              : 'bg-muted text-muted-foreground cursor-not-allowed'
                          }
                        `}
                      >
                        {completed || unlocked ? (
                          <>
                            <span>{level}</span>
                            {completed && (
                              <CheckCircle className="absolute top-1 right-1 h-4 w-4" />
                            )}
                            {levelStats?.bestScore && levelStats.bestScore > 0 && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-xs">
                                <Star className="h-3 w-3 fill-current" />
                                <span>{levelStats.bestScore}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <Lock className="h-5 w-5 mx-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default MissingPlayerLevels;
import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { Trophy, Lock, CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DESTINY_ROUTE_LEVEL_COUNT } from '@/data/destinyRouteQuestions';
import { WORLD_CUP_LEVEL_COUNT } from '@/data/worldCupLevelConfig';
import { BINGO_LEVEL_COUNT } from '@/data/worldCupBingoQuestions';
import { UNLOCK_ALL_LEVELS } from '@/lib/unlockAllLevels';

const categoryInfo: Record<string, { title: string; totalLevels: number }> = {
  'world-cup-bingo': { title: 'World Cup Bingo', totalLevels: BINGO_LEVEL_COUNT },
  'world-cup': { title: 'World Cup', totalLevels: WORLD_CUP_LEVEL_COUNT },
  'guess-scoreline': { title: 'Guess the Scoreline', totalLevels: 50 },
  'guess-who': { title: 'Guess Who I Am', totalLevels: 40 },
  'country-history': { title: 'Country History', totalLevels: 30 },
  'world-cup-winners': { title: 'World Cup Winners', totalLevels: 30 },
  'managers': { title: 'Managers', totalLevels: 30 },
  'stadiums': { title: 'Stadiums', totalLevels: 30 },
  'missing-player': { title: 'Missing Players', totalLevels: 30 },
  'destiny-route': { title: 'Destiny Route', totalLevels: DESTINY_ROUTE_LEVEL_COUNT },
};

const CategoryLevels = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const goBack = useSafeBack('/categories');
  const { category } = useParams<{ category: string }>();
  const { getCategoryStats, refreshGameStatsFromStorage, gameStats } = useLocalProfile();

  useEffect(() => {
    refreshGameStatsFromStorage();
  }, [refreshGameStatsFromStorage, category, location.key]);

  const info = categoryInfo[category || ''] || { title: 'Unknown', totalLevels: 30 };
  const categoryStats = getCategoryStats(category as Category);
  const levelProgress = gameStats[category as Category]?.levels ?? {};
  
  const handleLevelClick = (level: number) => {
    if (category === 'destiny-route') {
      window.location.href = `/destiny-route-game?level=${level}`;
      return;
    }

    if (!UNLOCK_ALL_LEVELS && level > 1) {
      const prevLevelStats = levelProgress[level - 1];
      if (!prevLevelStats?.completed) {
        return;
      }
    }

    navigate(`/level/${category}/${level}`);
  };

  const isLevelUnlocked = (level: number): boolean => {
    if (UNLOCK_ALL_LEVELS) return true;
    if (level === 1) return true;
    const prevLevelStats = levelProgress[level - 1];
    return prevLevelStats?.completed || false;
  };

  const sectionCount = Math.ceil(info.totalLevels / 10);
  const sectionTitles =
    category === 'world-cup' && info.totalLevels >= 50
      ? ['Easy', 'Medium', 'Hard', 'Ultimate', 'Finals']
      : category === 'guess-scoreline' && info.totalLevels >= 50
        ? ['Easy', 'Medium', 'Hard', 'Extra', 'Extra']
        : ['Easy', 'Medium', 'Hard'];

  const isWorldCupBingo = category === 'world-cup-bingo';

  const getDifficultyColor = (level: number): string => {
    if (category === 'world-cup' && info.totalLevels >= 50) {
      if (level <= 10) return 'text-green-500';
      if (level <= 20) return 'text-yellow-500';
      if (level <= 30) return 'text-orange-500';
      if (level <= 40) return 'text-purple-500';
      return 'text-amber-500';
    }
    if (category === 'guess-scoreline' && info.totalLevels >= 50) {
      if (level <= 10) return 'text-green-500';
      if (level <= 20) return 'text-yellow-500';
      if (level <= 30) return 'text-red-500';
      if (level <= 40) return 'text-orange-500';
      return 'text-rose-400';
    }
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
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {info.title}
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Select a level to play</p>
            
            {/* Stats Summary */}
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

          {/* Level grid: World Cup Bingo uses one neutral grid (no Easy/Medium/Hard sections). */}
          {isWorldCupBingo ? (
            <div className="mb-8">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 md:gap-3">
                {Array.from({ length: info.totalLevels }, (_, i) => i + 1).map((level) => {
                  const levelStats = levelProgress[level] ?? null;
                  const unlocked = isLevelUnlocked(level);
                  const completed = levelStats?.completed || false;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleLevelClick(level)}
                      disabled={!unlocked && !completed}
                      className={`
                          relative aspect-square rounded-xl font-bold text-base md:text-lg transition-all
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
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[10px] md:text-xs">
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
          ) : (
            Array.from({ length: sectionCount }, (_, sectionIndex) => {
              const startLevel = sectionIndex * 10 + 1;
              const endLevel = Math.min((sectionIndex + 1) * 10, info.totalLevels);
              const difficulty = sectionTitles[sectionIndex] ?? `Levels ${startLevel}–${endLevel}`;

              if (startLevel > info.totalLevels) {
                return null;
              }

              const levelCount = endLevel - startLevel + 1;

              return (
                <div key={`${difficulty}-${startLevel}`} className="mb-8">
                  <h2 className={`text-xl font-bold mb-4 ${getDifficultyColor(startLevel)}`}>
                    {difficulty} Mode (Levels {startLevel}-{endLevel})
                  </h2>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                    {Array.from({ length: levelCount }, (_, i) => startLevel + i).map((level) => {
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
            })
          )}

        </div>
      </div>
    </div>
  );
};

export default CategoryLevels;

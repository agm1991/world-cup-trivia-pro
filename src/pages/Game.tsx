import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, Trophy, RotateCcw } from 'lucide-react';
import { Category, Question } from '@/types/game';
import { sampleQuestions, easyModeQuestions } from '@/data/questions';
import { getWinnersQuestionsByLevel } from '@/data/winnersQuestions';
import { getManagersQuestionsByLevel } from '@/data/managersQuestions';
import { getStadiumsQuestionsByLevel } from '@/data/stadiumsQuestions';
import { getGuessWhoQuestionsByLevel } from '@/data/guessWhoQuestions';
import { getScorelineQuestionsByLevel } from '@/data/scorelineQuestions';
import { getMissingPlayerQuestionsByLevel } from '@/data/missingPlayerQuestions';
import { getAllCountryQuestionsByLevel } from '@/data/countryHistoryQuestions';
import { getWorldCupQuestionsByLevel } from '@/data/worldCupQuestions';
import { getWorldCupBingoQuestionsByLevel } from '@/data/worldCupBingoQuestions';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import {
  ScorelineMatchHeading,
  parseYearFromScorelineQuestionId,
  inferScorelineResultNote,
} from '@/components/ScorelineMatchHeading';
import { useRequireProfile } from '@/hooks/useRequireProfile';
import { ProfileModal } from '@/components/ProfileModal';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { useSafeBack } from '@/hooks/useSafeBack';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { ShareMyScoreSection } from '@/components/ShareMyScoreSection';
import { cn, stripUiParentheticals } from '@/lib/utils';
import {
  applyQuizCorrectScore,
  meetsPerfectQuizLevelCompletion,
  normalizeQuizQuestionsForLevel,
  shouldFailQuizLevelAfterWrong,
} from '@/lib/quizLevelRules';
import {
  clearWorldCupHintsUsed,
  getWorldCupHintScope,
  readWorldCupHintsUsed,
  writeWorldCupHintsUsed,
} from '@/lib/worldCupHintRules';
import {
  clearGuessWhoHintsUsed,
  getGuessWhoHintScope,
  readGuessWhoHintsUsed,
  writeGuessWhoHintsUsed,
} from '@/lib/guessWhoHintRules';
import {
  clearScorelineHintsUsed,
  getScorelineHintScope,
  readScorelineHintsUsed,
  writeScorelineHintsUsed,
} from '@/lib/scorelineHintRules';
import {
  clearWorldCupBingoHintsUsed,
  getWorldCupBingoHintScope,
  readWorldCupBingoHintsUsed,
  writeWorldCupBingoHintsUsed,
} from '@/lib/worldCupBingoHintRules';
import { parseMissingPlayerPromptForBingo } from '@/lib/missingPlayerBingoPrompt';
import { BingoMissingPlayerLineup } from '@/components/missing-player/BingoMissingPlayerLineup';
import { GuessWhoPhotoCard } from '@/components/guess-who/GuessWhoPhotoCard';
import {
  isGuessWhoPhotoQuestion,
  resolveGuessWhoDisplayImage,
} from '@/lib/guessWhoImageResolve';
import { recordFastestTimerRun } from '@/lib/fastestTimerRun';
import {
  formatBingoPlainQuestion,
  isBingoScorelineQuestion,
  resolveScorelinePresentation,
} from '@/lib/scorelinePresentation';

const TIMER_DURATION = 15;

type ScopedHintConfig = {
  maxHints: number;
  scopeKey: string;
  perLevelCap: number;
  read: (scopeKey: string) => number;
  write: (scopeKey: string, used: number) => void;
  clear: (scopeKey: string) => void;
};

function getScopedHintConfig(category: Category | undefined, level: number): ScopedHintConfig | null {
  if (category === 'world-cup') {
    const scope = getWorldCupHintScope(level);
    return {
      ...scope,
      perLevelCap: 25,
      read: readWorldCupHintsUsed,
      write: writeWorldCupHintsUsed,
      clear: clearWorldCupHintsUsed,
    };
  }
  if (category === 'guess-who') {
    const scope = getGuessWhoHintScope(level);
    return {
      ...scope,
      perLevelCap: 20,
      read: readGuessWhoHintsUsed,
      write: writeGuessWhoHintsUsed,
      clear: clearGuessWhoHintsUsed,
    };
  }
  if (category === 'guess-scoreline') {
    const scope = getScorelineHintScope(level);
    return {
      ...scope,
      perLevelCap: 25,
      read: readScorelineHintsUsed,
      write: writeScorelineHintsUsed,
      clear: clearScorelineHintsUsed,
    };
  }
  if (category === 'world-cup-bingo') {
    const scope = getWorldCupBingoHintScope(level);
    return {
      ...scope,
      perLevelCap: 204,
      read: (scopeKey) => readWorldCupBingoHintsUsed(scopeKey, scope.maxHints),
      write: (scopeKey, used) => writeWorldCupBingoHintsUsed(scopeKey, used, scope.maxHints),
      clear: clearWorldCupBingoHintsUsed,
    };
  }
  return null;
}

function levelCompleteTitle(category: string): string {
  const labels: Record<string, string> = {
    'world-cup': 'World Cup',
    'guess-who': 'Guess Who',
    'guess-scoreline': 'Scoreline',
    'world-cup-winners': 'World Cup Winners',
    managers: 'Managers',
    stadiums: 'Stadiums',
    'missing-player': 'Missing Player',
    'world-cup-bingo': 'World Cup Bingo',
    'country-history': 'Country History',
    'destiny-route': 'Destiny Route',
  };
  return labels[category] ?? category;
}

function worldCupDifficultyLabel(level: number, difficulty: string | undefined): string {
  if (level <= 10) return 'Easy';
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
    case 'tricky':
      return 'Medium';
    case 'hard':
      return 'Hard';
    case 'ultimate':
      return 'Ultimate';
    default:
      return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Quiz';
  }
}

const Game = () => {
  const { category } = useParams<{ category: Category }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const goBack = useSafeBack(category ? `/levels/${category}` : '/categories');
  const { isProfileHydrated, hasProfile } = useRequireProfile();
  const { showProfileModal, setShowProfileModal, saveLevelStats, recordGameCompletion } = useLocalProfile();

  const rawLevel = parseInt(searchParams.get('level') || '1', 10);
  const currentLevel = Number.isFinite(rawLevel) ? Math.max(1, rawLevel) : 1;
  const timerEnabled = searchParams.get('timer') === 'true';

  const isGuessScorelineMode = category === 'guess-scoreline';
  const isWorldCupCategory = category === 'world-cup';
  const isWorldCupBingo = category === 'world-cup-bingo';
  const scorelineFeatured = isGuessScorelineMode && currentLevel <= 50;
  const scopedHintConfig = getScopedHintConfig(category, currentLevel);
  const hintMax = scopedHintConfig?.maxHints ?? 3;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [removedOptions, setRemovedOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const wrongAttemptsRef = useRef(0);
  const scoredQuestionIndicesRef = useRef<Set<number>>(new Set());
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completionSavedKeyRef = useRef<string | null>(null);
  const levelTimerStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  useEffect(() => {
    if (scopedHintConfig) {
      setHintsUsed(scopedHintConfig.read(scopedHintConfig.scopeKey));
    } else {
      setHintsUsed(0);
    }
  }, [category, currentLevel]);

  useEffect(() => {
    levelTimerStartRef.current = null;
  }, [category, currentLevel]);

  useEffect(() => {
    if (timerEnabled && questions.length > 0 && !gameComplete && levelTimerStartRef.current === null) {
      levelTimerStartRef.current = Date.now();
    }
  }, [timerEnabled, questions.length, gameComplete]);

  useEffect(() => {
    if (!gameComplete || !category) return;
    if (!meetsPerfectQuizLevelCompletion(questions.length, score)) return;
    const key = `${category}:${currentLevel}`;
    if (completionSavedKeyRef.current === key) return;
    completionSavedKeyRef.current = key;
    if (timerEnabled && levelTimerStartRef.current != null && category) {
      const elapsedSec = Math.max(1, Math.floor((Date.now() - levelTimerStartRef.current) / 1000));
      recordFastestTimerRun(elapsedSec, category);
    }
    saveLevelStats(category as Category, currentLevel, score, true);
    recordGameCompletion({
      title: `${levelCompleteTitle(category)} — Level ${currentLevel}`,
      score,
      detail: 'Category quiz',
    });
    toast.success('Results saved to profile');
  }, [gameComplete, category, currentLevel, score, questions.length, timerEnabled, saveLevelStats, recordGameCompletion]);

  useEffect(() => {
    // Load questions based on category and level
    let categoryQuestions: Question[] = [];
    
    switch (category) {
      case 'world-cup-bingo':
        categoryQuestions = getWorldCupBingoQuestionsByLevel(currentLevel);
        break;
      case 'world-cup-winners':
        categoryQuestions = getWinnersQuestionsByLevel(currentLevel);
        break;
      case 'managers':
        categoryQuestions = getManagersQuestionsByLevel(currentLevel);
        break;
      case 'stadiums':
        categoryQuestions = getStadiumsQuestionsByLevel(currentLevel);
        break;
      case 'guess-who':
        categoryQuestions = getGuessWhoQuestionsByLevel(currentLevel);
        break;
      case 'guess-scoreline':
        categoryQuestions = getScorelineQuestionsByLevel(currentLevel);
        break;
      case 'missing-player':
        categoryQuestions = getMissingPlayerQuestionsByLevel(currentLevel);
        break;
      case 'country-history':
        categoryQuestions = getAllCountryQuestionsByLevel(currentLevel);
        break;
      case 'world-cup':
      default:
        // Use proper world cup questions by level
        categoryQuestions = getWorldCupQuestionsByLevel(currentLevel);
        break;
    }
    
    const normalized =
      categoryQuestions.length >= 10 ? normalizeQuizQuestionsForLevel(categoryQuestions) : [];
    setQuestions(normalized);
    scoredQuestionIndicesRef.current = new Set();
  }, [category, currentLevel]);

  const retryCurrentQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeRemaining(TIMER_DURATION);
  }, []);

  const failLevelAfterWrong = useCallback(() => {
    toast.error('Wrong answer!');
    setTimeout(() => {
      setShowGameOver(true);
    }, 1000);
  }, []);

  const handleWrongAttempt = useCallback(() => {
    const next = wrongAttemptsRef.current + 1;
    wrongAttemptsRef.current = next;
    if (shouldFailQuizLevelAfterWrong(next)) {
      failLevelAfterWrong();
    } else {
      toast.error('Wrong answer! One more try.');
      setTimeout(retryCurrentQuestion, 1000);
    }
  }, [failLevelAfterWrong, retryCurrentQuestion]);

  // Timer logic
  const handleTimeout = useCallback(() => {
    if (!showResult && !gameComplete) {
      toast.error('Time\'s up!');
      setShowResult(true);
      handleWrongAttempt();
    }
  }, [showResult, gameComplete, handleWrongAttempt]);

  useEffect(() => {
    if (timerEnabled && !showResult && !gameComplete && questions.length > 0) {
      setTimeRemaining(TIMER_DURATION);
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [timerEnabled, currentQuestionIndex, showResult, gameComplete, questions.length, handleTimeout]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const { score: nextScore, pointsAwarded } = applyQuizCorrectScore(
        currentQuestionIndex,
        score,
        scoredQuestionIndicesRef.current,
      );
      setScore(nextScore);
      toast.success(
        pointsAwarded > 0 ? `Correct! +${pointsAwarded} points` : 'Correct!',
        {
        icon: <Trophy className="h-4 w-4 text-primary" />,
      },
      );
      
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          resetQuestionState();
        } else {
          if (meetsPerfectQuizLevelCompletion(totalQuestions, nextScore)) {
            setGameComplete(true);
          }
        }
      }, 1000);
    } else {
      handleWrongAttempt();
    }
  };

  const resetQuestionState = () => {
    setShowHint(false);
    setCurrentHint('');
    setRemovedOptions([]);
    if (!scopedHintConfig) {
      setHintsUsed(0);
    }
    setSelectedAnswer(null);
    setShowResult(false);
    wrongAttemptsRef.current = 0;
    setTimeRemaining(TIMER_DURATION);
  };

  const restartLevel = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setShowGameOver(false);
    if (scopedHintConfig && currentLevel <= scopedHintConfig.perLevelCap) {
      scopedHintConfig.clear(scopedHintConfig.scopeKey);
      setHintsUsed(0);
    }
    resetQuestionState();
  };

  const devNavigatePrev = () => {
    if (currentQuestionIndex <= 0) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetQuestionState();
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const devNavigateNext = () => {
    if (currentQuestionIndex >= totalQuestions - 1) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    resetQuestionState();
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const useHint = () => {
    if (hintsUsed < hintMax && currentQuestion) {
      const hintNumber = hintsUsed + 1;
      let hint = '';
      
      if (hintNumber === 1) hint = currentQuestion.hint1;
      else if (hintNumber === 2) hint = currentQuestion.hint2;
      else hint = currentQuestion.hint3;

      setCurrentHint(hint);
      setShowHint(true);
      const nextUsed = hintsUsed + 1;
      setHintsUsed(nextUsed);
      if (scopedHintConfig) {
        scopedHintConfig.write(scopedHintConfig.scopeKey, nextUsed);
      }

      // Remove one wrong option
      const options = ['A', 'B', 'C', 'D'];
      const wrongOptions = options.filter(
        opt => opt !== currentQuestion.correctAnswer && !removedOptions.includes(opt)
      );
      if (wrongOptions.length > 0) {
        const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        setRemovedOptions([...removedOptions, randomWrong]);
      }
    }
  };

  // Get timer bar color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 10) return 'bg-green-500';
    if (timeRemaining > 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTimerTextColor = () => {
    if (timeRemaining > 10) return 'text-green-500';
    if (timeRemaining > 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (!isProfileHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
        <p className="text-foreground">Please create a profile to play...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading questions...</p>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center border-border rounded-2xl">
          <Trophy className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Level {currentLevel} Complete!</h2>
          <div className="bg-muted rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold text-primary">{score}</p>
            <p className="text-muted-foreground">Total Points</p>
          </div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">Results saved to your profile</p>
          <ShareMyScoreSection score={score} />
          <div className="space-y-3">
            <Button 
              onClick={() => navigate(`/level/${category}/${currentLevel + 1}`)} 
              className="w-full premium-button rounded-xl" 
              size="lg"
            >
              Next Level
            </Button>
            <Button onClick={restartLevel} variant="outline" className="w-full rounded-xl border-border" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            <Button 
              onClick={goBack} 
              variant="outline" 
              className="w-full rounded-xl border-border"
              size="lg"
            >
              Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const options = [
    { label: 'A', text: currentQuestion.optionA },
    { label: 'B', text: currentQuestion.optionB },
    { label: 'C', text: currentQuestion.optionC },
    { label: 'D', text: currentQuestion.optionD },
  ];

  const bingoSource = isWorldCupBingo ? currentQuestion.sourceCategory : undefined;

  const bingoMissingLineupParsed =
    isWorldCupBingo && bingoSource === 'missing-player'
      ? parseMissingPlayerPromptForBingo(currentQuestion.question)
      : null;

  /** Show pitch UI whenever this row is a parseable missing-player prompt (never hide header). */
  const useBingoMissingLineup = Boolean(bingoMissingLineupParsed);

  const bingoScorelineCandidate =
    isWorldCupBingo && !useBingoMissingLineup && isBingoScorelineQuestion(currentQuestion);

  const isGuessWhoContext =
    currentQuestion.category === 'guess-who' ||
    (isWorldCupBingo &&
      (bingoSource === 'guess-who' ||
        bingoSource === 'guess-who-photo' ||
        isGuessWhoPhotoQuestion(currentQuestion)));

  const guessWhoImageUrl = isGuessWhoContext
    ? resolveGuessWhoDisplayImage(currentQuestion)
    : undefined;

  const showGuessWhoPhoto = Boolean(isGuessWhoContext && guessWhoImageUrl);

  const bingoScorelinePresentation = bingoScorelineCandidate
    ? resolveScorelinePresentation(currentQuestion)
    : null;

  const bingoScorelineStyle =
    bingoScorelineCandidate && bingoScorelinePresentation?.matchupComplete === true;

  const bingoPlainQuestion =
    isWorldCupBingo && !bingoScorelineStyle && !useBingoMissingLineup
      ? formatBingoPlainQuestion(currentQuestion.question)
      : currentQuestion.question;

  const bingoOptionsMissingPlayer =
    isWorldCupBingo && (useBingoMissingLineup || bingoSource === 'missing-player');

  const getOptionStyle = (option: string) => {
    if (removedOptions.includes(option)) {
      return 'opacity-30 cursor-not-allowed';
    }
    if (!showResult) {
      return 'hover:border-primary hover:bg-primary/10';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-500/20';
    }
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-500/20';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <GameOverModal 
        isOpen={showGameOver} 
        onRestart={restartLevel}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onBack={goBack}
      />
      <div className="max-w-4xl mx-auto">
        {/* Timer Bar */}
        {timerEnabled && !showResult && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${getTimerTextColor()}`}>
                ⏱️ {timeRemaining}s
              </span>
              <span className="text-xs text-muted-foreground">Time Remaining</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${getTimerColor()}`}
                style={{ width: `${(timeRemaining / TIMER_DURATION) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

          {/* Stats */}
          <div className="flex items-center gap-6 text-foreground">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary fill-primary" />
              <span className="font-bold">{hintMax - hintsUsed}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary fill-primary" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-foreground text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            {category !== 'world-cup-bingo' && (
              <span className="uppercase text-xs bg-primary px-2 py-1 rounded text-primary-foreground font-bold">
                {category === 'world-cup'
                  ? worldCupDifficultyLabel(currentLevel, currentQuestion.difficulty)
                  : isGuessScorelineMode
                    ? currentLevel <= 10
                      ? 'Easy'
                      : currentLevel <= 20
                        ? 'Medium'
                        : currentLevel <= 30
                          ? 'Hard'
                          : currentLevel <= 40
                            ? 'Medium'
                            : 'Hard'
                    : currentLevel <= 10
                      ? 'Easy'
                      : currentQuestion.difficulty}
              </span>
            )}
          </div>
          <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2 bg-muted" />
        </div>

        {/* Question Card */}
        <Card
          className={cn(
            'mb-6 shadow-card border-border rounded-2xl',
            isGuessScorelineMode || bingoScorelineStyle || useBingoMissingLineup
              ? 'p-5 md:p-6'
              : 'p-8',
          )}
        >
          {/* Question Text */}
          {currentQuestion.question && !useBingoMissingLineup && (
            <div
              className={cn(
                isGuessScorelineMode || bingoScorelineStyle ? 'mb-5' : 'mb-8',
              )}
            >
              {isGuessScorelineMode ? (
                <ScorelineMatchHeading
                  question={currentQuestion.question}
                  year={scorelineFeatured ? parseYearFromScorelineQuestionId(currentQuestion.id) : undefined}
                  resultNote={scorelineFeatured ? inferScorelineResultNote(currentQuestion) : undefined}
                  teamsClassName="leading-relaxed"
                />
              ) : bingoScorelineStyle && bingoScorelinePresentation ? (
                <ScorelineMatchHeading
                  question={bingoScorelinePresentation.headingQuestion}
                  year={bingoScorelinePresentation.year ?? undefined}
                  matchDate={bingoScorelinePresentation.matchDate ?? undefined}
                  resultNote={inferScorelineResultNote(currentQuestion)}
                  teamsClassName="leading-relaxed"
                />
              ) : (
                <h2 className="text-3xl font-bold text-foreground leading-relaxed normal-case">
                  {bingoPlainQuestion}
                </h2>
              )}
            </div>
          )}

          {useBingoMissingLineup && bingoMissingLineupParsed && (
            <div className="mb-5">
              <BingoMissingPlayerLineup
                parsed={bingoMissingLineupParsed}
                question={currentQuestion}
              />
            </div>
          )}

          {showGuessWhoPhoto && <GuessWhoPhotoCard question={currentQuestion} />}

          {/* Options */}
          <div
            className={cn(
              bingoOptionsMissingPlayer && 'grid grid-cols-2 gap-3',
              bingoScorelineStyle && 'grid grid-cols-1 md:grid-cols-2 gap-4',
              !bingoOptionsMissingPlayer && !bingoScorelineStyle && 'space-y-4',
            )}
          >
            {options.map((option) => {
              const isRemoved = removedOptions.includes(option.label);
              const optionText = stripUiParentheticals(option.text);

              return (
                <Button
                  key={option.label}
                  onClick={() => !isRemoved && !showResult && handleAnswer(option.label)}
                  disabled={isRemoved || showResult}
                  className={cn(
                    'w-full transition-all border border-border',
                    bingoOptionsMissingPlayer
                      ? 'h-auto py-3 px-4 justify-start rounded-lg bg-card/50 text-sm'
                      : bingoScorelineStyle
                        ? 'h-auto py-4 px-6 text-left justify-start rounded-xl'
                        : 'text-left justify-start h-auto py-4 px-6 text-lg rounded-xl',
                    getOptionStyle(option.label),
                  )}
                  variant="outline"
                >
                  <span
                    className={cn(
                      'font-bold text-primary',
                      bingoOptionsMissingPlayer ? 'mr-2' : bingoScorelineStyle ? 'mr-3' : 'mr-4',
                    )}
                  >
                    {option.label}.
                  </span>
                  <span className={cn(bingoOptionsMissingPlayer && 'text-foreground')}>
                    {optionText}
                  </span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Hint Section */}
        <div className="space-y-4">
          <Button
            onClick={useHint}
            disabled={hintsUsed >= hintMax || showResult}
            className="w-full premium-button rounded-xl"
            size="lg"
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Need a Hint? ({hintMax - hintsUsed} remaining)
          </Button>

          {showHint && (
            <Card className="p-4 bg-primary/10 border-primary/30 rounded-xl">
              <p className="text-sm flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">
                  {isWorldCupBingo && currentHint
                    ? formatBingoPlainQuestion(currentHint)
                    : currentHint}
                </span>
              </p>
            </Card>
          )}
        </div>

        <SafeDevQuestionNav
          currentIndex={currentQuestionIndex}
          totalCount={totalQuestions}
          onPrevious={devNavigatePrev}
          onNext={devNavigateNext}
        />
      </div>
    </div>
  );
};

export default Game;

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, Trophy, RotateCcw } from 'lucide-react';
import { Question, Category } from '@/types/game';
import {
  allPlayers,
  getPlayerFlatQuizQuestions,
  getPlayerFullLevelCount,
  getPlayerQuestionsByLevel,
  getPlayerWorldCupYearForLevel,
  getPlayerWorldCupYearsForLevelsSorted,
  getPlayerWorldCupYearsSorted,
} from '@/data/playerQuestions';
import { getWorldCupHostKickoffLabel } from '@/lib/worldCupHosts';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import { useRequireProfile } from '@/hooks/useRequireProfile';
import { ProfileModal } from '@/components/ProfileModal';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Navigation } from '@/components/Navigation';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { stripUiParentheticals } from '@/lib/utils';
import {
  applyQuizCorrectScore,
  meetsPerfectQuizLevelCompletion,
  normalizeQuizQuestionsForLevel,
  shouldFailQuizLevelAfterWrong,
} from '@/lib/quizLevelRules';

const PlayerGame = () => {
  const { playerId, level } = useParams<{ playerId: string; level?: string }>();
  const navigate = useNavigate();
  const goBack = useSafeBack(playerId ? `/player-levels/${playerId}` : '/levels/player');
  const { isProfileHydrated, hasProfile } = useRequireProfile();
  const { showProfileModal, setShowProfileModal, saveLevelStats, recordGameCompletion } = useLocalProfile();

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
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const completionSavedKeyRef = useRef<string | null>(null);
  const scoredQuestionIndicesRef = useRef<Set<number>>(new Set());

  const player = allPlayers.find(p => p.id === playerId);
  const currentLevel = level ? parseInt(level, 10) : 1; // Default to level 1 if not specified

  const levelTournamentYear =
    playerId && currentLevel >= 1 ? getPlayerWorldCupYearForLevel(playerId, currentLevel) : undefined;
  const levelTournamentLine =
    levelTournamentYear != null
      ? `${levelTournamentYear} — ${getWorldCupHostKickoffLabel(levelTournamentYear)}`
      : undefined;
  const maxPlayerLevel = playerId ? getPlayerFullLevelCount(playerId) : 0;
  const wcYearsSorted = playerId ? getPlayerWorldCupYearsSorted(playerId) : [];
  const wcYearsForLevels = playerId ? getPlayerWorldCupYearsForLevelsSorted(playerId) : [];
  const maxNavLevel =
    maxPlayerLevel >= 1
      ? maxPlayerLevel
      : wcYearsForLevels.length > 1
        ? wcYearsForLevels.length
        : wcYearsSorted.length > 1
          ? wcYearsSorted.length
          : 5;

  const retryCurrentQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const resetQuestionState = () => {
    setShowHint(false);
    setCurrentHint('');
    setRemovedOptions([]);
    setHintsUsed(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setWrongAttempts(0);
  };

  useEffect(() => {
    if (playerId) {
      try {
        // Get questions for the specific level (usually up to 10; thin pools can be shorter)
        let playerQuestions = getPlayerQuestionsByLevel(playerId, currentLevel);
        const wcYears = getPlayerWorldCupYearsForLevelsSorted(playerId);
        const thinMultiYear =
          getPlayerFullLevelCount(playerId) < 1 &&
          wcYears.length > 1 &&
          currentLevel >= 1 &&
          currentLevel <= wcYears.length;
        if (playerQuestions.length === 0 && !thinMultiYear) {
          playerQuestions = getPlayerFlatQuizQuestions(playerId);
        }

        if (playerQuestions && playerQuestions.length > 0) {
          setQuestions(normalizeQuizQuestionsForLevel(playerQuestions));
          // Reset question index when level changes
          setCurrentQuestionIndex(0);
          setScore(0);
          setShowResult(false);
          setGameComplete(false);
          setShowGameOver(false);
          scoredQuestionIndicesRef.current = new Set();
          resetQuestionState();
        } else {
          console.error('PlayerGame - No questions found:', { playerId, currentLevel });
          setQuestions([]);
        }
      } catch (error) {
        console.error('PlayerGame - Error loading questions:', error);
        setQuestions([]);
      }
    } else {
      console.error('PlayerGame - No playerId provided');
    }
  }, [playerId, currentLevel]);

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  // Save stats when level is completed
  useEffect(() => {
    if (!gameComplete || !playerId) return;
    if (!meetsPerfectQuizLevelCompletion(questions.length, score)) return;
    const key = `${playerId}:${currentLevel}`;
    if (completionSavedKeyRef.current === key) return;
    completionSavedKeyRef.current = key;
    const categoryKey = `player-${playerId}` as Category;
    saveLevelStats(categoryKey, currentLevel, score, true);
    recordGameCompletion({
      title: `${player?.name ?? playerId} — Level ${currentLevel}`,
      score,
      detail: 'Players mode',
    });
    toast.success('Results saved to profile');
  }, [gameComplete, playerId, currentLevel, score, questions.length, saveLevelStats, recordGameCompletion, player?.name]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
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
      const nextAttempts = wrongAttempts + 1;
      setWrongAttempts(nextAttempts);
      if (shouldFailQuizLevelAfterWrong(nextAttempts)) {
        toast.error('Wrong answer!');
        setTimeout(() => setShowGameOver(true), 1000);
      } else {
        toast.error('Wrong answer! One more try.');
        setTimeout(retryCurrentQuestion, 1000);
      }
    }
  };

  const restartLevel = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setShowGameOver(false);
    resetQuestionState();
  };

  const devNavigatePrev = () => {
    if (currentQuestionIndex <= 0) return;
    resetQuestionState();
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const devNavigateNext = () => {
    if (currentQuestionIndex >= totalQuestions - 1) return;
    resetQuestionState();
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const useHint = () => {
    if (hintsUsed < 3 && currentQuestion) {
      const hintNumber = hintsUsed + 1;
      let hint = '';
      
      if (hintNumber === 1) hint = currentQuestion.hint1;
      else if (hintNumber === 2) hint = currentQuestion.hint2;
      else hint = currentQuestion.hint3;

      setCurrentHint(hint);
      setShowHint(true);
      setHintsUsed(hintsUsed + 1);

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

  if (!isProfileHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
          <p className="text-foreground">Please create a profile to play...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground text-xl mb-2">Player not found</p>
            <p className="text-muted-foreground mb-4">Player ID: {playerId}</p>
            <Button onClick={goBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground text-xl mb-2">No questions found</p>
            <p className="text-muted-foreground mb-2">Player: {player?.name || playerId}, Level: {currentLevel}</p>
            <p className="text-muted-foreground text-sm mb-4">Please check the console for details</p>
            <Button onClick={() => navigate(`/player-levels/${playerId}`)} variant="outline" className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Levels
            </Button>
            <Button onClick={() => navigate('/levels/player')} variant="outline">
              Choose Another Player
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground text-xl mb-2">Loading question...</p>
            <p className="text-muted-foreground">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            <p className="text-muted-foreground text-sm mt-4">Player: {player?.name}, Level: {currentLevel}</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center border-border rounded-2xl">
          <Trophy className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-2">Level {currentLevel} Complete!</h2>
          <p className="text-muted-foreground mb-6">You finished {player.name}'s Level {currentLevel}</p>
          <div className="bg-muted rounded-xl p-6 mb-6">
            <p className="text-5xl font-bold text-primary">{score}</p>
            <p className="text-muted-foreground">Total Coins</p>
          </div>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">Results saved to your profile</p>
          <div className="space-y-3">
            <Button onClick={restartLevel} className="w-full premium-button rounded-xl" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            {currentLevel < maxNavLevel && (
              <Button
                onClick={() => navigate(`/player-game/${playerId}/${currentLevel + 1}`)}
                className="w-full premium-button rounded-xl"
                size="lg"
              >
                Next Level ({currentLevel + 1})
              </Button>
            )}
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <GameOverModal 
          isOpen={showGameOver} 
          onRestart={restartLevel}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          onBack={goBack}
        />
      <div className="max-w-4xl mx-auto">
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

          <div className="text-center">
            <h2 className="text-lg font-bold text-foreground">{player.name}</h2>
            <p className="text-sm text-muted-foreground">{player.country}</p>
            {levelTournamentLine ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{levelTournamentLine}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                World Cup finals: {player.worldCupYears?.join(', ') ?? '—'}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-foreground">
            <div className="flex items-center gap-1">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span className="font-bold">{3 - hintsUsed}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-5 w-5 text-primary fill-primary" />
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-foreground text-sm mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2 bg-muted" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 shadow-card border-border rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            {stripUiParentheticals(currentQuestion.question)}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option) => {
              const isRemoved = removedOptions.includes(option.label);

              return (
                <Button
                  key={option.label}
                  onClick={() => !isRemoved && !showResult && handleAnswer(option.label)}
                  disabled={isRemoved || showResult}
                  className={`w-full whitespace-normal break-words text-left justify-start items-start h-auto min-h-[3.5rem] py-4 px-6 text-lg leading-snug gap-3 transition-all rounded-xl border border-border ${getOptionStyle(option.label)}`}
                  variant="outline"
                >
                  <span className="font-bold shrink-0 text-primary pt-0.5">{option.label}.</span>
                  <span className="min-w-0 flex-1 text-left">{stripUiParentheticals(option.text)}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Hint Section */}
        <div className="space-y-4">
          <Button
            onClick={useHint}
            disabled={hintsUsed >= 3 || showResult}
            className="w-full premium-button rounded-xl"
            size="lg"
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Need a Hint? {3 - hintsUsed} remaining
          </Button>

          {showHint && (
            <Card className="p-4 bg-primary/10 border-primary/30 rounded-xl">
              <p className="text-sm flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{currentHint}</span>
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
    </div>
  );
};

export default PlayerGame;

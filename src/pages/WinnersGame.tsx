import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { getCampaignQuestions, CampaignQuestion } from '@/data/campaignQuestions';
import { WORLD_CUP_WINNER_COUNTRY_THEMES } from '@/data/worldCupWinnersCountryThemes';
import { Category } from '@/types/game';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { stableLevelFromKey } from '@/lib/recentCompletionsStorage';
import { applyQuizCorrectScore, meetsPerfectQuizLevelCompletion, shouldFailQuizLevelAfterWrong } from '@/lib/quizLevelRules';
import { stripUiParentheticals } from '@/lib/utils';

const WinnersGame = () => {
  const { country, year } = useParams();
  const countrySlug = (country || '').toLowerCase();
  const theme =
    WORLD_CUP_WINNER_COUNTRY_THEMES[countrySlug] ?? WORLD_CUP_WINNER_COUNTRY_THEMES.brazil;
  const goBack = useSafeBack(
    countrySlug ? `/world-cup-winners/${countrySlug}` : '/world-cup-winners'
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const completionSavedKeyRef = useRef<string | null>(null);
  const scoredQuestionIndicesRef = useRef<Set<number>>(new Set());
  const { saveLevelStats, recordGameCompletion } = useLocalProfile();

  const rawQuestions = getCampaignQuestions(country || '', Number(year) || 0);
  /** Exactly 10 questions required for a completable level. */
  const questions = rawQuestions.length >= 10 ? rawQuestions.slice(0, 10) : [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const countryDisplay = country ? country.charAt(0).toUpperCase() + country.slice(1) : '';

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  useEffect(() => {
    if (!gameComplete || !country) return;
    if (!meetsPerfectQuizLevelCompletion(totalQuestions, score)) return;
    const y = Number(year) || 0;
    const routeKey = `${countrySlug}-${y}`;
    if (completionSavedKeyRef.current === routeKey) return;
    completionSavedKeyRef.current = routeKey;
    const levelSlot = stableLevelFromKey(routeKey);
    saveLevelStats('world-cup-winners' as Category, levelSlot, score, true);
    recordGameCompletion({
      title: `${countryDisplay || country} ${y || ''}`.trim(),
      score,
      detail: 'World Cup Winners',
    });
    toast.success('Results saved to profile');
  }, [
    gameComplete,
    country,
    countrySlug,
    year,
    score,
    totalQuestions,
    saveLevelStats,
    recordGameCompletion,
    countryDisplay,
  ]);

  const handleAnswer = (answer: string) => {
    if (showResult || !currentQuestion) return;
    
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
      toast.success(pointsAwarded > 0 ? `Correct! +${pointsAwarded} points` : 'Correct!');
      
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
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowResult(false);
        }, 1000);
      }
    }
  };

  const useHint = () => {
    if (hintsUsed >= 3 || !currentQuestion) return;
    
    const hints = [currentQuestion.hint1, currentQuestion.hint2, currentQuestion.hint3];
    setCurrentHint(hints[hintsUsed]);
    setShowHint(true);
    
    const options = ['A', 'B', 'C', 'D'];
    const wrongOptions = options.filter(o => o !== currentQuestion.correctAnswer && !disabledOptions.includes(o));
    if (wrongOptions.length > 0) {
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setDisabledOptions([...disabledOptions, randomWrong]);
    }
    
    setHintsUsed(hintsUsed + 1);
  };

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHintsUsed(0);
    setCurrentHint('');
    setShowHint(false);
    setDisabledOptions([]);
    setWrongAttempts(0);
  };

  const restartLevel = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setShowGameOver(false);
    resetQuestionState();
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setGameComplete(false);
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

  const getOptionStyle = (option: string) => {
    if (!currentQuestion) return '';
    if (disabledOptions.includes(option)) {
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

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 pointer-events-none" style={{ background: theme.bg }} />
        <div className="stadium-lights" />
        <Navigation />
        <div className="relative z-10 flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Trophy className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Level Complete!</h1>
            <p className="text-xl text-muted-foreground mb-2">{countryDisplay} {year} Campaign</p>
            <p className="text-2xl text-primary mb-2">Final Score: {score} points</p>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-8">Results saved to your profile</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={restartGame} className="gap-2">
                <RotateCcw className="w-4 h-4" /> Play Again
              </Button>
              <Button variant="outline" onClick={goBack}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (totalQuestions === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 pointer-events-none" style={{ background: theme.bg }} />
        <div className="stadium-lights" />
        <Navigation />
        <div className="relative z-10 flex-1 py-8 px-4 text-center max-w-md mx-auto space-y-4">
          <p className="text-muted-foreground">
            No quiz is available for this campaign yet. Try another winning year from the list.
          </p>
          <Button variant="outline" onClick={goBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none" style={{ background: theme.bg }} />
      <div className="stadium-lights" />
      <Navigation />
      <GameOverModal
        isOpen={showGameOver}
        onRestart={restartLevel}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onBack={goBack}
      />
      <div className="relative z-10 flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
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
              <h2 className="text-lg font-bold text-foreground">{countryDisplay} {year}</h2>
              <p className="text-primary font-bold">Score: {score}</p>
            </div>
            <div className="w-10" />
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2 bg-muted" />
          </div>

          {/* Question */}
          <Card className="p-6 mb-6 border-border/80 bg-card/90 backdrop-blur-sm shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionText = currentQuestion[`option${option}` as keyof CampaignQuestion] as string;
                return (
                  <Button
                    key={option}
                    variant="outline"
                    className={`h-auto py-4 px-6 text-left justify-start border-border transition-all ${getOptionStyle(option)}`}
                    onClick={() => !disabledOptions.includes(option) && handleAnswer(option)}
                    disabled={disabledOptions.includes(option) || showResult}
                  >
                    <span className="font-bold text-primary mr-3">{option}.</span>
                    <span className="text-foreground">{stripUiParentheticals(optionText)}</span>
                  </Button>
                );
              })}
            </div>
          </Card>

          {/* Hint Section */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={useHint}
              disabled={hintsUsed >= 3 || showResult}
              className="w-full gap-2 border-primary text-primary hover:bg-primary/10"
            >
              <Lightbulb className="w-4 h-4" />
              Need a Hint? ({3 - hintsUsed} remaining)
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

export default WinnersGame;

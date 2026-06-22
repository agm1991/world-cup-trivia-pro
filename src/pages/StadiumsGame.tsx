import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, RotateCcw, Trophy, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { getStadiumsQuestionsByLevel } from '@/data/stadiumsQuestions';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Question, Category } from '@/types/game';
import {
  applyQuizCorrectScore,
  meetsPerfectQuizLevelCompletion,
  normalizeQuizQuestionsForLevel,
  shouldFailQuizLevelAfterWrong,
} from '@/lib/quizLevelRules';
import { stripUiParentheticals } from '@/lib/utils';

const StadiumsGame = () => {
  const navigate = useNavigate();
  const goBack = useSafeBack('/levels/stadiums');
  const { level } = useParams<{ level: string }>();
  const currentLevel = level ? parseInt(level, 10) : 1;
  const { saveLevelStats, recordGameCompletion } = useLocalProfile();

  const [questions, setQuestions] = useState<Question[]>([]);
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

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHintsUsed(0);
    setCurrentHint('');
    setShowHint(false);
    setDisabledOptions([]);
    setWrongAttempts(0);
  };

  useEffect(() => {
    const levelQuestions = getStadiumsQuestionsByLevel(currentLevel);
    const normalized = normalizeQuizQuestionsForLevel(levelQuestions);
    if (normalized.length > 0) {
      setQuestions(normalized);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setGameComplete(false);
      setShowGameOver(false);
      scoredQuestionIndicesRef.current = new Set();
      resetQuestionState();
    } else {
      setQuestions([]);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  // Save stats when level is completed
  useEffect(() => {
    if (!gameComplete) return;
    if (!meetsPerfectQuizLevelCompletion(questions.length, score)) return;
    const key = `stadiums:${currentLevel}`;
    if (completionSavedKeyRef.current === key) return;
    completionSavedKeyRef.current = key;
    saveLevelStats('stadiums' as Category, currentLevel, score, true);
    recordGameCompletion({
      title: `Stadiums — Level ${currentLevel}`,
      score,
      detail: 'Stadiums',
    });
    toast.success('Results saved to profile');
  }, [gameComplete, currentLevel, score, questions.length, saveLevelStats, recordGameCompletion]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

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
    if (hintsUsed >= 3) return;
    
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

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading questions...</p>
      </div>
    );
  }

  if (gameComplete) {
    const maxLevel = 30;
    const hasNextLevel = currentLevel < maxLevel;
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Trophy className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Level {currentLevel} Complete!</h1>
            <p className="text-2xl text-primary mb-2">Final Score: {score} points</p>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-8">Results saved to your profile</p>
            <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
              {hasNextLevel && (
                <Button 
                  onClick={() => navigate(`/level/stadiums/${currentLevel + 1}`)} 
                  className="w-full premium-button"
                  size="lg"
                >
                  Next Level
                </Button>
              )}
              <Button onClick={restartGame} variant="outline" className="w-full gap-2" size="lg">
                <RotateCcw className="w-4 h-4" /> Play Again
              </Button>
              <Button variant="outline" onClick={goBack} size="lg" className="w-full">
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GameOverModal
        isOpen={showGameOver}
        onRestart={restartLevel}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onBack={goBack}
      />
      <div className="py-8 px-4">
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
              <h2 className="text-lg font-bold text-foreground">Stadiums Quiz</h2>
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

          {/* Stadium Visual */}
          <Card className="p-8 mb-6 border-border text-center">
            <Building2 className="w-20 h-20 text-primary mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
          </Card>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion[`option${option}` as keyof Question] as string;
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

export default StadiumsGame;

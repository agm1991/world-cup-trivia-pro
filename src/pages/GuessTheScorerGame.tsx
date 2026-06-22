import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, RotateCcw, Trophy, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import { getGuessTheScorerQuestionsByLevel } from '@/data/guessTheScorerQuestions';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Navigation } from '@/components/Navigation';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { Question } from '@/types/game';
import { HINTS_PER_LEVEL } from '@/constants/gameplay';
import {
  applyQuizCorrectScore,
  meetsPerfectQuizLevelCompletion,
  normalizeQuizQuestionsForLevel,
  shouldFailQuizLevelAfterWrong,
} from '@/lib/quizLevelRules';

const GuessTheScorerGame = () => {
  const [searchParams] = useSearchParams();
  const goBack = useSafeBack('/levels/guess-the-scorer');
  const level = parseInt(searchParams.get('level') || '1', 10);
  const { getTotalStats, setLiveSessionScore, saveLevelStats, recordGameCompletion } = useLocalProfile();

  const questions = useMemo(
    () => normalizeQuizQuestionsForLevel(getGuessTheScorerQuestionsByLevel(level)),
    [level],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const guessTheScorerSavedRef = useRef<string | null>(null);
  const scoredQuestionIndicesRef = useRef<Set<number>>(new Set());

  const currentQuestion = questions[currentIndex] as Question & { videoUrl?: string; videoStart?: number; videoEnd?: number };

  useEffect(() => {
    setLiveSessionScore(score);
    return () => setLiveSessionScore(0);
  }, [score, setLiveSessionScore]);

  useEffect(() => {
    setCurrentIndex(0);
    setScore(0);
    setHintsUsed(0);
    setCurrentHint('');
    setShowHint(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
    setShowGameOver(false);
    setWrongAttempts(0);
    guessTheScorerSavedRef.current = null;
    scoredQuestionIndicesRef.current = new Set();
  }, [level]);

  useEffect(() => {
    if (!gameComplete) return;
    if (!meetsPerfectQuizLevelCompletion(questions.length, score)) return;
    const saveKey = `guess-the-scorer:${level}`;
    if (guessTheScorerSavedRef.current !== saveKey) {
      guessTheScorerSavedRef.current = saveKey;
      saveLevelStats('guess-the-scorer', level, score, true);
      recordGameCompletion({
        title: `Guess the scorer — Level ${level}`,
        score,
        detail: 'Guess the scorer',
      });
      toast.success('Results saved to profile');
    }
  }, [gameComplete, level, score, questions.length, saveLevelStats, recordGameCompletion]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      const { score: nextScore, pointsAwarded } = applyQuizCorrectScore(
        currentIndex,
        score,
        scoredQuestionIndicesRef.current,
      );
      setScore(nextScore);
      toast.success(pointsAwarded > 0 ? `Correct! +${pointsAwarded} points` : 'Correct!');
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setShowHint(false);
          setCurrentHint('');
          setWrongAttempts(0);
        } else {
          if (meetsPerfectQuizLevelCompletion(questions.length, nextScore)) {
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
    if (hintsUsed >= HINTS_PER_LEVEL || !currentQuestion) return;
    const hints = [currentQuestion.hint1, currentQuestion.hint2, currentQuestion.hint3, currentQuestion.hint4 ?? currentQuestion.hint3].slice(0, HINTS_PER_LEVEL);
    setCurrentHint(hints[hintsUsed]);
    setShowHint(true);
    setHintsUsed((h) => h + 1);
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    scoredQuestionIndicesRef.current = new Set();
    setShowGameOver(false);
    setShowResult(false);
    setSelectedAnswer(null);
    setHintsUsed(0);
    setShowHint(false);
    setWrongAttempts(0);
    guessTheScorerSavedRef.current = null;
  };

  const resetQuestionView = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setCurrentHint('');
    setHintsUsed(0);
    setWrongAttempts(0);
  };

  const devNavigatePrev = () => {
    if (currentIndex <= 0) return;
    resetQuestionView();
    setCurrentIndex(currentIndex - 1);
  };

  const devNavigateNext = () => {
    if (currentIndex >= questions.length - 1) return;
    resetQuestionView();
    setCurrentIndex(currentIndex + 1);
  };

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4 text-center space-y-4">
          <p className="text-muted-foreground">
            {questions.length === 0
              ? 'This level needs at least 10 questions to play.'
              : 'Loading...'}
          </p>
          <Button variant="outline" onClick={goBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <Trophy className="w-24 h-24 text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-2">Level Complete!</h1>
          <p className="text-2xl text-primary mb-2">Final Score: {score} points</p>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-8">Results saved to your profile</p>
          <div className="flex gap-4">
            <Button onClick={restart} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Play Again
            </Button>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="w-4 h-4" /> Back to Levels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const videoId = currentQuestion.videoUrl || '';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GameOverModal
        isOpen={showGameOver}
        onRestart={restart}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        onBack={goBack}
      />
      <div className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={goBack} className="p-2" aria-label="Back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-bold">{(getTotalStats().totalScore + score).toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary fill-primary" />
                <span className="font-bold">{HINTS_PER_LEVEL - hintsUsed}</span>
              </span>
            </div>
          </div>

          <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2 mb-6" />

          <Card className="p-6 mb-6 border-border">
            <h2 className="text-xl font-bold text-center mb-4">{currentQuestion.question}</h2>

            {/* YouTube embed - grayscale filter for B&W (copyright) */}
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-muted">
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?modestbranding=1${currentQuestion.videoStart != null ? `&start=${currentQuestion.videoStart}` : ''}${currentQuestion.videoEnd != null ? `&end=${currentQuestion.videoEnd}` : ''}`}
                  title="Goal clip"
                  className="w-full h-full grayscale"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Add YouTube video ID to question data
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const text = currentQuestion[`option${opt}` as keyof Question] as string;
                const isCorrect = opt === currentQuestion.correctAnswer;
                const isSelected = selectedAnswer === opt;
                let style = '';
                if (showResult) {
                  if (isCorrect) style = 'border-green-500 bg-green-500/20';
                  else if (isSelected && !isCorrect) style = 'border-red-500 bg-red-500/20';
                } else {
                  style = 'hover:border-primary hover:bg-primary/10';
                }
                return (
                  <Button
                    key={opt}
                    variant="outline"
                    className={`h-auto py-4 text-left justify-start border ${style}`}
                    onClick={() => !showResult && handleAnswer(opt)}
                    disabled={showResult}
                  >
                    <span className="font-bold text-primary mr-3">{opt}.</span>
                    {text}
                  </Button>
                );
              })}
            </div>
          </Card>

          <Button
            variant="outline"
            onClick={useHint}
            disabled={hintsUsed >= HINTS_PER_LEVEL || showResult}
            className="w-full gap-2 border-primary text-primary"
          >
            <Lightbulb className="w-4 h-4" /> Need a Hint? ({HINTS_PER_LEVEL - hintsUsed} remaining)
          </Button>
          {showHint && (
            <Card className="p-4 mt-4 bg-primary/10 border-primary/30">
              <p className="text-sm flex gap-2">
                <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                <span>{currentHint}</span>
              </p>
            </Card>
          )}

          <SafeDevQuestionNav
            currentIndex={currentIndex}
            totalCount={questions.length}
            onPrevious={devNavigatePrev}
            onNext={devNavigateNext}
          />
        </div>
      </div>
    </div>
  );
};

export default GuessTheScorerGame;

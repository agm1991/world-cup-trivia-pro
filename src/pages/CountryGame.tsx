import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lightbulb, RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { GameOverModal } from '@/components/GameOverModal';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';
import { getCountryQuestions } from '@/data/countryHistoryQuestions';
import { getCampaignQuestions, CampaignQuestion } from '@/data/campaignQuestions';
import { Category, Question } from '@/types/game';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { stableLevelFromKey } from '@/lib/recentCompletionsStorage';
import { applyQuizCorrectScore, meetsPerfectQuizLevelCompletion, shouldFailQuizLevelAfterWrong } from '@/lib/quizLevelRules';
import { stripUiParentheticals } from '@/lib/utils';

/** Prefer questions whose id or wording ties to this tournament year (no generic-era trivia). */
function isQuestionAboutWorldCupYear(q: Question, year: number): boolean {
  const y = String(year);
  if (q.id.includes(`-${year}-`) || q.id.includes(`-${year}_`)) return true;
  return new RegExp(`\\b${year}\\b`).test(q.question);
}

const countries = [
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
  { name: 'Angola', code: 'AO', flag: '🇦🇴' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' },
  { name: 'Czechoslovakia', code: 'TCH', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
  { name: 'East Germany', code: 'DD', flag: '🇩🇪' },
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
  { name: 'England', code: 'GB-ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷' },
  { name: 'Haiti', code: 'HT', flag: '🇭🇹' },
  { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'Northern Ireland', code: 'GB-NIR', flag: '🏴󠁧󠁢󠁮󠁩󠁲󠁿' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴' },
  { name: 'Panama', code: 'PA', flag: '🇵🇦' },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Scotland', code: 'GB-SCT', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸' },
  { name: 'Serbia and Montenegro', code: 'SCG', flag: '🇷🇸' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Soviet Union', code: 'SU', flag: '🇷🇺' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'Togo', code: 'TG', flag: '🇹🇬' },
  { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  { name: 'Wales', code: 'GB-WLS', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { name: 'Yugoslavia', code: 'YU', flag: '🇷🇸' },
  { name: 'FR Yugoslavia', code: 'FRY', flag: '🇷🇸' },
  { name: 'Zaire', code: 'CD', flag: '🇨🇩' },
];

const CountryGame = () => {
  const navigate = useNavigate();
  const { countryCode, year } = useParams();
  const yearsHubPath = useMemo(
    () =>
      countryCode?.trim()
        ? `/country-history/${countryCode.toUpperCase()}`
        : '/country-history',
    [countryCode],
  );
  const goBack = useSafeBack(yearsHubPath);
  const currentYear = year ? parseInt(year) : 2022;

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

  const country = countries.find(c => c.code === countryCode?.toUpperCase());
  
  // Convert CampaignQuestion to Question format
  const convertCampaignQuestionToQuestion = (cq: CampaignQuestion): Question => ({
    id: `campaign-${cq.id}`,
    category: 'country-history',
    difficulty: cq.id <= 5 ? 'easy' : 'medium',
    question: cq.question,
    optionA: cq.optionA,
    optionB: cq.optionB,
    optionC: cq.optionC,
    optionD: cq.optionD,
    correctAnswer: cq.correctAnswer,
    hint1: cq.hint1,
    hint2: cq.hint2,
    hint3: cq.hint3,
  });
  
  const questions = useMemo(() => {
    if (!currentYear || !countryCode) return [];

    const countryName = country?.name || '';
    const campaignQs = getCampaignQuestions(countryName, currentYear);
    if (campaignQs.length > 0) {
      const mapped = campaignQs.map(convertCampaignQuestionToQuestion);
      return mapped.length >= 10 ? mapped.slice(0, 10) : [];
    }

    const bank = getCountryQuestions(countryCode?.toUpperCase() || '');
    const yearSpecific = bank.filter((q) => isQuestionAboutWorldCupYear(q, currentYear));
    if (yearSpecific.length < 10) return [];

    const shuffled = [...yearSpecific].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [countryCode, currentYear, country]);

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
            handleGameComplete();
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

  const handleGameComplete = () => {
    setGameComplete(true);
  };

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  useEffect(() => {
    if (!gameComplete || !countryCode) return;
    if (!meetsPerfectQuizLevelCompletion(questions.length, score)) return;
    const key = `${countryCode}:${currentYear}`;
    if (completionSavedKeyRef.current === key) return;
    completionSavedKeyRef.current = key;
    const levelSlot = stableLevelFromKey(`${countryCode.toUpperCase()}-${currentYear}`);
    const finalScore = score;
    saveLevelStats('country-history' as Category, levelSlot, finalScore, true);
    recordGameCompletion({
      title: `${country?.name ?? countryCode} — ${currentYear}`,
      score: finalScore,
      detail: 'Country history',
    });
    toast.success('Results saved to profile');
  }, [
    gameComplete,
    countryCode,
    currentYear,
    score,
    questions.length,
    country?.name,
    saveLevelStats,
    recordGameCompletion,
  ]);

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-6xl mb-4 block">{country?.flag}</span>
            <Trophy className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Quiz Complete!</h1>
            <p className="text-xl text-muted-foreground mb-2">{country?.name} - {currentYear} World Cup</p>
            <p className="text-2xl text-primary mb-2">Final Score: {score} points</p>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-8">Results saved to your profile</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="outline" onClick={restartGame} className="gap-2">
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

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4 text-center">
          <span className="text-6xl mb-4 block">{country?.flag}</span>
          <h2 className="text-2xl font-bold text-foreground mb-4">{country?.name} - {currentYear}</h2>
          <p className="text-muted-foreground mb-6">Questions for this country are coming soon!</p>
          <Button variant="outline" onClick={() => navigate(yearsHubPath)}>
            Back to years
          </Button>
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
              <span className="text-3xl">{country?.flag}</span>
              <h2 className="text-lg font-bold text-foreground">{country?.name || countryCode?.toUpperCase()}</h2>
              <p className="text-sm text-muted-foreground">{currentYear} World Cup</p>
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
          <Card className="p-6 mb-6 border-border">
            <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default CountryGame;
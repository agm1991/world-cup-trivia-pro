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
import { managersQuestions } from '@/data/managersQuestions';
import { Category, Question } from '@/types/game';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { stableLevelFromKey } from '@/lib/recentCompletionsStorage';
import { applyQuizCorrectScore, meetsPerfectQuizLevelCompletion, shouldFailQuizLevelAfterWrong } from '@/lib/quizLevelRules';
import { stripUiParentheticals } from '@/lib/utils';

const pickTen = (qs: Question[]) => (qs.length >= 10 ? qs.slice(0, 10) : []);

const ManagersGame = () => {
  const navigate = useNavigate();
  const goBack = useSafeBack('/managers-select');
  const { country, manager } = useParams<{ country: string; manager: string }>();

  // Get manager-specific questions or use all questions
  const managerQuestions = useMemo(() => {
    if (manager) {
      // Normalize manager name for matching
      const normalizedManager = manager.toLowerCase().replace(/-/g, ' ');
      
      // Check if it's Mick McCarthy
      if (normalizedManager.includes('mccarthy')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('mccarthy-irl-')));
      }

      // Check if it's Köbi Kuhn
      if (normalizedManager.includes('kuhn')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('kuhn-sui-')));
      }

      // Check if it's Oleg Blokhin
      if (normalizedManager.includes('blokhin')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('blokhin-ukr-')));
      }

      // Check if it's Jimmy Murphy
      if (normalizedManager.includes('murphy') && !normalizedManager.includes('alec')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('murphy-wal-')));
      }

      // Check if it's Jorge Sampaoli
      if (normalizedManager.includes('sampaoli')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('sampaoli-chi-')));
      }

      // Check if it's Francisco Maturana
      if (normalizedManager.includes('maturana')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('maturana-col-')));
      }

      // Check if it's Rudolf Vytlačil
      if (normalizedManager.includes('vytlacil') || normalizedManager.includes('vytlačil')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('vytlacil-cze-')));
      }

      // Check if it's Ernst Happel
      if (normalizedManager.includes('happel')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('happel-ned-')));
      }

      // Check if it's Myung Rye-hyun
      if (normalizedManager.includes('myung') || normalizedManager.includes('rye-hyun') || normalizedManager.includes('rye hyun')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('myung-nkp-')));
      }

      // Check if it's Didi (Peru — not Didier Deschamps)
      if ((normalizedManager === 'didi' || normalizedManager.includes('didi')) && !normalizedManager.includes('didier') && !normalizedManager.includes('deschamps')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('didi-per-')));
      }

      // Check if it's Gerardo Martino
      if (normalizedManager.includes('martino')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('martino-par-')));
      }

      // Check if it's Karl Rappan
      if (normalizedManager.includes('rappan')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('rappan-sui-')));
      }

      // Check if it's Azeglio Vicini
      if (normalizedManager.includes('vicini')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('vicini-ita-')));
      }

      // Check if it's Takeshi Okada
      if (normalizedManager.includes('okada')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('okada-jpn-')));
      }

      // Check if it's Miguel Herrera
      if (normalizedManager.includes('herrera')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('herrera-mex-')));
      }

      // Check if it's Ivica Osim
      if (normalizedManager.includes('osim')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('osim-yug-')));
      }

      // Check if it's Guy Thys
      if (normalizedManager.includes('thys')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('thys-bel-')));
      }

      // Check if it's Sepp Piontek
      if (normalizedManager.includes('piontek')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('piontek-den-')));
      }

      // Check if it's Clemens Westerhof
      if (normalizedManager.includes('westerhof')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('westerhof-nga-')));
      }

      // Check if it's Antoni Piechniczek
      if (normalizedManager.includes('piechniczek')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('piechniczek-pol-')));
      }

      // Check if it's Milovan Rajevac
      if (normalizedManager.includes('rajevac')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('rajevac-gha-')));
      }

      // Check if it's Bert van Marwijk
      if (normalizedManager.includes('marwijk')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('vanmarwijk-ned-')));
      }

      // Check if it's Tommy Svensson
      if (normalizedManager.includes('svensson') && !normalizedManager.includes('eriksson')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('svensson-swe-')));
      }

      // Check if it's Dimitar Penev
      if (normalizedManager.includes('penev')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('penev-bul-')));
      }

      // Check if it's Sven Eriksson
      if (normalizedManager.includes('sven') && normalizedManager.includes('eriksson')) {
        // Return Sven Eriksson questions (ids starting with 'sven-eng-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('sven-eng-')));
      }
      
      // Check if it's Vicente del Bosque
      if ((normalizedManager.includes('vicente') || normalizedManager.includes('del-bosque') || normalizedManager.includes('delbosque')) && 
          (normalizedManager.includes('bosque') || normalizedManager.includes('del'))) {
        // Return Vicente del Bosque questions (ids starting with 'delbosque-esp-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('delbosque-esp-')));
      }
      
      // Check if it's Sir Alf Ramsey
      if (normalizedManager.includes('ramsey')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('ramsey-eng-')));
      }

      // Check if it's Sir Bobby Robson
      if (normalizedManager.includes('robson')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('robson-eng-')));
      }

      // Check if it's Michel Hidalgo
      if (normalizedManager.includes('hidalgo')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('hidalgo-fra-')));
      }

      // Check if it's Raymond Domenech
      if (normalizedManager.includes('domenech')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('domenech-fra-')));
      }

      // Check if it's Aimé Jacquet
      if (normalizedManager.includes('jacquet') || normalizedManager.includes('aime')) {
        // Return Aimé Jacquet questions (ids starting with 'jacquet-fra-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('jacquet-fra-')));
      }
      
      // Check if it's Didier Deschamps
      if (normalizedManager.includes('deschamps') || normalizedManager.includes('didier')) {
        // Return Didier Deschamps questions (ids starting with 'deschamps-fra-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('deschamps-fra-')));
      }
      
      // Check if it's Laurent Blanc
      if (normalizedManager.includes('blanc') || normalizedManager.includes('laurent')) {
        // Return Laurent Blanc questions (ids starting with 'blanc-fra-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('blanc-fra-')));
      }
      
      // Check if it's Fabio Capello
      if (normalizedManager.includes('capello') || normalizedManager.includes('fabio')) {
        // Return Fabio Capello questions (ids starting with 'capello-eng-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('capello-eng-')));
      }
      
      // Check if it's Roy Hodgson
      if (normalizedManager.includes('hodgson') || normalizedManager.includes('roy')) {
        // Return Roy Hodgson questions (ids starting with 'hodgson-eng-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('hodgson-eng-')));
      }
      
      // Check if it's Gareth Southgate
      if (normalizedManager.includes('southgate') || normalizedManager.includes('gareth')) {
        // Return Gareth Southgate questions (ids starting with 'southgate-eng-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('southgate-eng-')));
      }
      
      // Check if it's Gusztáv Sebes
      if (normalizedManager.includes('sebes')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('sebes-hun-')));
      }

      // Check if it's Vittorio Pozzo
      if (normalizedManager.includes('pozzo')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('pozzo-ita-')));
      }

      // Check if it's Enzo Bearzot
      if (normalizedManager.includes('bearzot')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('bearzot-ita-')));
      }

      // Check if it's Arrigo Sacchi
      if (normalizedManager.includes('sacchi')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('sacchi-ita-')));
      }

      // Check if it's Walid Regragui
      if (normalizedManager.includes('regragui')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('regragui-mar-')));
      }

      // Check if it's Rinus Michels
      if (normalizedManager.includes('michels')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('michels-ned-')));
      }

      // Check if it's Louis van Gaal
      if (normalizedManager.includes('van gaal') || normalizedManager.includes('vangaal')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('vangaal-ned-')));
      }

      // Check if it's Egil Olsen
      if (normalizedManager.includes('olsen') || normalizedManager.includes('drillo')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('olsen-nor-')));
      }

      // Check if it's Kazimierz Górski
      if (normalizedManager.includes('gorski') || normalizedManager.includes('górski')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('gorski-pol-')));
      }

      // Check if it's Jack Charlton
      if (normalizedManager.includes('charlton') && !normalizedManager.includes('bobby')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('charlton-irl-')));
      }

      // Check if it's Hervé Renard
      if (normalizedManager.includes('renard')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('renard-sau-')));
      }

      // Check if it's Bruno Metsu
      if (normalizedManager.includes('metsu')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('metsu-sen-')));
      }

      // Check if it's Guus Hiddink
      if (normalizedManager.includes('hiddink')) {
        const countrySlug = (country ?? '').toLowerCase();
        if (countrySlug.includes('netherlands')) {
          return pickTen(managersQuestions.filter(q => q.id.startsWith('hiddink-ned-')));
        }
        if (countrySlug.includes('australia')) {
          return pickTen(managersQuestions.filter(q => q.id.startsWith('hiddink-aus-')));
        }
        return pickTen(managersQuestions.filter(q => q.id.startsWith('hiddink-kor-')));
      }

      // Check if it's Valeriy Lobanovskyi
      if (normalizedManager.includes('lobanovskyi') || normalizedManager.includes('lobanovski')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('lobanovskyi-sov-')));
      }

      // Check if it's George Raynor
      if (normalizedManager.includes('raynor')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('raynor-swe-')));
      }

      // Check if it's Şenol Güneş
      if (normalizedManager.includes('gunes') || normalizedManager.includes('güneş') || normalizedManager.includes('senol')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('gunes-tur-')));
      }

      // Check if it's Alberto Suppici
      if (normalizedManager.includes('suppici')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('suppici-uru-')));
      }

      // Check if it's Juan López Fontana
      if (normalizedManager.includes('fontana')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('fontana-uru-')));
      }

      // Check if it's Óscar Tabárez
      if (normalizedManager.includes('tabarez') || normalizedManager.includes('tabárez') || normalizedManager.includes('oscar')) {
        // Return Óscar Tabárez questions (ids starting with 'tabarez-uru-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('tabarez-uru-')));
      }

      // Check if it's Vahid Halilhodžić
      if (normalizedManager.includes('halilhodzic') || normalizedManager.includes('halilhodžić') || normalizedManager.includes('vahid')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('halilhodzic-alg-')));
      }

      // Check if it's Hugo Meisl
      if (normalizedManager.includes('meisl')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('meisl-aut-')));
      }

      // Check if it's Otto Glória
      if (normalizedManager.includes('gloria') || normalizedManager.includes('glória')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('gloria-por-')));
      }

      // Check if it's Anghel Iordănescu
      if (normalizedManager.includes('iordanescu') || normalizedManager.includes('iordănescu')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('iordanescu-rou-')));
      }

      // Check if it's Bruce Arena
      if (normalizedManager.includes('arena') || normalizedManager.includes('bruce')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('arena-usa-')));
      }

      // Check if it's Marcello Lippi
      if (normalizedManager.includes('lippi') || normalizedManager.includes('marcello')) {
        // Return Marcello Lippi questions (ids starting with 'lippi-ita-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('lippi-ita-')));
      }
      
      // Check if it's Giovanni Trapattoni
      if (normalizedManager.includes('trapattoni') || normalizedManager.includes('giovanni')) {
        // Return Giovanni Trapattoni questions (ids starting with 'trapattoni-ita-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('trapattoni-ita-')));
      }
      
      // Check if it's Sepp Herberger
      if (normalizedManager.includes('herberger')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('herberger-ger-')));
      }

      // Check if it's Helmut Schön
      if (normalizedManager.includes('schon') || normalizedManager.includes('schön')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('schon-ger-')));
      }

      // Check if it's Franz Beckenbauer
      if (normalizedManager.includes('beckenbauer')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('beckenbauer-ger-')));
      }

      // Check if it's Jürgen Klinsmann
      if (normalizedManager.includes('klinsmann')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('klinsmann-ger-')));
      }

      // Check if it's Joachim Löw
      if (normalizedManager.includes('low') || normalizedManager.includes('löw') || normalizedManager.includes('joachim')) {
        // Return Joachim Löw questions (ids starting with 'low-ger-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('low-ger-')));
      }
      
      // Check if it's Roberto Martínez
      if (normalizedManager.includes('martinez') || normalizedManager.includes('martínez')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('martinez-bel-')));
      }

      // Check if it's Vicente Feola
      if (normalizedManager.includes('feola')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('feola-bra-')));
      }

      // Check if it's Aymoré Moreira
      if (normalizedManager.includes('moreira')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('moreira-bra-')));
      }

      // Check if it's Mário Zagallo
      if (normalizedManager.includes('zagallo')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('zagallo-bra-')));
      }

      // Check if it's Telê Santana
      if (normalizedManager.includes('santana') || normalizedManager.includes('tele')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('telesantana-bra-')));
      }

      // Check if it's Carlos Alberto Parreira
      if (normalizedManager.includes('parreira')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('parreira-bra-')));
      }

      // Check if it's Luiz Felipe Scolari
      if (normalizedManager.includes('scolari') || normalizedManager.includes('felipão') || normalizedManager.includes('big phil')) {
        const countrySlug = (country ?? '').toLowerCase();
        if (countrySlug.includes('portugal')) {
          return pickTen(managersQuestions.filter(q => q.id.startsWith('scolari-por-')));
        }
        return pickTen(managersQuestions.filter(q => q.id.startsWith('scolari-bra-')));
      }
      
      // Check if it's Carlos Bilardo
      if (normalizedManager.includes('bilardo')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('bilardo-arg-')));
      }

      // Check if it's César Luis Menotti
      if (normalizedManager.includes('menotti')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('menotti-arg-')));
      }

      // Check if it's Alejandro Sabella
      if (normalizedManager.includes('sabella')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('sabella-arg-')));
      }

      // Check if it's Lionel Scaloni
      if (normalizedManager.includes('scaloni')) {
        // Return Lionel Scaloni questions (ids starting with 'scaloni-arg-')
        return pickTen(managersQuestions.filter(q => q.id.startsWith('scaloni-arg-')));
      }
      
      // Check if it's Miroslav Blažević
      if (normalizedManager.includes('blazevic')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('blazevic-cro-')));
      }

      // Check if it's Zlatko Dalić
      if (normalizedManager.includes('dalic')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('dalic-cro-')));
      }

      // Check if it's Valeriy Nepomnyashchy
      if (normalizedManager.includes('nepomnyashchy')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('nepomnyashchy-cmr-')));
      }

      // Check if it's Marcelo Bielsa
      if (normalizedManager.includes('bielsa')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('bielsa-chi-')));
      }

      // Check if it's José Pékerman
      if (normalizedManager.includes('pekerman')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('pekerman-col-')));
      }

      // Check if it's Jorge Luis Pinto
      if (normalizedManager.includes('pinto')) {
        return pickTen(managersQuestions.filter(q => q.id.startsWith('pinto-cri-')));
      }
    }
    
    // Default: return all manager questions
    return pickTen(managersQuestions);
  }, [manager]);
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

  const currentQuestion = managerQuestions[currentQuestionIndex];
  const totalQuestions = managerQuestions.length;
  
  // Display manager name in header if specific manager selected
  const managerDisplayName = manager 
    ? manager.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Managers';

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  useEffect(() => {
    if (!gameComplete) return;
    if (!meetsPerfectQuizLevelCompletion(managerQuestions.length, score)) return;
    const routeKey = `${country ?? ''}:${manager ?? 'all'}`;
    if (completionSavedKeyRef.current === routeKey) return;
    completionSavedKeyRef.current = routeKey;
    const levelSlot = stableLevelFromKey(routeKey);
    saveLevelStats('managers' as Category, levelSlot, score, true);
    recordGameCompletion({
      title: managerDisplayName,
      score,
      detail: 'Managers',
    });
    toast.success('Results saved to profile');
  }, [gameComplete, country, manager, score, managerQuestions.length, saveLevelStats, recordGameCompletion, managerDisplayName]);

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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Trophy className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Level Complete!</h1>
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
              <h2 className="text-lg font-bold text-foreground">{managerDisplayName} Quiz</h2>
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

export default ManagersGame;

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, Hand, RotateCcw, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import {
  getDestinyRouteByCountryYear,
  getDestinyRouteByLevel,
  getDestinyRouteLevelIndexForCountryYear,
  DESTINY_ROUTE_LEVEL_COUNT,
  countryToFlag,
} from '@/data/destinyRouteQuestions';
import { getCountryFlag } from '@/lib/countryFlags';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Navigation } from '@/components/Navigation';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const DestinyRouteGame = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const levelParam = searchParams.get('level');
  const parsedLevel = levelParam ? parseInt(levelParam, 10) : NaN;
  const country = searchParams.get('country') || '';
  const yearRaw = searchParams.get('year');
  const year = yearRaw ? parseInt(yearRaw, 10) : 0;

  const { setLiveSessionScore, saveLevelStats, recordGameCompletion } = useLocalProfile();

  /** Resolved puzzle: `?level=N` (curriculum) or `?country=&year=` (free play from select). */
  const levelData = useMemo(() => {
    if (Number.isFinite(parsedLevel) && parsedLevel >= 1) {
      const byLevel = getDestinyRouteByLevel(parsedLevel);
      if (byLevel) return byLevel;
    }
    if (country) {
      const y = year > 0 ? year : 2002;
      return getDestinyRouteByCountryYear(country, y);
    }
    return null;
  }, [parsedLevel, country, year]);

  /** Level number stored in profile (curriculum index, or match for free play). */
  const statsLevel = useMemo(() => {
    if (Number.isFinite(parsedLevel) && parsedLevel >= 1 && getDestinyRouteByLevel(parsedLevel)) {
      return parsedLevel;
    }
    if (country && year > 0) {
      return getDestinyRouteLevelIndexForCountryYear(country, year) ?? 1;
    }
    return 1;
  }, [parsedLevel, country, year]);
  const [order, setOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const completionSavedKeyRef = useRef<string | null>(null);

  const initRound = () => {
    if (!levelData) return;
    setOrder(shuffle([...levelData.correctOrder]));
    setSubmitted(false);
    setCorrect(false);
    setDraggedIndex(null);
    completionSavedKeyRef.current = null;
  };

  useEffect(() => {
    if (!levelData) return;
    initRound();
  }, [country, year, levelData, parsedLevel]);

  useEffect(() => {
    if (Number.isFinite(parsedLevel) && parsedLevel > DESTINY_ROUTE_LEVEL_COUNT) {
      navigate('/levels/destiny-route', { replace: true });
    }
  }, [parsedLevel, navigate]);

  useEffect(() => {
    if (!correct || !levelData) return;
    const bonus = 10 + levelData.correctOrder.length * 2;
    const key = `${statsLevel}:${levelData.team}:${levelData.year}`;
    if (completionSavedKeyRef.current === key) return;
    completionSavedKeyRef.current = key;
    setLiveSessionScore(bonus);
    saveLevelStats('destiny-route', statsLevel, bonus, true);
    recordGameCompletion({
      title: `${levelData.team} ${levelData.year} — Destiny route`,
      score: bonus,
      detail: 'Destiny route',
    });
    toast.success(`+${bonus} pts — results saved to your profile`);
  }, [correct, levelData, setLiveSessionScore, saveLevelStats, statsLevel, recordGameCompletion]);

  useEffect(() => {
    return () => setLiveSessionScore(0);
  }, [setLiveSessionScore]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const fromIndex = draggedIndex ?? parseInt(e.dataTransfer.getData('text/plain') || '0', 10);
    if (fromIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    setOrder((prev) => {
      const next = [...prev];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, removed);
      return next;
    });
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const isCorrect =
      order.length === levelData!.correctOrder.length &&
      order.every((c, i) => c === levelData!.correctOrder[i]);
    setCorrect(isCorrect);
    if (!isCorrect) {
      toast.error('Not quite — try again.');
    }
  };

  if (!levelData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4 text-center">
          <p className="text-muted-foreground">Level not found</p>
          <Button variant="outline" onClick={() => navigate('/destiny')} className="mt-4">
            Back
          </Button>
        </div>
      </div>
    );
  }

  const path = levelData.correctOrder;

  if (correct) {
    return (
      <div className="min-h-screen bg-background destiny-route-page">
        <Navigation />
        <div className="py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative mb-6">
            <Trophy className="w-28 h-28 text-primary trophy-pulse" />
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl -z-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 destiny-route-title">Perfect Route!</h1>
          <p className="text-2xl text-primary font-bold mb-2">+{10 + path.length * 2} points</p>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Results saved to your profile</p>
          <p className="text-muted-foreground text-sm mb-8">You know the path to glory!</p>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-10 max-w-full px-4">
            <span className="text-sm font-medium text-muted-foreground shrink-0 w-full text-center sm:w-auto mb-2 sm:mb-0">Full route:</span>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {path.map((c, i) => (
                <span key={`${c}-${i}`} className="flex items-center gap-1 shrink-0">
                  {i > 0 && <ChevronRight className="w-4 h-4 text-primary/60 shrink-0" />}
                  <span className="text-2xl" title={c}>
                    {countryToFlag[c] || '🏳️'}
                  </span>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">{c}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {statsLevel < DESTINY_ROUTE_LEVEL_COUNT && (
              <Button
                onClick={() => navigate(`/destiny-route-game?level=${statsLevel + 1}`)}
                className="gap-2 premium-button font-semibold"
              >
                Next level
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={initRound} className="gap-2 premium-button font-semibold">
              <RotateCcw className="w-4 h-4" /> Play Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/destiny')} className="gap-2 font-semibold">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button variant="outline" onClick={() => navigate('/levels/destiny-route')} className="gap-2 font-semibold">
              Level list
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background destiny-route-page">
      <Navigation />
      <div className="py-4 sm:py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(
                Number.isFinite(parsedLevel) && parsedLevel >= 1
                  ? '/levels/destiny-route'
                  : '/destiny'
              )
            }
            className="text-muted-foreground hover:text-foreground -ml-2 mb-4"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </Button>

          {/* Hero header - stadium feel */}
          <div className="relative overflow-hidden rounded-2xl mb-6 destiny-route-hero">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(45_93%_47%_/_0.15),transparent_70%)]" />
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
              <div className="flex items-center gap-4">
                <span className="text-6xl sm:text-7xl drop-shadow-lg destiny-route-hero-flag" aria-hidden>
                  {getCountryFlag(levelData.team)}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                      {levelData.team}
                    </h1>
                    <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-500">
                      {levelData.year}
                    </span>
                  </div>
                  {levelData.isWinner && (
                    <span className="destiny-route-winner-badge mt-2 inline-flex">🏆 Champion</span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base flex-1">
                {levelData.description}
              </p>
            </div>
          </div>

          {/* Fun instruction bar */}
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl destiny-route-instruction-bar">
            <Hand className="w-6 h-6 text-primary shrink-0 animate-bounce" aria-hidden />
            <p className="text-sm sm:text-base font-medium text-foreground/95">
              <strong className="text-primary">Drag & drop</strong> the teams into the correct order — first match to last. Drop anywhere to reorder!
            </p>
          </div>

          {/* Road to glory - path with team cards */}
          <div className="relative mb-8">
            <div
              className="destiny-route-path-container overflow-x-auto pb-4 -mx-2"
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverIndex(null);
              }}
            >
              <div className="flex items-stretch gap-2 sm:gap-3 min-w-max px-2 py-4 destiny-route-track">
                {order.map((c, index) => (
                  <div key={`${index}-${c}`} className="contents">
                    {index > 0 && (
                      <div className="flex items-center shrink-0 destiny-route-connector" aria-hidden>
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary/60" />
                      </div>
                    )}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`
                        destiny-route-card flex flex-col items-center justify-center gap-2 p-4 sm:p-5 min-w-[90px] sm:min-w-[100px] rounded-2xl border-2 cursor-grab active:cursor-grabbing
                        transition-all duration-200 select-none shrink-0
                        ${draggedIndex === index ? 'opacity-60 scale-95 border-primary shadow-xl shadow-primary/30 -rotate-3 destiny-route-card-dragging' : ''}
                        ${draggedIndex !== null && draggedIndex !== index && dragOverIndex === index ? 'border-primary bg-primary/20 scale-110 ring-4 ring-primary/30 destiny-route-card-dropzone' : ''}
                        ${draggedIndex === null ? 'border-border bg-card hover:border-primary/60 hover:bg-primary/5 hover:scale-[1.03] destiny-route-card-idle' : ''}
                      `}
                    >
                      <span className="text-3xl sm:text-4xl destiny-route-flag">{countryToFlag[c] || '🏳️'}</span>
                      <span className="font-bold text-foreground text-xs sm:text-sm text-center leading-tight line-clamp-2">{c}</span>
                      <span className="destiny-route-position text-xs text-muted-foreground tabular-nums font-bold">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmit}
              disabled={submitted}
              className="flex-1 h-14 text-base font-bold premium-button destiny-route-check-btn"
              size="lg"
            >
              {submitted ? 'Checking...' : 'Check my route ✓'}
            </Button>
            {!submitted && (
              <Button
                variant="outline"
                onClick={initRound}
                className="h-14 shrink-0 font-semibold"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
            )}
            {submitted && !correct && (
              <Button variant="outline" onClick={initRound} className="h-14 shrink-0 font-semibold" size="lg">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinyRouteGame;

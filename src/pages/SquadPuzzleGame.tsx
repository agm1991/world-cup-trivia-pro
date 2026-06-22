import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy, RotateCcw, Check } from 'lucide-react';
import {
  getSquadPuzzle,
  SquadPosition,
  type SquadPuzzle,
  SQUAD_PUZZLE_IDS_BY_LEVEL,
  resolveSquadPuzzleKey,
} from '@/data/squadPuzzleData';
import { toast } from 'sonner';
import { useRequireProfile } from '@/hooks/useRequireProfile';
import { ProfileModal } from '@/components/ProfileModal';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { SafeDevQuestionNav } from '@/components/SafeDevQuestionNav';

const SquadPuzzleGame = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const goBack = useSafeBack('/levels/player');
  const { isProfileHydrated, hasProfile } = useRequireProfile();
  const { showProfileModal, setShowProfileModal, saveLevelStats, recordGameCompletion } = useLocalProfile();

  const resolvedSquadKey = playerId ? resolveSquadPuzzleKey(playerId) : undefined;
  const squadPuzzleIndex =
    resolvedSquadKey != null ? SQUAD_PUZZLE_IDS_BY_LEVEL.indexOf(resolvedSquadKey) : -1;

  const defaultIndex = squadPuzzleIndex >= 0 ? squadPuzzleIndex : 0;
  const totalPuzzles = SQUAD_PUZZLE_IDS_BY_LEVEL.length;

  const [browsePuzzleIndex, setBrowsePuzzleIndex] = useState(defaultIndex);
  useEffect(() => {
    setBrowsePuzzleIndex(defaultIndex);
  }, [playerId, defaultIndex]);

  const effectiveIndex = Math.min(Math.max(0, browsePuzzleIndex), Math.max(0, totalPuzzles - 1));
  const activePuzzleId = SQUAD_PUZZLE_IDS_BY_LEVEL[effectiveIndex];
  const puzzle = activePuzzleId ? getSquadPuzzle(activePuzzleId) : undefined;

  const [placedPlayers, setPlacedPlayers] = useState<Record<string, string>>({});
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const [correctPlacements, setCorrectPlacements] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showFlagTransition, setShowFlagTransition] = useState(true);
  const completionSavedKeyRef = useRef<string | null>(null);

  /** Subtitle format: "Country — Starting XI" */
  const teamLabelFromPuzzle = (p: SquadPuzzle) => p.subtitle.split('—')[0]?.trim() ?? '';

  const introFlag = puzzle?.positions[0]?.countryFlag ?? '⚽';

  useEffect(() => {
    // Show flag transition for 2 seconds
    const timer = setTimeout(() => {
      setShowFlagTransition(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPlacedPlayers({});
    setCorrectPlacements([]);
    setSelectedPlayer(null);
    setGameComplete(false);
    completionSavedKeyRef.current = null;
  }, [playerId, activePuzzleId]);

  useEffect(() => {
    if (!gameComplete) {
      completionSavedKeyRef.current = null;
    }
  }, [gameComplete]);

  useEffect(() => {
    if (!gameComplete || !activePuzzleId || !puzzle) return;
    if (completionSavedKeyRef.current === activePuzzleId) return;
    completionSavedKeyRef.current = activePuzzleId;
    const pts = 110;
    const levelNum = effectiveIndex + 1;
    saveLevelStats('squad-puzzle' as Category, levelNum, pts, true);
    recordGameCompletion({
      title: puzzle.title,
      score: pts,
      detail: 'Squad puzzle',
    });
    toast.success('Results saved to profile');
  }, [gameComplete, activePuzzleId, puzzle, effectiveIndex, saveLevelStats, recordGameCompletion]);

  const handlePositionClick = (position: SquadPosition) => {
    if (correctPlacements.includes(position.id)) return;

    if (selectedPlayer) {
      // Place the selected player
      const newPlacements = { ...placedPlayers, [position.id]: selectedPlayer };
      setPlacedPlayers(newPlacements);

      // Check if correct
      if (selectedPlayer === position.correctPlayer) {
        setCorrectPlacements([...correctPlacements, position.id]);
        toast.success(`Correct! ${selectedPlayer}`, {
          icon: <Check className="h-4 w-4 text-green-500" />,
        });

        // Check if game complete
        if (correctPlacements.length + 1 === puzzle?.positions.length) {
          setGameComplete(true);
        }
      } else {
        toast.error('Wrong position! Try again.');
        // Remove after a moment
        setTimeout(() => {
          const { [position.id]: _, ...rest } = newPlacements;
          setPlacedPlayers(rest);
        }, 800);
      }

      setSelectedPlayer(null);
    }
  };

  const handlePlayerSelect = (player: string) => {
    if (
      correctPlacements.some((posId) => {
        const pos = puzzle?.positions.find((p) => p.id === posId);
        return pos?.correctPlayer === player;
      })
    )
      return;

    setSelectedPlayer(player === selectedPlayer ? null : player);
  };

  const restartGame = () => {
    setPlacedPlayers({});
    setCorrectPlacements([]);
    setSelectedPlayer(null);
    setGameComplete(false);
  };

  const devNavigatePrev = () => {
    if (effectiveIndex > 0) setBrowsePuzzleIndex(effectiveIndex - 1);
  };

  const devNavigateNext = () => {
    if (effectiveIndex < totalPuzzles - 1) setBrowsePuzzleIndex(effectiveIndex + 1);
  };

  const isPlayerPlaced = (player: string) => {
    return correctPlacements.some((posId) => {
      const pos = puzzle?.positions.find((p) => p.id === posId);
      return pos?.correctPlayer === player;
    });
  };

  const shellClass =
    'min-h-screen bg-[radial-gradient(ellipse_at_top,hsl(270_60%_18%/0.9),hsl(260_45%_6%)_55%,hsl(260_40%_4%)_100%)]';

  if (!isProfileHydrated) {
    return (
      <div className={`${shellClass} flex items-center justify-center`}>
        <p className="text-amber-100/70">Loading…</p>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className={`${shellClass} flex items-center justify-center`}>
        <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
        <p className="text-amber-100/90">Please create a profile to play...</p>
      </div>
    );
  }

  // Flag transition animation
  if (showFlagTransition && playerId && puzzle) {
    const country = teamLabelFromPuzzle(puzzle);
    return (
      <div className={`${shellClass} flex items-center justify-center`}>
        <div className="text-center animate-scale-in">
          <span className="text-[12rem] md:text-[16rem] block animate-pulse drop-shadow-[0_0_32px_hsl(45_100%_55%/0.45)]">
            {introFlag}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent mt-4">
            {country}
          </h2>
        </div>
      </div>
    );
  }

  if (!puzzle || !puzzle.positions?.length) {
    return (
      <div className={`${shellClass} flex items-center justify-center`}>
        <p className="text-amber-100/80">Loading puzzle...</p>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className={`${shellClass} flex items-center justify-center p-4`}>
        <Card className="p-8 max-w-md w-full text-center rounded-2xl border border-purple-500/40 bg-black/40 shadow-[0_0_40px_-8px_hsl(280_70%_45%/0.5),0_0_60px_-12px_hsl(45_100%_50%/0.25)] backdrop-blur-sm">
          <Trophy className="w-20 h-20 mx-auto mb-6 text-amber-400 drop-shadow-[0_0_20px_hsl(45_100%_55%/0.6)]" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent mb-2">
            Squad Complete!
          </h2>
          <p className="text-purple-200/80 mb-1">{puzzle.title}</p>
          <p className="text-purple-300/70 text-sm mb-6">
            {puzzle.year} · {puzzle.stage} · vs {puzzle.opponent}
          </p>
          <div className="rounded-xl p-6 mb-6 border border-amber-500/30 bg-purple-950/40">
            <p className="text-5xl font-bold text-amber-300 drop-shadow-[0_0_12px_hsl(45_100%_55%/0.4)]">11/11</p>
            <p className="text-purple-200/70 text-sm">Players Placed</p>
          </div>
          <p className="text-sm font-medium text-emerald-400/90 mb-6">Results saved to your profile</p>
          <div className="space-y-3">
            <Button
              onClick={restartGame}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-violet-700 text-amber-100 border border-amber-400/40 shadow-[0_0_24px_hsl(280_70%_40%/0.45)] hover:from-purple-500 hover:to-violet-600"
              size="lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            <Button
              onClick={goBack}
              variant="outline"
              className="w-full rounded-xl border-amber-400/50 text-amber-100 hover:bg-purple-950/60"
              size="lg"
            >
              Choose Another Player
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-purple-500/35 bg-black/30 backdrop-blur-sm shadow-[0_0_28px_-10px_hsl(280_65%_40%/0.35)]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/levels/player')}
          className="border-amber-500/40 text-amber-100 hover:bg-purple-950/50 hover:border-amber-400/60"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center max-w-[min(100%,20rem)]">
          <h2 className="text-amber-300/95 font-bold text-sm drop-shadow-[0_0_8px_hsl(45_100%_55%/0.35)]">
            {puzzle.title}
          </h2>
          <p className="text-purple-100/90 font-semibold text-sm">{puzzle.subtitle}</p>
          <p className="text-purple-200/75 text-xs mt-1 leading-snug">
            {puzzle.year} · {puzzle.stage} · vs {puzzle.opponent}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-300 tabular-nums drop-shadow-[0_0_10px_hsl(45_100%_55%/0.35)]">
            {correctPlacements.length}/11
          </span>
        </div>
      </div>

      {/* Football Pitch */}
      <div className="relative w-full aspect-[3/4] max-w-lg mx-auto overflow-hidden bg-gradient-to-b from-emerald-800/95 via-green-700 to-emerald-900/90 ring-2 ring-purple-500/30 shadow-[inset_0_0_60px_hsl(260_50%_15%/0.35)]">
        {/* Pitch markings */}
        <div className="absolute inset-0">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/40 rounded-full" />
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40" />
          {/* Goal areas */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 border-2 border-b-0 border-white/40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 border-2 border-t-0 border-white/40" />
          {/* Penalty areas */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-28 border-2 border-b-0 border-white/40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 border-2 border-t-0 border-white/40" />
        </div>

        {/* Player positions */}
        {puzzle.positions.map((position) => {
          const isCorrect = correctPlacements.includes(position.id);
          const placedPlayer = placedPlayers[position.id];

          return (
            <button
              key={position.id}
              onClick={() => handlePositionClick(position)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                selectedPlayer && !isCorrect ? 'animate-pulse' : ''
              }`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              disabled={isCorrect}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCorrect
                    ? 'bg-emerald-500/90 border-amber-300 shadow-[0_0_16px_hsl(45_100%_55%/0.35)]'
                    : placedPlayer
                      ? 'bg-red-600/90 border-red-300'
                      : 'bg-purple-950/85 border-amber-400/40 hover:border-amber-300 hover:scale-110 shadow-[0_0_12px_hsl(280_60%_40%/0.25)]'
                }`}
              >
                {isCorrect ? (
                  <div className="text-center">
                    <Check className="w-4 h-4 text-white mx-auto" />
                    <span className="text-[8px] text-white font-medium leading-none block mt-0.5">
                      {position.correctPlayer.split(' ').pop()}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl">{position.countryFlag}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Player bench */}
      <Card className="mx-4 mt-4 p-4 border border-purple-500/35 bg-black/25 shadow-[0_0_24px_hsl(280_60%_35%/0.2)] backdrop-blur-sm">
        <h3 className="text-center text-amber-200/80 text-sm font-semibold mb-3 tracking-wide">
          MATCH THE PLAYERS
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {puzzle.playerOptions.map((player) => {
            const isPlaced = isPlayerPlaced(player);
            return (
              <Button
                key={player}
                onClick={() => handlePlayerSelect(player)}
                disabled={isPlaced}
                variant="outline"
                size="sm"
                className={`rounded-full transition-all ${
                  isPlaced
                    ? 'opacity-30 line-through border-purple-900/50'
                    : selectedPlayer === player
                      ? 'bg-gradient-to-r from-purple-600 to-violet-700 text-amber-50 border-amber-400/50 shadow-[0_0_16px_hsl(280_70%_45%/0.4)]'
                      : 'border-amber-500/35 text-purple-50 hover:border-amber-400/60 hover:bg-purple-950/40'
                }`}
              >
                {player}
              </Button>
            );
          })}
        </div>
      </Card>

      {selectedPlayer && (
        <p className="text-center text-amber-300/95 text-sm mt-4 animate-pulse drop-shadow-[0_0_8px_hsl(45_100%_55%/0.3)]">
          Tap a position to place {selectedPlayer}
        </p>
      )}

      <SafeDevQuestionNav
        currentIndex={effectiveIndex}
        totalCount={totalPuzzles}
        onPrevious={devNavigatePrev}
        onNext={devNavigateNext}
      />
    </div>
  );
};

export default SquadPuzzleGame;

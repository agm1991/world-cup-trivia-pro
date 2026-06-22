import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { ArrowLeft, Star, Search, Trophy, CheckCircle } from 'lucide-react';
import { getCountryFlagImageSrc } from '@/lib/countryFlags';
import {
  defaultCountries,
  getCountryBySlug,
  getCountrySlug,
  countryStylesConfig,
} from '@/pages/PlayerLevels';
import { formatPlayerLevelLabel, getPlayerWorldCupYearsSorted } from '@/data/playerQuestions';
/** Neutral silhouette — never substitute another real player’s portrait (e.g. Pelé) on load failure. */
import playerPlaceholderUrl from '@/assets/players/placeholder-player.svg?url';

const PlayerCountryPlayers = () => {
  const navigate = useNavigate();
  const { country: countrySlug } = useParams<{ country: string }>();
  const { gameStats } = useLocalProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const country = countrySlug ? getCountryBySlug(countrySlug, defaultCountries) : null;
  const playerStats = useMemo(() => {
    let totalScore = 0;
    let highestLevel = 0;
    Object.entries(gameStats).forEach(([key, stats]) => {
      if (key.startsWith('player-')) {
        totalScore += stats.totalScore;
        highestLevel = Math.max(highestLevel, stats.highestLevel);
      }
    });
    return { totalScore, highestLevel };
  }, [gameStats]);

  const filteredPlayers = country?.players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  ) ?? [];

  if (!country) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Navigation />
        <p className="text-foreground">Country not found</p>
        <Button variant="outline" onClick={() => navigate('/levels/player')} className="p-2" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/levels/player')}
              className="border-border hover:bg-muted p-2"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {(() => {
            const slug = getCountrySlug(country.name);
            const styles = countryStylesConfig[slug];
            return (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                <div className="flex items-center justify-center w-24 h-16 sm:w-28 sm:h-[4.5rem] rounded-xl border-2 border-border/60 bg-card/90 shadow-lg overflow-hidden flex-shrink-0">
                  <img
                    src={getCountryFlagImageSrc(country.name)}
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1
                    className={`text-4xl md:text-5xl font-bold tracking-tight ${!styles ? 'text-foreground' : ''}`}
                    style={
                      styles
                        ? {
                            background: styles.gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }
                      : undefined
                    }
                  >
                    {country.name} Legends
                  </h1>
                  {styles && (
                    <p className="text-lg font-medium mt-1" style={{ color: styles.accentColor }}>
                      {styles.nickname}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span className="font-bold">{playerStats.totalScore}</span>
                      <span className="text-muted-foreground text-sm">Total Score</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-bold">{formatPlayerLevelLabel(playerStats.highestLevel)}</span>
                      <span className="text-muted-foreground text-sm">Highest level</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="relative mb-6 max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => {
              const wcYears = getPlayerWorldCupYearsSorted(player.id);
              const subtitle =
                wcYears.length > 0 ? `World Cup ${wcYears.join(', ')}` : player.achievement;
              return (
              <Card
                key={player.id}
                className="overflow-hidden cursor-pointer border-amber-500/35 hover:border-amber-400/55 transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 group shadow-lg"
                onClick={() => navigate(`/player-levels/${player.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                  <img
                    src={player.image}
                    alt={player.name}
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = '1';
                        target.src = playerPlaceholderUrl;
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-transparent" />
                  {player.isWorldCupWinner && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-400 px-2 py-1 rounded-full shadow-lg">
                      <Star className="w-4 h-4 text-white fill-white" />
                      <span className="text-xs font-bold text-white">#{player.worldCupNumber}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pt-8 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                    <h3 className="text-lg font-black uppercase tracking-tight category-title-animated">
                      {player.name}
                    </h3>
                    <p className="text-sm font-semibold mt-1 animate-flicker-gold">{subtitle}</p>
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
          {filteredPlayers.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No players match your search.</p>
          )}
          <p className="text-muted-foreground text-sm mt-6 text-center">
            Click on a player to test your knowledge about their career
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCountryPlayers;

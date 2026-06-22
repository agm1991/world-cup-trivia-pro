import { useNavigate } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';
const ScorelineByYear = () => {
  const navigate = useNavigate();
  const goBack = useSafeBack('/categories');

  const worldCups = [
    { year: 1930, host: 'Uruguay', winner: 'Uruguay', flag: '🇺🇾' },
    { year: 1934, host: 'Italy', winner: 'Italy', flag: '🇮🇹' },
    { year: 1938, host: 'France', winner: 'Italy', flag: '🇮🇹' },
    { year: 1950, host: 'Brazil', winner: 'Uruguay', flag: '🇺🇾' },
    { year: 1954, host: 'Switzerland', winner: 'Germany', flag: '🇩🇪' },
    { year: 1958, host: 'Sweden', winner: 'Brazil', flag: '🇧🇷' },
    { year: 1962, host: 'Chile', winner: 'Brazil', flag: '🇧🇷' },
    { year: 1966, host: 'England', winner: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { year: 1970, host: 'Mexico', winner: 'Brazil', flag: '🇧🇷' },
    { year: 1974, host: 'West Germany', winner: 'Germany', flag: '🇩🇪' },
    { year: 1978, host: 'Argentina', winner: 'Argentina', flag: '🇦🇷' },
    { year: 1982, host: 'Spain', winner: 'Italy', flag: '🇮🇹' },
    { year: 1986, host: 'Mexico', winner: 'Argentina', flag: '🇦🇷' },
    { year: 1990, host: 'Italy', winner: 'Germany', flag: '🇩🇪' },
    { year: 1994, host: 'USA', winner: 'Brazil', flag: '🇧🇷' },
    { year: 1998, host: 'France', winner: 'France', flag: '🇫🇷' },
    { year: 2002, host: 'South Korea/Japan', winner: 'Brazil', flag: '🇧🇷' },
    { year: 2006, host: 'Germany', winner: 'Italy', flag: '🇮🇹' },
    { year: 2010, host: 'South Africa', winner: 'Spain', flag: '🇪🇸' },
    { year: 2014, host: 'Brazil', winner: 'Germany', flag: '🇩🇪' },
    { year: 2018, host: 'Russia', winner: 'France', flag: '🇫🇷' },
    { year: 2022, host: 'Qatar', winner: 'Argentina', flag: '🇦🇷' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Guess the Scoreline
              </h1>
              <p className="text-muted-foreground mt-2">Select a World Cup tournament (20 questions each)</p>
            </div>
          </div>

          {/* World Cups Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {worldCups.map((wc) => (
              <Card
                key={wc.year}
                className="p-4 cursor-pointer border border-border hover:border-primary/50 hover:shadow-glow transition-all group"
                onClick={() => navigate(`/scoreline-game/${wc.year}`)}
              >
                <div className="text-center">
                  <span className="text-4xl block mb-2">{wc.flag}</span>
                  <h3 className="text-2xl font-bold text-primary">{wc.year}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{wc.host}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trophy className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary">{wc.winner}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorelineByYear;
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';

const WorldCupWinners = () => {
  const navigate = useNavigate();
  const goToCategories = () => navigate('/categories');

  const winners = [
    { name: 'Brazil', flag: '🇧🇷', years: [1958, 1962, 1970, 1994, 2002], titles: 5 },
    { name: 'Germany', flag: '🇩🇪', years: [1954, 1974, 1990, 2014], titles: 4 },
    { name: 'Italy', flag: '🇮🇹', years: [1934, 1938, 1982, 2006], titles: 4 },
    { name: 'Argentina', flag: '🇦🇷', years: [1978, 1986, 2022], titles: 3 },
    { name: 'France', flag: '🇫🇷', years: [1998, 2018], titles: 2 },
    { name: 'Uruguay', flag: '🇺🇾', years: [1930, 1950], titles: 2 },
    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', years: [1966], titles: 1 },
    { name: 'Spain', flag: '🇪🇸', years: [2010], titles: 1 },
  ];

  const handleCountryClick = (countryName: string) => {
    navigate(`/world-cup-winners/${countryName.toLowerCase()}`);
  };

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
              onClick={goToCategories}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                World Cup Winners
              </h1>
              <p className="text-muted-foreground mt-2">8 nations have lifted the trophy - explore their glory</p>
            </div>
          </div>

          {/* Winners Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {winners.map((winner) => (
              <Card
                key={winner.name}
                className="p-4 cursor-pointer transition-all border border-border hover:border-primary/50 hover:shadow-md"
                onClick={() => handleCountryClick(winner.name)}
              >
                <div className="text-center flex flex-col items-center gap-1.5">
                  <span className="text-5xl leading-none">{winner.flag}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground leading-tight min-h-[2.25rem] flex items-center justify-center line-clamp-2 px-0.5">
                    {winner.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Trophy className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-primary font-semibold">{winner.titles} {winner.titles === 1 ? 'Title' : 'Titles'}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-2">
            Tap a nation to see each title-winning campaign and play 10–20 questions
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorldCupWinners;
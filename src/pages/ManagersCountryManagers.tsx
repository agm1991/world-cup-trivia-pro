import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { ArrowLeft, Search, Star, Trophy, CheckCircle } from 'lucide-react';
import { getCountryFlagImageSrc } from '@/lib/countryFlags';
import {
  getManagerCountryTheme,
  getManagerSubtitle,
} from '@/lib/managerCountryThemes';
import {
  filterManagersBySearch,
  getManagerCountryBySlug,
  getManagerSlug,
  getManagersSortedByYear,
} from '@/data/managersCountries';

const ManagersCountryManagers = () => {
  const navigate = useNavigate();
  const { country: countrySlug } = useParams<{ country: string }>();
  const { getCategoryStats } = useLocalProfile();
  const categoryStats = getCategoryStats('managers' as Category);
  const country = getManagerCountryBySlug(countrySlug);
  const [searchQuery, setSearchQuery] = useState('');

  const managers = useMemo(() => {
    if (!country) return [];
    return filterManagersBySearch(getManagersSortedByYear(country), searchQuery);
  }, [country, searchQuery]);

  if (!country) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Navigation />
        <p className="text-foreground">Country not found</p>
        <Button variant="outline" onClick={() => navigate('/managers-select')} className="p-2" aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const theme = getManagerCountryTheme(country.name);
  const subtitle = theme ? getManagerSubtitle(theme.nickname, country.titles) : null;

  const handleManagerClick = (managerName: string) => {
    navigate(`/managers-game/${country.name.toLowerCase()}/${getManagerSlug(managerName)}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {theme && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: theme.bg }}
        />
      )}
      <Navigation />
      <div className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/managers-select')}
              className="border-border hover:bg-muted gap-2"
              aria-label="Back to countries"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div
                className="flex items-center justify-center sm:justify-start w-20 h-14 sm:w-24 sm:h-16 rounded-xl border-2 border-border/60 bg-card/90 shadow-lg overflow-hidden flex-shrink-0"
                style={theme ? { boxShadow: `0 0 24px ${theme.accentColor}40` } : undefined}
              >
                <img
                  src={getCountryFlagImageSrc(country.name)}
                  alt={`${country.name} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1
                  className={`text-3xl md:text-4xl font-bold tracking-tight ${theme ? '' : 'text-foreground'}`}
                  style={theme ? { background: theme.titleGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : undefined}
                >
                  {country.name}&apos;s Legendary Managers
                </h1>
                {subtitle && theme && (
                  <p className="text-lg font-semibold mt-1" style={{ color: theme.accentColor }}>
                    {subtitle}
                  </p>
                )}
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="font-bold">{categoryStats?.totalScore ?? 0}</span>
                    <span className="text-muted-foreground text-sm">Total Score</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-bold">{categoryStats?.highestLevel ?? 0}</span>
                    <span className="text-muted-foreground text-sm">Highest Level</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {country.managers.length > 1 && (
            <div className="relative mb-6 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search managers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {managers.map((manager) => (
              <Card
                key={manager.name}
                className="overflow-hidden cursor-pointer hover:border-primary transition-all border-border group"
                onClick={() => handleManagerClick(manager.name)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={manager.image}
                    alt={manager.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {manager.isWorldCupWinner && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-400 px-2 py-1 rounded-full shadow-lg">
                      <Star className="w-4 h-4 text-white fill-white" />
                      <span className="text-xs font-bold text-white">#{manager.worldCupNumber}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className={`text-lg font-bold ${manager.isWorldCupWinner ? 'text-yellow-400' : 'text-white'}`}>
                      {manager.name}
                    </h3>
                    <p className={`text-sm ${manager.isWorldCupWinner ? 'text-yellow-300' : 'text-primary'}`}>
                      {manager.achievement}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {managers.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No managers match your search.</p>
          )}
          <p className="text-muted-foreground text-sm mt-6 text-center">
            Click on a manager to test your knowledge about their career
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagersCountryManagers;

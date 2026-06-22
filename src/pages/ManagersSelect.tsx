import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Star } from 'lucide-react';
import {
  filterCountriesBySearch,
  findManagersBySearch,
  getManagerCountrySlug,
  getManagerSlug,
  managerCountries,
} from '@/data/managersCountries';

const ManagersSelect = () => {
  const navigate = useNavigate();
  const goBack = useSafeBack('/categories');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(
    () => filterCountriesBySearch(managerCountries, searchQuery),
    [searchQuery],
  );

  const matchingManagers = useMemo(
    () => findManagersBySearch(managerCountries, searchQuery),
    [searchQuery],
  );

  const handleCountryClick = (countryName: string) => {
    navigate(`/managers-select/${getManagerCountrySlug(countryName)}`);
  };

  const handleManagerClick = (countryName: string, managerName: string) => {
    navigate(`/managers-game/${countryName.toLowerCase()}/${getManagerSlug(managerName)}`);
  };

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
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
                World Cup Managers
              </h1>
              <p className="text-muted-foreground mt-2">Select a country to see their legendary managers</p>
            </div>
          </div>

          <div className="relative mb-8 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by country or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {hasSearch && matchingManagers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Managers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matchingManagers.map(({ country, manager }) => (
                  <Card
                    key={`${country.name}-${manager.name}`}
                    className="overflow-hidden cursor-pointer hover:border-primary transition-all border-border group"
                    onClick={() => handleManagerClick(country.name, manager.name)}
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
                        <p className="text-xs text-white/80 mb-1">{country.flag} {country.name}</p>
                        <h3 className={`text-base font-bold ${manager.isWorldCupWinner ? 'text-yellow-400' : 'text-white'}`}>
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
            </div>
          )}

          <h2 className="text-lg font-semibold text-foreground mb-4">
            {hasSearch ? 'Countries' : 'All Countries'}
          </h2>
          {filteredCountries.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No countries or managers match your search.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredCountries.map((country) => (
                <Card
                  key={country.name}
                  className="p-4 cursor-pointer transition-all border border-border hover:border-primary/50 hover:shadow-glow"
                  onClick={() => handleCountryClick(country.name)}
                >
                  <div className="text-center flex flex-col items-center gap-1.5">
                    <span className="text-5xl leading-none">{country.flag}</span>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground leading-tight min-h-[2.25rem] flex items-center justify-center line-clamp-2 px-0.5">
                      {country.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {country.managers.length} {country.managers.length === 1 ? 'manager' : 'managers'}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagersSelect;

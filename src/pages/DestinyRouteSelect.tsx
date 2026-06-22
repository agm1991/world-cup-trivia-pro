import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { Category } from '@/types/game';
import { ArrowLeft, Trophy, Flag, Search, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DESTINY_ROUTE_COUNTRIES, DESTINY_ROUTE_LEVEL_COUNT } from '@/data/destinyRouteQuestions';
import { MissingPlayerFlagIcon } from '@/components/missing-player/MissingPlayerFlagIcon';
import { getMissingPlayerTeamFlag } from '@/lib/countryFlags';

const DestinyRouteSelect = () => {
  const navigate = useNavigate();
  const { getCategoryStats } = useLocalProfile();
  const categoryStats = getCategoryStats('destiny-route' as Category);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return DESTINY_ROUTE_COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return DESTINY_ROUTE_COUNTRIES.filter(({ country }) =>
      country.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
  };

  const handleYearClick = (year: number) => {
    navigate(`/destiny-route-game?country=${encodeURIComponent(selectedCountry!)}&year=${year}`);
  };

  const handleBack = () => {
    if (selectedCountry) {
      setSelectedCountry(null);
    } else {
      navigate('/categories');
    }
  };

  const selectedData = selectedCountry
    ? DESTINY_ROUTE_COUNTRIES.find((w) => w.country === selectedCountry)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 p-1"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {!selectedCountry ? (
            <>
              <div className="mb-10">
                <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-8 sm:p-10 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_100%_60%_/_0.08),transparent_70%)] pointer-events-none" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                      <Flag className="w-3.5 h-3.5" />
                      Destiny Route
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold destiny-route-title tracking-tight">
                      Relive the Road
                      <span className="block sm:inline sm:ml-3 text-primary">→ Glory</span>
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-lg mx-auto">
                      Pick a nation. Put their opponents in order — first match to last. Prove you know the path.
                    </p>
                    <div className="flex justify-center gap-6 mt-6 flex-wrap">
                      <div className="flex items-center gap-2 text-foreground px-4 py-2.5 rounded-xl bg-background/60 border border-border">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span className="font-bold">{categoryStats?.totalScore ?? 0}</span>
                        <span className="text-muted-foreground text-sm">Score</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground px-4 py-2.5 rounded-xl bg-background/60 border border-border">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-bold">{categoryStats?.highestLevel ?? 0}</span>
                        <span className="text-muted-foreground text-sm">Level</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/levels/destiny-route')}
                      className="mt-6 text-sm font-semibold text-primary hover:underline underline-offset-4"
                    >
                      Play the full level path (levels 1–{DESTINY_ROUTE_LEVEL_COUNT}) →
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-6 max-w-md mx-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary" />
                  <Input
                    type="search"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 rounded-xl border-2 border-border bg-card/50 text-base placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200 shadow-sm hover:border-primary/30"
                    aria-label="Search countries"
                  />
                </div>
                {searchQuery && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
                  </p>
                )}
              </div>

              {filteredCountries.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border-2 border-dashed border-border bg-card/30">
                  <p className="text-muted-foreground">No countries match &quot;{searchQuery}&quot;</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {filteredCountries.map(({ country, years, isWinner }) => (
                    <button
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group"
                    >
                      <MissingPlayerFlagIcon
                        flag={getMissingPlayerTeamFlag(country)}
                        emojiClassName="text-5xl transition-transform group-hover:scale-110"
                        imageClassName="h-12 w-16 rounded-sm object-cover transition-transform group-hover:scale-110"
                      />
                      <span className={`font-bold text-lg ${isWinner ? 'text-amber-400' : 'text-foreground'}`}>{country}</span>
                      <span className="text-sm text-muted-foreground">
                        {years.length} campaign{years.length !== 1 ? 's' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-10">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change country
                </button>
                <div className="flex items-center gap-4">
                  <MissingPlayerFlagIcon
                    flag={getMissingPlayerTeamFlag(selectedCountry)}
                    emojiClassName="text-6xl drop-shadow-lg"
                    imageClassName="h-14 w-20 rounded-sm object-cover drop-shadow-lg"
                  />
                  <div>
                    <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${selectedData?.isWinner ? 'text-amber-400' : 'text-foreground'}`}>
                      {selectedCountry}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                      Choose a World Cup year — then put their opponents in order, from first match to last. Ready?
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={
                  (selectedData?.years ?? []).length === 1
                    ? 'grid grid-cols-1 gap-4 justify-items-center'
                    : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                }
              >
                {(selectedData?.years ?? []).map((year) => {
                  const isWinningYear = selectedData?.winningYears?.includes(year) ?? false;
                  const singleCampaign = (selectedData?.years ?? []).length === 1;
                  return (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 group ${
                        singleCampaign ? 'w-full max-w-lg' : ''
                      } ${
                        isWinningYear
                          ? 'border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20'
                          : 'border-border bg-card hover:border-primary hover:bg-primary/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/15'
                      }`}
                    >
                      <Trophy className={`w-10 h-10 transition-transform group-hover:scale-110 ${isWinningYear ? 'text-amber-400' : 'text-primary'}`} />
                      <span className={`text-3xl font-extrabold ${isWinningYear ? 'text-amber-600 dark:text-amber-500' : 'text-foreground'}`}>{year}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {isWinningYear ? 'Champions' : 'World Cup'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinyRouteSelect;

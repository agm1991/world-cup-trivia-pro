import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeBack } from '@/hooks/useSafeBack';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';
import { WORLD_CUP_NATIONS } from '@/data/worldCupAppearances';
import { getBundledCountryFlagImage } from '@/lib/countryFlags';

/** Historical / subnational flags whose emoji renders poorly — use bundled assets instead. */
function CountryHistoryFlag({
  name,
  emoji,
  size,
}: {
  name: string;
  emoji: string;
  size: 'grid' | 'panel';
}) {
  const bundled = getBundledCountryFlagImage(name);
  if (bundled) {
    const cls =
      size === 'grid'
        ? 'mb-1 h-9 w-[2.75rem] object-cover rounded-sm shadow-sm'
        : 'h-12 w-[4rem] object-cover rounded-sm shadow-sm';
    return <img src={bundled} alt="" className={cls} aria-hidden />;
  }
  return <span className={size === 'grid' ? 'text-4xl mb-1' : 'text-5xl'}>{emoji}</span>;
}

const CountryHistory = () => {
  const navigate = useNavigate();
  const goBack = useSafeBack('/categories');
  const [searchQuery, setSearchQuery] = useState('');

  const countries = WORLD_CUP_NATIONS.map((r) => ({
    name: r.name,
    code: r.code,
    flag: r.flag,
    worldCupYears: [...r.worldCupYears],
  }));

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
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
                Country History
              </h1>
              <p className="text-muted-foreground mt-2">Every nation that has played in a World Cup - click to see their tournaments</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-muted border-border rounded-xl focus:border-primary"
            />
          </div>

          {/* Flags Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-8">
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                className="flex flex-col items-center p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate(`/country-history/${country.code}`)}
              >
                <CountryHistoryFlag name={country.name} emoji={country.flag} size="grid" />
                <span className="text-[10px] text-center text-foreground font-medium leading-tight">{country.name}</span>
                <span className="text-[9px] text-muted-foreground">{country.worldCupYears.length} WC</span>
              </div>
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No countries found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryHistory;
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Trophy } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { useToast } from '@/hooks/use-toast';
import { hasGameAccess } from '@/lib/gameAccess';
import { WorldCountryFlag } from '@/components/WorldCountrySelect';
import { worldProfileCountries } from '@/data/worldProfileCountries';

const GENDER_OPTIONS = ['Male', 'Female'] as const;

const CreateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/';
  const { toast } = useToast();
  const { createProfile } = useLocalProfile();

  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  useEffect(() => {
    if (!hasGameAccess()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const filteredCountries = worldProfileCountries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = displayName.trim();
    const parsedAge = parseInt(age, 10);

    if (
      !trimmedName ||
      (gender !== 'Male' && gender !== 'Female') ||
      !country ||
      !Number.isFinite(parsedAge) ||
      parsedAge < 1 ||
      parsedAge > 120
    ) {
      toast({
        title: 'Missing information',
        description: 'Please fill in name, gender, age, and country.',
        variant: 'destructive',
      });
      return;
    }

    createProfile(trimmedName, country, gender, parsedAge);
    toast({
      title: 'Profile saved',
      description: 'Your profile has been recorded.',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-lg mx-auto px-4 py-8">
        <Button variant="outline" size="icon" onClick={() => navigate(returnTo)} className="mb-6">
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="mb-8 text-center">
          <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" aria-hidden />
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Create your profile
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-2">
            Choose any country in the world you want to represent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="profile-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-age">Age</Label>
            <Input
              id="profile-age"
              type="number"
              min={1}
              max={120}
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-country-search">Country</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-country-search"
                placeholder="Search any country..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="h-[min(55dvh,20rem)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-muted/20 [-webkit-overflow-scrolling:touch] sm:h-52">
              <div className="space-y-1 p-2">
                {filteredCountries.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setCountry(c.name);
                      setCountrySearch('');
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                      country === c.name
                        ? 'border border-primary/30 bg-primary/10 text-primary'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <WorldCountryFlag name={c.name} className="h-5 w-7" />
                    <span className="font-medium">{c.name}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">No countries found</p>
                )}
              </div>
            </div>
            {country && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
                <WorldCountryFlag name={country} className="h-5 w-7" />
                <span className="font-medium text-foreground">{country}</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full font-bold">
            Save profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;

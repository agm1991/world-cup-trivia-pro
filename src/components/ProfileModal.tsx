import { useState } from 'react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hasGameAccess } from '@/lib/gameAccess';
import { User, Search } from 'lucide-react';
import { countries, getCountryFlag } from '@/lib/countryFlags';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) => {
  const { createProfile } = useLocalProfile();
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const { toast } = useToast();

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasGameAccess()) {
      toast({
        title: 'Payment required',
        description: 'Complete Kick Off (£1) on the home screen before creating a profile.',
        variant: 'destructive',
      });
      onOpenChange(false);
      return;
    }
    
    if (!displayName.trim() || !country) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    createProfile(displayName.trim(), country);
    toast({
      title: 'Welcome!',
      description: 'Your journey begins now. Good luck!',
    });
    onOpenChange(false);
    setDisplayName('');
    setCountry('');
    setCountrySearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            Create Your Profile
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Set up your player identity to track your progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-foreground">
              Name
            </Label>
            <Input
              id="displayName"
              placeholder="Enter your nickname"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
              maxLength={30}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground">
              Representation
            </Label>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search country..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Country List with Flags */}
            <ScrollArea className="h-48 rounded-lg border border-border bg-muted/30">
              <div className="p-2 space-y-1">
                {filteredCountries.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCountry(c);
                      setCountrySearch('');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      country === c
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <span className="text-xl">{getCountryFlag(c)}</span>
                    <span className="font-medium">{c}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No countries found
                  </p>
                )}
              </div>
            </ScrollArea>

            {/* Selected Country Display */}
            {country && (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-xl">{getCountryFlag(country)}</span>
                <span className="text-foreground font-medium">{country}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!displayName.trim() || !country}
            className="w-full premium-button py-6 text-lg font-bold"
          >
            Start My Journey
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

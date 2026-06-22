import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Trophy, Lock, Timer, ArrowLeft } from 'lucide-react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { REQUIRE_PROFILE_TO_PLAY } from '@/hooks/useRequireProfile';
import { Switch } from '@/components/ui/switch';
import { getCountryFlagImageSrc } from '@/lib/countryFlags';

const countries: { name: string; code: string; flag: string }[] = [
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
  { name: 'Angola', code: 'AO', flag: '🇦🇴' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Austria', code: 'AT', flag: '🇦🇹' },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
  { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿' },
  { name: 'Czechoslovakia', code: 'TCH', flag: '🇨🇿' },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
  { name: 'East Germany', code: 'DD', flag: '🇩🇪' },
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
  { name: 'England', code: 'GB-ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷' },
  { name: 'Haiti', code: 'HT', flag: '🇭🇹' },
  { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'Northern Ireland', code: 'GB-NIR', flag: '🏴󠁧󠁢󠁮󠁩󠁲󠁿' },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴' },
  { name: 'Panama', code: 'PA', flag: '🇵🇦' },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦' },
  { name: 'Romania', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Scotland', code: 'GB-SCT', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸' },
  { name: 'Serbia and Montenegro', code: 'SCG', flag: '🇷🇸' },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰' },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Soviet Union', code: 'SU', flag: '🇷🇺' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  { name: 'Togo', code: 'TG', flag: '🇹🇬' },
  { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹' },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾' },
  { name: 'Wales', code: 'GB-WLS', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { name: 'Yugoslavia', code: 'YU', flag: '🇷🇸' },
  { name: 'FR Yugoslavia', code: 'FRY', flag: '🇷🇸' },
  { name: 'Zaire', code: 'CD', flag: '🇨🇩' },
];

const CountryGameIntro = () => {
  const navigate = useNavigate();
  const { countryCode, year } = useParams();
  const { profile, setShowProfileModal } = useLocalProfile();
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [flagError, setFlagError] = useState(false);

  const yearNum = parseInt(year || '2022', 10);
  const country = countries.find(c => c.code === countryCode?.toUpperCase());

  const handleStartChallenge = () => {
    if (REQUIRE_PROFILE_TO_PLAY && !profile) {
      setShowProfileModal(true);
      return;
    }
    navigate(`/country-game/${countryCode}/${yearNum}${timerEnabled ? '?timer=true' : ''}`);
  };

  if (!country) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Country not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <button
          onClick={() => navigate(countryCode ? `/country-history/${countryCode.toUpperCase()}` : '/country-history')}
          className="absolute top-24 left-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <Trophy className="w-24 h-24 text-primary" />
          </div>

          <p className="text-muted-foreground text-base uppercase tracking-widest font-medium">Get Ready</p>

          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-14 md:w-24 md:h-16 rounded overflow-hidden shrink-0 bg-muted/50 flex items-center justify-center">
              {flagError ? (
                <span className="text-3xl">{country.flag}</span>
              ) : (
                <img
                  src={getCountryFlagImageSrc(country.name)}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setFlagError(true)}
                />
              )}
            </div>
            <span className="text-6xl md:text-8xl font-bold text-foreground tabular-nums">
              {yearNum}
            </span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xl md:text-2xl font-bold text-primary uppercase tracking-[0.2em]">
              {country.name}
            </span>
            <span className="text-xl md:text-2xl font-bold text-primary uppercase tracking-[0.15em]">
              World Cup
            </span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-4 px-5 py-3 rounded-xl bg-card/50 border border-border/50">
              <Timer className={`w-5 h-5 shrink-0 ${timerEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`font-medium ${timerEnabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                Enable Timer Challenge
              </span>
              <Switch
                checked={timerEnabled}
                onCheckedChange={setTimerEnabled}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-green-500"
              />
            </div>

            {profile || !REQUIRE_PROFILE_TO_PLAY ? (
            <button
              onClick={handleStartChallenge}
              className="arcade-button group relative px-16 py-6 text-2xl font-black uppercase tracking-wider rounded-2xl
                bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600
                text-amber-950
                shadow-[0_8px_0_0_hsl(35_80%_35%),0_12px_20px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                hover:shadow-[0_6px_0_0_hsl(35_80%_35%),0_10px_16px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                hover:translate-y-[2px]
                active:shadow-[0_2px_0_0_hsl(35_80%_35%),0_4px_8px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                active:translate-y-[6px]
                transition-all duration-100 ease-out
                animate-[arcade-pulse_2s_ease-in-out_infinite]"
            >
              <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
                Kick Off
              </span>
            </button>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="w-5 h-5" />
                <span>Create a profile to start</span>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="arcade-button group relative px-16 py-6 text-2xl font-black uppercase tracking-wider rounded-2xl
                  bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600
                  text-amber-950
                  shadow-[0_8px_0_0_hsl(35_80%_35%),0_12px_20px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                  hover:shadow-[0_6px_0_0_hsl(35_80%_35%),0_10px_16px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                  hover:translate-y-[2px]
                  active:shadow-[0_2px_0_0_hsl(35_80%_35%),0_4px_8px_-4px_rgba(0,0,0,0.5),inset_0_2px_0_0_rgba(255,255,255,0.4)]
                  active:translate-y-[6px]
                  transition-all duration-100 ease-out
                  animate-[arcade-pulse_2s_ease-in-out_infinite]"
              >
                <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
                  Create Profile
                </span>
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGameIntro;

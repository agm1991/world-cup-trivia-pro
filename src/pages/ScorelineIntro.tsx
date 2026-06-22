import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Lock, Timer, ArrowLeft } from 'lucide-react';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { REQUIRE_PROFILE_TO_PLAY } from '@/hooks/useRequireProfile';
import { Switch } from '@/components/ui/switch';

const worldCupInfo: Record<number, { host: string; flag: string }> = {
  1930: { host: 'Uruguay', flag: '🇺🇾' },
  1934: { host: 'Italy', flag: '🇮🇹' },
  1938: { host: 'France', flag: '🇫🇷' },
  1950: { host: 'Brazil', flag: '🇧🇷' },
  1954: { host: 'Switzerland', flag: '🇨🇭' },
  1958: { host: 'Sweden', flag: '🇸🇪' },
  1962: { host: 'Chile', flag: '🇨🇱' },
  1966: { host: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  1970: { host: 'Mexico', flag: '🇲🇽' },
  1974: { host: 'West Germany', flag: '🇩🇪' },
  1978: { host: 'Argentina', flag: '🇦🇷' },
  1982: { host: 'Spain', flag: '🇪🇸' },
  1986: { host: 'Mexico', flag: '🇲🇽' },
  1990: { host: 'Italy', flag: '🇮🇹' },
  1994: { host: 'USA', flag: '🇺🇸' },
  1998: { host: 'France', flag: '🇫🇷' },
  2002: { host: 'South Korea/Japan', flag: '🇰🇷' },
  2006: { host: 'Germany', flag: '🇩🇪' },
  2010: { host: 'South Africa', flag: '🇿🇦' },
  2014: { host: 'Brazil', flag: '🇧🇷' },
  2018: { host: 'Russia', flag: '🇷🇺' },
  2022: { host: 'Qatar', flag: '🇶🇦' },
};

/* Winner: country name, title number (1st, 2nd...), flag ISO code for flagcdn */
const winnerInfo: Record<number, { country: string; title: string; flagCode: string }> = {
  1930: { country: 'Uruguay', title: '1st title', flagCode: 'uy' },
  1934: { country: 'Italy', title: '1st title', flagCode: 'it' },
  1938: { country: 'Italy', title: '2nd title', flagCode: 'it' },
  1950: { country: 'Uruguay', title: '2nd title', flagCode: 'uy' },
  1954: { country: 'West Germany', title: '1st title', flagCode: 'de' },
  1958: { country: 'Brazil', title: '1st title', flagCode: 'br' },
  1962: { country: 'Brazil', title: '2nd title', flagCode: 'br' },
  1966: { country: 'England', title: '1st title', flagCode: 'gb-eng' },
  1970: { country: 'Brazil', title: '3rd title', flagCode: 'br' },
  1974: { country: 'West Germany', title: '2nd title', flagCode: 'de' },
  1978: { country: 'Argentina', title: '1st title', flagCode: 'ar' },
  1982: { country: 'Italy', title: '3rd title', flagCode: 'it' },
  1986: { country: 'Argentina', title: '2nd title', flagCode: 'ar' },
  1990: { country: 'West Germany', title: '3rd title', flagCode: 'de' },
  1994: { country: 'Brazil', title: '4th title', flagCode: 'br' },
  1998: { country: 'France', title: '1st title', flagCode: 'fr' },
  2002: { country: 'Brazil', title: '5th title', flagCode: 'br' },
  2006: { country: 'Italy', title: '4th title', flagCode: 'it' },
  2010: { country: 'Spain', title: '1st title', flagCode: 'es' },
  2014: { country: 'Germany', title: '4th title', flagCode: 'de' },
  2018: { country: 'France', title: '2nd title', flagCode: 'fr' },
  2022: { country: 'Argentina', title: '3rd title', flagCode: 'ar' },
};

/* Final stadium and capacity for each World Cup */
const stadiumInfo: Record<number, { name: string; capacity: string }> = {
  1930: { name: 'Estadio Centenario', capacity: '68,346' },
  1934: { name: 'Stadio Nazionale PNF', capacity: '55,000' },
  1938: { name: 'Stade Yves-du-Manoir', capacity: '45,000' },
  1950: { name: 'Maracanã Stadium', capacity: '173,850' },
  1954: { name: 'Wankdorf Stadium', capacity: '64,000' },
  1958: { name: 'Råsunda Stadium', capacity: '50,000' },
  1962: { name: 'Estadio Nacional', capacity: '68,000' },
  1966: { name: 'Wembley Stadium', capacity: '100,000' },
  1970: { name: 'Estadio Azteca', capacity: '107,412' },
  1974: { name: 'Olympiastadion Munich', capacity: '77,000' },
  1978: { name: 'Estadio Monumental', capacity: '76,000' },
  1982: { name: 'Santiago Bernabéu', capacity: '90,000' },
  1986: { name: 'Estadio Azteca', capacity: '114,600' },
  1990: { name: 'Stadio Olimpico', capacity: '83,000' },
  1994: { name: 'Rose Bowl', capacity: '94,194' },
  1998: { name: 'Stade de France', capacity: '80,000' },
  2002: { name: 'International Stadium Yokohama', capacity: '70,000' },
  2006: { name: 'Olympiastadion Berlin', capacity: '74,000' },
  2010: { name: 'Soccer City', capacity: '84,490' },
  2014: { name: 'Maracanã Stadium', capacity: '74,738' },
  2018: { name: 'Luzhniki Stadium', capacity: '78,011' },
  2022: { name: 'Lusail Stadium', capacity: '88,966' },
};

/* Winner flag colors as subtle gradient (dark saturation for readability) */
const winnerColors: Record<number, string> = {
  1930: 'from-[#0a2342]/40 via-background to-[#7eb8da]/30', // Uruguay blue
  1934: 'from-[#009246]/30 via-background to-[#CE2B37]/30', // Italy green-red
  1938: 'from-[#002395]/30 via-background to-[#ED2939]/30', // Italy green-red (Italy won)
  1950: 'from-[#0a2342]/40 via-background to-[#7eb8da]/30', // Uruguay blue
  1954: 'from-[#000000]/50 via-background to-[#FFCC00]/25', // West Germany black-gold
  1958: 'from-[#009739]/30 via-background to-[#002776]/25', // Brazil green-blue
  1962: 'from-[#009739]/30 via-background to-[#002776]/25', // Brazil
  1966: 'from-[#CF142B]/30 via-background to-[#012169]/30', // England red-blue
  1970: 'from-[#009739]/30 via-background to-[#002776]/25', // Brazil
  1974: 'from-[#000000]/50 via-background to-[#FFCC00]/25', // West Germany
  1978: 'from-[#75AADB]/25 via-background to-[#75AADB]/20', // Argentina light blue
  1982: 'from-[#009246]/30 via-background to-[#CE2B37]/30', // Italy
  1986: 'from-[#75AADB]/25 via-background to-[#75AADB]/20', // Argentina
  1990: 'from-[#000000]/50 via-background to-[#FFCC00]/25', // West Germany
  1994: 'from-[#009739]/30 via-background to-[#002776]/25', // Brazil
  1998: 'from-[#002395]/30 via-background to-[#ED2939]/30', // France blue-red
  2002: 'from-[#009739]/30 via-background to-[#002776]/25', // Brazil
  2006: 'from-[#009246]/30 via-background to-[#CE2B37]/30', // Italy
  2010: 'from-[#C60B1E]/25 via-background to-[#FFC400]/20', // Spain red-yellow
  2014: 'from-[#000000]/50 via-background to-[#FFCC00]/25', // Germany
  2018: 'from-[#002395]/30 via-background to-[#ED2939]/30', // France
  2022: 'from-[#75AADB]/25 via-background to-[#75AADB]/20', // Argentina
};

const ScorelineIntro = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const yearNum = parseInt(year || '2022', 10);
  const { profile, setShowProfileModal } = useLocalProfile();
  const [timerEnabled, setTimerEnabled] = useState(false);

  const info = worldCupInfo[yearNum] || { host: 'World Cup', flag: '🏆' };
  const winner = winnerInfo[yearNum] || { country: 'World Cup', title: '', flagCode: 'un' };
  const stadium = stadiumInfo[yearNum] || { name: 'Final Venue', capacity: '—' };
  const hostFlagByYear: Record<number, string> = {
    1930: 'uy', 1934: 'it', 1938: 'fr', 1950: 'br', 1954: 'ch', 1958: 'se',
    1962: 'cl', 1966: 'gb-eng', 1970: 'mx', 1974: 'de', 1978: 'ar', 1982: 'es',
    1986: 'mx', 1990: 'it', 1994: 'us', 1998: 'fr', 2002: 'kr', 2006: 'de',
    2010: 'za', 2014: 'br', 2018: 'ru', 2022: 'qa',
  };
  const hostFlag = hostFlagByYear[yearNum] || 'un';
  const bgGradient = winnerColors[yearNum] || 'from-background via-background to-background';
  const flagBgUrl = `url(https://flagcdn.com/w1280/${winner.flagCode}.png)`;

  const handleStartChallenge = () => {
    if (REQUIRE_PROFILE_TO_PLAY && !profile) {
      setShowProfileModal(true);
      return;
    }
    navigate(`/scoreline-game/${yearNum}${timerEnabled ? '?timer=true' : ''}`);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-b ${bgGradient}`}>
      {/* Flag as subtle background */}
      <div
        className="absolute inset-0 opacity-[0.12] bg-cover bg-center bg-no-repeat scale-110"
        style={{ backgroundImage: flagBgUrl }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background" aria-hidden />
      <div className="relative z-10">
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/scoreline-by-year')}
          className="absolute top-24 left-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center w-full max-w-lg mx-auto">
          {/* Hero: Stadium · Year · Host (FIFA-style) */}
          <div className="flex flex-col items-center gap-5 mb-10">
            <p className="text-muted-foreground/90 text-sm font-medium tracking-wide">
              {stadium.name} <span className="text-muted-foreground/70 mx-1">·</span> <span className="tabular-nums">{stadium.capacity}</span>
            </p>
            <div className="relative py-4 px-8 my-2">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <h1 className="text-6xl md:text-8xl font-bold text-foreground tabular-nums tracking-tight drop-shadow-sm">
                {yearNum}
              </h1>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
            <div className="flex flex-col items-center gap-2 pt-1">
              <img
                src={`https://flagcdn.com/w320/${hostFlag}.png`}
                alt={`${info.host} flag`}
                className="w-24 h-16 md:w-28 md:h-[4.5rem] object-cover rounded-lg shadow-lg"
              />
              <p className="text-xl md:text-2xl font-bold text-foreground uppercase tracking-wider">
                {info.host}
              </p>
              <p className="text-lg md:text-xl font-semibold text-primary uppercase tracking-widest">
                World Cup
              </p>
            </div>
          </div>

          {/* Timer Toggle */}
          <div className="inline-flex items-center gap-4 px-5 py-3 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm mb-6">
            <Timer className={`w-5 h-5 shrink-0 ${timerEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-base font-medium ${timerEnabled ? 'text-foreground' : 'text-muted-foreground'}`}>
              Enable Timer Challenge
            </span>
            <Switch
              checked={timerEnabled}
              onCheckedChange={setTimerEnabled}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-green-500"
            />
          </div>
          {timerEnabled && (
            <p className="text-xs text-muted-foreground mb-2">15 seconds per question</p>
          )}

          {/* Arcade Style Button */}
          <div className="mt-8">
          {profile || !REQUIRE_PROFILE_TO_PLAY ? (
            <button
              onClick={handleStartChallenge}
              className="arcade-button group relative px-20 py-6 text-xl md:text-2xl font-black uppercase tracking-wider rounded-2xl
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
                className="arcade-button group relative px-20 py-6 text-xl md:text-2xl font-black uppercase tracking-wider rounded-2xl
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
    </div>
  );
};

export default ScorelineIntro;

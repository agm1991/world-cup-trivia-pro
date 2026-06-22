import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { getWinnerStarPlayer } from '@/data/worldCupWinnerStarPlayers';
import { WORLD_CUP_WINNER_COUNTRY_THEMES } from '@/data/worldCupWinnersCountryThemes';
import { cn } from '@/lib/utils';
import { Category } from '@/types/game';
import { Trophy, ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react';

const COUNTRY_INTROS: Record<string, string> = {
  brazil: 'The only nation to win five World Cups. Samba football at its finest—Pelé, Garrincha, Ronaldo, and the beautiful game.',
  germany: 'Four titles, ruthless efficiency. From the Miracle of Bern to Miroslav Klose\'s record, Die Mannschaft always delivers.',
  italy: 'Four crowns built on defence and flair. The Azzurri blend catenaccio with moments of pure magic.',
  argentina: 'Passion, drama, and genius. From Kempes to Maradona to Messi—Argentina\'s World Cup story is unforgettable.',
  france: 'Les Bleus: Zidane\'s brilliance, Mbappé\'s speed. Two titles, a nation united by football.',
  uruguay: 'The first champions. Uruguay\'s 1930 and 1950 triumphs wrote the opening chapters of World Cup history.',
  england: '1966 and all that. It\'s coming home—once. Sir Bobby, Hurst\'s hat-trick, glory at Wembley.',
  spain: 'Tiki-taka perfection. Iniesta\'s extra-time winner in 2010 crowned Spain\'s golden generation.',
};

const CAMPAIGN_DESCRIPTIONS: Record<string, Record<number, string>> = {
  brazil: {
    1958: 'First title in Sweden. Pelé burst onto the scene aged 17.',
    1962: 'Chile. Garrincha shone after Pelé’s injury. Back-to-back crowns.',
    1970: 'Mexico. The greatest team ever. Jairzinho scored in every game.',
    1994: 'USA. Won on penalties vs Italy. Romário and Bebeto led the charge.',
    2002: 'Japan & Korea. Ronaldo’s redemption. Perfect 7 wins from 7.',
  },
  germany: {
    1954: 'Switzerland. The Miracle of Bern. West Germany stunned Hungary 3–2.',
    1974: 'West Germany. Beckenbauer led. Beat Cruyff\'s Netherlands at home.',
    1990: 'Italy. Reunification year. Matthäus, Klinsmann, and a third star.',
    2014: 'Brazil. Humiliation of the hosts. Götze\'s extra-time winner in the Maracanã.',
  },
  italy: {
    1934: 'Italy. Hosts won on home soil. First of four crowns.',
    1938: 'France. Pozzo\'s back-to-back. Piola and Meazza starred.',
    1982: 'Spain. Rossi\'s hat-trick vs Brazil. Bearzot\'s heroes.',
    2006: 'Germany. Cannavaro immense. Zidane\'s headbutt, Totti\'s cool penalty.',
  },
  argentina: {
    1978: 'Argentina. Kempes on fire at home. Controversy and glory in Buenos Aires.',
    1986: 'Mexico. Maradona\'s World Cup. The Hand of God and the Goal of the Century.',
    2022: 'Qatar. Messi\'s crowning moment. Penalty shootout glory vs France.',
  },
  france: {
    1998: 'France. Zidane\'s headers. First title on home soil.',
    2018: 'Russia. Mbappé announced. Griezmann, Pogba, and a second star.',
  },
  uruguay: {
    1930: 'Uruguay. The very first World Cup. Hosts beat Argentina in the final.',
    1950: 'Brazil. Maracanazo. Uruguay stunned 200,000 in Rio. Greatest upset ever.',
  },
  england: {
    1966: 'England. Hurst\'s hat-trick. Was it over the line? Champions.',
  },
  spain: {
    2010: 'South Africa. Iniesta\'s 116th-minute winner. Tiki-taka conquered the world.',
  },
};

type WinnerDef = {
  name: string;
  flagCode: string;
  years: number[];
  titles: number;
};

const WINNERS: WinnerDef[] = [
  {
    name: 'Brazil',
    flagCode: 'br',
    years: [1958, 1962, 1970, 1994, 2002],
    titles: 5,
  },
  {
    name: 'Germany',
    flagCode: 'de',
    years: [1954, 1974, 1990, 2014],
    titles: 4,
  },
  {
    name: 'Italy',
    flagCode: 'it',
    years: [1934, 1938, 1982, 2006],
    titles: 4,
  },
  {
    name: 'Argentina',
    flagCode: 'ar',
    years: [1978, 1986, 2022],
    titles: 3,
  },
  {
    name: 'France',
    flagCode: 'fr',
    years: [1998, 2018],
    titles: 2,
  },
  {
    name: 'Uruguay',
    flagCode: 'uy',
    years: [1930, 1950],
    titles: 2,
  },
  {
    name: 'England',
    flagCode: 'gb-eng',
    years: [1966],
    titles: 1,
  },
  {
    name: 'Spain',
    flagCode: 'es',
    years: [2010],
    titles: 1,
  },
];

const WorldCupWinnersCountry = () => {
  const navigate = useNavigate();
  const { country } = useParams<{ country: string }>();
  const { getCategoryStats } = useLocalProfile();
  const categoryStats = getCategoryStats('world-cup-winners' as Category);

  const winner = WINNERS.find(
    (w) => w.name.toLowerCase() === country?.toLowerCase()
  );

  const handleYearClick = (year: number) => {
    if (winner) {
      navigate(`/winners-game/${winner.name.toLowerCase()}/${year}`);
    }
  };

  const handleBack = () => {
    navigate('/world-cup-winners');
  };

  if (!winner) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 p-1"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <p className="text-muted-foreground">Country not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const theme =
    WORLD_CUP_WINNER_COUNTRY_THEMES[winner.name.toLowerCase()] ?? WORLD_CUP_WINNER_COUNTRY_THEMES.brazil;
  const cardStyles = theme.cardStyles;
  const descriptions = CAMPAIGN_DESCRIPTIONS[winner.name.toLowerCase()];
  const intro = COUNTRY_INTROS[winner.name.toLowerCase()];

  const titleYears = [...winner.years].sort((a, b) => a - b);

  const getYearDescription = (year: number): string | undefined => descriptions?.[year];
  const isSingleTitleCountry = winner.titles === 1;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: theme.bg }}
      />
      <div className="stadium-lights" />

      <Navigation />
      <div className="relative flex-1 flex flex-col py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-4 p-1 -ml-1 group"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium">Back to winners</span>
          </button>

          <header className="mb-4">
            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
              <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
                <div
                  className="flex items-center justify-center w-24 h-16 sm:w-28 sm:h-[4.5rem] rounded-xl border-2 border-border/60 bg-card/90 shadow-xl overflow-hidden flex-shrink-0"
                  style={{ boxShadow: '0 8px 32px hsl(222 47% 3% / 0.6)' }}
                >
                  <img
                    src={`https://flagcdn.com/w320/${winner.flagCode}.png`}
                    alt={`${winner.name} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight category-title-animated">
                  {winner.name}
                </h1>
              </div>
              <p
                className={cn(
                  'flex flex-wrap items-center justify-center w-full max-w-3xl mx-auto px-2 sm:px-6',
                  winner.titles <= 2
                    ? 'gap-x-10 gap-y-2 sm:gap-x-20 md:gap-x-28 lg:gap-x-36 text-3xl sm:text-4xl md:text-5xl'
                    : 'gap-1 sm:gap-1.5 text-2xl sm:text-3xl'
                )}
                aria-label={`${winner.titles} World Cup ${winner.titles === 1 ? 'title' : 'titles'}`}
              >
                {Array.from({ length: winner.titles }, (_, i) => (
                  <span key={i} className="leading-none select-none" aria-hidden>
                    🏆
                  </span>
                ))}
              </p>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
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
              {intro && (
                <p className="text-muted-foreground/90 text-xs sm:text-sm leading-relaxed mt-1 max-w-2xl mx-auto">
                  {intro}
                </p>
              )}
            </div>
          </header>

          <section
            className={cn(
              'flex-1 min-h-[260px] flex flex-col',
              isSingleTitleCountry && 'justify-center items-center'
            )}
          >
            <div
              className={cn(
                'w-full',
                isSingleTitleCountry
                  ? 'flex justify-center'
                  : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 flex-1 gap-4 sm:gap-6'
              )}
              style={isSingleTitleCountry ? undefined : { gridAutoRows: 'minmax(140px, 1fr)' }}
            >
              {titleYears.map((year, i) => {
                const style = cardStyles[i % cardStyles.length];
                const blurb = getYearDescription(year);
                const star = getWinnerStarPlayer(winner.name.toLowerCase(), year);
                return (
                  <Card
                    key={year}
                    className={cn(
                      'group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] border-2 flex flex-col min-h-[160px] relative',
                      isSingleTitleCountry && 'w-full max-w-xs sm:max-w-sm'
                    )}
                    style={{
                      background: style.bg,
                      borderColor: style.border,
                      borderRadius: style.radius,
                      boxShadow: '0 4px 20px hsl(0 0% 0% / 0.2)',
                    }}
                    onClick={() => handleYearClick(year)}
                  >
                    {star?.image ? (
                      <>
                        <img
                          src={star.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-[0.22] scale-105 pointer-events-none transition-opacity group-hover:opacity-[0.28]"
                          style={{ objectPosition: star.imageObjectPosition ?? 'center 15%' }}
                          loading="lazy"
                          decoding="async"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/45 via-background/30 to-background/88"
                          aria-hidden
                        />
                      </>
                    ) : null}
                    <div className="relative z-10 flex flex-col flex-1 p-4 justify-between min-h-[140px]">
                      <div className="flex flex-col items-center justify-center flex-1">
                        <span
                          className="text-[0.65rem] uppercase tracking-wider font-semibold text-muted-foreground mb-1"
                          aria-hidden
                        >
                          Champion
                        </span>
                        <span
                          className="text-2xl sm:text-3xl font-bold drop-shadow-sm"
                          style={{ color: style.accent }}
                        >
                          {year}
                        </span>
                        {star?.name ? (
                          <span className="text-[0.7rem] sm:text-xs font-semibold text-foreground/85 mt-1.5 text-center leading-tight px-1">
                            {star.name}
                          </span>
                        ) : null}
                        <ChevronRight
                          className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-2"
                          style={{ color: style.accent }}
                        />
                      </div>
                      {blurb && (
                        <p className="text-[0.65rem] sm:text-xs text-muted-foreground/90 mt-2 leading-tight line-clamp-3 border-t border-white/10 pt-2">
                          {blurb}
                        </p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-center shrink-0">
            <Trophy className="w-3 h-3 text-primary/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldCupWinnersCountry;

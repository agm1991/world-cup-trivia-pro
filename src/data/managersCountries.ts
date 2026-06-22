import lippiImg from '@/assets/managers/lippi.jpg';
import scolariImg from '@/assets/managers/scolari.jpg';
import lowImg from '@/assets/managers/low.jpg';
import herbergerImg from '@/assets/managers/sepp-herberger.jpg';
import schonImg from '@/assets/managers/helmut-schon.jpg';
import beckenbauerImg from '@/assets/managers/franz-beckenbauer.jpg';
import delbosqueImg from '@/assets/managers/delbosque.jpg';
import scolariPortugalImg from '@/assets/managers/scolari-portugal.jpg';
import tabarezImg from '@/assets/managers/tabarez.jpg';
import scaloniImg from '@/assets/managers/scaloni.avif';
import bilardoImg from '@/assets/managers/carlos-bilardo.jpg';
import menottiImg from '@/assets/managers/cesar-luis-menotti.jpg';
import sabellaImg from '@/assets/managers/alejandro-sabella.jpeg';
import martinezImg from '@/assets/managers/roberto-martinez.jpg';
import feolaImg from '@/assets/managers/vicente-feola.jpg';
import moreiraImg from '@/assets/managers/aymore-moreira.png';
import zagalloImg from '@/assets/managers/mario-zagallo.jpg';
import teleSantanaImg from '@/assets/managers/tele-santana.jpg';
import parreiraImg from '@/assets/managers/carlos-alberto-parreira.jpg';
import trapattoniImg from '@/assets/managers/trapattoni.jpg';
import pozzoImg from '@/assets/managers/vittorio-pozzo.jpg';
import bearzotImg from '@/assets/managers/enzo-bearzot.jpg';
import southgateImg from '@/assets/managers/southgate.avif';
import svenErikssonImg from '@/assets/managers/sven-eriksson.jpg';
import fabioCapelloImg from '@/assets/managers/fabio-capello.jpg';
import royHodgsonImg from '@/assets/managers/roy-hodgson.jpg';
import aimeJacquetImg from '@/assets/managers/aime-jacquet.jpg';
import didierDeschampsImg from '@/assets/managers/didier-deschamps.jpg';
import ramseyImg from '@/assets/managers/alf-ramsey.png';
import hidalgoImg from '@/assets/managers/michel-hidalgo.jpg';
import pekermanImg from '@/assets/managers/jose-pekerman.jpg';
import blazevicImg from '@/assets/managers/miroslav-blazevic.jpg';
import dalicImg from '@/assets/managers/zlatko-dalic.jpg';
import michelsImg from '@/assets/managers/rinus-michels.jpg';
import vangaalImg from '@/assets/managers/louis-van-gaal.jpg';
import vanMarwijkImg from '@/assets/managers/bert-van-marwijk.jpg';
import renardImg from '@/assets/managers/herve-renard.jpg';
import metsuImg from '@/assets/managers/bruno-metsu.jpg';
import hiddinkImg from '@/assets/managers/guus-hiddink.jpg';
import fontanaImg from '@/assets/managers/juan-lopez-fontana.png';
import northKorea1966FlagImg from '@/assets/managers/north-korea-1966-flag.svg';
import suppiciImg from '@/assets/managers/alberto-suppici.jpg';
import halilhodzicImg from '@/assets/managers/vahid-halilhodzic.jpg';
import meislImg from '@/assets/managers/hugo-meisl.jpg';
import thysImg from '@/assets/managers/guy-thys.jpg';
import penevImg from '@/assets/managers/dimitar-penev.jpg';
import nepomnyashchyImg from '@/assets/managers/valeri-nepomnyashchy.jpg';
import bielsaImg from '@/assets/managers/marcelo-bielsa.jpg';
import sampaoliImg from '@/assets/managers/jorge-sampaoli.jpg';
import maturanaImg from '@/assets/managers/francisco-maturana.jpg';
import pintoImg from '@/assets/managers/jorge-luis-pinto.png';
import piontekImg from '@/assets/managers/sepp-piontek.jpg';
import robsonImg from '@/assets/managers/bobby-robson.jpg';
import domenechImg from '@/assets/managers/raymond-domenech.jpg';
import rajevacImg from '@/assets/managers/milovan-rajevac.jpg';
import klinsmannImg from '@/assets/managers/jurgen-klinsmann.jpg';
import sebesImg from '@/assets/managers/gusztav-sebes.jpg';
import viciniImg from '@/assets/managers/azeglio-vicini.jpg';
import sacchiImg from '@/assets/managers/arrigo-sacchi.jpg';
import okadaImg from '@/assets/managers/takeshi-okada.jpg';
import herreraImg from '@/assets/managers/miguel-herrera.jpg';
import regraguiImg from '@/assets/managers/walid-regragui.jpg';
import happelImg from '@/assets/managers/ernst-happel.jpg';
import westerhofImg from '@/assets/managers/clemens-westerhof.jpg';
import olsenImg from '@/assets/managers/egil-olsen.jpg';
import martinoImg from '@/assets/managers/gerardo-martino.jpg';
import didiImg from '@/assets/managers/didi.jpg';
import gorskiImg from '@/assets/managers/kazimierz-gorski.jpg';
import piechniczekImg from '@/assets/managers/antoni-piechniczek.jpg';
import gloriaImg from '@/assets/managers/otto-gloria.jpg';
import charltonImg from '@/assets/managers/jack-charlton.jpg';
import mccarthyImg from '@/assets/managers/mick-mccarthy.jpg';
import iordanescuImg from '@/assets/managers/anghel-iordanescu.jpg';
import lobanovskyiImg from '@/assets/managers/valeriy-lobanovskyi.jpg';
import raynorImg from '@/assets/managers/george-raynor.jpg';
import svenssonImg from '@/assets/managers/tommy-svensson.png';
import rappanImg from '@/assets/managers/karl-rappan.jpg';
import kuhnImg from '@/assets/managers/kobi-kuhn.jpg';
import gunesImg from '@/assets/managers/senol-gunes.jpg';
import blokhinImg from '@/assets/managers/oleh-blokhin.jpg';
import arenaImg from '@/assets/managers/bruce-arena.jpg';
import murphyImg from '@/assets/managers/jimmy-murphy.jpg';
import osimImg from '@/assets/managers/ivica-osim.jpg';
import placeholderImg from '@/assets/managers/placeholder-manager.svg';

export interface ManagerCountryManager {
  name: string;
  image: string;
  achievement: string;
  worldCupYear: number;
  isWorldCupWinner?: boolean;
  worldCupNumber?: number;
}

export interface ManagerCountry {
  name: string;
  flag: string;
  titles: number;
  managers: ManagerCountryManager[];
}

export interface ManagerSearchResult {
  country: ManagerCountry;
  manager: ManagerCountryManager;
}

const managerCountriesData: ManagerCountry[] = [
  {
    name: 'Algeria',
    flag: '🇩🇿',
    titles: 0,
    managers: [
      { name: 'Vahid Halilhodžić', image: halilhodzicImg, achievement: 'World Cup 2014 R16', worldCupYear: 2014 },
    ],
  },
  {
    name: 'Argentina',
    flag: '🇦🇷',
    titles: 3,
    managers: [
      { name: 'César Luis Menotti', image: menottiImg, achievement: 'World Cup 1978', worldCupYear: 1978, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Carlos Bilardo', image: bilardoImg, achievement: 'World Cup 1986', worldCupYear: 1986, isWorldCupWinner: true, worldCupNumber: 2 },
      { name: 'Alejandro Sabella', image: sabellaImg, achievement: 'World Cup 2014 Final', worldCupYear: 2014 },
      { name: 'Lionel Scaloni', image: scaloniImg, achievement: 'World Cup 2022', worldCupYear: 2022, isWorldCupWinner: true, worldCupNumber: 3 },
    ],
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    titles: 0,
    managers: [
      { name: 'Guus Hiddink', image: hiddinkImg, achievement: 'World Cup 2006 R16', worldCupYear: 2006 },
    ],
  },
  {
    name: 'Austria',
    flag: '🇦🇹',
    titles: 0,
    managers: [
      { name: 'Hugo Meisl', image: meislImg, achievement: 'World Cup 1934 Semi-Final', worldCupYear: 1934 },
    ],
  },
  {
    name: 'Belgium',
    flag: '🇧🇪',
    titles: 0,
    managers: [
      { name: 'Guy Thys', image: thysImg, achievement: 'World Cup 1986 — 4th Place', worldCupYear: 1986 },
      { name: 'Roberto Martínez', image: martinezImg, achievement: 'World Cup 2018 — 3rd Place', worldCupYear: 2018 },
    ],
  },
  {
    name: 'Brazil',
    flag: '🇧🇷',
    titles: 5,
    managers: [
      { name: 'Vicente Feola', image: feolaImg, achievement: 'World Cup 1958', worldCupYear: 1958, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Aymoré Moreira', image: moreiraImg, achievement: 'World Cup 1962', worldCupYear: 1962, isWorldCupWinner: true, worldCupNumber: 2 },
      { name: 'Mário Zagallo', image: zagalloImg, achievement: 'World Cup 1970', worldCupYear: 1970, isWorldCupWinner: true, worldCupNumber: 3 },
      { name: 'Telê Santana', image: teleSantanaImg, achievement: 'World Cup 1982', worldCupYear: 1982 },
      { name: 'Carlos Alberto Parreira', image: parreiraImg, achievement: 'World Cup 1994', worldCupYear: 1994, isWorldCupWinner: true, worldCupNumber: 4 },
      { name: 'Luiz Felipe Scolari', image: scolariImg, achievement: 'World Cup 2002', worldCupYear: 2002, isWorldCupWinner: true, worldCupNumber: 5 },
    ],
  },
  {
    name: 'Bulgaria',
    flag: '🇧🇬',
    titles: 0,
    managers: [
      { name: 'Dimitar Penev', image: penevImg, achievement: 'World Cup 1994 — 4th Place', worldCupYear: 1994 },
    ],
  },
  {
    name: 'Cameroon',
    flag: '🇨🇲',
    titles: 0,
    managers: [
      { name: 'Valeriy Nepomnyashchy', image: nepomnyashchyImg, achievement: 'World Cup 1990 QF', worldCupYear: 1990 },
    ],
  },
  {
    name: 'Chile',
    flag: '🇨🇱',
    titles: 0,
    managers: [
      { name: 'Marcelo Bielsa', image: bielsaImg, achievement: 'World Cup 2010 R16', worldCupYear: 2010 },
      { name: 'Jorge Sampaoli', image: sampaoliImg, achievement: 'World Cup 2014 R16', worldCupYear: 2014 },
    ],
  },
  {
    name: 'Colombia',
    flag: '🇨🇴',
    titles: 0,
    managers: [
      { name: 'Francisco Maturana', image: maturanaImg, achievement: 'World Cup 1990 R16', worldCupYear: 1990 },
      { name: 'José Pékerman', image: pekermanImg, achievement: 'World Cup 2014 QF', worldCupYear: 2014 },
    ],
  },
  {
    name: 'Costa Rica',
    flag: '🇨🇷',
    titles: 0,
    managers: [
      { name: 'Jorge Luis Pinto', image: pintoImg, achievement: 'World Cup 2014 QF', worldCupYear: 2014 },
    ],
  },
  {
    name: 'Czechoslovakia',
    flag: '🇨🇿',
    titles: 0,
    managers: [
      { name: 'Rudolf Vytlačil', image: placeholderImg, achievement: 'World Cup 1962 Final', worldCupYear: 1962 },
    ],
  },
  {
    name: 'Croatia',
    flag: '🇭🇷',
    titles: 0,
    managers: [
      { name: 'Miroslav Blažević', image: blazevicImg, achievement: 'World Cup 1998 — 3rd Place', worldCupYear: 1998 },
      { name: 'Zlatko Dalić', image: dalicImg, achievement: 'World Cup 2018 Final', worldCupYear: 2018 },
    ],
  },
  {
    name: 'Denmark',
    flag: '🇩🇰',
    titles: 0,
    managers: [
      { name: 'Sepp Piontek', image: piontekImg, achievement: 'World Cup 1986 R16', worldCupYear: 1986 },
    ],
  },
  {
    name: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    titles: 1,
    managers: [
      { name: 'Sir Alf Ramsey', image: ramseyImg, achievement: 'World Cup 1966', worldCupYear: 1966, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Sir Bobby Robson', image: robsonImg, achievement: 'World Cup 1990 Semi-Final', worldCupYear: 1990 },
      { name: 'Sven-Göran Eriksson', image: svenErikssonImg, achievement: 'World Cup 2002 & 2006 QF', worldCupYear: 2002 },
      { name: 'Fabio Capello', image: fabioCapelloImg, achievement: 'WC 2010 Last 16', worldCupYear: 2010 },
      { name: 'Roy Hodgson', image: royHodgsonImg, achievement: 'WC 2014 Group Stage', worldCupYear: 2014 },
      { name: 'Gareth Southgate', image: southgateImg, achievement: 'World Cup 2018 & 2022', worldCupYear: 2018 },
    ],
  },
  {
    name: 'France',
    flag: '🇫🇷',
    titles: 2,
    managers: [
      { name: 'Michel Hidalgo', image: hidalgoImg, achievement: 'World Cup 1982 Semi-Final', worldCupYear: 1982 },
      { name: 'Aimé Jacquet', image: aimeJacquetImg, achievement: 'World Cup 1998', worldCupYear: 1998, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Raymond Domenech', image: domenechImg, achievement: 'World Cup 2006 Final', worldCupYear: 2006 },
      { name: 'Didier Deschamps', image: didierDeschampsImg, achievement: 'World Cup 2018', worldCupYear: 2018, isWorldCupWinner: true, worldCupNumber: 2 },
    ],
  },
  {
    name: 'Ghana',
    flag: '🇬🇭',
    titles: 0,
    managers: [
      { name: 'Milovan Rajevac', image: rajevacImg, achievement: 'World Cup 2010 QF', worldCupYear: 2010 },
    ],
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    titles: 4,
    managers: [
      { name: 'Sepp Herberger', image: herbergerImg, achievement: 'World Cup 1954', worldCupYear: 1954, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Helmut Schön', image: schonImg, achievement: 'World Cup 1974', worldCupYear: 1974, isWorldCupWinner: true, worldCupNumber: 2 },
      { name: 'Franz Beckenbauer', image: beckenbauerImg, achievement: 'World Cup 1990', worldCupYear: 1990, isWorldCupWinner: true, worldCupNumber: 3 },
      { name: 'Jürgen Klinsmann', image: klinsmannImg, achievement: 'World Cup 2006 Semi-Final', worldCupYear: 2006 },
      { name: 'Joachim Löw', image: lowImg, achievement: 'World Cup 2014', worldCupYear: 2014, isWorldCupWinner: true, worldCupNumber: 4 },
    ],
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    titles: 0,
    managers: [
      { name: 'Gusztáv Sebes', image: sebesImg, achievement: 'World Cup 1954 Final', worldCupYear: 1954 },
    ],
  },
  {
    name: 'Italy',
    flag: '🇮🇹',
    titles: 4,
    managers: [
      { name: 'Vittorio Pozzo', image: pozzoImg, achievement: 'World Cup 1934 & 1938', worldCupYear: 1934, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Enzo Bearzot', image: bearzotImg, achievement: 'World Cup 1982', worldCupYear: 1982, isWorldCupWinner: true, worldCupNumber: 3 },
      { name: 'Azeglio Vicini', image: viciniImg, achievement: 'World Cup 1990 — 3rd Place', worldCupYear: 1990 },
      { name: 'Arrigo Sacchi', image: sacchiImg, achievement: 'World Cup 1994 Final', worldCupYear: 1994 },
      { name: 'Giovanni Trapattoni', image: trapattoniImg, achievement: 'WC 2002 Last 16', worldCupYear: 2002 },
      { name: 'Marcello Lippi', image: lippiImg, achievement: 'World Cup 2006', worldCupYear: 2006, isWorldCupWinner: true, worldCupNumber: 4 },
    ],
  },
  {
    name: 'Japan',
    flag: '🇯🇵',
    titles: 0,
    managers: [
      { name: 'Takeshi Okada', image: okadaImg, achievement: 'World Cup 2010 R16', worldCupYear: 2010 },
    ],
  },
  {
    name: 'Mexico',
    flag: '🇲🇽',
    titles: 0,
    managers: [
      { name: 'Miguel Herrera', image: herreraImg, achievement: 'World Cup 2014 R16', worldCupYear: 2014 },
    ],
  },
  {
    name: 'Morocco',
    flag: '🇲🇦',
    titles: 0,
    managers: [
      { name: 'Walid Regragui', image: regraguiImg, achievement: 'World Cup 2022 Semi-Final', worldCupYear: 2022 },
    ],
  },
  {
    name: 'Netherlands',
    flag: '🇳🇱',
    titles: 0,
    managers: [
      { name: 'Rinus Michels', image: michelsImg, achievement: 'World Cup 1974 Final', worldCupYear: 1974 },
      { name: 'Ernst Happel', image: happelImg, achievement: 'World Cup 1978 Final', worldCupYear: 1978 },
      { name: 'Guus Hiddink', image: hiddinkImg, achievement: 'World Cup 1998 Semi-Final', worldCupYear: 1998 },
      { name: 'Bert van Marwijk', image: vanMarwijkImg, achievement: 'World Cup 2010 Final', worldCupYear: 2010 },
      { name: 'Louis van Gaal', image: vangaalImg, achievement: 'World Cup 2014 — 3rd Place', worldCupYear: 2014 },
    ],
  },
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    titles: 0,
    managers: [
      { name: 'Clemens Westerhof', image: westerhofImg, achievement: 'World Cup 1994 R16', worldCupYear: 1994 },
    ],
  },
  {
    name: 'North Korea',
    flag: '🇰🇵',
    titles: 0,
    managers: [
      { name: 'Myung Rye-hyun', image: northKorea1966FlagImg, achievement: 'World Cup 1966 QF', worldCupYear: 1966 },
    ],
  },
  {
    name: 'Norway',
    flag: '🇳🇴',
    titles: 0,
    managers: [
      { name: 'Egil "Drillo" Olsen', image: olsenImg, achievement: 'World Cup 1994 & 1998', worldCupYear: 1994 },
    ],
  },
  {
    name: 'Paraguay',
    flag: '🇵🇾',
    titles: 0,
    managers: [
      { name: 'Gerardo Martino', image: martinoImg, achievement: 'World Cup 2010 QF', worldCupYear: 2010 },
    ],
  },
  {
    name: 'Peru',
    flag: '🇵🇪',
    titles: 0,
    managers: [
      { name: 'Didi', image: didiImg, achievement: 'World Cup 1970 QF', worldCupYear: 1970 },
    ],
  },
  {
    name: 'Poland',
    flag: '🇵🇱',
    titles: 0,
    managers: [
      { name: 'Kazimierz Górski', image: gorskiImg, achievement: 'World Cup 1974 — 3rd Place', worldCupYear: 1974 },
      { name: 'Antoni Piechniczek', image: piechniczekImg, achievement: 'World Cup 1982 — 3rd Place', worldCupYear: 1982 },
    ],
  },
  {
    name: 'Portugal',
    flag: '🇵🇹',
    titles: 0,
    managers: [
      { name: 'Otto Glória', image: gloriaImg, achievement: 'World Cup 1966 — 3rd Place', worldCupYear: 1966 },
      { name: 'Luiz Felipe Scolari', image: scolariPortugalImg, achievement: 'World Cup 2006 Semi-Final', worldCupYear: 2006 },
    ],
  },
  {
    name: 'Republic of Ireland',
    flag: '🇮🇪',
    titles: 0,
    managers: [
      { name: 'Jack Charlton', image: charltonImg, achievement: 'World Cup 1990 QF', worldCupYear: 1990 },
      { name: 'Mick McCarthy', image: mccarthyImg, achievement: 'World Cup 2002 R16', worldCupYear: 2002 },
    ],
  },
  {
    name: 'Romania',
    flag: '🇷🇴',
    titles: 0,
    managers: [
      { name: 'Anghel Iordănescu', image: iordanescuImg, achievement: 'World Cup 1994 QF', worldCupYear: 1994 },
    ],
  },
  {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    titles: 0,
    managers: [
      { name: 'Hervé Renard', image: renardImg, achievement: 'World Cup 2022 — Beat Argentina', worldCupYear: 2022 },
    ],
  },
  {
    name: 'Senegal',
    flag: '🇸🇳',
    titles: 0,
    managers: [
      { name: 'Bruno Metsu', image: metsuImg, achievement: 'World Cup 2002 QF', worldCupYear: 2002 },
    ],
  },
  {
    name: 'South Korea',
    flag: '🇰🇷',
    titles: 0,
    managers: [
      { name: 'Guus Hiddink', image: hiddinkImg, achievement: 'World Cup 2002 Semi-Final', worldCupYear: 2002 },
    ],
  },
  {
    name: 'Soviet Union',
    flag: '🇷🇺',
    titles: 0,
    managers: [
      { name: 'Valeriy Lobanovskyi', image: lobanovskyiImg, achievement: 'World Cup 1986 R16', worldCupYear: 1986 },
    ],
  },
  {
    name: 'Spain',
    flag: '🇪🇸',
    titles: 1,
    managers: [
      { name: 'Vicente del Bosque', image: delbosqueImg, achievement: 'World Cup 2010', worldCupYear: 2010, isWorldCupWinner: true, worldCupNumber: 1 },
    ],
  },
  {
    name: 'Sweden',
    flag: '🇸🇪',
    titles: 0,
    managers: [
      { name: 'George Raynor', image: raynorImg, achievement: 'World Cup 1958 Final', worldCupYear: 1958 },
      { name: 'Tommy Svensson', image: svenssonImg, achievement: 'World Cup 1994 — 3rd Place', worldCupYear: 1994 },
    ],
  },
  {
    name: 'Switzerland',
    flag: '🇨🇭',
    titles: 0,
    managers: [
      { name: 'Karl Rappan', image: rappanImg, achievement: 'World Cup 1954 QF', worldCupYear: 1954 },
      { name: 'Köbi Kuhn', image: kuhnImg, achievement: 'World Cup 2006 R16', worldCupYear: 2006 },
    ],
  },
  {
    name: 'Turkey',
    flag: '🇹🇷',
    titles: 0,
    managers: [
      { name: 'Şenol Güneş', image: gunesImg, achievement: 'World Cup 2002 — 3rd Place', worldCupYear: 2002 },
    ],
  },
  {
    name: 'Ukraine',
    flag: '🇺🇦',
    titles: 0,
    managers: [
      { name: 'Oleg Blokhin', image: blokhinImg, achievement: 'World Cup 2006 QF', worldCupYear: 2006 },
    ],
  },
  {
    name: 'United States',
    flag: '🇺🇸',
    titles: 0,
    managers: [
      { name: 'Bruce Arena', image: arenaImg, achievement: 'World Cup 2002 QF', worldCupYear: 2002 },
    ],
  },
  {
    name: 'Uruguay',
    flag: '🇺🇾',
    titles: 2,
    managers: [
      { name: 'Alberto Suppici', image: suppiciImg, achievement: 'World Cup 1930', worldCupYear: 1930, isWorldCupWinner: true, worldCupNumber: 1 },
      { name: 'Juan López Fontana', image: fontanaImg, achievement: 'World Cup 1950', worldCupYear: 1950, isWorldCupWinner: true, worldCupNumber: 2 },
      { name: 'Óscar Tabárez', image: tabarezImg, achievement: 'World Cup 2010 Semi-Final', worldCupYear: 2010 },
    ],
  },
  {
    name: 'Wales',
    flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    titles: 0,
    managers: [
      { name: 'Jimmy Murphy', image: murphyImg, achievement: 'World Cup 1958 QF', worldCupYear: 1958 },
    ],
  },
  {
    name: 'Yugoslavia',
    flag: '🇷🇸',
    titles: 0,
    managers: [
      { name: 'Ivica Osim', image: osimImg, achievement: 'World Cup 1990 QF', worldCupYear: 1990 },
    ],
  },
];

export const managerCountries: ManagerCountry[] = [...managerCountriesData].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export function normalizeManagerSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

export function countryMatchesSearch(country: ManagerCountry, query: string): boolean {
  const q = normalizeManagerSearch(query);
  if (!q) return true;
  if (normalizeManagerSearch(country.name).includes(q)) return true;
  return country.managers.some(
    (m) =>
      normalizeManagerSearch(m.name).includes(q) ||
      normalizeManagerSearch(m.achievement).includes(q),
  );
}

export function filterCountriesBySearch(countries: ManagerCountry[], query: string): ManagerCountry[] {
  const q = normalizeManagerSearch(query);
  if (!q) return countries;
  return countries.filter((c) => countryMatchesSearch(c, q));
}

export function findManagersBySearch(countries: ManagerCountry[], query: string): ManagerSearchResult[] {
  const q = normalizeManagerSearch(query);
  if (!q) return [];
  const results: ManagerSearchResult[] = [];
  for (const country of countries) {
    for (const manager of country.managers) {
      if (
        normalizeManagerSearch(manager.name).includes(q) ||
        normalizeManagerSearch(manager.achievement).includes(q)
      ) {
        results.push({ country, manager });
      }
    }
  }
  return results.sort((a, b) => a.manager.worldCupYear - b.manager.worldCupYear);
}

export function filterManagersBySearch(
  managers: ManagerCountryManager[],
  query: string,
): ManagerCountryManager[] {
  const q = normalizeManagerSearch(query);
  if (!q) return managers;
  return managers.filter(
    (m) =>
      normalizeManagerSearch(m.name).includes(q) ||
      normalizeManagerSearch(m.achievement).includes(q),
  );
}

export function getManagerCountrySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getManagerCountryBySlug(slug: string | undefined): ManagerCountry | undefined {
  if (!slug) return undefined;
  return managerCountries.find((c) => getManagerCountrySlug(c.name) === slug);
}

export function getManagersSortedByYear(country: ManagerCountry): ManagerCountryManager[] {
  return [...country.managers].sort((a, b) => a.worldCupYear - b.worldCupYear);
}

export function getManagerSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

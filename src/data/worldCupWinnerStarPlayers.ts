/**
 * Star player portrait + name per winning year (World Cup Winners country page).
 * Local assets preferred; a few older portraits use Wikimedia Commons (Special:FilePath).
 */
import pele1958 from '@/assets/kickoff-portraits/pele-wc1958.jpg';
import garrinchaImg from '@/assets/players/Brazil/Garrincha.jpg';
import jairzinhoImg from '@/assets/players/Brazil/Jairzinho.jpg';
import ronaldo2002 from '@/assets/kickoff-portraits/ronaldo-r9-wc2002.jpg';
import romario1994 from '@/assets/kickoff-portraits/romario-wc1994.jpg';

import beckenbauerImg from '@/assets/beckenbauer.jpg';
import lotharMatthausImg from '@/assets/players/Germany/lothar-matthaus.jpg';
import manuelNeuerImg from '@/assets/players/Germany/manuel neuer.jpg';

import paoloRossiImg from '@/assets/players/Italy/Paolo_Rossi.jpg';
import fabioCannavaroImg from '@/assets/players/Italy/Fabio_Cannavaro.jpg';

import marioKempesImg from '@/assets/players/Argentina/Mario_Kempes.png';
import diegoMaradonaImg from '@/assets/players/Argentina/Diego_Maradona.jpg';
import lionelMessiImg from '@/assets/players/Argentina/Lionel_Messi.webp';

import zidaneImg from '@/assets/players/France/zidane.jpg';
import mbappeImg from '@/assets/players/France/Kylian Mbappe.avif';

import obdulioVarelaImg from '@/assets/players/Uruguay/Obdulio_Varela.jpg';

import bobbyMooreWinnersImg from '@/assets/kickoff-portraits/bobby-moore-wc1966.jpg';

import iniestaImg from '@/assets/players/Spain/iniesta.jpg';

export type WinnerStarPlayer = {
  name: string;
  /** Vite-resolved asset URL or absolute image URL */
  image: string;
  /** Optional CSS object-position override for the card background portrait */
  imageObjectPosition?: string;
};

/** Commons file path — redirects to upload.wikimedia.org (OK for <img src>). */
const C = (file: string, width = 640) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const WINNER_STAR_BY_YEAR: Record<string, Record<number, WinnerStarPlayer>> = {
  brazil: {
    1958: { name: 'Pelé', image: pele1958 },
    1962: { name: 'Garrincha', image: garrinchaImg },
    1970: { name: 'Jairzinho', image: jairzinhoImg },
    1994: { name: 'Romário', image: romario1994 },
    2002: { name: 'Ronaldo', image: ronaldo2002 },
  },
  germany: {
    1954: { name: 'Fritz Walter', image: C('Fritz Walter en 1954.jpg') },
    1974: { name: 'Franz Beckenbauer', image: beckenbauerImg },
    1990: { name: 'Lothar Matthäus', image: lotharMatthausImg },
    2014: { name: 'Manuel Neuer', image: manuelNeuerImg },
  },
  italy: {
    1934: { name: 'Giuseppe Meazza', image: C('Giuseppe Meazza 1935.jpg') },
    1938: { name: 'Silvio Piola', image: C('Silvio Piola (Nazionale).jpg') },
    1982: { name: 'Paolo Rossi', image: paoloRossiImg },
    2006: { name: 'Fabio Cannavaro', image: fabioCannavaroImg },
  },
  argentina: {
    1978: { name: 'Mario Kempes', image: marioKempesImg },
    1986: { name: 'Diego Maradona', image: diegoMaradonaImg },
    2022: { name: 'Lionel Messi', image: lionelMessiImg },
  },
  france: {
    1998: { name: 'Zinédine Zidane', image: zidaneImg },
    2018: { name: 'Kylian Mbappé', image: mbappeImg },
  },
  uruguay: {
    1930: { name: 'José Leandro Andrade', image: C('Andrade urug.jpg') },
    1950: { name: 'Obdulio Varela', image: obdulioVarelaImg },
  },
  england: {
    1966: { name: 'Bobby Moore', image: bobbyMooreWinnersImg, imageObjectPosition: 'center 32%' },
  },
  spain: {
    2010: { name: 'Andrés Iniesta', image: iniestaImg },
  },
};

export function getWinnerStarPlayer(
  countrySlug: string,
  year: number
): WinnerStarPlayer | undefined {
  const key = countrySlug.toLowerCase();
  return WINNER_STAR_BY_YEAR[key]?.[year];
}

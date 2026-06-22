import type { CSSProperties } from 'react';
import { getHostNationPaletteOpenTriple } from '@/data/legendCountryLevelCardStyles';
import { getCountryFlag, getCountryFlagCode } from '@/lib/countryFlags';
import { getPlayerWorldCupYearForLevel } from '@/data/playerQuestions';

/**
 * FIFA World Cup host nation(s) by tournament year (finals host).
 * 2002 was co-hosted by Japan and South Korea.
 */
export const WORLD_CUP_HOST_COUNTRIES_BY_YEAR: Record<number, readonly string[]> = {
  1930: ['Uruguay'],
  1934: ['Italy'],
  1938: ['France'],
  1950: ['Brazil'],
  1954: ['Switzerland'],
  1958: ['Sweden'],
  1962: ['Chile'],
  1966: ['England'],
  1970: ['Mexico'],
  1974: ['West Germany'],
  1978: ['Argentina'],
  1982: ['Spain'],
  1986: ['Mexico'],
  1990: ['Italy'],
  1994: ['United States'],
  1998: ['France'],
  2002: ['Japan', 'South Korea'],
  2006: ['Germany'],
  2010: ['South Africa'],
  2014: ['Brazil'],
  2018: ['Russia'],
  2022: ['Qatar'],
};

export const getWorldCupHostFlags = (year: number): string => {
  const hosts = WORLD_CUP_HOST_COUNTRIES_BY_YEAR[year];
  if (!hosts?.length) return '🏳️';
  return hosts.map((c) => getCountryFlag(c)).join(' ');
};

export const formatPlayerLevelWorldCupSummary = (
  playerId: string,
  level: number,
): string | null => {
  const year = getPlayerWorldCupYearForLevel(playerId, level);
  if (year === undefined) return null;
  return `${year} ${getWorldCupHostFlags(year)}`;
};

/**
 * Key into `COUNTRY_PALETTES` in `legendCountryLevelCardStyles` for this tournament’s host look.
 * 2002 uses a combined Japan / South Korea palette.
 */
export const getWorldCupHostPaletteCountry = (year: number): string => {
  const hosts = WORLD_CUP_HOST_COUNTRIES_BY_YEAR[year];
  if (!hosts?.length) return 'Brazil';
  if (hosts.length >= 2) return 'Japan & South Korea';
  return hosts[0];
};

/** ISO 3166-1 alpha-2 (flagcdn) for the primary host nation’s flag image for this tournament year. */
export const getWorldCupHostFlagCodeForYear = (year: number): string => {
  const hosts = WORLD_CUP_HOST_COUNTRIES_BY_YEAR[year];
  if (!hosts?.length) return 'un';
  return getCountryFlagCode(hosts[0]);
};

export const getWorldCupHostFlagImageUrl = (year: number, width = 1280): string =>
  `https://flagcdn.com/w${width}/${getWorldCupHostFlagCodeForYear(year)}.png`;

/** Short host label for kickoff hero (e.g. USA, FRANCE, JAPAN · SOUTH KOREA). */
const HOST_KICKOFF_SHORT: Record<string, string> = {
  'United States': 'USA',
  'United Kingdom': 'UK',
  'United Arab Emirates': 'UAE',
};

export function getWorldCupHostKickoffLabel(year: number): string {
  const hosts = WORLD_CUP_HOST_COUNTRIES_BY_YEAR[year];
  if (!hosts?.length) return '';
  if (hosts.length >= 2) {
    return hosts
      .map((h) => HOST_KICKOFF_SHORT[h] ?? h.toUpperCase())
      .join(' · ');
  }
  const h = hosts[0];
  return HOST_KICKOFF_SHORT[h] ?? h.toUpperCase();
}

/**
 * Gradient text style for “PLAY … WORLD CUP” headline — uses the same host palette as legend level tiles.
 */
export function getHostKickoffHeadlineGradientStyle(year: number): CSSProperties {
  const paletteCountry = getWorldCupHostPaletteCountry(year);
  const [a, b, c] = getHostNationPaletteOpenTriple(paletteCountry);
  return {
    backgroundImage: `linear-gradient(115deg, ${a} 0%, ${b} 48%, ${c} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };
}

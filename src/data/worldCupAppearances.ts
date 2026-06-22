/**
 * FIFA World Cup finals appearances by nation (through 2022).
 * Single source of truth for Country History and Destiny Route campaign totals.
 */

export interface WorldCupNationRow {
  name: string;
  code: string;
  flag: string;
  worldCupYears: readonly number[];
}

/** Same list as Country History — fact-checked appearance years (not quiz coverage). */
export const WORLD_CUP_NATIONS: WorldCupNationRow[] = [
  { name: 'Algeria', code: 'DZ', flag: '🇩🇿', worldCupYears: [1982, 1986, 2010, 2014] },
  { name: 'Angola', code: 'AO', flag: '🇦🇴', worldCupYears: [2006] },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', worldCupYears: [1930, 1934, 1958, 1962, 1966, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', worldCupYears: [1974, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Austria', code: 'AT', flag: '🇦🇹', worldCupYears: [1934, 1954, 1958, 1978, 1982, 1990, 1998] },
  { name: 'Belgium', code: 'BE', flag: '🇧🇪', worldCupYears: [1930, 1934, 1938, 1954, 1970, 1982, 1986, 1990, 1994, 1998, 2002, 2014, 2018, 2022] },
  { name: 'Bolivia', code: 'BO', flag: '🇧🇴', worldCupYears: [1930, 1950, 1994] },
  { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦', worldCupYears: [2014] },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', worldCupYears: [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Bulgaria', code: 'BG', flag: '🇧🇬', worldCupYears: [1962, 1966, 1970, 1974, 1986, 1994, 1998] },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲', worldCupYears: [1982, 1990, 1994, 1998, 2002, 2010, 2014, 2022] },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', worldCupYears: [1986, 2022] },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', worldCupYears: [1930, 1950, 1962, 1966, 1974, 1982, 1998, 2010, 2014] },
  { name: 'China', code: 'CN', flag: '🇨🇳', worldCupYears: [2002] },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴', worldCupYears: [1962, 1990, 1994, 1998, 2014, 2018] },
  { name: 'Costa Rica', code: 'CR', flag: '🇨🇷', worldCupYears: [1990, 2002, 2006, 2014, 2018, 2022] },
  { name: 'Croatia', code: 'HR', flag: '🇭🇷', worldCupYears: [1998, 2002, 2006, 2014, 2018, 2022] },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺', worldCupYears: [1938] },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', worldCupYears: [2006] },
  /** TCH: historical FIFA trigram (avoids collision with Serbia & Montenegro 2006). */
  { name: 'Czechoslovakia', code: 'TCH', flag: '🇨🇿', worldCupYears: [1934, 1938, 1954, 1958, 1962, 1970, 1982, 1990] },
  { name: 'Denmark', code: 'DK', flag: '🇩🇰', worldCupYears: [1986, 1998, 2002, 2010, 2018, 2022] },
  { name: 'East Germany', code: 'DD', flag: '🇩🇪', worldCupYears: [1974] },
  { name: 'Ecuador', code: 'EC', flag: '🇪🇨', worldCupYears: [2002, 2006, 2014, 2022] },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', worldCupYears: [1934, 1990, 2018] },
  { name: 'El Salvador', code: 'SV', flag: '🇸🇻', worldCupYears: [1970, 1982] },
  { name: 'England', code: 'GB-ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', worldCupYears: [1950, 1954, 1958, 1962, 1966, 1970, 1982, 1986, 1990, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'France', code: 'FR', flag: '🇫🇷', worldCupYears: [1930, 1934, 1938, 1954, 1958, 1966, 1978, 1982, 1986, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', worldCupYears: [1934, 1938, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', worldCupYears: [2006, 2010, 2014, 2022] },
  { name: 'Greece', code: 'GR', flag: '🇬🇷', worldCupYears: [1994, 2010, 2014] },
  { name: 'Haiti', code: 'HT', flag: '🇭🇹', worldCupYears: [1974] },
  { name: 'Honduras', code: 'HN', flag: '🇭🇳', worldCupYears: [1982, 2010, 2014] },
  { name: 'Hungary', code: 'HU', flag: '🇭🇺', worldCupYears: [1934, 1938, 1954, 1958, 1962, 1966, 1978, 1982, 1986, 2022] },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸', worldCupYears: [2018] },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩', worldCupYears: [1938] },
  { name: 'Iran', code: 'IR', flag: '🇮🇷', worldCupYears: [1978, 1998, 2006, 2014, 2018, 2022] },
  { name: 'Iraq', code: 'IQ', flag: '🇮🇶', worldCupYears: [1986] },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', worldCupYears: [1990, 1994, 2002] },
  { name: 'Israel', code: 'IL', flag: '🇮🇱', worldCupYears: [1970] },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', worldCupYears: [1934, 1938, 1950, 1954, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014] },
  { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮', worldCupYears: [2006, 2010, 2014] },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲', worldCupYears: [1998] },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', worldCupYears: [1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Kuwait', code: 'KW', flag: '🇰🇼', worldCupYears: [1982] },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', worldCupYears: [1930, 1950, 1954, 1958, 1962, 1966, 1970, 1978, 1986, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦', worldCupYears: [1970, 1986, 1994, 1998, 2018, 2022] },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', worldCupYears: [1934, 1938, 1974, 1978, 1990, 1994, 1998, 2006, 2010, 2014, 2022] },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', worldCupYears: [1982, 2010] },
  { name: 'Northern Ireland', code: 'GB-NIR', flag: '🏴󠁧󠁢󠁮󠁩󠁲󠁿', worldCupYears: [1958, 1982, 1986] },
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', worldCupYears: [1994, 1998, 2002, 2010, 2014, 2018] },
  { name: 'North Korea', code: 'KP', flag: '🇰🇵', worldCupYears: [1966, 2010] },
  { name: 'Norway', code: 'NO', flag: '🇳🇴', worldCupYears: [1938, 1994, 1998] },
  { name: 'Panama', code: 'PA', flag: '🇵🇦', worldCupYears: [2018] },
  { name: 'Paraguay', code: 'PY', flag: '🇵🇾', worldCupYears: [1930, 1950, 1958, 1986, 1998, 2002, 2006, 2010] },
  { name: 'Peru', code: 'PE', flag: '🇵🇪', worldCupYears: [1930, 1970, 1978, 1982, 2018] },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', worldCupYears: [1938, 1974, 1978, 1982, 1986, 2002, 2006, 2018, 2022] },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', worldCupYears: [1966, 1986, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Qatar', code: 'QA', flag: '🇶🇦', worldCupYears: [2022] },
  { name: 'Romania', code: 'RO', flag: '🇷🇴', worldCupYears: [1930, 1934, 1938, 1970, 1990, 1994, 1998] },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', worldCupYears: [1994, 2002, 2014, 2018] },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', worldCupYears: [1994, 1998, 2002, 2006, 2018, 2022] },
  { name: 'Scotland', code: 'GB-SCT', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', worldCupYears: [1954, 1958, 1974, 1978, 1982, 1986, 1990, 1998] },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳', worldCupYears: [2002, 2018, 2022] },
  { name: 'Serbia', code: 'RS', flag: '🇷🇸', worldCupYears: [2010, 2018, 2022] },
  { name: 'Serbia and Montenegro', code: 'SCG', flag: '🇷🇸', worldCupYears: [2006] },
  { name: 'Slovakia', code: 'SK', flag: '🇸🇰', worldCupYears: [2010] },
  { name: 'Slovenia', code: 'SI', flag: '🇸🇮', worldCupYears: [2002, 2010] },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', worldCupYears: [1998, 2002, 2010] },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', worldCupYears: [1954, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Soviet Union', code: 'SU', flag: '🇷🇺', worldCupYears: [1958, 1962, 1966, 1970, 1982, 1986, 1990] },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', worldCupYears: [1934, 1950, 1962, 1966, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', worldCupYears: [1934, 1938, 1950, 1958, 1970, 1974, 1978, 1990, 1994, 2002, 2006, 2018] },
  { name: 'Switzerland', code: 'CH', flag: '🇨🇭', worldCupYears: [1934, 1938, 1950, 1954, 1962, 1966, 1994, 2006, 2010, 2014, 2018, 2022] },
  { name: 'Togo', code: 'TG', flag: '🇹🇬', worldCupYears: [2006] },
  { name: 'Trinidad and Tobago', code: 'TT', flag: '🇹🇹', worldCupYears: [2006] },
  { name: 'Tunisia', code: 'TN', flag: '🇹🇳', worldCupYears: [1978, 1998, 2002, 2006, 2018, 2022] },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', worldCupYears: [1954, 2002] },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦', worldCupYears: [2006] },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', worldCupYears: [1990] },
  { name: 'United States', code: 'US', flag: '🇺🇸', worldCupYears: [1930, 1934, 1950, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2022] },
  { name: 'Uruguay', code: 'UY', flag: '🇺🇾', worldCupYears: [1930, 1950, 1954, 1962, 1966, 1970, 1974, 1986, 1990, 2002, 2010, 2014, 2018, 2022] },
  { name: 'Wales', code: 'GB-WLS', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', worldCupYears: [1958, 2022] },
  // SFR Yugoslavia through 1990; 1998 finals side is FR Yugoslavia (separate row below).
  { name: 'Yugoslavia', code: 'YU', flag: '🇷🇸', worldCupYears: [1930, 1950, 1954, 1958, 1962, 1974, 1982, 1990] },
  { name: 'Zaire', code: 'CD', flag: '🇨🇩', worldCupYears: [1974] },
  /** FRY: Federal Republic of Yugoslavia (distinct URL key from SFR Yugoslavia). */
  { name: 'FR Yugoslavia', code: 'FRY', flag: '🇷🇸', worldCupYears: [1998] },
];

/** Destiny / quiz keys that differ from `WORLD_CUP_NATIONS.name` */
const APPEARANCE_NAME_ALIASES: Record<string, string> = {
  'Republic of Ireland': 'Ireland',
};

const byName = new Map(WORLD_CUP_NATIONS.map((r) => [r.name, r]));

/** Total documented finals appearances for a nation (through 2022), or null if unknown. */
export function getWorldCupAppearanceCount(countryName: string): number | null {
  const key = APPEARANCE_NAME_ALIASES[countryName] ?? countryName;
  const row = byName.get(key);
  return row ? row.worldCupYears.length : null;
}

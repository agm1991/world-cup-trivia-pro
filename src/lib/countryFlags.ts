import { worldCupNationFlags } from '@/data/worldCupNationFlags';
import { defaultCountries } from '@/data/selectLegendCountries';
import northernIrelandFlag from '@/assets/flags/northern-ireland.png';
import sovietUnionFlag from '@/assets/flags/soviet-union.png';
import yugoslaviaSfrFlag from '@/assets/flags/yugoslavia-sfr.png';
import eastGermanyFlag from '@/assets/flags/east-germany.png';

/** Bundled historical flags — emoji / flagcdn cannot represent these accurately. */
const BUNDLED_FLAG_BY_NAME: Record<string, string> = {
  'Northern Ireland': northernIrelandFlag,
  'Soviet Union': sovietUnionFlag,
  Yugoslavia: yugoslaviaSfrFlag,
  'East Germany': eastGermanyFlag,
};

function codeToFlagcdnIso(code: string): string {
  const lower = code.toLowerCase();
  if (code === 'DD') return 'de';
  if (code === 'YU' || code === 'SCG' || code === 'CS') return 'rs';
  if (code === 'FRY') return 'rs';
  if (code === 'TCH') return 'cz';
  return lower;
}

const fromWorldCupHistoryFlags = Object.fromEntries(worldCupNationFlags.map((c) => [c.name, c.flag]));

const fromLegendFlags = Object.fromEntries(defaultCountries.map((c) => [c.name, c.flag]));

/** Common abbreviations → canonical nation name (World Cup scorelines, legacy labels). */
const COUNTRY_ALIASES: Record<string, string> = {
  USA: 'United States',
  'U.S.A.': 'United States',
  US: 'United States',
  'Republic of Ireland': 'Ireland',
};

function resolveCountryName(country: string): string {
  const name = stripTeamNameFlags(country);
  return COUNTRY_ALIASES[name] ?? name;
}

/** Emoji flags for profile picker, leaderboards, Destiny Route, etc. */
export const countryFlags: Record<string, string> = {
  ...fromWorldCupHistoryFlags,
  ...fromLegendFlags,
  USA: '🇺🇸',
};

export const countries = Object.keys(countryFlags).sort((a, b) =>
  a.localeCompare(b, 'en', { sensitivity: 'base' }),
);

export const getCountryFlag = (country: string): string => {
  return countryFlags[resolveCountryName(country)] || '🏳️';
};

/** Remove flag emoji (incl. GB subdivision tags that degrade to white flag) from team names. */
export function stripTeamNameFlags(text: string): string {
  return text
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
    .replace(/[\u{1F3F3}\u{1F3F4}]/gu, '')
    .replace(/[\u{E0030}-\u{E007F}]/gu, '')
    .replace(/[\u{FE0E}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bundled flag asset for nations with no reliable emoji / flagcdn (SFR Yugoslavia, GDR, USSR, etc.). */
export function getBundledCountryFlagImage(country: string): string | undefined {
  return BUNDLED_FLAG_BY_NAME[resolveCountryName(country)];
}

/** True when `flag` is a bundled image URL (e.g. Northern Ireland Ulster Banner). */
export function isMissingPlayerImageFlag(flag: string): boolean {
  return (
    /\.(png|webp|jpe?g|svg)(\?|$)/i.test(flag) ||
    flag.includes('/assets/') ||
    flag.includes('flagcdn.com/')
  );
}

/** Pitch / bingo flags — image assets for nations whose emoji flags render poorly. */
export function getMissingPlayerTeamFlag(country: string): string {
  const name = resolveCountryName(country);
  const bundled = getBundledCountryFlagImage(name);
  if (bundled) return bundled;
  if (name === 'Republic of Ireland' || name === 'Ireland') return 'https://flagcdn.com/w320/ie.png';
  if (name === 'Wales') return 'https://flagcdn.com/w320/gb-wls.png';
  if (name === 'United States') return 'https://flagcdn.com/w320/us.png';
  return getCountryFlag(name);
}

const fromWorldCupIso = Object.fromEntries(
  worldCupNationFlags.map((c) => [c.name, codeToFlagcdnIso(c.code)]),
);

/** ISO / flagcdn slug (`/w320/{code}.png`) — built from World Cup nation list; legend-only nations fall back via emoji in UI */
export function getCountryFlagCode(country: string): string {
  return fromWorldCupIso[resolveCountryName(country)] ?? 'un';
}

/** Full URL for `<img src>` — flagcdn has no reliable Ulster Banner; use bundled asset (FIFA/legacy team flag). */
export function getCountryFlagImageSrc(country: string): string {
  const name = resolveCountryName(country);
  const bundled = getBundledCountryFlagImage(name);
  if (bundled) return bundled;
  if (name === 'Wales') return 'https://flagcdn.com/w320/gb-wls.png';
  if (name === 'United States') return 'https://flagcdn.com/w320/us.png';
  return `https://flagcdn.com/w320/${getCountryFlagCode(name)}.png`;
}

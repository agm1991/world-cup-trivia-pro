/**
 * Select a Legend — level cards use each nation’s colours; levels 1–5 (repeating if >5)
 * each get a distinct gradient layout, corner shape, and depth so tiles stay readable
 * without on-card text.
 */

import type { CSSProperties } from 'react';

export type LegendLevelCardVariant = 'unlocked' | 'completed' | 'locked';

type Triple = [string, string, string];

type CountryPalette = { open: Triple; done: Triple };

const LOCKED =
  'bg-muted/80 text-muted-foreground cursor-not-allowed border border-border/80';

/** Visual extras that differ per slot (1–5) for uniqueness within the same palette. */
const SLOT_RADIUS: Record<number, string> = {
  1: 'rounded-2xl',
  2: 'rounded-xl rounded-tl-[1.75rem] rounded-br-md',
  3: 'rounded-xl rounded-bl-[1.5rem]',
  4: 'rounded-2xl rounded-tr-lg rounded-bl-lg',
  5: 'rounded-lg rounded-t-2xl',
};

const SLOT_DEPTH: Record<number, string> = {
  1: 'shadow-[inset_0_-14px_28px_rgba(0,0,0,0.16)]',
  2: 'ring-2 ring-white/25',
  3: 'border-b-[3px] border-black/20',
  4: 'shadow-[0_7px_0_0_rgba(0,0,0,0.18)]',
  5: 'shadow-inner brightness-[1.02] saturate-[1.08]',
};

const DEFAULT_PALETTE: CountryPalette = {
  open: ['#475569', '#334155', '#0f172a'],
  done: ['#1e293b', '#0f172a', '#020617'],
};

/** Per-country flag/kit-inspired triples (open = in progress, done = completed, darker). */
const COUNTRY_PALETTES: Record<string, CountryPalette> = {
  Brazil: {
    open: ['#009C3B', '#FFDF00', '#002776'],
    done: ['#006B2E', '#C9A000', '#001a50'],
  },
  Argentina: {
    open: ['#75AADB', '#FFFFFF', '#20338a'],
    done: ['#4a8ec4', '#dbeaf8', '#152a6b'],
  },
  France: {
    open: ['#002395', '#FFFFFF', '#ED2939'],
    done: ['#001a70', '#d8d8d8', '#c41e2e'],
  },
  Germany: {
    open: ['#000000', '#DD0000', '#FFCE00'],
    done: ['#1a0505', '#a00000', '#b8860b'],
  },
  'West Germany': {
    open: ['#000000', '#DD0000', '#FFCE00'],
    done: ['#1a0505', '#a00000', '#b8860b'],
  },
  Spain: {
    open: ['#C60B1E', '#FFC400', '#AA151B'],
    done: ['#8f0815', '#d4a000', '#7a0a12'],
  },
  Italy: {
    open: ['#009246', '#FFFFFF', '#CE2B37'],
    done: ['#006b30', '#e8e8e8', '#8a1f28'],
  },
  Qatar: {
    open: ['#8D1B3D', '#FFFFFF', '#4A0E1F'],
    done: ['#65142d', '#e8e8e8', '#2f0a14'],
  },
  'Japan & South Korea': {
    open: ['#BC002D', '#FFFFFF', '#0047A0'],
    done: ['#8a001f', '#e8e8e8', '#00306e'],
  },
  England: {
    open: ['#FFFFFF', '#CE1126', '#012169'],
    done: ['#e8e8e8', '#a00d1c', '#011a52'],
  },
  Portugal: {
    open: ['#006847', '#DA020E', '#FFDF00'],
    done: ['#004530', '#a8010a', '#c9a400'],
  },
  Netherlands: {
    open: ['#FF6600', '#FFFFFF', '#AE1C28'],
    done: ['#cc5200', '#e8e8e8', '#7a141d'],
  },
  Croatia: {
    open: ['#FF0000', '#FFFFFF', '#171796'],
    done: ['#b30000', '#e8e8e8', '#0f0f6b'],
  },
  Belgium: {
    open: ['#000000', '#FAE042', '#C8102E'],
    done: ['#1a1a1a', '#c9a900', '#8f0b20'],
  },
  Mexico: {
    open: ['#006847', '#FFFFFF', '#CE1126'],
    done: ['#004530', '#e8e8e8', '#8f0c18'],
  },
  Colombia: {
    open: ['#FCD116', '#003893', '#CE1126'],
    done: ['#c9a400', '#002d6b', '#8f0c18'],
  },
  Uruguay: {
    open: ['#0038A8', '#FFFFFF', '#FFD100'],
    done: ['#002a7a', '#d4e4ff', '#c9a400'],
  },
  Nigeria: {
    open: ['#008751', '#FFFFFF', '#1a1a1a'],
    done: ['#006640', '#c8e6d8', '#0f0f0f'],
  },
  Japan: {
    open: ['#FFFFFF', '#BC002D', '#1a1a1a'],
    done: ['#f5f5f5', '#8a001f', '#0f0f0f'],
  },
  'South Korea': {
    open: ['#FFFFFF', '#0047A0', '#C60C30'],
    done: ['#e8eef5', '#00306e', '#8a0818'],
  },
  Sweden: {
    open: ['#006AA7', '#FECC00', '#1a1a1a'],
    done: ['#004f7d', '#c9a300', '#0f0f0f'],
  },
  Switzerland: {
    open: ['#FF0000', '#FFFFFF', '#FF0000'],
    done: ['#b30000', '#e8e8e8', '#8f0000'],
  },
  Turkey: {
    open: ['#E30A17', '#FFFFFF', '#E30A17'],
    done: ['#a80710', '#d4d4d4', '#7a050c'],
  },
  Poland: {
    open: ['#FFFFFF', '#DC143C', '#FFFFFF'],
    done: ['#f0f0f0', '#9e0e29', '#e8e8e8'],
  },
  Australia: {
    open: ['#012169', '#E4002B', '#FFFFFF'],
    done: ['#011a52', '#a8001f', '#e8e8e8'],
  },
  Ghana: {
    open: ['#006B3F', '#FCD116', '#CE1126'],
    done: ['#004d2d', '#c9a400', '#8f0c18'],
  },
  Cameroon: {
    open: ['#007A5E', '#FCD116', '#CE1126'],
    done: ['#005a45', '#c9a400', '#8f0c18'],
  },
  Egypt: {
    open: ['#C8102E', '#FFFFFF', '#000000'],
    done: ['#8f0b20', '#d4d4d4', '#1a1a1a'],
  },
  'Czech Republic': {
    open: ['#11457E', '#FFFFFF', '#D7141A'],
    done: ['#0c335d', '#e8e8e8', '#9e0f14'],
  },
  Hungary: {
    open: ['#CE2939', '#FFFFFF', '#436F4D'],
    done: ['#9a1f2b', '#d8d8d8', '#2d4a33'],
  },
  Denmark: {
    open: ['#C8102E', '#FFFFFF', '#012169'],
    done: ['#8f0b20', '#e8e8e8', '#011a52'],
  },
  Norway: {
    open: ['#EF2B2D', '#FFFFFF', '#002868'],
    done: ['#a81e1f', '#e8e8e8', '#001d4d'],
  },
  Russia: {
    open: ['#FFFFFF', '#0039A6', '#D52B1E'],
    done: ['#e8e8e8', '#002a75', '#9a1f15'],
  },
  Ukraine: {
    open: ['#005BBB', '#FFD500', '#1a1a1a'],
    done: ['#004494', '#c9a800', '#0f0f0f'],
  },
  Serbia: {
    open: ['#C6363C', '#0C4076', '#FFFFFF'],
    done: ['#8f282c', '#082d54', '#e8e8e8'],
  },
  Austria: {
    open: ['#ED2939', '#FFFFFF', '#ED2939'],
    done: ['#a81e29', '#d4d4d4', '#7a141d'],
  },
  Algeria: {
    open: ['#FFFFFF', '#006233', '#C8102E'],
    done: ['#e8f5e8', '#004422', '#8f0b20'],
  },
  Senegal: {
    open: ['#00853F', '#FCD116', '#CE1126'],
    done: ['#006030', '#c9a400', '#8f0c18'],
  },
  Morocco: {
    open: ['#C1272D', '#006233', '#C1272D'],
    done: ['#8f1c20', '#004422', '#8f1c20'],
  },
  Ecuador: {
    open: ['#FFDD00', '#034EA2', '#ED1C24'],
    done: ['#c9b000', '#023a78', '#b01418'],
  },
  Chile: {
    open: ['#0039A6', '#FFFFFF', '#D52B1E'],
    done: ['#002a75', '#d4e4ff', '#9a1f15'],
  },
  Paraguay: {
    open: ['#D52B1E', '#0038A8', '#FFFFFF'],
    done: ['#9a1f15', '#002a75', '#e8e8e8'],
  },
  'United States': {
    open: ['#B22234', '#FFFFFF', '#3C3B6E'],
    done: ['#7a1824', '#e8e8e8', '#2a294d'],
  },
  Canada: {
    open: ['#FF0000', '#FFFFFF', '#FF0000'],
    done: ['#b30000', '#d8d8d8', '#8f0000'],
  },
  'Ivory Coast': {
    open: ['#F77F00', '#FFFFFF', '#009E60'],
    done: ['#c06500', '#e8e8e8', '#007848'],
  },
  'South Africa': {
    open: ['#007A4D', '#FFB612', '#DE3831'],
    done: ['#005838', '#c99200', '#a02822'],
  },
  Iran: {
    open: ['#FFFFFF', '#239F40', '#DA0000'],
    done: ['#e8f5e8', '#1a7a32', '#a00000'],
  },
  'Saudi Arabia': {
    open: ['#006C35', '#FFFFFF', '#1a1a1a'],
    done: ['#004d26', '#d4e8dc', '#0f0f0f'],
  },
  'Northern Ireland': {
    open: ['#009543', '#FFFFFF', '#C8102E'],
    done: ['#006b30', '#d4e8dc', '#8f0b20'],
  },
  Scotland: {
    open: ['#005EB8', '#FFFFFF', '#012169'],
    done: ['#004494', '#d4e4f7', '#011a52'],
  },
  Wales: {
    open: ['#D30731', '#FFFFFF', '#00B140'],
    done: ['#9a0523', '#d8d8d8', '#008030'],
  },
  Romania: {
    open: ['#FCD116', '#002B7F', '#CE1126'],
    done: ['#c9a400', '#001f5c', '#8f0c18'],
  },
  Bulgaria: {
    open: ['#FFFFFF', '#00966E', '#D01C1F'],
    done: ['#e8f5f0', '#006b4f', '#a01416'],
  },
  Greece: {
    open: ['#0D5EAF', '#FFFFFF', '#FFFFFF'],
    done: ['#0a4a8a', '#d4e4f7', '#e8e8e8'],
  },
  Finland: {
    open: ['#FFFFFF', '#003580', '#FFFFFF'],
    done: ['#e8eef5', '#002a66', '#e8e8e8'],
  },
  Ireland: {
    open: ['#169B62', '#FFFFFF', '#FF883E'],
    done: ['#117a4d', '#e8e8e8', '#cc6d32'],
  },
  Iceland: {
    open: ['#02529C', '#FFFFFF', '#DC1E35'],
    done: ['#013a6e', '#e8e8e8', '#a01526'],
  },
};

/** Host-nation “open” colours for kickoff headline gradients (aligned with level-card palettes). */
export function getHostNationPaletteOpenTriple(country: string): Triple {
  return (COUNTRY_PALETTES[country] ?? DEFAULT_PALETTE).open;
}

function buildGradientStyleForSlot(
  slot: number,
  open: Triple,
  done: Triple,
  completed: boolean,
): CSSProperties {
  const [a, b, c] = completed ? done : open;
  switch (slot) {
    case 1:
      return { backgroundImage: `linear-gradient(to bottom right, ${a}, ${b}, ${c})` };
    case 2:
      return { backgroundImage: `linear-gradient(to bottom left, ${c}, ${a}, ${b})` };
    case 3:
      return { backgroundImage: `linear-gradient(to right, ${a}, ${b}, ${c})` };
    case 4:
      return { backgroundImage: `linear-gradient(to top, ${b}, ${c})` };
    case 5:
      return { backgroundImage: `linear-gradient(to top right, ${a}, ${c}, ${b})` };
    default:
      return { backgroundImage: `linear-gradient(to bottom right, ${a}, ${c})` };
  }
}

/** Maps any level index to a visual slot 1–5 (repeats after 5). */
export function getLegendLevelVisualSlot(level: number): number {
  if (level < 1) return 1;
  return ((level - 1) % 5) + 1;
}

/**
 * Unified “arcade” yellow tiles for Select a Legend level pickers (matches Pelé-style UI).
 */
export function getLegendArcadeLevelCardClasses(variant: LegendLevelCardVariant): string {
  if (variant === 'locked') {
    return `${LOCKED} rounded-2xl transition-all`.trim();
  }
  const base =
    'rounded-2xl border border-amber-700/30 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-amber-950 font-black ' +
    'shadow-[0_8px_0_0_hsl(35_80%_35%),0_12px_20px_-4px_rgba(0,0,0,0.35),inset_0_2px_0_0_rgba(255,255,255,0.35)] ' +
    'hover:shadow-[0_6px_0_0_hsl(35_80%_35%),0_10px_16px_-4px_rgba(0,0,0,0.35),inset_0_2px_0_0_rgba(255,255,255,0.35)] hover:translate-y-[2px] ' +
    'active:shadow-[0_2px_0_0_hsl(35_80%_35%),0_4px_8px_-4px_rgba(0,0,0,0.35)] active:translate-y-[6px] ' +
    'transition-all duration-100 ease-out';
  if (variant === 'completed') {
    return `${base} ring-2 ring-emerald-500/70 ring-offset-2 ring-offset-background`.trim();
  }
  return base.trim();
}

export function getLegendCountryLevelCardStyle(
  country: string,
  variant: LegendLevelCardVariant,
  level: number,
): CSSProperties | undefined {
  if (variant === 'locked') return undefined;

  const palette = COUNTRY_PALETTES[country] ?? DEFAULT_PALETTE;
  const slot = getLegendLevelVisualSlot(level);
  return buildGradientStyleForSlot(slot, palette.open, palette.done, variant === 'completed');
}

export function getLegendCountryLevelCardClasses(
  country: string,
  variant: LegendLevelCardVariant,
  level: number,
): string {
  if (variant === 'locked') {
    return `${LOCKED} transition-all ${SLOT_RADIUS[getLegendLevelVisualSlot(level)] ?? 'rounded-xl'}`.trim();
  }

  const slot = getLegendLevelVisualSlot(level);
  const radius = SLOT_RADIUS[slot] ?? 'rounded-2xl';
  const depth = SLOT_DEPTH[slot] ?? '';
  const completedRing = variant === 'completed' ? 'ring-2 ring-emerald-400/55' : '';

  return `text-white shadow-xl shadow-black/25 border border-white/15 hover:scale-105 hover:shadow-2xl ${radius} ${depth} ${completedRing} cursor-pointer transition-all`.trim();
}

const HOST_FLAG_GOLD_BORDER =
  'border-2 border-[#e8c547]/85 shadow-xl shadow-black/30';

/**
 * Legend level tiles with host-nation flag backgrounds (full-bleed image + overlay in the page).
 * Golden border; no fill — background layers are applied in the component.
 */
export function getLegendHostFlagLevelCardShellClasses(
  variant: LegendLevelCardVariant,
  level: number,
): string {
  const slot = getLegendLevelVisualSlot(level);
  const radius = SLOT_RADIUS[slot] ?? 'rounded-2xl';
  const depth = SLOT_DEPTH[slot] ?? '';

  if (variant === 'locked') {
    return `${radius} ${depth} ${HOST_FLAG_GOLD_BORDER} relative overflow-hidden cursor-not-allowed transition-all grayscale-[0.35] brightness-[0.88]`.trim();
  }

  const base =
    `${radius} ${depth} ${HOST_FLAG_GOLD_BORDER} relative overflow-hidden transition-all duration-100 ease-out ` +
    'hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/40';

  if (variant === 'completed') {
    return `${base} ring-2 ring-emerald-500/75 ring-offset-2 ring-offset-background cursor-pointer`.trim();
  }

  return `${base} cursor-pointer`.trim();
}

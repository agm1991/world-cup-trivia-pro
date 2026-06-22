import { defaultCountries } from '@/data/selectLegendCountries';

/** Card portrait from Select a Legend roster (Vite resolves imports to URLs). */
export function findLegendPortraitUrl(playerId: string): string | undefined {
  for (const c of defaultCountries) {
    const pl = c.players.find((p) => p.id === playerId);
    if (pl?.image) return pl.image as string;
  }
  return undefined;
}

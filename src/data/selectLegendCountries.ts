/**
 * Select a Legend — full roster: global powerhouses + `coreLegendCountries` + CAF/AFC nations.
 */
import type { Country, Player } from './cafAfcLegendCountries';
import { cafAfcLegendCountries } from './cafAfcLegendCountries';
import { coreLegendCountries } from './selectLegendCountriesCore';

export type { Country, Player };

/** Select a Legend grid — A–Z by country name */
export const defaultCountries: Country[] = (() => {
  const combined = [...coreLegendCountries, ...cafAfcLegendCountries];
  return [...combined].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  );
})();

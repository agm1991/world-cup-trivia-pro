#!/usr/bin/env npx tsx
/**
 * Lists WORLD_CUP_NATIONS appearance years that have no Destiny Route row in
 * `destinyRouteLevels` (coverage gap vs FIFA finals appearances through 2022).
 *
 * Usage: `npx tsx scripts/scan-destiny-route-gaps.mts`
 */
import { WORLD_CUP_NATIONS } from '../src/data/worldCupAppearances.ts';
import { destinyRouteLevels, resolveDestinyTeamName } from '../src/data/destinyRouteQuestions.ts';

const covered = new Set(destinyRouteLevels.map((l) => `${l.team}:${l.year}`));

type Gap = { country: string; year: number };
const gaps: Gap[] = [];

for (const row of WORLD_CUP_NATIONS) {
  const team = resolveDestinyTeamName(row.name);
  for (const year of row.worldCupYears) {
    if (!covered.has(`${team}:${year}`)) {
      gaps.push({ country: row.name, year });
    }
  }
}

console.log('Destiny Route — appearance years missing a route definition\n');
console.log('Compared: WORLD_CUP_NATIONS (worldCupAppearances) vs destinyRouteLevels\n');
console.log(`Campaigns implemented: ${covered.size}`);
console.log(`Campaign-year gaps:      ${gaps.length}\n`);

const byCountry = new Map<string, number[]>();
for (const { country, year } of gaps) {
  if (!byCountry.has(country)) byCountry.set(country, []);
  byCountry.get(country)!.push(year);
}
for (const years of byCountry.values()) years.sort((a, b) => a - b);

const sortedCountries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));

console.log('=== Countries with at least one missing year (Years not in Destiny Route) ===\n');
for (const c of sortedCountries) {
  const ys = byCountry.get(c)!;
  console.log(`${c}: ${ys.join(', ')}  (${ys.length})`);
}

console.log('\nNotes: Destiny Route deliberately caps campaigns per heavyweight nations; ');
console.log('small nations may be fully covered. Use fact-check script for lineup validation.\n');

#!/usr/bin/env node
/**
 * Cross-checks Destiny Route entries against WORLD_CUP_NATIONS (appearance years).
 * Does not verify match order — only that the team and every opponent qualified
 * for that tournament year under a resolvable name.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const APPEARANCES_PATH = join(ROOT, 'src/data/worldCupAppearances.ts');
const DESTINY_PATH = join(ROOT, 'src/data/destinyRouteQuestions.ts');

/** Map route / display keys to WORLD_CUP_NATIONS.name */
const APPEARANCE_ALIASES = {
  'Republic of Ireland': 'Ireland',
  'West Germany': 'Germany',
  UAE: 'United Arab Emirates',
};

function stripLineComments(s) {
  return s
    .split('\n')
    .map((line) => (line.includes('//') ? line.slice(0, line.indexOf('//')) : line))
    .join('\n');
}

function parseAppearances(text) {
  const byName = new Map();
  const rowRe = /\{\s*name:\s*'([^']+)'\s*,[\s\S]*?worldCupYears:\s*\[([\d,\s]*)\]\s*\}/g;
  let m;
  while ((m = rowRe.exec(text)) !== null) {
    const name = m[1];
    const years = m[2]
      .split(',')
      .map((x) => parseInt(x.trim(), 10))
      .filter((n) => Number.isFinite(n));
    byName.set(name, new Set(years));
  }
  return byName;
}

function unquoteCountry(s) {
  const t = s.trim();
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
  return t;
}

function parseRouteFile(text) {
  const wEnd = text.indexOf('// Campaign routes for non-winners');
  const cStart = text.indexOf('const CAMPAIGN_ROUTES');
  const cEnd = text.indexOf('// Merge all routes');
  if (wEnd === -1 || cStart === -1 || cEnd === -1) {
    throw new Error('Could not find WINNER/CAMPAIGN route sections');
  }
  const winnerText = text.slice(text.indexOf('const WINNER_ROUTES'), wEnd);
  const campaignText = text.slice(cStart, cEnd);
  return { winnerText, campaignText };
}

function extractRoutes(blockText) {
  const merged = {};
  const countryRe = /\n  ((?:'[^']+'|[A-Za-z][A-Za-z0-9 ]*)):\s*\{([\s\S]*?)\n  \},/g;
  let m;
  while ((m = countryRe.exec(blockText)) !== null) {
    const countryRaw = unquoteCountry(m[1]);
    const country = countryRaw;
    const inner = stripLineComments(m[2]);
    const yearRe = /(\d{4}):\s*\[([^\]]*)\]/g;
    let ym;
    while ((ym = yearRe.exec(inner)) !== null) {
      const year = parseInt(ym[1], 10);
      const opponents = ym[2]
        .split(',')
        .map((x) => unquoteCountry(x))
        .filter(Boolean);
      if (!merged[country]) merged[country] = {};
      if (merged[country][year]) {
        console.warn(`Duplicate route (last wins): ${country} ${year}`);
      }
      merged[country][year] = opponents;
    }
  }
  return merged;
}

function resolveAppearanceName(routeName) {
  return APPEARANCE_ALIASES[routeName] ?? routeName;
}

function hasYear(map, name, year) {
  const key = resolveAppearanceName(name);
  const set = map.get(key);
  return set ? set.has(year) : false;
}

const appearancesText = readFileSync(APPEARANCES_PATH, 'utf-8');
const destinyText = readFileSync(DESTINY_PATH, 'utf-8');
const appearances = parseAppearances(appearancesText);
const { winnerText, campaignText } = parseRouteFile(destinyText);
const winnerRoutes = extractRoutes(winnerText);
const campaignRoutes = extractRoutes(campaignText);

const allCountries = new Set([...Object.keys(winnerRoutes), ...Object.keys(campaignRoutes)]);
const errors = [];

for (const country of [...allCountries].sort()) {
    const yearsWinner = winnerRoutes[country] || {};
    const yearsCampaign = campaignRoutes[country] || {};
    // Same merge as destinyRouteQuestions.ts: campaign keys overwrite winner on conflict
    const years = { ...yearsWinner, ...yearsCampaign };
  for (const [yStr, opponents] of Object.entries(years)) {
    const year = parseInt(yStr, 10);
    if (!hasYear(appearances, country, year)) {
      errors.push(`${country} ${year}: team did not appear in WORLD_CUP_NATIONS for that year`);
    }
    for (const opp of opponents) {
      if (!hasYear(appearances, opp, year)) {
        errors.push(`${country} ${year}: opponent "${opp}" not in WORLD_CUP_NATIONS for ${year} (check alias)`);
      }
    }
  }
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} appearance mismatch(es):\n`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

let levelCount = 0;
for (const c of allCountries) {
  const yw = winnerRoutes[c] || {};
  const yc = campaignRoutes[c] || {};
  levelCount += Object.keys({ ...yw, ...yc }).length;
}
console.log(`✅ Destiny routes: ${allCountries.size} countries, ${levelCount} country-year levels`);
console.log('✅ Every team and opponent year matches WORLD_CUP_NATIONS (through 2022)');

#!/usr/bin/env node
/**
 * Validates Country History routes: each nation × year from WORLD_CUP_NATIONS should have
 * campaign questions OR (coarse) any country-history bank entry for that ISO code.
 *
 * Sources:
 * - Appearances: src/data/worldCupAppearances.ts (same data Country History UI uses)
 * - Campaign years: parsed from campaignQuestions.ts + campaignCameroonNorthernIreland.ts
 *
 * Limitation: bank coverage is per countryCode, not per year — same as legacy script.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CAMPAIGN_ALIASES = {
  'republic of ireland': 'ireland',
};

/** ISO / URL codes → bank code in countryHistoryQuestions (England uses GB in bank). */
const CODE_MAP = {
  'GB-ENG': 'GB',
};

function parseWorldCupNations(ts) {
  const rows = [];
  const re =
    /\{\s*name:\s*'([^']+)',\s*code:\s*'([^']+)',\s*flag:\s*'[^']*',\s*worldCupYears:\s*\[([\s\d,]*)\]\s*\}/g;
  let m;
  while ((m = re.exec(ts)) !== null) {
    const years = (m[3].match(/\d{4}/g) || []).map(Number);
    rows.push({ name: m[1], code: m[2], years });
  }
  return rows;
}

function extractCountryKey(trimmed) {
  const quoted = trimmed.match(/^'([^']+)':\s*\{/);
  if (quoted) return quoted[1].toLowerCase().trim().replace(/\s+/g, ' ');
  const bare = trimmed.match(/^([a-z][a-z\s]*):\s*\{/);
  if (bare) return bare[1].trim().toLowerCase().replace(/\s+/g, ' ');
  return null;
}

/** Merge campaign year keys from a TS file into campaignYears Map. */
function ingestCampaignYears(filePath, campaignYears) {
  const content = readFileSync(filePath, 'utf-8');
  let currentCountry = null;
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    const key = extractCountryKey(trimmed);
    if (key) currentCountry = key;
    const yearMatch = trimmed.match(/^(\d{4}):\s*\[/);
    if (yearMatch && currentCountry) {
      const y = yearMatch[1];
      if (!campaignYears.has(currentCountry)) campaignYears.set(currentCountry, new Set());
      campaignYears.get(currentCountry).add(y);
    }
  }
}

function normalizeCampaignLookupName(name) {
  let k = name.toLowerCase().trim().replace(/\s+/g, ' ');
  if (CAMPAIGN_ALIASES[k]) k = CAMPAIGN_ALIASES[k];
  return k;
}

function hasCampaignQuestions(campaignYears, name, year) {
  const base = normalizeCampaignLookupName(name);
  const set = campaignYears.get(base);
  return !!(set && set.has(String(year)));
}

const appearancesPath = join(root, 'src/data/worldCupAppearances.ts');
const appearancesContent = readFileSync(appearancesPath, 'utf-8');
const countries = parseWorldCupNations(appearancesContent);

if (countries.length === 0) {
  console.error('No nations parsed from worldCupAppearances.ts — check file format.');
  process.exit(2);
}

const campaignYears = new Map();
ingestCampaignYears(join(root, 'src/data/campaignQuestions.ts'), campaignYears);
ingestCampaignYears(join(root, 'src/data/campaignCameroonNorthernIreland.ts'), campaignYears);

const countryHistoryPath = join(root, 'src/data/countryHistoryQuestions.ts');
const countryHistoryContent = readFileSync(countryHistoryPath, 'utf-8');
const countryHistoryCodes = new Set();
for (const m of countryHistoryContent.matchAll(/\{\s*countryCode:\s*'([^']+)'/g)) {
  countryHistoryCodes.add(m[1]);
}

function hasCountryQuestions(code) {
  const mapped = CODE_MAP[code] || code;
  return countryHistoryCodes.has(mapped);
}

const gaps = [];
const ok = [];

for (const { name, code, years } of countries) {
  for (const year of years) {
    const hasCampaign = hasCampaignQuestions(campaignYears, name, year);
    const hasCountry = hasCountryQuestions(code);
    const hasQuestions = hasCampaign || hasCountry;
    if (hasQuestions) {
      ok.push({ name, code, year, source: hasCampaign ? 'campaign' : 'country-bank-coarse' });
    } else {
      gaps.push({ name, code, year });
    }
  }
}

console.log('=== COUNTRY ROUTE VALIDATION ===\n');
console.log(`Nations parsed: ${countries.length}`);
console.log(`Campaign country keys: ${campaignYears.size}`);
console.log(`Total routes (nation × year): ${ok.length + gaps.length}`);
console.log(`OK: ${ok.length}`);
console.log(`GAPS (no campaign & no bank row): ${gaps.length}\n`);

if (gaps.length > 0) {
  console.log('GAPS — likely empty game or “Questions coming soon”:');
  const byCountry = new Map();
  gaps.forEach(({ name, code, year }) => {
    if (!byCountry.has(name)) byCountry.set(name, []);
    byCountry.get(name).push({ year, code });
  });
  [...byCountry.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, items]) => {
      items.sort((a, b) => a.year - b.year);
      const years = items.map((i) => i.year).join(', ');
      const codes = [...new Set(items.map((i) => i.code))];
      console.log(`  ${name} (${codes.join('/')}): ${years}`);
    });
  console.log('\nNotes:');
  console.log('- Add campaign blocks in campaignQuestions.ts (or satellite TS merged there).');
  console.log('- Or add countryHistoryData bank + questions mentioning that year (CountryGame filters by year).');
  console.log('- Bank presence alone is coarse; some years may still lack year-specific questions.');
  process.exit(1);
}

console.log('All country routes have at least one question source.');

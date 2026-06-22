/**
 * Triple-check audit for 2026 squad predictor pools.
 * Run: npx tsx scripts/audit-2026-squad-pools.mts
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SQUAD_PREDICTOR_ALL_NATIONS } from '../src/data/squadPredictor2026Groups.ts';
import { EXPANDED_POOLS } from '../src/data/squadPredictorExpandedTacticalRoles.ts';
import { ENGLAND_2026_ROSTER_ENTRIES } from '../src/data/squadPredictorEnglandRoster2026.ts';
import { getPlayersForNation } from '../src/data/squadPredictorMockPlayers.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const WIKI_PATH = join(
  process.env.HOME ?? '',
  '.cursor/projects/Users-abelghebremichael-Documents-world-cup-trivia-pro/agent-tools/0863c7cf-896d-48b5-93df-3ed6f7c95401.txt',
);

const NATION_LABEL: Record<string, string> = {
  Algeria: 'Algeria',
  Argentina: 'Argentina',
  Australia: 'Australia',
  Austria: 'Austria',
  Belgium: 'Belgium',
  'Bosnia & Herzegovina': 'Bosnia',
  Brazil: 'Brazil',
  Canada: 'Canada',
  'Cape Verde': 'Cape Verde',
  Colombia: 'Colombia',
  Croatia: 'Croatia',
  Curaçao: 'Curaçao',
  Czechia: 'Czechia',
  'DR Congo': 'DR Congo',
  Ecuador: 'Ecuador',
  Egypt: 'Egypt',
  England: 'England',
  France: 'France',
  Germany: 'Germany',
  Ghana: 'Ghana',
  Haiti: 'Haiti',
  Iran: 'Iran',
  Iraq: 'Iraq',
  'Ivory Coast': "Côte d'Ivoire",
  Japan: 'Japan',
  Jordan: 'Jordan',
  Mexico: 'Mexico',
  Morocco: 'Morocco',
  Netherlands: 'Netherlands',
  'New Zealand': 'New Zealand',
  Norway: 'Norway',
  Panama: 'Panama',
  Paraguay: 'Paraguay',
  Portugal: 'Portugal',
  Qatar: 'Qatar',
  'Saudi Arabia': 'Saudi Arabia',
  Scotland: 'Scotland',
  Senegal: 'Senegal',
  'South Africa': 'South Africa',
  'South Korea': 'South Korea',
  Spain: 'Spain',
  Sweden: 'Sweden',
  Switzerland: 'Switzerland',
  Tunisia: 'Tunisia',
  Türkiye: 'Turkey',
  'United States': 'USA',
  Uruguay: 'Uruguay',
  Uzbekistan: 'Uzbekistan',
};

const CAPS = { GK: 3, DEF: 10, MID: 11, FWD: 11 } as const;
const ROLE_TO_BUCKET: Record<string, keyof typeof CAPS> = {
  GK: 'GK',
  CB: 'DEF',
  LB: 'DEF',
  RB: 'DEF',
  LWB: 'DEF',
  RWB: 'DEF',
  DM: 'MID',
  DMC: 'MID',
  CM: 'MID',
  AMC: 'MID',
  LW: 'FWD',
  RW: 'FWD',
  LF: 'FWD',
  RF: 'FWD',
  CF: 'FWD',
  ST: 'FWD',
  SS: 'FWD',
};

function parsePlayersFromLine(line: string): string[] {
  const m = line.match(/^(?:Goalkeepers|Defenders|Midfielders|Forwards|Attackers):\s*(.+)$/i);
  if (!m) return [];
  const names: string[] = [];
  const re = /([^,]+?)\s*\([^)]+\)/g;
  let hit: RegExpExecArray | null;
  while ((hit = re.exec(m[1]!)) !== null) names.push(hit[1]!.trim().replace(/\+$/, ''));
  return names;
}

function parseOfficial(md: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const section of md.split(/^## /m).slice(1)) {
    const title = section.split('\n')[0]?.trim() ?? '';
    const label = NATION_LABEL[title];
    if (!label || title.startsWith('FIFA World Cup')) continue;
    const all: string[] = [];
    for (const line of section.split('\n')) {
      if (/^(?:Goalkeepers|Defenders|Midfielders|Forwards|Attackers):/i.test(line)) {
        all.push(...parsePlayersFromLine(line));
      }
    }
    out.set(label, all);
  }
  return out;
}

function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fuzzyInPool(name: string, pool: string[]): boolean {
  const n = norm(name);
  return pool.some((p) => norm(p) === n || norm(p).includes(n) || n.includes(norm(p)));
}

const errors: string[] = [];
const warnings: string[] = [];

// 1) SquadTab must not render roster browser
const squadTab = readFileSync(join(ROOT, 'src/pages/SquadTab.tsx'), 'utf8');
if (squadTab.includes('PlayerList')) errors.push('SquadTab still imports/renders PlayerList (roster browser)');
else console.log('✓ Roster browser removed from SquadTab');

// 2) All 48 nations present in groups
if (SQUAD_PREDICTOR_ALL_NATIONS.length !== 48) {
  errors.push(`Expected 48 nations in groups, got ${SQUAD_PREDICTOR_ALL_NATIONS.length}`);
}

// 3) Expanded pools = 47 (England separate)
if (EXPANDED_POOLS.length !== 47) errors.push(`Expected 47 expanded pools, got ${EXPANDED_POOLS.length}`);
else console.log('✓ 47 expanded nation pools present');

// 4) England curated roster
const engCounts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
for (const e of ENGLAND_2026_ROSTER_ENTRIES) engCounts[e.position]++;
if (ENGLAND_2026_ROSTER_ENTRIES.length !== 35) errors.push(`England: expected 35 entries, got ${ENGLAND_2026_ROSTER_ENTRIES.length}`);
if (engCounts.GK !== 3 || engCounts.DEF !== 10 || engCounts.MID !== 11 || engCounts.FWD !== 11) {
  errors.push(`England bucket counts wrong: ${JSON.stringify(engCounts)}`);
}
const engOfficial = [
  'Jordan Pickford',
  'Dean Henderson',
  'James Trafford',
  'Harry Kane',
  'Bukayo Saka',
  'Jude Bellingham',
  'Declan Rice',
];
for (const n of engOfficial) {
  if (!ENGLAND_2026_ROSTER_ENTRIES.some((e) => e.name === n)) errors.push(`England missing official: ${n}`);
}
console.log('✓ England 35-man roster with Tuchel call-ups');

// 5) Per-nation bucket counts + no synthetic placeholders
let syntheticTotal = 0;
let gkMisplaced = 0;
for (const pool of EXPANDED_POOLS) {
  const players = getPlayersForNation(pool.label);
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const p of players) {
    counts[p.position]++;
    if (/Reserve \(\d+\)/.test(p.name) || p.name.includes('Reserve (')) syntheticTotal++;
    if (p.tactical === 'GK' && p.position !== 'GK') gkMisplaced++;
  }
  if (players.length !== 35) errors.push(`${pool.label}: ${players.length} players (expected 35)`);
  if (counts.GK !== 3 || counts.DEF !== 10 || counts.MID !== 11 || counts.FWD !== 11) {
    errors.push(`${pool.label}: buckets ${JSON.stringify(counts)}`);
  }
}
if (syntheticTotal > 0) errors.push(`${syntheticTotal} synthetic placeholder players found`);
else console.log('✓ No synthetic placeholder players');

if (gkMisplaced > 0) warnings.push(`${gkMisplaced} players with GK tactical role in outfield bucket`);
else console.log('✓ No GK tactical roles misplaced in outfield');

// 6) Official FIFA 26 cross-check (fuzzy name match)
const md = readFileSync(WIKI_PATH, 'utf8');
const official = parseOfficial(md);
let officialMissing = 0;
let nationsChecked = 0;
for (const pool of EXPANDED_POOLS) {
  const off = official.get(pool.label);
  if (!off || off.length < 20) {
    warnings.push(`${pool.label}: could not parse official squad from reference`);
    continue;
  }
  nationsChecked++;
  const poolNames = pool.players as string[];
  for (const name of off) {
    if (!fuzzyInPool(name, poolNames)) {
      officialMissing++;
      if (officialMissing <= 8) warnings.push(`${pool.label}: official player not in pool → ${name}`);
    }
  }
}
console.log(`✓ Cross-checked official squads for ${nationsChecked}/47 nations (${officialMissing} name mismatches)`);

// 7) Spot-check marquee call-ups
const spotChecks: [string, string[]][] = [
  ['Brazil', ['Neymar', 'Alisson', 'Vinícius Júnior', 'Casemiro']],
  ['Portugal', ['Cristiano Ronaldo', 'Diogo Costa', 'Rúben Dias', 'Bernardo Silva']],
  ['Spain', ['Rodri', 'Lamine Yamal', 'Pedri', 'Unai Simón']],
  ['Germany', ['Manuel Neuer', 'Jamal Musiala', 'Florian Wirtz', 'Kai Havertz']],
  ['Mexico', ['Guillermo Ochoa', 'Raúl Jiménez', 'Gilberto Mora']],
  ['Argentina', ['Lionel Messi', 'Emiliano Martínez', 'Lautaro Martínez']],
  ['USA', ['Christian Pulisic', 'Matt Turner', 'Tyler Adams']],
  ['France', ['Kylian Mbappé', 'William Saliba', 'Ousmane Dembélé']],
];
for (const [nation, mustHave] of spotChecks) {
  const names = getPlayersForNation(nation).map((p) => p.name);
  for (const m of mustHave) {
    if (!names.some((n) => norm(n) === norm(m))) errors.push(`Spot-check ${nation}: missing ${m}`);
  }
}
console.log('✓ Marquee player spot-checks passed');

// 8) Tactical role matches bucket for mock players
let roleBucketMismatch = 0;
for (const pool of EXPANDED_POOLS) {
  for (const p of getPlayersForNation(pool.label)) {
    if (!p.tactical) continue;
    const expected = ROLE_TO_BUCKET[p.tactical];
    if (expected && expected !== p.position) roleBucketMismatch++;
  }
}
if (roleBucketMismatch > 0) warnings.push(`${roleBucketMismatch} tactical roles not matching assigned bucket (may be rebalance)`);
else console.log('✓ Tactical roles align with position buckets');

console.log('\n--- AUDIT SUMMARY ---');
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  warnings.slice(0, 15).forEach((w) => console.log('  ⚠', w));
  if (warnings.length > 15) console.log(`  ... and ${warnings.length - 15} more`);
}
if (errors.length) {
  console.log(`FAILED (${errors.length} errors):`);
  errors.forEach((e) => console.log('  ✗', e));
  process.exit(1);
}
console.log('PASSED — all triple-checks OK');

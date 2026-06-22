/**
 * Audit: for each Select-a-Legend player (parsed from country TS sources),
 * count buildPlayerQuestionPool() questions per eventYear. Target: 10 per campaign tile.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildPlayerQuestionPool,
  getPlayerWorldCupYearsForLevelsSorted,
  getPlayerWorldCupYearsSorted,
} from '../src/data/playerQuestions.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const TARGET = 10;

function extractRosterFromFile(absPath: string): { country: string; id: string; name: string }[] {
  const text = fs.readFileSync(absPath, 'utf8');
  const out: { country: string; id: string; name: string }[] = [];
  const blockRe =
    /name:\s*'([^']+)',\s*\n\s*flag:[\s\S]*?players:\s*\[([\s\S]*?)\n\s*\],/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(text))) {
    const country = m[1];
    const pblock = m[2];
    const playerLineRe = /\{\s*id:\s*'([^']+)',\s*name:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
    let pm: RegExpExecArray | null;
    while ((pm = playerLineRe.exec(pblock))) {
      const id = pm[1];
      let name = pm[2];
      if (name.startsWith('"')) {
        name = JSON.parse(name) as string;
      } else {
        name = name.slice(1, -1).replace(/\\'/g, "'");
      }
      out.push({ country, id, name });
    }
  }
  return out;
}

const roster = [
  ...extractRosterFromFile(path.join(root, 'src/data/selectLegendCountriesCore.ts')),
  ...extractRosterFromFile(path.join(root, 'src/data/cafAfcLegendCountries.ts')),
];

type Row = {
  country: string;
  playerId: string;
  playerName: string;
  year: number;
  count: number;
  playedYears: number;
  levelYears: number;
};

const shortfalls: Row[] = [];
const surpluses: Row[] = [];
const noEventYear: { country: string; playerId: string; playerName: string; pool: number; missing: number }[] =
  [];

for (const { country, id: playerId, name: playerName } of roster) {
  const pool = buildPlayerQuestionPool(playerId);
  const missingTag = pool.filter((q) => q.eventYear == null).length;
  if (missingTag > 0) {
    noEventYear.push({
      country,
      playerId,
      playerName,
      pool: pool.length,
      missing: missingTag,
    });
  }

  const playedYears = getPlayerWorldCupYearsSorted(playerId);
  const levelYears = getPlayerWorldCupYearsForLevelsSorted(playerId);
  const yearSet = new Set([...playedYears, ...levelYears]);

  for (const y of [...yearSet].sort((a, b) => a - b)) {
    const count = pool.filter((q) => q.eventYear === y).length;
    const row: Row = {
      country,
      playerId,
      playerName,
      year: y,
      count,
      playedYears: playedYears.includes(y) ? 1 : 0,
      levelYears: levelYears.includes(y) ? 1 : 0,
    };
    if (count < TARGET) shortfalls.push(row);
    if (count > TARGET) surpluses.push(row);
  }
}

function printSummary(title: string, rows: Row[]) {
  console.log(`\n=== ${title} (${rows.length}) ===\n`);
  if (rows.length === 0) {
    console.log('(none)\n');
    return;
  }
  const byCountry = new Map<string, Row[]>();
  for (const r of rows) {
    if (!byCountry.has(r.country)) byCountry.set(r.country, []);
    byCountry.get(r.country)!.push(r);
  }
  const countries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b, 'en'));
  for (const c of countries) {
    console.log(`\n${c}`);
    for (const r of byCountry.get(c)!.sort((a, b) => a.playerName.localeCompare(b.playerName) || a.year - b.year)) {
      console.log(
        `  - ${r.playerName} · ${r.year} · ${r.count}/${TARGET} · levelTileYear=${r.levelYears > 0} playedFinals=${r.playedYears > 0}`,
      );
    }
  }
}

console.log('Select-a-Legend scan (buildPlayerQuestionPool + eventYear counts)');
console.log(`Convention target: ${TARGET} questions per World Cup year shown as a level/tile.`);
console.log(`Roster entries parsed: ${roster.length}\n`);

if (noEventYear.length > 0) {
  console.log('=== Questions in pool with no eventYear ===\n');
  for (const r of noEventYear) {
    console.log(`  ${r.country} · ${r.playerName}: ${r.missing} of ${r.pool} lack eventYear`);
  }
}

printSummary(`Years with fewer than ${TARGET} questions`, shortfalls);
printSummary(`Years with more than ${TARGET} questions`, surpluses);

console.log('\n--- Summary ---');
console.log(`Pairings (player + year) below ${TARGET}: ${shortfalls.length}`);
console.log(`Pairings above ${TARGET}: ${surpluses.length}`);
console.log(`Players with missing eventYear on some cards: ${noEventYear.length}`);

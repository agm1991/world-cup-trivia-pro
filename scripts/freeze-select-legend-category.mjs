/**
 * Lock Select a Legend category (roster, questions, portraits, player pages).
 *
 *   node scripts/freeze-select-legend-category.mjs          # dry run
 *   node scripts/freeze-select-legend-category.mjs --confirm
 *   node scripts/freeze-select-legend-category.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/selectLegendCategory.frozen.manifest.json');

const EXCLUDED_DATA = new Set([
  'legendGuessWhoGenerator.ts', // not wired to Select a Legend
]);

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    if (fs.statSync(fp).isDirectory()) walkFiles(fp, out);
    else out.push(fp);
  }
  return out;
}

function rel(fp) {
  return path.relative(ROOT, fp).split(path.sep).join('/');
}

function dataFileMatches(name) {
  return (
    /Legend/i.test(name) ||
    /AuthorVerbatim/i.test(name) ||
    /^wcPerformanceBatch/i.test(name) ||
    /^cameroonPlayerWCQuestionSupplement/i.test(name) ||
    /^playerQuestions(?:MissingLegends|SelectLegendBlocks|SaudiRussia|Turkey)/i.test(name) ||
    /^selectLegendCountries/i.test(name) ||
    /^cafAfcLegend/i.test(name) ||
    /^(legendHostQuestionBudget|legendQuestionDedupe|legendAuthorVerbatimId|legendCountryLevelCardStyles|legendKickOffPortraits|countryThreeLegendQuestions|playerMatchLogPolicy|playerQuestionPad|playerQuestions)\.ts$/i.test(
      name,
    )
  );
}

export function collectSelectLegendLockedFiles() {
  const locked = new Set();

  const dataDir = path.join(ROOT, 'src/data');
  for (const name of fs.readdirSync(dataDir)) {
    if (EXCLUDED_DATA.has(name)) continue;
    if (name.endsWith('.bak')) continue;
    if (name.endsWith('.frozen.manifest.json')) continue;
    if (dataFileMatches(name)) locked.add(`src/data/${name}`);
  }

  for (const page of [
    'PlayerLevels.tsx',
    'PlayerCountryPlayers.tsx',
    'PlayerGame.tsx',
    'PlayerKickOff.tsx',
    'PlayerLevelSelection.tsx',
  ]) {
    locked.add(`src/pages/${page}`);
  }

  locked.add('src/lib/legendPlayerPortrait.ts');

  const playersDir = path.join(ROOT, 'src/assets/players');
  for (const fp of walkFiles(playersDir)) {
    locked.add(rel(fp));
  }

  return [...locked].sort();
}

function sha256File(relPath) {
  const fp = path.join(ROOT, relPath);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${relPath}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function rosterStats() {
  const core = fs.readFileSync(path.join(ROOT, 'src/data/selectLegendCountriesCore.ts'), 'utf8');
  const caf = fs.readFileSync(path.join(ROOT, 'src/data/cafAfcLegendCountries.ts'), 'utf8');
  const countries =
    (core.match(/^\s+name: '/gm) ?? []).length + (caf.match(/^\s+name: '/gm) ?? []).length;
  const legends = (core.match(/id: '/g) ?? []).length + (caf.match(/id: '/g) ?? []).length;
  return { countries, legends };
}

function buildManifest() {
  const lockedFiles = collectSelectLegendLockedFiles();
  const files = {};
  for (const r of lockedFiles) {
    files[r] = { sha256: sha256File(r) };
  }
  const { countries, legends } = rosterStats();
  return {
    version: 1,
    category: 'select-a-legend',
    lockedAt: new Date().toISOString(),
    stats: {
      countries,
      legends,
      lockedFiles: lockedFiles.length,
    },
    files,
  };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.join(path.dirname(fileURLToPath(import.meta.url)), 'freeze-select-legend-category.mjs');

if (!isMain) {
  // Imported by validate script — skip CLI.
} else {
const confirm = process.argv.includes('--confirm');
const rehash = process.argv.includes('--rehash');

if (rehash) {
  if (!fs.existsSync(MANIFEST)) {
    console.error('No manifest to rehash. Run with --confirm first.');
    process.exit(1);
  }
  const next = buildManifest();
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  next.lockedAt = prev.lockedAt;
  fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
  console.log('Rehashed Select a Legend category manifest.');
  console.log(`  ${next.stats.countries} countries, ${next.stats.legends} legends, ${next.stats.lockedFiles} files`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const prevKeys = Object.keys(prev.files ?? {});
  const nextKeys = Object.keys(next.files);
  const changed = nextKeys.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  const added = nextKeys.filter((rel) => !prev.files?.[rel]);
  const removed = prevKeys.filter((rel) => !next.files[rel]);
  if (!changed.length && !added.length && !removed.length && !confirm) {
    console.log('Select a Legend category manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files with changed checksums:');
    for (const r of changed) console.log(`  • ${r}`);
  }
  if (added.length) {
    console.log('New files:');
    for (const r of added) console.log(`  + ${r}`);
  }
  if (removed.length) {
    console.log('Removed files:');
    for (const r of removed) console.log(`  - ${r}`);
  }
} else {
  console.log(`Would create Select a Legend manifest (${next.stats.lockedFiles} files).`);
}

console.log(
  `\nStats: ${next.stats.countries} countries, ${next.stats.legends} legends, ${next.stats.lockedFiles} locked files`,
);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);
}

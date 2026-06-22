/**
 * Lock Country History category files with SHA-256 manifest.
 *
 *   node scripts/freeze-country-history-category.mjs          # dry run
 *   node scripts/freeze-country-history-category.mjs --confirm
 *   node scripts/freeze-country-history-category.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/countryHistoryCategory.frozen.manifest.json');

const LOCKED_FILES = [
  'src/data/campaignQuestions.ts',
  'src/data/campaignCameroonNorthernIreland.ts',
  'src/data/countryHistoryQuestions.ts',
  'src/data/worldCupAppearances.ts',
  'src/pages/CountryHistory.tsx',
  'src/pages/CountryHistoryYears.tsx',
  'src/pages/CountryGame.tsx',
  'src/pages/CountryGameIntro.tsx',
  'src/pages/CountryLevels.tsx',
];

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function appearanceYearCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/worldCupAppearances.ts'), 'utf8');
  const blocks = text.match(/worldCupYears:\s*\[[^\]]*\]/g) ?? [];
  let total = 0;
  for (const block of blocks) {
    total += (block.match(/\d{4}/g) ?? []).length;
  }
  return total;
}

function nationCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/worldCupAppearances.ts'), 'utf8');
  return (text.match(/name:\s*'/g) ?? []).length;
}

function campaignQuestionCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/campaignQuestions.ts'), 'utf8');
  return (text.match(/\{\s*id:\s*\d+,\s*question:/g) ?? []).length;
}

function buildManifest() {
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  return {
    version: 1,
    category: 'country-history',
    lockedAt: new Date().toISOString(),
    stats: {
      nations: nationCount(),
      appearanceYears: appearanceYearCount(),
      campaignQuestions: campaignQuestionCount(),
      lockedFiles: LOCKED_FILES.length,
    },
    files,
  };
}

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
  console.log('Rehashed Country History category manifest.');
  console.log(`  nations: ${next.stats.nations}, appearance-years: ${next.stats.appearanceYears}`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  if (!changed.length && !confirm) {
    console.log('Country History category manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
} else {
  console.log('Would create new Country History category manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
}

console.log(
  `\nStats: ${next.stats.nations} nations, ${next.stats.appearanceYears} appearance-years, ${next.stats.campaignQuestions} campaign questions, ${next.stats.lockedFiles} locked files`,
);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

/**
 * Lock World Cup Stadiums category files with SHA-256 manifest.
 *
 *   node scripts/freeze-stadiums-category.mjs          # dry run
 *   node scripts/freeze-stadiums-category.mjs --confirm
 *   node scripts/freeze-stadiums-category.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/stadiumsCategory.frozen.manifest.json');

const LOCKED_FILES = [
  'src/data/stadiumsQuestionsLevels1to6.ts',
  'src/data/stadiumsQuestions.ts',
  'src/pages/StadiumsGame.tsx',
  'src/pages/Game.tsx',
  'src/lib/categoryNavigation.ts',
  'src/App.tsx',
];

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function questionCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/stadiumsQuestionsLevels1to6.ts'), 'utf8');
  return (text.match(/id: 'stad-l\d+-q\d+'/g) ?? []).length;
}

function buildManifest() {
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  return {
    version: 1,
    category: 'stadiums',
    lockedAt: new Date().toISOString(),
    stats: {
      levels: 30,
      questions: questionCount(),
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
  console.log('Rehashed stadiums category manifest.');
  console.log(`  questions: ${next.stats.questions}`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  if (!changed.length && !confirm) {
    console.log('Stadiums category manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
} else {
  console.log('Would create new stadiums category manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
}

console.log(`\nStats: ${next.stats.questions} questions, ${next.stats.levels} levels, ${next.stats.lockedFiles} locked files`);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

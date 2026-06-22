/**
 * Lock World Cup general-knowledge category (levels 1–50) with SHA-256 manifest.
 *
 *   node scripts/freeze-world-cup-category.mjs          # dry run
 *   node scripts/freeze-world-cup-category.mjs --confirm
 *   node scripts/freeze-world-cup-category.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/worldCupCategory.frozen.manifest.json');

const LOCKED_FILES = [
  'src/data/worldCupQuestions.ts',
  'src/data/worldCupQuestionsFinals.ts',
  'src/data/worldCupQuestionsLevels31to34.ts',
  'src/data/worldCupQuestionsLevels35to40.ts',
  'src/lib/worldCupLevels31to40Interleave.ts',
  'src/data/worldCupLevelConfig.ts',
];

const QUESTION_DATA_FILES = [
  'src/data/worldCupQuestions.ts',
  'src/data/worldCupQuestionsFinals.ts',
  'src/data/worldCupQuestionsLevels31to34.ts',
  'src/data/worldCupQuestionsLevels35to40.ts',
];

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function questionCount() {
  let count = 0;
  for (const rel of QUESTION_DATA_FILES) {
    const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    count += (text.match(/id: 'wc-/g) ?? []).length;
  }
  return count;
}

function buildManifest() {
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  return {
    version: 1,
    category: 'world-cup',
    lockedAt: new Date().toISOString(),
    stats: {
      levels: 50,
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
  console.log('Rehashed World Cup category manifest.');
  console.log(`  questions: ${next.stats.questions}, levels: ${next.stats.levels}`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  if (!changed.length && !confirm) {
    console.log('World Cup category manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
} else {
  console.log('Would create new World Cup category manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
}

console.log(
  `\nStats: ${next.stats.levels} levels, ${next.stats.questions} questions, ${next.stats.lockedFiles} locked files`,
);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

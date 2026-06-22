/**
 * Lock World Cup Bingo category — static files + SHA-256 of all 204×10 runtime questions.
 *
 *   node scripts/freeze-world-cup-bingo-category.mjs          # dry run
 *   node scripts/freeze-world-cup-bingo-category.mjs --confirm
 *   node scripts/freeze-world-cup-bingo-category.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/worldCupBingoCategory.frozen.manifest.json');

const LOCKED_FILES = [
  'src/data/worldCupBingoQuestions.ts',
  'src/data/worldCupBingoLevels199to204.frozen.ts',
  'src/data/bingoMissingPlayerQuestionsFrozenL1to204.ts',
  'src/data/bingoMissingPlayerLineupFrozenL1to204.ts',
  'src/data/bingoMissingPlayerLineupFrozenL1to6.ts',
  'src/data/bingoMissingPlayerLineupSupplements.ts',
  'src/data/bingoMissingPlayerLineupVerifiedFixtures.ts',
  'src/data/bingoMissingPlayerLineupOverrides.generated.ts',
  'src/data/bingoMissingPlayerLineupAuto.ts',
  'src/data/bingoMpLineupCatalog.ts',
  'src/data/scorelineSingleTeamOpponents.ts',
  'src/lib/missingPlayerBingoLineupResolve.ts',
  'src/lib/missingPlayerBingoPrompt.ts',
];

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function computeLevelsPayloadSha256() {
  return execSync('npx vite-node scripts/bingo-compute-levels-payload-hash.mts', {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function buildManifest() {
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  const levelsPayloadSha256 = computeLevelsPayloadSha256();
  return {
    version: 1,
    category: 'world-cup-bingo',
    lockedAt: new Date().toISOString(),
    stats: {
      levels: 204,
      questionsPerLevel: 10,
      totalQuestions: 2040,
      lockedFiles: LOCKED_FILES.length,
      levelsPayloadSha256,
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
  console.log('Rehashed World Cup Bingo category manifest.');
  console.log(`  levels payload: ${next.stats.levelsPayloadSha256.slice(0, 16)}…`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  const payloadChanged = prev.stats?.levelsPayloadSha256 !== next.stats.levelsPayloadSha256;
  if (!changed.length && !payloadChanged && !confirm) {
    console.log('World Cup Bingo category manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
  if (payloadChanged) {
    console.log('Levels payload SHA-256 would change (204×10 questions).');
  }
} else {
  console.log('Would create new World Cup Bingo category manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
  console.log('Plus runtime hash of all 204 levels × 10 questions.');
}

console.log(
  `\nStats: ${next.stats.levels} levels, ${next.stats.totalQuestions} questions, ${next.stats.lockedFiles} locked files`,
);
console.log(`Levels payload SHA-256: ${next.stats.levelsPayloadSha256}`);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

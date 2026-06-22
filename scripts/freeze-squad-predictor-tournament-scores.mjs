/**
 * Lock Squad Predictor tournament score defaults (all group + knockout inputs start 0-0).
 *
 *   node scripts/freeze-squad-predictor-tournament-scores.mjs          # dry run
 *   node scripts/freeze-squad-predictor-tournament-scores.mjs --confirm
 *   node scripts/freeze-squad-predictor-tournament-scores.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/squadPredictorTournamentScores.frozen.manifest.json');

const LOCKED_FILES = ['src/contexts/SquadPredictorHubContext.tsx'];

const EXPECTED_SEED = 4;
const EXPECTED_GROUP_MATCHES = 72; // 12 groups × 6 fixtures

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function readHubContext() {
  return fs.readFileSync(path.join(ROOT, 'src/contexts/SquadPredictorHubContext.tsx'), 'utf8');
}

function assertTournamentScoreContract(text) {
  const required = [
    'const TOURNAMENT_SCORES_SEED = 4',
    "out[groupStageMatchKey(g.id, i, j)] = '0-0'",
    "return { teamA: 'TBD', teamB: 'TBD', sA: '0', sB: '0', tie: '' }",
    'function buildAllGroupScoresZeroZero',
    'function resetTournamentScoresToZeroZero',
    'tournamentScoresSeed: TOURNAMENT_SCORES_SEED',
  ];
  const missing = required.filter((snippet) => !text.includes(snippet));
  if (missing.length) {
    throw new Error(`Tournament 0-0 contract missing in SquadPredictorHubContext.tsx:\n  ${missing.join('\n  ')}`);
  }
}

function buildManifest() {
  const text = readHubContext();
  assertTournamentScoreContract(text);
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  return {
    version: 1,
    category: 'squad-predictor-tournament-scores',
    lockedAt: new Date().toISOString(),
    stats: {
      tournamentScoresSeed: EXPECTED_SEED,
      groupFixtures: EXPECTED_GROUP_MATCHES,
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
  console.log('Rehashed squad predictor tournament scores manifest.');
  console.log(`  seed: ${next.stats.tournamentScoresSeed}`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  if (!changed.length && !confirm) {
    console.log('Squad predictor tournament scores manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
} else {
  console.log('Would create new squad predictor tournament scores manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
}

console.log(
  `\nStats: seed ${next.stats.tournamentScoresSeed}, ${next.stats.groupFixtures} group fixtures, ${next.stats.lockedFiles} locked files`,
);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

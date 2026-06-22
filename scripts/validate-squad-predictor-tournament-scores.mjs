/**
 * Verify Squad Predictor tournament 0-0 defaults match frozen manifest.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/squadPredictorTournamentScores.frozen.manifest.json');
const HUB_CONTEXT = path.join(ROOT, 'src/contexts/SquadPredictorHubContext.tsx');

if (!fs.existsSync(MANIFEST)) {
  console.error('validate-squad-predictor-tournament-scores: manifest missing');
  console.error('  Lock with: node scripts/freeze-squad-predictor-tournament-scores.mjs --confirm');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
let failed = false;

for (const [rel, meta] of Object.entries(manifest.files ?? {})) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.error(`validate-squad-predictor-tournament-scores: missing ${rel}`);
    failed = true;
    continue;
  }
  const computed = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
  if (computed !== meta.sha256) {
    console.error(`validate-squad-predictor-tournament-scores: TAMPERED ${rel}`);
    console.error(`  embedded: ${meta.sha256}`);
    console.error(`  computed: ${computed}`);
    failed = true;
  }
}

const hubText = fs.readFileSync(HUB_CONTEXT, 'utf8');
const required = [
  'const TOURNAMENT_SCORES_SEED = 4',
  "out[groupStageMatchKey(g.id, i, j)] = '0-0'",
  "return { teamA: 'TBD', teamB: 'TBD', sA: '0', sB: '0', tie: '' }",
  'function buildAllGroupScoresZeroZero',
  'function resetTournamentScoresToZeroZero',
  'tournamentScoresSeed: TOURNAMENT_SCORES_SEED',
];
for (const snippet of required) {
  if (!hubText.includes(snippet)) {
    console.error(`validate-squad-predictor-tournament-scores: contract broken — missing "${snippet}"`);
    failed = true;
  }
}

if (failed) {
  console.error('  Re-lock with: node scripts/freeze-squad-predictor-tournament-scores.mjs --confirm');
  process.exit(1);
}

console.log(
  `Squad Predictor tournament scores OK (seed ${manifest.stats?.tournamentScoresSeed ?? 4}, ${manifest.stats?.groupFixtures ?? 72} group fixtures, locked ${manifest.lockedAt?.slice(0, 10) ?? '?'})`,
);

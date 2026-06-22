/**
 * Verify World Cup Bingo category matches frozen manifest (files + 204×10 question payload).
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/worldCupBingoCategory.frozen.manifest.json');

if (!fs.existsSync(MANIFEST)) {
  console.error('validate-world-cup-bingo-category: manifest missing');
  console.error('  Lock with: node scripts/freeze-world-cup-bingo-category.mjs --confirm');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
let failed = false;

for (const [rel, meta] of Object.entries(manifest.files ?? {})) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.error(`validate-world-cup-bingo-category: missing ${rel}`);
    failed = true;
    continue;
  }
  const computed = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
  if (computed !== meta.sha256) {
    console.error(`validate-world-cup-bingo-category: TAMPERED ${rel}`);
    console.error(`  embedded: ${meta.sha256}`);
    console.error(`  computed: ${computed}`);
    failed = true;
  }
}

const expectedPayload = manifest.stats?.levelsPayloadSha256;
if (expectedPayload) {
  let computedPayload;
  try {
    computedPayload = execSync('npx vite-node scripts/bingo-compute-levels-payload-hash.mts', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    }).trim();
  } catch {
    failed = true;
    computedPayload = '';
  }
  if (computedPayload && computedPayload !== expectedPayload) {
    console.error('validate-world-cup-bingo-category: LEVELS PAYLOAD TAMPERED');
    console.error(`  embedded: ${expectedPayload}`);
    console.error(`  computed: ${computedPayload}`);
    failed = true;
  }
}

if (failed) {
  console.error('  Re-lock with: node scripts/freeze-world-cup-bingo-category.mjs --confirm');
  process.exit(1);
}

console.log(
  `World Cup Bingo category OK (${manifest.stats?.levels ?? 204} levels, ${manifest.stats?.totalQuestions ?? 2040} questions, locked ${manifest.lockedAt?.slice(0, 10) ?? '?'})`,
);

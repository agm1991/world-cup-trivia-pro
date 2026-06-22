/**
 * Verify Squad Predictor expanded pools match frozen manifest + role alignment.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/squadPredictorExpandedPools.frozen.manifest.json');

if (!fs.existsSync(MANIFEST)) {
  console.error('validate-squad-predictor-expanded-pools: manifest missing');
  console.error('  Lock with: node scripts/freeze-squad-predictor-expanded-pools.mjs --confirm');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
let failed = false;

for (const [rel, meta] of Object.entries(manifest.files ?? {})) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.error(`validate-squad-predictor-expanded-pools: missing ${rel}`);
    failed = true;
    continue;
  }
  const computed = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
  if (computed !== meta.sha256) {
    console.error(`validate-squad-predictor-expanded-pools: TAMPERED ${rel}`);
    console.error(`  embedded: ${meta.sha256}`);
    console.error(`  computed: ${computed}`);
    failed = true;
  }
}

const englandPath = path.join(ROOT, 'src/data/squadPredictorEnglandRoster2026.ts');
if (fs.existsSync(englandPath)) {
  const englandText = fs.readFileSync(englandPath, 'utf8');
  const englandEntries = englandText.match(/id: 'england-r26-\d+'/g) ?? [];
  const englandRoles = englandText.match(/role: '[A-Z]+'/g) ?? [];
  if (englandEntries.length !== 26 || englandRoles.length !== 26) {
    console.error(
      `validate-squad-predictor-expanded-pools: England roster must have 26 players + 26 roles (got ${englandEntries.length}/${englandRoles.length})`,
    );
    failed = true;
  }
} else if (manifest.files?.['src/data/squadPredictorEnglandRoster2026.ts']) {
  console.error('validate-squad-predictor-expanded-pools: missing src/data/squadPredictorEnglandRoster2026.ts');
  failed = true;
}

if (failed) {
  console.error('  Re-lock with: node scripts/freeze-squad-predictor-expanded-pools.mjs --confirm');
  process.exit(1);
}

try {
  execSync('npx tsx scripts/validate-expanded-tactical-roles.ts', {
    cwd: ROOT,
    stdio: 'inherit',
  });
} catch {
  process.exit(1);
}

const nations = manifest.stats?.nations ?? '?';
const expanded = manifest.stats?.expandedNations ?? 47;
console.log(
  `Squad Predictor squads OK (${nations} nations: ${expanded} expanded + England, locked ${manifest.lockedAt?.slice(0, 10) ?? '?'})`,
);

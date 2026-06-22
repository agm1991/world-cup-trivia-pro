/**
 * Verify Country History category matches frozen manifest.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/countryHistoryCategory.frozen.manifest.json');

if (!fs.existsSync(MANIFEST)) {
  console.error('validate-country-history-category: manifest missing');
  console.error('  Lock with: node scripts/freeze-country-history-category.mjs --confirm');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
let failed = false;

for (const [rel, meta] of Object.entries(manifest.files ?? {})) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.error(`validate-country-history-category: missing ${rel}`);
    failed = true;
    continue;
  }
  const computed = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
  if (computed !== meta.sha256) {
    console.error(`validate-country-history-category: TAMPERED ${rel}`);
    console.error(`  embedded: ${meta.sha256}`);
    console.error(`  computed: ${computed}`);
    failed = true;
  }
}

if (failed) {
  console.error('  Re-lock with: node scripts/freeze-country-history-category.mjs --confirm');
  process.exit(1);
}

console.log(
  `Country History category OK (${manifest.stats?.nations ?? '?'} nations, ${manifest.stats?.appearanceYears ?? '?'} appearance-years, locked ${manifest.lockedAt?.slice(0, 10) ?? '?'})`,
);

/**
 * Verify Select a Legend category matches frozen manifest.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { collectSelectLegendLockedFiles } from './freeze-select-legend-category.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/selectLegendCategory.frozen.manifest.json');

if (!fs.existsSync(MANIFEST)) {
  console.error('validate-select-legend-category: manifest missing');
  console.error('  Lock with: node scripts/freeze-select-legend-category.mjs --confirm');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const expected = new Set(collectSelectLegendLockedFiles());
let failed = false;

for (const [rel, meta] of Object.entries(manifest.files ?? {})) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) {
    console.error(`validate-select-legend-category: missing ${rel}`);
    failed = true;
    continue;
  }
  const computed = crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
  if (computed !== meta.sha256) {
    console.error(`validate-select-legend-category: TAMPERED ${rel}`);
    console.error(`  embedded: ${meta.sha256}`);
    console.error(`  computed: ${computed}`);
    failed = true;
  }
  expected.delete(rel);
}

for (const rel of expected) {
  console.error(`validate-select-legend-category: untracked file (re-lock required): ${rel}`);
  failed = true;
}

if (failed) {
  console.error('  Re-lock with: node scripts/freeze-select-legend-category.mjs --confirm');
  process.exit(1);
}

console.log(
  `Select a Legend category OK (${manifest.stats?.countries ?? '?'} countries, ${manifest.stats?.legends ?? '?'} legends, ${manifest.stats?.lockedFiles ?? '?'} files, locked ${manifest.lockedAt?.slice(0, 10) ?? '?'})`,
);

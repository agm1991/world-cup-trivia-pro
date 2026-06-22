/**
 * Lock Squad Predictor expanded nation pools (2026 FIFA squads + tactical roles).
 *
 *   node scripts/freeze-squad-predictor-expanded-pools.mjs          # dry run
 *   node scripts/freeze-squad-predictor-expanded-pools.mjs --confirm
 *   node scripts/freeze-squad-predictor-expanded-pools.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/squadPredictorExpandedPools.frozen.manifest.json');

const LOCKED_FILES = [
  'src/data/squadPredictorExpandedPlayerLists.ts',
  'src/data/squadPredictorExpandedTacticalRoles.ts',
  'src/data/squadPredictorEnglandRoster2026.ts',
];

const EXPECTED_EXPANDED_NATIONS = 47;
const EXPECTED_ENGLAND_SQUAD = 26;

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function expandedNationCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/squadPredictorExpandedPlayerLists.ts'), 'utf8');
  return (text.match(/^export const PLAYERS_/gm) ?? []).length;
}

function assertEnglandRosterContract() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/squadPredictorEnglandRoster2026.ts'), 'utf8');
  const required = [
    'export const ENGLAND_2026_SQUAD_NAME_LIST',
    'export const ENGLAND_2026_ROSTER_ENTRIES',
    'FIFA-confirmed 26-man squad',
  ];
  const missing = required.filter((snippet) => !text.includes(snippet));
  if (missing.length) {
    throw new Error(`England roster contract missing:\n  ${missing.join('\n  ')}`);
  }
  const entries = text.match(/id: 'england-r26-\d+'/g) ?? [];
  if (entries.length !== EXPECTED_ENGLAND_SQUAD) {
    throw new Error(`England roster: expected ${EXPECTED_ENGLAND_SQUAD} entries, found ${entries.length}`);
  }
  const roles = text.match(/role: '[A-Z]+'/g) ?? [];
  if (roles.length !== EXPECTED_ENGLAND_SQUAD) {
    throw new Error(`England roster: expected ${EXPECTED_ENGLAND_SQUAD} tactical roles, found ${roles.length}`);
  }
}

function buildManifest() {
  const expanded = expandedNationCount();
  if (expanded !== EXPECTED_EXPANDED_NATIONS) {
    throw new Error(`Expected ${EXPECTED_EXPANDED_NATIONS} expanded nations, got ${expanded}`);
  }
  assertEnglandRosterContract();
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  return {
    version: 2,
    category: 'squad-predictor-expanded-pools',
    lockedAt: new Date().toISOString(),
    stats: {
      nations: expanded + 1,
      expandedNations: expanded,
      englandSquadSize: EXPECTED_ENGLAND_SQUAD,
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
  console.log('Rehashed squad predictor expanded pools manifest.');
  console.log(`  nations: ${next.stats.nations} (${next.stats.expandedNations} expanded + England)`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  if (!changed.length && !confirm) {
    console.log('Squad predictor expanded pools manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
} else {
  console.log('Would create new squad predictor expanded pools manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
}

console.log(
  `\nStats: ${next.stats.nations} nations (${next.stats.expandedNations} expanded + England), ${next.stats.lockedFiles} locked files`,
);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

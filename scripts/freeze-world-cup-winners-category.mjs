/**
 * Lock World Cup Winners category files with SHA-256 manifest.
 *
 *   node scripts/freeze-world-cup-winners-category.mjs          # dry run
 *   node scripts/freeze-world-cup-winners-category.mjs --confirm
 *   node scripts/freeze-world-cup-winners-category.mjs --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = path.join(ROOT, 'src/data/worldCupWinnersCategory.frozen.manifest.json');

const LOCKED_FILES = [
  'src/data/worldCupWinnerStarPlayers.ts',
  'src/data/worldCupWinnersCountryThemes.ts',
  'src/data/winnersQuestions.ts',
  'src/pages/WorldCupWinners.tsx',
  'src/pages/WorldCupWinnersCountry.tsx',
  'src/pages/WinnersGame.tsx',
  'src/assets/kickoff-portraits/bobby-moore-wc1966.jpg',
];

function sha256File(rel) {
  const fp = path.join(ROOT, rel);
  if (!fs.existsSync(fp)) throw new Error(`Missing ${rel}`);
  return crypto.createHash('sha256').update(fs.readFileSync(fp)).digest('hex');
}

function winnersQuestionCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/data/winnersQuestions.ts'), 'utf8');
  return (text.match(/^\s+id: '/gm) ?? []).length;
}

function titleCampaignCount() {
  const text = fs.readFileSync(path.join(ROOT, 'src/pages/WorldCupWinners.tsx'), 'utf8');
  const yearBlocks = text.match(/years:\s*\[[^\]]*\]/g) ?? [];
  let total = 0;
  for (const block of yearBlocks) {
    total += (block.match(/\d{4}/g) ?? []).length;
  }
  return total;
}

function buildManifest() {
  const files = {};
  for (const rel of LOCKED_FILES) {
    files[rel] = { sha256: sha256File(rel) };
  }
  return {
    version: 1,
    category: 'world-cup-winners',
    lockedAt: new Date().toISOString(),
    stats: {
      nations: 8,
      titleCampaigns: titleCampaignCount(),
      winnersQuestions: winnersQuestionCount(),
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
  console.log('Rehashed World Cup Winners category manifest.');
  console.log(`  title campaigns: ${next.stats.titleCampaigns}, winners questions: ${next.stats.winnersQuestions}`);
  process.exit(0);
}

const next = buildManifest();

if (fs.existsSync(MANIFEST)) {
  const prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const changed = LOCKED_FILES.filter((rel) => prev.files?.[rel]?.sha256 !== next.files[rel].sha256);
  if (!changed.length && !confirm) {
    console.log('World Cup Winners category manifest already matches current files.');
    process.exit(0);
  }
  if (changed.length) {
    console.log('Files that would change:');
    for (const rel of changed) console.log(`  • ${rel}`);
  }
} else {
  console.log('Would create new World Cup Winners category manifest for:');
  for (const rel of LOCKED_FILES) console.log(`  • ${rel}`);
}

console.log(
  `\nStats: ${next.stats.nations} nations, ${next.stats.titleCampaigns} title campaigns, ${next.stats.winnersQuestions} winners questions, ${next.stats.lockedFiles} locked files`,
);

if (!confirm) {
  console.log('\nDry run. Re-run with --confirm to lock.');
  process.exit(0);
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(next, null, 2)}\n`);
console.log(`\nLocked → ${path.relative(ROOT, MANIFEST)}`);

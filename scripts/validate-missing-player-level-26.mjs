/**
 * Verify Missing Player level 26 frozen snapshot has not been altered.
 * Fails dev/build if pitch layouts were changed without an intentional re-lock.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FROZEN = path.join(ROOT, 'src/data/missingPlayerLineupLevels26.frozen.ts');

function payloadSha(text) {
  const m = /export const LEVEL_26[\s\S]*?= \[([\s\S]*?)\];/.exec(text);
  if (!m) throw new Error('Missing LEVEL_26 in frozen file');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

const text = fs.readFileSync(FROZEN, 'utf8');
const embedded = /MISSING_PLAYER_LEVEL_26_PAYLOAD_SHA256 = '([a-f0-9]{64})'/.exec(text);
if (!embedded) {
  console.error('validate-missing-player-level-26: missing embedded SHA-256 in frozen file');
  process.exit(1);
}

const computed = payloadSha(text);
if (computed !== embedded[1]) {
  console.error('validate-missing-player-level-26: FROZEN FILE TAMPERED');
  console.error(`  embedded: ${embedded[1]}`);
  console.error(`  computed: ${computed}`);
  console.error('  Level 26 is locked. Re-lock only with: node scripts/freeze-missing-player-level-26.mjs --confirm');
  process.exit(1);
}

console.log('Missing Player level 26 frozen snapshot OK');

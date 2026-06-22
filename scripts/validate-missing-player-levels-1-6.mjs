/**
 * Verify Missing Player levels 1–6 frozen snapshot has not been altered.
 * Fails dev/build if pitch layouts were changed without an intentional re-lock.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FROZEN = path.join(ROOT, 'src/data/missingPlayerLineupLevels1to6.frozen.ts');

function payloadSha(text) {
  const payloads = [];
  for (let level = 1; level <= 6; level++) {
    const re = new RegExp(`export const MISSING_PLAYER_LEVEL_${level}[\\s\\S]*?= \\[([\\s\\S]*?)\\];`);
    const m = re.exec(text);
    if (!m) throw new Error(`Missing MISSING_PLAYER_LEVEL_${level} in frozen file`);
    payloads.push(m[1].replace(/\s+/g, ' ').trim());
  }
  return crypto.createHash('sha256').update(payloads.join('\n')).digest('hex');
}

const text = fs.readFileSync(FROZEN, 'utf8');
const embedded = /MISSING_PLAYER_LEVELS_1_TO_6_PAYLOAD_SHA256 = '([a-f0-9]{64})'/.exec(text);
if (!embedded) {
  console.error('validate-missing-player-levels-1-6: missing embedded SHA-256 in frozen file');
  process.exit(1);
}

const computed = payloadSha(text);
if (computed !== embedded[1]) {
  console.error('validate-missing-player-levels-1-6: FROZEN FILE TAMPERED');
  console.error(`  embedded: ${embedded[1]}`);
  console.error(`  computed: ${computed}`);
  console.error('  Levels 1–6 are locked. Re-lock only with: node scripts/freeze-missing-player-levels-1-6.mjs --confirm');
  process.exit(1);
}

console.log('Missing Player levels 1–6 frozen snapshot OK');

/**
 * Verify Bingo missing-player pitch snapshots for levels 199–204.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FROZEN = path.join(ROOT, 'src/data/bingoMissingPlayerLineupFrozenL199to204.ts');

function mpPayloadSha(text) {
  const m = /BINGO_MISSING_PLAYER_LINEUP_FROZEN_L199TO204[\s\S]*?= \[([\s\S]*?)\];/m.exec(text);
  if (!m) throw new Error('Missing BINGO_MISSING_PLAYER_LINEUP_FROZEN_L199TO204 in frozen file');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

const text = fs.readFileSync(FROZEN, 'utf8');
const embedded = /BINGO_MP_FROZEN_L199TO204_PAYLOAD_SHA256 = '([a-f0-9]{64})'/.exec(text);
if (!embedded) {
  console.error('validate-bingo-mp-frozen-l199to204: missing embedded SHA-256');
  process.exit(1);
}

const computed = mpPayloadSha(text);
if (computed !== embedded[1]) {
  console.error('validate-bingo-mp-frozen-l199to204: FROZEN FILE TAMPERED');
  console.error(`  embedded: ${embedded[1]}`);
  console.error(`  computed: ${computed}`);
  console.error(
    '  Re-lock with: npx vite-node scripts/freeze-world-cup-bingo-levels-199-204.mts --confirm',
  );
  process.exit(1);
}

console.log('Bingo missing-player pitch L199–204 frozen snapshot OK');

/**
 * Verify World Cup Bingo levels 199–204 frozen snapshot has not been altered.
 * Fails dev/build if question content was changed without an intentional re-lock.
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FROZEN = path.join(ROOT, 'src/data/worldCupBingoLevels199to204.frozen.ts');

function questionsPayloadSha(text) {
  const m = /WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204[\s\S]*?= \{([\s\S]*?)\};/m.exec(text);
  if (!m) throw new Error('Missing WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204 in frozen file');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

const text = fs.readFileSync(FROZEN, 'utf8');
const embedded = /WORLD_CUP_BINGO_LEVELS_199_TO_204_PAYLOAD_SHA256 = '([a-f0-9]{64})'/.exec(text);
if (!embedded) {
  console.error('validate-world-cup-bingo-levels-199-204: missing embedded SHA-256');
  process.exit(1);
}

const computed = questionsPayloadSha(text);
if (computed !== embedded[1]) {
  console.error('validate-world-cup-bingo-levels-199-204: FROZEN FILE TAMPERED');
  console.error(`  embedded: ${embedded[1]}`);
  console.error(`  computed: ${computed}`);
  console.error(
    '  Levels 199–204 are locked. Re-lock only with: npx vite-node scripts/freeze-world-cup-bingo-levels-199-204.mts --confirm',
  );
  process.exit(1);
}

console.log('World Cup Bingo levels 199–204 frozen snapshot OK');

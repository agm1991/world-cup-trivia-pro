/**
 * Verify World Cup Bingo missing-player frozen snapshots (levels 1–204).
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FROZEN_PITCH = path.join(ROOT, 'src/data/bingoMissingPlayerLineupFrozenL1to204.ts');
const FROZEN_QUESTIONS = path.join(ROOT, 'src/data/bingoMissingPlayerQuestionsFrozenL1to204.ts');

function pitchPayloadSha(text) {
  const m = /BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204[\s\S]*?= \[([\s\S]*?)\];/m.exec(text);
  if (!m) throw new Error('Missing BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

function questionsPayloadSha(text) {
  const m = /BINGO_MP_QUESTIONS_FROZEN_L1TO204[\s\S]*?= \{([\s\S]*?)\};/m.exec(text);
  if (!m) throw new Error('Missing BINGO_MP_QUESTIONS_FROZEN_L1TO204');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

let failed = false;

for (const [label, fp, regex, shaFn] of [
  [
    'pitch',
    FROZEN_PITCH,
    /BINGO_MP_FROZEN_L1TO204_PITCH_SHA256 = '([a-f0-9]{64})'/,
    pitchPayloadSha,
  ],
  [
    'questions',
    FROZEN_QUESTIONS,
    /BINGO_MP_FROZEN_L1TO204_QUESTIONS_SHA256 = '([a-f0-9]{64})'/,
    questionsPayloadSha,
  ],
]) {
  const text = fs.readFileSync(fp, 'utf8');
  const embedded = regex.exec(text);
  if (!embedded) {
    console.error(`validate-bingo-mp-frozen-l1to204: missing ${label} SHA-256`);
    failed = true;
    continue;
  }
  const computed = shaFn(text);
  if (computed !== embedded[1]) {
    console.error(`validate-bingo-mp-frozen-l1to204: ${label.toUpperCase()} FROZEN FILE TAMPERED`);
    console.error(`  embedded: ${embedded[1]}`);
    console.error(`  computed: ${computed}`);
    failed = true;
  }
}

if (failed) {
  console.error(
    '  Re-lock with: npx vite-node scripts/freeze-bingo-mp-l1to204.mts --confirm',
  );
  process.exit(1);
}

console.log('Bingo missing-player L1–204 frozen snapshot OK (pitch + questions)');

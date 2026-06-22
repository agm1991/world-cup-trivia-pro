#!/usr/bin/env npx vite-node
/**
 * Snapshot ALL World Cup Bingo missing-player rows (levels 1–204):
 * pitch layouts + question text/options/hints.
 *
 * Dry run:
 *   npx vite-node scripts/freeze-bingo-mp-l1to204.mts
 *
 * Write frozen files:
 *   npx vite-node scripts/freeze-bingo-mp-l1to204.mts --confirm
 *
 * Rehash:
 *   npx vite-node scripts/freeze-bingo-mp-l1to204.mts --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Question } from '../src/types/game';
import type { MissingPlayerLineupMatchDef } from '../src/data/missingPlayerLineupMatchTypes';
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';
import { extractNativeMpId, findBingoMpLineupDef } from '../src/data/bingoMpLineupCatalog';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FROZEN_PITCH = path.join(ROOT, 'src/data/bingoMissingPlayerLineupFrozenL1to204.ts');
const FROZEN_QUESTIONS = path.join(ROOT, 'src/data/bingoMissingPlayerQuestionsFrozenL1to204.ts');
const MANIFEST = path.join(ROOT, 'src/data/bingoMissingPlayerFrozenL1to204.sha256');

const MAX_LEVEL = 204;

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function serializeQuestion(q: Question, indent: string): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: '${esc(q.id)}',`);
  lines.push(`${indent}  category: 'world-cup-bingo',`);
  lines.push(`${indent}  difficulty: '${q.difficulty}',`);
  lines.push(`${indent}  question: '${esc(q.question)}',`);
  if (q.image) lines.push(`${indent}  image: '${esc(q.image)}',`);
  if (q.questionType) lines.push(`${indent}  questionType: '${q.questionType}',`);
  lines.push(`${indent}  optionA: '${esc(q.optionA)}',`);
  lines.push(`${indent}  optionB: '${esc(q.optionB)}',`);
  lines.push(`${indent}  optionC: '${esc(q.optionC)}',`);
  lines.push(`${indent}  optionD: '${esc(q.optionD)}',`);
  lines.push(`${indent}  correctAnswer: '${q.correctAnswer}',`);
  lines.push(`${indent}  hint1: '${esc(q.hint1)}',`);
  lines.push(`${indent}  hint2: '${esc(q.hint2)}',`);
  lines.push(`${indent}  hint3: '${esc(q.hint3)}',`);
  if (q.sourceCategory) lines.push(`${indent}  sourceCategory: '${esc(q.sourceCategory)}',`);
  if (q.scorelineResultNote) lines.push(`${indent}  scorelineResultNote: '${q.scorelineResultNote}',`);
  if (q.eventYear != null) lines.push(`${indent}  eventYear: ${q.eventYear},`);
  lines.push(`${indent}}`);
  return lines.join('\n');
}

function serializeLineupDef(def: MissingPlayerLineupMatchDef, indent: string): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: '${esc(def.id)}',`);
  lines.push(`${indent}  year: ${def.year},`);
  lines.push(`${indent}  stage: '${esc(def.stage)}',`);
  lines.push(`${indent}  team1: '${esc(def.team1)}',`);
  lines.push(`${indent}  team2: '${esc(def.team2)}',`);
  lines.push(`${indent}  focusTeam: '${esc(def.focusTeam)}',`);
  lines.push(
    `${indent}  targetPlayers: [${def.targetPlayers.map((t) => `'${esc(t)}'`).join(', ')}],`,
  );
  lines.push(`${indent}  slots: [`);
  for (const s of def.slots) {
    lines.push(
      `${indent}    { key: '${esc(s.key)}', displayName: '${esc(s.displayName)}', x: ${s.x}, y: ${s.y} },`,
    );
  }
  lines.push(`${indent}  ],`);
  lines.push(`${indent}  optionA: '${esc(def.optionA)}',`);
  lines.push(`${indent}  optionB: '${esc(def.optionB)}',`);
  lines.push(`${indent}  optionC: '${esc(def.optionC)}',`);
  lines.push(`${indent}  optionD: '${esc(def.optionD)}',`);
  lines.push(`${indent}  correctAnswer: '${def.correctAnswer}',`);
  lines.push(`${indent}  hint1: '${esc(def.hint1)}',`);
  lines.push(`${indent}  hint2: '${esc(def.hint2)}',`);
  lines.push(`${indent}  hint3: '${esc(def.hint3)}',`);
  lines.push(`${indent}},`);
  return lines.join('\n');
}

type MpSnapshot = {
  mpId: string;
  level: number;
  question: Question;
  frozenDefId: string;
  def: MissingPlayerLineupMatchDef;
};

function collectMpSnapshots(): MpSnapshot[] {
  const byMpId = new Map<string, MpSnapshot>();

  for (let level = 1; level <= MAX_LEVEL; level++) {
    const qs = getWorldCupBingoQuestionsByLevel(level);
    for (const q of qs) {
      if (q.sourceCategory !== 'missing-player') continue;
      const mpId = extractNativeMpId(q.id);
      if (!mpId || byMpId.has(mpId)) continue;

      const parsed = parseMissingPlayerPromptForBingo(q.question);
      if (!parsed) throw new Error(`Could not parse missing-player prompt for ${mpId} (${q.id})`);

      const pitch = resolveBingoLineupPitch(parsed, q);
      if (pitch.length !== 11) {
        throw new Error(`No full pitch for ${mpId} (level ${level}, ${q.id}) — cannot freeze`);
      }

      const frozenDefId = `bingo-frozen-l1-204-${mpId}`;
      const sourceDef = findBingoMpLineupDef(parsed, q);

      let missingIdx = 0;
      const slots = pitch.map((p, i) => ({
        key: p.isMissing ? `missing_${++missingIdx}` : `slot_${i}`,
        displayName: p.isMissing ? '???' : p.name,
        x: p.x,
        y: p.y,
      }));

      const def: MissingPlayerLineupMatchDef = sourceDef
        ? {
            ...sourceDef,
            id: frozenDefId,
            slots: sourceDef.slots,
            targetPlayers: sourceDef.targetPlayers,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            hint1: q.hint1,
            hint2: q.hint2,
            hint3: q.hint3,
          }
        : {
            id: frozenDefId,
            year: parseInt(parsed.year, 10),
            stage: parsed.stage || 'Match',
            team1: parsed.matchup.split(/\s+vs\s+/i)[0]?.trim() ?? '',
            team2: parsed.matchup.split(/\s+vs\s+/i)[1]?.trim() ?? '',
            focusTeam: parsed.team,
            targetPlayers: slots.filter((s) => s.displayName === '???').map((s) => s.key),
            slots,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            hint1: q.hint1,
            hint2: q.hint2,
            hint3: q.hint3,
          };

      byMpId.set(mpId, { mpId, level, question: { ...q }, frozenDefId, def });
    }
  }

  return [...byMpId.values()].sort((a, b) => a.mpId.localeCompare(b.mpId));
}

function buildPitchFrozen(snapshots: MpSnapshot[]): string {
  const defBlocks = snapshots.map(({ mpId, level, frozenDefId, def }) => {
    const d = { ...def, id: frozenDefId };
    return `  /** ${mpId} (bingo level ${level}) */\n${serializeLineupDef(d, '  ')}`;
  });
  const overrideEntries = snapshots
    .map(({ mpId, frozenDefId }) => `  '${mpId}': '${frozenDefId}',`)
    .join('\n');

  return `/**
 * FROZEN — World Cup Bingo missing-player pitch layouts (levels 1–204).
 *
 * DO NOT EDIT BY HAND. ${snapshots.length} unique mp-id rows snapshotted at freeze time.
 *
 * Regenerate:
 *   npx vite-node scripts/freeze-bingo-mp-l1to204.mts --confirm
 */
import type { MissingPlayerLineupMatchDef } from './missingPlayerLineupMatchTypes';

export const BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204: MissingPlayerLineupMatchDef[] = [
${defBlocks.join('\n')}
];

/** mp-id → frozen def id (highest priority in bingoMpLineupCatalog). */
export const BINGO_MP_FROZEN_L1TO204_OVERRIDES: Record<string, string> = {
${overrideEntries}
};

/** SHA-256 of frozen MP pitch payload. Validated at dev/build. */
export const BINGO_MP_FROZEN_L1TO204_PITCH_SHA256 = '__PITCH_SHA__';
`;
}

function buildQuestionsFrozen(snapshots: MpSnapshot[]): string {
  const entries = snapshots.map(({ mpId, level, question }) => {
    return `  /** ${mpId} — bingo level ${level} */\n  '${mpId}': ${serializeQuestion(question, '  ')},`;
  });

  return `/**
 * FROZEN — World Cup Bingo missing-player question text (levels 1–204).
 *
 * DO NOT EDIT BY HAND. ${snapshots.length} unique mp-id questions snapshotted at freeze time.
 * Runtime keeps each level's bingo slot id; content comes from this map.
 *
 * Regenerate:
 *   npx vite-node scripts/freeze-bingo-mp-l1to204.mts --confirm
 */
import type { Question } from '@/types/game';

export const BINGO_MP_QUESTIONS_FROZEN_L1TO204: Record<string, Question> = {
${entries.join('\n')}
};

/** SHA-256 of frozen MP question payload. Validated at dev/build. */
export const BINGO_MP_FROZEN_L1TO204_QUESTIONS_SHA256 = '__QUESTIONS_SHA__';
`;
}

function pitchPayloadSha(text: string): string {
  const m = /BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204[\s\S]*?= \[([\s\S]*?)\];/m.exec(text);
  if (!m) throw new Error('Missing BINGO_MISSING_PLAYER_LINEUP_FROZEN_L1TO204');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

function questionsPayloadSha(text: string): string {
  const m = /BINGO_MP_QUESTIONS_FROZEN_L1TO204[\s\S]*?= \{([\s\S]*?)\};/m.exec(text);
  if (!m) throw new Error('Missing BINGO_MP_QUESTIONS_FROZEN_L1TO204');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

const confirm = process.argv.includes('--confirm');
const rehash = process.argv.includes('--rehash');

if (rehash) {
  for (const fp of [FROZEN_PITCH, FROZEN_QUESTIONS]) {
    if (!fs.existsSync(fp)) {
      console.error(`No frozen file: ${fp}`);
      process.exit(1);
    }
  }
  let pitchDraft = fs.readFileSync(FROZEN_PITCH, 'utf8');
  const pitchStripped = pitchDraft.replace(
    /export const BINGO_MP_FROZEN_L1TO204_PITCH_SHA256 = '[^']+';/,
    '',
  );
  const pitchHash = pitchPayloadSha(pitchStripped);
  pitchDraft = pitchDraft.replace(
    /export const BINGO_MP_FROZEN_L1TO204_PITCH_SHA256 = '[^']+';/,
    `export const BINGO_MP_FROZEN_L1TO204_PITCH_SHA256 = '${pitchHash}';`,
  );
  fs.writeFileSync(FROZEN_PITCH, pitchDraft);

  let qDraft = fs.readFileSync(FROZEN_QUESTIONS, 'utf8');
  const qStripped = qDraft.replace(
    /export const BINGO_MP_FROZEN_L1TO204_QUESTIONS_SHA256 = '[^']+';/,
    '',
  );
  const qHash = questionsPayloadSha(qStripped);
  qDraft = qDraft.replace(
    /export const BINGO_MP_FROZEN_L1TO204_QUESTIONS_SHA256 = '[^']+';/,
    `export const BINGO_MP_FROZEN_L1TO204_QUESTIONS_SHA256 = '${qHash}';`,
  );
  fs.writeFileSync(FROZEN_QUESTIONS, qDraft);
  fs.writeFileSync(
    MANIFEST,
    `${pitchHash}  src/data/bingoMissingPlayerLineupFrozenL1to204.ts\n${qHash}  src/data/bingoMissingPlayerQuestionsFrozenL1to204.ts\n`,
  );
  console.log(`Rehashed pitch SHA-256: ${pitchHash}`);
  console.log(`Rehashed questions SHA-256: ${qHash}`);
  process.exit(0);
}

const snapshots = collectMpSnapshots();
console.log(`Collected ${snapshots.length} unique missing-player rows (levels 1–${MAX_LEVEL})`);

let pitchDraft = buildPitchFrozen(snapshots);
const pitchHash = pitchPayloadSha(pitchDraft);
pitchDraft = pitchDraft.replace('__PITCH_SHA__', pitchHash);

let qDraft = buildQuestionsFrozen(snapshots);
const qHash = questionsPayloadSha(qDraft);
qDraft = qDraft.replace('__QUESTIONS_SHA__', qHash);

const existingPitch = fs.existsSync(FROZEN_PITCH) ? fs.readFileSync(FROZEN_PITCH, 'utf8') : null;
const existingQ = fs.existsSync(FROZEN_QUESTIONS) ? fs.readFileSync(FROZEN_QUESTIONS, 'utf8') : null;

if (existingPitch === pitchDraft && existingQ === qDraft) {
  console.log('Frozen bingo missing-player L1–204 already up to date.');
  process.exit(0);
}

if (!confirm) {
  console.log('\nDry run — snapshot would change.');
  console.log(`  Pitch:     ${path.relative(ROOT, FROZEN_PITCH)}`);
  console.log(`  Questions: ${path.relative(ROOT, FROZEN_QUESTIONS)}`);
  console.log(`  Pitch SHA-256:     ${pitchHash}`);
  console.log(`  Questions SHA-256: ${qHash}`);
  console.log('\nRe-run with --confirm to write frozen files.');
  process.exit(1);
}

fs.writeFileSync(FROZEN_PITCH, pitchDraft);
fs.writeFileSync(FROZEN_QUESTIONS, qDraft);
fs.writeFileSync(
  MANIFEST,
  `${pitchHash}  src/data/bingoMissingPlayerLineupFrozenL1to204.ts\n${qHash}  src/data/bingoMissingPlayerQuestionsFrozenL1to204.ts\n`,
);
console.log(`Wrote ${path.relative(ROOT, FROZEN_PITCH)}`);
console.log(`Wrote ${path.relative(ROOT, FROZEN_QUESTIONS)}`);
console.log(`Pitch SHA-256:     ${pitchHash}`);
console.log(`Questions SHA-256: ${qHash}`);

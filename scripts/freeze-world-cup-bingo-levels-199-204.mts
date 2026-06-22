#!/usr/bin/env npx vite-node
/**
 * Snapshot World Cup Bingo levels 199–204 (all 60 questions) into frozen module.
 * Missing-player pitch rows: use freeze-bingo-mp-l1to204.mts (covers L1–204).
 *
 * Dry run (default):
 *   npx vite-node scripts/freeze-world-cup-bingo-levels-199-204.mts
 *
 * Write frozen files:
 *   npx vite-node scripts/freeze-world-cup-bingo-levels-199-204.mts --confirm
 *
 * Rehash after hand-editing frozen file:
 *   npx vite-node scripts/freeze-world-cup-bingo-levels-199-204.mts --rehash
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Question } from '../src/types/game';
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FROZEN_QUESTIONS = path.join(ROOT, 'src/data/worldCupBingoLevels199to204.frozen.ts');
const MANIFEST = path.join(ROOT, 'src/data/worldCupBingoLevels199to204.frozen.sha256');

const LEVELS = [199, 200, 201, 202, 203, 204] as const;

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
  lines.push(`${indent}},`);
  return lines.join('\n');
}

function collectLevels(): Question[][] {
  return LEVELS.map((level) => getWorldCupBingoQuestionsByLevel(level));
}

function buildQuestionsFrozen(levelQuestions: Question[][]): string {
  const levelBlocks = levelQuestions.map((qs, li) => {
    const level = LEVELS[li]!;
    const qLines = qs.map((q) => serializeQuestion(q, '    ')).join('\n');
    return `  /** Level ${level} — 10 questions (frozen) */\n  ${level}: [\n${qLines}\n  ],`;
  });

  return `/**
 * FROZEN — World Cup Bingo levels 199–204 (60 questions).
 *
 * DO NOT EDIT BY HAND. These levels are locked after fact-check fixes.
 * Other bingo levels still come from the shuffled source pool.
 *
 * Regenerate only after intentional re-lock:
 *   npx vite-node scripts/freeze-world-cup-bingo-levels-199-204.mts --confirm
 */
import type { Question } from '@/types/game';

export const WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204: Record<number, Question[]> = {
${levelBlocks.join('\n')}
};

/** SHA-256 of frozen question payload. Validated at dev/build. */
export const WORLD_CUP_BINGO_LEVELS_199_TO_204_PAYLOAD_SHA256 = '__PAYLOAD_SHA__';
`;
}

function questionsPayloadSha(text: string): string {
  const m = /WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204[\s\S]*?= \{([\s\S]*?)\};/.exec(text);
  if (!m) throw new Error('Missing WORLD_CUP_BINGO_FROZEN_LEVELS_199_TO_204 in generated source');
  return crypto.createHash('sha256').update(m[1].replace(/\s+/g, ' ').trim()).digest('hex');
}

const confirm = process.argv.includes('--confirm');
const rehash = process.argv.includes('--rehash');

if (rehash) {
  if (!fs.existsSync(FROZEN_QUESTIONS)) {
    console.error('No frozen questions file to rehash. Run with --confirm first.');
    process.exit(1);
  }
  let qDraft = fs.readFileSync(FROZEN_QUESTIONS, 'utf8');
  const qStripped = qDraft.replace(
    /export const WORLD_CUP_BINGO_LEVELS_199_TO_204_PAYLOAD_SHA256 = '[^']+';/,
    '',
  );
  const qHash = questionsPayloadSha(qStripped);
  qDraft = qDraft.replace(
    /export const WORLD_CUP_BINGO_LEVELS_199_TO_204_PAYLOAD_SHA256 = '[^']+';/,
    `export const WORLD_CUP_BINGO_LEVELS_199_TO_204_PAYLOAD_SHA256 = '${qHash}';`,
  );
  fs.writeFileSync(FROZEN_QUESTIONS, qDraft);
  fs.writeFileSync(MANIFEST, `${qHash}  src/data/worldCupBingoLevels199to204.frozen.ts\n`);
  console.log(`Rehashed. Questions SHA-256: ${qHash}`);
  process.exit(0);
}

const levelQuestions = collectLevels();

console.log('Levels 199–204 snapshot:');
for (let i = 0; i < LEVELS.length; i++) {
  const level = LEVELS[i]!;
  const mpCount = levelQuestions[i]!.filter((q) => q.sourceCategory === 'missing-player').length;
  console.log(`  Level ${level}: ${levelQuestions[i]!.length} questions (${mpCount} missing-player)`);
}

let qDraft = buildQuestionsFrozen(levelQuestions);
const qHash = questionsPayloadSha(qDraft);
qDraft = qDraft.replace('__PAYLOAD_SHA__', qHash);

const existingQ = fs.existsSync(FROZEN_QUESTIONS) ? fs.readFileSync(FROZEN_QUESTIONS, 'utf8') : null;

if (existingQ === qDraft) {
  console.log('Frozen bingo levels 199–204 already up to date.');
  process.exit(0);
}

if (!confirm) {
  console.log('\nDry run — snapshot would change.');
  console.log(`  Questions: ${path.relative(ROOT, FROZEN_QUESTIONS)}`);
  console.log(`  Questions SHA-256: ${qHash}`);
  console.log('\nRe-run with --confirm to write frozen files.');
  console.log('(MP pitch rows: npx vite-node scripts/freeze-bingo-mp-l1to204.mts --confirm)');
  process.exit(1);
}

fs.writeFileSync(FROZEN_QUESTIONS, qDraft);
fs.writeFileSync(MANIFEST, `${qHash}  src/data/worldCupBingoLevels199to204.frozen.ts\n`);
console.log(`Wrote ${path.relative(ROOT, FROZEN_QUESTIONS)}`);
console.log(`Questions SHA-256: ${qHash}`);

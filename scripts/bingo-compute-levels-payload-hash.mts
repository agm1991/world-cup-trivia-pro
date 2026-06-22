#!/usr/bin/env npx vite-node
/** Prints SHA-256 of all 204 World Cup Bingo levels (10 Qs each) — used by category freeze/validate. */
import crypto from 'crypto';
import type { Question } from '../src/types/game';
import { BINGO_MAX_LEVELS, getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';

function serializeQuestion(q: Question): string {
  return [
    q.id,
    q.sourceCategory ?? q.category,
    q.question,
    q.optionA,
    q.optionB,
    q.optionC,
    q.optionD,
    q.correctAnswer,
    q.hint1,
    q.hint2,
    q.hint3,
    q.scorelineResultNote ?? '',
    q.eventYear ?? '',
  ].join('\x1f');
}

let payload = '';
for (let level = 1; level <= BINGO_MAX_LEVELS; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  if (qs.length !== 10) {
    console.error(`Level ${level} has ${qs.length} questions (expected 10)`);
    process.exit(1);
  }
  for (const q of qs) {
    payload += `${level}:${serializeQuestion(q)}\n`;
  }
}

process.stdout.write(crypto.createHash('sha256').update(payload).digest('hex'));

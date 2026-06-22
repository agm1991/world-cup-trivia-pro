/**
 * Event-driven World Cup question pools (1930–2022).
 * Source: scripts/worldCupPoolData/*.mjs (also writes JSON to src/data/worldCupPools/)
 * Outputs: src/data/worldCupQuestions*.generated.ts
 *
 * Tier year rules (anchorYear on each item):
 * - easy: 1998–2022 only
 * - medium: 30% 1998–2022, 70% 1970–1994
 * - hard: 30% 1970–1990, 70% 1950–1970
 * - ultimate: 1930–1966 only
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { easy, medium, hard, ultimate } from './worldCupPoolData/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const poolDir = path.join(root, 'src/data/worldCupPools');

const files = {
  easy: path.join(poolDir, 'easy.json'),
  medium: path.join(poolDir, 'medium.json'),
  hard: path.join(poolDir, 'hard.json'),
  ultimate: path.join(poolDir, 'ultimate.json'),
};

function normQ(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function row(id, diff, q, a, b, c, d, ans, h1, h2, h3, h4, eventType, eventYear) {
  const et = eventType ? `, ${JSON.stringify(eventType)}` : '';
  const ey = eventYear != null ? `, ${eventYear}` : '';
  return `  mk(${JSON.stringify(id)}, ${JSON.stringify(diff)}, ${JSON.stringify(q)}, ${JSON.stringify(a)}, ${JSON.stringify(b)}, ${JSON.stringify(c)}, ${JSON.stringify(d)}, '${ans}', ${JSON.stringify(h1)}, ${JSON.stringify(h2)}, ${JSON.stringify(h3)}, ${JSON.stringify(h4)}${et}${ey}),`;
}

const header = (name) => `import type { Question } from '@/types/game';

function mk(
  id: string,
  difficulty: Question['difficulty'],
  question: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctAnswer: 'A' | 'B' | 'C' | 'D',
  hint1: string,
  hint2: string,
  hint3: string,
  hint4: string,
  eventType?: Question['eventType'],
  eventYear?: number,
): Question {
  return {
    id,
    category: 'world-cup',
    difficulty,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    hint1,
    hint2,
    hint3,
    hint4,
    ...(eventType != null ? { eventType } : {}),
    ...(eventYear != null ? { eventYear } : {}),
  };
}

export const ${name}: Question[] = [
`;

const footer = `
];
`;

function assertPool(name, arr, expectedLen) {
  if (!Array.isArray(arr) || arr.length !== expectedLen) {
    console.error(`[${name}] Expected ${expectedLen} questions, got`, arr?.length);
    process.exit(1);
  }
}

function validateItem(x, tier) {
  const req = ['id', 'difficulty', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'hint1', 'hint2', 'hint3', 'hint4', 'dedupeKey', 'anchorYear', 'eventType'];
  for (const k of req) {
    if (x[k] === undefined || x[k] === null) {
      console.error('Missing field', k, 'on', x.id);
      process.exit(1);
    }
  }
  const opts = new Set([x.optionA, x.optionB, x.optionC, x.optionD]);
  if (opts.size !== 4) {
    console.error('Four distinct options required:', x.id);
    process.exit(1);
  }
  if (!['drama', 'glory', 'action'].includes(x.eventType)) {
    console.error('eventType must be drama|glory|action:', x.id);
    process.exit(1);
  }
  const y = Number(x.anchorYear);
  if (tier === 'easy' && (y < 1998 || y > 2022)) {
    console.error('easy tier anchorYear must be 1998–2022:', x.id, y);
    process.exit(1);
  }
  if (tier === 'ultimate' && (y < 1930 || y > 1966)) {
    console.error('ultimate tier anchorYear must be 1930–1966:', x.id, y);
    process.exit(1);
  }
}

function validateTierCounts(medium, hard) {
  let mRecent = 0;
  let mOld = 0;
  for (const x of medium) {
    const y = x.anchorYear;
    if (y >= 1998 && y <= 2022) mRecent++;
    else if (y >= 1970 && y <= 1994) mOld++;
    else {
      console.error('medium question year out of allowed bands:', x.id, y);
      process.exit(1);
    }
  }
  if (mRecent !== 30 || mOld !== 70) {
    console.error('medium tier must be 30× (1998–2022) and 70× (1970–1994). Got', mRecent, mOld);
    process.exit(1);
  }

  let hMid = 0;
  let hOld = 0;
  for (const x of hard) {
    const y = x.anchorYear;
    if (y >= 1970 && y <= 1990) hMid++;
    else if (y >= 1950 && y <= 1970) hOld++;
    else {
      console.error('hard question year out of allowed bands:', x.id, y);
      process.exit(1);
    }
  }
  if (hMid !== 30 || hOld !== 70) {
    console.error('hard tier must be 30× (1970–1990) and 70× (1950–1970). Got', hMid, hOld);
    process.exit(1);
  }
}

function assertGlobalDedupe(all) {
  const keys = new Set();
  const stems = new Set();
  for (const x of all) {
    if (keys.has(x.dedupeKey)) {
      console.error('Duplicate dedupeKey:', x.dedupeKey);
      process.exit(1);
    }
    keys.add(x.dedupeKey);
    const n = normQ(x.question);
    if (n.length >= 12) {
      if (stems.has(n)) {
        console.error('Duplicate question stem:', x.question);
        process.exit(1);
      }
      stems.add(n);
    }
  }
}

function emitTs(outPath, exportName, pool) {
  const lines = pool.map((x) =>
    row(
      x.id,
      x.difficulty,
      x.question,
      x.optionA,
      x.optionB,
      x.optionC,
      x.optionD,
      x.correctAnswer,
      x.hint1,
      x.hint2,
      x.hint3,
      x.hint4,
      x.eventType,
      x.anchorYear,
    ),
  );
  fs.writeFileSync(outPath, header(exportName) + lines.join('\n') + '\n' + footer);
}

function main() {
  fs.mkdirSync(poolDir, { recursive: true });
  fs.writeFileSync(files.easy, JSON.stringify(easy, null, 2));
  fs.writeFileSync(files.medium, JSON.stringify(medium, null, 2));
  fs.writeFileSync(files.hard, JSON.stringify(hard, null, 2));
  fs.writeFileSync(files.ultimate, JSON.stringify(ultimate, null, 2));

  assertPool('easy', easy, 100);
  assertPool('medium', medium, 100);
  assertPool('hard', hard, 100);
  assertPool('ultimate', ultimate, 200);

  for (const x of easy) validateItem(x, 'easy');
  for (const x of medium) validateItem(x, 'medium');
  for (const x of hard) validateItem(x, 'hard');
  for (const x of ultimate) validateItem(x, 'ultimate');

  validateTierCounts(medium, hard);
  assertGlobalDedupe([...easy, ...medium, ...hard, ...ultimate]);

  const outDir = path.join(root, 'src/data');
  emitTs(path.join(outDir, 'worldCupQuestionsEasy.generated.ts'), 'worldCupEasyPool', easy);
  emitTs(path.join(outDir, 'worldCupQuestionsMedium.generated.ts'), 'worldCupMediumPool', medium);
  emitTs(path.join(outDir, 'worldCupQuestionsHard.generated.ts'), 'worldCupHardPool', hard);
  emitTs(path.join(outDir, 'worldCupQuestionsUltimate.generated.ts'), 'worldCupUltimatePool', ultimate);

  console.log(
    'Wrote generated TS from JSON pools: easy=100 medium=100 hard=100 ultimate=200 (500 total).',
  );
}

main();

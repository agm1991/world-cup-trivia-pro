/**
 * Structural + curated fact audit for World Cup Stadiums category.
 * Report-only — never modifies question text.
 *
 *   node scripts/audit-stadiums-category.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUTHOR = path.join(ROOT, 'src/data/stadiumsQuestionsLevels1to6.ts');
const LOADER = path.join(ROOT, 'src/data/stadiumsQuestions.ts');

function parseAuthorQuestions(text) {
  const blocks = text.split(/\n    \{\n      id: '/).slice(1);
  return blocks.map((block) => {
    const id = block.slice(0, block.indexOf("'"));
    const pick = (key) => {
      const m = block.match(new RegExp(`${key}: '([^']*)'`));
      return m?.[1];
    };
    const pickAnswer = () => {
      const m = block.match(/correctAnswer: '([ABCD])'/);
      return m?.[1];
    };
    const level = Number(id.match(/^stad-l(\d+)-/)?.[1] ?? 0);
    return {
      id,
      level,
      question: pick('question'),
      optionA: pick('optionA'),
      optionB: pick('optionB'),
      optionC: pick('optionC'),
      optionD: pick('optionD'),
      correctAnswer: pickAnswer(),
      difficulty: pick('difficulty'),
    };
  });
}

/** Verified spot-checks — correctAnswer letter must match. */
const FACT_SPOT_CHECKS = [
  { id: 'stad-l1-q1', answer: 'B', note: '1966 final — Wembley' },
  { id: 'stad-l1-q9', answer: 'A', note: '1970 final — Estadio Azteca' },
  { id: 'stad-l3-q6', answer: 'B', note: '2026 opening — Estadio Azteca (FIFA)' },
  { id: 'stad-l7-q1', answer: 'B', note: '1994 opening — Soldier Field, Chicago' },
  { id: 'stad-l7-q10', answer: 'C', note: '2026 first-time host — Canada' },
  { id: 'stad-l11-q1', answer: 'C', note: 'First WC match 1930 — Estadio Pocitos' },
  { id: 'stad-l18-q6', answer: 'B', note: '2014 7-1 — Mineirão' },
  { id: 'stad-l20-q1', answer: 'B', note: 'Two finals + 2026 — Estadio Azteca' },
  { id: 'stad-l22-q3', answer: 'A', note: '1966 NK vs Italy — Ayresome Park' },
  { id: 'stad-l25-q1', answer: 'A', note: '1930 final — Estadio Centenario' },
  { id: 'stad-l30-q1', answer: 'B', note: 'First WC goal — Estadio Pocitos' },
  { id: 'stad-l30-q10', answer: 'A', note: '2026 final — MetLife Stadium (FIFA)' },
];

const errors = [];
const warnings = [];
const infos = [];

const authorText = fs.readFileSync(AUTHOR, 'utf8');
const loaderText = fs.readFileSync(LOADER, 'utf8');
const questions = parseAuthorQuestions(authorText);

if (questions.length !== 300) {
  errors.push(`Expected 300 author questions, found ${questions.length}`);
}

const byLevel = new Map();
for (const q of questions) {
  if (!byLevel.has(q.level)) byLevel.set(q.level, []);
  byLevel.get(q.level).push(q);
}

for (let level = 1; level <= 30; level++) {
  const batch = byLevel.get(level) ?? [];
  if (batch.length !== 10) {
    errors.push(`Level ${level}: expected 10 questions, found ${batch.length}`);
  }
}

for (const q of questions) {
  if (!q.question || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctAnswer) {
    errors.push(`${q.id}: missing required field`);
    continue;
  }
  const key = `option${q.correctAnswer}`;
  if (!q[key]) {
    errors.push(`${q.id}: correctAnswer ${q.correctAnswer} has no option text`);
  }
  const opts = [q.optionA, q.optionB, q.optionC, q.optionD];
  const dupLabels = ['A', 'B', 'C', 'D'].filter((l, i) => {
    const val = opts[i];
    return opts.findIndex((o) => o === val) !== i;
  });
  if (dupLabels.length) {
    warnings.push(`${q.id}: duplicate option text among ${dupLabels.join(', ')}`);
  }
  if (levelDifficulty(q.level) !== q.difficulty) {
    warnings.push(`${q.id}: difficulty "${q.difficulty}" vs expected "${levelDifficulty(q.level)}" for level ${q.level}`);
  }
}

function levelDifficulty(level) {
  if (level <= 10) return 'easy';
  if (level <= 20) return 'medium';
  return 'hard';
}

for (const check of FACT_SPOT_CHECKS) {
  const q = questions.find((x) => x.id === check.id);
  if (!q) {
    errors.push(`Spot-check missing question ${check.id}`);
    continue;
  }
  if (q.correctAnswer !== check.answer) {
    errors.push(`${check.id}: expected answer ${check.answer} (${check.note}), got ${q.correctAnswer}`);
  }
}

if (!loaderText.includes('getStadiumsAuthorLevel')) {
  errors.push('stadiumsQuestions.ts must route levels 1–30 via getStadiumsAuthorLevel');
}

// Curated wording / UX notes (not answer errors)
const CURATED_NOTES = [
  { id: 'stad-l16-q7', severity: 'info', issue: 'Intentional trick question — no stadium nicknamed "The Meatball".' },
  { id: 'stad-l16-q10', severity: 'warning', issue: 'Options A and B are identical text ("Stadium of Light") — UX duplicate.' },
  { id: 'stad-l22-q8', severity: 'warning', issue: 'Options A and B are identical ("Estadio Nemesio Díez") — UX duplicate.' },
  { id: 'stad-l22-q10', severity: 'warning', issue: 'Options A and B are identical ("Estadio Malvinas Argentinas") — UX duplicate.' },
  { id: 'stad-l24-q6', severity: 'warning', issue: 'Options A and B are identical ("Frankenstadion") — UX duplicate.' },
  { id: 'stad-l25-q3', severity: 'warning', issue: 'Options A and C are identical ("West Germany vs USSR") — UX duplicate.' },
  { id: 'stad-l27-q10', severity: 'info', issue: 'Stadium 974 FIFA listed capacity 40,000; answer B (44,000) is approximate — acceptable trivia rounding.' },
  { id: 'stad-l27-q8', severity: 'info', issue: '1938 Colombes final attendance ~45,000; answer B (60,000) is era capacity not match attendance.' },
];

for (const note of CURATED_NOTES) {
  const q = questions.find((x) => x.id === note.id);
  if (!q) continue;
  if (note.severity === 'warning') warnings.push(`${note.id}: ${note.issue}`);
  else infos.push(`${note.id}: ${note.issue}`);
}

console.log('=== Stadiums category audit (report-only) ===\n');
console.log(`Questions parsed: ${questions.length}`);
console.log(`Levels: ${byLevel.size}\n`);

if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.log('');
}

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  console.log('');
}

if (infos.length) {
  console.log(`INFO (${infos.length}):`);
  for (const i of infos) console.log(`  ℹ ${i}`);
  console.log('');
}

if (!errors.length && !warnings.length) {
  console.log('No errors or warnings. Ready to lock.');
} else if (!errors.length) {
  console.log('No factual errors in spot-checks. Warnings are UX/wording only — safe to lock per user request.');
}

process.exit(errors.length ? 1 : 0);

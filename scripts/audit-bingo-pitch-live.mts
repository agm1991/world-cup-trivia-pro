#!/usr/bin/env npx tsx
/**
 * Accurate World Cup Bingo missing-player pitch audit (uses real app code).
 * Run: npx tsx scripts/audit-bingo-pitch-live.mts
 */
import { getWorldCupBingoQuestionsByLevel, BINGO_MAX_LEVELS } from '../src/data/worldCupBingoQuestions.ts';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt.ts';
import { resolveBingoLineupPitch } from '../src/lib/missingPlayerBingoLineupResolve.ts';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog.ts';

const MAX_LEVEL = Math.min(202, BINGO_MAX_LEVELS);

type Row = {
  level: number;
  question: number;
  mpId: string | null;
  matchup: string;
};

const fullPitch: Row[] = [];
const parsedNoPitch: Row[] = [];
const notParsed: Row[] = [];

for (let level = 1; level <= MAX_LEVEL; level++) {
  const qs = getWorldCupBingoQuestionsByLevel(level);
  qs.forEach((q, qi) => {
    if (q.sourceCategory !== 'missing-player') return;

    const questionNum = qi + 1;
    const mpId = extractNativeMpId(q.id);
    const parsed = parseMissingPlayerPromptForBingo(q.question);
    const matchup = parsed?.matchup ?? q.question.slice(0, 60);

    if (!parsed) {
      notParsed.push({ level, question: questionNum, mpId, matchup });
      return;
    }

    const positions = resolveBingoLineupPitch(parsed, q);
    if (positions.length === 11) {
      fullPitch.push({ level, question: questionNum, mpId, matchup });
    } else {
      parsedNoPitch.push({ level, question: questionNum, mpId, matchup });
    }
  });
}

function printRows(title: string, rows: Row[]) {
  console.log(`\n=== ${title} (${rows.length}) ===\n`);
  for (const r of rows) {
    console.log(`Level ${r.level} · Question ${r.question}${r.mpId ? ` (${r.mpId})` : ''}`);
  }
}

console.log('World Cup Bingo — missing-player pitch audit (levels 1–202)');
console.log('Uses: getWorldCupBingoQuestionsByLevel + parseMissingPlayerPromptForBingo + resolveBingoLineupPitch');

printRows('FULL PITCH UI (11 players on green pitch)', fullPitch);
printRows('PARSED BUT NO PITCH (falls back to text prompt)', parsedNoPitch);
printRows('NOT PARSED AS MISSING-PLAYER PROMPT', notParsed);

console.log('\n--- Summary ---');
console.log(`Full pitch: ${fullPitch.length}`);
console.log(`Parsed, no pitch: ${parsedNoPitch.length}`);
console.log(`Not parsed: ${notParsed.length}`);
console.log(`Total missing-player rows in bingo: ${fullPitch.length + parsedNoPitch.length + notParsed.length}`);

#!/usr/bin/env npx vite-node
import { getMissingPlayerLineupQuestionsForLevel } from '../src/data/missingPlayerLineupLevels7to17.ts';
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions.ts';
import { extractNativeMpId, findBingoMpLineupPitch } from '../src/data/bingoMpLineupCatalog.ts';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt.ts';

const mpQ = getMissingPlayerLineupQuestionsForLevel(16)[3]!; // match 4 = index 3
console.log('=== Missing Player Level 16 Question 4 ===');
console.log('match:', mpQ.match);
mpQ.positions.forEach((p, i) => console.log(`  ${i}: ${p.name} @ ${p.x},${p.y}`));

const bingoQ = getWorldCupBingoQuestionsByLevel(4)[1]!;
const parsed = parseMissingPlayerPromptForBingo(bingoQ.question)!;
const pitch = findBingoMpLineupPitch(parsed, bingoQ)!;
console.log('\n=== Bingo Level 4 Question 2 ===');
console.log('mp-id:', extractNativeMpId(bingoQ.id));
pitch.forEach((p, i) => console.log(`  ${i}: ${p.name} @ ${p.x},${p.y}${p.isMissing ? ' MISSING' : ''}`));

let mismatch = 0;
for (let i = 0; i < 11; i++) {
  const a = mpQ.positions[i]!;
  const b = pitch[i]!;
  const nameOk = (a.name === '???' && b.isMissing) || a.name === b.name;
  if (a.x !== b.x || a.y !== b.y || !nameOk) {
    console.log(`MISMATCH slot ${i}: MP ${a.name}@${a.x},${a.y} vs Bingo ${b.name}@${b.x},${b.y}`);
    mismatch++;
  }
}
console.log(mismatch === 0 ? '\nCoords MATCH exactly' : `\n${mismatch} slot mismatches`);

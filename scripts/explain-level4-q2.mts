#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions.ts';
import { extractNativeMpId, BINGO_MP_LINEUP_OVERRIDES } from '../src/data/bingoMpLineupCatalog.ts';
import { LEVEL_16 } from '../src/data/missingPlayerLineupLevels16.frozen.ts';

const q = getWorldCupBingoQuestionsByLevel(4)[1]!;
const mp = extractNativeMpId(q.id)!;
const defId = BINGO_MP_LINEUP_OVERRIDES[mp];
const def = LEVEL_16.find((d) => d.id === defId);

console.log('BINGO: Level 4, Question 2');
console.log('Question:', q.question?.replace(/\s+/g, ' '));
console.log('');
console.log('Compare in Missing Player mode:');
console.log('  → Level 16, Question 4');
console.log('  → Match:', def?.team1, 'vs', def?.team2, def?.year);
console.log('');
console.log('NOT Missing Player Level 4 (that is a different game).');

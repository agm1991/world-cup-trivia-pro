#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions.ts';
import { extractNativeMpId, BINGO_MP_LINEUP_OVERRIDES, findBingoMpLineupPitch } from '../src/data/bingoMpLineupCatalog.ts';
import { parseMissingPlayerPromptForBingo } from '../src/lib/missingPlayerBingoPrompt.ts';
import { LEVEL_16 } from '../src/data/missingPlayerLineupLevels16.frozen.ts';

const q = getWorldCupBingoQuestionsByLevel(4)[1]!;
const mp = extractNativeMpId(q.id);
console.log('Level 4 Q2 mp-id:', mp);
console.log('Override:', mp ? BINGO_MP_LINEUP_OVERRIDES[mp] : 'none');
console.log('Question:', q.question?.replace(/\s+/g, ' ').slice(0, 150));

const parsed = parseMissingPlayerPromptForBingo(q.question);
const pitch = parsed ? findBingoMpLineupPitch(parsed, q) : null;
console.log('\nBingo pitch:');
pitch?.forEach((s) => console.log(`  ${s.name} @ ${s.x},${s.y}${s.isMissing ? ' [MISSING]' : ''}`));

const def = LEVEL_16.find((d) => d.id === 'level-16-match-4');
console.log('\nMissing Player Level 16 Match 4:');
def?.slots.forEach((s) => console.log(`  ${s.displayName} @ ${s.x},${s.y}`));

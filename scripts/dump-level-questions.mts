#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions';

const level = Number(process.argv[2] ?? 94);
const qs = getWorldCupBingoQuestionsByLevel(level);
qs.forEach((q, i) => {
  console.log(`Q${i + 1} [${q.sourceCategory}] ${q.id}`);
  console.log(`  ${q.question}`);
  console.log('');
});

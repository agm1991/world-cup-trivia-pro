#!/usr/bin/env npx vite-node
import { getWorldCupBingoQuestionsByLevel } from '../src/data/worldCupBingoQuestions.ts';
import { extractNativeMpId } from '../src/data/bingoMpLineupCatalog.ts';

const level = Number(process.argv[2] ?? 11);
const qs = getWorldCupBingoQuestionsByLevel(level);
qs.forEach((q, i) => {
  console.log(
    `Q${i + 1} [${q.sourceCategory}] ${extractNativeMpId(q.id) ?? q.id}`,
  );
});

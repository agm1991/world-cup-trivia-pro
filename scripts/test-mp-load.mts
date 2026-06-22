#!/usr/bin/env npx vite-node
import { getMissingPlayerLineupQuestionsForLevel } from '../src/data/missingPlayerLineupLevels7to17.ts';

for (let lv = 7; lv <= 30; lv++) {
  try {
    const q = getMissingPlayerLineupQuestionsForLevel(lv);
    console.log(`Level ${lv}: OK (${q.length} questions)`);
  } catch (e) {
    console.error(`Level ${lv}: FAIL`, e);
    process.exit(1);
  }
}
console.log('All levels OK');

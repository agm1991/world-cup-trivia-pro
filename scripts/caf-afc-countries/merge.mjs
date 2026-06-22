import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cameroon } from './cameroon.mjs';
import { senegal } from './senegal.mjs';
import { nigeria } from './nigeria.mjs';
import { morocco } from './morocco.mjs';
import { ghana } from './ghana.mjs';
import { japan } from './japan.mjs';
import { korea } from './korea.mjs';
import { saudi } from './saudi.mjs';
import { iran } from './iran.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../../src/data/cafAfcLegendPerformanceBlocks.ts');

function q(pid, n, diff, question, A, B, C, D, ans, h1, h2, h3) {
  return `    { id: '${pid}-${n}', category: 'player', difficulty: '${diff}', question: ${JSON.stringify(question)}, optionA: ${JSON.stringify(A)}, optionB: ${JSON.stringify(B)}, optionC: ${JSON.stringify(C)}, optionD: ${JSON.stringify(D)}, correctAnswer: '${ans}', hint1: ${JSON.stringify(h1)}, hint2: ${JSON.stringify(h2)}, hint3: ${JSON.stringify(h3)} }`;
}

function emitPlayer(pid, rows) {
  const lines = rows.map((row, i) => q(pid, i + 1, ...row));
  return `  ${JSON.stringify(pid)}: [\n${lines.join(',\n')}\n  ]`;
}

const all = { ...cameroon, ...senegal, ...nigeria, ...morocco, ...ghana, ...japan, ...korea, ...saudi, ...iran };

let body = `import { Question } from '@/types/game';

/**
 * CAF/AFC Select a Legend — World Cup player actions only (no club trivia).
 * Q1–10 easy (1998–2022), Q11–20 medium (1970–1994), Q21–30 hard (detail / pioneers).
 * Generated: node scripts/caf-afc-countries/merge.mjs
 */
export const cafAfcLegendPerformanceBlocks: Record<string, Question[]> = {
`;

const keys = Object.keys(all);
body += keys.map((k) => emitPlayer(k, all[k])).join(',\n');
body += '\n};\n';

fs.writeFileSync(outPath, body);
console.log('Wrote', outPath, 'players', keys.length);

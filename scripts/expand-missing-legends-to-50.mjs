/**
 * Expands each 10-question block in playerQuestionsMissingLegends.ts to 50 questions.
 * Run: node scripts/expand-missing-legends-to-50.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildExtra40 } from './player-question-gen-extra.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../src/data/playerQuestionsMissingLegends.ts');

function countQuestionsInBlock(block) {
  return (block.match(/\{ id:/g) || []).length;
}

function inferMeta(playerId, block) {
  const appear = block.match(/question: "([^"]+?) appeared for (.+?) at which World Cup tournament/);
  if (!appear) {
    console.warn('inferMeta: no appear line', playerId);
    return null;
  }
  const name = appear[1];
  const country = appear[2];

  const escId = playerId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const q1m = block.match(new RegExp(`id: "${escId}-1"[^]*?optionA: "([^"]+)"`));
  if (!q1m) {
    console.warn('inferMeta: no Q1', playerId);
    return null;
  }
  const years = q1m[1]
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));

  const q3 = block.match(/primary role for .+? at the World Cup\?", optionA: "([^"]+)"/);
  const position = q3 ? q3[1] : 'Midfielder';

  const q4 = block.match(/Which best describes .+? in the squad\?", optionA: "([^"]+)"/);
  const bestRound = q4 ? q4[1] : 'Round of 16';

  const q5 = block.match(/Did .+? win a FIFA World Cup as a player\?", optionA: "([^"]+)"/);
  const wonWorldCup = !!(q5 && q5[1] === 'Yes');

  let finalLossTo;
  let thirdPlaceBeat;
  let semiBeat;
  const q6m = block.match(new RegExp(`id: "${escId}-6"[^]*?question: "([^"]+)"[^]*?optionA: "([^"]+)"`));
  if (q6m) {
    const qt = q6m[1];
    const a = q6m[2];
    if (qt.includes('lost the final')) finalLossTo = a;
    else if (qt.toLowerCase().includes('third-place')) thirdPlaceBeat = a;
    else if (qt.toLowerCase().includes('semi-final')) semiBeat = a;
  }

  const q8note = block.match(/Which statement about .+? and the World Cup is accurate\?", optionA: "([^"]+)"/);
  const note = q8note && q8note[1].length > 15 ? q8note[1] : undefined;

  return {
    id: playerId,
    name,
    country,
    years,
    position,
    bestRound,
    wonWorldCup,
    finalLossTo,
    thirdPlaceBeat,
    semiBeat,
    note,
  };
}

function existingQuestionsFromBlock(block) {
  const out = [];
  const chunks = block.split(/\{ id:/).slice(1);
  for (const ch of chunks) {
    const qm = ('{ id:' + ch).match(/question: ("(?:\\.|[^"])*")/);
    if (qm) {
      try {
        out.push({ question: JSON.parse(qm[1]) });
      } catch {
        /* ignore */
      }
    }
  }
  return out;
}

function renderQuestion(q) {
  const fields = ['id', 'category', 'difficulty', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'hint1', 'hint2', 'hint3'];
  const parts = fields.map((f) => `${f}: ${JSON.stringify(q[f])}`);
  return `      { ${parts.join(', ')} }`;
}

/** Split missingPlayerQuestionBlocks inner object into [id, body] */
function splitPlayerBlocks(inner) {
  const blocks = [];
  let i = 0;
  const re = /\n  '([^']+)':\s*\[/g;
  let m;
  const starts = [];
  while ((m = re.exec(inner)) !== null) {
    starts.push({ id: m[1], keyStart: m.index, arrOpen: m.index + m[0].length - 1 });
  }
  for (let k = 0; k < starts.length; k++) {
    const { id, arrOpen } = starts[k];
    let depth = 0;
    let j = arrOpen;
    for (; j < inner.length; j++) {
      const c = inner[j];
      if (c === '[') depth++;
      else if (c === ']') {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    const body = inner.slice(arrOpen + 1, j - 1);
    blocks.push([id, body]);
  }
  return blocks;
}

function main() {
  const src = fs.readFileSync(filePath, 'utf8');
  const blockDecl = 'export const missingPlayerQuestionBlocks: Record<string, Question[]> = {';
  const bi = src.indexOf(blockDecl);
  const tailIdx = src.indexOf('/** Years only for legends');
  if (bi === -1 || tailIdx === -1) {
    console.error('Could not find blocks or years section');
    process.exit(1);
  }
  const innerEnd = src.lastIndexOf('};', tailIdx);
  const inner = src.slice(bi + blockDecl.length, innerEnd);

  const split = splitPlayerBlocks(inner);
  let outInner = '';
  let expanded = 0;
  let skipped = 0;

  for (const [playerId, body] of split) {
    const n = countQuestionsInBlock(body);
    if (n >= 50) {
      outInner += `\n  '${playerId}': [\n${body.trim()}\n  ],`;
      continue;
    }
    if (n !== 10) {
      console.warn(`Skip ${playerId}: expected 10 or 50, got ${n}`);
      skipped++;
      outInner += `\n  '${playerId}': [\n${body.trim()}\n  ],`;
      continue;
    }

    const meta = inferMeta(playerId, body);
    if (!meta || !meta.years.length) {
      console.warn('Skip meta', playerId);
      skipped++;
      outInner += `\n  '${playerId}': [\n${body.trim()}\n  ],`;
      continue;
    }

    const existing = existingQuestionsFromBlock(body);
    const extra = buildExtra40(meta, existing);
    if (extra.length !== 40) {
      console.warn(`Short extra for ${playerId}: ${extra.length}`);
    }

    const trimmed = body.trim();
    const sep = trimmed.endsWith(',') ? '' : ',';
    outInner += `\n  '${playerId}': [\n${trimmed}${sep}\n`;
    outInner += extra.map((q) => `      ${renderQuestion(q)}`).join(',\n');
    outInner += `\n  ],`;
    expanded++;
  }

  const out = src.slice(0, bi + blockDecl.length) + outInner + `\n};\n\n` + src.slice(tailIdx);

  fs.writeFileSync(filePath + '.bak', src, 'utf8');
  fs.writeFileSync(filePath, out, 'utf8');
  console.log('Expanded', expanded, 'blocks; skipped', skipped, '— backup:', filePath + '.bak');
}

main();

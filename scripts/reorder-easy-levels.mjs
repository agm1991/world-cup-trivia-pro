#!/usr/bin/env node
/**
 * Reorder questions within levels 1-10 (wc-easy-1..wc-easy-100) of
 * src/data/worldCupQuestions.ts to break up back-to-back same-pattern questions
 * (e.g., three "Who won the X World Cup" in a row).
 *
 * Strategy: keep IDs 1..100 in positional order, but swap the question/options/
 * correctAnswer/hint1/hint2/hint3 payloads between positions according to the
 * per-level reorder maps below (1-based indices within each level of 10).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TARGET = resolve(__dirname, '..', 'src', 'data', 'worldCupQuestions.ts');

// Reorder maps: newOrder[i] is the OLD id (1-100) that should be placed at
// position i+1 (1-based) in the new sequence. Levels not listed keep their
// original order.
const reorderMaps = {
  1: [1, 5, 2, 7, 3, 6, 4, 8, 10, 9],
  2: [11, 18, 12, 16, 13, 19, 14, 17, 15, 20],
  3: [21, 23, 22, 24, 25, 28, 27, 29, 26, 30],
  4: [31, 34, 32, 35, 39, 36, 33, 37, 40, 38],
  5: [41, 42, 45, 43, 46, 44, 47, 48, 49, 50],
  6: [51, 53, 55, 54, 59, 57, 52, 58, 60, 56],
  7: [61, 63, 62, 66, 65, 67, 64, 68, 69, 70],
  8: [71, 72, 73, 74, 75, 76, 77, 79, 78, 80],
  9: [81, 85, 82, 88, 83, 87, 86, 90, 84, 89],
};

const source = readFileSync(TARGET, 'utf8');

/**
 * Parse the source file and extract the 100 wc-easy blocks.
 * Each block is the `{ id: 'wc-easy-N', ... }` object literal spanning multiple
 * lines, terminated by the closing `},` at its own indent level.
 */
function extractEasyBlocks(text) {
  const blocks = [];
  const idRegex = /id:\s*'wc-easy-(\d+)'/g;
  const matches = [...text.matchAll(idRegex)];

  for (const match of matches) {
    const idNum = Number.parseInt(match[1], 10);
    if (!Number.isFinite(idNum) || idNum < 1 || idNum > 100) continue;

    const idIndex = match.index;
    // Walk backwards to find the '{' that starts this object.
    let start = idIndex;
    while (start > 0 && text[start] !== '{') start -= 1;

    // Walk forwards, counting braces, to find the matching closing '}'.
    let depth = 0;
    let end = start;
    for (let i = start; i < text.length; i += 1) {
      const ch = text[i];
      if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }

    blocks.push({
      idNum,
      start,
      end, // inclusive index of closing '}'
      text: text.slice(start, end + 1),
    });
  }

  return blocks;
}

const blocks = extractEasyBlocks(source);
if (blocks.length !== 100) {
  throw new Error(`Expected 100 wc-easy blocks, found ${blocks.length}`);
}

// Sanity: ensure blocks are sequential by id (1..100 in order of appearance).
blocks.forEach((b, i) => {
  if (b.idNum !== i + 1) {
    throw new Error(
      `Blocks are not in sequential id order at index ${i}: id=${b.idNum}`
    );
  }
});

/**
 * Extract the payload (question, optionA..D, correctAnswer, hint1..3) from
 * a block's source text. Returns the raw substring of those property lines
 * so we can swap them while leaving id / category / difficulty untouched.
 */
function extractPayload(blockText) {
  // Find the start of `question:` line and the end of the last hint3 line.
  const questionStart = blockText.indexOf('question:');
  if (questionStart === -1) throw new Error('question: not found in block');

  // The last property we care about is hint3. Find it and then walk to the
  // end of that line (the newline character).
  const hint3Idx = blockText.indexOf('hint3:', questionStart);
  if (hint3Idx === -1) throw new Error('hint3: not found in block');

  // End of the hint3 line = next newline.
  let lineEnd = blockText.indexOf('\n', hint3Idx);
  if (lineEnd === -1) lineEnd = blockText.length;

  return {
    payload: blockText.slice(questionStart, lineEnd),
    before: blockText.slice(0, questionStart),
    after: blockText.slice(lineEnd),
  };
}

const originalBlocks = blocks.map((b) => ({ ...b }));
const originalPayloads = originalBlocks.map((b) => extractPayload(b.text).payload);

// Build new block text for each of the 100 blocks.
const newBlockTexts = new Array(100);
for (let pos = 1; pos <= 100; pos += 1) {
  const level = Math.ceil(pos / 10);
  const indexInLevel = ((pos - 1) % 10) + 1; // 1..10
  const reorder = reorderMaps[level];
  const sourceId = reorder ? reorder[indexInLevel - 1] : pos;

  const originalBlock = originalBlocks[pos - 1];
  const { before, after } = extractPayload(originalBlock.text);
  const newPayload = originalPayloads[sourceId - 1];
  newBlockTexts[pos - 1] = before + newPayload + after;
}

// Splice the new blocks back into the source. Work from end to start so
// indices stay valid.
let output = source;
for (let i = originalBlocks.length - 1; i >= 0; i -= 1) {
  const b = originalBlocks[i];
  output =
    output.slice(0, b.start) + newBlockTexts[i] + output.slice(b.end + 1);
}

writeFileSync(TARGET, output, 'utf8');
console.log(
  `Reordered ${Object.keys(reorderMaps).length} levels in ${TARGET}`
);

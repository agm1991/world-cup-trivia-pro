#!/usr/bin/env node
/** Print sorted inventory: country · year (always 10 after audit) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../src/data/campaignQuestions.ts');
const lines = fs.readFileSync(file, 'utf8').split('\n');

let country = null;
let year = null;
let inYear = false;
let count = 0;
const rows = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const cm = line.match(/^  ([a-zA-Z_][a-zA-Z0-9_]*): \{$/);
  if (cm) {
    country = cm[1];
    continue;
  }
  const ym = line.match(/^    (\d{4}): \[$/);
  if (ym) {
    if (inYear && country && year !== null) {
      rows.push({ country, year, count });
    }
    year = ym[1];
    count = 0;
    inYear = true;
    continue;
  }
  if (
    inYear &&
    (/^\s*\{\s*id:\s*\d+/.test(line) || /^\s+id:\s*\d+,?\s*$/.test(line))
  ) {
    count += 1;
  }
  if (inYear && /^    \],$/.test(line)) {
    if (country && year !== null) {
      rows.push({ country, year, count });
    }
    inYear = false;
    year = null;
    count = 0;
  }
}

rows.sort((a, b) => a.country.localeCompare(b.country) || Number(a.year) - Number(b.year));
for (const r of rows) {
  console.log(`${r.country}\t${r.year}\t${r.count}`);
}

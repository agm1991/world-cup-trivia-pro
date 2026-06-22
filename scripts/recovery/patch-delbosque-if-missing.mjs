import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../../src/data/managersQuestions.ts');
let content = fs.readFileSync(file, 'utf8');

if (content.includes('delbosque-esp-1')) {
  console.log('Del Bosque already present');
  process.exit(0);
}

const insertMarker = '  // Michel Hidalgo - France 1982 World Cup Campaign';
const idx = content.indexOf(insertMarker);
if (idx === -1) {
  console.error('Hidalgo marker not found for Del Bosque insert');
  process.exit(1);
}

const delBosqueBlock = fs.readFileSync(path.join(__dirname, '_patch-esp-swe-tur-uru-managers.mjs'), 'utf8');
const match = delBosqueBlock.match(/const delBosqueBlock = `([\s\S]*?)`;/);
if (!match) {
  console.error('Could not extract delBosqueBlock');
  process.exit(1);
}

let block = match[1].replace(/\\\\'/g, "\\'");
content = content.slice(0, idx) + block + '\n\n' + content.slice(idx);
fs.writeFileSync(file, content);
console.log('Inserted Del Bosque manager questions');

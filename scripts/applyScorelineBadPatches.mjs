#!/usr/bin/env node
/**
 * Applies scoreline curator fixes from deriveScorelineBadFixes.ts JSON output.
 *
 *   npx tsx scripts/deriveScorelineBadFixes.ts > /tmp/fixes.json
 *   node scripts/applyScorelineBadPatches.mjs /tmp/fixes.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Wikipedia/FIFA when derive had no option bucket or wrong match leg. */
const MANUAL_BY_ID = {
  'sc-cur-38-02': { correctAnswer: 'B' }, // 1938 replay: SUI 4–2 GER
  'sc-cur-42-09': { optionB: '2-1', correctAnswer: 'B' }, // 1962: BRA 2–1 ESP
};

function patchJsonObject(q, patch) {
  const o = { ...q };
  if (patch.correctAnswer) o.correctAnswer = patch.correctAnswer;
  for (const k of ['optionA', 'optionB', 'optionC', 'optionD']) {
    if (patch[k]) o[k] = patch[k];
  }
  return o;
}

function walk(node, idsToLetters) {
  if (Array.isArray(node)) return node.map((x) => walk(x, idsToLetters));
  if (node && typeof node === 'object' && typeof node.id === 'string') {
    const oid = node.id;
    const letter = idsToLetters.get(oid);
    const manual = MANUAL_BY_ID[oid];
    let o = { ...node };
    if (manual) o = patchJsonObject(o, manual);
    if (letter && letter !== '?') o = { ...o, correctAnswer: letter };
    return o;
  }
  if (node && typeof node === 'object') {
    const acc = {};
    for (const [k, v] of Object.entries(node)) acc[k] = walk(v, idsToLetters);
    return acc;
  }
  return node;
}

function rewriteJson(filepath, idsToLetters) {
  const raw = fs.readFileSync(filepath, 'utf8');
  const touchedIds = [...idsToLetters.keys(), ...Object.keys(MANUAL_BY_ID)];
  if (!touchedIds.some((id) => raw.includes(`"id": "${id}"`))) return false;
  const data = JSON.parse(raw);
  const out = walk(data, idsToLetters);
  fs.writeFileSync(filepath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  return true;
}

function collectFiles(root, pred) {
  const out = [];
  const walk = (d) => {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (pred(ent.name, p)) out.push(p);
    }
  };
  walk(root);
  return out;
}

function patchTs(filepath, oid, letter) {
  let txt = fs.readFileSync(filepath, 'utf8');
  const escaped = oid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(id:\\s*'${escaped}'(?:[\\s\\S])*?)correctAnswer:\\s*'[A-D]'`, 'm');

  let ntxt = txt.replace(re, `$1correctAnswer: '${letter}'`);

  /** Optional option edits (Brazil–Spain adds 2-1 distractor swap). */
  const man = MANUAL_BY_ID[oid];
  if (man?.optionB && ntxt.includes(`id: '${oid}'`)) {
    const obr = new RegExp(
      `(id:\\s*'${escaped}'(?:[\\s\\S])*?optionB:\\s*')([^']+)('(?:[\\s\\S])*?correctAnswer)`,
      'm',
    );
    ntxt = ntxt.replace(obr, `$1${man.optionB}$3`);
  }

  if (ntxt !== txt) {
    fs.writeFileSync(filepath, ntxt, 'utf8');
    return true;
  }
  console.error(`TS miss ${oid} in ${path.relative(ROOT, filepath)}`);
  return false;
}

const fixesPath = process.argv[2] || '/tmp/fixes.json';
const fixes = JSON.parse(fs.readFileSync(fixesPath, 'utf8'));

const idsToLetters = new Map();
for (const row of fixes) {
  if (row.letter && row.letter !== '?') idsToLetters.set(row.id, row.letter);
}
for (const [oid, m] of Object.entries(MANUAL_BY_ID)) {
  if (m.correctAnswer) idsToLetters.set(oid, m.correctAnswer);
}

const jsonPaths = collectFiles(
  path.join(ROOT, 'src/data'),
  (name) => name.includes('Curated') && name.endsWith('.json'),
);

let nJson = 0;
for (const jp of jsonPaths) {
  if (rewriteJson(jp, idsToLetters)) nJson++;
}

const tsCurated = collectFiles(
  path.join(ROOT, 'src/data'),
  (name) => name.includes('Curated') && name.endsWith('.ts'),
);

for (const oid of idsToLetters.keys()) {
  for (const tf of tsCurated) {
    const raw = fs.readFileSync(tf, 'utf8');
    if (!raw.includes(oid)) continue;
    patchTs(tf, oid, idsToLetters.get(oid));
  }
}

console.log(`Patched curated JSON (${nJson} files) + .ts curated files.`);

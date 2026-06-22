#!/usr/bin/env node
/**
 * Lists World Cup Bingo guess-who rows (levels 1–202) missing a resolvable portrait.
 * Run: node scripts/audit-bingo-guess-who-photos.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const WIKI = {
  'rigobert song': true,
  'roger milla': true,
  'samuel etoo': true,
};

function normalize(name) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[''`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function hasLocalPortrait(name) {
  const n = normalize(name);
  if (WIKI[n]) return true;
  const playersDir = path.join(root, 'src/assets/players');
  for (const folder of fs.readdirSync(playersDir)) {
    const dir = path.join(playersDir, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir)) {
      const stem = file.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
      if (normalize(stem) === n) {
        const stat = fs.statSync(path.join(dir, file));
        return stat.size > 5000;
      }
    }
  }
  return false;
}

function parseGuessWho(q) {
  return /^who am i/i.test(q.trim()) || q.includes('XI:');
}

const gw = fs.readFileSync(path.join(root, 'src/data/guessWhoQuestions.ts'), 'utf8');
const gwp = fs.readFileSync(path.join(root, 'src/data/guessWhoPhotoQuestions.ts'), 'utf8');
const byId = new Map();

for (const m of gw.matchAll(
  /id: '(gw-[^']+)'[\s\S]*?question: '([^']*)'[\s\S]*?(?:image: (\w+),)?[\s\S]*?correctAnswer: '([A-D])'[\s\S]*?optionA: '([^']*)'[\s\S]*?optionB: '([^']*)'/g,
)) {
  byId.set(m[1], { question: m[2], correct: m[4], options: { A: m[5], B: m[6] } });
}

const bingo = fs.readFileSync(path.join(root, 'src/data/worldCupBingoQuestions.ts'), 'utf8');
const seed = 0xb1e60226;
function mulberry32(s) {
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Simplified: scan guess-who pool for image questions missing portrait
let fail = 0;
let ok = 0;
for (const [, row] of byId) {
  if (!parseGuessWho(row.question)) continue;
  const name = row.options[row.correct];
  if (hasLocalPortrait(name)) ok++;
  else fail++;
}
console.log(`Guess-who with Who am I: ${ok} ok portraits, ${fail} need wiki/fallback`);

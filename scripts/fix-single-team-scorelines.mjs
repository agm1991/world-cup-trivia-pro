#!/usr/bin/env node
/**
 * One-off: repair legacy scoreline rows that only name one team.
 * Run: node scripts/fix-single-team-scorelines.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const overrides = {
  'sc-1954-2-9': 'Hungary',
  'sc-1966-4-2': 'North Korea',
  'sc-1982-3-7': 'Peru',
  'sc-1986-3-10': 'West Germany',
  'sc-1998-4-7': 'Scotland',
};

const flagsText = fs.readFileSync(path.join(root, 'src/data/worldCupNationFlags.ts'), 'utf8');
const selectText = fs.readFileSync(path.join(root, 'src/data/selectLegendCountriesCore.ts'), 'utf8');
const unique = [
  ...new Set([
    ...flagsText.matchAll(/name: '([^']+)'/g),
    ...selectText.matchAll(/name: '([^']+)'/g),
  ].map((m) => m[1])),
];
const flagMap = Object.fromEntries(
  [...flagsText.matchAll(/name: '([^']+)', code: '[^']+', flag: '([^']+)'/g)].map((m) => [m[1], m[2]]),
);

function stripFlags(s) {
  return s.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
}
function teamLabel(name) {
  const flag = flagMap[name] || '🏳️';
  return `${name} ${flag}`;
}
function findCountriesInText(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const c of unique.sort((a, b) => b.length - a.length)) {
    if (lower.includes(c.toLowerCase())) found.push(c);
  }
  return found;
}
function resolveCountryName(fragment) {
  const f = fragment.trim().toLowerCase();
  for (const country of unique.sort((a, b) => b.length - a.length)) {
    const cLower = country.toLowerCase();
    if (f === cLower || f.startsWith(`${cLower} `)) return country;
  }
  return null;
}
function scoreOpponentCandidate(country, hints, primaryNorm) {
  const cLower = country.toLowerCase();
  if (primaryNorm.includes(cLower)) return -1;
  let score = 0;
  for (const hint of hints) {
    if (new RegExp(`${country}[^.]{0,50}got (?:a consolation|eliminated)`, 'i').test(hint)) score += 12;
    if (new RegExp(`scored for\\s+${country}`, 'i').test(hint)) score += 10;
    if (new RegExp(`${country}\\s+won\\b`, 'i').test(hint)) score += 6;
    if (new RegExp(`${country}\\s+advanced\\b`, 'i').test(hint)) score += 4;
  }
  return score;
}
function inferOpponent(primary, hints, id) {
  if (overrides[id]) return overrides[id];
  const primaryNorm = stripFlags(primary).toLowerCase();
  const hintPatterns = [
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\s+(?:got a consolation|got eliminated|finished with zero points)\b/i,
    /scored for\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\b/i,
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\s+advanced\b/i,
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\s+won\b/i,
  ];
  for (const hint of hints) {
    for (const pattern of hintPatterns) {
      const match = pattern.exec(hint);
      if (!match?.[1]) continue;
      const resolved = resolveCountryName(match[1].trim());
      if (resolved && !primaryNorm.includes(resolved.toLowerCase())) return resolved;
    }
  }
  const hintText = hints.join(' ');
  const inHints = findCountriesInText(hintText);
  const inPrimary = findCountriesInText(primary);
  const candidates = inHints.filter(
    (c) =>
      !inPrimary.includes(c) &&
      !primaryNorm.includes(c.toLowerCase()) &&
      scoreOpponentCandidate(c, hints, primaryNorm) > 0,
  );
  if (candidates.length === 0) {
    const fallback = inHints.filter((c) => !inPrimary.includes(c) && !primaryNorm.includes(c.toLowerCase()));
    return fallback.length === 1 ? fallback[0] : null;
  }
  return candidates.sort(
    (a, b) => scoreOpponentCandidate(b, hints, primaryNorm) - scoreOpponentCandidate(a, hints, primaryNorm),
  )[0];
}

const file = path.join(root, 'src/data/scorelineQuestions.ts');
let text = fs.readFileSync(file, 'utf8');
const blockRe = /id: '(sc-[^']+)'[\s\S]*?question: '([^']+)'[\s\S]*?hint1: '([^']*)'[\s\S]*?hint2: '([^']*)'[\s\S]*?hint3: '([^']*)'/g;
let count = 0;

text = text.replace(blockRe, (block, id, q, h1, h2, h3) => {
  if (/\bvs\b/i.test(q) || !/ - (group|round|semi|quarter|final|third)/i.test(q)) return block;
  const stage = q.slice(q.lastIndexOf(' - ') + 3);
  const primaryRaw = q.slice(0, q.lastIndexOf(' - ')).trim();
  const primaryName = stripFlags(primaryRaw);
  const opp = inferOpponent(primaryRaw, [h1, h2, h3], id);
  if (!opp) return block;
  const newQ = `${teamLabel(primaryName)} vs ${teamLabel(opp)} - ${stage}`;
  if (newQ === q) return block;
  count++;
  return block.replace(`question: '${q}'`, `question: '${newQ}'`);
});

fs.writeFileSync(file, text);
console.log(`Patched ${count} single-team scoreline question(s).`);

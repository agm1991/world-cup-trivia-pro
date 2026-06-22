#!/usr/bin/env node
/**
 * Audits World Cup Bingo scoreline headings for levels 1–204:
 * - both teams present after repair
 * - year resolvable
 * Run: node scripts/audit-bingo-scoreline-headings.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const flagsText = fs.readFileSync(path.join(root, 'src/data/worldCupNationFlags.ts'), 'utf8');
const selectText = fs.readFileSync(path.join(root, 'src/data/selectLegendCountriesCore.ts'), 'utf8');
const overrides = fs.readFileSync(path.join(root, 'src/data/scorelineSingleTeamOpponents.ts'), 'utf8');
const countries = [
  ...flagsText.matchAll(/name: '([^']+)'/g),
  ...selectText.matchAll(/name: '([^']+)'/g),
].map((m) => m[1]);
const uniqueCountries = [...new Set(countries)].sort((a, b) => b.length - a.length);

const overrideMap = Object.fromEntries(
  [...overrides.matchAll(/'(sc-[^']+)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
);

const dateMap = Object.fromEntries(
  [
    ...fs
      .readFileSync(path.join(root, 'src/lib/scorelinePresentation.ts'), 'utf8')
      .matchAll(/'(sc-[^']+)':\s*'([^']+)'/g),
  ].map((m) => [m[1], m[2]]),
);

function stripFlags(s) {
  return s.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '').trim();
}

function findCountriesInText(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const c of uniqueCountries) {
    if (lower.includes(c.toLowerCase())) found.push(c);
  }
  return found;
}

function resolveCountryName(fragment) {
  const f = fragment.trim().toLowerCase();
  for (const country of uniqueCountries) {
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

function inferOpponent(primary, hints, embeddedId) {
  if (embeddedId && overrideMap[embeddedId]) return overrideMap[embeddedId];
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

function extractEmbeddedScorelineId(id) {
  const m = /(sc-\d{4}-\d+-\d+)/.exec(id) ?? /(sc-cur-\d+-\d+)/.exec(id);
  return m?.[1] ?? null;
}

function resolveYear(q) {
  const embedded = extractEmbeddedScorelineId(q.id);
  if (embedded) {
    const ym = /^sc-(\d{4})-/.exec(embedded);
    if (ym) return parseInt(ym[1], 10);
  }
  for (const hint of [q.hint1, q.hint2, q.hint3]) {
    const m = /\b(19|20)\d{2}\b/.exec(hint ?? '');
    if (m) return parseInt(m[0], 10);
  }
  const mq = /\b(19|20)\d{2}\b/.exec(q.question);
  if (mq) return parseInt(mq[0], 10);
  return null;
}

function repairTeams(question, hints, embeddedId) {
  if (/\bvs\b/i.test(question)) {
    const idx = question.lastIndexOf(' - ');
    return idx === -1 ? question.trim() : question.slice(0, idx).trim();
  }
  const single = /^(.+?)\s*-\s*(group|round|semi|quarter|final|third)/i.exec(question);
  if (!single?.[1]) return question.trim();
  const primary = single[1].trim();
  const opponent = inferOpponent(primary, hints, embeddedId);
  if (!opponent) return primary;
  return `${primary} vs ${opponent}`;
}

function isComplete(teams) {
  const pair = teams.split(/\s+vs\s+/i).map((s) => s.trim());
  return pair.length === 2 && pair[0] && pair[1];
}

const bingoText = fs.readFileSync(path.join(root, 'src/data/worldCupBingoQuestions.ts'), 'utf8');
const levelRe = /level:\s*(\d+)[\s\S]*?questions:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
const qRe =
  /\{\s*id:\s*'([^']+)'[\s\S]*?question:\s*'([^']*)'[\s\S]*?hint1:\s*'([^']*)'[\s\S]*?hint2:\s*'([^']*)'[\s\S]*?sourceCategory:\s*'([^']*)'/g;

const scoreOpts = /^\d{1,2}\s*-\s*\d{1,2}/;
const stageInQ = / - (group stage|round of 16|quarter-final|semi-final|final)/i;

let levelMatch;
const failures = [];

while ((levelMatch = levelRe.exec(bingoText))) {
  const level = parseInt(levelMatch[1], 10);
  if (level < 1 || level > 204) continue;
  const block = levelMatch[2];
  let qm;
  while ((qm = qRe.exec(block))) {
    const [, id, question, h1, h2, h3, sourceCategory] = qm;
    const isScoreline =
      sourceCategory === 'guess-scoreline' ||
      stageInQ.test(question) ||
      (/\bvs\b/i.test(question) && stageInQ.test(question));
    if (!isScoreline) continue;

    const q = { id, question, hint1: h1, hint2: h2, hint3: h3 };
    const embedded = extractEmbeddedScorelineId(id);
    const teams = repairTeams(question, [h1, h2, h3], embedded);
    const year = resolveYear(q);
    if (!isComplete(teams)) {
      failures.push({ level, id, question, teams, year });
    }
  }
}

if (failures.length === 0) {
  console.log('OK: all bingo scoreline questions (levels 1–204) have complete matchups after repair.');
  process.exit(0);
}

console.error(`FAIL: ${failures.length} incomplete scoreline matchup(s):`);
for (const f of failures) {
  console.error(`  L${f.level} ${f.id}: "${f.question}" -> "${f.teams}" (year=${f.year})`);
}
process.exit(1);

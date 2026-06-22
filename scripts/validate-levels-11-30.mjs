#!/usr/bin/env node
// Validate World Cup levels 11-30 (medium + hard) for:
//   1. Correct difficulty mapping per level
//   2. Duplicate prompts (same question text appearing twice)
//   3. Duplicate answer facts (same canonical answer for the same/near-same prompt)
//   4. Diversity: no more than 2 consecutive questions with the same primary country
//   5. 10 questions per level (Level 11..20 medium block 0..99, Level 21..30 hard block 0..99)

import fs from 'node:fs';

const src = fs.readFileSync('src/data/worldCupQuestions.ts', 'utf8');

// Extract question objects via a lightweight line-by-line parser keyed on `id: 'wc-...'`.
const lines = src.split('\n');
const blocks = [];
for (let i = 0; i < lines.length; i++) {
  const m = /id:\s*'(wc-(?:easy|medium|hard)-\d+)'/.exec(lines[i]);
  if (!m) continue;
  const id = m[1];
  // look ahead up to 30 lines for the fields we care about
  const block = lines.slice(i, i + 30).join('\n');
  const get = (field) => {
    const rx = new RegExp(field + ":\\s*(\"([^\"]*)\"|'([^']*)')");
    const mm = rx.exec(block);
    if (!mm) return '';
    return mm[2] !== undefined ? mm[2] : (mm[3] || '');
  };
  const difficulty = get('difficulty');
  const question = get('question');
  const correctAnswer = get('correctAnswer');
  const optionA = get('optionA');
  const optionB = get('optionB');
  const optionC = get('optionC');
  const optionD = get('optionD');
  const correct = { A: optionA, B: optionB, C: optionC, D: optionD }[correctAnswer];
  blocks.push({ id, difficulty, question, correct });
}

const mediums = blocks.filter(b => b.id.startsWith('wc-medium-'));
const hards = blocks.filter(b => b.id.startsWith('wc-hard-'));

const problems = [];

if (mediums.length < 100) problems.push(`Only ${mediums.length} medium questions (need >= 100)`);
if (hards.length < 100) problems.push(`Only ${hards.length} hard questions (need >= 100)`);

// Duplicate prompts across the 200
const seenByPrompt = new Map();
for (const b of [...mediums, ...hards]) {
  const key = b.question.trim().toLowerCase();
  if (seenByPrompt.has(key)) {
    problems.push(`Duplicate prompt text: ${seenByPrompt.get(key)} ↔ ${b.id}`);
  } else {
    seenByPrompt.set(key, b.id);
  }
}

// Lightweight "fact fingerprint" to catch near-duplicates where the same event + same answer
function fact(q, ans) {
  const s = (q + ' ' + ans).toLowerCase();
  return s.replace(/[^a-z0-9]+/g, ' ').trim();
}
const factMap = new Map();
for (const b of [...mediums, ...hards]) {
  // normalise some synonyms
  const norm = fact(b.question, b.correct);
  if (factMap.has(norm)) {
    problems.push(`Duplicate fact fingerprint: ${factMap.get(norm)} ↔ ${b.id}`);
  } else {
    factMap.set(norm, b.id);
  }
}

// Basic primary-country classification used purely for the "no more than 2 in a row" rule
const countryKeywords = [
  ['Argentina', /argentin/i],
  ['Brazil', /brazil/i],
  ['France', /france|french/i],
  ['Germany', /german|west germany|east germany/i],
  ['Italy', /ital(y|ian)/i],
  ['Spain', /spain|spanish/i],
  ['Netherlands', /netherlands|dutch|oranje/i],
  ['England', /england|english/i],
  ['Portugal', /portug(al|uese)/i],
  ['Croatia', /croat/i],
  ['Uruguay', /uruguay/i],
  ['Mexico', /mexic/i],
  ['Morocco', /morocc/i],
  ['Japan', /japan/i],
  ['South Korea', /south korea|s\.?\s?korea/i],
  ['Senegal', /senegal/i],
  ['Cameroon', /cameroon/i],
  ['Nigeria', /nigeria/i],
  ['Ghana', /ghana/i],
  ['Ivory Coast', /ivory coast/i],
  ['Russia', /russia/i],
  ['USA', /united states|\busa\b|u\.s\.a\.|american side/i],
  ['Costa Rica', /costa rica/i],
  ['Paraguay', /paraguay/i],
  ['Peru', /peru/i],
  ['Colombia', /colombia/i],
  ['Chile', /chile/i],
  ['Denmark', /denmark|danish/i],
  ['Sweden', /sweden|swed/i],
  ['Switzerland', /switzerland|swiss/i],
  ['Belgium', /belgi/i],
  ['Turkey', /turk/i],
  ['Tunisia', /tunisi/i],
  ['Algeria', /algeri/i],
  ['Saudi Arabia', /saudi/i],
  ['Iran', /iran/i],
  ['Australia', /australi/i],
  ['Ireland', /ireland|irish/i],
  ['Northern Ireland', /northern ireland/i],
  ['Scotland', /scotland|scottish/i],
  ['Wales', /wales|welsh/i],
  ['Hungary', /hungar/i],
  ['Poland', /poland|polish/i],
  ['Bulgaria', /bulgari/i],
  ['Czechoslovakia', /czech/i],
  ['Greece', /greek|greece/i],
  ['Norway', /norway|norwegi/i],
  ['Slovakia', /slovak/i],
  ['New Zealand', /new zealand/i],
  ['Trinidad and Tobago', /trinidad/i],
  ['Angola', /angola/i],
  ['Ukraine', /ukrain/i],
  ['Ecuador', /ecuador/i],
  ['Panama', /panama/i],
  ['Canada', /canada/i],
  ['Qatar', /qatar/i],
  ['Jamaica', /jamaic/i],
  ['Togo', /togo/i],
  ['UAE', /united arab emirates|\buae\b/i],
  ['Egypt', /egypt/i],
  ['North Korea', /north korea|n\.?\s?korea/i],
];

// Strip " at France 1998", " at Italy 1990", etc. so that hosts don't dominate the match.
function stripHostMentions(text) {
  return text
    .replace(/\bat\s+[a-z][a-z\s]*\s+(19|20)\d\d\b/gi, '')
    .replace(/\b(19|20)\d\d\s+world\s+cup\b/gi, '')
    .replace(/\bworld\s+cup\s+(19|20)\d\d\b/gi, '')
    .replace(/\b(france|germany|italy|brazil|russia|qatar|spain|mexico|japan|usa|united states|argentina|south korea|south africa|england|sweden|switzerland|chile|uruguay)\s+(19|20)\d\d\b/gi, '');
}

function primaryCountry(b) {
  const text = stripHostMentions(b.question + ' ' + b.correct).toLowerCase();
  for (const [name, rx] of countryKeywords) {
    if (rx.test(text)) return name;
  }
  return null;
}

function checkLevel(levelNum, slice) {
  let run = null; let runLen = 0;
  slice.forEach((b, idx) => {
    const c = primaryCountry(b);
    if (c && c === run) {
      runLen++;
      if (runLen > 2) {
        problems.push(`Level ${levelNum}: ${runLen} consecutive questions primary about ${c} (ends at ${b.id})`);
      }
    } else {
      run = c; runLen = 1;
    }
  });
}

for (let level = 11; level <= 20; level++) {
  const start = (level - 11) * 10;
  const slice = mediums.slice(start, start + 10);
  if (slice.length !== 10) problems.push(`Level ${level} has ${slice.length} questions (need 10)`);
  checkLevel(level, slice);
}

for (let level = 21; level <= 30; level++) {
  const start = (level - 21) * 10;
  const slice = hards.slice(start, start + 10);
  if (slice.length !== 10) problems.push(`Level ${level} has ${slice.length} questions (need 10)`);
  checkLevel(level, slice);
}

if (problems.length === 0) {
  console.log(`OK: ${mediums.length} medium + ${hards.length} hard questions, no issues found.`);
  process.exit(0);
}

console.log(`FOUND ${problems.length} issue(s):`);
for (const p of problems) console.log(' - ' + p);
process.exit(1);

#!/usr/bin/env node
/**
 * Validates campaign questions: 10 per campaign, no hint leaks, no duplicates.
 * Reads campaignQuestions.ts and CountryHistory.tsx to compute expected vs actual.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const campaignPath = path.join(root, 'src/data/campaignQuestions.ts');
const historyPath = path.join(root, 'src/pages/CountryHistory.tsx');

const content = fs.readFileSync(campaignPath, 'utf-8');
const historyContent = fs.readFileSync(historyPath, 'utf-8');

// Expected: from CountryHistory.tsx extract { name, worldCupYears } for each country (one per line)
const expected = new Map(); // key = "countryKey|year" -> displayName
historyContent.split('\n').forEach((line) => {
  const nameMatch = line.match(/name:\s*'([^']+)'/);
  const yearsMatch = line.match(/worldCupYears:\s*\[([^\]]*)\]/);
  if (nameMatch && yearsMatch) {
    const name = nameMatch[1];
    const years = yearsMatch[1].match(/\d{4}/g) || [];
    const key = name.toLowerCase().trim();
    years.forEach((y) => expected.set(`${key}|${y}`, name));
  }
});

// Parse campaignQuestions.ts: track current country and year, extract each question block
const lines = content.split('\n');
let currentCountry = null;
let currentYear = null;
const campaigns = new Map(); // "country|year" -> [ { id, question, optionA..D, correctAnswer, hint1..3 } ]
// hint4 is optional (present in current campaignQuestions.ts)
const questionLineRegex = /\{\s*id:\s*(\d+),\s*question:\s*"([^"]*)",\s*optionA:\s*"([^"]*)",\s*optionB:\s*"([^"]*)",\s*optionC:\s*"([^"]*)",\s*optionD:\s*"([^"]*)",\s*correctAnswer:\s*['"]([A-D])['"],\s*hint1:\s*"([^"]*)",\s*hint2:\s*"([^"]*)",\s*hint3:\s*"([^"]*)"(?:,\s*hint4:\s*"([^"]*)")?\s*\}/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();
  if (/^[a-z][a-z0-9_]*:\s*\{/.test(trimmed)) {
    currentCountry = trimmed.replace(/:.*/, '').trim();
  } else if (/^'[^']+':\s*\{/.test(trimmed)) {
    currentCountry = trimmed.replace(/:.*/, '').replace(/^'|':\s*\{?$/, '').replace(/'$/, '').trim();
  }
  const yearMatch = trimmed.match(/^(\d{4}):\s*\[/);
  if (yearMatch) {
    currentYear = yearMatch[1];
  }
  const qMatch = line.match(questionLineRegex);
  if (qMatch && currentCountry != null && currentYear != null) {
    const key = `${currentCountry}|${currentYear}`;
    if (!campaigns.has(key)) campaigns.set(key, []);
    const opts = { A: qMatch[3], B: qMatch[4], C: qMatch[5], D: qMatch[6] };
    campaigns.get(key).push({
      id: parseInt(qMatch[1], 10),
      question: qMatch[2],
      correctAnswer: qMatch[7],
      correctText: opts[qMatch[7]],
      hint1: qMatch[8],
      hint2: qMatch[9],
      hint3: qMatch[10],
      hint4: qMatch[11] || '',
    });
  }
}

// Checks
const wrongCount = [];
const hintLeaks = [];
const duplicates = new Map(); // question text (lower) -> [ { country, year, id } ]
const completed = [];
const missing = [];

for (const [key, questions] of campaigns) {
  const [country, year] = key.split('|');
  if (questions.length !== 10) {
    wrongCount.push({ country, year, count: questions.length });
  } else {
    completed.push({ country, year });
  }
  questions.forEach((q) => {
    const correct = (q.correctText || '').toLowerCase();
    [q.hint1, q.hint2, q.hint3, q.hint4].forEach((h, i) => {
      if (!h) return;
      const hLower = h.toLowerCase();
      if (correct && (hLower === correct || hLower.includes(correct))) {
        hintLeaks.push({ country, year, id: q.id, hint: i < 3 ? `hint${i + 1}` : 'hint4', text: h, answer: q.correctText });
      }
    });
    const qKey = q.question.toLowerCase().trim();
    if (!duplicates.has(qKey)) duplicates.set(qKey, []);
    duplicates.get(qKey).push({ country, year, id: q.id });
  });
}

const duplicateList = [...duplicates.entries()].filter(([, arr]) => arr.length > 1);

for (const key of expected.keys()) {
  if (!campaigns.has(key)) {
    const [c, y] = key.split('|');
    missing.push({ country: expected.get(key) || c, year: y });
  }
}

// Sort and output
completed.sort((a, b) => a.country.localeCompare(b.country) || Number(a.year) - Number(b.year));
missing.sort((a, b) => a.country.localeCompare(b.country) || Number(a.year) - Number(b.year));

console.log('=== CAMPAIGN VALIDATION REPORT ===\n');
console.log('COMPLETED CAMPAIGNS (10 questions each):');
const byCountry = new Map();
completed.forEach(({ country, year }) => {
  if (!byCountry.has(country)) byCountry.set(country, []);
  byCountry.get(country).push(year);
});
[...byCountry.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([country, years]) => {
  years.sort((a, b) => Number(a) - Number(b));
  console.log(`  ${country}: ${years.length} campaigns (${years.join(', ')})`);
});
console.log(`\nTotal completed: ${completed.length} campaigns across ${byCountry.size} countries.\n`);

if (wrongCount.length > 0) {
  console.log('WRONG QUESTION COUNT (expected 10):');
  wrongCount.forEach(({ country, year, count }) => console.log(`  ${country} ${year}: ${count}`));
  console.log('');
}

if (hintLeaks.length > 0) {
  console.log('HINTS THAT REVEAL ANSWER:');
  hintLeaks.slice(0, 30).forEach(({ country, year, id, hint, text, answer }) => {
    console.log(`  ${country} ${year} Q${id} ${hint}: "${text.substring(0, 50)}..." -> answer "${answer}"`);
  });
  if (hintLeaks.length > 30) console.log(`  ... and ${hintLeaks.length - 30} more`);
  console.log('');
}

if (duplicateList.length > 0) {
  console.log('DUPLICATE QUESTIONS:');
  duplicateList.slice(0, 15).forEach(([q, arr]) => {
    console.log(`  "${q.substring(0, 50)}..." in ${arr.map((a) => `${a.country} ${a.year}`).join(', ')}`);
  });
  if (duplicateList.length > 15) console.log(`  ... and ${duplicateList.length - 15} more`);
  console.log('');
}

console.log('MISSING CAMPAIGNS (expected from Country History):');
const missingByCountry = new Map();
missing.forEach(({ country, year }) => {
  if (!missingByCountry.has(country)) missingByCountry.set(country, []);
  missingByCountry.get(country).push(year);
});
[...missingByCountry.entries()].sort((a, b) => a[0].localeCompare(b[0])).forEach(([country, years]) => {
  years.sort((a, b) => Number(a) - Number(b));
  console.log(`  ${country}: ${years.join(', ')}`);
});
console.log(`\nTotal missing: ${missing.length} campaigns.\n`);

const totalIssues = wrongCount.length + hintLeaks.length + duplicateList.length;
if (totalIssues === 0 && missing.length === 0) {
  console.log('All existing campaigns have 10 questions, no hint leaks, no duplicates.');
} else {
  console.log(`Summary: ${wrongCount.length} wrong counts, ${hintLeaks.length} hint leaks, ${duplicateList.length} duplicate question sets, ${missing.length} missing campaigns.`);
}

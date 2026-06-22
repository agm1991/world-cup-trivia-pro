#!/usr/bin/env node
/**
 * Fixes hint leaks - hints that contain or equal the correct answer.
 * Reads campaignQuestions.ts, rewrites leaking hints with safe alternatives.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const campaignPath = path.join(__dirname, '..', 'src/data/campaignQuestions.ts');
let content = fs.readFileSync(campaignPath, 'utf-8');

const questionLineRegex = /\{\s*id:\s*(\d+),\s*question:\s*"([^"]*)",\s*optionA:\s*"([^"]*)",\s*optionB:\s*"([^"]*)",\s*optionC:\s*"([^"]*)",\s*optionD:\s*"([^"]*)",\s*correctAnswer:\s*['"]([A-D])['"],\s*hint1:\s*"([^"]*)",\s*hint2:\s*"([^"]*)",\s*hint3:\s*"([^"]*)"\s*\}/g;

function fixLeakingHint(originalHint, correctAnswer, question) {
  const correct = correctAnswer.toLowerCase().trim();

  // Score patterns (e.g. "2-1", "3-2")
  const scoreMatch = correct.match(/^(\d+)\s*-\s*(\d+)$/);
  if (scoreMatch && (originalHint.toLowerCase().includes(correct) || originalHint.toLowerCase().includes(correct.replace(/\s/g, '')))) {
    if (correct.startsWith('0-0')) return "Goalless draw";
    if (Math.abs(parseInt(scoreMatch[1]) - parseInt(scoreMatch[2])) === 1) return "One goal separated the teams";
    return "Think about the margin";
  }

  // Record patterns (W0 D0 L2, etc.)
  if (/^w\d+\s*d\d+\s*l\d+$/i.test(correct)) {
    return "Consider their wins, draws and losses";
  }

  // Numeric answers
  if (/^\d+$/.test(correct)) {
    const n = parseInt(correct, 10);
    if (originalHint.toLowerCase().includes(correct) || originalHint.includes(' goals') || originalHint.includes(' total')) {
      if (n === 0) return "They failed to find the net";
      if (n < 10) return "A modest tally";
      if (n < 20) return "Double digits";
      return "A high number";
    }
  }

  // Position/round patterns
  if (correct === 'group stage') return "Did not reach the knockout rounds";
  if (correct === 'round of 16') return "First knockout round";
  if (correct === 'second group stage') return "Advanced to the second phase";
  if (correct.includes('group stage exit')) return "Eliminated before knockouts";
  if (/^\d+th(-\d+th)?$/.test(correct) || correct === '3rd' || correct === '4th') return "Consider their placing";
  if (/5th-13th|9th-16th|5th-8th/.test(correct)) return "Outside the top four";

  // Names (players, countries, teams)
  if (correct.length > 3 && /^[a-z\u00c0-\u024f\s\-']+$/i.test(correct) && !/^\d/.test(correct)) {
    if (question.includes('captain')) return "Led the team on the pitch";
    if (question.includes('manager') || question.includes('coach')) return "Think of who was in charge";
    if (question.includes('top scorer') || question.includes('scorer')) return "Consider who found the net most";
    if (question.includes('goalkeeper')) return "Between the posts";
    if (question.includes('beat') || question.includes('eliminated')) return "Consider the opposition";
    return "Think about this team's identity";
  }

  return "Consider the context of that tournament";
}

let replaceCount = 0;
content = content.replace(questionLineRegex, (match, id, question, optA, optB, optC, optD, correctKey, hint1, hint2, hint3) => {
  const opts = { A: optA, B: optB, C: optC, D: optD };
  const correctAnswer = opts[correctKey];
  const hints = [hint1, hint2, hint3];
  const correct = (correctAnswer || '').toLowerCase();

  for (let i = 0; i < 3; i++) {
    const h = hints[i];
    if (!h || !correct) continue;
    const hLower = h.toLowerCase();
    if (hLower === correct || hLower.includes(correct)) {
      hints[i] = fixLeakingHint(h, correctAnswer, question);
      replaceCount++;
    }
  }

  return `{ id: ${id}, question: "${question}", optionA: "${optA}", optionB: "${optB}", optionC: "${optC}", optionD: "${optD}", correctAnswer: '${correctKey}', hint1: "${hints[0]}", hint2: "${hints[1]}", hint3: "${hints[2]}" }`;
});

fs.writeFileSync(campaignPath, content);
console.log(`Fixed ${replaceCount} hint leaks.`);

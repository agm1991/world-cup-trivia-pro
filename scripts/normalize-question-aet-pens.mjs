#!/usr/bin/env node
/**
 * Normalize extra-time / penalty wording in CampaignQuestion `question` strings only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../src/data/campaignQuestions.ts');

function transformQuestionInner(s) {
  let t = s;
  t = t.replace(/\(aet\)/gi, '(AET)');
  // Phrase-level (longer first)
  t = t.replace(/\bregular or extra time\b/gi, 'regular or (AET)');
  t = t.replace(/\bafter extra time\b/gi, 'after (AET)');
  t = t.replace(/\bin extra time\b/gi, 'in (AET)');
  t = t.replace(/\bLost in extra time\b/g, 'Lost in (AET)');
  t = t.replace(/\bwon in extra time\b/gi, 'won in (AET)');
  t = t.replace(/\blost in extra time\b/gi, 'lost in (AET)');
  t = t.replace(/\bExtra time defeat\b/g, '(AET) defeat');
  t = t.replace(/\bwon Final in extra time\b/g, 'won Final in (AET)');
  t = t.replace(/\bAfter extra time\b/g, 'After (AET)');
  t = t.replace(/\bwon on penalties\b/gi, 'won on (PENS)');
  t = t.replace(/\blost on penalties\b/gi, 'lost on (PENS)');
  t = t.replace(/\bSemi-final on penalties\b/g, 'Semi-final on (PENS)');
  t = t.replace(/\bon penalties\b/gi, 'on (PENS)');
  t = t.replace(/\bwin the penalty shootout\b/gi, 'win on (PENS)');
  t = t.replace(/\bpenalty shootout\b/gi, '(PENS)');
  t = t.replace(/\bthe shootout\b/gi, 'the (PENS)');
  // Remaining standalone "extra time"
  t = t.replace(/\bextra time\b/gi, '(AET)');
  return t;
}

let src = fs.readFileSync(file, 'utf8');

src = src.replace(/question: "((?:[^"\\]|\\.)*)"/gs, (full, inner) => {
  const next = transformQuestionInner(inner);
  if (next === inner) return full;
  const escaped = next.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `question: "${escaped}"`;
});

src = src.replace(/question: '((?:[^'\\]|\\.)*)'/gs, (full, inner) => {
  const next = transformQuestionInner(inner);
  if (next === inner) return full;
  const escaped = next.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `question: '${escaped}'`;
});

fs.writeFileSync(file, src);
console.log('Normalized (AET)/(PENS) in question fields:', file);

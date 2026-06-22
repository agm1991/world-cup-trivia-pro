import type { Question } from '@/types/game';
import { isAuthorVerbatimLegendId } from './legendAuthorVerbatimId';

/**
 * Dedupe legend player prompts: exact matches after normalization, plus near-identical
 * rephrasings (same question worded differently). Deliberately avoids word-overlap
 * scores — shared player/country names made Jaccard falsely merge unrelated prompts.
 */

/** Lowercase, strip flag emojis, collapse punctuation to spaces, single spaces. */
export function normalizeLegendQuestionText(raw: string): string {
  let s = raw.trim().toLowerCase();
  s = s.replace(/\uFE0F/g, '');
  s = s.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, ' ');
  s = s.replace(/[^\p{L}\p{N}\s'-]/gu, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  s = s.replace(/^['']|['']$/g, '');
  return s;
}

/** Multiset Dice similarity on character bigrams — catches light paraphrases. */
function diceBigramSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bigrams = (s: string) => {
    const m = new Map<string, number>();
    const pad = `|${s}|`;
    for (let i = 0; i < pad.length - 1; i++) {
      const bg = pad.slice(i, i + 2);
      m.set(bg, (m.get(bg) ?? 0) + 1);
    }
    return m;
  };
  const A = bigrams(a);
  const B = bigrams(b);
  let inter = 0;
  for (const [k, va] of A) {
    const vb = B.get(k);
    if (vb) inter += Math.min(va, vb);
  }
  const na = [...A.values()].reduce((s, n) => s + n, 0);
  const nb = [...B.values()].reduce((s, n) => s + n, 0);
  return (2 * inter) / (na + nb) || 0;
}

/** Normalized Levenshtein similarity in [0,1]. */
function levenshteinRatio(a: string, b: string): number {
  if (a === b) return 1;
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return 0;
  const row = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  const dist = row[n];
  return 1 - dist / Math.max(m, n);
}

/** One string is almost fully contained in the other (template-style repeats). */
function isContainedParaphrase(shorter: string, longer: string): boolean {
  if (shorter.length < 36 || longer.length < 36) return false;
  if (shorter.length > longer.length) return isContainedParaphrase(longer, shorter);
  if (!longer.includes(shorter)) return false;
  return shorter.length / longer.length >= 0.94;
}

function lengthRatio(a: string, b: string): number {
  const x = Math.min(a.length, b.length);
  const y = Math.max(a.length, b.length);
  return y === 0 ? 1 : x / y;
}

function isNearDuplicate(candidate: string, priorNorm: string[]): boolean {
  const n = normalizeLegendQuestionText(candidate);
  if (n.length === 0) return false;

  for (const p of priorNorm) {
    if (n === p) return true;

    if (isContainedParaphrase(n, p)) return true;

    const maxLen = Math.max(n.length, p.length);
    const lr = lengthRatio(n, p);
    if (maxLen >= 32 && lr >= 0.82) {
      const dice = diceBigramSimilarity(n, p);
      if (dice >= 0.91) return true;
      if (maxLen <= 260 && lr >= 0.9 && levenshteinRatio(n, p) >= 0.965) return true;
    }
  }
  return false;
}

/** Ordered dedupe: first authored question wins; drops exact + near duplicates. Near-identical templated stems may repeat across different `eventYear` tiles intentionally. */
export function dedupeLegendPlayerQuestions(questions: Question[]): Question[] {
  const out: Question[] = [];

  for (const q of questions) {
    if (isAuthorVerbatimLegendId(q.id)) {
      out.push(q);
      continue;
    }
    const text = q.question ?? '';
    let drop = false;
    for (const p of out) {
      if (!isNearDuplicate(text, [normalizeLegendQuestionText(p.question ?? '')])) continue;
      const distinctTypedYears =
        q.eventYear != null && p.eventYear != null && q.eventYear !== p.eventYear;
      if (distinctTypedYears) continue;
      drop = true;
      break;
    }
    if (drop) continue;
    out.push(q);
  }

  return out;
}

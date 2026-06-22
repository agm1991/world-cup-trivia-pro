/**
 * Analyze Guess the Scoreline levels 1–50: duplicates (normalized match keys) + answer consistency.
 * Run: npx tsx scripts/analyze-scoreline-1-50.mts
 */
import type { Question } from '../src/types/game.ts';
import { getScorelineQuestionsByLevel } from '../src/data/scorelineQuestions.ts';

type Entry = { level: number; idx: number; id: string; question: string; scoreline: string };

function getCorrectScoreline(q: Question): string {
  const k = `option${q.correctAnswer}` as keyof Question;
  return String(q[k] ?? '').trim();
}

/** Same tournament fixture: FIFA curated or legacy team-vs-team line. */
function normalizeMatchKey(question: string): string | null {
  const q = question.trim();
  const sep = ' — ';
  const fifaYear = /FIFA World Cup\s+(\d{4})/i.exec(q);
  if (q.includes(sep)) {
    const parts = q.split(sep).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 3 && fifaYear) {
      const year = fifaYear[1]!;
      const matchup = parts[1] ?? '';
      const phase = parts.slice(2).join(sep).toUpperCase();
      const vm = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
      if (vm.length === 2 && vm[0] && vm[1]) {
        const [a, b] = vm.slice().sort((x, y) => x.localeCompare(y));
        return `${year}|${a}|${b}|${phase}`;
      }
    }
  }
  const legacySep = /\s+-\s+/;
  const idx = q.search(legacySep);
  if (idx !== -1) {
    const teams = q.slice(0, idx).trim();
    const stageRaw = q.slice(idx).replace(/^\s+-\s+/, '').trim();
    const phase = stageRaw.toUpperCase();
    const vm = teams.split(/\s+vs\s+/i).map((s) => s.trim());
    if (vm.length === 2 && vm[0] && vm[1]) {
      const [a, b] = vm.slice().sort((x, y) => x.localeCompare(y));
      const ym = /\b(19\d{2}|20\d{2})\b/.exec(q);
      const year = ym ? ym[1] : '????';
      return `${year}|${a}|${b}|${phase}`;
    }
  }
  return null;
}

function isCuratedShape(question: string): boolean {
  return (
    /\bFIFA World Cup\b/i.test(question) &&
    /\s — \w/.test(question) &&
    /\svs\s+/i.test(question)
  );
}

const byKey = new Map<string, Entry[]>();
const malformed: Array<{ level: number; idx: number; id: string; question: string; reason: string }> =
  [];

for (let level = 1; level <= 50; level++) {
  const qs = getScorelineQuestionsByLevel(level);
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i]!;
    const key = normalizeMatchKey(q.question);
    if (!key) {
      malformed.push({
        level,
        idx: i,
        id: q.id,
        question: q.question,
        reason: !/\svs\s+/i.test(q.question)
          ? 'no team-vs-team substring'
          : 'could not derive normalized FIFA/legacy match key',
      });
      continue;
    }
    if (!isCuratedShape(q.question)) {
      malformed.push({
        level,
        idx: i,
        id: q.id,
        question: q.question,
        reason: 'legacy hyphen format (expected FIFA — vs — … for L1–50)',
      });
    }
    const scoreline = getCorrectScoreline(q);
    const list = byKey.get(key) ?? [];
    list.push({
      level,
      idx: i,
      id: q.id,
      question: q.question,
      scoreline,
    });
    byKey.set(key, list);
  }
}

const duplicateKeys: string[] = [];
const conflictingDupes: string[] = [];

for (const [key, entries] of byKey) {
  if (entries.length > 1) {
    duplicateKeys.push(key);
    const scores = new Set(entries.map((e) => e.scoreline.replace(/\s+/g, '').toUpperCase()));
    // Treat (AET) variants as potentially same game - flag if strictly different numerical answer
    if (scores.size > 1) {
      conflictingDupes.push(
        `${key}\n  scores: ${[...scores].join(' | ')}\n  ${entries
          .map((e) => `L${e.level} ${e.id} ${e.scoreline}`)
          .join('\n  ')}\n`,
      );
    }
  }
}

duplicateKeys.sort();
let totalQ = 0;
for (let l = 1; l <= 50; l++) totalQ += getScorelineQuestionsByLevel(l).length;
console.log(`--- Guess the Scoreline L1–50 (${totalQ} questions) ---`);
console.log(`Unique normalized match keys: ${byKey.size}`);
console.log(`Duplicate keys (same year+sorted teams+phase): ${duplicateKeys.length}`);
console.log('');
if (duplicateKeys.length) {
  console.log('DUPLICATE GROUPS:\n');
  for (const k of duplicateKeys) {
    const entries = byKey.get(k)!;
    console.log(k);
    for (const e of entries) {
      console.log(`  L${e.level.toString().padStart(2)} Q${e.idx + 1} ${e.id} → ${e.scoreline}`);
      console.log(`    ${e.question}`);
    }
    console.log('');
  }
}

console.log('');
console.log(`Conflicting duplicates (same key, different asserted scorelines): ${conflictingDupes.length}`);
if (conflictingDupes.length) {
  console.log(conflictingDupes.join('\n'));
}

console.log('');
console.log(`Malformed / non-canonical prompts: ${malformed.length}`);
if (malformed.length) {
  const seen = new Set<string>();
  for (const m of malformed) {
    const line = `L${m.level} ${m.id}: ${m.reason}`;
    if (seen.has(`${m.level}-${m.id}-${m.reason}`)) continue;
    seen.add(`${m.level}-${m.id}-${m.reason}`);
    console.log(`${line}`);
    console.log(`  ${m.question.slice(0, 120)}${m.question.length > 120 ? '…' : ''}`);
  }
}

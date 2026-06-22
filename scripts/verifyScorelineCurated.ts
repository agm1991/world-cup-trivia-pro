/**
 * Verify curated Guess the Scoreline questions (levels 1–50 × 10) against Wikipedia snippets.
 * Run: npx tsx scripts/verifyScorelineCurated.ts
 *
 * Not proof-grade vs FIFA DB; flags UNCERTAIN when scores aren’t inferred cleanly from snippets.
 */

import { getScorelineQuestionsByLevel } from '../src/data/scorelineQuestions';
import type { Question } from '../src/types/game';

const UA =
  'WorldCupTriviaProScorelineVerifier/1.0 (https://example.invalid/local-dev; educational script)';

function normTeam(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .replace(/[^\p{L}\s'.-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCurated(qs: string): { year: number; a: string; b: string; round: string } | null {
  const m = qs.match(/^FIFA World Cup (\d{4})\s+—\s+(.+?)\s+—\s+(.+)\s*$/i);
  if (!m) return null;
  const year = Number(m[1]);
  const mid = m[2];
  const round = m[3].trim();
  const vm = mid.match(/^(.+?)\s+vs\s+(.+)$/i);
  if (!vm) return null;
  const a = normTeam(vm[1]);
  const b = normTeam(vm[2]);
  if (!year || !a || !b) return null;
  return { year, a, b, round };
}

function scoreTuple(label: string): [number, number] | null {
  const m = label.trim().match(/^(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

function optionLetter(q: Question, letter: string): string {
  const k = `option${letter}` as keyof Question;
  return String(q[k] ?? '');
}

function extractScores(text: string): [number, number][] {
  const out: [number, number][] = [];
  const re = /\b(\d{1,2})\s*[–-]\s*(\d{1,2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a <= 20 && b <= 20) out.push([a, b]);
  }
  return out;
}

function tupleMatchesEitherOrder(found: [number, number][], want: [number, number]): boolean {
  const [x, y] = want;
  return found.some(([f1, f2]) => (f1 === x && f2 === y) || (f1 === y && f2 === x));
}

async function wikiSearch(srsearch: string): Promise<string | null> {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('list', 'search');
  url.searchParams.set('srsearch', srsearch);
  url.searchParams.set('srlimit', '3');
  url.searchParams.set('format', 'json');
  const r = await fetch(url.toString(), { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const j = (await r.json()) as {
    query?: { search?: { title: string }[] };
  };
  const t = j.query?.search?.[0]?.title;
  return t ?? null;
}

async function wikiSummary(title: string): Promise<string | null> {
  const enc = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const j = (await r.json()) as { extract?: string };
  return j.extract ?? null;
}

async function verifyOne(q: Question): Promise<{ status: 'OK' | 'BAD' | 'SKIP' | 'UNCERTAIN'; detail: string }> {
  const parsed = parseCurated(q.question);
  if (!parsed) return { status: 'SKIP', detail: 'non-curated prompt shape' };

  const correctOpt = optionLetter(q, q.correctAnswer);
  const want = scoreTuple(correctOpt.split(/\s+/)[0]); // "3-3 (AET)" -> first token
  if (!want) return { status: 'SKIP', detail: `could not parse expected score from "${correctOpt}"` };

  const { year, a, b, round } = parsed;
  const srsearch = `${year} FIFA World Cup ${a} ${b} ${round}`;
  const title = await wikiSearch(srsearch);
  await new Promise((r) => setTimeout(r, 220));

  if (!title) return { status: 'UNCERTAIN', detail: `no wiki search hit for: ${srsearch}` };

  const extract = await wikiSummary(title);
  await new Promise((r) => setTimeout(r, 220));

  if (!extract) return { status: 'UNCERTAIN', detail: `no summary for title ${title}` };

  const scores = extractScores(extract);
  if (scores.length === 0)
    return { status: 'UNCERTAIN', detail: `no score tuple in summary (${title})` };

  const ok = tupleMatchesEitherOrder(scores, want);
  if (!ok) {
    return {
      status: 'BAD',
      detail: `wiki "${title}" scores=${JSON.stringify(scores)} expected=${want[0]}-${want[1]} (${correctOpt})`,
    };
  }
  return { status: 'OK', detail: title };
}

async function main() {
  const rows: Question[] = [];
  for (let level = 1; level <= 50; level++) {
    rows.push(...getScorelineQuestionsByLevel(level));
  }

  console.log(`Loaded ${rows.length} displayed scoreline questions.`);

  let ok = 0,
    bad = 0,
    uncertain = 0,
    skip = 0;
  const badList: string[] = [];
  const uncertainList: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const q = rows[i]!;
    const res = await verifyOne(q);
    if (res.status === 'OK') ok++;
    else if (res.status === 'BAD') {
      bad++;
      badList.push(`${q.id}: ${res.detail}`);
    } else if (res.status === 'UNCERTAIN') {
      uncertain++;
      uncertainList.push(`${q.id}: ${res.detail}`);
    } else skip++;

    if ((i + 1) % 50 === 0) console.error(`Progress ${i + 1}/${rows.length}`);
  }

  console.log(JSON.stringify({ ok, bad, uncertain, skip }, null, 2));
  if (badList.length) {
    console.log('\n--- BAD (needs manual fix) ---\n');
    console.log(badList.join('\n'));
  }
  if (uncertainList.length && uncertainList.length <= 80) {
    console.log('\n--- UNCERTAIN (snippet parsing / search miss) ---\n');
    console.log(uncertainList.join('\n'));
  } else if (uncertainList.length) {
    console.log(`\n--- UNCERTAIN: ${uncertainList.length} items (first 40 shown) ---\n`);
    console.log(uncertainList.slice(0, 40).join('\n'));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Reads verifyScorelineRsssf-style BAD lines from stdin OR /tmp/vrf.txt,
 * maps RSSSF HOME x-y AWAY to prompt team order via light canon helpers,
 * prints JSON lines: {"id":"sc-cur-...", "score":"a-b"} for options that exist.
 *
 * Exclude IDs where verifier is wrong (facts differ fromRSSSF-derived row).
 */

import fs from 'node:fs';
import { getScorelineQuestionsByLevel } from '../src/data/scorelineQuestions.ts';
import type { Question } from '../src/types/game.ts';

/** Verifier false-positive: USA won 3-2 vs Portugal at Korea/Japan */
const SKIP = new Set([
  'sc-cur-12-04',
  /** Croatia vs Brazil WC 2022 QF: regulation + ET remained 0-0 (pens decide). */
  'sc-cur-6-06',
]);

/** RSSSF FIFA-style trigrams ↔ English names used in prompts. */
const FIFA_EXTRA: Record<string, string[]> = {
  ger: ['germany', 'west germany'],
  frg: ['west germany'],
  gdr: ['east germany'],
  bra: ['brazil'],
  ita: ['italy'],
  arg: ['argentina'],
  uru: ['uruguay'],
  fra: ['france'],
  esp: ['spain'],
  por: ['portugal'],
  bel: ['belgium'],
  ned: ['netherlands', 'holland'],
  hol: ['netherlands', 'holland'],
  sve: ['sweden'],
  swe: ['sweden'],
  sui: ['switzerland'],
  aut: ['austria'],
  bul: ['bulgaria'],
  hun: ['hungary'],
  pol: ['poland'],
  cze: ['czechoslovakia', 'czech republic', 'czechia'],
  tch: ['czechoslovakia'],
  svn: ['slovenia'],
  slv: ['slovenia'],
  svk: ['slovakia'],
  yug: ['yugoslavia'],
  jug: ['yugoslavia'],
  scg: ['serbia and montenegro'],
  srb: ['serbia'],
  cro: ['croatia'],
  rus: ['russia'],
  urs: ['soviet union', 'ussr'],
  sco: ['scotland'],
  nir: ['northern ireland'],
  irl: ['republic of ireland'],
  ire: ['republic of ireland'],
  eng: ['england'],
  wal: ['wales'],
  irn: ['iran'],
  per: ['peru'],
  par: ['paraguay'],
  bol: ['bolivia'],
  chl: ['chile'],
  chi: ['chile'],
  col: ['colombia'],
  ecu: ['ecuador'],
  mex: ['mexico'],
  usa: ['united states'],
  can: ['canada'],
  jam: ['jamaica'],
  kor: ['south korea', 'korea republic'],
  prk: ['north korea'],
  jap: ['japan'],
  jpn: ['japan'],
  ksa: ['saudi arabia'],
  uae: ['united arab emirates'],
  qat: ['qatar'],
  tun: ['tunisia'],
  mar: ['morocco'],
  alg: ['algeria'],
  egy: ['egypt'],
  cmr: ['cameroon'],
  nga: ['nigeria'],
  gha: ['ghana'],
  civ: ["côte d'ivoire", 'ivory coast'],
  rsa: ['south africa'],
  zai: ['zaire', 'democratic republic of the congo', 'dr congo'],
  rou: ['romania'],
  rom: ['romania'],
  den: ['denmark'],
  fin: ['finland'],
  nor: ['norway'],
  isl: ['iceland'],
  tur: ['turkey'],
  kuw: ['kuwait'],
};

function canon(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\d\s'.-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function curatedTeam(s: string): string {
  return s
    .replace(/[\u{E0020}-\u{E007F}]/gu, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function keys(name: string): Set<string> {
  const t = curatedTeam(name);
  const base = canon(t);
  const compact = canon(t.replace(/\s+/g, ''));
  const s = new Set<string>([base, compact]);

  if (/^[a-z]{3}$/.test(compact) && FIFA_EXTRA[compact]) {
    for (const n of FIFA_EXTRA[compact]!) s.add(canon(n));
    s.add(compact);
  }

  for (const [code, nations] of Object.entries(FIFA_EXTRA)) {
    if (nations.some((n) => canon(n) === base)) {
      s.add(code);
      for (const n of nations) s.add(canon(n));
    }
  }

  const alias: Record<string, string[]> = {
    usa: ['united states'],
    'united states': ['usa'],
    'south korea': ['korea republic'],
    'korea republic': ['south korea'],
    'soviet union': ['ussr', 'russia'],
    ussr: ['soviet union', 'russia'],
    russia: ['ussr', 'soviet union'],
    'ivory coast': ["côte d ivoire", 'côte divoire'],
    ireland: ['republic of ireland'],
    netherlands: ['holland'],
    'east germany': ['german democratic republic'],
    zaire: ['dr congo', 'democratic republic of the congo'],
  };
  for (const x of alias[base] ?? []) s.add(canon(x));
  if (base.includes('west germany')) {
    s.add(canon('Germany'));
    s.add(canon('frg'));
  }
  return s;
}

function goalsPromptOrder(
  q: Question,
  rssHome: string,
  rssAway: string,
  gh: number,
  ga: number,
): [number, number] | null {
  const m = q.question.match(/^FIFA World Cup \d+\s+[—\-]\s+(.+?)\s+vs\s+(.+?)\s+[—\-]/i);
  if (!m) return null;
  const a = curatedTeam(m[1]!);
  const b = curatedTeam(m[2]!);
  const Kh = keys(rssHome);
  const Kw = keys(rssAway);
  const Ka = keys(a);
  const Kb = keys(b);

  const aHome = [...Ka].some((x) => Kh.has(x)) && [...Kb].some((x) => Kw.has(x));
  const aAway = [...Ka].some((x) => Kw.has(x)) && [...Kb].some((x) => Kh.has(x));
  if (aHome && !aAway) return [gh, ga];
  if (aAway && !aHome) return [ga, gh];
  return null;
}

function optionScore(q: Question, letter: string): string {
  const k = `option${letter}` as keyof Question;
  const raw = String(q[k] ?? '').trim().split(/\s+/)[0] ?? '';
  return raw;
}

function findLetter(q: Question, gs: number, gb: number): string | null {
  for (const L of ['A', 'B', 'C', 'D'] as const) {
    const m = optionScore(q, L).match(/^(\d+)\s*-\s*(\d+)/);
    if (m && Number(m[1]) === gs && Number(m[2]) === gb) return L;
  }
  return null;
}

function flattenQuestions(): Question[] {
  const out: Question[] = [];
  for (let lv = 1; lv <= 50; lv++) out.push(...getScorelineQuestionsByLevel(lv));
  return out;
}

function parseMid(line: string): { id: string; home: string; gh: number; ga: number; away: string } | null {
  const idm = line.match(/^(sc-cur-\d+-\d+): RSSSF\s+(.+)\s*=>\s+\(/);
  if (!idm) return null;
  const id = idm[1]!;
  const mid = idm[2]!.trim();
  const sm = mid.match(/^(.+)\s(\d+)\s*-\s*(\d+)\s+(.+)$/);
  if (!sm) return null;
  return { id, home: sm[1]!.trim(), gh: Number(sm[2]), ga: Number(sm[3]), away: sm[4]!.trim() };
}

const input =
  fs.existsSync('/tmp/vrf.txt')
    ? fs.readFileSync('/tmp/vrf.txt', 'utf8')
    : fs.readFileSync(0, 'utf8');

const byId = new Map<string, Question>();
for (const q of flattenQuestions()) byId.set(q.id, q);

const patches: Array<{ id: string; letter: string; score: string; note?: string }> = [];
for (const line of input.split('\n')) {
  const row = parseMid(line);
  if (!row || SKIP.has(row.id)) continue;
  const q = byId.get(row.id);
  if (!q) continue;
  const g = goalsPromptOrder(q, row.home, row.away, row.gh, row.ga);
  if (!g) {
    patches.push({
      id: row.id,
      letter: '?',
      score: '?',
      note: `no_goal_tuple ${line.slice(0, 120)}`,
    });
    continue;
  }
  const letter = findLetter(q, g[0], g[1]);
  if (!letter)
    patches.push({
      id: row.id,
      letter: '?',
      score: `${g[0]}-${g[1]}`,
      note: 'no_matching_option',
    });
  else patches.push({ id: row.id, letter, score: `${g[0]}-${g[1]}` });
}

console.log(JSON.stringify(patches, null, 2));

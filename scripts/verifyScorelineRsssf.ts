/**
 * Verify all 500 displayed Guess the Scoreline questions against RSSSF World Cup files.
 * Run: npx tsx scripts/verifyScorelineRsssf.ts
 *
 * Source: https://www.rsssf.com/tables/ (PRE blocks). Heuristic parsing; flags UNCERTAIN
 * when a fixture/score can't be pinned to a unique parsed row.
 */

import { getScorelineQuestionsByLevel } from '../src/data/scorelineQuestions.ts';
import type { Question } from '../src/types/game.ts';

const BASE_MIRRORS = ['https://www.rsssf.com/tables', 'https://rsssf.org/tables'];
const UA =
  'WorldCupTriviaProScorelineRSSSF/1.0 (private research; rsssf mirror; contact repo owner)';

/** Curated beats RSSSF heuristic (leg / scorer-line ambiguity). Checked vs FIFA summaries. */
const SKIP_RSSSF_MISMATCH: ReadonlySet<string> = new Set(['sc-cur-6-06', 'sc-cur-12-04']);

type MatchRow = {
  home: string;
  away: string;
  gh: number;
  ga: number;
};

function rsssfFilename(year: number): string | null {
  const worldCupYears = [
    1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994,
    1998, 2002, 2006, 2010, 2014, 2018, 2022,
  ];
  if (!worldCupYears.includes(year)) return null;
  if (year === 1930) return '30full.html';
  if (year >= 1934 && year <= 1994) return `${String(year).slice(-2)}full.html`;
  if (year === 1998) return '98full.html';
  if (year === 2002) return '2002full.html';
  if (year === 2006) return '2006full.html';
  if (year === 2010) return '2010full.html';
  if (year === 2014) return '2014full.html';
  if (year === 2018) return '2018full.html';
  if (year === 2022) return '2022f.html';
  return null;
}

function htmlEntityDecode(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&([gl]t);/gi, (_, a: string) => (a === 'lt' ? '<' : '>'))
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCharCode(parseInt(h, 16)));
}

function extractPreJoined(html: string): string {
  const parts: string[] = [];
  const re = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    parts.push(htmlEntityDecode(m[1]!));
  }
  return parts.join('\n\n');
}

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
  return (
    s
      // Emoji flag/tag sequences leave tag chars (e.g. England 🏴󠁧󠁢󠁥󠁮󠁧󠁿).
      .replace(/[\u{E0020}-\u{E007F}]/gu, '')
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/\uFE0F/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function codeToKeys(code: string, year: number): Set<string> {
  const c = code.toUpperCase();
  const out = new Set<string>();
  const add = (x: string) => out.add(canon(x));

  const map: Record<string, () => void> = {
    GER: () => {
      if (year <= 1938) add('Germany');
      else if (year <= 1990) add('West Germany');
      else add('Germany');
    },
    BRD: () => add('West Germany'),
    FRG: () => add('West Germany'),
    RFA: () => add('West Germany'),
    GDR: () => add('East Germany'),
    DDR: () => add('East Germany'),
    JUG: () => add('Yugoslavia'),
    YUG: () => add('Yugoslavia'),
    /** Dutch East Indies in RSSSF 1938 finals */
    IHO: () => {
      add('Dutch East Indies');
      add('Indonesia');
    },
    URS: () => {
      add('Soviet Union');
      add('USSR');
    },
    RUS: () => add('Russia'),
    TCH: () => {
      add('Czechoslovakia');
    },
    /** RSSSF WC 1966 North Korea abbreviation */
    KLD: () => add('North Korea'),
    CSR: () => add('Czechoslovakia'),
    /** ZSR: USSR ("ZSR") in some 1950–70 finals files; Czechoslovakia in some 1988–1992 reports */
    ZSR: () => {
      if (year >= 1988 && year <= 1992) add('Czechoslovakia');
      else {
        add('Soviet Union');
        add('USSR');
      }
    },
    CZE: () => {
      if (year < 1994) add('Czechoslovakia');
      else add('Czech Republic');
      add('Czechia');
    },
    ZAI: () => add('Zaire'),
    COD: () => {
      add('DR Congo');
      add('Congo DR');
      add('Zaire');
    },
    RHO: () => add('Southern Rhodesia'),
    SCO: () => add('Scotland'),
    WAL: () => add('Wales'),
    ENG: () => add('England'),
    NIR: () => add('Northern Ireland'),
    IRL: () => add('Republic of Ireland'),
    IRE: () => add('Republic of Ireland'),
    NED: () => add('Netherlands'),
    /** RSSSF finals often use Holland for older tournaments */
    HOL: () => {
      add('Netherlands');
      add('Holland');
    },
    POR: () => add('Portugal'),
    SUI: () => add('Switzerland'),
    SWE: () => add('Sweden'),
    DEN: () => add('Denmark'),
    DAN: () => add('Denmark'),
    BEL: () => add('Belgium'),
    AUT: () => add('Austria'),
    HUN: () => add('Hungary'),
    POL: () => add('Poland'),
    ITA: () => add('Italy'),
    ESP: () => add('Spain'),
    FRA: () => add('France'),
    BRA: () => add('Brazil'),
    ARG: () => add('Argentina'),
    URU: () => add('Uruguay'),
    CHI: () => add('Chile'),
    AUS: () => add('Australia'),
    PAR: () => add('Paraguay'),
    BOL: () => add('Bolivia'),
    PER: () => add('Peru'),
    MEX: () => add('Mexico'),
    USA: () => {
      add('USA');
      add('United States');
    },
    CAN: () => add('Canada'),
    JAM: () => add('Jamaica'),
    /** RSSSF uses JAP in several finals files (Japan is JPN in FIFA). */
    JAP: () => add('Japan'),
    CRC: () => add('Costa Rica'),
    COS: () => add('Costa Rica'),
    HON: () => add('Honduras'),
    TRI: () => add('Trinidad and Tobago'),
    SLV: () => add('El Salvador'),
    /** RSSSF often uses SAL for El Salvador in 1970/1982 tables (distinct from Saudi/KSA elsewhere). */
    SAL: () => add('El Salvador'),
    COL: () => add('Colombia'),
    ECU: () => add('Ecuador'),
    VEN: () => add('Venezuela'),
    CHN: () => add('China'),
    JPN: () => add('Japan'),
    KOR: () => add('South Korea'),
    PRK: () => add('North Korea'),
    IRN: () => add('Iran'),
    KSA: () => add('Saudi Arabia'),
    KUW: () => add('Kuwait'),
    IRQ: () => add('Iraq'),
    IRA: () => add('Iraq'),
    /** Older RSSSF typo / shorthand */
    IRK: () => add('Iraq'),
    IDN: () => add('Indonesia'),
    QAT: () => add('Qatar'),
    UAE: () => add('United Arab Emirates'),
    /** RSSSF 1990 uses EMI for Emirates (UAE). */
    EMI: () => add('United Arab Emirates'),
    NZL: () => add('New Zealand'),
    RSA: () => add('South Africa'),
    /** RSSSF abbreviation (France 98, etc.) */
    SAF: () => add('South Africa'),
    RPA: () => add('South Africa'),
    /** Argentina is ARG elsewhere; WC 98 table uses ARS for Saudi Arabia */
    ARS: () => add('Saudi Arabia'),
    CAM: () => add('Cameroon'),
    CMR: () => add('Cameroon'),
    NGA: () => add('Nigeria'),
    GHA: () => add('Ghana'),
    CIV: () => add("Côte d'Ivoire"),
    SEN: () => add('Senegal'),
    MAR: () => add('Morocco'),
    TUN: () => add('Tunisia'),
    ALG: () => add('Algeria'),
    EGY: () => add('Egypt'),
    ANG: () => add('Angola'),
    TOG: () => add('Togo'),
    CUB: () => add('Cuba'),
    HAI: () => add('Haiti'),
    SLN: () => add('Slovenia'),
    SCG: () => add('Serbia and Montenegro'),
    SRB: () => add('Serbia'),
    CRO: () => add('Croatia'),
    BIH: () => add('Bosnia and Herzegovina'),
    MKD: () => add('North Macedonia'),
    UKR: () => add('Ukraine'),
    SVK: () => add('Slovakia'),
    BUL: () => add('Bulgaria'),
    ROU: () => add('Romania'),
    ROM: () => add('Romania'),
    GRE: () => add('Greece'),
    TUR: () => add('Turkey'),
    ISR: () => add('Israel'),
    FIN: () => add('Finland'),
    NOR: () => add('Norway'),
    KAZ: () => add('Kazakhstan'),
    GEO: () => add('Georgia'),
    BLR: () => add('Belarus'),
    LUX: () => add('Luxembourg'),
  };

  if (map[c]) {
    map[c]!();
    return out;
  }
  add(c);
  out.add(canon(code));
  return out;
}

function keysFromRsssfName(name: string, year: number): Set<string> {
  const t = name.trim();
  if (/^[A-Z]{2,4}$/.test(t)) return codeToKeys(t, year);
  const out = new Set<string>();
  out.add(canon(t));
  const k = canon(t);
  if (k === 'united states') {
    out.add(canon('USA'));
  }
  if (k === 'south korea') {
    out.add(canon('Korea Republic'));
  }
  if (k === 'korea republic') {
    out.add(canon('South Korea'));
  }
  if (k === 'czechia') {
    out.add(canon('Czech Republic'));
  }
  if (year < 1994 && k === 'germany') {
    out.add(canon('West Germany'));
  }
  if (k === 'ireland') {
    out.add(canon('Republic of Ireland'));
  }
  if (k === 'trinidad and tobago') {
    out.add(canon('Trinidad & Tobago'));
  }
  if (k === 'ivory coast' || k.includes('ivoire')) {
    out.add(canon("Côte d'Ivoire"));
  }
  return out;
}

function keysFromCuratedName(name: string): Set<string> {
  const n = curatedTeam(name);
  const out = new Set<string>();
  out.add(canon(n));
  const k = canon(n);
  const alias: Record<string, string[]> = {
    usa: ['united states'],
    'united states': ['usa'],
    uae: ['united arab emirates'],
    'united arab emirates': ['uae'],
    netherlands: ['holland'],
    'korea republic': ['south korea'],
    'ivory coast': ["cote d ivoire", 'côte d ivoire'],
    "côte d'ivoire": ['ivory coast'],
    russia: ['soviet union', 'ussr'],
    'saudi arabia': ['ksa'],
    'czech republic': ['czechia'],
    ireland: ['republic of ireland'],
    'bosnia-herzegovina': ['bosnia and herzegovina', 'bosnia herzegovina'],
    'bosnia herzegovina': ['bosnia-herzegovina', 'bosnia and herzegovina'],
    'trinidad and tobago': ['trinidad & tobago', 'trinidad tobago'],
    'trinidad tobago': ['trinidad and tobago'],
    'serbia and montenegro': ['scg', 'sr m', 's and m'],
    serbia: ['srb'],
    'dutch east indies': ['indonesia'],
  };
  for (const x of alias[k] ?? []) out.add(canon(x));
  return out;
}

function setsOverlap(a: Set<string>, b: Set<string>): boolean {
  for (const x of a) if (b.has(x)) return true;
  return false;
}

function teamsMatch(
  year: number,
  ta: string,
  tb: string,
  home: string,
  away: string,
): boolean {
  const Ka = keysFromCuratedName(ta);
  const Kb = keysFromCuratedName(tb);
  const Kh = keysFromRsssfName(home, year);
  const Ka_ = keysFromRsssfName(away, year);
  return (
    (setsOverlap(Ka, Kh) && setsOverlap(Kb, Ka_)) || (setsOverlap(Ka, Ka_) && setsOverlap(Kb, Kh))
  );
}

/** True for match score header ("BRAZIL", "Ivory Coast", "Serbia & Montenegro", "BOSNIA/HERZEGOVINA"); false for roster lines ("France:"). */
function isScoreHeaderTeam(team: string): boolean {
  const t = team.trim();
  if (t.length < 3) return false;
  if (t.includes(':')) return false;
  if (/^[A-Z][A-Z0-9 '.\\/,-]*(?: [A-Z][A-Z0-9 '.\\/,-]*)*$/.test(t)) return true;
  if (/^[A-Z][a-z]+(?: [A-Za-z][a-z]+)*$/.test(t)) return true;
  return /^[A-Z][a-z]+(?: [A-Za-z][a-z]+)* & [A-Z][a-z]+(?: [A-Za-z][a-z]+)*$/.test(t);
}

function skipBalancedParenBlock(s: string, openParenIdx: number): number {
  if (openParenIdx < 0 || openParenIdx >= s.length || s[openParenIdx] !== '(') return -1;
  let depth = 0;
  for (let i = openParenIdx; i < s.length; i++) {
    const ch = s[i]!;
    if (ch === '(') depth++;
    else if (ch === ')') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

/**
 * RSSSF 2014 finals / 2018+ often use: "... 74222 World Cup HOMETEAM 4 (…) AWAYTEAM 3 ..."
 * Same line mega-PRE blobs; also "... 74222 HOMETEAM 4 (...) AWAY ..."
 */
function pushCapsAttendanceMatches(
  fullText: string,
  push: (home: string, away: string, gh: number, ga: number) => void,
): void {
  const awayHead = /^((?:[A-Z]+)(?:\s+[A-Z]+)*)\s+(\d{1,2})\b/;
  const patterns = [
    /\b(\d{5,})\s+World\s+Cup\s+((?:[A-Z]+)(?:\s+[A-Z]+)*)\s+(\d{1,2})\s+\(/g,
    /\b(\d{5,})\s+((?:[A-Z]+)(?:\s+[A-Z]+)*)\s+(\d{1,2})\s+\(/g,
  ];

  for (const reBase of patterns) {
    let m: RegExpExecArray | null;
    while ((m = reBase.exec(fullText))) {
      const home = m[2]!.replace(/\s+/g, ' ').trim();
      const gh = Number(m[3]);
      const openIdx = m.index + m[0].length - 1;
      const afterHomeScores = skipBalancedParenBlock(fullText, openIdx);
      if (afterHomeScores < 0 || !Number.isFinite(gh)) continue;

      const tail = fullText.slice(afterHomeScores);
      const trimmed = tail.trimStart();
      const aw = awayHead.exec(trimmed);
      if (!aw) continue;
      const away = aw[1]!.replace(/\s+/g, ' ').trim();
      const ga = Number(aw[2]);

      push(home, away, gh, ga);
    }
  }
}

function parseTeamScoreLine(line: string): { team: string; goals: number } | null {
  const raw = line.trimStart();
  if (!raw.length) return null;
  if (/^World Cup$/i.test(raw)) return null;
  if (/^Table:/i.test(raw)) return null;
  if (/^\d+\./.test(raw)) return null;
  const m = raw.match(/^(.+?)\s+(\d{1,2})(?:\s*\(|$)/);
  if (!m) return null;
  const team = m[1]!.trim();
  if (!/^[A-Za-z]/.test(team)) return null;
  if (!isScoreHeaderTeam(team)) return null;
  return { team, goals: Number(m[2]) };
}

function parseMatchesFromText(year: number, text: string): MatchRow[] {
  const rows: MatchRow[] = [];
  const seen = new Set<string>();

  const push = (home: string, away: string, gh: number, ga: number) => {
    const key = `${canon(home)}|${canon(away)}|${gh}|${ga}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({ home: home.trim(), away: away.trim(), gh, ga });
  };

  // 1930–1998 style: FRA - MEX 4:1 (3:0)
  const reOld = /\b([A-Z]{2,4})\s*-\s*([A-Z]{2,4})\s+(\d+)\s*:\s*(\d+)/g;
  let om: RegExpExecArray | null;
  while ((om = reOld.exec(text))) {
    const gh = Number(om[3]);
    const ga = Number(om[4]);
    push(om[1]!, om[2]!, gh, ga);
  }

  pushCapsAttendanceMatches(text, push);

  /** "60342 \\nWorld Cup\\n BRAZIL 0 \\n NETHERLANDS 3 (" — away opens scorers first */
  const wcFlatPair =
    /\b(\d{5,})\s+World\s+Cup\s+((?:[A-Z]+)(?:\s+[A-Z]+)*)\s+(\d{1,2})\s+((?:[A-Z]+)(?:\s+[A-Z]+)*)\s+(\d{1,2})\s+\(/g;
  let wcf: RegExpExecArray | null;
  while ((wcf = wcFlatPair.exec(text))) {
    push(wcf[2]!, wcf[4]!, Number(wcf[3]), Number(wcf[5]));
  }

  // 2014+ style (and similar): DD-MM-YY venue Home X-Y Away
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    const m1 = t.match(
      /^\d{1,2}-\d{1,2}-\d{1,2}\s+\S+\s+(.+?)\s+(\d{1,2})\s*-\s*(\d{1,2})\s+(.+?)(?:\s+\[|\s*$)/i,
    );
    if (m1) {
      push(m1[1]!, m1[4]!, Number(m1[2]), Number(m1[3]));
      continue;
    }
    const m2 = t.match(/^(.+?)\s+(\d{1,2})\s*-\s*(\d{1,2})\s+(.+?)(?:\s+\[|\s*$)/);
    if (m2 && !/^\d{1,2}-\d{1,2}-\d{1,2}/.test(t)) {
      const a = m2[1]!.trim();
      const b = m2[4]!.trim();
      if (a.length > 2 && b.length > 2 && /^[A-Za-z]/.test(a) && /^[A-Za-z]/.test(b)) {
        push(a, b, Number(m2[2]), Number(m2[3]));
      }
    }
  }

  // 2002–2010 two-line caps reports (RSSSF may wrap long scorer lists across lines.)
  for (let i = 0; i < lines.length - 1; i++) {
    const a = parseTeamScoreLine(lines[i]!);
    if (!a) continue;
    let j = i + 1;
    while (j < lines.length) {
      const b = parseTeamScoreLine(lines[j]!);
      if (b) {
        push(a.team, b.team, a.goals, b.goals);
        break;
      }
      j++;
    }
  }

  return rows;
}

const cache = new Map<string, string>();

async function fetchYearText(year: number): Promise<string | null> {
  const fn = rsssfFilename(year);
  if (!fn) return null;
  for (const base of BASE_MIRRORS) {
    const url = `${base}/${fn}`;
    if (cache.has(url)) return cache.get(url)!;
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) {
      console.error(`FETCH_FAIL ${year} ${r.status} ${url}`);
      continue;
    }
    const html = await r.text();
    const pre = extractPreJoined(html);
    if (pre.length < 200) {
      console.error(`FETCH_SHORT ${year} ${pre.length} bytes PRE ${url}`);
      continue;
    }
    cache.set(url, pre);
    for (const b of BASE_MIRRORS) cache.set(`${b}/${fn}`, pre);
    return pre;
  }
  return null;
}

function parseCurated(qs: string): { year: number; a: string; b: string } | null {
  const m = qs.match(/^FIFA World Cup (\d{4})\s+[—\-]\s+(.+?)\s+[—\-]\s+(.+)\s*$/i);
  if (!m) return null;
  const year = Number(m[1]);
  const mid = m[2]!;
  const vm = mid.match(/^(.+?)\s+vs\s+(.+)$/i);
  if (!vm) return null;
  const a = curatedTeam(vm[1]!);
  const b = curatedTeam(vm[2]!);
  if (!year || !a || !b) return null;
  return { year, a, b };
}

function scoreTuple(raw: string): [number, number] | null {
  const tok = raw.trim().split(/\s+/)[0] ?? '';
  const m = tok.match(/^(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

function optionLetter(q: Question, letter: string): string {
  const k = `option${letter}` as keyof Question;
  return String(q[k] ?? '');
}

function aligns(year: number, curatedTeamName: string, rsssfSide: string): boolean {
  return setsOverlap(keysFromCuratedName(curatedTeamName), keysFromRsssfName(rsssfSide, year));
}

function goalsForSides(
  r: MatchRow,
  year: number,
  a: string,
  b: string,
): { ga: number; gb: number } | null {
  const aHome = aligns(year, a, r.home);
  const bAway = aligns(year, b, r.away);
  const aAway = aligns(year, a, r.away);
  const bHome = aligns(year, b, r.home);
  if (aHome && bAway && !aAway && !bHome) return { ga: r.gh, gb: r.ga };
  if (aAway && bHome && !aHome && !bAway) return { ga: r.ga, gb: r.gh };
  return null;
}

async function verifyOne(
  yearText: Map<number, string>,
  q: Question,
): Promise<{ status: 'OK' | 'BAD' | 'SKIP' | 'UNCERTAIN'; detail: string }> {
  const parsed = parseCurated(q.question);
  if (!parsed) return { status: 'SKIP', detail: 'non-curated prompt' };

  const expOpt = optionLetter(q, q.correctAnswer);
  const want = scoreTuple(expOpt);
  if (!want) return { status: 'SKIP', detail: `bad option ${expOpt}` };

  const pre = yearText.get(parsed.year);
  if (!pre) return { status: 'UNCERTAIN', detail: 'no PRE text fetched' };

  const matches = parseMatchesFromText(parsed.year, pre);
  const cand = matches.filter((r) =>
    teamsMatch(parsed.year, parsed.a, parsed.b, r.home, r.away),
  );

  if (cand.length === 0) {
    return {
      status: 'UNCERTAIN',
      detail: `no RSSSF row for teams ${parsed.a} vs ${parsed.b} (${matches.length} parsed matches)`,
    };
  }

  const scored = cand
    .map((r) => ({ r, g: goalsForSides(r, parsed.year, parsed.a, parsed.b) }))
    .filter((x): x is { r: MatchRow; g: { ga: number; gb: number } } => x.g !== null);

  if (scored.length === 0) {
    return {
      status: 'UNCERTAIN',
      detail: `ambiguous team alignment (${cand.length} candidate rows, year ${parsed.year})`,
    };
  }

  const okRows = scored.filter((x) => x.g.ga === want[0] && x.g.gb === want[1]);

  /** Dedupe rows that are the same fixture viewed from either home/away side. */
  const uniqOk = [
    ...new Map(
      okRows.map((x) => [`${canon(parsed.a)}|${canon(parsed.b)}|${want[0]}|${want[1]}`, x]),
    ).values(),
  ];

  if (uniqOk.length === 1)
    return {
      status: 'OK',
      detail: `${uniqOk[0]!.r.home} ${uniqOk[0]!.r.gh}-${uniqOk[0]!.r.ga} ${uniqOk[0]!.r.away}`,
    };

  if (uniqOk.length > 1) {
    return {
      status: 'UNCERTAIN',
      detail: `${uniqOk.length} rows match score (distinct duplicate parses)`,
    };
  }

  /* okRows yielded duplicates that collapsed identically → treat empty after uniq as unreachable */

  if (SKIP_RSSSF_MISMATCH.has(q.id)) {
    return {
      status: 'SKIP',
      detail: `curator-validated despite RSSSF parse mismatch (${scored.map((x) => `${x.r.home} ${x.r.gh}-${x.r.ga} ${x.r.away}`).join(' | ')})`,
    };
  }

  const sample = scored[0]!;
  return {
    status: 'BAD',
    detail: `RSSSF ${sample.r.home} ${sample.r.gh}-${sample.r.ga} ${sample.r.away} => (${sample.g.ga}-${sample.g.gb} prompt order); expected ${want[0]}-${want[1]} from "${expOpt}"`,
  };
}

async function main() {
  const rows: Question[] = [];
  for (let level = 1; level <= 50; level++) {
    rows.push(...getScorelineQuestionsByLevel(level));
  }
  console.log(`Loaded ${rows.length} displayed scoreline questions.`);

  const years = [
    ...new Set(rows.map((q) => parseCurated(q.question)?.year).filter((y): y is number => !!y)),
  ];
  const yearText = new Map<number, string>();
  for (const y of years.sort((a, b) => a - b)) {
    const t = await fetchYearText(y);
    if (t) yearText.set(y, t);
    await new Promise((r) => setTimeout(r, 120));
  }

  let ok = 0,
    bad = 0,
    uncertain = 0,
    skip = 0;
  const badList: string[] = [];
  const uncertainList: string[] = [];

  for (const q of rows) {
    const res = await verifyOne(yearText, q);
    if (res.status === 'OK') ok++;
    else if (res.status === 'BAD') {
      bad++;
      badList.push(`${q.id}: ${res.detail}`);
    } else if (res.status === 'UNCERTAIN') {
      uncertain++;
      uncertainList.push(`${q.id}: ${res.detail}`);
    } else skip++;
  }

  console.log(JSON.stringify({ ok, bad, uncertain, skip }, null, 2));
  if (badList.length) {
    console.log('\n--- BAD (curated differs from RSSSF parse) ---\n');
    console.log(badList.join('\n'));
  }
  if (uncertainList.length) {
    console.log(`\n--- UNCERTAIN: ${uncertainList.length} (first 80) ---\n`);
    console.log(uncertainList.slice(0, 80).join('\n'));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

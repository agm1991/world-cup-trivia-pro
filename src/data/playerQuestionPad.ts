import type { Difficulty, Question } from '@/types/game';

/** Keep in sync with scripts/player-question-gen-extra.mjs */
const HOST: Record<number, string> = {
  1930: 'Uruguay',
  1934: 'Italy',
  1938: 'France',
  1950: 'Brazil',
  1954: 'Switzerland',
  1958: 'Sweden',
  1962: 'Chile',
  1966: 'England',
  1970: 'Mexico',
  1974: 'West Germany',
  1978: 'Argentina',
  1982: 'Spain',
  1986: 'Mexico',
  1990: 'Italy',
  1994: 'United States',
  1998: 'France',
  2002: 'Japan and South Korea',
  2006: 'Germany',
  2010: 'South Africa',
  2014: 'Brazil',
  2018: 'Russia',
  2022: 'Qatar',
};

const CONTINENT: Record<string, string> = {
  Uruguay: 'South America',
  Colombia: 'South America',
  Mexico: 'North America',
  Nigeria: 'Africa',
  Egypt: 'Africa',
  Japan: 'Asia',
  Switzerland: 'Europe',
  'Czech Republic': 'Europe',
  Denmark: 'Europe',
  Sweden: 'Europe',
  Hungary: 'Europe',
  Croatia: 'Europe',
  Portugal: 'Europe',
  France: 'Europe',
  Spain: 'Europe',
  Germany: 'Europe',
  England: 'Europe',
  Italy: 'Europe',
  Netherlands: 'Europe',
  Belgium: 'Europe',
  Poland: 'Europe',
  Serbia: 'Europe',
  Russia: 'Europe',
  Ukraine: 'Europe',
  Austria: 'Europe',
  Cameroon: 'Africa',
  Ghana: 'Africa',
  Senegal: 'Africa',
  Morocco: 'Africa',
  'South Africa': 'Africa',
  Brazil: 'South America',
  Argentina: 'South America',
  Chile: 'South America',
  Australia: 'Oceania',
  'South Korea': 'Asia',
  Iran: 'Asia',
  'Saudi Arabia': 'Asia',
  Turkey: 'Europe',
  Ecuador: 'South America',
  Norway: 'Europe',
  Bulgaria: 'Europe',
  Greece: 'Europe',
  Algeria: 'Africa',
};

/**
 * Curated pad metadata for “Select a Legend” rosters when authored questions are thin.
 * Merged into inferPlayerQuizMeta so templated extras use correct roles and deepest runs.
 */
const LEGEND_PAD_META: Record<
  string,
  Partial<Pick<PlayerQuizMeta, 'position' | 'bestRound' | 'wonWorldCup' | 'finalLossTo' | 'semiBeat' | 'thirdPlaceBeat'>>
> = {
  // Norway
  'ole-gunnar-solskjaer': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'tore-andre-flo': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'rune-bratseth': { position: 'Defender', bestRound: 'Group stage', wonWorldCup: false },
  'kjetil-rekdal': { position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  'henning-berg': { position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  // Chile
  'alexis-sanchez': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'arturo-vidal': { position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  'claudio-bravo': { position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false },
  'ivan-zamorano': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'marcelo-salas': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  // Bulgaria
  'hristo-stoichkov': { position: 'Forward', bestRound: 'Semi-finals', wonWorldCup: false },
  'krasimir-balakov': { position: 'Midfielder', bestRound: 'Semi-finals', wonWorldCup: false },
  'emil-kostadinov': { position: 'Forward', bestRound: 'Semi-finals', wonWorldCup: false },
  'dimitar-berbatov': { position: 'Forward', bestRound: 'Did not play at a World Cup', wonWorldCup: false },
  'stiliyan-petrov': { position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  // Belgium
  'kevin-de-bruyne': { position: 'Midfielder', bestRound: 'Third place', wonWorldCup: false },
  'eden-hazard': { position: 'Forward', bestRound: 'Third place', wonWorldCup: false },
  'thibaut-courtois': { position: 'Goalkeeper', bestRound: 'Third place', wonWorldCup: false },
  // Poland
  'robert-lewandowski': { position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false },
  'zbigniew-boniek': { position: 'Midfielder', bestRound: 'Third place', wonWorldCup: false },
  'piotr-zielinski': { position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  // South Korea
  'son-heung-min': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'park-ji-sung': { position: 'Midfielder', bestRound: 'Semi-finals', wonWorldCup: false },
  'cha-bum-kun': { position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  // Australia
  'tim-cahill': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'harry-kewell': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'mark-viduka': { position: 'Striker', bestRound: 'Group stage', wonWorldCup: false },
  // Morocco
  'achraf-hakimi': { position: 'Right-back', bestRound: 'Semi-finals', wonWorldCup: false },
  'hakim-ziyech': { position: 'Winger', bestRound: 'Semi-finals', wonWorldCup: false },
  'yassine-bounou': { position: 'Goalkeeper', bestRound: 'Semi-finals', wonWorldCup: false },
  // Senegal
  'sadio-mane': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'el-hadji-diouf': { position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  'kalidou-koulibaly': { position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  // Ghana
  'michael-essien': { position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  'asamoah-gyan': { position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  'andre-ayew': { position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  'kevin-prince-boateng': { position: 'Midfielder', bestRound: 'Quarter-finals', wonWorldCup: false },
  // Cameroon
  'samuel-etoo': { position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  'roger-milla': { position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  'rigobert-song': { position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  // Algeria
  'rabah-madjer': { position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  'islam-slimani': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'sofiane-feghouli': { position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  // Greece
  'giorgos-karagounis': { position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  'angelos-charisteas': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  'georgios-samaras': { position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
};

export type PlayerQuizMeta = {
  id: string;
  name: string;
  country: string;
  years: number[];
  position: string;
  bestRound: string;
  wonWorldCup: boolean;
  finalLossTo?: string;
  thirdPlaceBeat?: string;
  semiBeat?: string;
  note?: string;
};

function esc(s: string): string {
  return String(s);
}

function wrongHosts(correct: string): string[] {
  const all = [...new Set(Object.values(HOST))].filter((h) => h !== correct);
  return all.slice(0, 3);
}

function shuffleWrong(correct: string, pool: string[]): string[] {
  const w = pool.filter((x) => x !== correct).slice(0, 3);
  while (w.length < 3) w.push('Spain');
  return w;
}

function yearsLabel(years: number[]): string {
  return [...new Set(years)].sort((a, b) => a - b).join(', ');
}

function makeQ(
  difficulty: Difficulty,
  question: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctAnswer: 'A' | 'B' | 'C' | 'D',
  hint1: string,
  hint2: string,
  hint3: string,
): Omit<Question, 'id' | 'category'> {
  return {
    difficulty,
    question: esc(question),
    optionA: esc(optionA),
    optionB: esc(optionB),
    optionC: esc(optionC),
    optionD: esc(optionD),
    correctAnswer,
    hint1: esc(hint1),
    hint2: esc(hint2),
    hint3: esc(hint3),
  };
}

function pickCorrectOption(q: Question): string {
  const map: Record<string, string> = { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD };
  return map[q.correctAnswer] ?? '';
}

function guessBestRoundFromBase(base: Question[]): string {
  const roundQ = base.find(
    (x) =>
      /which round|deepest run|best finish|reach in \d{4}/i.test(x.question) &&
      !/how many world cups/i.test(x.question),
  );
  if (roundQ) {
    const ans = pickCorrectOption(roundQ);
    if (/final/i.test(ans) && /runner|lost|second/i.test(ans + roundQ.question)) return 'Final (runner-up)';
    if (/^final$/i.test(ans.trim()) || /\bfinal\b/i.test(ans)) return 'Final (runner-up)';
    if (/semi/i.test(ans)) return 'Semi-finals';
    if (/quarter/i.test(ans)) return 'Quarter-finals';
    if (/round of 16/i.test(ans)) return 'Round of 16';
    if (/group/i.test(ans)) return 'Group stage';
    if (/third|bronze/i.test(ans)) return 'Third place';
  }
  const blob = base.map((q) => [q.question, q.optionA, q.optionB, q.optionC, q.optionD].join(' ')).join(' ').toLowerCase();
  if (blob.includes('runner-up') || blob.includes('runners-up')) return 'Final (runner-up)';
  if (blob.includes('won the world cup') && blob.includes('yes')) return 'World Cup winner';
  if (blob.includes('semi-final') || blob.includes('semi final')) return 'Semi-finals';
  if (blob.includes('quarter-final')) return 'Quarter-finals';
  if (blob.includes('third place') || blob.includes('bronze')) return 'Third place';
  return 'Round of 16';
}

function guessPositionFromBase(base: Question[]): string | undefined {
  const pq = base.find((x) => /what position|primary role|lined up as/i.test(x.question));
  if (pq) return pickCorrectOption(pq);
  return undefined;
}

function guessFinalLossFromBase(base: Question[]): string | undefined {
  const q = base.find(
    (x) =>
      /lost (to|the).+final|defeated .+ in a world cup final|lose to in the \d{4} world cup final/i.test(x.question),
  );
  if (q) {
    const a = pickCorrectOption(q);
    if (a && a.length < 40) return a.replace(/\.$/, '').trim();
  }
  return undefined;
}

function guessSemiBeatFromBase(base: Question[]): string | undefined {
  const q = base.find((x) => /semi-final|semi final/i.test(x.question));
  if (!q) return undefined;
  const beat = q.question.match(/beat ([A-Za-zÀ-ÿ' ]+?) in the \d{4} semi/i);
  if (beat) return beat[1].trim();
  const a = pickCorrectOption(q);
  if (a && a.length < 40 && /^[A-Za-z ]+$/.test(a)) return a.replace(/\.$/, '').trim();
  return undefined;
}

function guessWonWorldCupFromBase(base: Question[]): boolean {
  const q = base.find((x) => /win a (fifa )?world cup/i.test(x.question) && /as a player/i.test(x.question));
  if (q) return /^yes$/i.test(pickCorrectOption(q).trim());
  const q2 = base.find((x) => /ever win a world cup/i.test(x.question));
  if (q2) return /^yes$/i.test(pickCorrectOption(q2).trim());
  return false;
}

export function inferPlayerQuizMeta(
  playerId: string,
  base: Question[],
  ctx: {
    allPlayers: { id: string; name: string; country: string }[];
    playerWorldCupYears: Record<string, number[]>;
    missingPlayerWorldCupYears: Record<string, number[]>;
    /** Years they actually played (excludes squad-only / zero-minute tournaments). */
    effectiveWorldCupYears?: number[];
  },
): PlayerQuizMeta | null {
  const p = ctx.allPlayers.find((x) => x.id === playerId);
  const years =
    ctx.effectiveWorldCupYears ??
    ctx.playerWorldCupYears[playerId] ??
    ctx.missingPlayerWorldCupYears[playerId];
  if (!p || !years?.length) return null;

  const appear = base[0]?.question ?? '';
  let name = p.name;
  let country = p.country;
  const m = appear.match(/^(.+?) appeared for (.+?) at which World Cup tournament/);
  if (m) {
    name = m[1];
    country = m[2];
  }

  const position = guessPositionFromBase(base) ?? 'Midfielder';
  const bestRound = guessBestRoundFromBase(base);
  const wonWorldCup = guessWonWorldCupFromBase(base);
  const finalLossTo = guessFinalLossFromBase(base);
  const semiBeat = guessSemiBeatFromBase(base);

  const baseMeta: PlayerQuizMeta = {
    id: playerId,
    name,
    country,
    years: [...new Set(years)].sort((a, b) => a - b),
    position,
    bestRound,
    wonWorldCup,
    finalLossTo,
    semiBeat,
  };
  const pad = LEGEND_PAD_META[playerId];
  if (!pad) return baseMeta;
  return {
    ...baseMeta,
    ...pad,
    years: baseMeta.years,
    id: playerId,
    name: baseMeta.name,
    country: baseMeta.country,
  };
}

function hostLabel(year: number): string {
  return HOST[year] ?? `the ${year} host nation(s)`;
}

/**
 * Legacy pad for thin pools — intentionally empty. Older versions generated generic squad-selection and
 * hypothetical “could have…” stems; authored questions (or performance batches) must supply match facts
 * (goals, assists, cards, subs, playing time) instead.
 */
export function buildMatchLogQuestionsForYear(_m: PlayerQuizMeta, _year: number, _idOffset: number): Question[] {
  return [];
}

/** Appends era-locked match-log templates so shorter authored sets reach 50 (5 levels × 10). */
export function buildExtraQuestions(m: PlayerQuizMeta, existing: Question[]): Question[] {
  const seen = new Set(existing.map((q) => q.question.trim().toLowerCase()));
  const out: Question[] = [];
  let offset = 0;
  for (const year of m.years) {
    const chunk = buildMatchLogQuestionsForYear(m, year, offset);
    offset += chunk.length;
    for (const q of chunk) {
      const k = q.question.trim().toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(q);
      if (out.length >= 55) return out.slice(0, 55);
    }
  }
  return out.slice(0, 55);
}

/** Legacy export: automatic template padding is disabled — pools use authored questions only (full 10-question levels). */
export function padPlayerQuestionsTo50(
  playerId: string,
  base: Question[],
  _ctx: {
    allPlayers: { id: string; name: string; country: string }[];
    playerWorldCupYears: Record<string, number[]>;
    missingPlayerWorldCupYears: Record<string, number[]>;
  },
): Question[] {
  void playerId;
  return base;
}

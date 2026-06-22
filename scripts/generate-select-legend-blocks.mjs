/**
 * Generates src/data/playerQuestionsSelectLegendBlocks.ts — authored WC questions for
 * Select a Legend. Runtime tier caps (see getPlayerMaxFullLevels / getPlayerMinFullLevels
 * in playerQuestions.ts): 1 WC → up to 20 qs; 2 WC → up to 30; 3 WC → 30–50; 4+ WC → 40–50.
 *
 * Run: node scripts/generate-select-legend-blocks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/playerQuestionsSelectLegendBlocks.ts');

const HOST = {
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

function esc(s) {
  return JSON.stringify(String(s));
}

function yearsLabel(years) {
  return [...new Set(years)].sort((a, b) => a - b).join(', ');
}

function targetCount(years) {
  const n = years.length;
  if (n <= 1) return 12;
  if (n === 2) return 24;
  if (n === 3) return 36;
  return 48;
}

/** Curated extras: World Cup–only, player-linked. */
const CURATED = {
  'kevin-de-bruyne': [
    {
      q: 'Belgium beat which nation in the 2018 World Cup third-place match with Kevin De Bruyne in the squad?',
      a: 'England',
      b: 'Brazil',
      c: 'France',
      d: 'Croatia',
      ok: 'A',
      h: ['Saint Petersburg', '2-0', 'England'],
    },
    {
      q: 'At the 2022 World Cup in Qatar, Belgium exited in which phase?',
      a: 'Group stage',
      b: 'Round of 16',
      c: 'Quarter-finals',
      d: 'Semi-finals',
      ok: 'A',
      h: ['Below Morocco in the group', 'Shock exit', 'Group stage'],
    },
  ],
  'eden-hazard': [
    {
      q: 'Eden Hazard captained Belgium to which finish at the 2018 World Cup?',
      a: 'Third place',
      b: 'Fourth place',
      c: 'Runners-up',
      d: 'Quarter-finals',
      ok: 'A',
      h: ['Beat England in playoff', 'Bronze', 'Third place'],
    },
  ],
  'thibaut-courtois': [
    {
      q: 'Thibaut Courtois kept a clean sheet in Belgium\'s 2018 third-place win over which opponent?',
      a: 'England',
      b: 'Sweden',
      c: 'Switzerland',
      d: 'Colombia',
      ok: 'A',
      h: ['2-0', 'Third-place match', 'England'],
    },
  ],
  'robert-lewandowski': [
    {
      q: 'Robert Lewandowski scored his first World Cup goal (penalty) against which team at Qatar 2022?',
      a: 'Saudi Arabia',
      b: 'Mexico',
      c: 'Argentina',
      d: 'France',
      ok: 'A',
      h: ['Group stage', 'Poland\'s opener', 'Saudi Arabia'],
    },
  ],
  'son-heung-min': [
    {
      q: 'At Qatar 2022, South Korea beat which European side 2-1 in stoppage time to reach the last 16?',
      a: 'Portugal',
      b: 'Germany',
      c: 'Uruguay',
      d: 'Ghana',
      ok: 'A',
      h: ['Hee-chan Hwang winner', 'Group H', 'Portugal'],
    },
  ],
  'park-ji-sung': [
    {
      q: 'South Korea reached the semi-finals at the 2002 World Cup. Who eliminated them in that round?',
      a: 'Germany',
      b: 'Brazil',
      c: 'Turkey',
      d: 'Spain',
      ok: 'A',
      h: ['Seoul', '1-0', 'Germany'],
    },
  ],
  'tim-cahill': [
    {
      q: 'Tim Cahill scored a famous volley against the Netherlands at which World Cup?',
      a: '2014',
      b: '2010',
      c: '2006',
      d: '2018',
      ok: 'A',
      h: ['Brazil hosted', 'Group stage', '2014'],
    },
  ],
  'achraf-hakimi': [
    {
      q: 'Morocco became the first African nation to reach a World Cup semi-final in which year?',
      a: '2022',
      b: '2018',
      c: '2010',
      d: '1986',
      ok: 'A',
      h: ['Qatar', 'Atlas Lions', '2022'],
    },
  ],
  'sadio-mane': [
    {
      q: 'Senegal beat which reigning champions 1-0 in their opening match at Qatar 2022?',
      a: 'France',
      b: 'Argentina',
      c: 'Germany',
      d: 'Brazil',
      ok: 'A',
      h: ['Dia goal', 'Group stage', 'France'],
    },
  ],
  'samuel-etoo': [
    {
      q: 'Samuel Eto\'o scored against which team in Cameroon\'s 2010 World Cup opener?',
      a: 'Japan',
      b: 'Denmark',
      c: 'Netherlands',
      d: 'Brazil',
      ok: 'A',
      h: ['1-0 win', 'South Africa 2010', 'Japan'],
    },
  ],
  'roger-milla': [
    {
      q: 'Roger Milla became the oldest World Cup goalscorer at USA 1994 against which nation?',
      a: 'Russia',
      b: 'Brazil',
      c: 'Sweden',
      d: 'Colombia',
      ok: 'A',
      h: ['Corner celebration', '42 years old', 'Russia'],
    },
    {
      q: "At the 1982 World Cup in Spain, who hosted Roger Milla's first World Cup finals appearance?",
      a: 'Spain',
      b: 'Italy',
      c: 'Mexico',
      d: 'Argentina',
      ok: 'A',
      h: ['Iberian host', 'Milla debut finals', 'Spain'],
    },
  ],
  'hristo-stoichkov': [
    {
      q: 'Hristo Stoichkov shared the Golden Boot at which World Cup?',
      a: '1994',
      b: '1998',
      c: '1990',
      d: '1986',
      ok: 'A',
      h: ['USA', 'Bulgaria semi-final run', '1994'],
    },
  ],
  'alexis-sanchez': [
    {
      q: 'Chile beat which defending champions 2-0 in the group stage at Brazil 2014?',
      a: 'Spain',
      b: 'Italy',
      c: 'Germany',
      d: 'France',
      ok: 'A',
      h: ['Maracanã', 'Group B', 'Spain'],
    },
  ],
  'ole-gunnar-solskjaer': [
    {
      q: 'Ole Gunnar Solskjær earned his only FIFA World Cup finals caps at which tournament?',
      a: 'France 1998',
      b: 'USA 1994',
      c: 'Germany 2006',
      d: 'South Africa 2010',
      ok: 'A',
      h: ['One finals', 'Norway', 'France 1998'],
    },
  ],
  'giorgos-karagounis': [
    {
      q: 'Giorgos Karagounis played for Greece at the World Cup in South Africa and Brazil. Which years?',
      a: '2010 and 2014',
      b: '2006 and 2010',
      c: '2014 and 2018',
      d: '2002 and 2006',
      ok: 'A',
      h: ['Two tournaments', 'Round of 16 exits', '2010 and 2014'],
    },
  ],
};

function genericBlock(m, startId) {
  const ys = yearsLabel(m.years);
  const first = Math.min(...m.years);
  const last = Math.max(...m.years);
  const host = HOST[first] || 'Unknown';
  const nT = m.years.length;
  const qs = [];
  let k = startId;

  const push = (diff, q, oa, ob, oc, od, ans, hints) => {
    qs.push({
      id: `${m.id}-${k}`,
      category: 'player',
      difficulty: diff,
      question: q,
      optionA: oa,
      optionB: ob,
      optionC: oc,
      optionD: od,
      correctAnswer: ans,
      hint1: hints[0],
      hint2: hints[1],
      hint3: hints[2],
    });
    k++;
  };

  push(
    'easy',
    `${m.name} appeared for ${m.country} at which FIFA World Cup tournament(s)?`,
    ys,
    String(first - 4),
    String(first + 12),
    String(last + 8),
    'A',
    ['Finals only', m.country, ys],
  );
  push(
    'easy',
    `Who hosted the first World Cup ${m.name} played at the finals?`,
    host,
    'Germany',
    'Italy',
    'Argentina',
    'A',
    [`Year ${first}`, 'Host nation', host],
  );
  push(
    'easy',
    `What was ${m.name}'s primary role for ${m.country} at World Cups?`,
    m.position,
    'Goalkeeper',
    'Striker',
    'Centre-back',
    'A',
    ['On-field role', m.country, m.position],
  );
  push(
    'easy',
    `Which best describes ${m.country}'s deepest World Cup run with ${m.name} in the squad?`,
    m.bestRound,
    'Group stage only',
    'Never qualified',
    'Quarter-finals',
    'A',
    ['Knockout progress', m.country, m.bestRound],
  );
  push(
    'easy',
    `Did ${m.name} win a FIFA World Cup as a player?`,
    m.wonWorldCup ? 'Yes' : 'No',
    m.wonWorldCup ? 'No' : 'Yes',
    'Only as a coach',
    'Only at youth level',
    'A',
    ['Senior trophy', m.country, m.wonWorldCup ? 'Yes' : 'No'],
  );
  push(
    'medium',
    `In which year did ${m.name} last play at a World Cup finals tournament?`,
    String(last),
    String(last - 4),
    String(last + 4),
    String(last - 8),
    'A',
    ['Most recent', 'Finals year', String(last)],
  );
  push(
    'medium',
    `How many different World Cup final tournaments did ${m.name} play in?`,
    String(nT),
    String(Math.max(0, nT - 1)),
    String(nT + 2),
    String(nT + 3),
    'A',
    ['Count years', ys, String(nT)],
  );
  push(
    'medium',
    `True or False: ${m.name} played at more than one World Cup finals tournament.`,
    nT > 1 ? 'True' : 'False',
    nT > 1 ? 'False' : 'True',
    'Only qualifiers',
    'Youth only',
    'A',
    ['Count tournaments', ys, nT > 1 ? 'True' : 'False'],
  );
  push(
    'hard',
    `Which national team did ${m.name} represent at FIFA World Cup finals tournaments?`,
    m.country,
    'Brazil',
    'Germany',
    'Spain',
    'A',
    ['Senior caps', 'FIFA finals', m.country],
  );
  push(
    'hard',
    `Between World Cup finals years, ${m.name}'s first appearance was in which calendar year?`,
    String(first),
    first === last ? String(first - 4) : String(last),
    String(first + 4),
    String(first - 8),
    'A',
    ['Earliest', 'Chronology', String(first)],
  );

  return { qs, nextId: k };
}

/** @type {{ id: string; name: string; country: string; years: number[]; position: string; bestRound: string; wonWorldCup: boolean }[]} */
const PLAYERS = [
  // Norway
  { id: 'ole-gunnar-solskjaer', name: 'Ole Gunnar Solskjær', country: 'Norway', years: [1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'tore-andre-flo', name: 'Tore André Flo', country: 'Norway', years: [1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'rune-bratseth', name: 'Rune Bratseth', country: 'Norway', years: [1994], position: 'Defender', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'kjetil-rekdal', name: 'Kjetil Rekdal', country: 'Norway', years: [1994, 1998], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'henning-berg', name: 'Henning Berg', country: 'Norway', years: [1994, 1998], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  // Chile
  { id: 'alexis-sanchez', name: 'Alexis Sánchez', country: 'Chile', years: [2010, 2014], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'arturo-vidal', name: 'Arturo Vidal', country: 'Chile', years: [2010, 2014], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'claudio-bravo', name: 'Claudio Bravo', country: 'Chile', years: [2010, 2014], position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'ivan-zamorano', name: 'Iván Zamorano', country: 'Chile', years: [1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'marcelo-salas', name: 'Marcelo Salas', country: 'Chile', years: [1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  // Bulgaria
  { id: 'hristo-stoichkov', name: 'Hristo Stoichkov', country: 'Bulgaria', years: [1994], position: 'Forward', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'krasimir-balakov', name: 'Krasimir Balakov', country: 'Bulgaria', years: [1994], position: 'Midfielder', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'emil-kostadinov', name: 'Emil Kostadinov', country: 'Bulgaria', years: [1994], position: 'Forward', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'dimitar-berbatov', name: 'Dimitar Berbatov', country: 'Bulgaria', years: [1998], position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'stiliyan-petrov', name: 'Stiliyan Petrov', country: 'Bulgaria', years: [1998], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  // Belgium
  { id: 'kevin-de-bruyne', name: 'Kevin De Bruyne', country: 'Belgium', years: [2014, 2018, 2022], position: 'Midfielder', bestRound: 'Third place', wonWorldCup: false },
  { id: 'eden-hazard', name: 'Eden Hazard', country: 'Belgium', years: [2014, 2018, 2022], position: 'Forward', bestRound: 'Third place', wonWorldCup: false },
  { id: 'thibaut-courtois', name: 'Thibaut Courtois', country: 'Belgium', years: [2014, 2018, 2022], position: 'Goalkeeper', bestRound: 'Third place', wonWorldCup: false },
  // Poland
  { id: 'robert-lewandowski', name: 'Robert Lewandowski', country: 'Poland', years: [2018, 2022], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'zbigniew-boniek', name: 'Zbigniew Boniek', country: 'Poland', years: [1978, 1982, 1986], position: 'Midfielder', bestRound: 'Third place', wonWorldCup: false },
  { id: 'piotr-zielinski', name: 'Piotr Zieliński', country: 'Poland', years: [2018, 2022], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  // South Korea
  { id: 'son-heung-min', name: 'Son Heung-min', country: 'South Korea', years: [2014, 2018, 2022], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'park-ji-sung', name: 'Park Ji-sung', country: 'South Korea', years: [2002, 2006, 2010], position: 'Midfielder', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'cha-bum-kun', name: 'Cha Bum-kun', country: 'South Korea', years: [1986], position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  // Australia
  { id: 'tim-cahill', name: 'Tim Cahill', country: 'Australia', years: [2006, 2010, 2014], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'harry-kewell', name: 'Harry Kewell', country: 'Australia', years: [2006, 2010], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'mark-viduka', name: 'Mark Viduka', country: 'Australia', years: [2006], position: 'Striker', bestRound: 'Group stage', wonWorldCup: false },
  // Morocco
  { id: 'achraf-hakimi', name: 'Achraf Hakimi', country: 'Morocco', years: [2018, 2022], position: 'Right-back', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'hakim-ziyech', name: 'Hakim Ziyech', country: 'Morocco', years: [2018, 2022], position: 'Winger', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'yassine-bounou', name: 'Yassine Bounou', country: 'Morocco', years: [2022], position: 'Goalkeeper', bestRound: 'Semi-finals', wonWorldCup: false },
  // Senegal
  { id: 'sadio-mane', name: 'Sadio Mané', country: 'Senegal', years: [2018], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'el-hadji-diouf', name: 'El Hadji Diouf', country: 'Senegal', years: [2002], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'kalidou-koulibaly', name: 'Kalidou Koulibaly', country: 'Senegal', years: [2018, 2022], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  // Ghana
  { id: 'michael-essien', name: 'Michael Essien', country: 'Ghana', years: [2006, 2014], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'asamoah-gyan', name: 'Asamoah Gyan', country: 'Ghana', years: [2006, 2010, 2014], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'andre-ayew', name: 'André Ayew', country: 'Ghana', years: [2010, 2014, 2022], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'kevin-prince-boateng', name: 'Kevin-Prince Boateng', country: 'Ghana', years: [2010, 2014], position: 'Midfielder', bestRound: 'Quarter-finals', wonWorldCup: false },
  // Cameroon
  { id: 'samuel-etoo', name: 'Samuel Eto\'o', country: 'Cameroon', years: [1998, 2002, 2010, 2014], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'roger-milla', name: 'Roger Milla', country: 'Cameroon', years: [1982, 1990, 1994], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'rigobert-song', name: 'Rigobert Song', country: 'Cameroon', years: [1994, 1998, 2002, 2010], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  // Algeria
  { id: 'rabah-madjer', name: 'Rabah Madjer', country: 'Algeria', years: [1982, 1986], position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'islam-slimani', name: 'Islam Slimani', country: 'Algeria', years: [2014, 2018], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'sofiane-feghouli', name: 'Sofiane Feghouli', country: 'Algeria', years: [2014], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  // Greece
  { id: 'giorgos-karagounis', name: 'Giorgos Karagounis', country: 'Greece', years: [2010, 2014], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'angelos-charisteas', name: 'Angelos Charisteas', country: 'Greece', years: [2010, 2014], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'georgios-samaras', name: 'Georgios Samaras', country: 'Greece', years: [2010, 2014], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
];

function buildPlayerQuestions(m) {
  const want = targetCount(m.years);
  const { qs: baseQs, nextId } = genericBlock(m, 1);
  const out = [...baseQs];
  const curated = CURATED[m.id] || [];
  let idx = nextId;

  for (const c of curated) {
    out.push({
      id: `${m.id}-${idx}`,
      category: 'player',
      difficulty: 'medium',
      question: c.q,
      optionA: c.a,
      optionB: c.b,
      optionC: c.c,
      optionD: c.d,
      correctAnswer: c.ok,
      hint1: c.h[0],
      hint2: c.h[1],
      hint3: c.h[2],
    });
    idx++;
  }

  for (const q of out) {
    if (!q.category) q.category = 'player';
  }

  // Pad with varied phrasing (same year can repeat for single-tournament careers)
  let round = 0;
  let padIdx = 0;
  const padTemplates = (y, h) => [
    `At the ${y} World Cup hosted by ${h}, did ${m.name} represent ${m.country} at the finals?`,
    `${m.name} was named in ${m.country}'s squad for the ${y} World Cup (${h}). Is that correct?`,
    `Did ${m.name} earn caps at the ${y} FIFA World Cup finals for ${m.country}?`,
  ];
  while (out.length < want) {
    const y = m.years[round % m.years.length];
    const h = HOST[y] || 'Unknown';
    const qtext = padTemplates(y, h)[padIdx % 3];
    out.push({
      id: `${m.id}-${idx}`,
      category: 'player',
      difficulty: padIdx % 2 === 0 ? 'medium' : 'easy',
      question: qtext,
      optionA: 'Yes',
      optionB: 'No',
      optionC: 'Only as a substitute coach',
      optionD: 'Only in qualifying',
      correctAnswer: m.years.includes(y) ? 'A' : 'B',
      hint1: 'Finals squads',
      hint2: String(y),
      hint3: m.years.includes(y) ? 'Yes' : 'No',
    });
    idx++;
    round++;
    padIdx++;
  }

  return out.slice(0, want);
}

function render() {
  const blocks = {};
  for (const m of PLAYERS) {
    blocks[m.id] = buildPlayerQuestions(m);
  }

  let ts = `import type { Question } from '@/types/game';\n\n`;
  ts += `/**\n * Authored World Cup questions for Select a Legend countries (Belgium through Bulgaria).\n * Count scales with finals appearances (12 / 24 / 36 / 48); app caps levels by tournament count.\n * Generated by scripts/generate-select-legend-blocks.mjs — do not edit by hand.\n */\n\n`;
  ts += `export const selectLegendPlayerQuestionBlocks: Record<string, Question[]> = {\n`;

  for (const m of PLAYERS) {
    const arr = blocks[m.id];
    ts += `  ${JSON.stringify(m.id)}: [\n`;
    for (const q of arr) {
      ts += `    { id: ${esc(q.id)}, category: 'player', difficulty: ${esc(q.difficulty)}, question: ${esc(q.question)}, optionA: ${esc(q.optionA)}, optionB: ${esc(q.optionB)}, optionC: ${esc(q.optionC)}, optionD: ${esc(q.optionD)}, correctAnswer: ${esc(q.correctAnswer)}, hint1: ${esc(q.hint1)}, hint2: ${esc(q.hint2)}, hint3: ${esc(q.hint3)} },\n`;
    }
    ts += `  ],\n`;
  }
  ts += `};\n`;
  return ts;
}

fs.writeFileSync(outPath, render(), 'utf8');
console.log('Wrote', outPath);

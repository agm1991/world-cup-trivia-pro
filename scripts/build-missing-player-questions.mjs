/**
 * One-off generator: builds src/data/playerQuestionsMissingBlocks.ts from curated WC metadata.
 * Run: node scripts/build-missing-player-questions.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/playerQuestionsMissingLegends.ts');

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

/** @typedef {{ id: string; name: string; country: string; years: number[]; position: string; bestRound: string; wonWorldCup?: boolean; finalLossTo?: string; semiBeat?: string; thirdPlaceBeat?: string; note?: string }} Meta */

/** @type {Meta[]} */
const META = [
  { id: 'sime-vrsaljko', name: 'Šime Vrsaljko', country: 'Croatia', years: [2018], position: 'Right-back', bestRound: 'Final (runner-up)', wonWorldCup: false, finalLossTo: 'France', semiBeat: 'England', note: 'Started the 2018 final vs France.' },
  { id: 'alan-boksic', name: 'Alen Bokšić', country: 'Croatia', years: [1998], position: 'Striker', bestRound: 'Third place', wonWorldCup: false, thirdPlaceBeat: 'Netherlands', note: 'Part of Croatia\'s bronze medal squad at France 1998.' },
  { id: 'xherdan-shaqiri', name: 'Xherdan Shaqiri', country: 'Switzerland', years: [2010, 2014, 2018, 2022], position: 'Winger', bestRound: 'Round of 16', wonWorldCup: false, note: 'Scored a memorable bicycle kick vs Poland at Russia 2018.' },
  { id: 'granit-xhaka', name: 'Granit Xhaka', country: 'Switzerland', years: [2014, 2018, 2022], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'yann-sommer', name: 'Yann Sommer', country: 'Switzerland', years: [2018, 2022], position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false, note: 'No. 1 at Russia 2018 and Qatar 2022; Diego Benaglio started every Switzerland match at Brazil 2014.' },
  { id: 'alexander-frei', name: 'Alexander Frei', country: 'Switzerland', years: [2006], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'stephan-lichtsteiner', name: 'Stephan Lichtsteiner', country: 'Switzerland', years: [2010, 2014, 2018], position: 'Right-back', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'stephane-chapuisat', name: 'Stéphane Chapuisat', country: 'Switzerland', years: [1994], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'ricardo-rodriguez', name: 'Ricardo Rodríguez', country: 'Switzerland', years: [2014, 2018, 2022], position: 'Left-back', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'valon-behrami', name: 'Valon Behrami', country: 'Switzerland', years: [2006, 2014, 2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'blerim-dzemaili', name: 'Blerim Džemaili', country: 'Switzerland', years: [2014, 2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'haris-seferovic', name: 'Haris Seferović', country: 'Switzerland', years: [2014, 2018, 2022], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'tomas-rosicky', name: 'Tomáš Rosický', country: 'Czech Republic', years: [2006], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'milan-baros', name: 'Milan Baroš', country: 'Czech Republic', years: [2006], position: 'Striker', bestRound: 'Group stage', wonWorldCup: false, note: 'He scored for Czech Republic in the 3–0 win over the United States at Germany 2006.' },
  { id: 'tomas-ujfalusi', name: 'Tomáš Ujfaluši', country: 'Czech Republic', years: [2006], position: 'Defender', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'jaroslav-plasil', name: 'Jaroslav Plašil', country: 'Czech Republic', years: [2006], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'karel-poborsky', name: 'Karel Poborský', country: 'Czech Republic', years: [2006], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false, note: 'He played in midfield for Czech Republic at Germany 2006.' },
  { id: 'patrick-berger', name: 'Patrik Berger', country: 'Czech Republic', years: [2006], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'vladimir-smicer', name: 'Vladimír Šmicer', country: 'Czech Republic', years: [2006], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'finidi-george', name: 'Finidi George', country: 'Nigeria', years: [1994, 1998], position: 'Winger', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'danny-amokachi', name: 'Daniel Amokachi', country: 'Nigeria', years: [1994, 1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'rashidi-yekini', name: 'Rashidi Yekini', country: 'Nigeria', years: [1994], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false, note: 'Scored Nigeria\'s first ever World Cup goal (USA 1994).' },
  { id: 'john-obi-mikel', name: 'John Obi Mikel', country: 'Nigeria', years: [2010, 2014], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'ahmed-musa', name: 'Ahmed Musa', country: 'Nigeria', years: [2014, 2018], position: 'Winger', bestRound: 'Round of 16', wonWorldCup: false, note: 'Scored twice vs Argentina at Brazil 2014.' },
  { id: 'vincent-enyeama', name: 'Vincent Enyeama', country: 'Nigeria', years: [2002, 2010, 2014], position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'emmanuel-amuneke', name: 'Emmanuel Amuneke', country: 'Nigeria', years: [1994], position: 'Winger', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'austin-eguaohen', name: 'Austin Eguavoen', country: 'Nigeria', years: [1994], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'fredy-rincon', name: 'Freddy Rincón', country: 'Colombia', years: [1990, 1994, 1998], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false, note: 'Scored a late equaliser vs West Germany at Italia 1990.' },
  { id: 'faustino-asprilla', name: 'Faustino Asprilla', country: 'Colombia', years: [1994, 1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'david-ospina', name: 'David Ospina', country: 'Colombia', years: [2014, 2018], position: 'Goalkeeper', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'juan-cuadrado', name: 'Juan Cuadrado', country: 'Colombia', years: [2014, 2018], position: 'Winger', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'mario-yepes', name: 'Mario Yepes', country: 'Colombia', years: [2006, 2014], position: 'Defender', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'leonel-alvarez', name: 'Leonel Álvarez', country: 'Colombia', years: [1990, 1994], position: 'Defensive midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'cuauhtemoc-blanco', name: 'Cuauhtémoc Blanco', country: 'Mexico', years: [1998], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false, note: 'Famous "Cuauhtemiña" trick at France 1998.' },
  { id: 'andres-guardado', name: 'Andrés Guardado', country: 'Mexico', years: [2006, 2010, 2014, 2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'claudio-suarez', name: 'Claudio Suárez', country: 'Mexico', years: [1994, 1998], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'jorge-campos', name: 'Jorge Campos', country: 'Mexico', years: [1994, 1998], position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false, note: 'Known for colourful kits and sweeper-keeper style.' },
  { id: 'luis-hernandez', name: 'Luis Hernández', country: 'Mexico', years: [1998], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false, note: 'Top scorer for Mexico at France 1998.' },
  { id: 'omar-bravo', name: 'Omar Bravo', country: 'Mexico', years: [2006], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'gerardo-torrado', name: 'Gerardo Torrado', country: 'Mexico', years: [2006, 2010], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'shinji-kagawa', name: 'Shinji Kagawa', country: 'Japan', years: [2014, 2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'keisuke-honda', name: 'Keisuke Honda', country: 'Japan', years: [2010, 2014, 2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false, note: 'Famous free-kick equaliser vs Senegal at Russia 2018.' },
  { id: 'makoto-hasebe', name: 'Makoto Hasebe', country: 'Japan', years: [2010, 2014, 2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'yuto-nagatomo', name: 'Yuto Nagatomo', country: 'Japan', years: [2010, 2014, 2018, 2022], position: 'Left-back', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'shinji-okazaki', name: 'Shinji Okazaki', country: 'Japan', years: [2010, 2014, 2018], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'hidetoshi-nakata', name: 'Hidetoshi Nakata', country: 'Japan', years: [1998, 2002, 2006], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'junichi-inamoto', name: 'Junichi Inamoto', country: 'Japan', years: [2002], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'yoshikatsu-kawaguchi', name: 'Yoshikatsu Kawaguchi', country: 'Japan', years: [2002, 2006, 2010], position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'takashi-inui', name: 'Takashi Inui', country: 'Japan', years: [2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'genki-haraguchi', name: 'Genki Haraguchi', country: 'Japan', years: [2018], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'michael-laudrup', name: 'Michael Laudrup', country: 'Denmark', years: [1986, 1998], position: 'Attacking midfielder', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'brian-laudrup', name: 'Brian Laudrup', country: 'Denmark', years: [1998, 2002], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'peter-schmeichel', name: 'Peter Schmeichel', country: 'Denmark', years: [1998, 2002], position: 'Goalkeeper', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'christian-eriksen', name: 'Christian Eriksen', country: 'Denmark', years: [2010, 2018, 2022], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'kasper-schmeichel', name: 'Kasper Schmeichel', country: 'Denmark', years: [2018, 2022], position: 'Goalkeeper', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'preben-elkjaer', name: 'Preben Elkjaer', country: 'Denmark', years: [1986], position: 'Striker', bestRound: 'Quarter-finals', wonWorldCup: false, note: 'Denmark beat Uruguay 6–1 in the round of 16 before losing to Spain in the quarter-finals at Mexico 1986.' },
  { id: 'morten-olsen', name: 'Morten Olsen', country: 'Denmark', years: [1986], position: 'Defender', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'thomas-delaney', name: 'Thomas Delaney', country: 'Denmark', years: [2018, 2022], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'yussuf-poulsen', name: 'Yussuf Poulsen', country: 'Denmark', years: [2018, 2022], position: 'Forward', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'simon-kjaer', name: 'Simon Kjaer', country: 'Denmark', years: [2010, 2018, 2022], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'zlatan-ibrahimovic', name: 'Zlatan Ibrahimović', country: 'Sweden', years: [2002, 2006], position: 'Striker', bestRound: 'Round of 16', wonWorldCup: false, note: 'Sweden did not qualify for Russia 2018 while he was still active.' },
  { id: 'henrik-larsson', name: 'Henrik Larsson', country: 'Sweden', years: [1994, 2002, 2006], position: 'Striker', bestRound: 'Semi-finals', wonWorldCup: false, note: 'Reached the semi-finals at USA 1994.' },
  { id: 'fredrik-ljungberg', name: 'Fredrik Ljungberg', country: 'Sweden', years: [2002, 2006], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'olof-mellberg', name: 'Olof Mellberg', country: 'Sweden', years: [2002, 2006], position: 'Defender', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'anders-svensson', name: 'Anders Svensson', country: 'Sweden', years: [2002, 2006], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'emil-forsberg', name: 'Emil Forsberg', country: 'Sweden', years: [2018, 2022], position: 'Midfielder', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'victor-lindelof', name: 'Victor Lindelöf', country: 'Sweden', years: [2018, 2022], position: 'Defender', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'sebastian-larsson', name: 'Sebastian Larsson', country: 'Sweden', years: [2006, 2018], position: 'Midfielder', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'kennet-andersson', name: 'Kennet Andersson', country: 'Sweden', years: [1994], position: 'Striker', bestRound: 'Third place', wonWorldCup: false, note: 'Sweden finished third at USA 1994.' },
  { id: 'tomas-brolin', name: 'Tomas Brolin', country: 'Sweden', years: [1994], position: 'Forward', bestRound: 'Third place', wonWorldCup: false, thirdPlaceBeat: 'Bulgaria' },
  { id: 'luis-suarez', name: 'Luis Suárez', country: 'Uruguay', years: [2010, 2014, 2018, 2022], position: 'Striker', bestRound: 'Semi-finals', wonWorldCup: false, note: 'Uruguay finished fourth at South Africa 2010 after reaching the semi-finals.' },
  { id: 'edinson-cavani', name: 'Edinson Cavani', country: 'Uruguay', years: [2010, 2014, 2018, 2022], position: 'Striker', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'diego-forlan', name: 'Diego Forlán', country: 'Uruguay', years: [2002, 2010, 2014], position: 'Forward', bestRound: 'Semi-finals', wonWorldCup: false, note: 'Won the Golden Ball at South Africa 2010.' },
  { id: 'diego-godin', name: 'Diego Godín', country: 'Uruguay', years: [2010, 2014, 2018], position: 'Defender', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'fernando-muslera', name: 'Fernando Muslera', country: 'Uruguay', years: [2010, 2014, 2018, 2022], position: 'Goalkeeper', bestRound: 'Semi-finals', wonWorldCup: false },
  { id: 'enzo-francescoli', name: 'Enzo Francescoli', country: 'Uruguay', years: [1986, 1990], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
  { id: 'alvaro-recoba', name: 'Álvaro Recoba', country: 'Uruguay', years: [2002], position: 'Forward', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'pablo-forlan', name: 'Pablo Forlán', country: 'Uruguay', years: [1966, 1970], position: 'Defender', bestRound: 'Fourth place', wonWorldCup: false, note: 'Father of Diego Forlán; Uruguay were fourth in 1970.' },
  { id: 'juan-alberto-schiaffino', name: 'Juan Alberto Schiaffino', country: 'Uruguay', years: [1950, 1954], position: 'Forward', bestRound: 'World Cup winner (1950)', wonWorldCup: true, note: 'Scored in the decisive 1950 match vs Brazil (Maracanazo).' },
  { id: 'obdulio-varela', name: 'Obdulio Varela', country: 'Uruguay', years: [1950, 1954], position: 'Midfielder', bestRound: 'World Cup winner (1950)', wonWorldCup: true, note: 'Captain of Uruguay\'s 1950 World Cup-winning side.' },
  { id: 'ferenc-puskas', name: 'Ferenc Puskás', country: 'Hungary', years: [1954], position: 'Forward', bestRound: 'Final (runner-up)', wonWorldCup: false, finalLossTo: 'West Germany', note: 'Hungary lost the 1954 final after a famous comeback by West Germany.' },
  { id: 'sandor-kocsis', name: 'Sándor Kocsis', country: 'Hungary', years: [1954], position: 'Striker', bestRound: 'Final (runner-up)', wonWorldCup: false, note: 'Won the Golden Boot at Switzerland 1954 with 11 goals.' },
  { id: 'nandor-hidegkuti', name: 'Nándor Hidegkuti', country: 'Hungary', years: [1954], position: 'Forward', bestRound: 'Final (runner-up)', wonWorldCup: false, note: 'Scored a hat-trick vs West Germany in the group stage at Basel.' },
  { id: 'zoltan-czibor', name: 'Zoltán Czibor', country: 'Hungary', years: [1954], position: 'Forward', bestRound: 'Final (runner-up)', wonWorldCup: false },
  { id: 'gyula-grosics', name: 'Gyula Grosics', country: 'Hungary', years: [1954], position: 'Goalkeeper', bestRound: 'Final (runner-up)', wonWorldCup: false, note: 'Early sweeper-keeper; part of the "Golden Team".' },
  { id: 'florian-albert', name: 'Florián Albert', country: 'Hungary', years: [1962, 1966], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'lajos-tichy', name: 'Lajos Tichy', country: 'Hungary', years: [1962, 1966], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'ferenc-bene', name: 'Ferenc Bene', country: 'Hungary', years: [1962], position: 'Forward', bestRound: 'Quarter-finals', wonWorldCup: false },
  { id: 'tibor-nyilasi', name: 'Tibor Nyilási', country: 'Hungary', years: [1978, 1982], position: 'Midfielder', bestRound: 'Group stage', wonWorldCup: false },
  { id: 'lajos-detari', name: 'Lajos Détári', country: 'Hungary', years: [1986], position: 'Midfielder', bestRound: 'Round of 16', wonWorldCup: false },
];

/** Raw string; JSON.stringify in renderQuestion handles escaping. */
function esc(s) {
  return String(s);
}

function yearsLabel(years) {
  const u = [...new Set(years)].sort((a, b) => a - b);
  return u.join(', ');
}

function wrongYearOptions(correctYears) {
  const c = [...new Set(correctYears)].sort((a, b) => a - b);
  const label = (arr) => [...new Set(arr)].sort((a, b) => a - b).join(', ');
  const correct = label(c);
  const out = [];
  if (c.length === 1) {
    const y = c[0];
    [y - 4, y + 4, y - 8].forEach((x) => {
      if (out.length < 3 && String(x) !== correct) out.push(String(x));
    });
  } else {
    out.push(label(c.slice(0, -1)));
    out.push(label(c.map((x) => x - 4)));
    if (c.length >= 2) out.push(label([c[0] - 4, c[1]]));
  }
  return out.filter((w) => w !== correct).slice(0, 3);
}

function pickCorrectLetter(idx) {
  return ['A', 'B', 'C', 'D'][idx];
}

function buildQuestions(m) {
  const first = Math.min(...m.years);
  const last = Math.max(...m.years);
  const host = HOST[first] || 'Unknown';
  const ys = yearsLabel(m.years);
  const wrong = wrongYearOptions(m.years);

  /** @type {import('../src/types/game.ts').Question[]} */
  const qs = [];

  // 1 — World Cup years
  {
    const options = [ys, wrong[0], wrong[1], wrong[2]];
    const correctIdx = 0;
    // shuffle positions - keep correct at A for simplicity
    qs.push({
      id: `${m.id}-1`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`${m.name} appeared for ${m.country} at which World Cup tournament(s)?`),
      optionA: esc(options[0]),
      optionB: esc(options[1]),
      optionC: esc(options[2]),
      optionD: esc(options[3]),
      correctAnswer: pickCorrectLetter(correctIdx),
      hint1: esc('Check his caps at the finals.'),
      hint2: esc(`${m.country} at the global finals.`),
      hint3: esc(ys),
    });
  }

  // 2 — Host of first appearance
  {
    const wrongHosts = ['Germany', 'Brazil', 'Italy'].filter((h) => h !== host);
    qs.push({
      id: `${m.id}-2`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`Who hosted the World Cup the first time ${m.name} played at the finals?`),
      optionA: esc(host),
      optionB: esc(wrongHosts[0] || 'France'),
      optionC: esc(wrongHosts[1] || 'Spain'),
      optionD: esc(wrongHosts[2] || 'Argentina'),
      correctAnswer: 'A',
      hint1: esc(`The year was ${first}.`),
      hint2: esc('Host nation of that edition.'),
      hint3: esc(host),
    });
  }

  // 3 — Position
  const posWrong = ['Goalkeeper', 'Striker', 'Centre-back', 'Winger', 'Defender', 'Midfielder'].filter((p) => p !== m.position);
  qs.push({
    id: `${m.id}-3`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`What was ${m.name}'s primary role for ${m.country} at the World Cup?`),
    optionA: esc(m.position),
    optionB: esc(posWrong[0] || 'Defender'),
    optionC: esc(posWrong[1] || 'Goalkeeper'),
    optionD: esc(posWrong[2] || 'Striker'),
    correctAnswer: 'A',
    hint1: esc('On-field role.'),
    hint2: esc(m.country + ' national team.'),
    hint3: esc(m.position),
  });

  // 4 — Best round
  const roundPool = ['Group stage', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Fourth place', 'Third place'];
  let wrongRounds = roundPool.filter((r) => r !== m.bestRound && !m.bestRound.includes(r)).slice(0, 3);
  if (wrongRounds.length < 3) {
    wrongRounds = roundPool.filter((r) => r !== m.bestRound).slice(0, 3);
  }
  qs.push({
    id: `${m.id}-4`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`Which best describes ${m.country}'s deepest run at the World Cup with ${m.name} in the squad?`),
    optionA: esc(m.bestRound),
    optionB: esc(wrongRounds[0] || 'Group stage'),
    optionC: esc(wrongRounds[1] || 'Quarter-finals'),
    optionD: esc(wrongRounds[2] || 'Semi-finals'),
    correctAnswer: 'A',
    hint1: esc('Knockout progress.'),
    hint2: esc(m.country + ' at the finals.'),
    hint3: esc(m.bestRound),
  });

  // 5 — Won WC
  const won = !!m.wonWorldCup;
  qs.push({
    id: `${m.id}-5`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`Did ${m.name} win a FIFA World Cup as a player?`),
    optionA: won ? 'Yes' : 'No',
    optionB: won ? 'No' : 'Yes',
    optionC: 'Only as a coach',
    optionD: 'Only at youth level',
    correctAnswer: 'A',
    hint1: esc('Trophy with senior national team.'),
    hint2: esc(m.country),
    hint3: esc(won ? 'Champion' : 'Did not lift the trophy'),
  });

  // 6 — Final loss / third / semi
  if (m.finalLossTo) {
    const wrongF = ['Brazil', 'Italy', 'Argentina'].filter((x) => x !== m.finalLossTo);
    qs.push({
      id: `${m.id}-6`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`At the World Cup, ${m.country} lost the final to which nation in ${m.name}'s era?`),
      optionA: esc(m.finalLossTo),
      optionB: esc(wrongF[0]),
      optionC: esc(wrongF[1]),
      optionD: esc(wrongF[2] || 'England'),
      correctAnswer: 'A',
      hint1: esc('Final opponent.'),
      hint2: esc('Decisive match.'),
      hint3: esc(m.finalLossTo),
    });
  } else if (m.thirdPlaceBeat) {
    const wrongO = ['Brazil', 'Italy', 'Spain', 'Germany', 'Argentina'].filter((x) => x !== m.thirdPlaceBeat);
    qs.push({
      id: `${m.id}-6`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`In the third-place playoff, ${m.country} faced which opponent (with ${m.name} in the squad)?`),
      optionA: esc(m.thirdPlaceBeat),
      optionB: esc(wrongO[0] || 'France'),
      optionC: esc(wrongO[1] || 'England'),
      optionD: esc(wrongO[2] || 'Portugal'),
      correctAnswer: 'A',
      hint1: esc('Bronze match.'),
      hint2: esc(m.country),
      hint3: esc(m.thirdPlaceBeat),
    });
  } else {
    qs.push({
      id: `${m.id}-6`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`True or False: ${m.name} represented ${m.country} at the FIFA World Cup.`),
      optionA: 'True',
      optionB: 'False',
      optionC: 'Only in qualifiers',
      optionD: 'Only at youth tournaments',
      correctAnswer: 'A',
      hint1: esc('Senior finals.'),
      hint2: esc(String(m.years[0])),
      hint3: esc('True'),
    });
  }

  // 7 — Last appearance year
  qs.push({
    id: `${m.id}-7`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`In which calendar year did ${m.name} last play at a World Cup finals tournament?`),
    optionA: String(last),
    optionB: String(last - 4),
    optionC: String(last + 4),
    optionD: String(last - 8),
    correctAnswer: 'A',
    hint1: esc('Most recent finals.'),
    hint2: esc('Tournament year.'),
    hint3: esc(String(last)),
  });

  // 8 — Note or generic
  if (m.note) {
    qs.push({
      id: `${m.id}-8`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`Which statement about ${m.name} and the World Cup is accurate?`),
      optionA: esc(m.note),
      optionB: esc('He never left the bench at the finals.'),
      optionC: esc('He only played in qualifiers.'),
      optionD: esc('He represented a different country at the finals.'),
      correctAnswer: 'A',
      hint1: esc('Documented World Cup fact.'),
      hint2: esc(m.country),
      hint3: esc('First option'),
    });
  } else {
    const n = new Set(m.years).size;
    qs.push({
      id: `${m.id}-8`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`How many different World Cup final tournaments did ${m.name} play in?`),
      optionA: String(n),
      optionB: String(Math.max(0, n - 1)),
      optionC: String(n + 3),
      optionD: String(n + 5),
      correctAnswer: 'A',
      hint1: esc('Count distinct years.'),
      hint2: esc(ys),
      hint3: esc(String(n)),
    });
  }

  // 9 — Continent (FIFA zones used in World Cup context)
  const continentMap = {
    Uruguay: 'South America',
    Colombia: 'South America',
    Mexico: 'North America',
    Nigeria: 'Africa',
    Japan: 'Asia',
    Switzerland: 'Europe',
    'Czech Republic': 'Europe',
    Denmark: 'Europe',
    Sweden: 'Europe',
    Hungary: 'Europe',
    Croatia: 'Europe',
  };
  const continent = continentMap[m.country] ?? 'Europe';

  qs.push({
    id: `${m.id}-9`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`${m.country} is part of which football confederation region at the World Cup?`),
    optionA: esc(continent),
    optionB: continent === 'Europe' ? 'Asia' : 'Europe',
    optionC: continent === 'South America' ? 'North America' : 'South America',
    optionD: 'Oceania',
    correctAnswer: 'A',
    hint1: esc('Geography.'),
    hint2: esc(m.country),
    hint3: esc(continent),
  });

  // 10 — Summary
  qs.push({
    id: `${m.id}-10`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`Which is true of ${m.name}'s World Cup career?`),
    optionA: esc(`He played at the finals for ${m.country} in ${ys}.`),
    optionB: esc(`He never played at a World Cup for ${m.country}.`),
    optionC: esc(`He won the World Cup with ${m.country}.`),
    optionD: esc(`He only played Olympic football for ${m.country}.`),
    correctAnswer: 'A',
    hint1: esc('Finals appearances.'),
    hint2: esc(ys),
    hint3: esc(m.country),
  });

  // Patch Q5 if wonWorldCup - option C/D might be wrong for "only coach"
  // Patch Q10 option C - if won, "He won the World Cup" could be true for Schiaffino, Varela
  if (m.wonWorldCup) {
    qs[9].optionC = esc(`He won the World Cup with ${m.country}.`);
    qs[9].correctAnswer = 'C';
    qs[9].optionA = esc(`He played at the finals for ${m.country} in ${ys}.`);
    // Both A and C could be true - need single answer
    qs[9] = {
      id: `${m.id}-10`,
      category: 'player',
      difficulty: 'easy',
      question: esc(`What is true of ${m.name} at the World Cup?`),
      optionA: esc(`He won the World Cup with ${m.country}.`),
      optionB: esc(`He never reached a World Cup final.`),
      optionC: esc(`He only played qualifiers for ${m.country}.`),
      optionD: esc(`He never capped for ${m.country} at a finals.`),
      correctAnswer: 'A',
      hint1: esc('Highest honour.'),
      hint2: esc(m.country),
      hint3: esc('Winner'),
    };
  }

  return qs;
}

function fixKennetAnderssonQ6(qs, m) {
  if (m.id !== 'kennet-andersson') return;
  const idx = qs.findIndex((q) => q.id === `${m.id}-6`);
  if (idx === -1) return;
  qs[idx] = {
    id: `${m.id}-6`,
    category: 'player',
    difficulty: 'easy',
    question: esc(`Sweden played Bulgaria in the 1994 World Cup third-place match. What was the result?`),
    optionA: '4-0 to Sweden',
    optionB: '2-1 to Bulgaria',
    optionC: '1-1 (pens)',
    optionD: '3-2 to Brazil',
    correctAnswer: 'A',
    hint1: esc('Third-place game USA 94.'),
    hint2: esc('Comfortable win.'),
    hint3: esc('4-0'),
  };
}

function renderQuestion(q) {
  const fields = ['id', 'category', 'difficulty', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'hint1', 'hint2', 'hint3'];
  const parts = fields.map((f) => `${f}: ${JSON.stringify(q[f])}`);
  return `      { ${parts.join(', ')} }`;
}

let out = `import { Question } from '@/types/game';

/**
 * Missing "Select a Legend" player blocks + WC years for roster not yet in main records.
 * Regenerate: node scripts/build-missing-player-questions.mjs
 */
export const missingPlayerQuestionBlocks: Record<string, Question[]> = {
`;

for (const m of META) {
  const qs = buildQuestions(m);
  fixKennetAnderssonQ6(qs, m);

  out += `  '${m.id}': [\n`;
  out += qs.map(renderQuestion).join(',\n');
  out += `\n  ],\n`;
}

out += `};\n`;

const pq = fs.readFileSync(path.join(__dirname, '../src/data/playerQuestions.ts'), 'utf8');
const yStart = pq.indexOf('export const playerWorldCupYears');
const yEnd = pq.indexOf('\n};', yStart) + 3;
const yBlock = pq.slice(yStart, yEnd);
const existingYearKeys = new Set([...yBlock.matchAll(/^\s{2}'([^']+)': \[/gm)].map((mm) => mm[1]));

const missingYearEntries = META.filter((m) => !existingYearKeys.has(m.id));
out += `
/** Years only for legends not already listed in playerWorldCupYears (merge via spread). */
export const missingPlayerWorldCupYears: Record<string, number[]> = {
${missingYearEntries.map((m) => `  '${m.id}': [${m.years.join(', ')}],`).join('\n')}
};
`;

fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath, 'players', META.length, 'year entries added', missingYearEntries.length);

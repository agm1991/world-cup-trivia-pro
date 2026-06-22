import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/playerQuestionsSaudiRussia.ts');

function q(id, text, a, b, c, d, ok, h1, h2, h3, diff = 'easy') {
  return `    q(${JSON.stringify(id)}, ${JSON.stringify(text)}, ${JSON.stringify(
    a,
  )}, ${JSON.stringify(b)}, ${JSON.stringify(c)}, ${JSON.stringify(
    d,
  )}, ${JSON.stringify(ok)}, ${JSON.stringify(h1)}, ${JSON.stringify(h2)}, ${JSON.stringify(h3)}, ${JSON.stringify(diff)})`;
}

const PLAYERS = [
  {
    id: 'salem-al-dawsari',
    name: 'Salem Al-Dawsari',
    country: 'Saudi Arabia',
    years: '2018, 2022',
    nYears: 2,
    role: 'Winger',
    confed: 'AFC (Asia)',
    extras: [
      ['2018', 'At Russia 2018, Al-Dawsari scored a stoppage-time winner as Saudi Arabia beat Egypt 2-1 in Volgograd.', 'A'],
      ['2022', 'At Qatar 2022, Al-Dawsari scored the winning goal in Saudi Arabia\'s 2-1 upset of Argentina.', 'A'],
      ['2022', 'Saudi Arabia\'s group at Qatar 2022 included Argentina, Mexico and which nation?', 'Poland', 'Brazil', 'Germany', 'France', 'A', 'Group C', 'Asian side', 'Poland'],
      ['2018', 'The 2018 World Cup was hosted by which country?', 'Russia', 'Qatar', 'Brazil', 'Germany', 'A', 'Eastern Europe', 'Hosts', 'Russia'],
      ['2022', 'The 2022 World Cup was hosted by which country?', 'Qatar', 'Russia', 'USA', 'Japan', 'A', 'Gulf nation', 'November tournament', 'Qatar'],
    ],
  },
  {
    id: 'sami-al-jaber',
    name: 'Sami Al-Jaber',
    country: 'Saudi Arabia',
    years: '1994, 1998, 2002, 2006',
    nYears: 4,
    role: 'Forward',
    confed: 'AFC (Asia)',
    extras: [
      ['1994', 'Sami Al-Jaber scored as Saudi Arabia beat Morocco 2-1 at USA 1994.', 'A'],
      ['1994', 'Saudi Arabia reached the round of 16 at the 1994 World Cup.', 'A'],
      ['2002', 'At the 2002 World Cup, Saudi Arabia was drawn in a group that included which eventual finalists?', 'Germany', 'Brazil', 'Turkey', 'France', 'A', 'Group E', 'European power', 'Germany'],
      ['1998', 'The 1998 World Cup was hosted by which country?', 'France', 'USA', 'Italy', 'Spain', 'A', 'Stade de France final', 'Hosts', 'France'],
      ['2006', 'The 2006 World Cup was hosted by which country?', 'Germany', 'France', 'Japan', 'South Africa', 'A', 'Berlin Olympiastadion final', 'Hosts', 'Germany'],
    ],
  },
  {
    id: 'mohammed-al-deayea',
    name: 'Mohammed Al-Deayea',
    country: 'Saudi Arabia',
    years: '1994, 1998, 2002, 2006',
    nYears: 4,
    role: 'Goalkeeper',
    confed: 'AFC (Asia)',
    extras: [
      ['1994', 'Al-Deayea kept goal as Saudi Arabia advanced from the group at USA 1994.', 'A'],
      ['2002', 'Al-Deayea was Saudi Arabia\'s long-time goalkeeper across multiple World Cups.', 'A'],
      ['1998', 'At France 1998, Saudi Arabia faced the host nation in the group stage.', 'A'],
      ['2010', 'Did Al-Deayea play at the 2010 World Cup for Saudi Arabia?', 'No', 'Yes', 'Only as coach', 'Youth only', 'A', 'Last Cup was 2006', 'Goalkeeper career', 'No'],
      ['1994', 'Which round did Saudi Arabia reach at USA 1994 with Al-Deayea in goal?', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Final', 'A', 'Lost to Sweden', 'Knockouts', 'Round of 16'],
    ],
  },
  {
    id: 'saeed-al-owairan',
    name: 'Saeed Al-Owairan',
    country: 'Saudi Arabia',
    years: '1994',
    nYears: 1,
    role: 'Forward',
    confed: 'AFC (Asia)',
    extras: [
      ['1994', 'Al-Owairan scored a famous long solo run goal against Belgium at USA 1994.', 'A'],
      ['1994', 'Saudi Arabia advanced from their group at the 1994 World Cup.', 'A'],
      ['1994', 'The 1994 World Cup was hosted by which country?', 'United States', 'Mexico', 'Canada', 'Brazil', 'A', 'Rose Bowl final', 'USA', 'United States'],
      ['1994', 'Al-Owairan\'s only World Cup participation as a player was in which year?', '1994', '1998', '2002', '1990', 'A', 'USA tournament', 'Single edition', '1994'],
      ['1994', 'Did Al-Owairan win a World Cup with Saudi Arabia?', 'No', 'Yes', 'Shared', 'Youth title', 'A', 'Senior trophy', 'Saudi Arabia', 'No'],
    ],
  },
  {
    id: 'yasser-al-qahtani',
    name: 'Yasser Al-Qahtani',
    country: 'Saudi Arabia',
    years: '2006',
    nYears: 1,
    role: 'Forward',
    confed: 'AFC (Asia)',
    extras: [
      ['2006', 'Al-Qahtani was in Saudi Arabia\'s squad at the 2006 World Cup in Germany.', 'A'],
      ['2006', 'Saudi Arabia\'s 2006 group included Spain, Ukraine and which nation?', 'Tunisia', 'Brazil', 'France', 'Italy', 'A', 'North Africa', 'Group H', 'Tunisia'],
      ['2006', 'Did Saudi Arabia reach the knockout stage at Germany 2006?', 'No', 'Yes', 'Final', 'Semi-finals', 'A', 'Group stage exit', 'Green Falcons', 'No'],
      ['2006', 'The 2006 World Cup final was held in which city?', 'Berlin', 'Munich', 'Hamburg', 'Cologne', 'A', 'Olympiastadion', 'Italy vs France', 'Berlin'],
      ['2006', 'Al-Qahtani played as which type of outfield player for Saudi Arabia?', 'Forward', 'Goalkeeper', 'Referee', 'Linesman', 'A', 'Attack', 'Saudi Arabia', 'Forward'],
    ],
  },
  {
    id: 'roman-pavlyuchenko',
    name: 'Roman Pavlyuchenko',
    country: 'Russia',
    years: '2010',
    nYears: 1,
    role: 'Striker',
    confed: 'UEFA (Europe)',
    extras: [
      ['2010', 'Pavlyuchenko played for Russia at the 2010 World Cup in South Africa.', 'A'],
      ['2010', 'Russia faced South Korea in the group stage at South Africa 2010.', 'A'],
      ['2010', 'Did Russia advance past the group stage at the 2010 World Cup?', 'No', 'Yes', 'Won the tournament', 'Final', 'A', 'Group stage exit', 'Russia', 'No'],
      ['2010', 'The 2010 World Cup was hosted by which country?', 'South Africa', 'Brazil', 'Germany', 'Qatar', 'A', 'First African host', 'Vuvuzelas', 'South Africa'],
      ['2010', 'Pavlyuchenko was primarily deployed as which position for Russia?', 'Striker', 'Goalkeeper', 'Full-back', 'Referee', 'A', 'Goals', 'Attack', 'Striker'],
    ],
  },
  {
    id: 'igor-akinfeev',
    name: 'Igor Akinfeev',
    country: 'Russia',
    years: '2014, 2018',
    nYears: 2,
    role: 'Goalkeeper',
    confed: 'UEFA (Europe)',
    extras: [
      ['2018', 'Akinfeev saved two penalties in the shootout as Russia eliminated Spain in the round of 16.', 'A'],
      ['2018', 'Russia reached the quarter-finals as hosts before losing to Croatia on penalties.', 'A'],
      ['2014', 'Akinfeev played for Russia at the 2014 World Cup in Brazil.', 'A'],
      ['2018', 'Russia eliminated Spain in a penalty shootout in the round of 16 at Russia 2018.', 'A'],
      ['2018', 'In the quarter-finals, Russia drew 2-2 with Croatia after extra time before losing on penalties.', 'A'],
    ],
  },
  {
    id: 'yuri-zhirkov',
    name: 'Yuri Zhirkov',
    country: 'Russia',
    years: '2014, 2018',
    nYears: 2,
    role: 'Left-back',
    confed: 'UEFA (Europe)',
    extras: [
      ['2018', 'Zhirkov started matches for Russia as they reached the quarter-finals on home soil.', 'A'],
      ['2014', 'Zhirkov played for Russia at Brazil 2014.', 'A'],
      ['2018', 'Russia eliminated Spain in the round of 16 at Russia 2018.', 'A'],
      ['2014', 'Russia\'s 2014 group included Belgium, Algeria and which nation?', 'South Korea', 'Brazil', 'Germany', 'France', 'A', 'Group H', 'Asian side', 'South Korea'],
      ['2018', 'The 2018 World Cup was hosted by which country?', 'Russia', 'Qatar', 'Germany', 'South Africa', 'A', 'Hosts', 'Moscow final', 'Russia'],
    ],
  },
  {
    id: 'aleksandr-kerzhakov',
    name: 'Aleksandr Kerzhakov',
    country: 'Russia',
    years: '2002, 2014',
    nYears: 2,
    role: 'Striker',
    confed: 'UEFA (Europe)',
    extras: [
      ['2002', 'Kerzhakov was in Russia\'s squad at the Korea/Japan 2002 World Cup.', 'A'],
      ['2014', 'Kerzhakov played for Russia at Brazil 2014.', 'A'],
      ['2002', 'At Korea/Japan 2002, Russia was grouped with Belgium, Tunisia and which team?', 'Japan', 'Brazil', 'Germany', 'France', 'A', 'Co-host', 'Group H', 'Japan'],
      ['2014', 'Did Russia reach the knockout stage at Brazil 2014?', 'No', 'Yes', 'Final', 'Semi-finals', 'A', 'Group stage', 'Russia', 'No'],
      ['2002', 'The 2002 World Cup was co-hosted by Japan and which country?', 'South Korea', 'China', 'Australia', 'North Korea', 'A', 'Asian hosts', 'Seoul', 'South Korea'],
    ],
  },
  {
    id: 'andrey-arshavin',
    name: 'Andrey Arshavin',
    country: 'Russia',
    years: '2010',
    nYears: 1,
    role: 'Attacking midfielder',
    confed: 'UEFA (Europe)',
    extras: [
      ['2010', 'Arshavin played for Russia at the 2010 World Cup after recovering from injury.', 'A'],
      ['2010', 'Russia did not advance from their group at South Africa 2010.', 'A'],
      ['2010', 'Arshavin was known as a creative midfielder and forward for Russia.', 'A'],
      ['2010', 'Russia\'s group at South Africa 2010 included South Korea, Greece and which nation?', 'Nigeria', 'Brazil', 'Spain', 'Germany', 'A', 'Group B', 'African side', 'Nigeria'],
      ['2010', 'Was 2010 Arshavin\'s only World Cup as a player?', 'Yes', 'No', 'He never played', '2006 only', 'A', 'Single edition', 'Russia', 'Yes'],
    ],
  },
];

function buildArray(p) {
  const lines = [];
  let idx = 0;
  const add = (text, a, b, c, d, ok, h1, h2, h3, diff) => {
    idx += 1;
    lines.push(q(`${p.id}-${idx}`, text, a, b, c, d, ok, h1, h2, h3, diff));
  };

  add(
    `How many FIFA World Cup final tournaments did ${p.name} play in?`,
    String(p.nYears),
    '0',
    '10',
    '1',
    'A',
    'Count editions',
    p.years,
    String(p.nYears),
    'easy',
  );
  add(
    `${p.name} earned senior World Cup caps for which national team?`,
    p.country,
    'Brazil',
    'Germany',
    'Japan',
    'A',
    'International team',
    'FIFA finals',
    p.country,
    'easy',
  );
  add(
    `In which calendar year(s) did ${p.name} appear at FIFA World Cup finals? (Finals years only)`,
    p.years,
    '1990 only',
    'Never',
    '2010 only',
    'A',
    'Participation',
    p.country,
    p.years,
    'easy',
  );
  add(
    `What was ${p.name}'s primary playing role for ${p.country} at World Cups?`,
    p.role,
    'Goalkeeper',
    'Referee',
    'Coach',
    'A',
    'Position',
    'On-field',
    p.role,
    'easy',
  );
  add(
    `Did ${p.name} win a FIFA World Cup as a player?`,
    'No',
    'Yes',
    'Only as a coach',
    'Youth World Cup only',
    'A',
    'Senior trophy',
    p.country,
    'No',
    'easy',
  );
  if (p.country === 'Saudi Arabia') {
    add(
      `${p.country} competes in World Cup qualifying under which confederation (for ${p.name}'s era)?`,
      'AFC (Asia)',
      'UEFA (Europe)',
      'CONMEBOL',
      'OFC',
      'A',
      'Geography',
      'World Cup',
      'AFC',
      'medium',
    );
  } else {
    add(
      `${p.country} competes in World Cup qualifying under which confederation (for ${p.name}'s era)?`,
      'UEFA (Europe)',
      'AFC (Asia)',
      'CONMEBOL',
      'OFC',
      'A',
      'Geography',
      'World Cup',
      'UEFA',
      'medium',
    );
  }

  for (const row of p.extras) {
    if (row.length === 10) {
      const [y, text, a, b, c, d, ok, h1, h2, h3] = row;
      add(text, a, b, c, d, ok, h1, h2, h3, 'medium');
    } else {
      const [y, text, ok] = row;
      add(
        text,
        'True',
        'False',
        'Only qualifiers',
        'Youth only',
        ok,
        `${y} World Cup`,
        p.country,
        'World Cup',
        'medium',
      );
    }
  }

  const yearsArr = p.years.split(', ');
  while (lines.length < 50) {
    const n = lines.length + 1;
    const y = yearsArr[(n - 1) % yearsArr.length];
    lines.push(
      q(
        `${p.id}-${n}`,
        `At the ${y} FIFA World Cup, ${p.name} was part of ${p.country}'s senior squad at the finals tournament.`,
        'True',
        'False',
        'Only on the bench for friendlies',
        'Only youth teams',
        'A',
        'Finals squad',
        y,
        p.country,
        n % 4 === 0 ? 'hard' : 'medium',
      ),
    );
  }

  return lines.join(',\n');
}

const blocks = PLAYERS.map((p) => `const ${p.id.replace(/-/g, '_')}: Question[] = [\n${buildArray(p)}\n];`).join('\n\n');

const names = PLAYERS.map((p) => `  '${p.id}': ${p.id.replace(/-/g, '_')}`).join(',\n');

const file = `import type { Question } from '@/types/game';

/**
 * Saudi Arabia & Russia — Select a Legend (50 questions each, World Cup–focused).
 * Generated by scripts/gen-saudi-russia.mjs
 */

function q(
  id: string,
  text: string,
  a: string,
  b: string,
  c: string,
  d: string,
  ok: 'A' | 'B' | 'C' | 'D',
  h1: string,
  h2: string,
  h3: string,
  difficulty: Question['difficulty'] = 'easy',
): Question {
  return {
    id,
    category: 'player',
    difficulty,
    question: text,
    optionA: a,
    optionB: b,
    optionC: c,
    optionD: d,
    correctAnswer: ok,
    hint1: h1,
    hint2: h2,
    hint3: h3,
  };
}

${blocks}

export const saudiRussiaLegendPlayerQuestionBlocks: Record<string, Question[]> = {
${names}
};
`;

fs.writeFileSync(outPath, file);
console.log('Wrote', outPath);

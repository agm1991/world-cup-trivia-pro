import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('vicini-ita-1')) {
  console.log('Already patched');
  process.exit(0);
}

function q(id, difficulty, question, opts, ok, hints) {
  const [optionA, optionB, optionC, optionD] = opts;
  const [hint1, hint2, hint3] = hints;
  return `  {
    id: '${id}',
    category: 'managers',
    difficulty: '${difficulty}',
    question: ${JSON.stringify(question)},
    optionA: ${JSON.stringify(optionA)},
    optionB: ${JSON.stringify(optionB)},
    optionC: ${JSON.stringify(optionC)},
    optionD: ${JSON.stringify(optionD)},
    correctAnswer: '${ok}',
    hint1: ${JSON.stringify(hint1)},
    hint2: ${JSON.stringify(hint2)},
    hint3: ${JSON.stringify(hint3)},
  }`;
}

const blocks = [
  {
    comment: 'Azeglio Vicini - Italy 1990 World Cup Campaign',
    prefix: 'vicini-ita',
    items: [
      ['Azeglio Vicini managed host nation Italy to a 3rd-place finish during a magical 1990 summer that became culturally immortalized by what famous phrase?', ['La Bella Estate', 'Il Miracolo Italiano', 'Notti Magiche (Magic Nights)', 'Forza Azzurri'], 'C', ['1990 cultural phrase', 'Magical Italian summer', 'Notti Magiche']],
      ['Vicini\'s tactical setup was a more fluid, attacking version of Catenaccio. How many goals did Italy concede in their first five matches of the tournament?', ['Zero', 'One', 'Two', 'Three'], 'A', ['Fluid Catenaccio', 'First five matches', 'Zero goals conceded']],
      ['Vicini\'s incredible defensive structure helped his goalkeeper set an all-time World Cup record of 517 consecutive minutes without conceding. Who was the keeper?', ['Gianluigi Buffon', 'Dino Zoff', 'Walter Zenga', 'Gianluca Pagliuca'], 'C', ['517-minute record', '1990 goalkeeper', 'Walter Zenga']],
      ['Vicini started the tournament with Gianluca Vialli and Andrea Carnevale as his strikers, but brilliantly pivoted to which legendary, unexpected duo who lit up the tournament?', ['Paolo Rossi and Alessandro Altobelli', 'Salvatore "Totò" Schillaci and Roberto Baggio', 'Roberto Mancini and Aldo Serena', 'Gianfranco Zola and Giuseppe Signori'], 'B', ['Tactical pivot up front', 'Unexpected striking duo', 'Schillaci and Baggio']],
      ["Which of Vicini's brilliant tactical substitutions won the 1990 Golden Boot with 6 goals, despite having only one international cap before the tournament?", ['Roberto Baggio', 'Aldo Serena', 'Totò Schillaci', 'Nicola Berti'], 'C', ['Golden Boot winner', 'One cap before 1990', 'Totò Schillaci']],
      ['Vicini anchored his defense around the ultimate AC Milan pairing of Franco Baresi and Paolo Maldini, but who played as his tough-tackling, energetic defensive midfielder?', ['Carlo Ancelotti', 'Fernando De Napoli', 'Roberto Donadoni', 'Giancarlo Antognoni'], 'B', ['Defensive midfielder', 'Tough-tackling engine', 'Fernando De Napoli']],
      ['In the semi-final, Vicini\'s Italy faced Diego Maradona\'s Argentina. This match had an incredibly tense, divided atmosphere because it was played in which Italian city?', ['Rome', 'Milan', 'Turin', 'Naples (Maradona\'s adopted club city)'], 'D', ['Semi-final venue', 'Divided atmosphere', 'Naples']],
      ['Vicini made a highly controversial tactical decision in that semi-final against Argentina. What did he do?', ['He subbed off his goalkeeper', 'He played with five centre-backs', 'He benched Roberto Baggio in favor of Gianluca Vialli', 'He ordered his team to play for a 0-0 draw'], 'C', ['Controversial semi-final call', 'Baggio benched', 'Vialli started instead']],
      ['Vicini\'s heartbreaking 1990 run ended when they lost the semi-final to Argentina via a penalty shootout. Who missed the crucial spot-kicks for Italy?', ['Baggio and Schillaci', 'Donadoni and Serena', 'Baresi and Maldini', 'Vialli and De Agostini'], 'B', ['Penalty shootout defeat', 'Missed spot-kicks', 'Donadoni and Serena']],
      ['Before managing the senior team to this iconic run, Vicini built the core of his squad\'s tactical chemistry by managing which team for a decade?', ['Juventus', 'AC Milan', 'The Italy Under-21 National Team', 'Napoli'], 'C', ['Pre-senior career', 'Decade building chemistry', 'Italy Under-21s']],
    ],
  },
  {
    comment: 'Takeshi Okada - Japan 2010 World Cup Campaign',
    prefix: 'okada-jpn',
    items: [
      ['Takeshi Okada masterminded a brilliant underdog run for Japan in 2010 by transitioning away from a possession style to a highly disciplined, counter-attacking shape. What was it?', ['3-5-2', '4-1-4-1 (or 4-3-3)', '4-4-2 diamond', '5-4-1'], 'B', ['Counter-attacking shape', 'Disciplined system', '4-1-4-1 or 4-3-3']],
      ['Just before the tournament, Okada made the massive tactical decision to drop his traditional strikers and play which dynamic, natural midfielder as a "False 9"?', ['Shunsuke Nakamura', 'Keisuke Honda', 'Shinji Kagawa', 'Yasuhito Endō'], 'C', ['False 9 experiment', 'Dropped traditional strikers', 'Shinji Kagawa']],
      ['Okada\'s defensive system relied heavily on an incredibly tireless, deep-lying defensive midfielder who swept up in front of the back four. Who was he?', ['Makoto Hasebe', 'Junichi Inamoto', 'Yuki Abe', 'Yasuyuki Konno'], 'D', ['Deep-lying midfielder', 'Sweeping in front of defense', 'Yasuyuki Konno']],
      ['Okada famously offered to do what just weeks before the World Cup began, following a terrible run of friendly defeats against South Korea and Serbia?', ['Forfeit his salary', 'Drop his captain from the squad', 'Resign as manager immediately', 'Switch entirely to a 5-man defense'], 'C', ['Pre-tournament crisis', 'Friendly defeats', 'Offered to resign']],
      ['In their crucial final group match against Denmark, Okada\'s team executed two of the greatest goals of the tournament to win 3-1. How were they scored?', ['Two counter-attacking chip shots', 'Two diving headers', 'Two spectacular direct free-kicks (by Honda and Endō)', 'Two penalties'], 'C', ['3-1 vs Denmark', 'Two great goals', 'Honda and Endō free-kicks']],
      ['Okada instructed which veteran playmaker, who had been the face of Japanese football for a decade, to accept a bench role for the good of the team\'s defensive shape?', ['Hidetoshi Nakata', 'Shunsuke Nakamura', 'Shinji Ono', 'Yoshikatsu Kawaguchi'], 'B', ['Veteran benched', 'Defensive shape sacrifice', 'Shunsuke Nakamura']],
      ['In the Round of 16, Okada\'s defensive masterclass held an aggressive South American team to a 0-0 draw for 120 minutes. Who did they play?', ['Uruguay', 'Chile', 'Paraguay', 'Argentina'], 'C', ['Round of 16', '0-0 for 120 minutes', 'Paraguay']],
      ['Okada\'s historic run tragically ended in the ensuing penalty shootout. Which Japanese player heartbreakingly hit the crossbar, resulting in elimination?', ['Keisuke Honda', 'Makoto Hasebe', 'Yūichi Komano', 'Yuto Nagatomo'], 'C', ['Penalty shootout exit', 'Hit the crossbar', 'Yūichi Komano']],
      ['Takeshi Okada holds a massive place in Japanese football history not just for 2010, but because he was also the manager who did what?', ['Won their first-ever Asian Cup', 'Managed Japan in their first-ever World Cup appearance in 1998', 'Scored Japan\'s first World Cup goal as a player', 'Founded the J-League'], 'B', ['Historic role', 'First World Cup manager', '1998 debut']],
      ['Okada\'s incredible success in 2010 was built on elite fitness levels. Japanese media praised his team for acting like what specific historical figures on the pitch?', ['Emperors', 'Ninjas', 'Samurai (working relentlessly for the collective)', 'Kamikaze pilots'], 'C', ['Elite fitness culture', 'Media praise', 'Samurai collective spirit']],
    ],
  },
  {
    comment: 'Miguel Herrera - Mexico 2014 World Cup Campaign',
    prefix: 'herrera-mex',
    items: [
      ['Miguel "Piojo" Herrera was brought in as a total emergency appointment to save Mexico\'s 2014 qualification. How did they ultimately qualify for the tournament?', ['Winning the CONCACAF Gold Cup', 'Winning a high-pressure intercontinental playoff against New Zealand', 'Winning a coin toss against Costa Rica', 'The USA scored a 90th-minute goal to send them through'], 'B', ['Emergency appointment', '2014 qualification route', 'Playoff vs New Zealand']],
      ['Herrera deployed a highly aggressive, high-energy tactical system that relied entirely on overlapping wing-backs. What was his base formation?', ['4-3-3', '4-4-2 diamond', '5-3-2 (or 3-5-2)', '4-2-3-1'], 'C', ['Overlapping wing-backs', 'High-energy system', '5-3-2 or 3-5-2']],
      ['Herrera famously commanded global attention during the tournament not just for his tactics, but for what touchline behavior?', ['He wore a tuxedo to every match', 'He refused to leave the dugout', 'His explosive, wild, and incredibly meme-able goal celebrations', 'He chain-smoked cigars during the game'], 'C', ['Touchline fame', 'Global attention', 'Wild goal celebrations']],
      ['Herrera anchored his 3-man central defense with which legendary, 35-year-old veteran captain, who became the first player to captain a nation in four World Cups?', ['Claudio Suárez', 'Rafael Márquez', 'Héctor Moreno', 'Carlos Salcido'], 'B', ['Four World Cups as captain', '35-year-old leader', 'Rafael Márquez']],
      ['In the group stage, Herrera masterminded a legendary 0-0 draw against host nation Brazil, relying on an alien performance from which curly-haired goalkeeper?', ['Jorge Campos', 'Oswaldo Sánchez', 'Guillermo "Memo" Ochoa', 'Jesús Corona'], 'C', ['0-0 vs Brazil', 'Goalkeeper heroics', 'Memo Ochoa']],
      ['Herrera famously banned his players from doing two specific things during the World Cup training camp. One was having sex. What was the other?', ['Drinking alcohol', 'Using social media', 'Eating beef (due to the risk of testing positive for the banned substance clenbuterol)', 'Speaking to their families'], 'C', ['Training camp bans', 'Clenbuterol risk', 'No beef']],
      ['To dominate the midfield transitions, Herrera utilized a brilliant, box-to-box pairing of Andrés Guardado and which other dynamic midfielder?', ['Carlos Peña', 'Héctor Herrera', 'José Juan Vázquez', 'Marco Fabián'], 'C', ['Midfield pairing', 'Box-to-box duo', 'José Juan Vázquez']],
      ['In the Round of 16 against the Netherlands, Herrera\'s team took a 1-0 lead early in the second half thanks to a brilliant long-range strike by who?', ['Javier "Chicharito" Hernández', 'Oribe Peralta', 'Giovani dos Santos', 'Raúl Jiménez'], 'C', ['Round of 16 vs Netherlands', '1-0 lead', 'Giovani dos Santos']],
      ['Herrera\'s tactical dream collapsed in the 88th minute when Wesley Sneijder equalized, followed by a deeply controversial 94th-minute penalty won by Arjen Robben. What famous phrase was born from this moment?', ['The Dive of Fortaleza', '"No era penal" (It wasn\'t a penalty)', 'The Robbery of Robben', 'The Dutch Deception'], 'B', ['Controversial Robben penalty', 'Famous phrase born', 'No era penal']],
      ['After his immense success in 2014, Herrera\'s tenure as Mexico manager ended abruptly in 2015 for what shocking non-football reason?', ['He insulted the Mexican President', 'He physically punched a journalist in an airport', 'He was caught fixing matches', 'He signed with an MLS team in secret'], 'B', ['2015 abrupt exit', 'Non-football reason', 'Punched journalist at airport']],
    ],
  },
];

const diffs = ['easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];

const lines = [];
for (const block of blocks) {
  lines.push('', `  // ${block.comment}`);
  block.items.forEach(([question, opts, ok, hints], i) => {
    lines.push(q(`${block.prefix}-${i + 1}`, diffs[i], question, opts, ok, hints) + ',');
  });
}

const insert = lines.join('\n') + '\n\n';
src = src.replace(marker, insert + marker);
fs.writeFileSync(file, src);
console.log('Patched 30 manager questions');

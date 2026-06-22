import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('osim-yug-1')) {
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

const items = [
  ['Ivica Osim brilliantly managed the Yugoslavian national team to the 1990 quarter-finals amidst massive pressure, as the country was actively doing what?', ['Being invaded by the Soviet Union', 'Fracturing politically into civil war', 'Hosting the Olympic Games at the same time', 'Transitioning to a strict communist dictatorship'], 'B', ['1990 political backdrop', 'Massive off-pitch pressure', 'Fracturing into civil war']],
  ['Osim was renowned for his elegant playing style in his youth and his smooth tactical setups as a manager. What was his elegant nickname?', ['The Balkan Prince', 'The Strauss from Grbavica', 'The Maestro of Sarajevo', 'The General'], 'B', ['Elegant nickname', 'Grbavica connection', 'The Strauss from Grbavica']],
  ['Osim\'s team played a highly technical, fluid possession style that relied heavily on dribbling. Because of this, what was the Yugoslavian team famously called?', ['The Red Star Machine', 'The Balkan Carousel', 'The Brazilians of Europe', 'The Danubian Whirl'], 'C', ['Technical dribbling style', 'Famous team nickname', 'The Brazilians of Europe']],
  ['Osim completely built his midfield around the genius of which legendary Number 10, nicknamed "Piksi"?', ['Dejan Savićević', 'Dragan Stojković', 'Robert Prosinečki', 'Safet Sušić'], 'B', ['Number 10 nicknamed Piksi', 'Midfield genius', 'Dragan Stojković']],
  ['In the Round of 16 against Spain, Osim\'s tactics paid off when Stojković scored two brilliant goals. What did he do for his famous first goal?', ['Scored from a 40-yard free-kick', 'Faked a shot so perfectly that the defender slid completely past him, then passed it into the net', 'Scored a bicycle kick', 'Chipped the goalkeeper from outside the box'], 'B', ['Round of 16 vs Spain', 'Famous first goal', 'Fake shot and square pass']],
  ['In the quarter-final against Diego Maradona\'s Argentina, Osim\'s tactical setup faced a nightmare when what happened in the 31st minute?', ['Their goalkeeper was sent off', 'Refik Šabanadžović was given a red card for man-marking Maradona too aggressively', 'They conceded two penalties', 'Dragan Stojković tore his ACL'], 'B', ['Quarter-final vs Argentina', '31st-minute nightmare', 'Šabanadžović sent off']],
  ['Despite playing with 10 men for 90 minutes (including extra time), Osim\'s brilliant defensive organization held Argentina to what scoreline?', ['1-1', '0-0', '2-2', '1-0 (lost in 120th min)'], 'B', ['Ten men for 120 minutes', 'Defensive organization', '0-0 through extra time']],
  ['Osim\'s incredible run ended when Yugoslavia lost the ensuing penalty shootout to Argentina. Which three legendary players heartbreakingly missed their penalties?', ['Šuker, Boban, Prosinečki', 'Stojković, Brnović, Hadžibegić', 'Savićević, Pančev, Sušić', 'Katanec, Vujović, Jozić'], 'B', ['Penalty shootout defeat', 'Three missed penalties', 'Stojković, Brnović, Hadžibegić']],
  ['As manager, Osim faced immense, toxic pressure from politicians and the media to select his squad based on what non-football criteria?', ['Which domestic club paid the biggest bribes', 'Strict ethnic and regional quotas (balancing Serbs, Croats, Bosniaks, etc.)', 'Players who were active in the military', 'Players who refused to play in Western Europe'], 'B', ['Squad selection pressure', 'Non-football criteria', 'Ethnic and regional quotas']],
  ['In 1992, as the Bosnian War erupted and Sarajevo was placed under siege, Ivica Osim produced one of the most emotional moments in football history by doing what?', ['Leading a unified team to win Euro 92', 'Resigning in a tearful press conference, stating his family was being bombed in Sarajevo', 'Refusing to manage until the UN intervened', 'Moving the entire national team to train in Switzerland'], 'B', ['1992 Bosnian War', 'Emotional press conference', 'Resigned as family bombed in Sarajevo']],
];

const diffs = ['easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];

const lines = ['', '  // Ivica Osim - Yugoslavia 1990 World Cup Campaign'];
items.forEach(([question, opts, ok, hints], i) => {
  lines.push(q(`osim-yug-${i + 1}`, diffs[i], question, opts, ok, hints) + ',');
});

const insert = lines.join('\n') + '\n\n';
src = src.replace(marker, insert + marker);
fs.writeFileSync(file, src);
console.log('Patched 10 Osim manager questions');

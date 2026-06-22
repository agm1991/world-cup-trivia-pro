import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('martino-par-1')) {
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
    comment: 'Gerardo Martino - Paraguay 2010 World Cup Campaign',
    prefix: 'martino-par',
    items: [
      ['Gerardo "Tata" Martino led Paraguay to their best-ever finish in World Cup history in 2010. How far did they go?', ['Round of 16', 'Quarter-finals', 'Semi-finals', 'Third place'], 'B', ['Best-ever finish', '2010 run', 'Quarter-finals']],
      ['Martino transformed Paraguay from a traditionally defensive team into a high-pressing, compact unit. What nationality is Martino?', ['Paraguayan', 'Uruguayan', 'Argentine', 'Chilean'], 'C', ['Tata Martino nationality', 'High-pressing coach', 'Argentine']],
      ['Martino utilized a highly aggressive three-man attack that pressed from the front. Which of these strikers was NOT part of his primary rotation in 2010?', ['Roque Santa Cruz', 'Nelson Valdez', 'Lucas Barrios', 'Salvador Cabañas (He was tragically shot in the head months before the tournament)'], 'D', ['Primary striker rotation', 'Not in squad', 'Salvador Cabañas']],
      ['In the group stage, Martino\'s team shocked the world by securing a 1-1 draw against which reigning World Cup champions?', ['France', 'Italy', 'Brazil', 'Germany'], 'B', ['Group stage shock', '1-1 draw', 'Italy']],
      ['Martino anchored his midfield with incredibly combative "destroyers" who stopped opposition attacks dead. Who was the naturalized Argentine who dictated the tempo?', ['Cristian Riveros', 'Néstor Ortigoza', 'Enrique Vera', 'Edgar Barreto'], 'B', ['Naturalized Argentine', 'Tempo dictator', 'Néstor Ortigoza']],
      ['In the Round of 16, Martino\'s exhausted team played out a 0-0 draw and advanced by winning a penalty shootout against which Asian nation?', ['South Korea', 'Japan', 'Australia', 'Iran'], 'B', ['Round of 16 shootout', '0-0 for 120 minutes', 'Japan']],
      ['Martino\'s absolute tactical masterpiece came in the quarter-finals, where his aggressive pressing held the legendary "Tiki-taka" of Spain to a 0-0 draw until what minute?', ['60th minute', '75th minute', '83rd minute (when David Villa scored)', '119th minute'], 'C', ['Quarter-final vs Spain', 'Held 0-0 until', '83rd minute Villa goal']],
      ["That quarter-final match against Spain featured an insane 3-minute sequence of pure drama that defined Martino's campaign. What happened?", ['Three red cards were issued', 'Paraguay missed a penalty, Spain went down and won a penalty, scored it, had to retake it, and missed the retake', 'Spain scored two own goals that were both ruled offside', 'The stadium lights went out during a breakaway'], 'B', ['Chaotic 3-minute sequence', 'Penalty drama', 'Missed and retaken penalties']],
      ['Who was the Paraguayan striker that heartbreakingly had his penalty saved by Iker Casillas during that chaotic sequence?', ['Nelson Valdez', 'Roque Santa Cruz', 'Óscar Cardozo', 'Edgar Benítez'], 'C', ['Saved penalty', 'Casillas save', 'Óscar Cardozo']],
      ["Following his immense success with Paraguay, Martino's tactical reputation exploded, leading him to eventually manage which massive club team?", ['Real Madrid', 'Barcelona', 'Bayern Munich', 'Manchester United'], 'B', ['Post-Paraguay career', 'Massive club job', 'Barcelona']],
    ],
  },
  {
    comment: 'Karl Rappan - Switzerland 1954 World Cup Campaign',
    prefix: 'rappan-sui',
    items: [
      ['Karl Rappan is globally recognized as the inventor of a revolutionary defensive tactical system that would completely change football. What was it called?', ['Catenaccio', 'The Magic Square', 'Total Football', 'The Verrou (The Swiss Bolt)'], 'D', ['Revolutionary defensive system', 'Rappan invention', 'The Verrou']],
      ['Rappan\'s brilliant system relied on withdrawing a midfield player to sit entirely behind the defensive line to sweep up through balls. What is this position known as today?', ['The False 9', 'The Regista', 'The Sweeper (Libero)', 'The Anchor'], 'C', ['Withdrawn midfielder role', 'Behind defensive line', 'Sweeper or Libero']],
      ['Rappan managed Switzerland in 1954 to an incredible quarter-final run. What massive advantage did his team have?', ['They played with lighter footballs', 'They were the host nation', 'They were allowed 5 substitutions', "They didn't have to play a group stage"], 'B', ['1954 advantage', 'Home support', 'Host nation']],
      ['In the group stage, Rappan\'s tactics resulted in a brilliant 4-1 playoff victory to eliminate which massive European powerhouse?', ['West Germany', 'England', 'Italy', 'Spain'], 'C', ['Group stage playoff', '4-1 victory', 'Italy eliminated']],
      ["Rappan's incredibly rigid defensive system was built to support the counter-attacking brilliance of which star Swiss striker, who scored 6 goals in the tournament?", ['Robert Ballaman', 'Josef Hügi', 'Jacques Fatton', 'Charles Antenen'], 'B', ['Six tournament goals', 'Counter-attacking star', 'Josef Hügi']],
      ["Rappan's quarter-final match against Austria broke down completely and became the highest-scoring match in World Cup history. What was the final score?", ['5-4', '6-5', '7-5 (Austria won)', '8-4'], 'C', ['Highest-scoring World Cup match', 'Quarter-final meltdown', '7-5 Austria']],
      ['This legendary, exhausting quarter-final match was played in 104°F (40°C) weather, causing players to hallucinate and collapse. What is the match historically known as?', ['The Alpine Meltdown', 'The Heat Battle of Lausanne (Hitzeschlacht von Lausanne)', 'The Swiss Sauna', 'The Sunstroke Game'], 'B', ['Extreme heat', 'Historical nickname', 'Hitzeschlacht von Lausanne']],
      ['Despite managing the Swiss national team to tactical immortality across four different stints, what nationality was Karl Rappan by birth?', ['German', 'French', 'Austrian', 'Hungarian'], 'C', ['Rappan nationality', 'Born outside Switzerland', 'Austrian']],
      ['Before inventing his defensive system, Rappan realized he needed to create it because Swiss players generally lacked what compared to other nations?', ['Tactical intelligence', 'Individual technical skill and professional status (they were amateurs)', 'Physical height', 'Goalkeeping ability'], 'B', ['Why Verrou was needed', 'Swiss player limitations', 'Amateurs lacking technical skill']],
      ['Rappan\'s "Verrou" system heavily influenced which legendary manager, who took the concept and evolved it into the ruthless Italian "Catenaccio" in the 1960s?', ['Vittorio Pozzo', 'Helenio Herrera', 'Nereo Rocco', 'Enzo Bearzot'], 'B', ['Verrou influence', 'Evolved into Catenaccio', 'Helenio Herrera']],
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
console.log('Patched 20 manager questions');

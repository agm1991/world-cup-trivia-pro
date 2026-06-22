import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('hiddink-aus-1')) {
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
    comment: 'Guus Hiddink - Australia 2006 World Cup Campaign',
    prefix: 'hiddink-aus',
    items: [
      ['Guus Hiddink became a national hero by breaking a massive World Cup drought for Australia. Prior to 2006, when was their last World Cup appearance?', ['1966', '1974', '1982', '1990'], 'B', ['World Cup drought', 'Last appearance before 2006', '1974']],
      ['Hiddink guided Australia to the 2006 tournament via an incredibly tense intercontinental playoff against Uruguay. How did Australia win the tie?', ['A Golden Goal in extra time', 'The away goals rule', 'A penalty shootout (with John Aloisi scoring the winner)', 'A 90th-minute free-kick'], 'C', ['Uruguay playoff', 'Qualified for 2006', 'Aloisi penalty winner']],
      ['In their opening match against Japan, Hiddink made incredibly aggressive, attacking substitutions when trailing 1-0. How did the match end?', ['A 1-1 draw', 'Australia scored 3 goals in the final 6 minutes to win 3-1', 'Japan won 2-0 on a counter-attack', 'Australia won 2-1 with a last-second penalty'], 'B', ['Opening match vs Japan', 'Late comeback', '3 goals in 6 minutes']],
      ['Hiddink utilized a highly physical, aggressive attacking midfielder who thrived on late runs into the box, scoring two crucial goals against Japan. Who was he?', ['Harry Kewell', 'Mark Viduka', 'Tim Cahill', 'Brett Emerton'], 'C', ['Two goals vs Japan', 'Late runs into box', 'Tim Cahill']],
      ['To execute his fluid, high-pressing 3-6-1 / 4-2-3-1 hybrid formation, Hiddink relied on which legendary Australian forward, who scored a dramatic equalizer against Croatia?', ['John Aloisi', 'Harry Kewell', 'Mark Bresciano', 'Craig Moore'], 'A', ['Croatia equalizer', 'Hybrid formation focal point', 'John Aloisi']],
      ["Hiddink's incredible run to the Round of 16 ended in massive controversy against eventual champions Italy. Australia lost 1-0 due to a 95th-minute penalty won by who?", ['Luca Toni', 'Fabio Grosso', 'Francesco Totti', 'Alessandro Del Piero'], 'B', ['Round of 16 vs Italy', '95th-minute penalty', 'Fabio Grosso']],
      ['Which Italian player stepped up and smashed that 95th-minute penalty past Mark Schwarzer to break Australian hearts?', ['Andrea Pirlo', 'Alessandro Del Piero', 'Francesco Totti', 'Vincenzo Iaquinta'], 'C', ['Penalty converted', 'Schwarzer beaten', 'Francesco Totti']],
      ['Hiddink\'s tactical preparation was legendary, but his workload was insane. During his time managing Australia through the 2006 World Cup, he was simultaneously the full-time manager of which major European club?', ['Chelsea', 'Real Madrid', 'Ajax', 'PSV Eindhoven'], 'D', ['Dual role', 'Club job during World Cup', 'PSV Eindhoven']],
      ['Hiddink anchored his defense with a rugged, ball-playing centre-back pairing. Which tough-tackling defender captained the side throughout the group stages?', ['Lucas Neill', 'Mark Viduka', 'Craig Moore', 'Tony Popovic'], 'B', ['Group stage captain', 'Tough-tackling leader', 'Mark Viduka']],
      ['Because of his legendary, Midas-touch success with the Netherlands, South Korea, and Australia, what affectionate nickname was Hiddink given by the press?', ['The Professor', 'Guus Geluk (Lucky Guus / Magic Guus)', 'The Dutch Master', 'The General'], 'B', ['Press nickname', 'Midas touch', 'Guus Geluk']],
    ],
  },
  {
    comment: 'Mick McCarthy - Republic of Ireland 2002 World Cup Campaign',
    prefix: 'mccarthy-irl',
    items: [
      ["Mick McCarthy's 2002 World Cup campaign is permanently overshadowed by the most infamous pre-tournament bust-up in football history. What is the incident known as?", ['The Dublin Disaster', 'The Tokyo Tear-up', 'The Saipan Incident', 'The Keane Mutiny'], 'C', ['Pre-tournament bust-up', 'Infamous incident name', 'The Saipan Incident']],
      ['The incident culminated in McCarthy sending which world-class player and team captain home before the tournament even started following a massive, expletive-laden tirade?', ['Robbie Keane', 'Shay Given', 'Roy Keane', 'Denis Irwin'], 'C', ['Captain sent home', 'Pre-tournament exit', 'Roy Keane']],
      ['Despite losing his captain and facing immense media pressure, McCarthy\'s heavily united squad secured a famous 1-1 group stage draw against which eventual finalist?', ['Brazil', 'Germany', 'Italy', 'Spain'], 'B', ['Group stage draw', 'Eventual finalist', 'Germany']],
      ['Who scored the dramatic, 92nd-minute stoppage-time equalizer against Germany to keep McCarthy\'s tactical hopes alive?', ['Niall Quinn', 'Matt Holland', 'Robbie Keane', 'Damien Duff'], 'C', ['92nd-minute equalizer', 'Vs Germany', 'Robbie Keane']],
      ['To fill the massive tactical and leadership void left in the center of the pitch, McCarthy relied on the incredible work rate of which energetic midfielder, who scored a brilliant goal against Cameroon?', ['Mark Kinsella', 'Jason McAteer', 'Kevin Kilbane', 'Matt Holland'], 'B', ['Goal vs Cameroon', 'Energetic midfielder', 'Jason McAteer']],
      ['McCarthy frequently utilized which dynamic, left-footed winger in a free role off the striker to stretch defenses and create chaos?', ['Kevin Kilbane', 'Damien Duff', 'Jason McAteer', 'Gary Kelly'], 'B', ['Free role winger', 'Stretch defenses', 'Damien Duff']],
      ['In the Round of 16 against Spain, McCarthy\'s team went down 1-0 early but showed incredible resilience. How did they equalize in the 90th minute to force extra time?', ['A header from a corner', 'A direct free-kick', 'A Robbie Keane penalty kick', 'An own goal by Carles Puyol'], 'C', ['90th-minute equalizer', 'Round of 16 vs Spain', 'Robbie Keane penalty']],
      ['McCarthy\'s thrilling, drama-filled campaign finally ended when Ireland lost to Spain in a penalty shootout. Which legendary Irish goalkeeper saved a penalty in normal time but couldn\'t stop the shootout loss?', ['Alan Kelly', 'Dean Kiely', 'Shay Given', 'Packie Bonner'], 'C', ['Penalty saved in normal time', 'Shootout heartbreak', 'Shay Given']],
      ['McCarthy relied heavily on a veteran target man as an impact substitute to win long balls and knock-downs in the final minutes of games. Who was he?', ['Clinton Morrison', 'David Connolly', 'Niall Quinn', 'Richard Dunne'], 'C', ['Impact substitute', 'Target man', 'Niall Quinn']],
      ['Before becoming manager, Mick McCarthy was a legendary player for Ireland, serving as captain at the 1990 World Cup under which legendary manager?', ['Eoin Hand', 'Jack Charlton', 'Brian Kerr', 'Giovanni Trapattoni'], 'B', ['Player captain 1990', 'Under which manager', 'Jack Charlton']],
    ],
  },
  {
    comment: 'Köbi Kuhn - Switzerland 2006 World Cup Campaign',
    prefix: 'kuhn-sui',
    items: [
      ['Köbi Kuhn managed Switzerland to a famous run in 2006 where his highly organized tactical system set an unbreakable World Cup record. What was it?', ['They played 4 games without committing a single foul', 'They scored all their goals from outside the box', 'They were eliminated from the tournament without conceding a single goal', 'They never received a single yellow card'], 'C', ['2006 record', 'Eliminated without conceding', 'Four clean sheets']],
      ['Kuhn\'s ultra-disciplined 4-5-1 defensive block proved its worth immediately in the opening match, securing a 0-0 draw against which tournament favorite?', ['Brazil', 'Spain', 'France', 'Argentina'], 'C', ['Opening 0-0', 'Tournament favorite held', 'France']],
      ['Kuhn\'s impenetrable defense was anchored by which massive, physical centre-back who played his club football for Arsenal at the time?', ['Patrick Müller', 'Philippe Senderos', 'Johan Djourou', 'Ludovic Magnin'], 'B', ['Arsenal centre-back', 'Defensive anchor', 'Philippe Senderos']],
      ['To provide a counter-attacking threat, Kuhn relied entirely on the finishing ability of which legendary Swiss striker, who scored twice in the group stages?', ['Marco Streller', 'Hakan Yakin', 'Alexander Frei', 'Johan Vonlanthen'], 'C', ['Two group goals', 'Counter-attacking threat', 'Alexander Frei']],
      ['In the Round of 16, Kuhn\'s team completely nullified their opponents in a gritty, tactical stalemate that ended 0-0 after 120 minutes. Who did they play?', ['Italy', 'Ukraine', 'Sweden', 'Mexico'], 'B', ['Round of 16 stalemate', '0-0 for 120 minutes', 'Ukraine']],
      ['Switzerland lost the ensuing penalty shootout in historic fashion. What disastrous, unwanted World Cup record did Kuhn\'s team set during this shootout?', ['They kicked three penalties over the crossbar', 'They became the first team in history to fail to score a single penalty in a shootout (losing 3-0)', 'They subbed on a goalkeeper who had never played a professional match', 'They had two players refuse to take a penalty'], 'B', ['Penalty shootout record', 'Zero penalties scored', 'Lost 3-0 on pens']],
      ['Kuhn\'s midfield screen was led by a technically gifted, deep-lying playmaker who served as the team\'s captain and played for AC Milan. Who was he?', ['Tranquillo Barnetta', 'Gökhan Inler', 'Johann Vogel', 'Raphael Wicky'], 'C', ['Captain and playmaker', 'AC Milan midfielder', 'Johann Vogel']],
      ['Which Swiss goalkeeper executed Kuhn\'s defensive game plan flawlessly, keeping four consecutive clean sheets throughout the tournament?', ['Diego Benaglio', 'Fabio Coltorti', 'Pascal Zuberbühler', 'Yann Sommer'], 'C', ['Four clean sheets', 'Flawless execution', 'Pascal Zuberbühler']],
      ['Off the pitch, Kuhn showed immense personal strength. During the 2006 World Cup, he was managing through severe emotional turmoil for what tragic reason?', ['He was battling a terminal illness', 'His wife, Alice, was hospitalized in an epileptic coma just before the tournament began', 'He had been fired by his club team the week prior', 'His home in Switzerland burned down'], 'B', ['Personal turmoil', 'Wife hospitalized', 'Epileptic coma']],
      ['Despite the heartbreaking penalty shootout exit, Köbi Kuhn is celebrated as the manager who ushered in Switzerland\'s modern football era. What was his primary focus before managing the senior side?', ['Managing in the German Bundesliga', 'Rebuilding the Swiss youth national teams (U17 to U21)', 'Acting as the president of the Swiss FA', 'Managing the Swiss Olympic team'], 'B', ['Modern era builder', 'Before senior role', 'Youth national teams']],
    ],
  },
  {
    comment: 'Oleg Blokhin - Ukraine 2006 World Cup Campaign',
    prefix: 'blokhin-ukr',
    items: [
      ["Oleg Blokhin managed Ukraine to the 2006 quarter-finals in what was the country's first-ever appearance as an independent nation. Before this, what nation did Blokhin star for as a legendary player?", ['Russia', 'Soviet Union', 'Yugoslavia', 'Czechoslovakia'], 'B', ['Playing career nation', 'Before independence', 'Soviet Union']],
      ["Blokhin's tactical setup was a robust, counter-attacking 3-5-2 completely built around feeding the ball to which world-class AC Milan striker?", ['Serhiy Rebrov', 'Andriy Voronin', 'Andriy Shevchenko', 'Artem Milevskyi'], 'C', ['3-5-2 focal point', 'AC Milan striker', 'Andriy Shevchenko']],
      ['Ukraine\'s tournament started with an absolute tactical disaster. They were thoroughly dismantled and lost 4-0 to which European powerhouse?', ['Italy', 'Germany', 'Spain', 'France'], 'C', ['Opening disaster', '4-0 defeat', 'Spain']],
      ['Blokhin famously motivated his team after the 4-0 defeat by making strict defensive adjustments, heavily relying on which blonde-haired, combative defensive midfielder as his enforcer?', ['Ruslan Rotan', 'Oleh Husyev', 'Anatoliy Tymoshchuk', 'Maksym Kalynychenko'], 'C', ['Midfield enforcer', 'Post-Spain adjustments', 'Anatoliy Tymoshchuk']],
      ['In the Round of 16 against Switzerland, the match went to penalties after an exhausting 0-0 draw. What bizarre, highly emotional thing did Blokhin do during the shootout?', ['He turned his back to the pitch and prayed loudly', 'He argued with the referee during every kick', 'He retreated to the dressing room because he was too nervous to watch the penalties', 'He stood in the stands with the fans'], 'C', ['Penalty shootout nerves', 'Too nervous to watch', 'Retreated to dressing room']],
      ['Who was the brilliant Ukrainian goalkeeper who saved two penalties in that shootout, becoming a national hero while Blokhin hid in the dressing room?', ['Andriy Pyatov', 'Oleksandr Shovkovskiy', 'Bohdan Shust', 'Maksym Koval'], 'B', ['Two penalty saves', 'National hero', 'Oleksandr Shovkovskiy']],
      ['Ukraine\'s incredible debut run was ended in the quarter-finals by the eventual tournament champions. Who defeated them 3-0?', ['France', 'Italy', 'Germany', 'Portugal'], 'B', ['Quarter-final exit', 'Eventual champions', 'Italy 3-0']],
      ['Blokhin frequently paired Shevchenko up front with which dynamic, creative forward to link the midfield to the attack?', ['Artem Milevskyi', 'Andriy Vorobey', 'Serhiy Rebrov', 'Oleksiy Byelik'], 'C', ['Shevchenko partner', 'Creative forward link', 'Serhiy Rebrov']],
      ['As a player, Oleg Blokhin was so incredibly talented that he won football\'s ultimate individual prize in 1975. What was it?', ['The Golden Boot', 'The European Golden Shoe', 'The Ballon d\'Or', 'The FIFA World Player of the Year'], 'C', ['1975 individual prize', 'Player legend', 'Ballon d\'Or']],
      ['During the qualifiers for the 2006 World Cup, Blokhin made a bold promise to the media that was heavily mocked at the time, but he ultimately delivered on it. What was it?', ['He promised Ukraine would reach the semi-finals', "He promised they wouldn't concede a single goal", 'He promised Ukraine would qualify from their group in first place (ahead of Turkey and Denmark)', 'He promised Shevchenko would score 10 goals'], 'C', ['Bold qualifier promise', 'First place in group', 'Ahead of Turkey and Denmark']],
    ],
  },
  {
    comment: 'Jimmy Murphy - Wales 1958 World Cup Campaign',
    prefix: 'murphy-wal',
    items: [
      ['Jimmy Murphy led Wales to the 1958 quarter-finals just months after surviving what massive tragedy (because he was away managing Wales on the night it occurred)?', ['The Hillsborough Disaster', 'The Munich Air Disaster', 'The Superga Air Disaster', 'The Heysel Disaster'], 'B', ['1958 tragedy survived', 'Away with Wales that night', 'Munich Air Disaster']],
      ['While managing the Welsh national team in 1958, Murphy was simultaneously the assistant manager (and then the caretaker manager) for which legendary English club team?', ['Liverpool', 'Arsenal', 'Manchester United', 'Everton'], 'C', ['Dual club role', 'Caretaker manager', 'Manchester United']],
      ['Murphy\'s Welsh team featured one of the greatest British players of all time, a world-class Juventus forward nicknamed "The Gentle Giant." Who was he?', ['Ivor Allchurch', 'Cliff Jones', 'John Charles', 'Terry Medwin'], 'C', ['The Gentle Giant', 'Juventus forward', 'John Charles']],
      ['In the group stage, Murphy\'s incredibly resilient team astonishingly drew all three of their matches against Hungary, Mexico, and which host nation?', ['France', 'West Germany', 'Sweden', 'Switzerland'], 'C', ['Three group draws', 'Host nation in group', 'Sweden']],
      ['Because they tied on points, Murphy\'s team had to play a grueling playoff match to reach the quarter-finals. Who did they defeat 2-1 in this playoff?', ['Mexico', 'Hungary', 'Soviet Union', 'Czechoslovakia'], 'B', ['Playoff victory', '2-1 to reach QF', 'Hungary']],
      ["Murphy's tactical plans for the quarter-final were devastated when his star player, John Charles, was ruled out due to injury. Who was their massive quarter-final opponent?", ['West Germany', 'France', 'Brazil', 'Argentina'], 'C', ['Quarter-final opponent', 'Charles injured', 'Brazil']],
      ['Despite an incredible, heroic defensive performance, Wales lost the quarter-final 1-0. Who scored his first-ever World Cup goal to eliminate Murphy\'s team?', ['Garrincha', 'Vavá', 'Pelé', 'Didi'], 'C', ['Quarter-final winner', 'First World Cup goal', 'Pelé']],
      ['Murphy\'s deep defensive setup relied heavily on the incredible reflexes and bravery of which legendary Arsenal goalkeeper?', ['Neville Southall', 'Jack Kelsey', 'Dai Davies', 'Wayne Hennessey'], 'B', ['Legendary goalkeeper', 'Arsenal keeper', 'Jack Kelsey']],
      ['What incredible historical legacy does Jimmy Murphy hold regarding the Welsh national team and the World Cup?', ['He is the only Welsh manager to win a World Cup match', 'He managed them in three different decades', 'He managed them during their only World Cup appearance for 64 years (until they qualified again in 2022)', 'He never lost a competitive match as Wales manager'], 'C', ['Historical legacy', 'Only WC for 64 years', 'Until 2022 qualification']],
      ['Following the Munich Air Disaster, Murphy had to take over Manchester United while Matt Busby recovered in the hospital. What did Busby famously tell Murphy from his hospital bed?', ['"Win the league for the boys."', '"Take care of my family."', '"Keep the flag flying, Jimmy."', '"Never give up the fight."'], 'C', ['Busby hospital message', 'Famous words', 'Keep the flag flying']],
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
console.log('Patched 50 manager questions');

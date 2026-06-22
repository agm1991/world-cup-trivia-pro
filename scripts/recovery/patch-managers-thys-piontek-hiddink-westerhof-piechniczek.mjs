import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('thys-bel-1')) {
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
    comment: 'Guy Thys - Belgium 1986 World Cup Campaign',
    prefix: 'thys-bel',
    items: [
      ["Guy Thys managed Belgium's golden generation to a 4th-place finish in 1986. What was his incredibly relaxed, trademark sideline habit during matches?", ['Drinking a glass of wine', 'Smoking a thick cigar', 'Sitting in a lawn chair', 'Reading a newspaper'], 'B', ['Trademark sideline habit', 'Relaxed touchline style', 'Smoking a thick cigar']],
      ['Thys relied on an incredibly organized defense that executed what specific, highly risky defensive tactic better than anyone else in the tournament?', ['Triple man-marking', 'The offside trap', 'A 6-man low block', 'The sweeper-keeper system'], 'B', ['Organized defense', 'Risky defensive tactic', 'The offside trap']],
      ["Thys handed the tactical keys to the midfield to which brilliant, 20-year-old playmaker who became the tournament's Best Young Player?", ['Franky Vercauteren', 'Enzo Scifo', 'Marc Wilmots', 'René Vandereycken'], 'B', ['Best Young Player', '20-year-old playmaker', 'Enzo Scifo']],
      ["In the Round of 16, Thys masterminded one of the greatest matches in World Cup history, defeating Valeriy Lobanovskyi's Soviet Union. What was the final score after extra time?", ['3-2', '4-3', '5-4', '2-1'], 'B', ['Round of 16 classic', 'Soviet Union defeated', '4-3 after extra time']],
      ['To execute his pragmatic, counter-attacking 3-5-2, Thys relied heavily on the tireless running and leadership of his captain, who played as an attacking midfielder. Who was he?', ['Eric Gerets', 'Jan Ceulemans', 'Georges Grün', 'Michel Preud\'homme'], 'B', ['Captain and AM', '3-5-2 leader', 'Jan Ceulemans']],
      ["In the quarter-finals, Thys's team survived a grueling 1-1 draw with Spain. How did Belgium advance to the semi-finals?", ['A Golden Goal', 'A 119th-minute free-kick', 'Winning 5-4 in a penalty shootout', 'Spain was disqualified'], 'C', ['Quarter-final vs Spain', '1-1 after extra time', '5-4 on penalties']],
      ['Thys had the luxury of a world-class, eccentric goalkeeper who saved a crucial penalty against Spain and kept Belgium in multiple games. Who was he?', ['Michel Preud\'homme', 'Jean-Marie Pfaff', 'Filip De Wilde', 'Christian Piot'], 'B', ['Eccentric goalkeeper', 'Penalty save vs Spain', 'Jean-Marie Pfaff']],
      ['Thys\'s incredible defensive structure was finally broken in the semi-finals by a legendary individual performance from Diego Maradona. How many goals did Maradona score to beat Belgium 2-0?', ['One', 'Two', 'Three', 'None (he provided two assists)'], 'B', ['Semi-final vs Argentina', 'Maradona brilliance', 'Two goals']],
      ['Before the 1986 World Cup, Guy Thys had already proven his tactical genius by leading Belgium to the final of which major tournament?', ['1982 World Cup', '1984 Olympics', 'Euro 1980', 'Euro 1984'], 'C', ['Pre-1986 success', 'Major final reached', 'Euro 1980']],
      ['Thys heavily relied on a combative, physical right-back nicknamed "The Lion of Flanders" to marshal the defense. Who was he?', ['Eric Gerets', 'Georges Grün', 'Stéphane Demol', 'Michel Renquin'], 'A', ['Right-back nicknamed Lion of Flanders', 'Physical defender', 'Eric Gerets']],
    ],
  },
  {
    comment: 'Sepp Piontek - Denmark 1986 World Cup Campaign',
    prefix: 'piontek-den',
    items: [
      ['Sepp Piontek transformed Denmark into an attacking juggernaut in 1986. Because of their explosive style, what legendary nickname was the team given?', ['The Red Machine', 'Danish Dynamite', 'The Nordic Express', 'The Great Danes'], 'B', ['Explosive attacking style', 'Legendary nickname', 'Danish Dynamite']],
      ['Despite managing the Danish national team for over a decade and becoming a cultural icon there, what nationality was Piontek?', ['Swedish', 'German', 'Dutch', 'Austrian'], 'B', ['Long tenure in Denmark', 'Cultural icon abroad', 'German']],
      ['Piontek completely changed the culture of Danish football. Before he arrived, what was the primary issue with the national team?', ['They refused to play teams outside of Europe', 'They were entirely amateurs who often drank beer and smoked before matches', 'They played an ultra-defensive Catenaccio style', "The government wouldn't allow them to travel"], 'B', ['Culture change', 'Pre-Piontek problems', 'Amateur drinking and smoking']],
      ['Piontek deployed an incredibly fluid, high-tempo 3-5-2 formation centered around the elegant playmaking of which legendary Number 10?', ['Allan Simonsen', 'Michael Laudrup', 'Søren Lerby', 'Frank Arnesen'], 'B', ['Fluid 3-5-2', 'Legendary Number 10', 'Michael Laudrup']],
      ['Piontek partnered his elegant playmaker with a chain-smoking, physical, and wildly unpredictable striker who scored four goals in the tournament. Who was he?', ['Jesper Olsen', 'Preben Elkjær', 'Klaus Berggreen', 'John Eriksen'], 'B', ['Four tournament goals', 'Physical unpredictable striker', 'Preben Elkjær']],
      ['In the "Group of Death," Piontek\'s tactics resulted in a legendary 6-1 thrashing of which South American powerhouse?', ['Argentina', 'Brazil', 'Uruguay', 'Colombia'], 'C', ['Group of Death', '6-1 thrashing', 'Uruguay']],
      ['Piontek\'s team swept their group with a 100% record, including a highly emotional 2-0 victory over which massive European rival?', ['Sweden', 'England', 'West Germany', 'Soviet Union'], 'C', ['Perfect group record', 'Emotional 2-0 win', 'West Germany']],
      ['Piontek\'s attacking philosophy had a fatal flaw: it left the defense exposed. In the Round of 16, they suffered a devastating 5-1 collapse against which nation?', ['Italy', 'Spain', 'Argentina', 'Brazil'], 'B', ['Round of 16 collapse', '5-1 defeat', 'Spain']],
      ['The collapse in the Round of 16 was sparked by a catastrophic defensive error when a Danish player blindly passed the ball across his own penalty box to Emilio Butragueño. Who made the pass?', ['Morten Olsen', 'Jesper Olsen', 'Søren Busk', 'Ivan Nielsen'], 'B', ['Butragueño gift', 'Own penalty box pass', 'Jesper Olsen']],
      ['To anchor his highly attacking midfield, Piontek relied heavily on the tireless engine and tackling of which dynamic central midfielder?', ['Søren Lerby', 'Jan Mølby', 'Frank Arnesen', 'Klaus Berggreen'], 'A', ['Midfield engine', 'Tireless tackler', 'Søren Lerby']],
    ],
  },
  {
    comment: 'Guus Hiddink - Netherlands 1998 World Cup Campaign',
    prefix: 'hiddink-ned',
    items: [
      ['Two years before the 1998 World Cup, Hiddink famously sent Edgar Davids home from Euro 96 for doing what?', ['Getting into a fistfight with the captain', "Giving an interview saying Hiddink \"must get his head out of players' asses\"", 'Refusing to come on as a substitute', 'Sneaking out of the team hotel'], 'B', ['Euro 96 controversy', 'Davids sent home', 'Infamous interview quote']],
      ['By 1998, Hiddink brilliantly reintegrated Davids into the squad, and Davids rewarded him by scoring the dramatic 92nd-minute winner in the Round of 16 against who?', ['Argentina', 'Yugoslavia', 'Mexico', 'Croatia'], 'B', ['Round of 16 winner', '92nd-minute goal', 'Yugoslavia']],
      ['Hiddink deployed a highly fluid Dutch 4-4-2/4-3-3. To make it work, he asked which incredibly versatile midfielder to play almost every position on the pitch, including left-back in the semi-final?', ['Clarence Seedorf', 'Ronald de Boer', 'Phillip Cocu', 'Wim Jonk'], 'C', ['Versatile midfielder', 'Played every position', 'Phillip Cocu']],
      ['In the quarter-final against Argentina, Hiddink\'s tactical patience paid off in the 90th minute with one of the greatest goals in World Cup history, scored by who?', ['Patrick Kluivert', 'Dennis Bergkamp', 'Marc Overmars', 'Boudewijn Zenden'], 'B', ['Quarter-final vs Argentina', '90th-minute stunner', 'Dennis Bergkamp']],
      ["That legendary 90th-minute goal against Argentina was set up by a breathtaking 60-yard diagonal pass from Hiddink's captain and center-back. Who was he?", ['Jaap Stam', 'Frank de Boer', 'Winston Bogarde', 'Michael Reiziger'], 'B', ['60-yard assist', 'Captain and center-back', 'Frank de Boer']],
      ['During the group stages, Hiddink was forced to adapt when his star striker, Patrick Kluivert, received a straight red card against Belgium for doing what?', ['Spitting on an opponent', 'Elbowing Lorenzo Staelens in the chest', 'A two-footed tackle', 'Handling the ball on the goal line'], 'B', ['Kluivert red card', 'Group stage vs Belgium', 'Elbow on Staelens']],
      ['Hiddink utilized the blistering pace of which winger to stretch defenses on the left flank, allowing Bergkamp to drop into the spaces created?', ['Boudewijn Zenden', 'Marc Overmars', 'Ronald de Boer', 'Clarence Seedorf'], 'B', ['Left-flank pace', 'Stretched defenses', 'Marc Overmars']],
      ["In the semi-final against Brazil, Hiddink's team fell behind early but relentlessly attacked until they scored a dramatic 87th-minute equalizer. Who scored it?", ['Dennis Bergkamp', 'Patrick Kluivert', 'Edgar Davids', 'Pierre van Hooijdonk'], 'B', ['Semi-final vs Brazil', '87th-minute equalizer', 'Patrick Kluivert']],
      ["Hiddink's thrilling 1998 run ended in heartbreak when the Netherlands lost the semi-final to Brazil via what method?", ['A Golden Goal', 'A controversial offside goal', 'A penalty shootout (4-2)', 'A 120th-minute free-kick'], 'C', ['Semi-final heartbreak', 'Lost to Brazil', '4-2 on penalties']],
      ['Hiddink\'s 1998 squad is widely regarded as one of the best teams to never win the tournament. The core of his starting XI was built around players who won the 1995 Champions League with which club?', ['PSV Eindhoven', 'Ajax', 'Barcelona', 'AC Milan'], 'B', ['1995 Champions League core', 'Golden generation base', 'Ajax']],
    ],
  },
  {
    comment: 'Clemens Westerhof - Nigeria 1994 World Cup Campaign',
    prefix: 'westerhof-nga',
    items: [
      ['Clemens Westerhof transformed Nigerian football in 1994, bringing a level of professionalism that earned him what famous nickname?', ['The African King', 'The Dutchgerian', 'The Master', 'The General'], 'B', ['Professionalism drive', 'Famous nickname', 'The Dutchgerian']],
      ['Westerhof\'s tactical system at the 1994 World Cup combined traditional African flair with incredibly fast, European-style transitions. What was their base formation?', ['3-5-2', '4-4-2 (with out-and-out wingers)', '5-3-2', '4-3-2-1'], 'B', ['Base formation', 'Fast transitions', '4-4-2 with wingers']],
      ["In their very first World Cup match ever, Westerhof's tactics absolutely dismantled which strong European team 3-0?", ['Greece', 'Italy', 'Bulgaria', 'Sweden'], 'A', ['First World Cup match', '3-0 dismantling', 'Greece']],
      ["Westerhof's team scored Nigeria's first-ever World Cup goal in that match. Which legendary striker scored it and famously celebrated by crying inside the goal net?", ['Daniel Amokachi', 'Emmanuel Amunike', 'Rashidi Yekini', 'Victor Ikpeba'], 'C', ['First World Cup goal', 'Net celebration', 'Rashidi Yekini']],
      ['To create chances, Westerhof relied heavily on two blistering, traditional wingers who hugged the touchlines. Who were they?', ['Jay-Jay Okocha and Sunday Oliseh', 'Finidi George and Emmanuel Amunike', 'Daniel Amokachi and Samson Siasia', 'Mutiu Adepoju and Tijani Babangida'], 'B', ['Traditional wingers', 'Touchline hugging', 'Finidi George and Emmanuel Amunike']],
      ['Westerhof gave a free playmaking role to which incredibly skillful, trick-oriented midfielder, who famously completed 15 dribbles in a single match against Italy?', ['Sunday Oliseh', 'Jay-Jay Okocha', 'Mutiu Adepoju', 'Victor Ikpeba'], 'B', ['Free playmaking role', '15 dribbles vs Italy', 'Jay-Jay Okocha']],
      ["In the Round of 16 against Italy, Westerhof's side led 1-0 until the 88th minute. Who scored the late equalizer and the extra-time penalty to break Nigerian hearts?", ['Gianfranco Zola', 'Paolo Maldini', 'Roberto Baggio', 'Dino Baggio'], 'C', ['Round of 16 vs Italy', 'Late equalizer and penalty', 'Roberto Baggio']],
      ['Before the 1994 World Cup, Westerhof proved his tactical dominance on the continent by leading Nigeria to victory in which major tournament?', ['The Olympics', 'The African Cup of Nations (AFCON)', 'The Afro-Asian Cup', 'The Confederations Cup'], 'B', ['Continental dominance', 'Pre-World Cup title', 'AFCON']],
      ['Westerhof demanded an incredibly physical midfield enforcer to win the ball back for his attackers. Who played this role and scored a 35-yard screamer against Spain four years later?', ['Sunday Oliseh', 'Jay-Jay Okocha', 'Mutiu Adepoju', 'Chidi Nwanu'], 'A', ['Midfield enforcer', '35-yard screamer vs Spain later', 'Sunday Oliseh']],
      ["Westerhof's legacy in Nigeria goes far beyond the 1994 World Cup. What massive off-pitch contribution did he make to the country's footballing infrastructure?", ["He paid the players' salaries out of his own pocket", 'He personally oversaw and helped fund the building of a state-of-the-art national training complex in Lagos', 'He founded the Nigerian Premier League', 'He bought the national team their own airplane'], 'B', ['Off-pitch legacy', 'National training complex', 'Lagos infrastructure']],
    ],
  },
  {
    comment: 'Antoni Piechniczek - Poland 1982 World Cup Campaign',
    prefix: 'piechniczek-pol',
    items: [
      ['Antoni Piechniczek led Poland to a 3rd-place finish in 1982, an incredible feat considering the massive stress back home due to what historical event?', ['The collapse of the Soviet Union', 'A massive earthquake in Warsaw', 'The imposition of Martial Law by the communist government', 'A nationwide labor strike that cancelled the domestic league'], 'C', ['1982 backdrop', 'Stress back home', 'Martial Law imposed']],
      ['Piechniczek\'s tactical masterclass centered around deploying which legendary player—who was about to transfer to Juventus—as an attacking midfielder / second striker?', ['Grzegorz Lato', 'Zbigniew Boniek', 'Włodzimierz Smolarek', 'Andrzej Szarmach'], 'B', ['Attacking midfielder role', 'Soon to join Juventus', 'Zbigniew Boniek']],
      ['After two drab 0-0 draws to start the tournament, Piechniczek made bold tactical changes that resulted in a 5-1 thrashing of which South American team?', ['Chile', 'Peru', 'Argentina', 'Brazil'], 'B', ['5-1 thrashing', 'Bold tactical changes', 'Peru']],
      ['In the second group stage, Piechniczek tactically outmaneuvered Belgium in a 3-0 victory. Who scored an incredible hat-trick in this match?', ['Włodzimierz Smolarek', 'Grzegorz Lato', 'Zbigniew Boniek', 'Andrzej Buncol'], 'C', ['3-0 vs Belgium', 'Hat-trick hero', 'Zbigniew Boniek']],
      ['Piechniczek\'s team secured their spot in the semi-finals by playing out a highly tense, tactical 0-0 draw against which massive political and sporting rival?', ['East Germany', 'West Germany', 'Soviet Union', 'Hungary'], 'C', ['Semi-final berth secured', '0-0 draw', 'Soviet Union']],
      ["Going into the semi-final against Italy, Piechniczek's entire tactical game plan fell apart because of what devastating squad issue?", ['His starting goalkeeper broke his wrist', 'Zbigniew Boniek was suspended due to yellow card accumulation', 'Half the team got food poisoning', 'His captain refused to play over a bonus dispute'], 'B', ['Semi-final vs Italy', 'Game plan ruined', 'Boniek suspended']],
      ['Piechniczek anchored his rock-solid defense with an elite, chain-smoking goalkeeper who later won the European Cup with FC Porto. Who was he?', ['Jan Tomaszewski', 'Józef Młynarczyk', 'Jacek Kazimierski', 'Władysław Żmuda'], 'B', ['Chain-smoking goalkeeper', 'Later Porto European Cup', 'Józef Młynarczyk']],
      ['Who was Piechniczek\'s highly experienced captain, playing in his third World Cup, who led the defensive line with immaculate positioning?', ['Paweł Janas', 'Stefan Majewski', 'Władysław Żmuda', 'Marek Dziuba'], 'C', ['Third World Cup captain', 'Defensive leader', 'Władysław Żmuda']],
      ['To win the Bronze Medal, Piechniczek\'s team played a brilliant counter-attacking game to defeat which Michel Hidalgo-managed nation 3-2?', ['West Germany', 'France', 'Brazil', 'England'], 'B', ['Bronze medal match', '3-2 counter-attack', 'France']],
      ['Piechniczek heavily utilized the work rate and direct running of which left-winger to stretch defenses, whose son would later star for the national team in the 2000s?', ['Włodzimierz Smolarek', 'Grzegorz Lato', 'Andrzej Iwan', 'Marek Kusto'], 'A', ['Left-winger stretcher', 'Son starred in 2000s', 'Włodzimierz Smolarek']],
    ],
  },
];

const diffs = ['easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard'];

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

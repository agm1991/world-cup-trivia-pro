import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('rajevac-gha-1')) {
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
    comment: 'Milovan Rajevac - Ghana 2010 World Cup Campaign',
    prefix: 'rajevac-gha',
    items: [
      ['Milovan Rajevac set Ghana up in a highly pragmatic, defensive formation that frustrated opponents. What was his base shape?', ['3-5-2', '4-2-3-1', '4-4-2', '5-4-1'], 'D', ['Defensive base shape', '2010 Black Stars', '5-4-1']],
      ['Because of his focus on defensive solidity, Rajevac\'s team advanced out of the group stages through what was dubbed the "one-goal approach." How did they score all of their group stage goals?', ['From corner kicks', 'From penalty kicks', 'From direct free-kicks', 'From own goals by the opposition'], 'B', ['One-goal approach', 'Group stage scoring', 'All from penalties']],
      ['Rajevac completely built his counter-attacking tactics around isolating which powerful, lone striker up front?', ['Kevin-Prince Boateng', 'Matthew Amoah', 'Asamoah Gyan', 'Sulley Muntari'], 'C', ['Lone striker', 'Counter-attacking focal point', 'Asamoah Gyan']],
      ['In the Round of 16, Rajevac\'s counter-attacking style paid off perfectly, securing a 2-1 extra-time victory against which nation?', ['Germany', 'Serbia', 'United States', 'Uruguay'], 'C', ['Round of 16', 'Extra-time win', 'United States']],
      ['Rajevac\'s incredible run was stopped in the quarter-finals by one of the most infamous tactical (and highly illegal) decisions in World Cup history. What happened in the final second of extra time?', ['A goal was ruled offside by a blown call', 'Luis Suárez intentionally saved a clear goal with his hands on the goal line', 'The referee blew the whistle while the ball was in the air', 'Uruguay scored a goal from a clearly offside position'], 'B', ['Uruguay quarter-final', 'Final second of extra time', 'Suárez handball']],
      ['Following that incident, what happened to the resulting penalty kick that would have sent Rajevac\'s Ghana to the semi-finals?', ['The goalkeeper saved it', 'Asamoah Gyan smashed it off the crossbar', 'It was scored, but ruled out for encroachment', 'The player slipped and missed the target entirely'], 'B', ['Last-second penalty', 'Semi-final chance missed', 'Gyan hit the crossbar']],
      ['Under Rajevac, Ghana achieved a massive historical milestone. They became only the third team from which continent to reach a World Cup quarter-final?', ['Asia', 'South America', 'Africa', 'North America'], 'C', ['Historic quarter-final', 'Continental milestone', 'Africa']],
      ['What nationality is Milovan Rajevac?', ['Croatian', 'Serbian', 'Russian', 'Bulgarian'], 'B', ['Manager nationality', 'Balkan coach', 'Serbian']],
      ['Rajevac brilliantly utilized which dynamic player—who had switched international allegiances from Germany just before the tournament—as an advanced attacking midfielder?', ['Sulley Muntari', 'Kwadwo Asamoah', 'Kevin-Prince Boateng', 'André Ayew'], 'C', ['Switched from Germany', 'Advanced midfielder', 'Kevin-Prince Boateng']],
      ['Rajevac anchored his midfield with an incredibly energetic double-pivot to protect the back four. Who was the relentless ball-winner that starred in this role?', ['Michael Essien', 'Stephen Appiah', 'Anthony Annan', 'Derek Boateng'], 'C', ['Double-pivot', 'Ball-winner', 'Anthony Annan']],
    ],
  },
  {
    comment: 'Bert van Marwijk - Netherlands 2010 World Cup Campaign',
    prefix: 'vanmarwijk-ned',
    items: [
      ['Bert van Marwijk completely abandoned the traditional, flowing 4-3-3 of "Total Football" in favor of a highly pragmatic, results-driven formation. What was it?', ['3-5-2', '4-2-3-1', '4-4-2 diamond', '5-3-2'], 'B', ['Pragmatic shape', 'Abandoned 4-3-3', '4-2-3-1']],
      ['To enforce his pragmatic style, Van Marwijk deployed an incredibly physical double-pivot in defensive midfield consisting of Mark van Bommel and who else?', ['Rafael van der Vaart', 'Wesley Sneijder', 'Nigel de Jong', 'Demy de Zeeuw'], 'C', ['Physical double-pivot', 'Defensive midfield', 'Nigel de Jong']],
      ['This physical midfield pairing was highly controversial, culminating in the 2010 final when Nigel de Jong notoriously did what to Spain\'s Xabi Alonso?', ['Headbutted him', 'Karate-kicked him in the chest', 'Two-footed tackled him from behind', 'Spit on him'], 'B', ['2010 final controversy', 'De Jong incident', 'Karate-kick to the chest']],
      ['Van Marwijk pushed his main playmaker higher up the pitch to operate as an advanced Number 10, resulting in him sharing the tournament\'s Golden Boot. Who was he?', ['Robin van Persie', 'Rafael van der Vaart', 'Wesley Sneijder', 'Arjen Robben'], 'C', ['Advanced Number 10', 'Golden Boot share', 'Wesley Sneijder']],
      ['Because his full-backs were relatively defensive, Van Marwijk relied on which brilliant inverted winger cutting in from the right flank to create chances?', ['Dirk Kuyt', 'Ibrahim Afellay', 'Arjen Robben', 'Eljero Elia'], 'C', ['Inverted winger', 'Right flank creator', 'Arjen Robben']],
      ['Van Marwijk utilized which famously hard-working striker as an unorthodox, defensive left-winger to track back and protect his full-back?', ['Klaas-Jan Huntelaar', 'Ryan Babel', 'Dirk Kuyt', 'Robin van Persie'], 'C', ['Defensive left-winger', 'Tracks back', 'Dirk Kuyt']],
      ['In the quarter-finals, Van Marwijk masterminded a brilliant 2-1 comeback upset against which massive tournament favorite?', ['Argentina', 'Germany', 'Brazil', 'Italy'], 'C', ['Quarter-final upset', '2-1 comeback', 'Brazil']],
      ['Van Marwijk\'s team reached the final after a thrilling 3-2 semi-final win over Uruguay, which featured an iconic 35-yard screamer from which Dutch captain?', ['Mark van Bommel', 'Wesley Sneijder', 'Giovanni van Bronckhorst', 'John Heitinga'], 'C', ['Semi-final screamer', '35-yard strike', 'Giovanni van Bronckhorst']],
      ['Because of his "rough-arm" tactics and abandonment of beautiful football, Van Marwijk\'s team was heavily criticized by which legendary Dutch footballing icon?', ['Marco van Basten', 'Ruud Gullit', 'Johan Cruyff', 'Rinus Michels'], 'C', ['Criticism of pragmatism', 'Dutch football icon', 'Johan Cruyff']],
      ['Van Marwijk\'s physical, gritty campaign ended in heartbreak in the 2010 final. How did they lose to Spain?', ['A penalty shootout', 'A 90th-minute header', 'A 116th-minute extra-time goal by Andrés Iniesta', 'A Golden Goal'], 'C', ['2010 final', 'Extra-time heartbreak', 'Iniesta 116th minute']],
    ],
  },
  {
    comment: 'Luiz Felipe Scolari - Portugal 2006 World Cup Campaign',
    prefix: 'scolari-por',
    items: [
      ['After winning the 2002 World Cup with Brazil, Scolari managed Portugal to their first World Cup semi-final since what year?', ['1950', '1966', '1982', '1990'], 'B', ['Portugal semi-final', 'First since 1966', '1966']],
      ['Scolari set his team up in a fluid 4-2-3-1, with the entire attacking tempo dictated by which brilliant, Brazilian-born playmaker?', ['Rui Costa', 'Luis Figo', 'Deco', 'João Moutinho'], 'C', ['4-2-3-1 playmaker', 'Brazilian-born star', 'Deco']],
      ['Scolari\'s team survived the infamous "Battle of Nuremberg" in the Round of 16 against the Netherlands. What World Cup record did this match set?', ['Most fouls committed (55)', 'Most cards shown in a single match (4 red cards, 16 yellow cards)', 'Longest match delay due to fighting', 'Most penalties awarded in a single game'], 'B', ['Battle of Nuremberg', 'Card record', '4 reds, 16 yellows']],
      ['During the quarter-final against England, Scolari\'s team was at the center of massive controversy when which Portuguese player famously winked at the bench after Wayne Rooney was sent off?', ['Luis Figo', 'Ricardo Carvalho', 'Cristiano Ronaldo', 'Tiago'], 'C', ['England quarter-final', 'Rooney sent off', 'Ronaldo wink']],
      ['In that same quarter-final, Scolari advanced by winning a penalty shootout. Which Portuguese goalkeeper became a national hero by saving three English penalties?', ['Vítor Baía', 'Quim', 'Ricardo', 'Eduardo'], 'C', ['Penalty shootout hero', 'Three saves', 'Ricardo']],
      ['To provide grit in the midfield behind Deco, Scolari relied heavily on which powerful, box-to-box midfielder who scored the winning goal in the Battle of Nuremberg?', ['Costinha', 'Petit', 'Maniche', 'Tiago'], 'C', ['Box-to-box grit', 'Nuremberg winner', 'Maniche']],
      ['Scolari\'s personal, record-breaking 12-match World Cup winning streak as a manager was finally ended in the 2006 semi-finals by which nation?', ['Italy', 'France', 'Germany', 'Spain'], 'B', ['12-match streak ended', '2006 semi-final', 'France']],
      ['The 2006 tournament marked the international farewell for which legendary Portuguese winger and captain, who Scolari managed brilliantly in his final years?', ['Rui Costa', 'Pauleta', 'Luis Figo', 'Nuno Gomes'], 'C', ['International farewell', 'Legendary captain', 'Luis Figo']],
      ['Just weeks before the 2006 World Cup began, Scolari was at the center of a massive media storm because he publicly rejected the managerial job for which nation?', ['Brazil', 'Spain', 'England', 'Italy'], 'C', ['Pre-tournament storm', 'Rejected job offer', 'England']],
      ['Scolari\'s shootout victory in 2006 cemented his status as the ultimate nemesis for the English national team, having also knocked them out on penalties in which previous tournament?', ['Euro 2000', 'Euro 2004', 'World Cup 2002', 'Confederations Cup 2005'], 'B', ['English nemesis', 'Previous penalty knockout', 'Euro 2004']],
    ],
  },
  {
    comment: 'Tommy Svensson - Sweden 1994 World Cup Campaign',
    prefix: 'svensson-swe',
    items: [
      ['Tommy Svensson brilliantly managed Sweden\'s "Golden Generation" to an incredibly unexpected finish at the 1994 World Cup. Where did they finish?', ['Runner-up', 'Bronze Medal (3rd place)', '4th place', 'Quarter-finals'], 'B', ['1994 finish', 'Golden Generation', 'Bronze medal']],
      ['Svensson primarily utilized a 4-4-2 that shifted into a fluid attack by having which brilliant playmaker drop deeper to link the midfield and the forwards?', ['Klas Ingesson', 'Stefan Schwarz', 'Tomas Brolin', 'Jonas Thern'], 'C', ['4-4-2 fluidity', 'Playmaker drops deep', 'Tomas Brolin']],
      ['Svensson\'s attacking tactics were incredibly prolific. His main target man dominated the air and scored 5 goals in the tournament. Who was he?', ['Martin Dahlin', 'Kennet Andersson', 'Henrik Larsson', 'Johnny Ekström'], 'B', ['Five goals', 'Aerial target man', 'Kennet Andersson']],
      ['In the quarter-finals against Romania, Svensson\'s team advanced after a dramatic penalty shootout. Who was the eccentric Swedish goalkeeper who made the crucial saves?', ['Magnus Hedman', 'Lars Eriksson', 'Thomas Ravelli', 'Andreas Isaksson'], 'C', ['Penalty shootout hero', 'Eccentric keeper', 'Thomas Ravelli']],
      ['During that quarter-final, Svensson\'s team executed one of the most famous, brilliantly worked set-pieces in World Cup history. What happened?', ['A corner kicked directly into the net', 'A free-kick where the ball was secretly rolled through the wall for Brolin to smash home', 'A penalty passed sideways to a teammate', 'A throw-in launched directly into the six-yard box'], 'B', ['Famous set-piece', 'Rolled through the wall', 'Brolin free-kick']],
      ['Svensson\'s incredible run was halted in the semi-finals by eventual champions Brazil. How did they lose the match?', ['3-0 blowout', 'Penalty shootout', 'A late 80th-minute header by Romário (1-0)', 'A Golden Goal in extra time'], 'C', ['Semi-final vs Brazil', 'Romário header', '1-0 defeat']],
      ['After the heartbreak of the semi-final, Svensson motivated his team to completely dismantle which nation 4-0 in the third-place playoff?', ['Italy', 'Bulgaria', 'Spain', 'Romania'], 'B', ['Third-place playoff', '4-0 win', 'Bulgaria']],
      ['Svensson frequently utilized a 22-year-old, dreadlocked forward as his ultimate impact substitute. This player scored in the shootout against Romania and netted in the 3rd place match. Who was he?', ['Zlatan Ibrahimović', 'Henrik Larsson', 'Marcus Allbäck', 'Freddie Ljungberg'], 'B', ['Impact substitute', 'Shootout scorer', 'Henrik Larsson']],
      ['Svensson built his tactical foundation by combining European-based superstars with a highly disciplined core of domestic players from which Swedish club?', ['Malmö FF', 'AIK', 'IFK Göteborg', 'Djurgårdens IF'], 'C', ['Domestic core', 'Disciplined squad base', 'IFK Göteborg']],
      ['Svensson\'s team was incredibly potent in front of goal during the 1994 campaign. What impressive offensive milestone did they achieve?', ['They scored in every single minute of a 90-minute game across the tournament', 'They scored more total goals in the tournament (15) than the eventual champions, Brazil (11)', 'Every outfield player scored at least one goal', 'They didn\'t have a single shot off target in the knockout stages'], 'B', ['Offensive milestone', '15 tournament goals', 'More than Brazil\'s 11']],
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
console.log('Patched 40 manager questions');

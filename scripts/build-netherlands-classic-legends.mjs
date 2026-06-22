import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/netherlandsClassicLegendsAuthorVerbatimTiles.ts');

function e(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function tile(id, y, stem, a, b, c, d, ok, diff = 'medium') {
  return `  {
    id: '${e(id)}',
    category: 'player',
    difficulty: '${diff}',
    eventYear: ${y},
    question: '${e(stem)}',
    optionA: '${e(a)}',
    optionB: '${e(b)}',
    optionC: '${e(c)}',
    optionD: '${e(d)}',
    correctAnswer: '${ok}',
    hint1: '${y} Finals',
    hint2: 'Netherlands',
    hint3: 'Author tile',
  }`;
}

function block(name, rows) {
  return `export const ${name}: Question[] = [\n${rows.join(',\n')},\n];\n\n`;
}

const rows = {};

const add = (exportName, list) => {
  rows[exportName] = list.map(([id, y, stem, a, b, c, d, ok]) => tile(id, y, stem, a, b, c, d, ok));
};

add('johanCruyffClassicAuthorVerbatimTiles', [
  ['jcf-av-1974-01', 1974, 'What official leadership role did Johan Cruyff hold during the 1974 World Cup?', 'Vice-captain', 'Team Captain', 'Player-Manager', 'None', 'D'],
  ['jcf-av-1974-02', 1974, 'How many goals did Cruyff score in the 1974 World Cup?', '1', '2', '3 (two against Argentina, one against Brazil)', '5', 'C'],
  ['jcf-av-1974-03', 1974, 'In the group stage match against Sweden, Cruyff debuted a move that shook the world and was named after him (The Cruyff Turn). Which Swedish defender was the victim of this move?', 'Jan Olsson', 'Björn Nordqvist', 'Kent Karlsson', 'Ronnie Hellström', 'A'],
  ['jcf-av-1974-04', 1974, 'What shirt number did Cruyff famously wear in 1974, breaking the standard alphabetical numbering system used by the Dutch team?', '9', '10', '14', '22', 'C'],
  ['jcf-av-1974-05', 1974, 'In the opening minute of the 1974 World Cup Final against West Germany, what massive contribution did Cruyff make?', 'He scored a goal from the halfway line', 'He went on a solo dribble and won a penalty before a single German player had touched the ball', 'He received a yellow card', 'He assisted Johan Neeskens from a corner', 'B'],
  ['jcf-av-1974-06', 1974, 'Which West German player fouled Cruyff in the penalty box to give away that opening penalty?', 'Franz Beckenbauer', 'Berti Vogts', 'Uli Hoeneß', 'Paul Breitner', 'C'],
  ['jcf-av-1974-07', 1974, 'Did Cruyff score in the 1974 Final?', 'Yes, he took the penalty', 'Yes, he scored a header', 'No, he did not score in the 2-1 defeat', 'Yes, but it was ruled offside', 'C'],
  ['jcf-av-1974-08', 1974, 'At the half-time whistle of the 1974 Final, what action earned Cruyff a yellow card?', 'Kicking the ball away', 'A late tackle on Beckenbauer', 'Arguing fiercely with the English referee Jack Taylor as they walked down the tunnel', 'Taking his shirt off', 'C'],
  ['jcf-av-1974-09', 1974, 'For his orchestrating of "Total Football," what individual award did Cruyff win for the 1974 tournament?', 'Golden Ball (Best Player)', 'Golden Boot', 'Silver Ball', 'Fair Play Award', 'A'],
  ['jcf-av-1974-10', 1974, 'Did Cruyff ever play in another World Cup tournament after 1974?', 'Yes, in 1978', 'Yes, in 1982', 'No, 1974 was his only World Cup appearance', 'Yes, as a player-manager in 1978', 'C'],
]);

add('johanNeeskensClassicAuthorVerbatimTiles', [
  ['jns-av-1974-01', 1974, 'How many goals did Johan Neeskens score during the 1974 World Cup?', '3', '4', '5', '7', 'C'],
  ['jns-av-1974-02', 1974, 'By scoring 5 goals, Neeskens won which individual FIFA award in 1974?', 'Golden Boot', 'Silver Boot (2nd highest scorer behind Grzegorz Lato)', 'Golden Ball', 'Best Young Player', 'B'],
  ['jns-av-1974-03', 1974, "How many of Neeskens' 5 goals were scored from penalty kicks?", '1', '2', '3 (two against Bulgaria, one against West Germany)', '4', 'C'],
  ['jns-av-1974-04', 1974, 'In the 1974 Final, Neeskens stepped up to take the 2nd-minute penalty won by Cruyff. How did he strike it?', 'A delicate chip down the middle', 'A low shot to the bottom left', 'He blasted it with extreme power straight down the middle into the roof of the net', 'He passed it to Cruyff', 'C'],
  ['jns-av-1974-05', 1974, 'Against which team did Neeskens score a crucial opening goal in the second group stage to help secure a 2-0 victory?', 'Argentina', 'East Germany', 'Brazil', 'Sweden', 'B'],
  ['jns-av-1974-06', 1974, 'What position did Neeskens primarily play as the engine of the "Total Football" system?', 'Center-back', 'Box-to-Box / Central Midfielder', 'Winger', 'Striker', 'B'],
  ['jns-av-1974-07', 1974, 'What shirt number did Neeskens wear in 1974?', '7', '8', '10', '13', 'D'],
  ['jns-av-1974-08', 1974, 'How old was Neeskens during the 1974 World Cup?', '20', '22', '25', '28', 'B'],
  ['jns-av-1974-09', 1974, 'Did Neeskens play every minute of the 1974 World Cup?', 'Yes, all 630 minutes', 'No, he was substituted off in the 79th minute against Bulgaria', 'No, he missed the opening match', 'No, he was sent off', 'B'],
  ['jns-av-1974-10', 1974, 'Did Neeskens receive any yellow cards in 1974?', '0', '1 (in the Final against West Germany)', '2', '3', 'B'],
  ['jns-av-1978-01', 1978, 'With Johan Cruyff absent in 1978, did Neeskens assume the role of team captain?', 'Yes', 'No, Ruud Krol was the captain', 'No, Rob Rensenbrink was the captain', 'No, Arie Haan was the captain', 'B'],
  ['jns-av-1978-02', 1978, 'How many goals did Neeskens score during the 1978 World Cup?', '0', '1', '2', '3', 'A'],
  ['jns-av-1978-03', 1978, "Did Neeskens start all of the Netherlands' matches in 1978?", 'Yes, all 7 matches', 'No, he missed the second group stage match against Austria due to a rib injury', 'No, he was a substitute for the whole tournament', 'No, he was suspended', 'B'],
  ['jns-av-1978-04', 1978, 'In the brutal 1978 Final against host nation Argentina, did Neeskens play the full match?', 'Yes, he played the full 120 minutes', 'No, he was sent off', 'No, he was injured in the first half', 'No, he played 90 minutes and was substituted just before extra time began', 'D'],
  ['jns-av-1978-05', 1978, 'What shirt number did Neeskens retain for the 1978 tournament?', '7', '10', '13', '14', 'C'],
  ['jns-av-1978-06', 1978, 'How many yellow cards did Neeskens receive during the highly physical 1978 campaign?', '0', '1', '2 (against Peru and Italy)', '3', 'C'],
  ['jns-av-1978-07', 1978, "What was the outcome of the Netherlands' 1978 campaign with Neeskens in midfield?", 'Winners', 'Runners-up (lost 3-1 to Argentina in extra time)', 'Third Place', 'Knocked out in the Quarter-finals', 'B'],
  ['jns-av-1978-08', 1978, 'How old was Neeskens during his second World Cup?', '24', '26', '29', '31', 'B'],
  ['jns-av-1978-09', 1978, 'Did Neeskens take any penalties during the 1978 World Cup?', 'Yes, and he scored', 'Yes, and he missed', "No (Rob Rensenbrink took the team's penalties in this tournament)", 'Yes, in a shootout', 'C'],
  ['jns-av-1978-10', 1978, 'Did Neeskens ever play in a third World Cup?', 'Yes, in 1982', 'No, the Netherlands failed to qualify for 1982 and 1986', 'Yes, as a manager in 1990', 'Yes, in 1990', 'B'],
]);

add('ruudGullitClassicAuthorVerbatimTiles', [
  ['rgu-av-1990-01', 1990, 'What official leadership role did Ruud Gullit hold during his only World Cup in 1990?', 'Vice-captain', 'Team Captain', 'Player-Manager', 'None', 'B'],
  ['rgu-av-1990-02', 1990, 'Gullit entered the 1990 World Cup struggling severely with what physical issue?', 'A broken wrist', 'He was recovering from major knee surgeries and lacked match fitness', 'A torn hamstring', 'Chronic back spasms', 'B'],
  ['rgu-av-1990-03', 1990, 'How many goals did Gullit score in the 1990 World Cup?', '0', '1', '2', '3', 'B'],
  ['rgu-av-1990-04', 1990, 'Against which team did Gullit score his only World Cup goal?', 'Egypt', 'England', 'Republic of Ireland', 'West Germany', 'C'],
  ['rgu-av-1990-05', 1990, 'How did Gullit score his goal in the 10th minute against Ireland?', 'A header from a corner', 'A penalty kick', 'A low, right-footed finish after a quick one-two passing sequence', 'A direct free-kick', 'C'],
  ['rgu-av-1990-06', 1990, 'What shirt number did Captain Gullit wear in 1990?', '8', '10', '11', '14', 'B'],
  ['rgu-av-1990-07', 1990, "Did Gullit play every minute of the Netherlands' four matches?", 'Yes, all 360 minutes', 'No, he was subbed off against Egypt', 'No, he missed the Round of 16 match', 'No, he only played 45 minutes per game due to his knee', 'A'],
  ['rgu-av-1990-08', 1990, 'In the intense Round of 16 match against West Germany (a 2-1 loss), did Gullit receive a yellow card?', 'Yes', 'No', 'He received a red card', "He didn't play", 'B'],
  ['rgu-av-1990-09', 1990, "What was the overall result of the Netherlands' group stage matches under Gullit's captaincy?", 'Won all three', 'Won two, lost one', 'Drew all three matches (progressing as a 3rd place team)', 'Lost all three', 'C'],
  ['rgu-av-1990-10', 1990, 'How old was Gullit during his sole World Cup appearance?', '25', '27', '30', '32', 'B'],
]);

add('marcoVanBastenClassicAuthorVerbatimTiles', [
  ['mvb-av-1990-01', 1990, 'How many goals did Marco van Basten, the reigning Ballon d\'Or winner, score in the 1990 World Cup?', '0', '1', '2', '3', 'A'],
  ['mvb-av-1990-02', 1990, 'What shirt number did Van Basten wear in 1990, somewhat surprisingly for a primary striker?', '9', '10', '12 (Wim Kieft wore number 9)', '14', 'C'],
  ['mvb-av-1990-03', 1990, 'Did Van Basten start every match for the Netherlands in 1990?', 'Yes, he started all 4 matches', 'No, he was benched against Ireland', 'No, he was injured for the opening game', 'No, he was a substitute', 'A'],
  ['mvb-av-1990-04', 1990, 'Did Van Basten play the full 90 minutes in all 4 of his appearances?', 'Yes, he was never substituted off', 'No, he was subbed off against Egypt', 'No, he was sent off against West Germany', 'No, he was subbed off at half-time against England', 'A'],
  ['mvb-av-1990-05', 1990, 'How old was Van Basten during the 1990 World Cup?', '23', '25', '28', '30', 'B'],
  ['mvb-av-1990-06', 1990, 'Did Van Basten receive a yellow card during the 1990 tournament?', '0', '1 (against West Germany in the Round of 16)', '2', '1 red card', 'B'],
  ['mvb-av-1990-07', 1990, 'How many assists did Van Basten provide during the 1990 tournament?', '0 assists', '1 assist', '2 assists', '3 assists', 'A'],
  ['mvb-av-1990-08', 1990, "What was the outcome of the Netherlands' 1990 campaign?", 'Reached the Quarter-finals', 'Knocked out in the Round of 16 (by West Germany)', 'Eliminated in the Group Stage', 'Reached the Semi-finals', 'B'],
  ['mvb-av-1990-09', 1990, 'In the match against West Germany, Van Basten was closely marked and heavily fouled by which legendary German defender?', 'Andreas Brehme', 'Klaus Augenthaler', 'Jürgen Kohler', 'Guido Buchwald', 'C'],
  ['mvb-av-1990-10', 1990, 'Did Van Basten ever play in another World Cup after 1990?', 'Yes, in 1994', 'No, severe ankle injuries forced him to retire entirely before the 1994 tournament', 'Yes, in 1998', 'Yes, as a manager in 2006', 'B'],
]);

add('frankRijkaardClassicAuthorVerbatimTiles', [
  ['frj-av-1990-01', 1990, 'In the Round of 16 match against West Germany, Rijkaard was involved in one of the most infamous incidents in World Cup history. What did he do to Rudi Völler?', 'Punched him in the face', 'Spat in his hair twice', 'Headbutted him', 'Stomped on his ankle', 'B'],
  ['frj-av-1990-02', 1990, 'What was the immediate consequence on the pitch for Rijkaard after this incident?', 'He was given a yellow card', 'The referee missed it', 'He was shown a straight red card and sent off (along with Völler)', 'He was subbed off by his manager', 'C'],
  ['frj-av-1990-03', 1990, 'Before the red card in the 22nd minute against West Germany, how many minutes had Rijkaard played in the group stage?', '180', '270 (He played every minute of the three group games)', '90', '135', 'B'],
  ['frj-av-1990-04', 1990, 'Did Rijkaard score any goals in the 1990 World Cup prior to his dismissal?', '0', '1', '2', '3', 'A'],
  ['frj-av-1990-05', 1990, 'What position did Rijkaard play during the 1990 tournament?', 'Striker', 'Right-back', 'Defensive Midfielder / Center-back', 'Left Winger', 'C'],
  ['frj-av-1990-06', 1990, 'What shirt number did Rijkaard wear in 1990?', '3', '4', '5', '6', 'B'],
  ['frj-av-1990-07', 1990, 'Just minutes before he was sent off, Rijkaard had already received a punishment from the referee. What was it?', 'A stern warning', 'A yellow card for a hard tackle on Völler', 'A penalty was given against him', 'A foul throw', 'B'],
  ['frj-av-1990-08', 1990, 'How old was Rijkaard during the 1990 World Cup?', '25', '27', '30', '32', 'B'],
  ['frj-av-1990-09', 1990, 'Did Rijkaard play against England in the group stage?', 'Yes, he played the full 90 minutes in the 0-0 draw', 'No, he was suspended', 'No, he was rested', 'Yes, but he came off the bench', 'A'],
  ['frj-av-1990-10', 1990, 'Did the Netherlands win any matches with Rijkaard on the pitch in 1990?', 'Yes, they won 1', 'Yes, they won 2', 'No, they drew all three group games and were losing when he was sent off', 'Yes, they won all of them', 'C'],
  ['frj-av-1994-01', 1994, 'Did Rijkaard retain his place in the starting lineup for the 1994 World Cup?', 'Yes, he started all 5 matches', 'No, he was dropped to the bench', 'No, he only started the group games', 'No, he was suspended', 'A'],
  ['frj-av-1994-02', 1994, 'What shirt number did Rijkaard wear in 1994?', '3', '4', '5', '6', 'B'],
  ['frj-av-1994-03', 1994, 'Did Rijkaard score any goals in the 1994 World Cup?', '0', '1', '2', '3', 'A'],
  ['frj-av-1994-04', 1994, 'In the Quarter-final loss to Brazil (3-2), did Rijkaard finish the match?', 'Yes, he played 90 minutes', 'No, he was substituted in the 65th minute for Ronald de Boer', 'No, he was sent off again', 'No, he went off injured in the first half', 'B'],
  ['frj-av-1994-05', 1994, 'Did Rijkaard receive any yellow cards during the 1994 tournament?', '0', '1 (against Saudi Arabia)', '2', '1 red card', 'B'],
  ['frj-av-1994-06', 1994, 'How old was Rijkaard during his final World Cup appearance in 1994?', '29', '31', '33', '35', 'B'],
  ['frj-av-1994-07', 1994, 'Was Rijkaard the captain of the 1994 squad?', 'Yes', 'No, Ronald Koeman was the captain', 'No, Dennis Bergkamp was the captain', 'No, Jan Wouters was the captain', 'B'],
  ['frj-av-1994-08', 1994, 'Following the heartbreaking Quarter-final loss to Brazil, what did Rijkaard do regarding his international career?', 'Took over the captaincy', 'He retired from the national team, playing his final match that day', 'Committed to playing in Euro 96', 'Transitioned immediately to assistant manager', 'B'],
  ['frj-av-1994-09', 1994, 'In the group stage, Rijkaard helped the Netherlands secure a crucial 2-1 victory over which North African team?', 'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'B'],
  ['frj-av-1994-10', 1994, 'Did Rijkaard provide any assists in the 1994 World Cup?', '0 assists', '1 assist', '2 assists', '3 assists', 'A'],
]);

add('ronaldKoemanClassicAuthorVerbatimTiles', [
  ['rnm-av-1990-01', 1990, 'How many goals did Ronald Koeman score in the 1990 World Cup?', '0', '1', '2', '3', 'B'],
  ['rnm-av-1990-02', 1990, 'Against which team did Koeman score his only goal of the 1990 tournament?', 'Egypt', 'England', 'Republic of Ireland', 'West Germany', 'D'],
  ['rnm-av-1990-03', 1990, 'How did Koeman score his goal in the 89th minute against West Germany?', 'A trademark 40-yard free-kick', 'A penalty kick', 'A header from a corner', 'A long-range volley', 'B'],
  ['rnm-av-1990-04', 1990, 'What position did Koeman famously play during the 1990 World Cup?', 'Target Man Striker', 'Goalkeeper', 'Sweeper / Libero / Center-back', 'Right Winger', 'C'],
  ['rnm-av-1990-05', 1990, "Did Koeman play every minute of the Netherlands' 1990 campaign?", 'Yes, all 360 minutes', 'No, he was subbed off against Egypt', 'No, he missed the England game', 'No, he was sent off', 'A'],
  ['rnm-av-1990-06', 1990, 'What shirt number did Koeman wear in 1990?', '3', '4', '5', '6', 'B'],
  ['rnm-av-1990-07', 1990, 'Did Koeman receive any yellow cards in the 1990 tournament?', '0', '1', '2', '3', 'A'],
  ['rnm-av-1990-08', 1990, 'How old was Koeman during the 1990 World Cup?', '25', '27', '30', '32', 'B'],
  ['rnm-av-1990-09', 1990, 'In the intense Round of 16 loss to West Germany, what controversial action did Koeman take after the final whistle involving Olaf Thon\'s jersey?', 'He framed it', 'He tore it in half', 'He pretended to wipe his backside with it in front of the fans', 'He threw it into the crowd', 'C'],
  ['rnm-av-1990-10', 1990, 'Was Koeman the captain of the squad in 1990?', 'Yes', 'No, Ruud Gullit was the captain', 'No, Marco van Basten was', 'No, Frank Rijkaard was', 'B'],
  ['rnm-av-1994-01', 1994, 'What official leadership role did Ronald Koeman hold for the 1994 World Cup?', 'Vice-captain', 'Team Captain', 'Goalkeeper', 'None', 'B'],
  ['rnm-av-1994-02', 1994, 'How many goals did Koeman score during the 1994 tournament?', '0', '1', '2', '3', 'A'],
  ['rnm-av-1994-03', 1994, 'Did Captain Koeman start every match of the 1994 campaign?', 'Yes, he started all 5 matches', 'No, he missed the opening match', 'No, he was rested against Morocco', 'No, he was injured for the Quarter-final', 'A'],
  ['rnm-av-1994-04', 1994, 'Did Koeman play the full 90 minutes in the 3-2 Quarter-final defeat to Brazil?', 'Yes, he played the entire match', 'No, he was subbed off at half-time', 'No, he was sent off', 'No, he went off injured', 'A'],
  ['rnm-av-1994-05', 1994, 'What shirt number did Koeman retain for the 1994 World Cup?', '3', '4', '5', '6', 'B'],
  ['rnm-av-1994-06', 1994, 'How many yellow cards did Koeman receive in 1994?', '0', '1 (against Belgium)', '2', '3', 'B'],
  ['rnm-av-1994-07', 1994, 'How old was Koeman during his final World Cup appearance?', '29', '31', '33', '35', 'B'],
  ['rnm-av-1994-08', 1994, 'In the Round of 16, Koeman captained the team to a 2-0 victory over which nation?', 'Saudi Arabia', 'Republic of Ireland', 'USA', 'Romania', 'A'],
  ['rnm-av-1994-09', 1994, 'Did Koeman take any penalty kicks during the 1994 World Cup?', 'Yes, and he scored', 'Yes, and he missed', 'No', 'Yes, in a shootout', 'C'],
  ['rnm-av-1994-10', 1994, 'Did Koeman ever play in another major international tournament after the 1994 World Cup?', 'Yes, Euro 96', 'Yes, the 1998 World Cup', 'No, he retired from the national team after this tournament', 'Yes, as a player-manager in 1998', 'C'],
]);

add('dennisBergkampClassicAuthorVerbatimTiles', [
  ['dbg-av-1994-01', 1994, 'At what age did Dennis Bergkamp make his World Cup debut in 1994?', '21', '25', '27', '29', 'B'],
  ['dbg-av-1994-02', 1994, 'How many goals did Bergkamp score in his debut World Cup?', '1', '2', '3', '4', 'C'],
  ['dbg-av-1994-03', 1994, 'Against which teams did Bergkamp score his goals in 1994?', 'Morocco, Republic of Ireland, Brazil', 'Saudi Arabia, Belgium, Brazil', 'Morocco, Saudi Arabia, Ireland', 'Belgium, Ireland, Brazil', 'A'],
  ['dbg-av-1994-04', 1994, 'How did Bergkamp score his brilliant goal against Brazil in the Quarter-final (making it 2-1)?', 'A long-range free-kick', 'A penalty kick', 'He controlled the ball in the box, held off a defender, and volleyed it into the corner', 'A diving header', 'C'],
  ['dbg-av-1994-05', 1994, 'What shirt number did Bergkamp wear in 1994?', '8', '9', '10', '11', 'C'],
  ['dbg-av-1994-06', 1994, "Did Bergkamp start all of the Netherlands' matches in 1994?", 'Yes, he started all 5 matches', 'No, he was rested against Saudi Arabia', 'No, he came off the bench against Ireland', 'No, he missed the Quarter-final', 'A'],
  ['dbg-av-1994-07', 1994, 'Did Bergkamp play the full 90 minutes in all his 1994 appearances?', 'Yes, all 450 minutes', 'No, he was substituted in the 79th minute against Ireland', 'No, he was subbed off at half-time against Brazil', 'No, he was sent off', 'B'],
  ['dbg-av-1994-08', 1994, 'How many yellow cards did Bergkamp receive during the 1994 tournament?', '0', '1 (against Republic of Ireland)', '2', '3', 'B'],
  ['dbg-av-1994-09', 1994, "Was Bergkamp the team's captain in 1994?", 'Yes', 'No, Ronald Koeman was the captain', 'No, Frank Rijkaard was the captain', 'No, Aron Winter was the captain', 'B'],
  ['dbg-av-1994-10', 1994, 'Did Bergkamp take any penalties during the 1994 tournament?', 'Yes, and he scored', 'Yes, and he missed', 'No', 'Yes, in a shootout', 'C'],
  ['dbg-av-1998-01', 1998, 'Bergkamp scored one of the most famous goals in World Cup history in the 1998 Quarter-final. Against which team did he score it?', 'Brazil', 'Yugoslavia', 'Argentina', 'South Korea', 'C'],
  ['dbg-av-1998-02', 1998, 'How did Bergkamp score this iconic 90th-minute winning goal?', 'A 40-yard solo dribble past four defenders', 'He controlled a 60-yard aerial pass from Frank de Boer, cut back past Roberto Ayala, and flicked an outside-of-the-boot finish into the net', 'A bicycle kick from a corner', 'A curling free-kick into the top corner', 'B'],
  ['dbg-av-1998-03', 1998, 'How many total goals did Bergkamp score in the 1998 World Cup?', '1', '2', '3 (against South Korea, Yugoslavia, and Argentina)', '4', 'C'],
  ['dbg-av-1998-04', 1998, 'In the Round of 16 against Yugoslavia, Bergkamp was involved in a controversial incident but escaped a red card. What did he do?', 'He punched a defender', 'He appeared to intentionally step on Sinisa Mihajlovic after a challenge', 'He handled the ball on the goal line', 'He argued aggressively with the referee', 'B'],
  ['dbg-av-1998-05', 1998, 'In the Semi-final against Brazil, the match went to a penalty shootout. What did Bergkamp do?', 'He missed his penalty', 'He was subbed off before the shootout', 'He stepped up and successfully scored his penalty', 'He refused to take one', 'C'],
  ['dbg-av-1998-06', 1998, 'What shirt number did Bergkamp wear in 1998?', '7', '8', '10', '11', 'B'],
  ['dbg-av-1998-07', 1998, "Did Bergkamp play every minute of the Netherlands' 1998 campaign?", 'Yes, all 660 minutes', 'No, he missed the opening match against Belgium entirely and came on as a sub against South Korea', 'No, he was sent off against Yugoslavia', 'No, he missed the 3rd place match', 'B'],
  ['dbg-av-1998-08', 1998, 'In the Third-Place Play-off against Croatia, did Bergkamp finish the match?', 'Yes, he played 90 minutes', 'No, he was substituted in the 58th minute for Pierre van Hooijdonk', 'No, he was sent off', 'No, he went off injured in the first 10 minutes', 'B'],
  ['dbg-av-1998-09', 1998, 'For his brilliant performances and iconic goal, what individual recognition did Bergkamp receive in 1998?', 'The Golden Ball', 'The Golden Boot', 'He was selected for the FIFA World Cup All-Star Team', 'The Yashin Award', 'C'],
  ['dbg-av-1998-10', 1998, 'How old was Bergkamp during the 1998 World Cup in France?', '25', '27', '29', '31', 'C'],
]);

let hdr = `import type { Question } from '@/types/game';

/**
 * Classic Netherlands Select a Legend decks — authored stems/options verbatim.
 * Tiles use \`/^[a-z]+-av-(19|20)\\\\d{2}-\\\\d+/\` ids and \`eventYear\` for level locks.
 */\n`;

for (const k of Object.keys(rows)) {
  hdr += block(k, rows[k]);
}

fs.writeFileSync(outPath, hdr);
console.log('Wrote', outPath, hdr.length);

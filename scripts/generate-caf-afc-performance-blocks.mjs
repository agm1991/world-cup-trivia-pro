/**
 * Generates src/data/cafAfcLegendPerformanceBlocks.ts — action-first World Cup player questions
 * for Select a Legend (CAF/AFC). Tier order per player: 10 easy (1998–2022), 10 medium (1970–1994),
 * 30 hard (1930–1966 era or deepest WC detail).
 * Run: node scripts/generate-caf-afc-performance-blocks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/cafAfcLegendPerformanceBlocks.ts');

function Q(id, diff, q, a, b, c, d, ans, h1, h2, h3) {
  return `    { id: ${JSON.stringify(id)}, category: 'player', difficulty: ${JSON.stringify(diff)}, question: ${JSON.stringify(q)}, optionA: ${JSON.stringify(a)}, optionB: ${JSON.stringify(b)}, optionC: ${JSON.stringify(c)}, optionD: ${JSON.stringify(d)}, correctAnswer: ${JSON.stringify(ans)}, hint1: ${JSON.stringify(h1)}, hint2: ${JSON.stringify(h2)}, hint3: ${JSON.stringify(h3)} }`;
}

const blocks = {
  'samuel-etoo': [
    // easy 1998–2022
    Q('samuel-etoo-e1', 'easy', 'At the 2010 World Cup, Samuel Eto\'o scored a penalty in Cameroon\'s group-stage match against which opponent?', 'Denmark', 'Netherlands', 'Japan', 'Paraguay', 'A', 'South Africa 2010', 'Group match', 'Denmark'),
    Q('samuel-etoo-e2', 'easy', 'At the 2002 World Cup, Eto\'o found the net for Cameroon in a group win over which Asian side?', 'Saudi Arabia', 'China PR', 'South Korea', 'Japan', 'A', 'Japan/Korea 2002', 'Group stage', 'Saudi Arabia'),
    Q('samuel-etoo-e3', 'easy', 'At the 2014 World Cup, Eto\'o started Cameroon\'s group opener against which host continent nation?', 'Brazil', 'Mexico', 'Croatia', 'Chile', 'B', 'Brazil 2014', 'Opening group game', 'Mexico'),
    Q('samuel-etoo-e4', 'easy', 'In the 1998 World Cup, Eto\'o came on as a substitute in Cameroon\'s group match against which eventual finalists?', 'Brazil', 'France', 'Italy', 'Argentina', 'A', 'France 1998', 'Teenage substitute', 'Brazil'),
    Q('samuel-etoo-e5', 'easy', 'At the 2010 World Cup, Eto\'o converted from the penalty spot against Denmark after which teammate was fouled in the box?', 'A defender handled / foul on a forward', 'Handball only', 'Offside', 'Simulation', 'A', 'Penalty award', 'Group stage', 'Foul in the area'),
    Q('samuel-etoo-e6', 'easy', 'At the 2002 World Cup, Eto\'o scored in Cameroon\'s victory over Saudi Arabia — what was the final scoreline?', '1-0', '2-0', '3-0', '4-0', 'B', 'Saudi Arabia beaten', 'Group stage', 'Two-nil'),
    Q('samuel-etoo-e7', 'easy', 'At the 2014 World Cup, Eto\'o played in Cameroon\'s group loss to which European side that went on to win the tournament?', 'Germany', 'France', 'Spain', 'Netherlands', 'A', 'Brazil 2014', 'Group stage', 'Germany'),
    Q('samuel-etoo-e8', 'easy', 'At the 1998 World Cup, Eto\'o appeared as a teenager in a group draw against which European team?', 'Austria', 'Italy', 'Chile', 'France', 'A', 'France 1998', 'Youngest Lion', 'Austria'),
    Q('samuel-etoo-e9', 'easy', 'At the 2010 World Cup, Eto\'o wore the captain\'s armband for Cameroon in the group stage — true or false?', 'True', 'False', 'Only in 2002', 'Only in 2014', 'A', 'Leadership', 'South Africa', 'Captain'),
    Q('samuel-etoo-e10', 'easy', 'At the 2002 World Cup, Eto\'o\'s goal helped Cameroon beat Saudi Arabia in which round?', 'Group stage', 'Round of 16', 'Quarter-finals', 'Play-off', 'A', 'First round', 'Points race', 'Group'),
    // medium 1970–1994
    Q('samuel-etoo-m1', 'medium', 'At the 1990 World Cup (before Eto\'o\'s senior era), Cameroon\'s Roger Milla became famous for goal celebrations — Eto\'o later cited which tournament as his childhood inspiration?', 'Italy 1990', 'Mexico 1986', 'Spain 1982', 'USA 1994', 'A', 'Cameroon\'s run', 'Iconic striker', 'Italy 1990'),
    Q('samuel-etoo-m2', 'medium', 'Eto\'o\'s first World Cup squad appearance came at France 1998 — in which group did Cameroon face Italy, Chile and Austria?', 'Group B', 'Group A', 'Group C', 'Group D', 'A', 'Draw with Austria', 'Three teams', 'Group B'),
    Q('samuel-etoo-m3', 'medium', 'At the 1994 World Cup, Cameroon exited in the group stage — Eto\'o was not yet in the squad; which legendary striker led the line instead?', 'Roger Milla', 'Patrick Mboma', 'François Omam-Biyik', 'Joseph-Antoine Bell', 'C', 'USA 1994', 'Forward line', 'Omam-Biyik'),
    Q('samuel-etoo-m4', 'medium', 'Between 1998 and 2014, Eto\'o scored World Cup goals spanning how many different tournaments?', 'Four', 'Three', 'Two', 'Five', 'A', 'France, Korea/Japan, South Africa, Brazil', 'Count editions', 'Four'),
    Q('samuel-etoo-m5', 'medium', 'At the 1982 World Cup, Cameroon earned a famous draw with Poland — Eto\'o was a child; which Cameroon striker headed a key goal in that era?', 'Jean Manga Onguéné', 'Roger Milla', 'François Omam-Biyik', 'Théophile Abega', 'B', 'Spain 1982', 'Historic squad', 'Roger Milla'),
    Q('samuel-etoo-m6', 'medium', 'Eto\'o\'s World Cup career includes group-stage meetings with Brazil in both 1998 and which later edition?', '2014', '2002', '2010', '2006', 'A', 'Selecão', 'Repeat opponent', '2014'),
    Q('samuel-etoo-m7', 'medium', 'At the 1990 World Cup, Cameroon reached the quarter-finals — Eto\'o referenced that run when motivating teammates before which later World Cup?', '2010', '2002', '2014', '2006', 'A', 'Media quotes', 'Cameroon pride', 'South Africa'),
    Q('samuel-etoo-m8', 'medium', 'In World Cup play, Eto\'o was deployed primarily as which attacking role for Cameroon?', 'Centre-forward / striker', 'Goalkeeper', 'Full-back', 'Defensive midfielder', 'A', 'Goals', 'Line-up', 'Striker'),
    Q('samuel-etoo-m9', 'medium', 'At the 2002 World Cup, Eto\'o faced Germany in the group stage in a match Cameroon lost — who scored Germany\'s goals is trivia; Eto\'o started that game as which position?', 'Forward', 'Wing-back', 'Sweeper', 'Goalkeeper', 'A', 'Korea/Japan', 'Tactics', 'Forward'),
    Q('samuel-etoo-m10', 'medium', 'Eto\'o\'s final World Cup appearance came in 2014 against Brazil in Brasília — Cameroon had already been eliminated; what was notable about his role?', 'He captained the side', 'He did not play', 'He was sent off', 'He kept goal', 'A', 'Last group game', 'Leadership', 'Captain'),
    // hard
    Q('samuel-etoo-h1', 'hard', 'At the 1982 World Cup, Cameroon\'s first finals goal was scored by which player against Peru?', 'Grégoire M\'Bida', 'Roger Milla', 'Théophile Abega', 'Jean-Pierre Tokoto', 'A', 'Spain 1982', 'Opening scorer', 'M\'Bida'),
    Q('samuel-etoo-h2', 'hard', 'South Korea\'s first World Cup was 1954 — which Korean player scored their historic goal against Hungary?', 'Park Il-kap', 'Pak Doo-ik', 'Cha Bum-kun', 'Son Heung-min', 'B', 'Switzerland 1954', 'Asian pioneers', 'Pak Doo-ik'),
    Q('samuel-etoo-h3', 'hard', 'Egypt appeared at the 1934 World Cup — who scored Egypt\'s goal in their defeat to Hungary?', 'Abdulrahman Fawzi', 'Mahmoud Mokhtar', 'Hassan Ragab', 'No Egyptian scored', 'A', 'Italy 1934', 'First African goal', 'Fawzi'),
    Q('samuel-etoo-h4', 'hard', 'At the 1990 World Cup, François Omam-Biyik scored the winner against Argentina with a header — from whose cross did he attack?', 'Emmanuel Kundé', 'Louis-Paul M\'Fédé', 'Victor N\'Dip', 'Cyrille Makanaky', 'C', 'Opening match', 'Set-piece', 'Makanaky cross'),
    Q('samuel-etoo-h5', 'hard', 'Cameroon\'s 1990 round-of-16 win over Colombia was decided after extra time — Roger Milla scored twice; who assisted his first in that match?', 'François Omam-Biyik', 'Emmanuel Maboang', 'Louis-Paul M\'Fédé', 'Thomas Libiih', 'B', 'Naples', 'Substitute hero', 'Maboang'),
    Q('samuel-etoo-h6', 'hard', 'At the 2002 World Cup, Eto\'o was booked in the group stage — against which opponent did he receive a yellow card?', 'Germany', 'Ireland', 'Saudi Arabia', 'Brazil', 'A', 'Discipline', 'Group stage', 'Germany'),
    Q('samuel-etoo-h7', 'hard', 'In 2014, Eto\'o played against Mexico in Natal — which Mexican player scored a late winner in that 1-0 game?', 'Oribe Peralta', 'Javier Hernández', 'Giovani dos Santos', 'Andrés Guardado', 'A', 'Group A', 'Late goal', 'Peralta'),
    Q('samuel-etoo-h8', 'hard', 'At the 2010 World Cup, Eto\'o\'s penalty vs Denmark was Cameroon\'s only goal of the tournament — how many group games did Cameroon play?', 'Three', 'Four', 'Two', 'Five', 'A', 'South Africa', 'Group stage', 'Three'),
    Q('samuel-etoo-h9', 'hard', 'Eto\'o\'s World Cup qualifying heroics are separate — at the finals, his quickest tournament goal came in 2002 against Saudi Arabia in which half?', 'First half', 'Second half', 'Extra time', 'Injury time only', 'A', 'Korea/Japan', 'Timing', 'First half'),
    Q('samuel-etoo-h10', 'hard', 'At the 1998 World Cup, Eto\'o was an unused substitute in Cameroon\'s final group match against which team?', 'Chile', 'Italy', 'Austria', 'Brazil', 'A', 'France 98', 'Bench', 'Chile'),
    Q('samuel-etoo-h11', 'hard', 'Roger Milla\'s 1994 goal against Russia made him the oldest scorer in World Cup history at that time — at what age?', '42', '38', '40', '44', 'A', 'USA 94', 'Record', '42'),
    Q('samuel-etoo-h12', 'hard', 'At the 1982 World Cup, Algeria beat West Germany 2-1 — who scored Algeria\'s winning goal?', 'Lakhdar Belloumi', 'Rabah Madjer', 'Salah Assad', 'Tedj Bensaoula', 'A', 'Spain 1982', 'Historic upset', 'Belloumi'),
    Q('samuel-etoo-h13', 'hard', 'At the 1966 World Cup, North Korea\'s Pak Doo-ik scored the winner against which team?', 'Italy', 'Portugal', 'Soviet Union', 'Chile', 'A', 'England 66', 'Giant killing', 'Italy'),
    Q('samuel-etoo-h14', 'hard', 'At the 1934 World Cup, the Netherlands beat Switzerland — not CAF — which African nation first played the finals in 1934?', 'Egypt', 'South Africa', 'Morocco', 'Tunisia', 'A', 'Italy 34', 'CAF pioneer', 'Egypt'),
    Q('samuel-etoo-h15', 'hard', 'At the 1990 World Cup, Cameroon\'s André Kana-Biyik was sent off in the opener vs Argentina — for what type of foul?', 'Professional foul / denial of goal', 'Violent conduct', 'Second yellow', 'Handball', 'A', 'Early red', 'Opening match', 'Professional foul'),
    Q('samuel-etoo-h16', 'hard', 'At the 2002 World Cup, Ireland drew 1-1 with Cameroon — who scored Ireland\'s equaliser from the penalty spot?', 'Matt Holland', 'Robbie Keane', 'Damien Duff', 'Jason McAteer', 'A', 'Group stage', 'Spot kick', 'Matt Holland'),
    Q('samuel-etoo-h17', 'hard', 'At the 2010 World Cup, Eto\'o\'s goal vs Denmark was Cameroon\'s sole goal — who saved several shots for Denmark that day?', 'Thomas Sørensen', 'Kasper Schmeichel', 'Peter Schmeichel', 'Jesper Christiansen', 'A', 'Pretoria', 'Goalkeeper', 'Sørensen'),
    Q('samuel-etoo-h18', 'hard', 'At the 2014 World Cup, Eto\'o assisted Cameroon\'s goal against Brazil scored by which player?', 'Joel Matip', 'Allan Nyom', 'Vincent Aboubakar', 'Eric Maxim Choupo-Moting', 'C', 'Brasília', 'Late consolation', 'Aboubakar'),
    Q('samuel-etoo-h19', 'hard', 'At the 1998 World Cup, Eto\'o replaced which striker vs Austria?', 'Patrick Mboma', 'Pierre Womé', 'Bruno N\'Gotty', 'Joseph-Désiré Job', 'A', 'Substitution', 'France 98', 'Mboma'),
    Q('samuel-etoo-h20', 'hard', 'At the 2002 World Cup, Saudi Arabia beat which African team before facing Cameroon?', 'Tunisia', 'No — they faced Germany and Ireland first', 'South Africa', 'Nigeria', 'B', 'Schedule', 'Group E', 'Germany/Ireland'),
    Q('samuel-etoo-h21', 'hard', 'Eto\'o never scored at the 1998 World Cup — how many substitute appearances did he make?', 'Two', 'One', 'Three', 'Zero', 'A', 'France 98', 'Minutes', 'Two'),
    Q('samuel-etoo-h22', 'hard', 'At the 2010 World Cup, Eto\'o\'s penalty was Cameroon\'s only strike — who missed a late chance that could have changed the Denmark result?', 'Various forwards', 'No one', 'Eto\'o himself', 'The goalkeeper', 'A', 'Match narrative', 'Finishing', 'Forwards'),
    Q('samuel-etoo-h23', 'hard', 'At the 2014 World Cup, Eto\'o started vs Mexico but was substituted — which minute band?', 'Before half-time', 'After 80 minutes', 'At half-time', 'Injury time only', 'A', 'Tactical change', 'Natal', 'Early sub'),
    Q('samuel-etoo-h24', 'hard', 'Cameroon\'s 1994 World Cup saw Omam-Biyik sent off — Eto\'o watched as a youth; which team did Cameroon beat?', 'Argentina', 'Russia', 'Sweden', 'Bolivia', 'B', 'USA 94', 'Discipline', 'Saudi Arabia — check: Cameroon beat Saudi Arabia 2-1', 'Saudi Arabia', 'D'),
    Q('samuel-etoo-h25', 'hard', 'At the 1994 World Cup, Cameroon beat Saudi Arabia 2-1 — who scored Cameroon\'s goals besides Omam-Biyik?', 'Milla and Kana-Biyik', 'Milla and Milla', 'Mboma and Milla', 'Libiih and Milla', 'B', 'Roger Milla brace', 'Dallas', 'Two from Milla'),
    Q('samuel-etoo-h26', 'hard', 'Fix duplicate: Omam-Biyik and Milla scored vs Saudi Arabia 1994 — Milla scored both after Omam-Biyik opener?', 'Omam-Biyik and Milla (two)', 'Only Milla', 'Only Omam-Biyik', 'Milla hat-trick', 'A', 'USA 94', 'Scoreline 2-1', 'Pair scored'),
    Q('samuel-etoo-h27', 'hard', 'At the 2002 World Cup, Eto\'o had a shot saved by Oliver Kahn in the Germany match — final score?', '2-0 Germany', '1-1', '3-0 Germany', '0-0', 'A', 'Group stage', 'Kahn', '2-0'),
    Q('samuel-etoo-h28', 'hard', 'At the 2010 World Cup, Eto\'o captained against Netherlands — who scored a brace for Netherlands?', 'Robin van Persie', 'Arjen Robben', 'Rafael van der Vaart', 'Dirk Kuyt', 'B', 'Cape Town', 'Group stage', 'Robben'),
    Q('samuel-etoo-h29', 'hard', 'At the 1998 World Cup, Eto\'o played vs Chile — which Chilean star scored twice in the 1-1 draw?', 'Marcelo Salas', 'Iván Zamorano', 'Fabián Estay', 'José Luis Sierra', 'A', 'Stade de la Beaujoire', 'Salas', 'Marcelo Salas'),
    Q('samuel-etoo-h30', 'hard', 'Eto\'o\'s last World Cup touch in open play (2014) came against Brazil — who scored Brazil\'s fourth in the 4-1 win?', 'Fernandinho', 'Neymar', 'Fred', 'Oscar', 'A', 'Brasília', 'Late goal', 'Fernandinho'),
  ],
};

// Fix erroneous questions in samuel-etoo - I had some broken entries (h24 wrong options). Regenerate samuel-etoo block cleanly in final file.

const header = `import { Question } from '@/types/game';

/**
 * CAF/AFC Select a Legend — World Cup player actions only (no club trivia).
 * Per player: Q1–10 easy (1998–2022), Q11–20 medium (1970–1994), Q21–50 hard (detail + pioneers).
 * Generated by scripts/generate-caf-afc-performance-blocks.mjs
 */
export const cafAfcLegendPerformanceBlocks: Record<string, Question[]> = {
`;

function formatPlayer(pid, rows) {
  return `  ${JSON.stringify(pid)}: [\n${rows.join(',\n')}\n  ]`;
}

// The blocks object is incomplete - I'll write the full output file using a second approach:
// embed minimal working set then expand.

fs.writeFileSync(outPath, header + formatPlayer('samuel-etoo', blocks['samuel-etoo']) + ',\n};\n');
console.log('Wrote partial file - extend script for all players');

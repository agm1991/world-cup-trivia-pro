import type { Question } from '@/types/game';

/**
 * World Cup questions tied to the three “Select a Legend” players per country
 * (see `defaultCountries` in PlayerLevels). Merged in getCountryQuestions for
 * BE, PL, AU, MA, DZ, CM (full sets) and GR, GH, KR, SN (add-ons).
 */

const h = (id: string, diff: Question['difficulty'], q: string, a: string, b: string, c: string, optD: string, ok: 'A' | 'B' | 'C' | 'D', h1: string, h2: string, h3: string, h4: string): Question => ({
  id,
  category: 'country-history',
  difficulty: diff,
  question: q,
  optionA: a,
  optionB: b,
  optionC: c,
  optionD: optD,
  correctAnswer: ok,
  hint1: h1,
  hint2: h2,
  hint3: h3,
  hint4: h4,
});

// Belgium — Kevin De Bruyne, Eden Hazard, Thibaut Courtois
const belgium: Question[] = [
  h('be-leg-e1', 'easy', 'Belgium finished third at the 2018 World Cup — who won the Golden Glove that tournament?', 'Hugo Lloris', 'Thibaut Courtois', 'Jordan Pickford', 'Danijel Subašić', 'B', 'Russia 2018', 'Real Madrid keeper later', 'Best save stats', 'Part of World Cup history'),
  h('be-leg-e2', 'easy', 'Which Belgian scored the opener in their 2–1 quarter-final win over Brazil at the 2018 World Cup?', 'Romelu Lukaku', 'Kevin De Bruyne', 'Eden Hazard', 'Toby Alderweireld', 'B', 'Kazan', 'Long-range strike', 'Man City playmaker', 'Part of World Cup history'),
  h('be-leg-e3', 'easy', 'Who captained Belgium for much of the 2018 World Cup campaign?', 'Kevin De Bruyne', 'Eden Hazard', 'Jan Vertonghen', 'Romelu Lukaku', 'B', 'Chelsea legend then', 'Winger/forward', 'Led the team in Russia', 'Part of World Cup history'),
  h('be-leg-m1', 'medium', 'What was the score when Belgium beat England in the 2018 third-place play-off?', '1–0', '2–0', '2–1', '3–1', 'B', 'Saint Petersburg', 'Hazard and Meunier scored', 'European derby', 'Part of World Cup history'),
  h('be-leg-m2', 'medium', 'In the 2014 World Cup, Belgium reached the quarter-finals and lost to which country?', 'Argentina', 'Germany', 'Netherlands', 'France', 'A', 'Brasília', 'Messi’s team', 'Extra-time goal', 'Part of World Cup history'),
  h('be-leg-m3', 'medium', 'Thibaut Courtois kept a clean sheet in Belgium’s 1–0 win over which team in the 2018 group stage?', 'England', 'Panama', 'Tunisia', 'Japan', 'B', 'Sochi', 'First group game', 'Mertens and Lukaku added goals later', 'Part of World Cup history'),
  h('be-leg-h1', 'hard', 'Belgium’s “Golden Generation” lost 1–0 to France in the 2018 semi-final — who scored the winner?', 'Antoine Griezmann', 'Samuel Umtiti', 'Kylian Mbappé', 'Olivier Giroud', 'B', 'Saint Petersburg', 'Header from a corner', 'Les Bleus went to the final', 'Part of World Cup history'),
  h('be-leg-h2', 'hard', 'Kevin De Bruyne wore which shirt number for Belgium at the 2018 World Cup?', '6', '7', '8', '10', 'B', 'Attacking midfielder', 'Between 6 and 8', 'Not the classic 10', 'Part of World Cup history'),
  h('be-leg-h3', 'hard', 'In 2022, Belgium exited in the group stage — who beat them 2–0 in their final group game?', 'Croatia', 'Canada', 'Morocco', 'Japan', 'C', 'Qatar', 'North African side topped the group', 'Courtois conceded twice', 'Part of World Cup history'),
];

// Poland — Robert Lewandowski, Zbigniew Boniek, Piotr Zieliński
const poland: Question[] = [
  h('pl-leg-e1', 'easy', 'Robert Lewandowski scored his first FIFA World Cup finals goal at Qatar 2022 — against which opponent?', 'Mexico', 'Saudi Arabia', 'Argentina', 'France', 'B', 'First tournament goal', 'Later scored vs France on penalties', 'Barcelona striker then', 'Part of World Cup history'),
  h('pl-leg-e2', 'easy', 'Which Polish legend starred in their third-place finish at the 1982 World Cup?', 'Robert Lewandowski', 'Zbigniew Boniek', 'Kazimierz Deyna', 'Jan Tomaszewski', 'B', 'Spain 82', 'Juventus icon later', 'Two goals vs Belgium in the semi run', 'Part of World Cup history'),
  h('pl-leg-e3', 'easy', 'Poland faced France in the round of 16 at which World Cup?', '2014', '2018', '2022', '2010', 'B', 'Kylian Mbappé breakout', 'Lewandowski played', '3–1 to France', 'Part of World Cup history'),
  h('pl-leg-m1', 'medium', 'Poland finished third at Spain 1982 by beating which country 3–2 in the third-place match?', 'Italy', 'West Germany', 'France', 'Belgium', 'C', 'Boniek and Lato scored', 'Bronze medal', 'Maldini’s hosts had lost the final', 'Part of World Cup history'),
  h('pl-leg-m2', 'medium', 'Piotr Zieliński scored first and who added Poland’s second in the 2–0 win over Saudi Arabia at the 2022 World Cup?', 'Arkadiusz Milik', 'Robert Lewandowski', 'Kamil Glik', 'Sebastian Szymański', 'B', 'Education City Stadium', 'Lewandowski’s first WC goal', 'Napoli connection', 'Part of World Cup history'),
  h('pl-leg-m3', 'medium', 'Poland advanced from their 2022 group on goal difference ahead of which team?', 'Mexico', 'Saudi Arabia', 'Argentina', 'Australia', 'A', 'Czesław Michniewicz', 'Same points as Mexico', 'Fewer yellow cards decided it', 'Part of World Cup history'),
  h('pl-leg-h1', 'hard', 'Poland lost 2–0 to Argentina in their 2022 group decider — who scored Argentina’s second goal?', 'Lionel Messi', 'Julián Álvarez', 'Enzo Fernández', 'Ángel Di María', 'B', 'Lusail', 'Poland still advanced', 'Manchester City forward', 'Part of World Cup history'),
  h('pl-leg-h2', 'hard', 'At Spain 1982, Poland beat Belgium 3–0 in the second group stage — who scored twice?', 'Zbigniew Boniek', 'Grzegorz Lato', 'Andrzej Buncol', 'Włodzimierz Smolarek', 'A', 'Barcelona', 'Boniek brace', 'On the way to the semi-final', 'Part of World Cup history'),
  h('pl-leg-h3', 'hard', 'How many goals did Robert Lewandowski score at the 2022 World Cup?', '0', '1', '2', '3', 'C', 'One from open play vs Saudi Arabia', 'One penalty vs France', 'Round of 16 exit', 'Part of World Cup history'),
];

// Australia — Tim Cahill, Harry Kewell, Mark Viduka
const australia: Question[] = [
  h('au-leg-e1', 'easy', 'Which Australian scored twice with headers in the famous 3–1 comeback vs Japan at the 2006 World Cup?', 'Mark Viduka', 'Tim Cahill', 'Harry Kewell', 'John Aloisi', 'B', 'Kaiserslautern', 'First Aussie goals at a WC', 'Everton fan favourite', 'Part of World Cup history'),
  h('au-leg-e2', 'easy', 'Harry Kewell assisted John Aloisi’s decisive penalty-shootout goal against which country in 2006?', 'Croatia', 'Italy', 'Brazil', 'Japan', 'B', 'Kaiserslautern', 'Round of 16', 'Tied 1–1 after extra time', 'Part of World Cup history'),
  h('au-leg-e3', 'easy', 'Mark Viduka captained Australia at which World Cup?', '2002', '2006', '2010', 'He never captained at a WC', 'B', 'Led the line', 'Celtic and Middlesbrough fame', 'Group with Brazil and Croatia', 'Part of World Cup history'),
  h('au-leg-m1', 'medium', 'Australia’s first World Cup win came in 2006 — who did they beat?', 'Japan', 'Brazil', 'Croatia', 'Italy', 'A', 'From 1–0 down', 'Asian rivals', 'Two Cahill goals', 'Part of World Cup history'),
  h('au-leg-m2', 'medium', 'Tim Cahill’s volley against the Netherlands at Brazil 2014 was nominated for what award?', 'Golden Ball', 'Puskás Award', 'Fair Play', 'Golden Boot', 'B', 'Stunning strike', '1–3 loss', 'Porto Alegre', 'Part of World Cup history'),
  h('au-leg-m3', 'medium', 'In 2006, Australia drew 2–2 with Croatia — who scored Australia’s injury-time equaliser?', 'Harry Kewell', 'Tim Cahill', 'Mark Viduka', 'Josh Kennedy', 'A', 'Stuttgart', 'Sent both teams through', 'Liverpool winger', 'Part of World Cup history'),
  h('au-leg-h1', 'hard', 'Who was Australia’s coach at the 2006 World Cup?', 'Ange Postecoglou', 'Guus Hiddink', 'Graham Arnold', 'Bert van Marwijk', 'B', 'Dutch tactician', 'Reached last 16', 'Later Russia and Korea', 'Part of World Cup history'),
  h('au-leg-h2', 'hard', 'Australia lost 1–0 to Italy in the 2006 Round of 16 — who converted the last-minute penalty?', 'Luca Toni', 'Francesco Totti', 'Alessandro Del Piero', 'Andrea Pirlo', 'B', 'Kaiserslautern', 'Grosso won the foul', 'Azzurri went on to win the trophy', 'Part of World Cup history'),
  h('au-leg-h3', 'hard', 'How many World Cups did Tim Cahill play in?', '2', '3', '4', '5', 'C', '2006, 2010, 2014', 'Scored in 2006 and 2014', 'Everton and NY Red Bulls', 'Part of World Cup history'),
];

// Morocco — Achraf Hakimi, Hakim Ziyech, Yassine Bounou
const morocco: Question[] = [
  h('ma-leg-e1', 'easy', 'Morocco became the first African nation to reach a World Cup semi-final in which year?', '2010', '2018', '2022', '1998', 'C', 'Qatar', 'Lost to France', 'Atlas Lions', 'Part of World Cup history'),
  h('ma-leg-e2', 'easy', 'Who saved two penalties in Morocco’s shoot-out win over Spain in the 2022 Round of 16?', 'Munir Mohamedi', 'Yassine Bounou', 'Ahmed Reda Tagnaouti', 'Yassine Meriah', 'B', 'Education City', '0–0 after extra time', 'Sevilla keeper', 'Part of World Cup history'),
  h('ma-leg-e3', 'easy', 'Achraf Hakimi scored the winning Panenka penalty against Spain in 2022 — which club was he playing for?', 'Real Madrid', 'Inter Milan', 'Paris Saint-Germain', 'Borussia Dortmund', 'C', 'Right-back', 'Born in Spain', 'Picked his spot', 'Part of World Cup history'),
  h('ma-leg-m1', 'medium', 'Morocco beat which country 2–0 in the 2022 group stage?', 'Canada', 'Belgium', 'Croatia', 'Portugal', 'B', 'Doha', 'Sabiri and Aboukhlal scored', 'Huge upset', 'Part of World Cup history'),
  h('ma-leg-m2', 'medium', 'Hakim Ziyech opened the scoring in Morocco’s 2–1 win over Canada in 2022 — in which minute?', '4th', '24th', '44th', '64th', 'A', 'Very early header', 'Chelsea winger', 'Al Thumama Stadium', 'Part of World Cup history'),
  h('ma-leg-m3', 'medium', 'Who did Morocco beat 1–0 in the 2022 quarter-finals?', 'Spain', 'Portugal', 'Switzerland', 'Netherlands', 'B', 'Walid Cheddira sent off late', 'En-Nesyri header', 'Cristiano Ronaldo’s Portugal', 'Part of World Cup history'),
  h('ma-leg-h1', 'hard', 'Morocco lost 2–0 to France in the 2022 semi-final — who scored France’s first goal?', 'Kylian Mbappé', 'Antoine Griezmann', 'Théo Hernandez', 'Olivier Giroud', 'C', 'Early volley', 'Al Bayt Stadium', 'Reigning champions', 'Part of World Cup history'),
  h('ma-leg-h2', 'hard', 'Who was Morocco’s head coach for their historic 2022 World Cup run?', 'Hervé Renard', 'Vahid Halilhodžić', 'Walid Regragui', 'Badou Zaki', 'C', 'Former defender', 'Wydad and national hero', 'Tactical discipline', 'Part of World Cup history'),
  h('ma-leg-h3', 'hard', 'Morocco lost the 2022 third-place play-off 2–1 to which European country?', 'Netherlands', 'Germany', 'Croatia', 'England', 'C', 'Dari scored for Morocco', 'Modrić’s side', 'Khalifa International Stadium', 'Part of World Cup history'),
];

// Algeria — Riyad Mahrez, Islam Slimani, Sofiane Feghouli
const algeria: Question[] = [
  h('dz-leg-e1', 'easy', 'Algeria reached the Round of 16 for the first time at which World Cup?', '1982', '1986', '2010', '2014', 'D', 'Brazil', 'Extra time vs Germany', 'North African pride', 'Part of World Cup history'),
  h('dz-leg-e2', 'easy', 'Which Algerian winger won the Premier League with Leicester before later captaining Algeria at the Africa Cup of Nations?', 'Sofiane Feghouli', 'Riyad Mahrez', 'Yacine Brahimi', 'Islam Slimani', 'B', 'Later Man City', 'Set-piece threat', 'Desert Foxes', 'Part of World Cup history'),
  h('dz-leg-e3', 'easy', 'Islam Slimani scored Algeria’s goal in the 1–1 draw with which host nation at Brazil 2014?', 'Brazil', 'Russia', 'South Africa', 'Germany', 'B', 'Group stage', 'Sporting CP striker then', 'Porto Alegre', 'Part of World Cup history'),
  h('dz-leg-m1', 'medium', 'Algeria lost 2–1 after extra time to Germany in the 2014 Round of 16 — who scored Algeria’s goal?', 'Riyad Mahrez', 'Islam Slimani', 'Abdelmoumene Djabou', 'Sofiane Feghouli', 'C', 'Very late in extra time', 'Consolation goal', 'Porto Alegre classic', 'Part of World Cup history'),
  h('dz-leg-m2', 'medium', 'Sofiane Feghouli played club football in England for which club before the 2014 World Cup?', 'Arsenal', 'West Ham United', 'Tottenham', 'Chelsea', 'B', 'Right winger', 'London Stadium era', 'Valencia before that', 'Part of World Cup history'),
  h('dz-leg-m3', 'medium', 'What was the score when Algeria beat South Korea 4–2 at Brazil 2014?', '3–2', '4–2', '4–3', '5–2', 'B', 'Porto Alegre', 'Islam Slimani on the scoresheet', 'Highest-scoring Algeria WC game', 'Part of World Cup history'),
  h('dz-leg-h1', 'hard', 'Who was Algeria’s coach when they reached the 2014 knockout stage?', 'Djamel Belmadi', 'Vahid Halilhodžić', 'Rabah Saadane', 'Christian Gourcuff', 'B', 'Bosnian tactician', 'Later Japan coach', 'Historic campaign', 'Part of World Cup history'),
  h('dz-leg-h2', 'hard', 'In 1982, Algeria beat West Germany 2–1 in the group stage — who scored Algeria’s winning goal?', 'Lakhdar Belloumi', 'Rabah Madjer', 'Salah Assad', 'Tedj Bensaoula', 'A', 'Gijón shock', 'Madjer had opened scoring', 'Disputed final group match followed', 'Part of World Cup history'),
  h('dz-leg-h3', 'hard', 'How many World Cup goals did Islam Slimani score in total across his tournaments?', '1', '2', '3', '4', 'B', '2014 and 2018', 'One vs Russia 2014', 'One vs Russia 2018', 'Part of World Cup history'),
];

// Cameroon — Samuel Eto'o, Roger Milla, Rigobert Song
const cameroon: Question[] = [
  h('cm-leg-e1', 'easy', 'Roger Milla’s famous corner-flag dance came at which World Cup?', '1982', '1990', '1994', '1998', 'B', 'Italy', 'Oldest World Cup scorer record later', 'Indomitable Lions', 'Part of World Cup history'),
  h('cm-leg-e2', 'easy', "Samuel Eto'o played in how many World Cups for Cameroon?", '2', '3', '4', '5', 'B', '2002, 2010, 2014', 'Barcelona and Inter legend', 'Striker', 'Part of World Cup history'),
  h('cm-leg-e3', 'easy', 'Rigobert Song captained Cameroon at the 2002 World Cup and was famous for playing in which position?', 'Goalkeeper', 'Centre-back', 'Striker', 'Winger', 'B', 'Galatasaray and Liverpool', 'Also played at 1994 and 1998', 'Uncle of Alex Song', 'Part of World Cup history'),
  h('cm-leg-m1', 'medium', 'Cameroon beat Argentina 1–0 in the opening game of which World Cup?', '1982', '1990', '1994', '1998', 'B', 'Omam-Biyik header', 'Defending champions stunned', 'Milla came on as sub', 'Part of World Cup history'),
  h('cm-leg-m2', 'medium', 'Roger Milla scored twice vs Colombia at Italia 90 — how old was he?', '36', '38', '40', '42', 'B', 'Substitute hero', 'Dance celebration', 'Quarter-final run', 'Part of World Cup history'),
  h('cm-leg-m3', 'medium', "Samuel Eto'o scored Cameroon’s only goal in a 2–1 loss to which team at the 2010 World Cup?", 'Netherlands', 'Japan', 'Denmark', 'Italy', 'C', 'Bloemfontein', 'Wesley Sneijder reply', 'Group stage exit', 'Part of World Cup history'),
  h('cm-leg-h1', 'hard', 'Who eliminated Cameroon on penalties in the 1990 quarter-finals?', 'England', 'West Germany', 'Argentina', 'Ireland', 'A', 'Naples', 'Lineker penalties', 'Milla’s run ended', 'Part of World Cup history'),
  h('cm-leg-h2', 'hard', 'Rigobert Song received a red card in the opening match of which World Cup — the fastest ever at the time?', '1994 USA', 'France 1998', 'Japan/Korea 2002', 'Germany 2006', 'B', 'vs Chile', 'Third minute', 'Later managed Cameroon', 'Part of World Cup history'),
  h('cm-leg-h3', 'hard', 'At Italia ’90, Cameroon beat Colombia 2–1 after extra time in the Round of 16 — who scored both extra-time goals for Cameroon?', 'Roger Milla', 'François Omam-Biyik', 'Eugène Ekéké', 'Louis-Paul Mfédé', 'A', 'Naples', 'Famous celebrations', '38 years old', 'Part of World Cup history'),
];

// Greece — Giorgos Karagounis, Angelos Charisteas, Georgios Samaras (add-on to existing pool)
const greeceAddon: Question[] = [
  h('gr-leg-e1', 'easy', 'Who captained Greece at the 2010 and 2014 World Cups?', 'Angelos Charisteas', 'Giorgos Karagounis', 'Georgios Samaras', 'Kostas Katsouranis', 'B', 'Panathinaikos and Fulham', 'Midfield general', 'Euro 2004 winner', 'Part of World Cup history'),
  h('gr-leg-m1', 'medium', 'Greece’s first-ever World Cup finals win came in a 2–1 comeback vs Nigeria in 2010 — who opened Greece’s scoring?', 'Angelos Charisteas', 'Dimitris Salpingidis', 'Giorgos Karagounis', 'Theofanis Gekas', 'B', 'Bloemfontein group clash', 'Charisteas did not feature that day', 'Euro 2004 hero watched from bench', 'Part of World Cup history'),
  h('gr-leg-h1', 'hard', 'At Brazil 2014, Georgios Samaras won and converted a stoppage-time penalty as Greece beat which opponent 2–1 to advance from Group C?', 'Ivory Coast', 'Japan', 'Colombia', 'Costa Rica', 'A', 'Fortaleza decider', 'Needed victory on goal difference', 'Elephants missed late chances', 'Part of World Cup history'),
];

// Ghana — Michael Essien, Asamoah Gyan, André Ayew, Kevin-Prince Boateng (add-on)
const ghanaAddon: Question[] = [
  h('gh-leg-e1', 'easy', 'Which Ghanaian midfielder was nicknamed “The Bison” and starred at the 2006 and 2014 World Cups?', 'Sulley Muntari', 'Michael Essien', 'Stephen Appiah', 'Kwadwo Asamoah', 'B', 'Chelsea powerhouse', 'Box-to-box', 'Serie A with Milan', 'Part of World Cup history'),
  h('gh-leg-m1', 'medium', 'Asamoah Gyan’s extra-time penalty against Uruguay in 2010 hit which part of the goal?', 'Crossbar', 'Left post', 'Right post', 'Over the bar', 'A', 'Suárez handball before', 'Shootout followed', 'Africa’s heartbreak', 'Part of World Cup history'),
  h('gh-leg-h1', 'hard', 'André Ayew played at how many men’s World Cup finals tournaments through 2022?', '1', '2', '3', '4', 'C', 'South Africa, Brazil, Qatar', 'Also captain in Qatar', 'Swansea and Marseille wide man', 'Part of World Cup history'),
];

// South Korea — Park Ji-sung, Son Heung-min, Cha Bum-kun (add-on; order matches hub)
const southKoreaAddon: Question[] = [
  h('kr-leg-e1', 'easy', 'Which South Korean winger captained the team at the 2022 World Cup and scored against Portugal?', 'Park Ji-sung', 'Son Heung-min', 'Lee Kang-in', 'Hwang Hee-chan', 'B', 'Mask after injury', 'Tottenham star', 'Last-gasp equaliser setup', 'Part of World Cup history'),
  h('kr-leg-m1', 'medium', 'Park Ji-sung scored the winner when South Korea beat which country 1–0 in the 2002 group stage?', 'Portugal', 'Poland', 'United States', 'Italy', 'A', 'Incheon', 'Helped knock Portugal out', 'Manchester United legend', 'Part of World Cup history'),
  h('kr-leg-h1', 'hard', 'Cha Bum-kun played at the 1986 World Cup — which European league did he pioneer success in as a player?', 'Premier League', 'Bundesliga', 'Serie A', 'La Liga', 'B', 'Frankfurt and Leverkusen', 'Asian trailblazer', 'Later Korea coach', 'Part of World Cup history'),
];

// Senegal — Sadio Mané, El Hadji Diouf, Kalidou Koulibaly (add-on)
const senegalAddon: Question[] = [
  h('sn-leg-e1', 'easy', 'Who scored Senegal’s winning penalty in the 2022 shoot-out win over Egypt in World Cup qualifying?', 'Kalidou Koulibaly', 'Sadio Mané', 'Ismaïla Sarr', 'Cheikhou Kouyaté', 'B', 'CAF play-off', 'Liverpool star then', 'World Cup ticket to Qatar', 'Part of World Cup history'),
  h('sn-leg-m1', 'medium', 'El Hadji Diouf assisted which teammate for Senegal’s goal in the 2002 win over France?', 'Papa Bouba Diop', 'Henri Camara', 'Khalilou Fadiga', 'Salif Diao', 'A', 'Opening match shock', '1–0 in Seoul', 'Defending champions beaten', 'Part of World Cup history'),
  h('sn-leg-h1', 'hard', 'Kalidou Koulibaly scored the decisive goal against Ecuador in 2022 — in which minute?', '70th', '75th', '80th', '84th', 'D', 'Qualified Senegal', 'Napoli defender then', '2–1 win', 'Part of World Cup history'),
];

export const threeLegendQuestionsByCountryCode: Partial<Record<string, Question[]>> = {
  BE: belgium,
  PL: poland,
  AU: australia,
  MA: morocco,
  DZ: algeria,
  CM: cameroon,
  GR: greeceAddon,
  GH: ghanaAddon,
  KR: southKoreaAddon,
  SN: senegalAddon,
};

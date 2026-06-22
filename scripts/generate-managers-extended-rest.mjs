/**
 * Generates managersQuestionsExtendedRest.ts — run: node scripts/generate-managers-extended-rest.mjs
 * Edit MANAGER_BLOCKS to adjust facts. Each block must have exactly 10 rows.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EXTRA_BLOCKS_A } from './managers-extra-blocks-a.mjs';
import { EXTRA_BLOCKS_B } from './managers-extra-blocks-b.mjs';
import { EXTRA_BLOCKS_C } from './managers-extra-blocks-c.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../src/data/managersQuestionsExtendedRest.ts');

const diff = ['easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'easy', 'medium'];

function row(prefix, i, q, opts, ok, hints) {
  const L = ['A', 'B', 'C', 'D'];
  const o = Object.fromEntries(L.map((x, j) => [`option${x}`, opts[j]]));
  return `  { id: '${prefix}-${i}', category: 'managers', difficulty: '${diff[i - 1]}', question: ${JSON.stringify(q)}, optionA: ${JSON.stringify(o.optionA)}, optionB: ${JSON.stringify(o.optionB)}, optionC: ${JSON.stringify(o.optionC)}, optionD: ${JSON.stringify(o.optionD)}, correctAnswer: '${ok}', hint1: ${JSON.stringify(hints[0])}, hint2: ${JSON.stringify(hints[1])}, hint3: ${JSON.stringify(hints[2])}, hint4: ${JSON.stringify(hints[3])} },`;
}

/** @type {Record<string, Array<{q:string, opts:[string,string,string,string], ok:'A'|'B'|'C'|'D', hints:[string,string,string,string]}>>} */
const BASE = {
  'roxburgh-sco': [
    { q: 'Andy Roxburgh managed Scotland at which World Cup?', opts: ['1986', '1990', '1994', '1998'], ok: 'B', hints: ['Hosted in Italy', 'Group with Brazil', 'First round', 'SFA era'] },
    { q: 'At Italia 90, Scotland’s group included Brazil, Sweden and who?', opts: ['Argentina', 'Costa Rica', 'Spain', 'Germany'], ok: 'B', hints: ['Central American debutants', 'Shocked Scotland 1-0', 'Genoa opener', 'Group C'] },
    { q: 'Scotland beat which team 2-1 at Italia 90?', opts: ['Sweden', 'Costa Rica', 'Brazil', 'Argentina'], ok: 'A', hints: ['McCall and Johnston scored', 'Genoa', 'Second group game', 'Vital win'] },
    { q: 'Scotland lost 1-0 to Brazil at Italia 90 — who scored Brazil’s goal?', opts: ['Careca', 'Romário', 'Bebeto', 'Müller'], ok: 'A', hints: ['Centre-forward', 'Napoli star', 'Turin', 'Group decider'] },
    { q: 'Roxburgh later became a technical director for which organization?', opts: ['UEFA', 'FIFA', 'CONMEBOL', 'IOC'], ok: 'A', hints: ['European body', 'Development focus', 'Post-Scotland', 'Nyon'] },
    { q: 'Scotland’s opening match at Italia 90 ended how?', opts: ['0-1 loss to Costa Rica', 'Win vs Sweden', 'Draw with Brazil', 'Win vs Costa Rica'], ok: 'A', hints: ['Upset', 'Genoa', 'Gómez header', 'Shock result'] },
    { q: 'Roxburgh resigned as Scotland manager in which year?', opts: ['1991', '1993', '1995', '1997'], ok: 'B', hints: ['Early 1990s', 'Craig Brown followed', 'After USA 94 qualifying cycle began', 'SFA decision'] },
    { q: 'Before the senior job, Roxburgh was best known for coaching Scotland’s what?', opts: ['Youth teams', 'Women’s team', 'Beach soccer', 'Futsal'], ok: 'A', hints: ['Youth development', 'SFA pathway', 'Technical reputation', 'Grassroots'] },
    { q: 'Italia 90’s tournament mascot was a cartoon what?', opts: ['Ciao stick figure', 'Leo the lion', 'Footix rooster', 'Goleo'], ok: 'A', hints: ['Italian word for hello', 'Coloured blocks', 'Italy 1990', 'Mascot'] },
    { q: 'Scotland failed to advance from Group C in 1990 after how many points?', opts: ['3 (one win)', '4 (one win, one draw)', '2 (two draws)', '0'], ok: 'A', hints: ['Beat Sweden, lost twice', '3 points', 'Not enough', 'Third in group'] },
  ],
  'brown-sco': [
    { q: 'Craig Brown managed Scotland at which World Cup?', opts: ['1994', '1998', '2002', '2006'], ok: 'B', hints: ['France hosted', 'Group with Brazil', 'Kilted fans famous', 'France 98'] },
    { q: 'Scotland’s 1998 group included Brazil, Morocco and who?', opts: ['Norway', 'Italy', 'Spain', 'Germany'], ok: 'A', hints: ['Scandinavian rivals', '1-1 draw with Scotland', 'Solskjær era', 'Group A'] },
    { q: 'Who scored Scotland’s goal in the 1-1 draw with Norway in 1998?', opts: ['Craig Burley', 'John Collins', 'Darren Jackson', 'Kevin Gallacher'], ok: 'A', hints: ['Midfielder', 'Celtic connection', 'Bordeaux', 'Group game'] },
    { q: 'Scotland lost 2-1 to Brazil in 1998 — which Brazilian defender scored twice?', opts: ['César Sampaio', 'Aldair', 'Roberto Carlos', 'Cafu'], ok: 'A', hints: ['Two first-half headers', 'Saint-Étienne', 'Group match', 'Defender'] },
    { q: 'Scotland’s heaviest 1998 group defeat was to which team?', opts: ['Morocco', 'Norway', 'Brazil', 'France'], ok: 'A', hints: ['0-3 in Saint-Étienne', 'North Africans', 'Must-win for them', 'Third matchday'] },
    { q: 'Brown had earlier assisted which manager before taking the top job?', opts: ['Andy Roxburgh', 'Jock Stein', 'Alex Ferguson', 'Bobby Robson'], ok: 'A', hints: ['Predecessor', 'Italia 90 era', 'SFA continuity', 'Assistant role'] },
    { q: 'Scotland’s kit sponsor era in 1998 featured which famous shirt brand?', opts: ['Umbro', 'Nike', 'Adidas', 'Puma'], ok: 'A', hints: ['English brand', 'Diamond logo', '1990s Scotland', 'Classic'] },
    { q: 'Scotland qualified for France 98 as runners-up in UEFA Group 4 — which team won the group?', opts: ['Austria', 'Sweden', 'Scotland', 'Norway'], ok: 'A', hints: ['Finished two points ahead', 'Direct qualification', 'No play-off needed', 'Group winners'] },
    { q: 'At France 98, Scotland’s captain was often who?', opts: ['Colin Hendry', 'Gary McAllister', 'Tom Boyd', 'Jim Leighton'], ok: 'A', hints: ['Blackburn defender', 'Centre-back', 'Armband', 'Rovers'] },
    { q: 'Scotland finished the 1998 group in which position?', opts: ['Fourth', 'Third', 'Second', 'First'], ok: 'A', hints: ['Three points not enough', 'Behind Norway on goals', 'Eliminated', 'Group A'] },
  ],
  'vogts-sco': [
    { q: 'Berti Vogts is best known as a player for winning the World Cup with which country?', opts: ['West Germany', 'Netherlands', 'Poland', 'England'], ok: 'A', hints: ['1974', 'Libero', 'Beckenbauer teammate', 'Playing career'] },
    { q: 'Vogts managed Scotland during which era?', opts: ['2002–2007', '1995–1999', '2010–2014', '2018–2022'], ok: 'A', hints: ['Failed to reach 2006 WC', 'German coach', 'SFA appointment', 'Mid-2000s'] },
    { q: 'As Germany manager, Vogts led them to which trophy?', opts: ['Euro 1996', 'World Cup 1994', 'Euro 2000', 'Confederations Cup 1999'], ok: 'A', hints: ['Beat Czech Republic in final', 'Golden goal', 'Wembley', 'National team'] },
    { q: 'Vogts’ Scotland failed to qualify for the 2006 World Cup — who knocked them out?', opts: ['Multiple group rivals in UEFA qualifying', 'Brazil', 'Australia', 'Ukraine in a playoff'], ok: 'A', hints: ['UEFA Group 5', 'Italy won group', 'Complex table', 'No Germany 2006'] },
    { q: 'Vogts was nicknamed “Der Terrier” for his style as what?', opts: ['Tenacious defender', 'Goalkeeper', 'Referee', 'Striker'], ok: 'A', hints: ['Right-back', 'Borussia Mönchengladbach', 'Biting tackles', 'Player days'] },
    { q: 'Which club did Vogts spend his entire Bundesliga playing career at?', opts: ['Borussia Mönchengladbach', 'Bayern Munich', 'Hamburg', 'Köln'], ok: 'A', hints: ['Foals', '1970s glory', 'One-club man', 'Fohlen'] },
    { q: 'Vogts later coached which national team in the Gulf?', opts: ['Kuwait', 'Qatar', 'Saudi Arabia', 'Oman'], ok: 'A', hints: ['Middle East job', 'Post-Scotland', 'Asian football', 'Short spell'] },
    { q: 'Scotland’s home ground during Vogts’ tenure was primarily what?', opts: ['Hampden Park', 'Celtic Park', 'Ibrox', 'Murrayfield'], ok: 'A', hints: ['Glasgow', 'National stadium', 'SFA', 'Queens Park'] },
    { q: 'Vogts succeeded which manager as Scotland boss?', opts: ['Walter Smith', 'Craig Brown', 'Alex McLeish', 'Andy Roxburgh'], ok: 'A', hints: ['Brief prior tenure', 'After Euro 2000 exit', 'SFA hire 2002', 'Handover'] },
    { q: 'Germany under Vogts reached the World Cup quarter-finals in which year?', opts: ['1994', '1998', '2002', '1990'], ok: 'A', hints: ['USA hosted', 'Lost to Bulgaria', 'Quarter-final', 'NT manager'] },
  ],
  'mcleish-sco': [
    { q: 'Alex McLeish won many trophies as a player with which club?', opts: ['Aberdeen', 'Celtic', 'Rangers', 'Dundee United'], ok: 'A', hints: ['Sir Alex Ferguson era', 'European Cup Winners’ Cup', 'Defender', 'Dons'] },
    { q: 'McLeish managed Scotland during which World Cup qualifying cycle?', opts: ['2010 South Africa', '2006 Germany', '2014 Brazil', '2018 Russia'], ok: 'A', hints: ['Failed to reach finals', 'Brief second spell', 'Play-off pain', 'Late 2000s'] },
    { q: 'McLeish also had a high-profile spell managing which English club?', opts: ['Birmingham City', 'Arsenal', 'Liverpool', 'Chelsea'], ok: 'A', hints: ['League Cup win 2011', 'St Andrew’s', 'Midlands', 'Blues'] },
    { q: 'McLeish’s Scotland beat which team 1-0 in a famous 2007 victory?', opts: ['France', 'Italy', 'Spain', 'Germany'], ok: 'A', hints: ['Paris', 'James McFadden goal', 'Shock win', 'Qualifier'] },
    { q: 'McLeish’s first spell as Scotland manager began in which year?', opts: ['2007', '2000', '2012', '2015'], ok: 'A', hints: ['After Vogts', 'SFA appointment', 'Late 2000s', 'First tenure'] },
    { q: 'As a centre-back, McLeish earned over how many Scotland caps?', opts: ['50', '20', '100', '30'], ok: 'A', hints: ['High appearance count', '1980s mainstay', 'Defensive leader', 'National team'] },
    { q: 'McLeish managed Rangers during their run in which competition?', opts: ['Scottish Premier League era', 'Conference North', 'MLS', 'A-League'], ok: 'A', hints: ['Glasgow giants', 'Titles', 'Ibrox', 'Club job'] },
    { q: 'Scotland’s traditional derby rivals for McLeish as player were Rangers and who?', opts: ['Celtic', 'Hearts', 'Hibs', 'Dundee'], ok: 'A', hints: ['Old Firm', 'Glasgow', 'Green side', 'Rivalry'] },
    { q: 'McLeish’s Scotland failed in a play-off against which country for 2008 Euro?', opts: ['Italy', 'Ukraine', 'Turkey', 'Russia'], ok: 'A', hints: ['Actually Euro 2008 qualifiers - check: Scotland lost to Italy in final group? Simplify: Which team pipped Scotland for Euro 2008?', 'Italy qualified ahead', 'Group stage', 'UEFA'] },
    { q: 'Which goalkeeper often featured for McLeish’s Scotland?', opts: ['Craig Gordon', 'David Marshall', 'Allan McGregor', 'Any could start'], ok: 'D', hints: ['Rotation era', 'Multiple caps', 'Goalkeeping depth', '2000s'] },
  ],
  'strachan-sco': [
    { q: 'Gordon Strachan was a famous midfielder for which English title-winning club?', opts: ['Leeds United', 'Liverpool', 'Tottenham', 'Arsenal'], ok: 'A', hints: ['Howard Wilkinson era', '1992', 'Scotland international', 'Playing days'] },
    { q: 'Strachan managed Scotland during qualifying for which World Cup?', opts: ['2018 Russia', '2022 Qatar', '2014 Brazil', '2010 South Africa'], ok: 'A', hints: ['Heartbreak vs Slovenia', 'Near miss', 'Leigh Griffiths free-kicks', 'Group stage push'] },
    { q: 'Scotland drew 2-2 with England at Hampden in 2018 qualifying — who scored both Scotland free kicks?', opts: ['Leigh Griffiths', 'James McArthur', 'Chris Martin', 'Stuart Armstrong'], ok: 'A', hints: ['Celtic striker', 'Late drama', 'June 2017', 'Memorable'] },
    { q: 'Strachan had Premier League success managing which club?', opts: ['Southampton', 'Newcastle', 'West Ham', 'Fulham'], ok: 'A', hints: ['South coast', '2000s', 'FA Cup final', 'Saints'] },
    { q: 'Strachan’s Scotland were eliminated partly by losing away to which side late in 2018 qualifying?', opts: ['Slovakia', 'England', 'Slovenia', 'Lithuania'], ok: 'C', hints: ['Ljubljana', 'Must-win', 'Missed Russia', '2017'] },
    { q: 'Strachan is known for his witty interviews and which trait?', opts: ['Humour', 'Silence', 'Aggression toward media', 'Only speaking Gaelic'], ok: 'A', hints: ['Fan favourite clips', 'Honest', 'BBC interviews', 'Personality'] },
    { q: 'Which Coventry City era did Strachan manage in the Premier League?', opts: ['1990s–2000s', '2010s', '1980s', 'Never'], ok: 'A', hints: ['Midlands club', 'Player then manager', 'Sky Blues', 'Career'] },
    { q: 'Strachan replaced whom as Scotland manager in 2013?', opts: ['Craig Levein', 'Walter Smith', 'Berti Vogts', 'Alex McLeish'], ok: 'A', hints: ['Previous boss', 'SFA change', '2013 appointment', 'Dundee United legend'] },
    { q: 'Scotland’s kit in the Strachan era was predominantly what colours?', opts: ['Navy blue', 'All white', 'Green', 'Orange'], ok: 'A', hints: ['Traditional Scotland', 'Saltire echoes', 'Home shirt', 'SFA'] },
    { q: 'Strachan played in multiple World Cups as a player — how many?', opts: ['2', '1', '3', '0'], ok: 'A', hints: ['1982 and 1986', 'Midfielder', 'Scotland appearances', 'Playing career'] },
  ],
};

const MANAGER_BLOCKS = { ...BASE, ...EXTRA_BLOCKS_A, ...EXTRA_BLOCKS_B, ...EXTRA_BLOCKS_C };

MANAGER_BLOCKS['mcleish-sco'][8] = {
  q: 'Scotland under McLeish faced Italy in qualifying for which major tournament?',
  opts: ['Euro 2008', 'World Cup 2010', 'Euro 2012', 'World Cup 2014'],
  ok: 'A',
  hints: ['Group B', 'Italy won group', 'Scotland third', 'UEFA qualifying'],
};

let lines = [];
lines.push(`import { Question } from '@/types/game';`);
lines.push('');
lines.push('/** Auto-generated — edit scripts/generate-managers-extended-rest.mjs */');
lines.push('export const managersQuestionsExtendedRest: Question[] = [');

for (const [prefix, rows] of Object.entries(MANAGER_BLOCKS)) {
  rows.forEach((r, idx) => {
    lines.push(row(prefix, idx + 1, r.q, r.opts, r.ok, r.hints));
  });
}

lines.push('];');
lines.push('');

fs.writeFileSync(OUT, lines.join('\n'));
console.log('Wrote', OUT, 'managers:', Object.keys(MANAGER_BLOCKS).length, 'questions:', Object.values(MANAGER_BLOCKS).reduce((a, b) => a + b.length, 0));
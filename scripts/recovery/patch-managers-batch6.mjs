import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'src/data/managersQuestions.ts');
let src = fs.readFileSync(file, 'utf8');

const marker = '  // Valeriy Nepomnyashchy - Cameroon 1990 World Cup Campaign';
if (!src.includes(marker)) throw new Error('Marker not found');
if (src.includes('sampaoli-chi-1')) {
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
    comment: 'Jorge Sampaoli - Chile 2014 World Cup Campaign',
    prefix: 'sampaoli-chi',
    items: [
      ['Jorge Sampaoli continued the high-pressing, aggressive tactical legacy of Marcelo Bielsa with Chile. What nationality is Sampaoli?', ['Chilean', 'Argentine', 'Uruguayan', 'Brazilian'], 'B', ['Sampaoli nationality', 'Bielsa legacy', 'Argentine']],
      ['Sampaoli deployed an incredibly fluid, suffocating high-press system out of what unorthodox base formation?', ['4-4-2 diamond', '3-4-1-2 (or 3-5-2)', '4-2-4', '5-4-1'], 'B', ['High-press system', 'Unorthodox base shape', '3-4-1-2 or 3-5-2']],
      ['Sampaoli famously converted which incredibly tenacious, bulldog-like defensive midfielder into a ball-playing centre-back to anchor his back three?', ['Arturo Vidal', 'Charles Aránguiz', 'Gary Medel', 'Mauricio Isla'], 'C', ['Converted to centre-back', 'Back three anchor', 'Gary Medel']],
      ['Sampaoli\'s intense physical system was built around which dynamic box-to-box midfielder, who famously played the tournament just weeks after undergoing knee surgery?', ['Alexis Sánchez', 'Arturo Vidal', 'Jorge Valdivia', 'Jean Beausejour'], 'B', ['Post-knee surgery', 'Box-to-box engine', 'Arturo Vidal']],
      ['In the group stage, Sampaoli\'s aggressive pressing tactics shocked the world by eliminating the reigning champions with a 2-0 win. Who did they beat?', ['Italy', 'Germany', 'Spain', 'France'], 'C', ['Group stage shock', '2-0 elimination', 'Spain']],
      ['To dictate the tempo in midfield, Sampaoli heavily relied on the precise passing and tactical intelligence of which player?', ['Charles Aránguiz', 'Eugenio Mena', 'Felipe Gutiérrez', 'Francisco Silva'], 'A', ['Midfield tempo', 'Precise passing', 'Charles Aránguiz']],
      ['Sampaoli\'s thrilling run took them to the Round of 16 against host nation Brazil. The match ended 1-1 after 120 minutes, but what heartbreaking event happened in the 119th minute?', ['A Chilean goal was wrongly ruled offside', 'Mauricio Pinilla smashed a shot off the Brazilian crossbar', 'Claudio Bravo saved a penalty but injured himself', 'Arturo Vidal was sent off'], 'B', ['119th-minute heartbreak', 'Round of 16 vs Brazil', 'Pinilla hit the crossbar']],
      ['Following the 1-1 draw, Sampaoli\'s team was eliminated by Brazil in a penalty shootout. Who missed the final, decisive penalty for Chile?', ['Alexis Sánchez', 'Arturo Vidal', 'Gonzalo Jara', 'Charles Aránguiz'], 'A', ['Penalty shootout exit', 'Decisive miss', 'Alexis Sánchez']],
      ["What was Sampaoli's affectionate, tactical nickname, reflecting his devotion to his predecessor's philosophy?", ['El Profesor', 'The Pressing Machine', 'Don Sampa (or Little Bielsa)', 'The General'], 'C', ['Tactical nickname', 'Bielsa devotion', 'Don Sampa or Little Bielsa']],
      ['Following this incredible 2014 World Cup run, Sampaoli cemented his legendary status in Chile by achieving what a year later?', ['Qualifying for the Confederations Cup', "Winning the 2015 Copa América (Chile's first-ever major trophy)", 'Going undefeated for two calendar years', 'Managing the Chilean Olympic team to a Gold Medal'], 'B', ['2015 achievement', 'First major trophy', 'Copa América']],
    ],
  },
  {
    comment: 'Francisco Maturana - Colombia 1990 World Cup Campaign',
    prefix: 'maturana-col',
    items: [
      ['Francisco Maturana introduced the world to a revolutionary, slow-paced, short-passing Colombian style that was a precursor to modern Tiki-Taka. What was it called?', ['La Nuestra', 'Toque-Toque', 'El Carrusel', 'The Coffee Flow'], 'C', ['Colombian playing style', 'Precursor to Tiki-Taka', 'El Carrusel']],
      ['Maturana\'s entire system revolved around the brilliant passing of his iconic, massive-haired Number 10. Who was he?', ['Freddy Rincón', 'Faustino Asprilla', 'Carlos Valderrama', 'Leonel Álvarez'], 'C', ['Iconic Number 10', 'Massive-haired playmaker', 'Carlos Valderrama']],
      ['Maturana\'s defensive tactics were completely unique because he played with an incredibly high line, allowing his goalkeeper to act as a pure "sweeper-keeper." Who was this eccentric keeper?', ['Faryd Mondragón', 'Oscar Córdoba', 'René Higuita', 'Miguel Calero'], 'C', ['Sweeper-keeper', 'High defensive line', 'René Higuita']],
      ['In their final group match, Maturana\'s team needed a result against eventual champions West Germany. Who scored the famous 93rd-minute equalizer to send Colombia through?', ['Carlos Valderrama', 'Adolfo Valencia', 'Freddy Rincón', 'Bernardo Redín'], 'C', ['93rd-minute equalizer', 'Group stage vs West Germany', 'Freddy Rincón']],
      ['Maturana required an absolute warrior in defensive midfield to protect his defense while the goalkeeper swept up. Who played this enforcer role brilliantly?', ['Gabriel Gómez', 'Leonel Álvarez', 'Luis Carlos Perea', 'Gildardo Gómez'], 'B', ['Defensive midfield enforcer', 'Protector role', 'Leonel Álvarez']],
      ['Maturana\'s 1990 run ended in a tragic Round of 16 loss to Cameroon (2-1). What massive tactical disaster caused the winning goal in extra time?', ['A blown offside trap', 'René Higuita tried to dribble Roger Milla near midfield, lost the ball, and Milla scored into an empty net', 'Valderrama scored an own goal', 'The defense entirely stopped playing, thinking they heard a whistle'], 'B', ['R16 vs Cameroon', 'Higuita disaster', 'Milla into empty net']],
      ['While managing the national team in 1990, Maturana was also famously managing which dominant Colombian club team?', ['América de Cali', 'Millonarios', 'Atlético Nacional', 'Deportivo Cali'], 'C', ['Dual management', 'Club and country', 'Atlético Nacional']],
      ['Maturana\'s tactics revolutionized South American football, but his tenure was deeply overshadowed by the influence of what massive off-pitch problem in Colombia at the time?', ['A military coup', 'Narco-terrorism and cartel involvement in football', 'A massive economic depression stopping player payments', 'FIFA sanctions regarding stadium safety'], 'B', ['Off-pitch shadow', '1990s Colombia crisis', 'Narco-terrorism and cartels']],
      ['Under Maturana, Colombia favored a highly organized, flat defensive structure. What was the base formation they utilized?', ['3-5-2', '4-3-3', '4-4-2', '5-4-1'], 'C', ['Flat defensive structure', 'Base formation', '4-4-2']],
      ['Maturana continued to build this incredible squad, famously dismantling Argentina 5-0 in 1993, but his 1994 World Cup campaign ended in the group stage following the tragic murder of which player?', ['Freddy Rincón', 'Andrés Escobar', 'Albeiro Usuriaga', 'Hernán Gaviria'], 'B', ['1994 tragedy', 'Group stage exit', 'Andrés Escobar']],
    ],
  },
  {
    comment: 'Rudolf Vytlačil - Czechoslovakia 1962 World Cup Campaign',
    prefix: 'vytlacil-cze',
    items: [
      ['Rudolf Vytlačil managed Czechoslovakia to the 1962 World Cup final. What was his primary tactical philosophy, which perfectly countered the attacking flair of the era?', ['High-pressing Tiki-Taka', 'A rock-solid, incredibly organized defense combined with intelligent, direct passing', 'Total Football', 'Route One long balls'], 'B', ['1962 philosophy', 'Organized defense', 'Direct passing']],
      ["Vytlačil's system was anchored and completely controlled by his world-class central midfielder, who won the 1962 Ballon d'Or. Who was he?", ['Svatopluk Pluskal', 'Ján Popluhár', 'Josef Masopust', 'Andrej Kvašňák'], 'C', ['1962 Ballon d\'Or', 'Midfield anchor', 'Josef Masopust']],
      ['In the group stage, Vytlačil\'s team played out a 0-0 draw against Brazil. During this match, Masopust showed incredible sportsmanship by doing what?', ['Giving a penalty back to the referee', 'Refusing to tackle an injured Pelé, allowing him to pass the ball', 'Stopping a counter-attack because the Brazilian keeper was hurt', 'Admitting to a handball on the goal line'], 'B', ['Sportsmanship vs Brazil', 'Injured Pelé', 'Refused to tackle']],
      ['Vytlačil utilized a highly physical, dominant centre-back pairing to shut down opposition attacks. Who anchored this defense?', ['Jiří Tichý', 'Ján Popluhár', 'Svatopluk Pluskal', 'Tomáš Pospíchal'], 'B', ['Centre-back anchor', 'Physical defense', 'Ján Popluhár']],
      ['In the quarter-finals, Vytlačil tactically masterminded a 1-0 victory over which heavily favored Eastern European rival?', ['Soviet Union', 'Hungary', 'Yugoslavia', 'Bulgaria'], 'B', ['Quarter-final 1-0', 'Eastern European rival', 'Hungary']],
      ['Vytlačil\'s team reached the final by defeating Yugoslavia 3-1 in the semi-finals. Who was his brilliant goalkeeper, who won the Golden Glove as the tournament\'s best keeper?', ['Ivo Viktor', 'Viliam Schrojf', 'Pavel Kouba', 'František Plánička'], 'B', ['Golden Glove winner', 'Semi-final hero', 'Viliam Schrojf']],
      ['In the 1962 final against Brazil, Vytlačil\'s tactics paid off immediately when Czechoslovakia took a 1-0 lead in the 15th minute. Who scored the goal?', ['Adolf Scherer', 'Josef Kadraba', 'Josef Masopust', 'Tomáš Pospíchal'], 'C', ['15th-minute lead', 'Final vs Brazil', 'Josef Masopust']],
      ['Despite their brilliant organization, Vytlačil\'s team ultimately lost the final 3-1. Which Brazilian player stepped up in Pelé\'s absence to destroy the Czech defense?', ['Vavá', 'Amarildo', 'Zagallo', 'Zito'], 'B', ['Final collapse', 'Pelé absent', 'Amarildo']],
      ['Vytlačil utilized a classic formation that was perfectly balanced for defensive solidity and wide attacks. What was it?', ['3-5-2', '4-2-4', '3-2-2-3 (W-M)', '5-3-2'], 'C', ['Classic formation', 'Defensive solidity', '3-2-2-3 W-M']],
      ['Two years after his legendary 1962 World Cup run, Vytlačil proved his tactical genius again by leading the Czechoslovakian Olympic team to what medal in 1964?', ['Gold', 'Silver', 'Bronze', 'Fourth Place'], 'C', ['1964 Olympics', 'Post-World Cup success', 'Bronze medal']],
    ],
  },
  {
    comment: 'Ernst Happel - Netherlands 1978 World Cup Campaign',
    prefix: 'happel-ned',
    items: [
      ['Following Rinus Michels, Ernst Happel took over the Netherlands in 1978 and led them to a second consecutive World Cup final. What nationality was Happel?', ['Dutch', 'German', 'Austrian', 'Swiss'], 'C', ['Happel nationality', '1978 Dutch boss', 'Austrian']],
      ['Happel had to completely rebuild the Dutch attack for the 1978 tournament because which legendary player controversially refused to travel to Argentina?', ['Johan Neeskens', 'Johnny Rep', 'Johan Cruyff', 'Ruud Krol'], 'C', ['Missing star', 'Refused to travel', 'Johan Cruyff']],
      ['Happel slightly tweaked the "Total Football" system, making it more pragmatic. Instead of pure man-marking or pure zonal marking, what did he use?', ['A strict 5-man low block', 'A hybrid system (zonal marking with a sweeping libero)', 'Only man-marking across the entire pitch', 'High pressing with no defenders'], 'B', ['Pragmatic tweak', 'Hybrid marking', 'Zonal with sweeping libero']],
      ['To replace the goals of Cruyff, Happel relied on the brilliant dribbling and finishing of which left-winger, who scored 5 goals in the tournament?', ['Johnny Rep', 'Rob Rensenbrink', 'René van de Kerkhof', 'Dick Nanninga'], 'B', ['Five tournament goals', 'Cruyff replacement', 'Rob Rensenbrink']],
      ['Happel\'s midfield engine room was powered by two identical twin brothers who played with incredible energy. Who were they?', ['The De Boer brothers', 'The Van de Kerkhof brothers (Willy and René)', 'The Koeman brothers', 'The Muhren brothers'], 'B', ['Twin midfielders', 'Incredible energy', 'Van de Kerkhof brothers']],
      ['In the second group stage, Happel\'s team secured their spot in the final with a brilliant 2-1 comeback victory over which European giant?', ['West Germany', 'Austria', 'Italy', 'Spain'], 'C', ['Second group stage', '2-1 comeback', 'Italy']],
      ['Happel is famously known for his incredibly quiet, stoic demeanor. He despised speaking to the press and was known by what nickname?', ['The Professor', 'The Silent One (Der Schweiger)', 'The General', 'The Architect'], 'B', ['Quiet demeanor', 'Press-shy coach', 'Der Schweiger']],
      ['In the 1978 final against Argentina, Happel\'s team suffered ultimate heartbreak in the 90th minute when the score was tied 1-1. What happened?', ['A Dutch goal was ruled offside', 'Rob Rensenbrink hit the post from close range', 'The referee gave Argentina a highly controversial penalty', 'Johan Neeskens was sent off'], 'B', ['90th-minute heartbreak', 'Final vs Argentina', 'Rensenbrink hit the post']],
      ['Happel\'s exhausted team eventually collapsed in extra time, losing the 1978 final by what score?', ['2-1', '3-1', '4-1', '4-2'], 'B', ['Extra-time collapse', 'Final score', '3-1 defeat']],
      ['Before taking the Dutch national team job, Happel had already cemented his legacy as a tactical genius by winning the European Cup (Champions League) with which Dutch club?', ['Ajax', 'PSV Eindhoven', 'Feyenoord', 'AZ Alkmaar'], 'C', ['European Cup winner', 'Club legacy', 'Feyenoord']],
    ],
  },
  {
    comment: 'Myung Rye-hyun - North Korea 1966 World Cup Campaign',
    prefix: 'myung-nkp',
    items: [
      ['Myung Rye-hyun managed North Korea to one of the greatest underdog runs in sports history. What massive milestone did his team achieve in 1966?', ['First team to win a World Cup match without a professional player', 'First Asian team to ever reach the quarter-finals of a World Cup', 'First team to score a goal against Brazil in a group stage', 'First team to advance without scoring a single goal'], 'B', ['1966 milestone', 'Underdog run', 'First Asian QF']],
      ['Because of international political tensions during the Cold War, North Korea was almost banned from the UK. What compromise was made regarding their national anthem?', ['It was played using only drums', 'It was banned and not played before any matches (until the quarter-final)', 'A generic FIFA anthem was played instead', 'The players sang it without music'], 'B', ['Cold War tensions', 'Anthem compromise', 'Banned until quarter-final']],
      ['Myung Rye-hyun\'s tactical system was heavily based on overcoming their lack of physical height. What was his primary focus?', ['Taking incredibly long-range shots', 'Parking the bus and playing for 0-0 draws', 'Insane physical stamina, relentless running, and rapid short passing', 'Constantly drawing fouls for set pieces'], 'C', ['Overcoming height disadvantage', 'Tactical focus', 'Stamina and short passing']],
      ['Myung\'s team became adopted hometown heroes in which English industrial city, where the locals passionately supported them during the group stages?', ['Liverpool', 'Manchester', 'Middlesbrough', 'Newcastle'], 'C', ['English host city', 'Local heroes', 'Middlesbrough']],
      ['In their final group match, Myung masterminded arguably the biggest upset in World Cup history by defeating which two-time champions 1-0?', ['West Germany', 'Italy', 'Argentina', 'Uruguay'], 'B', ['Biggest upset', '1-0 victory', 'Italy']],
      ['Who was the North Korean player that scored the legendary winning goal to seal that massive upset?', ['Li Dong-woon', 'Pak Doo-ik', 'Seung Zin', 'Yang Seung-kook'], 'B', ['Winning goal scorer', 'Italy upset', 'Pak Doo-ik']],
      ['Because of their incredible speed and the mythical winged horse representing their nation, what was the nickname of Myung\'s 1966 team?', ['The Red Dragons', 'The Chollima', 'The Asian Tigers', 'The Silent Storm'], 'B', ['Team nickname', 'Winged horse symbol', 'The Chollima']],
      ['In the quarter-finals, Myung\'s team shocked the world again by taking an unbelievable lead against Portugal. What was the score after 25 minutes?', ['1-0', '2-0', '3-0', '2-1'], 'C', ['Quarter-final start', '25-minute lead', '3-0']],
      ['Myung\'s tactical naivety finally showed when he ordered his team to keep attacking instead of defending the lead. Which player destroyed them by scoring 4 goals in a 5-3 comeback?', ['Mário Coluna', 'José Torres', 'Eusébio', 'António Simões'], 'C', ['5-3 comeback', 'Four goals', 'Eusébio']],
      ['Following the tournament, the fate of Myung Rye-hyun and his players became the subject of intense global rumors. What was the widespread (but later debunked) myth about them?', ['They were executed by the state', 'They were sent to forced labor camps (gulags) for losing a 3-0 lead', 'They all defected to South Korea', 'They were banned from ever playing football again'], 'B', ['Post-tournament myth', 'Debunked rumor', 'Gulag labor camps']],
    ],
  },
  {
    comment: 'Didi - Peru 1970 World Cup Campaign',
    prefix: 'didi-per',
    items: [
      ['The legendary 1970 Peruvian national team was managed by Didi, who had won the World Cup twice as a player for which nation?', ['Argentina', 'Uruguay', 'Brazil', 'Italy'], 'C', ['Didi playing career', 'Two-time World Cup winner', 'Brazil']],
      ['Didi implemented a beautiful, free-flowing, attacking style of play that relied heavily on technical skill. This Peruvian golden era team was famous for what specific kit feature?', ['All-black uniforms', 'Checkered shirts', 'A distinctive red diagonal sash across a white shirt', 'Shirts with no numbers'], 'C', ['Golden era kit', 'Distinctive feature', 'Red diagonal sash']],
      ['Just two days before their opening match of the 1970 World Cup, what horrific tragedy struck Peru, giving the team massive emotional motivation?', ['Their captain was killed in a car crash', 'The Ancash earthquake, which killed nearly 70,000 people back home', 'A stadium collapse in Lima', "The team's flight was nearly hijacked"], 'B', ['Pre-tournament tragedy', 'Emotional motivation', 'Ancash earthquake']],
      ['Didi built his entire tactical attack around a brilliant 21-year-old playmaker who scored 5 goals in the tournament and won the Best Young Player award. Who was he?', ['Hugo Sotil', 'Teófilo Cubillas', 'Roberto Challe', 'Alberto Gallardo'], 'B', ['Best Young Player', 'Five goals', 'Teófilo Cubillas']],
      ['In their opening match against Bulgaria, Didi\'s team showed incredible resilience. They went down 2-0 early on, but what was the final result?', ['2-2 draw', 'Peru won 3-2', 'Bulgaria won 4-2', 'Peru won 4-3 in extra time'], 'B', ['Opening match comeback', 'Down 2-0 early', 'Won 3-2']],
      ['Didi anchored his beautiful attacking side with a legendary, commanding centre-back known as the "Captain of the Americas." Who was he?', ['Orlando de la Torre', 'Julio Meléndez', 'Héctor Chumpitaz', 'Nicolás Fuentes'], 'C', ['Captain of the Americas', 'Centre-back legend', 'Héctor Chumpitaz']],
      ['To control the midfield tempo, Didi utilized a brilliant, highly intelligent central midfielder nicknamed "El Niño Terrible." Who was he?', ['Ramón Mifflin', 'Roberto Challe', 'Pedro León', 'Luis Cruzado'], 'D', ['El Niño Terrible', 'Midfield tempo', 'Luis Cruzado']],
      ['In the quarter-finals, Didi faced a massive personal and tactical dilemma because his Peruvian team was drawn against who?', ['Argentina', 'Uruguay', 'Brazil (His home country and former team)', 'West Germany'], 'C', ['Quarter-final dilemma', 'Former nation', 'Brazil']],
      ['That quarter-final is widely considered one of the most beautiful, attacking matches in World Cup history. What was the final score?', ['Brazil won 4-2', 'Peru won 3-2', 'Brazil won 3-1', 'Peru won 4-3'], 'A', ['Classic quarter-final', 'Attacking spectacle', 'Brazil won 4-2']],
      ["Because of Didi's commitment to pure, attacking football with minimal cynical fouling, what specific award did his 1970 Peruvian team win at the end of the tournament?", ['The Most Entertaining Team Award', 'The FIFA Fair Play Trophy', 'The Golden Team Award', 'The Spirit of Football Award'], 'B', ['Post-tournament award', 'Fair play commitment', 'FIFA Fair Play Trophy']],
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
console.log('Patched 60 manager questions');

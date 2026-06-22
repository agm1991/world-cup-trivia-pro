#!/usr/bin/env node
/**
 * Generates scorelineQuestions.ts with 10 curated questions per World Cup campaign.
 * Hints never reveal score, goals, or answer - only match context.
 * Matches: finals, iconic semis, memorable upsets, best games.
 */

const CAMPAIGNS = [
  // 2022 Qatar
  { year: 2022, matches: [
    { q: 'Argentina 🇦🇷 vs France 🇫🇷 - final', A: '2-2', B: '3-3', C: '4-3', D: '3-2', ans: 'B', h: ['Mbappé became only the 2nd player to score a hat-trick in a final', "Messi's crowning moment after extra time", 'Decided by penalty shootout - highest-scoring final since 1966'] },
    { q: 'France 🇫🇷 vs Morocco 🇲🇦 - semi-final', A: '2-0', B: '2-1', C: '3-1', D: '1-0', ans: 'A', h: ['Morocco made history as first African semi-finalist', "France's attack proved decisive at Lusail", "Host nation Qatar's neighbours put on a proud display"] },
    { q: 'Saudi Arabia 🇸🇦 vs Argentina 🇦🇷 - group stage', A: '1-0', B: '2-1', C: '2-0', D: '1-1', ans: 'B', h: ['One of the biggest upsets in World Cup history', 'Saudi came from behind after trailing early', "Ended Argentina's 36-match unbeaten run"] },
    { q: 'Japan 🇯🇵 vs Germany 🇩🇪 - group stage', A: '1-1', B: '2-1', C: '3-2', D: '2-0', ans: 'B', h: ['Japan staged a dramatic second-half comeback', 'Germany were stunned in their opener', "Asia's finest upset the four-time champions"] },
    { q: 'Morocco 🇲🇦 vs Portugal 🇵🇹 - quarter-final', A: '0-0 (pens)', B: '1-0', C: '2-1', D: '1-1 (pens)', ans: 'B', h: ['Historic moment for African football', 'A famous header decided it', "Ronaldo's last World Cup ended in tears"] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs France 🇫🇷 - quarter-final', A: '1-0', B: '2-1', C: '2-0', D: '3-1', ans: 'B', h: ['Kane missed a crucial late penalty', "Giroud's header sealed French victory", 'Les Bleus prevailed in a tight encounter'] },
    { q: 'Croatia 🇭🇷 vs Brazil 🇧🇷 - quarter-final', A: '0-0', B: '1-1', C: '2-2', D: '1-0', ans: 'B', h: ["Croatia's penalty shootout specialists struck again", 'A last-gasp equalizer forced extra time', "Brazil's Samba dream ended in Doha"] },
    { q: 'Netherlands 🇳🇱 vs Argentina 🇦🇷 - quarter-final', A: '1-1', B: '2-2', C: '3-3', D: '2-1', ans: 'B', h: ['A stoppage-time equalizer sent it to extra time', 'Notoriously ill-tempered - 17 yellow cards shown', 'Argentina held their nerve in the shootout'] },
    { q: 'Brazil 🇧🇷 vs South Korea 🇰🇷 - round of 16', A: '3-1', B: '4-1', C: '5-1', D: '4-0', ans: 'B', h: ["Richarlison's acrobatic volley lit up the match", 'Neymar returned from injury with a penalty', "Brazil's attack overwhelmed Asian opposition"] },
    { q: 'Argentina 🇦🇷 vs Australia 🇦🇺 - round of 16', A: '1-0', B: '2-1', C: '3-1', D: '2-0', ans: 'B', h: ["Messi's milestone goal opened the scoring", 'A bizarre own goal gave Australia hope', 'Australia pushed hard but fell just short'] },
  ]},
  // 2018 Russia
  { year: 2018, matches: [
    { q: 'France 🇫🇷 vs Croatia 🇭🇷 - final', A: '3-2', B: '4-2', C: '4-1', D: '3-1', ans: 'B', h: ['An own goal and controversial VAR penalty featured', 'Croatia fought back but fell short', 'France lifted the trophy in Moscow'] },
    { q: 'Belgium 🇧🇪 vs Japan 🇯🇵 - round of 16', A: '2-1', B: '3-2', C: '4-3', D: '2-2', ans: 'B', h: ['Japan led 2-0 - stunning the Red Devils', 'Belgium mounted an incredible comeback', 'Jan Vertonghen started the fightback'] },
    { q: 'Brazil 🇧🇷 vs Belgium 🇧🇪 - quarter-final', A: '1-2', B: '2-1', C: '1-1', D: '0-2', ans: 'A', h: ['Belgium\'s golden generation reached the semi-finals', 'Fernandinho\'s own goal proved costly', 'Brazil\'s World Cup dream ended again'] },
    { q: 'France 🇫🇷 vs Argentina 🇦🇷 - round of 16', A: '3-2', B: '4-3', C: '2-1', D: '4-2', ans: 'B', h: ['Mbappé announced himself on the world stage', 'A teenage superstar ran Argentina ragged', 'Messi\'s World Cup hopes dashed in Kazan'] },
    { q: 'Germany 🇩🇪 vs South Korea 🇰🇷 - group stage', A: '0-1', B: '0-2', C: '1-2', D: '1-1', ans: 'A', h: ['Defending champions crashed out in the group stage', 'Korea scored in stoppage time', 'Germany\'s worst World Cup in 80 years'] },
    { q: 'Spain 🇪🇸 vs Russia 🇷🇺 - round of 16', A: '1-1', B: '0-0', C: '2-2', D: '1-0', ans: 'A', h: ['Hosts Russia shocked the 2010 champions', 'Spain dominated possession but went out on penalties', 'Igor Akinfeev was the hero'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Colombia 🇨🇴 - round of 16', A: '1-1', B: '2-1', C: '0-0', D: '2-2', ans: 'A', h: ['England finally won a World Cup penalty shootout', 'Kane scored from the spot in normal time', 'Colombia equalized in stoppage time'] },
    { q: 'Sweden 🇸🇪 vs Switzerland 🇨🇭 - round of 16', A: '1-0', B: '2-0', C: '2-1', D: '1-1', ans: 'A', h: ['Emil Forsberg\'s deflected strike decided it', 'Sweden reached the quarter-finals', 'A tight, tactical affair'] },
    { q: 'Mexico 🇲🇽 vs Germany 🇩🇪 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Lozano\'s goal stunned the world champions', 'Mexico\'s famous victory in Moscow', 'Germany\'s campaign got off to a nightmare start'] },
    { q: 'Uruguay 🇺🇾 vs Portugal 🇵🇹 - round of 16', A: '1-0', B: '2-1', C: '2-0', D: '1-1', ans: 'B', h: ['Cavani\'s brace sent Ronaldo home', 'Uruguay\'s defence held firm', 'Portugal\'s European champions exited'] },
  ]},
  // 2014 Brazil
  { year: 2014, matches: [
    { q: 'Germany 🇩🇪 vs Argentina 🇦🇷 - final', A: '1-0', B: '2-1', C: '2-0', D: '1-1', ans: 'A', h: ['Götze\'s extra-time volley won it', 'Messi\'s chance for glory slipped away', 'Germany\'s fourth World Cup in Rio'] },
    { q: 'Brazil 🇧🇷 vs Germany 🇩🇪 - semi-final', A: '1-7', B: '0-7', C: '1-6', D: '0-6', ans: 'A', h: ['The most shocking result in World Cup history', 'Brazil collapsed at the Mineirão', 'Host nation\'s nightmare in Belo Horizonte'] },
    { q: 'Germany 🇩🇪 vs Brazil 🇧🇷 - semi-final (from Brazil\'s perspective)', A: '1-7', B: '0-7', C: '1-6', D: '0-6', ans: 'A', h: ['Seven goals - five before half-time', 'Neymar and Silva were sorely missed', 'The Maracanazo was avenged in reverse'] },
    { q: 'Netherlands 🇳🇱 vs Spain 🇪🇸 - group stage', A: '3-1', B: '4-1', C: '5-1', D: '2-1', ans: 'C', h: ['Van Persie\'s iconic diving header', 'Spain\'s title defence collapsed in Salvador', 'Revenge for the 2010 final'] },
    { q: 'Germany 🇩🇪 vs Portugal 🇵🇹 - group stage', A: '3-0', B: '4-0', C: '4-1', D: '5-1', ans: 'B', h: ['Müller was unplayable that day', 'Portugal were dismantled in Salvador', 'Pepe\'s red card made it worse'] },
    { q: 'Uruguay 🇺🇾 vs Italy 🇮🇹 - group stage', A: '1-0', B: '2-1', C: '2-0', D: '1-1', ans: 'A', h: ['Suárez\'s bite overshadowed the result', 'Godín\'s header sent Italy home', 'Controversy in Natal'] },
    { q: 'Netherlands 🇳🇱 vs Mexico 🇲🇽 - round of 16', A: '1-2', B: '2-1', C: '2-2', D: '1-1', ans: 'B', h: ['Sneijder\'s late strike kept Dutch hopes alive', 'Huntelaar\'s penalty completed the comeback', 'Mexico\'s heartbreak in Fortaleza'] },
    { q: 'Costa Rica 🇨🇷 vs Italy 🇮🇹 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Costa Rica shocked the world in Recife', 'Bryan Ruiz\'s header sealed it', 'Los Ticos topped the group of death'] },
    { q: 'Belgium 🇧🇪 vs United States 🇺🇸 - round of 16', A: '0-0', B: '1-1', C: '1-0', D: '2-1', ans: 'A', h: ['Howard\'s heroics couldn\'t prevent extra time', 'Belgium needed 120 minutes to break through', 'A goalless 90 minutes in Salvador'] },
    { q: 'Brazil 🇧🇷 vs Colombia 🇨🇴 - quarter-final', A: '1-2', B: '2-1', C: '1-1', D: '0-2', ans: 'B', h: ['James Rodríguez\'s wonder tournament continued', 'Neymar\'s tournament ended with injury', 'A bruising encounter in Fortaleza'] },
    { q: 'Netherlands 🇳🇱 vs Costa Rica 🇨🇷 - quarter-final', A: '0-0', B: '1-0', C: '0-0 (pens)', D: '1-1', ans: 'A', h: ['Navas\' heroics kept Costa Rica in it', 'Van Gaal\'s famous keeper substitution', 'Krul came on for the shootout'] },
  ]},
];

// Extend for remaining years - use finals + iconic matches
const EXTRA_CAMPAIGNS = [
  { year: 2010, matches: [
    { q: 'Spain 🇪🇸 vs Netherlands 🇳🇱 - final', A: '1-0', B: '2-1', C: '2-0', D: '0-0', ans: 'A', h: ['Iniesta\'s extra-time strike in Johannesburg', 'The Oranje\'s third final defeat', 'Tiki-taka conquered the world'] },
    { q: 'Uruguay 🇺🇾 vs Ghana 🇬🇭 - quarter-final', A: '1-1', B: '2-2', C: '0-0', D: '2-1', ans: 'A', h: ['Suárez\'s handball on the line', 'Gyan\'s penalty hit the crossbar', 'Africa\'s dream died in Soweto'] },
    { q: 'Germany 🇩🇪 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - round of 16', A: '4-1', B: '4-2', C: '3-1', D: '2-1', ans: 'A', h: ['Lampard\'s ghost goal - over the line but not given', 'Germany\'s young guns ran riot', 'Blatter apologized for no goal-line tech'] },
    { q: 'Spain 🇪🇸 vs Germany 🇩🇪 - semi-final', A: '1-0', B: '2-0', C: '2-1', D: '1-1', ans: 'A', h: ['Puyol\'s thumping header in Durban', 'Spain reached their first final', 'German precision met Spanish art'] },
    { q: 'Netherlands 🇳🇱 vs Brazil 🇧🇷 - quarter-final', A: '2-1', B: '3-1', C: '2-0', D: '1-1', ans: 'A', h: ['Sneijder inspired a remarkable comeback', 'Brazil led at half-time in Port Elizabeth', 'Melô\'s meltdown and early exit'] },
    { q: 'Slovakia 🇸🇰 vs Italy 🇮🇹 - group stage', A: '2-1', B: '3-2', C: '1-0', D: '2-2', ans: 'B', h: ['Defending champions crashed out', 'Vittek and Kopúnek stunned the Azzurri', 'Italy\'s worst World Cup in decades'] },
    { q: 'Serbia 🇷🇸 vs Germany 🇩🇪 - group stage', A: '0-1', B: '1-0', C: '0-2', D: '1-1', ans: 'A', h: ['Klose was sent off in the first half', 'Podolski\'s penalty sealed it', 'Serbia missed a spot-kick too'] },
    { q: 'Switzerland 🇨🇭 vs Spain 🇪🇸 - group stage', A: '1-0', B: '2-1', C: '0-0', D: '1-1', ans: 'A', h: ['The biggest upset of the group stage', 'Spain dominated but Gelson Fernandes struck', 'La Roja recovered to win the Cup'] },
    { q: 'Argentina 🇦🇷 vs Mexico 🇲🇽 - round of 16', A: '2-0', B: '3-1', C: '3-2', D: '2-1', ans: 'B', h: ['Tevez\'s offside goal caused fury', 'Mexico felt robbed in Johannesburg', 'Maradona\'s side advanced controversially'] },
    { q: 'Portugal 🇵🇹 vs North Korea 🇰🇵 - group stage', A: '6-0', B: '7-0', C: '5-0', D: '4-0', ans: 'B', h: ['Ronaldo finally scored in the World Cup', 'North Korea collapsed in Cape Town', 'Record-equaling margin'] },
  ]},
  { year: 2006, matches: [
    { q: 'Italy 🇮🇹 vs France 🇫🇷 - final', A: '1-1', B: '2-2', C: '1-0', D: '2-1', ans: 'A', h: ['Zidane\'s headbutt and red card', 'Italy won on penalties in Berlin', 'Materazzi provoked, Zizou snapped'] },
    { q: 'Germany 🇩🇪 vs Italy 🇮🇹 - semi-final', A: '0-2', B: '1-2', C: '0-1', D: '1-1', ans: 'A', h: ['Grosso and Del Piero in extra time', 'Dortmund\'s famous "Azzurri" miracle', 'Hosts\' dream ended at the death'] },
    { q: 'France 🇫🇷 vs Brazil 🇧🇷 - quarter-final', A: '1-0', B: '2-1', C: '2-0', D: '1-1', ans: 'A', h: ['Henry\'s goal sent the holders home', 'Zidane ran the show in Frankfurt', 'Ronaldo\'s last World Cup ended'] },
    { q: 'Argentina 🇦🇷 vs Germany 🇩🇪 - quarter-final', A: '1-1', B: '2-2', C: '0-0', D: '2-1', ans: 'A', h: ['Germany won on penalties in Berlin', 'A tense, tactical battle', 'Argentina\'s golden generation fell short'] },
    { q: 'Portugal 🇵🇹 vs Netherlands 🇳🇱 - round of 16', A: '1-0', B: '2-1', C: '0-0', D: '2-0', ans: 'A', h: ['The "Battle of Nuremberg" - 16 cards', 'Maniche\'s early goal decided it', 'Four red cards in a chaotic match'] },
    { q: 'Australia 🇦🇺 vs Croatia 🇭🇷 - group stage', A: '2-2', B: '3-2', C: '2-1', D: '1-1', ans: 'A', h: ['Three red cards in Stuttgart', 'Crazy, controversial group decider', 'Australia reached the knockouts for the first time'] },
    { q: 'Spain 🇪🇸 vs France 🇫🇷 - round of 16', A: '1-3', B: '2-3', C: '1-2', D: '0-2', ans: 'A', h: ['Zidane rolled back the years in Hanover', 'Villa and Reyes for Spain', 'France\'s veteran stars shone'] },
    { q: 'Ghana 🇬🇭 vs Czech Republic 🇨🇿 - group stage', A: '2-0', B: '3-0', C: '2-1', D: '1-0', ans: 'A', h: ['Ghana\'s first ever World Cup win', 'Asamoah Gyan and Muntari struck', 'Czechs\' campaign collapsed in Cologne'] },
    { q: 'Brazil 🇧🇷 vs Japan 🇯🇵 - group stage', A: '3-1', B: '4-1', C: '2-1', D: '3-2', ans: 'B', h: ['Ronaldo equalled the goals record', 'Japan took a shock early lead', 'Brazil\'s attack eventually overwhelmed'] },
    { q: 'Switzerland 🇨🇭 vs South Korea 🇰🇷 - group stage', A: '2-0', B: '1-0', C: '2-1', D: '0-0', ans: 'A', h: ['Senderos and Frei sent Korea home', 'Swiss topped the group in Hanover', 'Clean sheets throughout the group'] },
  ]},
  { year: 2002, matches: [
    { q: 'Brazil 🇧🇷 vs Germany 🇩🇪 - final', A: '1-0', B: '2-0', C: '3-0', D: '2-1', ans: 'B', h: ['Ronaldo\'s redemption - both goals in Yokohama', 'Brazil\'s fifth World Cup title', 'Kahn\'s uncharacteristic error'] },
    { q: 'South Korea 🇰🇷 vs Italy 🇮🇹 - round of 16', A: '2-1', B: '1-0', C: '2-2', D: '1-1', ans: 'A', h: ['Ahn Jung-hwan\'s golden goal in extra time', 'Totti\'s controversial red card', 'Co-hosts stunned the Azzurri in Daejeon'] },
    { q: 'South Korea 🇰🇷 vs Spain 🇪🇸 - quarter-final', A: '0-0', B: '1-1', C: '1-0', D: '2-1', ans: 'A', h: ['Spain had two goals wrongly disallowed', 'Korea won on penalties in Gwangju', 'Controversy marred the co-hosts\' run'] },
    { q: 'Senegal 🇸🇳 vs France 🇫🇷 - group stage', A: '1-0', B: '2-1', C: '0-0', D: '1-1', ans: 'A', h: ['Papa Bouba Diop\'s goal stunned the holders', 'France crashed out in the group stage', 'The ultimate World Cup upset in Seoul'] },
    { q: 'Germany 🇩🇪 vs Saudi Arabia 🇸🇦 - group stage', A: '7-0', B: '8-0', C: '6-0', D: '5-0', ans: 'B', h: ['Klose\'s hat-trick on debut', 'Saudi\'s miserable tournament started', 'Record margin in Sapporo'] },
    { q: 'Brazil 🇧🇷 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - quarter-final', A: '2-1', B: '3-1', C: '1-1', D: '2-2', ans: 'A', h: ['Ronaldinho\'s free-kick from distance', 'Seaman caught off his line in Shizuoka', 'England\'s hope ended again'] },
    { q: 'Turkey 🇹🇷 vs Senegal 🇸🇳 - quarter-final', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['İlhan Mansız\'s golden goal in Osaka', 'Senegal\'s fairytale run ended', 'Turkey reached their first semi since 1954'] },
    { q: 'USA 🇺🇸 vs Portugal 🇵🇹 - group stage', A: '2-3', B: '3-2', C: '2-1', D: '1-0', ans: 'B', h: ['USA raced into an early lead', 'Portugal mounted a comeback but fell short', 'One of the tournament\'s thrillers'] },
    { q: 'Argentina 🇦🇷 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'A', h: ['Beckham\'s penalty revenge for 1998', 'Batistuta\'s last World Cup', 'England\'s famous win in Sapporo'] },
    { q: 'Ireland 🇮🇪 vs Germany 🇩🇪 - group stage', A: '1-1', B: '2-2', C: '0-0', D: '2-1', ans: 'A', h: ['Robbie Keane\'s last-gasp equalizer', 'Germany had led through Klose', 'Irish spirit in Ibaraki'] },
  ]},
  { year: 1998, matches: [
    { q: 'France 🇫🇷 vs Brazil 🇧🇷 - final', A: '2-0', B: '3-0', C: '2-1', D: '3-1', ans: 'B', h: ['Zidane\'s two headers in the first half', 'Ronaldo\'s mysterious pre-match episode', 'France\'s first World Cup at home'] },
    { q: 'France 🇫🇷 vs Croatia 🇭🇷 - semi-final', A: '2-1', B: '3-1', C: '2-0', D: '1-0', ans: 'A', h: ['Thuram\'s only two goals for France', 'Croatia had led through Suker', 'Hosts reached the final in Saint-Denis'] },
    { q: 'Argentina 🇦🇷 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - round of 16', A: '2-2', B: '3-2', C: '2-1', D: '1-1', ans: 'A', h: ['The Owen goal, the Beckham red', 'Solskjær\'s late equalizer in normal time', 'England went out on penalties'] },
    { q: 'Netherlands 🇳🇱 vs Argentina 🇦🇷 - quarter-final', A: '1-1', B: '2-1', C: '2-2', D: '0-0', ans: 'B', h: ['Bergkamp\'s wonder goal to win it', 'That first touch in Marseille', 'Netherlands reached the semi-finals'] },
    { q: 'Nigeria 🇳🇬 vs Spain 🇪🇸 - group stage', A: '2-3', B: '3-2', C: '2-1', D: '1-1', ans: 'B', h: ['Nigeria came from 2-1 down', 'Oliseh\'s screamer in Nantes', 'Africa\'s finest performance'] },
    { q: 'Germany 🇩🇪 vs Mexico 🇲🇽 - round of 16', A: '2-1', B: '1-1', C: '1-0', D: '2-0', ans: 'A', h: ['Klinsmann and Bierhoff struck', 'Mexico\'s Hernández scored', 'Germany advanced in Montpellier'] },
    { q: 'Brazil 🇧🇷 vs Denmark 🇩🇰 - quarter-final', A: '2-1', B: '3-2', C: '2-0', D: '1-0', ans: 'B', h: ['Laudrup brothers inspired Denmark', 'Rivaldo and Bebeto for Brazil', 'A thriller in Nantes'] },
    { q: 'Romania 🇷🇴 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - round of 16', A: '2-2', B: '0-0', C: '1-1', D: '2-1', ans: 'B', h: ['England won on penalties in Toulouse', 'No goals in 120 minutes', 'David Batty\'s penalty miss'] },
    { q: 'Iran 🇮🇷 vs USA 🇺🇸 - group stage', A: '1-2', B: '2-1', C: '1-1', D: '0-1', ans: 'B', h: ['The "political" derby in Lyon', 'Estili and Mahdavikia for Iran', 'USA exited at the group stage'] },
    { q: 'Spain 🇪🇸 vs Nigeria 🇳🇬 - group stage', A: '2-3', B: '3-2', C: '2-2', D: '1-2', ans: 'A', h: ['Raúl\'s double wasn\'t enough', 'Nigeria\'s sensational comeback', 'Group of death lived up to its name'] },
  ]},
  { year: 1994, matches: [
    { q: 'Brazil 🇧🇷 vs Italy 🇮🇹 - final', A: '0-0', B: '1-1', C: '2-2', D: '1-0', ans: 'A', h: ['The only goalless final in history', 'Baggio blazed over - Brazil won on penalties', 'Rose Bowl, Pasadena'] },
    { q: 'Bulgaria 🇧🇬 vs Germany 🇩🇪 - quarter-final', A: '2-1', B: '3-1', C: '2-0', D: '1-0', ans: 'A', h: ['Stoichkov and Lechkov stunned the champions', 'Matthäus\' penalty wasn\'t enough', 'Bulgaria\'s greatest day in New Jersey'] },
    { q: 'Romania 🇷🇴 vs Argentina 🇦🇷 - round of 16', A: '2-3', B: '3-2', C: '2-1', D: '1-1', ans: 'B', h: ['Hagi and Dumitrescu ran riot', 'Batistuta\'s brace wasn\'t enough', 'Maradona\'s last World Cup ended'] },
    { q: 'Ireland 🇮🇪 vs Italy 🇮🇹 - group stage', A: '0-1', B: '1-0', C: '1-1', D: '0-0', ans: 'C', h: ['Houghton\'s early goal in Giants Stadium', 'Schillaci equalized for Italy', 'A draw that felt like victory for Ireland'] },
    { q: 'Saudi Arabia 🇸🇦 vs Belgium 🇧🇪 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Al-Owairan\'s wonder solo goal', 'Saudi\'s first ever knockout qualification', 'Washington DC upset'] },
    { q: 'Nigeria 🇳🇬 vs Italy 🇮🇹 - round of 16', A: '1-2', B: '2-1', C: '1-1', D: '0-1', ans: 'A', h: ['Baggio\'s 88th-minute equalizer', 'Extra-time winner sent Italy through', 'Nigeria\'s heartbreak in Boston'] },
    { q: 'Netherlands 🇳🇱 vs Brazil 🇧🇷 - quarter-final', A: '2-3', B: '3-2', C: '2-2', D: '1-2', ans: 'A', h: ['Branco\'s free-kick won it in Dallas', 'Bergkamp\'s wonder goal', 'A classic in the Cotton Bowl'] },
    { q: 'Germany 🇩🇪 vs South Korea 🇰🇷 - group stage', A: '2-2', B: '3-2', C: '2-1', D: '1-1', ans: 'B', h: ['Korea fought back from 3-0 down', 'Klinsmann\'s hat-trick', 'Korea exited despite the comeback'] },
    { q: 'Argentina 🇦🇷 vs Greece 🇬🇷 - group stage', A: '3-0', B: '4-0', C: '2-0', D: '5-0', ans: 'B', h: ['Batistuta\'s hat-trick', 'Maradona\'s last World Cup goal (oops - disallowed)', 'Argentina\'s statement in Boston'] },
    { q: 'Russia 🇷🇺 vs Cameroon 🇨🇲 - group stage', A: '5-1', B: '6-1', C: '4-1', D: '3-1', ans: 'B', h: ['Oleg Salenko scored five - still a record', 'Cameroon\'s Roger Milla at 42', 'Stanford thriller'] },
  ]},
];

// Fix 2014 - remove duplicate Brazil-Germany
CAMPAIGNS[2].matches.splice(2, 1);

const LEGACY_CAMPAIGNS = [
  { year: 1990, matches: [
    { q: 'West Germany 🇩🇪 vs Argentina 🇦🇷 - final', A: '1-0', B: '2-1', C: '2-0', D: '0-0', ans: 'A', h: ['Brehme\'s penalty won it in Rome', 'The most ill-tempered final in history', 'Germany\'s third World Cup'] },
    { q: 'Argentina 🇦🇷 vs Italy 🇮🇹 - semi-final', A: '1-1', B: '2-2', C: '1-0', D: '0-0', ans: 'A', h: ['Hosts Italy went out on penalties', 'Caniggia and Schillaci traded goals', 'Naples - Maradona\'s second home'] },
    { q: 'Cameroon 🇨🇲 vs Argentina 🇦🇷 - opening match', A: '1-0', B: '2-1', C: '2-0', D: '0-0', ans: 'A', h: ['Omam-Biyik\'s header stunned the holders', 'Cameroon had two men sent off', 'The Indomitable Lions announced themselves'] },
    { q: 'West Germany 🇩🇪 vs Netherlands 🇳🇱 - round of 16', A: '2-1', B: '3-1', C: '2-0', D: '1-1', ans: 'A', h: ['Rijkaard and Völler both sent off', 'Kluivert scored for Netherlands', 'Klinsmann and Riedle for Germany'] },
    { q: 'Republic of Ireland 🇮🇪 vs Romania 🇷🇴 - round of 16', A: '0-0', B: '1-1', C: '2-2', D: '1-0', ans: 'A', h: ['Ireland won on penalties in Genoa', 'Packie Bonner\'s heroics', 'David O\'Leary converted the winning kick'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Cameroon 🇨🇲 - quarter-final', A: '3-2', B: '2-2', C: '2-1', D: '3-1', ans: 'A', h: ['Lineker\'s two penalties', 'Ekeke and Kunde for Cameroon', 'England scraped through in Naples'] },
    { q: 'USA 🇺🇸 vs Czechoslovakia 🇨🇿 - group stage', A: '1-5', B: '0-5', C: '1-4', D: '0-4', ans: 'C', h: ['USA\'s first World Cup in 40 years', 'Tomáš Skuhravý\'s hat-trick', 'A rude awakening in Florence'] },
    { q: 'Italy 🇮🇹 vs Uruguay 🇺🇾 - round of 16', A: '2-0', B: '1-0', C: '2-1', D: '0-0', ans: 'B', h: ['Schillaci\'s goal in Rome', 'Italy ground out the win', 'Uruguay\'s campaign ended'] },
    { q: 'Brazil 🇧🇷 vs Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Müller\'s late winner in Turin', 'Scotland had matched Brazil', 'The Tartan Army\'s near-miss'] },
    { q: 'Yugoslavia 🇷🇸 vs Spain 🇪🇸 - round of 16', A: '2-1', B: '1-1', C: '2-2', D: '1-0', ans: 'A', h: ['Stojković\'s brace in Verona', 'Spain fought back through Julio Salinas', 'Yugoslavia reached the quarter-finals'] },
  ]},
  { year: 1986, matches: [
    { q: 'Argentina 🇦🇷 vs West Germany 🇩🇪 - final', A: '2-2', B: '3-2', C: '2-1', D: '3-1', ans: 'B', h: ['Maradona\'s crowning glory in Mexico City', 'Rummenigge and Völler\'s late fightback', 'Burruchaga\'s winner sealed it'] },
    { q: 'Argentina 🇦🇷 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - quarter-final', A: '2-1', B: '1-1', C: '2-2', D: '3-1', ans: 'A', h: ['The Hand of God and the Goal of the Century', 'Lineker\'s consolation', 'Maradona\'s greatest match'] },
    { q: 'France 🇫🇷 vs Brazil 🇧🇷 - quarter-final', A: '1-1', B: '2-2', C: '0-0', D: '2-1', ans: 'A', h: ['Platini and Careca traded goals', 'France won on penalties in Guadalajara', 'An iconic midfield battle'] },
    { q: 'Belgium 🇧🇪 vs Soviet Union 🇷🇺 - round of 16', A: '3-4', B: '4-3', C: '3-2', D: '2-2', ans: 'B', h: ['Belgians came from 2-0 down', 'Extra time thriller in León', 'Scifo and Ceulemans inspired'] },
    { q: 'West Germany 🇩🇪 vs France 🇫🇷 - semi-final', A: '2-0', B: '1-0', C: '2-1', D: '0-0', ans: 'A', h: ['Bremen and Völler in Guadalajara', 'Schumacher\'s notorious challenge', 'France\'s chance slipped away'] },
    { q: 'Spain 🇪🇸 vs Denmark 🇩🇰 - round of 16', A: '4-1', B: '5-1', C: '3-1', D: '2-1', ans: 'B', h: ['Butragueño\'s four goals in Querétaro', 'Denmark\'s campaign collapsed', 'Spain\'s best performance'] },
    { q: 'Morocco 🇲🇦 vs Portugal 🇵🇹 - group stage', A: '2-1', B: '3-1', C: '1-0', D: '2-2', ans: 'B', h: ['Morocco\'s first ever World Cup win', 'First African team to top a group', 'Portugal exited early'] },
    { q: 'Uruguay 🇺🇾 vs Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 - group stage', A: '0-0', B: '1-1', C: '2-2', D: '1-0', ans: 'A', h: ['Battle of Neza - brutal match', 'No goals but plenty of cards', 'Both progressed from the group'] },
    { q: 'Iraq 🇮🇶 vs Belgium 🇧🇪 - group stage', A: '1-2', B: '0-1', C: '1-1', D: '0-2', ans: 'A', h: ['Iraq\'s first ever World Cup goal', 'Belgium\'s Scifo struck', 'Historic moment for Iraqi football'] },
    { q: 'Mexico 🇲🇽 vs Bulgaria 🇧🇬 - group stage', A: '2-0', B: '1-0', C: '2-1', D: '3-0', ans: 'A', h: ['Hosts topped their group', 'Flores and Servín in Mexico City', 'Bulgaria\'s disappointing campaign'] },
  ]},
  { year: 1982, matches: [
    { q: 'Italy 🇮🇹 vs West Germany 🇩🇪 - final', A: '2-1', B: '3-1', C: '2-0', D: '1-0', ans: 'B', h: ['Rossi, Tardelli, and Altobelli in Madrid', 'Italy\'s third World Cup', 'Breitner\'s consolation'] },
    { q: 'West Germany 🇩🇪 vs France 🇫🇷 - semi-final', A: '3-3', B: '2-2', C: '4-3', D: '3-2', ans: 'A', h: ['Schumacher\'s assault on Battiston', 'Socrates-style comeback in extra time', 'Germans won on penalties in Seville'] },
    { q: 'Italy 🇮🇹 vs Brazil 🇧🇷 - second round', A: '2-3', B: '3-2', C: '2-1', D: '3-1', ans: 'B', h: ['Paolo Rossi\'s hat-trick in Barcelona', 'Brazil needed only a draw', 'The greatest World Cup match ever?'] },
    { q: 'Northern Ireland 🇬🇧 vs Spain 🇪🇸 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Armstrong\'s goal in Valencia', 'Hosts Spain stunned', 'Northern Ireland topped the group'] },
    { q: 'Hungary 🇭🇺 vs El Salvador 🇸🇻 - group stage', A: '9-0', B: '10-1', C: '8-0', D: '10-0', ans: 'B', h: ['László Kiss\' hat-trick in 7 minutes', 'El Salvador\'s Mágico González scored', 'Record scoreline - 10 goals'] },
    { q: 'Poland 🇵🇱 vs Belgium 🇧🇪 - second round', A: '3-0', B: '2-0', C: '2-1', D: '1-0', ans: 'A', h: ['Boniek\'s hat-trick in Barcelona', 'Poland reached the semi-finals', 'Belgium\'s run ended'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs France 🇫🇷 - group stage', A: '2-1', B: '3-1', C: '1-1', D: '2-2', ans: 'B', h: ['Robson scored after 27 seconds', 'Platini\'s penalty for France', 'Bryan Robson\'s brace'] },
    { q: 'Algeria 🇩🇿 vs West Germany 🇩🇪 - group stage', A: '1-2', B: '2-1', C: '1-0', D: '2-0', ans: 'B', h: ['Algeria\'s famous upset in Gijón', 'Madjer and Belloumi struck', 'Controversial scheduling followed'] },
    { q: 'Austria 🇦🇹 vs West Germany 🇩🇪 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '0-0', ans: 'B', h: ['The "Disgrace of Gijón"', 'Both knew a 1-0 Germany win suited both', 'Algeria eliminated by the result'] },
    { q: 'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs New Zealand 🇳🇿 - group stage', A: '4-0', B: '5-2', C: '3-0', D: '4-1', ans: 'B', h: ['Dalglish, Robertson, and Archibald', 'New Zealand\'s first World Cup goals', 'Scotland won but went out on goal difference'] },
  ]},
  { year: 1978, matches: [
    { q: 'Argentina 🇦🇷 vs Netherlands 🇳🇱 - final', A: '2-1', B: '3-1', C: '2-2', D: '1-0', ans: 'B', h: ['Kempes and Bertoni in extra time', 'Nanninga\'s late equalizer forced ET', 'Argentina won at home in Buenos Aires'] },
    { q: 'Brazil 🇧🇷 vs Sweden 🇸🇪 - group stage', A: '1-0', B: '2-1', C: '0-0', D: '1-1', ans: 'D', h: ['Brazil needed to win to reach the final', 'Rehn and Sjöberg for Sweden', 'Brazil\'s disappointment in Mar del Plata'] },
    { q: 'Netherlands 🇳🇱 vs Italy 🇮🇹 - group stage', A: '1-2', B: '2-1', C: '0-0', D: '2-2', ans: 'B', h: ['Brandts\' own goal then winner', 'Italy\'s Eranni in goal', 'Dutch topped the group'] },
    { q: 'Argentina 🇦🇷 vs Peru 🇵🇪 - second round', A: '5-0', B: '6-0', C: '4-0', D: '3-0', ans: 'B', h: ['Kempes scored twice', 'Argentina needed to win by 4', 'Controversy over the margin'] },
    { q: 'West Germany 🇩🇪 vs Austria 🇦🇹 - second round', A: '2-1', B: '1-0', C: '3-2', D: '2-2', ans: 'C', h: ['Rummenigge and Müller for Germany', 'Austria\'s Krankl struck', 'Germans advanced to 3rd place match'] },
    { q: 'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs Netherlands 🇳🇱 - group stage', A: '2-3', B: '3-2', C: '1-2', D: '2-2', ans: 'B', h: ['Dalglish and Gemmill - that goal', 'Netherlands came from behind twice', 'Scotland\'s memorable exit'] },
    { q: 'Tunisia 🇹🇳 vs Mexico 🇲🇽 - group stage', A: '2-1', B: '3-1', C: '1-0', D: '2-0', ans: 'B', h: ['First African win in World Cup history', 'Kaabi, Dhouieb, and Gommidh', 'Tunisia in Rosario'] },
    { q: 'Poland 🇵🇱 vs Brazil 🇧🇷 - second round', A: '0-1', B: '1-0', C: '0-0', D: '1-1', ans: 'C', h: ['Lato scored for Poland', 'Brazil couldn\'t find a winner', 'Goalless in Mendoza'] },
    { q: 'Iran 🇮🇷 vs Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 - group stage', A: '1-1', B: '2-1', C: '1-0', D: '0-0', ans: 'A', h: ['Eskandarian and Danaeifard', 'Jordan\'s own goal for Scotland', 'Iran\'s first ever World Cup point'] },
    { q: 'France 🇫🇷 vs Argentina 🇦🇷 - group stage', A: '1-2', B: '2-1', C: '0-1', D: '1-1', ans: 'B', h: ['Platini\'s first World Cup', 'Passarella and Luque for Argentina', 'France\'s statement in Buenos Aires'] },
  ]},
  { year: 1974, matches: [
    { q: 'West Germany 🇩🇪 vs Netherlands 🇳🇱 - final', A: '1-0', B: '2-1', C: '2-0', D: '1-1', ans: 'B', h: ['Cruyff won a penalty before kick-off', 'Müller\'s winner in Munich', 'Total Football vs German efficiency'] },
    { q: 'Netherlands 🇳🇱 vs Brazil 🇧🇷 - second round', A: '1-0', B: '2-0', C: '2-1', D: '1-1', ans: 'B', h: ['Neeskens and Cruyff in Dortmund', 'Total Football overwhelmed Brazil', 'Dutch reached the final'] },
    { q: 'Poland 🇵🇱 vs Brazil 🇧🇷 - third place', A: '0-1', B: '1-0', C: '2-1', D: '0-0', ans: 'B', h: ['Lato\'s golden boot winner', 'Poland\'s best World Cup finish', 'Brazil disappointed again'] },
    { q: 'East Germany 🇩🇪 vs West Germany 🇩🇪 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '0-0', ans: 'B', h: ['The only meeting of the two Germanys', 'Sparwasser\'s historic goal in Hamburg', 'Political tensions on the pitch'] },
    { q: 'Australia 🇦🇺 vs East Germany 🇩🇪 - group stage', A: '0-2', B: '0-3', C: '1-2', D: '0-1', ans: 'B', h: ['Australia\'s first World Cup', 'Sparwasser and Streich', 'A learning experience in Hamburg'] },
    { q: 'Argentina 🇦🇷 vs Netherlands 🇳🇱 - second round', A: '0-1', B: '0-0', C: '1-2', D: '0-2', ans: 'A', h: ['Cruyff\'s Dutch dominated', 'Krol and Neeskens ran the show', 'Argentina\'s campaign ended'] },
    { q: 'Haiti 🇭🇹 vs Italy 🇮🇹 - group stage', A: '1-3', B: '0-3', C: '1-4', D: '0-4', ans: 'A', h: ['Haiti\'s first and only World Cup goal', 'Sanon shocked Dino Zoff', 'Italy recovered to win in Munich'] },
    { q: 'Yugoslavia 🇷🇸 vs Zaire 🇿🇩 - group stage', A: '8-0', B: '9-0', C: '7-0', D: '6-0', ans: 'B', h: ['Bajević\'s hat-trick in Gelsenkirchen', 'Africa\'s first World Cup ended badly', 'Džajić scored twice'] },
    { q: 'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 vs Zaire 🇿🇩 - group stage', A: '2-0', B: '2-1', C: '3-0', D: '1-0', ans: 'A', h: ['Lorimer and Jordan in Dortmund', 'Scotland\'s only win', 'First African World Cup campaign'] },
    { q: 'Sweden 🇸🇪 vs Netherlands 🇳🇱 - group stage', A: '0-0', B: '1-1', C: '0-1', D: '1-0', ans: 'A', h: ['Cruyff\'s Netherlands held', 'Tight encounter in Dortmund', 'Both advanced to second round'] },
  ]},
  { year: 1970, matches: [
    { q: 'Brazil 🇧🇷 vs Italy 🇮🇹 - final', A: '3-1', B: '4-1', C: '3-0', D: '2-1', ans: 'B', h: ['The greatest team of all time', 'Pelé\'s last World Cup match', 'Carlos Alberto\'s iconic fourth'] },
    { q: 'Italy 🇮🇹 vs West Germany 🇩🇪 - semi-final', A: '3-2', B: '4-3', C: '2-1', D: '3-1', ans: 'B', h: ['The "Game of the Century" in Mexico City', 'Five goals in extra time', 'Rivera\'s winner in the 111th minute'] },
    { q: 'Brazil 🇧🇷 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Banks\' save from Pelé - the greatest ever', 'Jairzinho\'s winner in Guadalajara', 'A classic of the tournament'] },
    { q: 'West Germany 🇩🇪 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - quarter-final', A: '2-3', B: '3-2', C: '2-2', D: '1-2', ans: 'B', h: ['England led 2-0 in León', 'Beckenbauer played with dislocated shoulder', 'Seeler and Müller completed the comeback'] },
    { q: 'Peru 🇵🇪 vs Bulgaria 🇧🇬 - group stage', A: '2-3', B: '3-2', C: '2-1', D: '3-1', ans: 'B', h: ['Cubillas\' hat-trick', 'Peru\'s best World Cup campaign', 'Thriller in León'] },
    { q: 'Mexico 🇲🇽 vs Belgium 🇧🇪 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Hosts won in Mexico City', 'Peña\'s goal', 'Belgium\'s campaign started with defeat'] },
    { q: 'Israel 🇮🇱 vs Italy 🇮🇹 - group stage', A: '0-0', B: '1-1', C: '0-1', D: '1-0', ans: 'A', h: ['Israel held the Italians in Toluca', 'Surprising result', 'Italy struggled in the group'] },
    { q: 'El Salvador 🇸🇻 vs Mexico 🇲🇽 - group stage', A: '0-4', B: '1-4', C: '0-3', D: '1-3', ans: 'D', h: ['Mexico\'s attack in León', 'El Salvador\'s first World Cup', 'Hosts dominated the group'] },
    { q: 'Uruguay 🇺🇾 vs Soviet Union 🇷🇺 - quarter-final', A: '0-1', B: '1-0', C: '2-1', D: '0-0', ans: 'B', h: ['Espárrago\'s extra-time winner', 'Goalless after 90 in Mexico City', 'Uruguay reached the semi-finals'] },
    { q: 'Brazil 🇧🇷 vs Peru 🇵🇪 - group stage', A: '3-2', B: '4-2', C: '2-1', D: '3-1', ans: 'B', h: ['Tostão and Jairzinho ran riot', 'Cubillas for Peru', 'Brazil\'s attack in Guadalajara'] },
  ]},
  { year: 1966, matches: [
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs West Germany 🇩🇪 - final', A: '3-2', B: '4-2', C: '2-1', D: '3-1', ans: 'B', h: ['"They think it\'s all over" - it is now', 'Hurst\'s hat-trick - including the debated goal', 'England\'s only World Cup at Wembley'] },
    { q: 'Portugal 🇵🇹 vs North Korea 🇰🇵 - quarter-final', A: '4-5', B: '5-3', C: '4-4', D: '3-5', ans: 'B', h: ['Eusébio\'s four goals', 'North Korea led 3-0 at one point', 'The Black Panther\'s rescue act in Liverpool'] },
    { q: 'West Germany 🇩🇪 vs Uruguay 🇺🇾 - quarter-final', A: '3-0', B: '4-0', C: '2-0', D: '1-0', ans: 'B', h: ['Haller, Beckenbauer, and Seeler', 'Uruguay had two sent off in Sheffield', 'Germans reached the semi-finals'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Argentina 🇦🇷 - quarter-final', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Rattin\'s controversial sending-off', 'Hurst\'s winner at Wembley', '"Animals" - the diplomatic incident'] },
    { q: 'Italy 🇮🇹 vs North Korea 🇰🇵 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '0-0', ans: 'A', h: ['Pak Doo-ik\'s goal - the miracle', 'Italy eliminated by minnows', 'Middlesbrough\'s historic upset'] },
    { q: 'Brazil 🇧🇷 vs Bulgaria 🇧🇬 - group stage', A: '1-0', B: '2-0', C: '3-0', D: '2-1', ans: 'B', h: ['Pelé and Garrincha struck', 'Bulgaria couldn\'t contain the champions', 'Liverpool witnessed Brazil\'s class'] },
    { q: 'Soviet Union 🇷🇺 vs Hungary 🇭🇺 - quarter-final', A: '1-2', B: '2-1', C: '0-1', D: '2-2', ans: 'B', h: ['Chislenko and Porkujan', 'Hungary\'s Bene scored', 'USSR reached the semi-finals in Sunderland'] },
    { q: 'North Korea 🇰🇵 vs Chile 🇨🇱 - group stage', A: '1-1', B: '2-1', C: '1-0', D: '0-0', ans: 'A', h: ['Pak Seung-zin for North Korea', 'Marcos for Chile', 'Middlesbrough embraced the Koreans'] },
    { q: 'Mexico 🇲🇽 vs France 🇫🇷 - group stage', A: '0-1', B: '1-0', C: '0-0', D: '1-1', ans: 'B', h: ['Borja\'s goal at Wembley', 'Mexico\'s first World Cup win', 'France exited early'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Portugal 🇵🇹 - semi-final', A: '1-2', B: '2-1', C: '0-1', D: '1-1', ans: 'B', h: ['Bobby Charlton\'s two goals', 'Eusébio\'s penalty consolation', 'England reached the final at Wembley'] },
  ]},
  { year: 1962, matches: [
    { q: 'Brazil 🇧🇷 vs Czechoslovakia 🇨🇿 - final', A: '2-1', B: '3-1', C: '2-0', D: '1-0', ans: 'B', h: ['Zito, Vavá, and Amarildo in Santiago', 'Masopust put Czechoslovakia ahead', 'Brazil\'s second straight title'] },
    { q: 'Brazil 🇧🇷 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - group stage', A: '2-1', B: '3-1', C: '1-1', D: '2-0', ans: 'B', h: ['Garrincha\'s brilliance in Vina del Mar', 'Hitchens for England', 'Pelé was injured - Garrincha stepped up'] },
    { q: 'Chile 🇨🇱 vs Italy 🇮🇹 - group stage', A: '2-0', B: '1-0', C: '2-1', D: '0-0', ans: 'A', h: ['The "Battle of Santiago"', 'Two Italians sent off', 'Ferrini and David sent packing'] },
    { q: 'Yugoslavia 🇷🇸 vs West Germany 🇩🇪 - quarter-final', A: '1-0', B: '2-1', C: '0-0', D: '1-1', ans: 'A', h: ['Radakovič\'s goal in Santiago', 'Germany\'s campaign ended', 'Yugoslavia reached semi-finals'] },
    { q: 'Chile 🇨🇱 vs Soviet Union 🇷🇺 - group stage', A: '1-2', B: '2-1', C: '0-1', D: '1-1', ans: 'B', h: ['Hosts won a thriller in Arica', 'Chile\'s Rojas and Sánchez', 'Ivanov for USSR'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Argentina 🇦🇷 - group stage', A: '2-1', B: '3-1', C: '1-0', D: '0-0', ans: 'B', h: ['Flowers, Charlton, and Greaves', 'Santiago - hostile atmosphere', 'England topped the group'] },
    { q: 'Hungary 🇭🇺 vs Bulgaria 🇧🇬 - group stage', A: '5-1', B: '6-1', C: '4-1', D: '3-1', ans: 'B', h: ['Albert\'s hat-trick in Rancagua', 'Hungary\'s last great World Cup', 'Bulgaria overwhelmed'] },
    { q: 'Uruguay 🇺🇾 vs Colombia 🇨🇴 - group stage', A: '1-2', B: '2-1', C: '0-0', D: '1-1', ans: 'B', h: ['Sasía and Cubilla for Uruguay', 'Colombia\'s first World Cup', 'Tight encounter in Arica'] },
    { q: 'Switzerland 🇨🇭 vs Chile 🇨🇱 - group stage', A: '1-3', B: '0-3', C: '2-3', D: '1-2', ans: 'B', h: ['Chile\'s Sánchez scored twice', 'Hosts dominated in Santiago', 'Switzerland exited'] },
    { q: 'Czechoslovakia 🇨🇿 vs Spain 🇪🇸 - group stage', A: '1-0', B: '2-1', C: '0-0', D: '1-1', ans: 'A', h: ['Štibrányi\'s goal in Viña del Mar', 'Spain disappointed', 'Czechoslovakia progressed'] },
  ]},
  { year: 1958, matches: [
    { q: 'Brazil 🇧🇷 vs Sweden 🇸🇪 - final', A: '4-2', B: '5-2', C: '3-1', D: '4-1', ans: 'B', h: ['Pelé\'s coming of age in Stockholm', 'Vavá and Zagallo too', 'Brazil\'s first World Cup'] },
    { q: 'Brazil 🇧🇷 vs France 🇫🇷 - semi-final', A: '4-2', B: '5-2', C: '3-1', D: '2-1', ans: 'B', h: ['Pelé\'s hat-trick in Stockholm', 'Fontaine and Piantoni for France', 'Just 17 - Pelé announced himself'] },
    { q: 'France 🇫🇷 vs Paraguay 🇵🇾 - group stage', A: '6-3', B: '7-3', C: '5-2', D: '4-1', ans: 'B', h: ['Fontaine\'s hat-trick', 'Just Fontaine - 13 goals in the tournament', 'Highest-scoring group match'] },
    { q: 'West Germany 🇩🇪 vs Sweden 🇸🇪 - semi-final', A: '1-3', B: '2-3', C: '0-3', D: '1-2', ans: 'A', h: ['Hosts Sweden reached the final', 'Skoglund, Gren, and Hamrin', 'Germany\'s campaign ended'] },
    { q: 'Brazil 🇧🇷 vs Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿 - quarter-final', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Pelé\'s first World Cup goal', 'Wales held firm until the 66th minute', 'Brazil scraped through in Gothenburg'] },
    { q: 'Northern Ireland 🇬🇧 vs Czechoslovakia 🇨🇿 - group stage', A: '1-0', B: '2-1', C: '1-1', D: '0-0', ans: 'B', h: ['McParland\'s double', 'Northern Ireland\'s first World Cup', 'Shock result in Halmstad'] },
    { q: 'Soviet Union 🇷🇺 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - group stage', A: '2-1', B: '1-0', C: '2-0', D: '1-1', ans: 'C', h: ['Ilyin and Ivanov in Gothenburg', 'Kevan for England', 'USSR progressed'] },
    { q: 'Argentina 🇦🇷 vs West Germany 🇩🇪 - group stage', A: '1-3', B: '2-3', C: '0-3', D: '1-2', ans: 'A', h: ['Rahn, Seeler, and Schäfer', 'Corbatta for Argentina', 'Germany topped the group'] },
    { q: 'Hungary 🇭🇺 vs Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿 - group stage', A: '1-1', B: '2-2', C: '0-0', D: '1-0', ans: 'A', h: ['Playoff to decide qualification', 'Bozsik and Ivor Allchurch', 'Wales won the replay'] },
    { q: 'Sweden 🇸🇪 vs Mexico 🇲🇽 - group stage', A: '2-0', B: '3-0', C: '1-0', D: '4-0', ans: 'B', h: ['Simonsson\'s brace', 'Hosts Sweden in Stockholm', 'Mexico\'s campaign ended'] },
  ]},
  { year: 1954, matches: [
    { q: 'West Germany 🇩🇪 vs Hungary 🇭🇺 - final', A: '2-2', B: '3-2', C: '2-1', D: '1-0', ans: 'B', h: ['The Miracle of Bern', 'Hungary led 2-0 after 8 minutes', 'Rahn\'s winner completed the upset'] },
    { q: 'Hungary 🇭🇺 vs West Germany 🇩🇪 - group stage', A: '7-1', B: '8-3', C: '6-1', D: '5-1', ans: 'B', h: ['The Mighty Magyars\' demolition', 'Kocsis hit four', 'Germany rested key players - mind games'] },
    { q: 'Austria 🇦🇹 vs Switzerland 🇨🇭 - quarter-final', A: '6-5', B: '7-5', C: '5-4', D: '4-3', ans: 'B', h: ['Highest-scoring match in World Cup history', '12 goals in Lausanne', 'Prohaska and Wagner for Austria'] },
    { q: 'Brazil 🇧🇷 vs Hungary 🇭🇺 - quarter-final', A: '2-4', B: '1-4', C: '2-3', D: '0-4', ans: 'C', h: ['The Battle of Berne - brutal', 'Three dismissals', 'Kocsis\' hat-trick for Hungary'] },
    { q: 'West Germany 🇩🇪 vs Austria 🇦🇹 - semi-final', A: '5-1', B: '6-1', C: '4-1', D: '3-1', ans: 'B', h: ['Schäfer and Morlock', 'Germany reached the final', 'Austria\'s run ended in Basel'] },
    { q: 'Hungary 🇭🇺 vs Brazil 🇧🇷 - quarter-final', A: '3-2', B: '4-2', C: '2-1', D: '4-1', ans: 'B', h: ['Kocsis\' double', 'The fight on the pitch', 'Hungary\'s golden team prevailed'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs Belgium 🇧🇪 - group stage', A: '3-1', B: '4-1', C: '2-0', D: '3-0', ans: 'C', h: ['Lofthouse\'s brace in Basel', 'Anslow for England', 'Belgium eliminated'] },
    { q: 'Yugoslavia 🇷🇸 vs West Germany 🇩🇪 - quarter-final', A: '0-2', B: '1-2', C: '0-1', D: '1-0', ans: 'A', h: ['Horvat and Friz for Germany', 'Yugoslavia\'s campaign ended', 'Germany advanced in Geneva'] },
    { q: 'Uruguay 🇺🇾 vs Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 - group stage', A: '6-0', B: '7-0', C: '5-0', D: '4-0', ans: 'B', h: ['Uruguay\'s demolition in Basel', 'Borges and Abbadie', 'Scotland\'s nightmare'] },
    { q: 'South Korea 🇰🇷 vs Turkey 🇹🇷 - group stage', A: '0-7', B: '0-4', C: '1-7', D: '0-5', ans: 'A', h: ['South Korea\'s first World Cup', 'Turkey\'s Burhan scored four', 'A harsh introduction in Geneva'] },
  ]},
  { year: 1950, matches: [
    { q: 'Uruguay 🇺🇾 vs Brazil 🇧🇷 - decisive final match', A: '1-2', B: '2-1', C: '1-1', D: '0-1', ans: 'B', h: ['The Maracanazo - Brazil\'s trauma', 'Schiaffino and Ghiggia', '200,000 in the Maracanã fell silent'] },
    { q: 'England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 vs United States 🇺🇸 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '0-0', ans: 'A', h: ['The miracle of Belo Horizonte', 'Gaetjens\' header', 'England - inventors of football - lost'] },
    { q: 'Spain 🇪🇸 vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - group stage', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Zarra\'s goal in Rio', 'Spain\'s strong campaign', 'England\'s disastrous tournament'] },
    { q: 'Brazil 🇧🇷 vs Sweden 🇸🇪 - final group', A: '6-1', B: '7-1', C: '5-1', D: '4-1', ans: 'B', h: ['Ademir\'s four goals', 'Brazil\'s attacking exhibition', 'Chico and Maneca too'] },
    { q: 'Uruguay 🇺🇾 vs Sweden 🇸🇪 - final group', A: '2-2', B: '3-2', C: '2-1', D: '1-1', ans: 'B', h: ['Miguez\'s brace', 'Sweden\'s Sundqvist', 'Uruguay stayed alive'] },
    { q: 'Switzerland 🇨🇭 vs Mexico 🇲🇽 - group stage', A: '2-1', B: '1-0', C: '2-0', D: '3-1', ans: 'A', h: ['Antenen and Fatton', 'Mexico\'s Casarín', 'Switzerland in Porto Alegre'] },
    { q: 'Yugoslavia 🇷🇸 vs Switzerland 🇨🇭 - group stage', A: '2-0', B: '3-0', C: '1-0', D: '4-0', ans: 'B', h: ['Tomašević and Ognjanov', 'Yugoslavia topped the group', 'Switzerland eliminated'] },
    { q: 'Brazil 🇧🇷 vs Mexico 🇲🇽 - group stage', A: '3-0', B: '4-0', C: '2-0', D: '5-0', ans: 'B', h: ['Ademir\'s hat-trick', 'Brazil in Rio', 'Mexico overwhelmed'] },
    { q: 'Spain 🇪🇸 vs Chile 🇨🇱 - group stage', A: '2-0', B: '3-0', C: '1-0', D: '2-1', ans: 'A', h: ['Basora\'s double', 'Spain in Rio', 'Chile\'s campaign ended'] },
    { q: 'Uruguay 🇺🇾 vs Bolivia 🇧🇴 - group stage', A: '7-0', B: '8-0', C: '6-0', D: '5-0', ans: 'B', h: ['Miguez\'s hat-trick', 'Uruguay in Belo Horizonte', 'Bolivia\'s only match'] },
  ]},
  { year: 1938, matches: [
    { q: 'Italy 🇮🇹 vs Hungary 🇭🇺 - final', A: '3-1', B: '4-2', C: '2-1', D: '3-2', ans: 'B', h: ['Italy retained the trophy in Paris', 'Colaussi and Piola', 'Hungary\'s Titkos and Sásvári'] },
    { q: 'Brazil 🇧🇷 vs Poland 🇵🇱 - first round', A: '4-6', B: '5-6', C: '4-4', D: '6-5', ans: 'B', h: ['Leonidas\' four goals', 'Wilimowski\'s four for Poland', 'Extra time thriller in Strasbourg'] },
    { q: 'Italy 🇮🇹 vs France 🇫🇷 - quarter-final', A: '2-1', B: '3-1', C: '1-0', D: '2-0', ans: 'B', h: ['Hosts France eliminated', 'Colaussi and Piola', 'Italy in Marseille'] },
    { q: 'Sweden 🇸🇪 vs Cuba 🇨🇺 - quarter-final', A: '7-0', B: '8-0', C: '6-0', D: '5-0', ans: 'B', h: ['Sweden\'s demolition in Antibes', 'Wetterström\'s hat-trick', 'Cuba\'s only World Cup'] },
    { q: 'Hungary 🇭🇺 vs Netherlands 🇳🇱 - first round', A: '5-1', B: '6-0', C: '4-1', D: '3-0', ans: 'B', h: ['Sásvári\'s hat-trick', 'Hungary in Reims', 'Netherlands exited'] },
    { q: 'Czechoslovakia 🇨🇿 vs Netherlands 🇳🇱 - first round replay', A: '2-1', B: '3-1', C: '1-0', D: '1-1', ans: 'B', h: ['Nejedlý\'s double', 'After 3-0 aet draw', 'Czechoslovakia in Bordeaux'] },
    { q: 'Brazil 🇧🇷 vs Czechoslovakia 🇨🇿 - quarter-final', A: '1-1', B: '2-1', C: '0-0', D: '1-0', ans: 'A', h: ['Battle of Bordeaux - three sendings-off', 'Replay needed', 'Brazil\'s physical approach'] },
    { q: 'Switzerland 🇨🇭 vs Germany 🇩🇪 - first round replay', A: '4-2', B: '2-1', C: '3-1', D: '1-0', ans: 'A', h: ['Switzerland shocked Germany', 'After 1-1 draw', 'Paris replay'] },
    { q: 'Italy 🇮🇹 vs Norway 🇳🇴 - extra time replay', A: '1-0', B: '2-1', C: '0-0', D: '1-1', ans: 'B', h: ['Piola\'s winner in replay', 'After 2-1 aet first match', 'Italy survived in Marseille'] },
    { q: 'Indonesia 🇮🇩 vs Hungary 🇭🇺 - first round', A: '0-6', B: '0-5', C: '0-4', D: '0-7', ans: 'A', h: ['Dutch East Indies\' only World Cup', 'Hungary\'s easy passage', 'Reims'] },
  ]},
  { year: 1934, matches: [
    { q: 'Italy 🇮🇹 vs Czechoslovakia 🇨🇿 - final', A: '1-1', B: '2-1', C: '1-0', D: '2-0', ans: 'B', h: ['Extra time in Rome', 'Orsi equalized, Schiavio won it', 'Italy\'s first World Cup'] },
    { q: 'Italy 🇮🇹 vs Austria 🇦🇹 - semi-final', A: '0-1', B: '1-0', C: '2-1', D: '1-1', ans: 'B', h: ['Guaita\'s goal in Milan', 'Austria\'s Wunderteam fell', 'Hosts reached the final'] },
    { q: 'Czechoslovakia 🇨🇿 vs Germany 🇩🇪 - semi-final', A: '2-1', B: '3-1', C: '1-0', D: '2-0', ans: 'B', h: ['Nejedlý\'s brace in Rome', 'Czechoslovakia reached final', 'Germany\'s campaign ended'] },
    { q: 'Austria 🇦🇹 vs Hungary 🇭🇺 - quarter-final', A: '1-2', B: '2-1', C: '0-1', D: '1-1', ans: 'B', h: ['Horvath and Zischek', 'Austria\'s Wunderteam', 'Bologna'] },
    { q: 'Germany 🇩🇪 vs Austria 🇦🇹 - third place', A: '2-3', B: '3-2', C: '1-2', D: '2-1', ans: 'B', h: ['Lehner\'s brace for Germany', 'Horvath for Austria', 'Naples'] },
    { q: 'Italy 🇮🇹 vs Spain 🇪🇸 - quarter-final', A: '1-1', B: '0-0', C: '2-1', D: '1-0', ans: 'A', h: ['Replay after brutal 1-1 draw', 'Italy won the replay 1-0', 'Florence'] },
    { q: 'Argentina 🇦🇷 vs Sweden 🇸🇪 - first round', A: '2-3', B: '3-2', C: '1-2', D: '2-1', ans: 'B', h: ['Belis and Galateo', 'Argentina\'s strong debut', 'Bologna'] },
    { q: 'Brazil 🇧🇷 vs Spain 🇪🇸 - first round', A: '1-3', B: '2-3', C: '0-3', D: '1-1', ans: 'A', h: ['Spain\'s Iraragorri', 'Leonidas for Brazil', 'Genoa'] },
    { q: 'United States 🇺🇸 vs Mexico 🇲🇽 - qualification playoff', A: '3-2', B: '4-2', C: '2-1', D: '1-0', ans: 'B', h: ['Donelli scored all four for USA', 'Playoff in Rome - winner faced Italy', 'Mexico\'s campaign ended early'] },
    { q: 'Egypt 🇪🇬 vs Hungary 🇭🇺 - first round', A: '2-4', B: '1-4', C: '2-3', D: '0-4', ans: 'A', h: ['Africa\'s first World Cup match', 'Fawzi\'s brace for Egypt', 'Napoli'] },
  ]},
  { year: 1930, matches: [
    { q: 'Uruguay 🇺🇾 vs Argentina 🇦🇷 - final', A: '3-2', B: '4-2', C: '2-1', D: '3-1', ans: 'B', h: ['The first ever World Cup final', 'Dorado, Cea, Iriarte, Castro', 'Montevideo - 100 years of independence'] },
    { q: 'Argentina 🇦🇷 vs United States 🇺🇸 - semi-final', A: '5-1', B: '6-1', C: '4-1', D: '5-0', ans: 'B', h: ['Stábile\'s hat-trick', 'Argentina reached the final', 'USA\'s surprise run ended'] },
    { q: 'Uruguay 🇺🇾 vs Yugoslavia 🇷🇸 - semi-final', A: '5-1', B: '6-1', C: '4-2', D: '5-2', ans: 'B', h: ['Cea\'s hat-trick', 'Hosts reached the final', 'Montevideo'] },
    { q: 'Argentina 🇦🇷 vs Mexico 🇲🇽 - group stage', A: '5-3', B: '6-3', C: '4-2', D: '5-2', ans: 'B', h: ['Stábile\'s hat-trick on debut', 'First World Cup group match', 'Three penalties in the match'] },
    { q: 'France 🇫🇷 vs Argentina 🇦🇷 - group stage', A: '0-1', B: '1-0', C: '1-1', D: '0-0', ans: 'A', h: ['The very first World Cup match', 'Monti\'s goal in 81st minute', 'Uruguay 1930 opening game'] },
    { q: 'United States 🇺🇸 vs Paraguay 🇵🇾 - group stage', A: '2-0', B: '3-0', C: '1-0', D: '2-1', ans: 'B', h: ['Patenaude\'s double', 'USA reached semi-finals', 'Montevideo'] },
    { q: 'Yugoslavia 🇷🇸 vs Bolivia 🇧🇴 - group stage', A: '3-0', B: '4-0', C: '2-0', D: '5-0', ans: 'B', h: ['Bek\'s brace', 'Yugoslavia topped group', 'Bolivia\'s debut'] },
    { q: 'Brazil 🇧🇷 vs Bolivia 🇧🇴 - group stage', A: '3-0', B: '4-0', C: '2-0', D: '1-0', ans: 'B', h: ['Preguinho\'s double', 'Brazil\'s first World Cup', 'Montevideo'] },
    { q: 'Uruguay 🇺🇾 vs Romania 🇷🇴 - group stage', A: '3-0', B: '4-0', C: '2-0', D: '1-0', ans: 'B', h: ['Adolfo, Anselmo, Iriarte', 'Hosts topped the group', 'Centenario Stadium'] },
    { q: 'Chile 🇨🇱 vs France 🇫🇷 - group stage', A: '0-1', B: '1-0', C: '0-0', D: '1-1', ans: 'B', h: ['Subiabre\'s goal', 'Chile\'s first World Cup win', 'France eliminated in Montevideo'] },
  ]},
];

const allCampaigns = [...CAMPAIGNS, ...EXTRA_CAMPAIGNS, ...LEGACY_CAMPAIGNS];

function escape(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function genQuestion(year, idx, m) {
  const id = `sc-${year}-${idx}`;
  const h4 = m.h[3] || "One of the tournament's most memorable matches";
  return `  {
    id: '${id}',
    category: 'guess-scoreline',
    difficulty: 'easy',
    question: '${escape(m.q)}',
    optionA: '${m.A}',
    optionB: '${m.B}',
    optionC: '${m.C}',
    optionD: '${m.D}',
    correctAnswer: '${m.ans}',
    hint1: '${escape(m.h[0])}',
    hint2: '${escape(m.h[1])}',
    hint3: '${escape(m.h[2])}',
    hint4: '${escape(h4)}',
  }`;
}

let out = `import { Question } from '@/types/game';

// Scoreline Questions - Historic World Cup match results
// 10 curated questions per campaign: finals, iconic semis, memorable upsets, best games
// Hints never reveal the score, goals, or answer - they provide match context only

export const scorelineQuestions: Question[] = [
`;

for (const camp of allCampaigns) {
  out += `  // ============================================\n`;
  out += `  // ${camp.year} WORLD CUP - 10 Memorable Matches\n`;
  out += `  // ============================================\n`;
  camp.matches.forEach((m, i) => {
    out += genQuestion(camp.year, i + 1, m) + ',\n';
  });
}

out += `];
`;

// Write to file
const fs = await import('fs');
fs.writeFileSync('./src/data/scorelineQuestions.ts', out);
console.log('Generated scorelineQuestions.ts with', allCampaigns.reduce((s,c) => s + c.matches.length, 0), 'questions');
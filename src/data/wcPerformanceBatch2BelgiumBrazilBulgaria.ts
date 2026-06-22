/**
 * World Cup finals — player performance only (goals, assists, cards, minutes, saves, match events involving the named player).
 * Batch 2: Belgium, Brazil, Bulgaria (Select a Legend). No host-nation or stadium trivia.
 * Stems name what that player did; avoid “what Brazil/Belgium did” unless tied to a named individual action.
 */
import type { Question } from '@/types/game';

function pq(
  id: string,
  year: number,
  question: string,
  opts: [string, string, string, string],
  correct: 'A' | 'B' | 'C' | 'D',
  hints: [string, string, string],
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
): Question {
  return {
    id,
    category: 'player',
    difficulty,
    question,
    optionA: opts[0],
    optionB: opts[1],
    optionC: opts[2],
    optionD: opts[3],
    correctAnswer: correct,
    hint1: hints[0],
    hint2: hints[1],
    hint3: hints[2],
    eventYear: year,
  };
}

const kevinDeBruyne: Question[] = [
  pq('kevin-de-bruyne-wcp-1', 2018, 'At the 2018 World Cup, Kevin De Bruyne scored Belgium\'s second goal in the quarter-final win over which nation?', ['Brazil', 'France', 'Japan', 'England'], 'A', ['Kazan', 'Counter-attack finish', 'Brazil'], 'easy'),
  pq('kevin-de-bruyne-wcp-2', 2018, 'How many goals did Kevin De Bruyne score in total at the 2018 World Cup?', ['0', '1', '2', '3'], 'B', ['Brazil quarter-final strike', 'One goal', '1'], 'easy'),
  pq('kevin-de-bruyne-wcp-3', 2022, 'At the 2022 World Cup, did Kevin De Bruyne start Belgium\'s opening group match against Canada?', ['Yes', 'No', 'Only as a late sub', 'Suspended'], 'A', ['Ahmad bin Ali Stadium', 'Named in the XI', 'Yes'], 'medium'),
  pq('kevin-de-bruyne-wcp-4', 2014, 'In the 2014 World Cup Round of 16 against the United States, did Kevin De Bruyne score Belgium\'s opening goal in extra time?', ['Yes', 'No', 'Only in a shootout', 'Only from a free kick'], 'A', ['Salvador', 'After Tim Howard\'s record night', 'Yes'], 'medium'),
  pq('kevin-de-bruyne-wcp-5', 2014, 'In the same United States match at the 2014 World Cup, did De Bruyne assist Romelu Lukaku\'s extra-time goal?', ['Yes', 'No', 'Own goal', 'Corner only'], 'A', ['2–1 after extra time', 'Lukaku sealed it', 'Yes'], 'hard'),
  pq('kevin-de-bruyne-wcp-6', 2018, 'At the 2018 World Cup, did De Bruyne start Belgium\'s dramatic Round of 16 comeback win over Japan?', ['Yes', 'No', 'Benched entire match', 'Only the replay'], 'A', ['Rostov', 'Part of the 3–2 thriller', 'Yes'], 'easy'),
  pq('kevin-de-bruyne-wcp-7', 2018, 'Did De Bruyne start Belgium\'s semi-final loss to France at the 2018 World Cup?', ['Yes', 'No', 'Only extra time', 'Cup-tied'], 'A', ['Saint Petersburg', 'Engine room', 'Yes'], 'medium'),
  pq('kevin-de-bruyne-wcp-8', 2014, 'In the 2014 World Cup quarter-finals against Argentina, did De Bruyne start for Belgium?', ['Yes', 'No', 'Sent off', 'Injured before KO'], 'A', ['Brasília', '1–0 defeat', 'Yes'], 'medium'),
  pq('kevin-de-bruyne-wcp-9', 2018, 'In Belgium\'s 2018 third-place match win over England, did Kevin De Bruyne start?', ['Yes', 'No', 'Only as a substitute', 'Suspended'], 'A', ['Saint Petersburg', 'Bronze medal', 'Yes'], 'easy'),
  pq('kevin-de-bruyne-wcp-10', 2022, 'At the 2022 World Cup, did De Bruyne start Belgium\'s final group match against Croatia?', ['Yes', 'No', 'Only extra time', 'Sent off earlier'], 'A', ['Ahmad bin Ali Stadium', 'Goalless draw', 'Yes'], 'medium'),
];

const edenHazard: Question[] = [
  pq('eden-hazard-wcp-1', 2018, 'At the 2018 World Cup, Eden Hazard won which individual award after Belgium finished third?', ['Golden Boot', 'Silver Ball', 'Golden Glove', 'Young Player'], 'B', ['Russia 2018', 'Midfield brilliance', 'Silver Ball'], 'medium'),
  pq('eden-hazard-wcp-2', 2014, 'How many goals did Eden Hazard score at the 2014 World Cup?', ['0', '1', '2', '3'], 'A', ['Creative role', 'No goal', '0'], 'easy'),
  pq('eden-hazard-wcp-3', 2018, 'How many goals did Eden Hazard score in total at the 2018 World Cup?', ['1', '2', '3', '4'], 'C', ['Tunisia, England third-place among them', 'Three goals', '3'], 'medium'),
  pq('eden-hazard-wcp-4', 2018, 'Did Hazard score in Belgium\'s 2–1 quarter-final win over Brazil at the 2018 World Cup?', ['Yes', 'No', 'Own goal', 'Penalty'], 'B', ['De Bruyne scored', 'No goal vs Brazil', 'No'], 'medium'),
  pq('eden-hazard-wcp-5', 2018, 'Against England in the 2018 third-place match, did Hazard score Belgium\'s second goal in the 2–0 win?', ['Yes', 'No', 'Own goal', 'Penalty shootout only'], 'A', ['Captain', 'Sealed bronze', 'Yes'], 'easy'),
  pq('eden-hazard-wcp-6', 2014, 'In the Round of 16 at the 2014 World Cup, did Hazard play the full 120 minutes vs the United States?', ['Yes', 'No', 'Sent off', 'Subbed before ET'], 'A', ['Extra time in Salvador', 'Wide threat', 'Yes'], 'hard'),
  pq('eden-hazard-wcp-7', 2022, 'At the 2022 World Cup, how many group matches did Eden Hazard start for Belgium?', ['0', '1', '2', '3'], 'C', ['Canada and Morocco ties', 'Benched vs Croatia', '2'], 'hard'),
  pq('eden-hazard-wcp-8', 2022, 'At the 2022 World Cup, did Hazard start Belgium\'s final group game against Croatia?', ['Yes', 'No', 'Only extra time', 'Was not in the squad'], 'B', ['Rotation for leaders', 'Did not start', 'No'], 'medium'),
  pq('eden-hazard-wcp-9', 2018, 'In Belgium\'s group win over Tunisia at the 2018 World Cup, did Hazard get on the scoresheet?', ['Yes', 'No', 'Only an own goal', 'Only a red card'], 'A', ['High-scoring game', 'Brace in 5–2', 'Yes'], 'easy'),
  pq('eden-hazard-wcp-10', 2018, 'In Belgium\'s 5–2 group win over Tunisia at the 2018 World Cup, Hazard\'s first goal came from which route?', ['Penalty kick', 'Direct free kick', 'Header', 'Long-range volley'], 'A', ['Captain converted', 'Early breakthrough', 'Penalty kick'], 'medium'),
];

const thibautCourtois: Question[] = [
  pq('thibaut-courtois-wcp-1', 2018, 'Which individual award did Thibaut Courtois win at the 2018 World Cup?', ['Golden Boot', 'Golden Ball', 'Golden Glove', 'Fair Play'], 'C', ['Best goalkeeper', 'Russia 2018', 'Golden Glove'], 'easy'),
  pq('thibaut-courtois-wcp-2', 2018, 'How many clean sheets did Courtois keep in Belgium\'s 2018 World Cup group stage?', ['1', '2', '3', '4'], 'B', ['Panama and England shutouts', 'Two', '2'], 'hard'),
  pq('thibaut-courtois-wcp-3', 2014, 'Did Courtois start Belgium\'s Round of 16 match against the United States at the 2014 World Cup?', ['Yes', 'No', 'Only extra time', 'Replaced at half-time'], 'A', ['Salvador epic', 'Behind Tim Howard\'s saves', 'Yes'], 'medium'),
  pq('thibaut-courtois-wcp-4', 2022, 'Against Croatia at the 2022 World Cup, did Courtois concede in Belgium\'s 0–0 draw?', ['Yes', 'No', 'Own goal', 'Penalty'], 'B', ['Clean sheet', 'Point earned', 'No'], 'medium'),
  pq('thibaut-courtois-wcp-5', 2018, 'In Belgium\'s 2018 World Cup quarter-final win over Brazil, Courtois was named Man of the Match — who did he repeatedly frustrate with late-match stops?', ['Philippe Coutinho', 'Neymar', 'Willian', 'Roberto Firmino'], 'B', ['Kazan night', 'Including last-line 1v1 denials', 'Neymar'], 'medium'),
  pq('thibaut-courtois-wcp-6', 2022, 'In Belgium\'s opening 2022 World Cup match against Canada, did Courtois save Alphonso Davies\' first-half penalty?', ['Yes', 'No', 'No penalty awarded', 'Match went to pens'], 'A', ['1–0 win', 'Huge moment', 'Yes'], 'medium'),
  pq('thibaut-courtois-wcp-7', 2018, 'In the quarter-final win over Brazil at the 2018 World Cup, how many goals did Courtois concede?', ['0', '1', '2', '3'], 'B', ['Renato Augusto header', 'Belgium won 2–1', '1'], 'medium'),
  pq('thibaut-courtois-wcp-8', 2014, 'In the 2014 World Cup quarter-final loss to Argentina, did Courtois concede?', ['Yes', 'No', 'Only post-match', 'Own goal only'], 'A', ['Higuaín winner', '1–0', 'Yes'], 'easy'),
  pq('thibaut-courtois-wcp-9', 2018, 'Did Courtois keep a clean sheet in Belgium\'s 2018 World Cup group win over Panama?', ['Yes', 'No', 'Only after replay', 'Only in extra time'], 'A', ['3–0 Sochi', 'Shutout', 'Yes'], 'easy'),
  pq('thibaut-courtois-wcp-10', 2022, 'In Belgium\'s 2022 World Cup group loss to Morocco, did Courtois concede more than one goal?', ['Yes', 'No', 'Only from a corner', 'Only stoppage time'], 'A', ['0–2 upset', 'Late goals', 'Yes'], 'medium'),
];

/** Pelé: full authored pool lives in playerQuestions.ts (pel-058/062/066/070 + legacy pele-*). Do not attach a sparse `pele` key here — it would overwrite that array via spread merge order. */

/** Ronaldo (Brazil R9): full authored pool lives in playerQuestions.ts. Do not attach `ronaldo-r9` here — spread merge would overwrite. */

/** Cafú: full authored pool lives in playerQuestions.ts. Do not attach `cafu` here — spread merge would overwrite. */

/** Garrincha / Jairzinho / Roberto Carlos / Rivaldo / Neymar / Zico / Ronaldinho: authored pools + verbatim tiles live in playerQuestions.ts. Do not attach here — merge would overwrite. */

const hristoStoichkov: Question[] = [
  pq('hristo-stoichkov-wcp-1', 1994, 'How many goals did Hristo Stoichkov score at the 1994 World Cup in the United States?', ['4', '5', '6', '7'], 'C', ['Shared Golden Boot', 'Six goals', '6'], 'easy'),
  pq('hristo-stoichkov-wcp-2', 1994, 'In the 1994 World Cup semi-final, did Hristo Stoichkov score Bulgaria’s goal in the 2–1 loss to Italy?', ['Yes', 'No', 'Only in extra time', 'Own goal'], 'A', ['Roberto Baggio’s double won it for the Azzurri', 'Stoichkov on the sheet', 'Yes'], 'medium'),
  pq('hristo-stoichkov-wcp-3', 1994, 'Did Stoichkov score in Bulgaria\'s quarter-final win over Germany?', ['Yes', 'No', 'Own goal', 'Penalty shootout'], 'A', ['Penalty goal', 'Historic upset', 'Yes'], 'easy'),
  pq('hristo-stoichkov-wcp-4', 1994, 'In the third-place match vs Sweden, did Stoichkov score?', ['Yes', 'No', 'Own goal', 'Sent off before'], 'B', ['Bulgaria lost 4–0', 'No goal', 'No'], 'medium'),
];

const krasimirBalakov: Question[] = [
  pq('krasimir-balakov-wcp-1', 1994, 'How many World Cup matches did Krasimir Balakov play at USA 1994?', ['5', '6', '7', '4'], 'C', ['Through semi-finals', 'Seven', '7'], 'hard'),
  pq('krasimir-balakov-wcp-2', 1994, 'Did Balakov score against Mexico in Bulgaria\'s opening 3–0 win at the 1994 World Cup?', ['Yes', 'No', 'Own goal', 'Two goals'], 'B', ['Stoichkov among scorers', 'No goal', 'No'], 'medium'),
  pq('krasimir-balakov-wcp-3', 1994, 'Against Greece in the group stage, did Balakov start in Bulgaria\'s 4–0 win?', ['Yes', 'No', 'Sent off', 'Injured'], 'A', ['Chicago', 'Midfield', 'Yes'], 'medium'),
  pq('krasimir-balakov-wcp-4', 1994, 'In the 1994 World Cup semi-final, did Krasimir Balakov start against Italy?', ['Yes', 'No', 'Only as a late sub', 'Suspended'], 'A', ['East Rutherford exit', 'Box-to-box minutes', 'Yes'], 'medium'),
];

const dimitarBerbatov: Question[] = [
  pq('dimitar-berbatov-wcp-1', 2002, 'How many FIFA World Cup finals tournaments did Dimitar Berbatov appear in as a player?', ['0', '1', '2', '3'], 'A', ['Bulgaria did not qualify in his senior years', 'No finals caps', '0'], 'easy'),
  pq('dimitar-berbatov-wcp-2', 2002, 'Berbatov made his senior Bulgaria debut in 1999 — could he have played at the 1998 World Cup?', ['Yes — he was in the squad', 'No — debut after France 98', 'Yes — unused sub', 'Yes — youth only'], 'B', ['First cap November 1999', 'After France', 'No'], 'medium'),
  pq('dimitar-berbatov-wcp-3', 1994, 'Bulgaria\'s semi-final run at USA \'94 happened when Berbatov was still a youth player — was he part of that World Cup squad?', ['Yes', 'No', 'Only as travelling reserve', 'Coach'], 'B', ['Not yet capped', 'No'], 'easy'),
];

export const wcPerformanceBatch2BelgiumBrazilBulgaria: Record<string, Question[]> = {
  'kevin-de-bruyne': kevinDeBruyne,
  'eden-hazard': edenHazard,
  'thibaut-courtois': thibautCourtois,


  'hristo-stoichkov': hristoStoichkov,
  'krasimir-balakov': krasimirBalakov,
  'dimitar-berbatov': dimitarBerbatov,
};

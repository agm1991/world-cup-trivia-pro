/**
 * Match-log style prompts for Select-a-Legend players who had &lt;3 usable pool questions
 * after `applyMatchLogPolicyToPool` (Denmark trio, Ecuador trio).
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

const michaelLaudrup: Question[] = [
  pq(
    'michael-laudrup-wcp-1',
    1998,
    'In the 1998 World Cup, which team did Denmark beat 4–1 in the round of 16?',
    ['Nigeria', 'Brazil', 'France', 'Saudi Arabia'],
    'A',
    ['Saint-Denis', 'Knockout opener', 'Nigeria'],
    'easy',
  ),
  pq(
    'michael-laudrup-wcp-2',
    1998,
    'In the 1998 World Cup quarter-finals, which team eliminated Denmark after a 3–2 win?',
    ['Brazil', 'France', 'Netherlands', 'Italy'],
    'A',
    ['Michael Laudrup scored for Denmark', 'Rivaldo among Brazil scorers', 'Brazil'],
    'medium',
  ),
  pq(
    'michael-laudrup-wcp-3',
    1998,
    'In the 1998 World Cup, did Michael Laudrup score against Brazil in the quarter-finals?',
    ['Yes', 'No', 'Only an own goal', 'Only in a shootout'],
    'A',
    ['Denmark lost 3–2', 'Laudrup on scoresheet', 'Yes'],
    'medium',
  ),
  pq(
    'michael-laudrup-wcp-4',
    1998,
    'In the 1998 World Cup group stage, which team did Denmark beat 1–0 thanks to a Peter Møller goal?',
    ['Saudi Arabia', 'France', 'South Africa', 'Paraguay'],
    'A',
    ['Opening match', 'Clean sheet', 'Saudi Arabia'],
    'hard',
  ),
];

const peterSchmeichel: Question[] = [
  pq(
    'peter-schmeichel-wcp-1',
    1998,
    'In the 1998 World Cup, did Peter Schmeichel keep a clean sheet in Denmark\'s 1–0 group win over Saudi Arabia?',
    ['Yes', 'No', 'Only after extra time', 'Match abandoned'],
    'A',
    ['Lens', 'Møller goal', 'Yes'],
    'easy',
  ),
  pq(
    'peter-schmeichel-wcp-2',
    1998,
    'In the 1998 World Cup round of 16, how many goals did Denmark concede in their 4–1 win over Nigeria?',
    ['0', '1', '2', '3'],
    'B',
    ['Schmeichel in goal', 'One concession', '1'],
    'medium',
  ),
  pq(
    'peter-schmeichel-wcp-3',
    1998,
    'In the 1998 World Cup quarter-finals, Denmark lost 3–2 to Brazil. How many goals did Schmeichel concede in that match?',
    ['1', '2', '3', '4'],
    'C',
    ['Nantes', 'Rivaldo brace among scorers', '3'],
    'medium',
  ),
  pq(
    'peter-schmeichel-wcp-4',
    1998,
    'In the 1998 World Cup quarter-finals, which team knocked Denmark out of the tournament?',
    ['Brazil', 'France', 'Netherlands', 'Argentina'],
    'A',
    ['Nantes', '3–2 loss', 'Brazil'],
    'easy',
  ),
];

const christianEriksen: Question[] = [
  pq(
    'christian-eriksen-wcp-1',
    2018,
    'In the 2018 World Cup group stage, which team did Christian Eriksen score against in a 1–1 draw?',
    ['Australia', 'France', 'Peru', 'Croatia'],
    'A',
    ['Samara', 'Fine strike', 'Australia'],
    'easy',
  ),
  pq(
    'christian-eriksen-wcp-2',
    2018,
    'In the 2018 World Cup round of 16, which team knocked Denmark out on penalties?',
    ['Croatia', 'Russia', 'Sweden', 'England'],
    'A',
    ['Nizhny Novgorod', '1–1 after extra time', 'Croatia'],
    'medium',
  ),
  pq(
    'christian-eriksen-wcp-3',
    2010,
    'In the 2010 World Cup, which host nation beat Denmark 2–0 in the group stage while Eriksen was in the squad?',
    ['Netherlands', 'Brazil', 'Spain', 'South Africa'],
    'A',
    ['Johannesburg', 'Group E', 'Netherlands'],
    'medium',
  ),
  pq(
    'christian-eriksen-wcp-4',
    2022,
    'In the 2022 World Cup, did Christian Eriksen score in Denmark\'s opening 0–0 draw with Tunisia?',
    ['Yes', 'No', 'Only from a penalty rebound', 'Own goal'],
    'B',
    ['Education City Stadium', 'Goalless', 'No'],
    'hard',
  ),
];

const ennerValencia: Question[] = [
  pq(
    'enner-valencia-wcp-1',
    2014,
    'In the 2014 World Cup group stage, how many goals did Enner Valencia score in total?',
    ['1', '2', '3', '4'],
    'C',
    ['Shared early Golden Boot pace', 'Three goals', '3'],
    'easy',
  ),
  pq(
    'enner-valencia-wcp-2',
    2014,
    'In the 2014 World Cup, against which team did Enner Valencia score twice in Ecuador\'s 2–1 win?',
    ['Switzerland', 'Honduras', 'France', 'Argentina'],
    'B',
    ['Curitiba brace', 'Catrachos', 'Honduras'],
    'medium',
  ),
  pq(
    'enner-valencia-wcp-3',
    2022,
    'In the 2022 World Cup opening match, how many goals did Enner Valencia score against host nation Qatar?',
    ['0', '1', '2', '3'],
    'C',
    ['Al Bayt Stadium', 'Brace', '2'],
    'easy',
  ),
  pq(
    'enner-valencia-wcp-4',
    2022,
    'In the 2022 World Cup group stage, against which team did Enner Valencia score in a 1–1 draw?',
    ['Senegal', 'Netherlands', 'Qatar', 'England'],
    'B',
    ['Khalifa International equaliser', 'Oranje', 'Netherlands'],
    'medium',
  ),
];

const antonioValencia: Question[] = [
  pq(
    'antonio-valencia-wcp-1',
    2006,
    'In the 2006 World Cup, which European host nation faced Ecuador (with Antonio Valencia in the squad) in the group stage?',
    ['Germany', 'France', 'England', 'Poland'],
    'A',
    ['Berlin 3–0 loss', 'Hosts', 'Germany'],
    'easy',
  ),
  pq(
    'antonio-valencia-wcp-2',
    2006,
    'In the 2006 World Cup, which European opponent did Ecuador beat 2–0 in their opening match with goals from Carlos Tenorio and Agustín Delgado?',
    ['Poland', 'Germany', 'Costa Rica', 'Sweden'],
    'A',
    ['Gelsenkirchen', 'Group A', 'Poland'],
    'medium',
  ),
  pq(
    'antonio-valencia-wcp-3',
    2014,
    'In the 2014 World Cup, which European opponent did Ecuador face in the group stage while Antonio Valencia captained the side?',
    ['Switzerland', 'France', 'Germany', 'Italy'],
    'B',
    ['Curitiba opener', 'Les Bleus later', 'Switzerland'],
    'medium',
  ),
  pq(
    'antonio-valencia-wcp-4',
    2014,
    'In the 2014 World Cup, against which African nation did Ecuador win 2–1 in the group stage?',
    ['Honduras', 'Algeria', 'Nigeria', 'Ghana'],
    'A',
    ['Enner Valencia brace', 'Curitiba', 'Honduras'],
    'easy',
  ),
];

const agustinDelgado: Question[] = [
  pq(
    'agustin-delgado-wcp-1',
    2002,
    'In the 2002 World Cup, against which team did Agustín Delgado score Ecuador\'s first-ever FIFA World Cup goal?',
    ['Italy', 'Mexico', 'Croatia', 'China PR'],
    'B',
    ['2–1 loss', 'Historic strike', 'Mexico'],
    'medium',
  ),
  pq(
    'agustin-delgado-wcp-2',
    2006,
    'In the 2006 World Cup, against which CONCACAF opponent did Agustín Delgado score in Ecuador\'s 3–0 win?',
    ['Costa Rica', 'United States', 'Trinidad and Tobago', 'Mexico'],
    'A',
    ['Hamburg', 'Group A', 'Costa Rica'],
    'easy',
  ),
  pq(
    'agustin-delgado-wcp-3',
    2006,
    'In the 2006 World Cup, which co-host did Ecuador (with Delgado in the squad) lose 3–0 to in Berlin?',
    ['Germany', 'South Korea', 'Japan', 'France'],
    'A',
    ['Hosts', 'Miroslav Klose brace', 'Germany'],
    'medium',
  ),
  pq(
    'agustin-delgado-wcp-4',
    2002,
    'In the 2002 World Cup, did Agustín Delgado score against Italy in Ecuador\'s 2–0 opening loss?',
    ['Yes', 'No', 'Only a penalty', 'Own goal'],
    'B',
    ['Vieri double', 'No goal for Delgado', 'No'],
    'hard',
  ),
];

export const wcPerformanceBatch4DenmarkEcuadorThinLegends: Record<string, Question[]> = {
  'michael-laudrup': michaelLaudrup,
  'peter-schmeichel': peterSchmeichel,
  'christian-eriksen': christianEriksen,
  'enner-valencia': ennerValencia,
  'antonio-valencia': antonioValencia,
  'agustin-delgado': agustinDelgado,
};

/**
 * Match-log style prompts for thin Select-a-Legend pools: Switzerland only (batch 6).
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

const xherdanShaqiri: Question[] = [
  pq(
    'xherdan-shaqiri-wcp-1',
    2014,
    'In the 2014 World Cup, did Xherdan Shaqiri score a hat-trick against Honduras?',
    ['Yes', 'No', 'One goal', 'Own goal'],
    'A',
    ['Manaus', '3–0 win', 'Yes'],
    'easy',
  ),
  pq(
    'xherdan-shaqiri-wcp-2',
    2018,
    'In the 2018 World Cup, did Shaqiri score a late winner against Serbia?',
    ['Yes', 'No', 'Only a penalty in a shootout', '2–2 draw'],
    'A',
    ['Kaliningrad', 'Stoppage-time breakaway', 'Yes'],
    'medium',
  ),
  pq(
    'xherdan-shaqiri-wcp-3',
    2014,
    'In the 2014 World Cup, did Switzerland lose 1–0 to Argentina in the Round of 16?',
    ['Yes', 'No', 'Switzerland won', '0–0 (no extra time)'],
    'A',
    ['Di María extra-time winner', 'São Paulo', 'Yes'],
    'medium',
  ),
  pq(
    'xherdan-shaqiri-wcp-4',
    2022,
    'In the 2022 World Cup, did Shaqiri score in Switzerland\'s 3–2 group win over Serbia?',
    ['Yes', 'No', 'Only an assist', 'Sent off before'],
    'A',
    ['Decider for last 16', 'Stadium 974', 'Yes'],
    'easy',
  ),
];

const yannSommer: Question[] = [
  pq(
    'yann-sommer-wcp-1',
    2018,
    'In the 2018 World Cup, did Switzerland reach the Round of 16?',
    ['Yes', 'No', 'Quarter-finals', 'Group stage only'],
    'A',
    ['Russia', 'Lost to Sweden', 'Yes'],
    'easy',
  ),
  pq(
    'yann-sommer-wcp-2',
    2018,
    'In the 2018 World Cup, did Switzerland beat Serbia 2–1 in the group stage?',
    ['Yes', 'No', 'Serbia won', '0–0'],
    'A',
    ['Xhaka and Shaqiri scored', 'Kaliningrad', 'Yes'],
    'medium',
  ),
  pq(
    'yann-sommer-wcp-3',
    2022,
    'In the 2022 World Cup, did Switzerland qualify from their group?',
    ['Yes', 'No', 'They were hosts', 'Disqualified'],
    'A',
    ['Qatar', 'Beat Serbia in decider', 'Yes'],
    'easy',
  ),
  pq(
    'yann-sommer-wcp-4',
    2014,
    'In the 2014 World Cup, did Switzerland reach the Round of 16?',
    ['Yes', 'No', 'Quarter-finals', 'They did not qualify'],
    'A',
    ['Brazil', 'Lost to Argentina', 'Yes'],
    'medium',
  ),
];

const granitXhaka: Question[] = [
  pq(
    'granit-xhaka-wcp-1',
    2018,
    'In the 2018 World Cup, did Granit Xhaka score in Switzerland\'s 2–1 win over Serbia?',
    ['Yes', 'No', 'Own goal', 'Two goals'],
    'A',
    ['Long-range strike', 'Kaliningrad', 'Yes'],
    'easy',
  ),
  pq(
    'granit-xhaka-wcp-2',
    2014,
    'In the 2014 World Cup, did Switzerland lose to Argentina in the Round of 16?',
    ['Yes', 'No', 'Won on penalties', 'Match abandoned'],
    'A',
    ['Extra time', 'São Paulo', 'Yes'],
    'medium',
  ),
  pq(
    'granit-xhaka-wcp-3',
    2022,
    'In the 2022 World Cup, did Switzerland beat Serbia 3–2 in the group stage?',
    ['Yes', 'No', 'Draw', 'Serbia won'],
    'A',
    ['High drama', 'Doha', 'Yes'],
    'medium',
  ),
  pq(
    'granit-xhaka-wcp-4',
    2022,
    'In the 2022 World Cup, did Switzerland beat Cameroon 1–0 in the group stage?',
    ['Yes', 'No', 'Cameroon won', '4–4'],
    'A',
    ['Breel Embolo goal', 'Al Janoub', 'Yes'],
    'medium',
  ),
];

export const wcPerformanceBatch6SwedenSwitzerlandUruguayThin: Record<string, Question[]> = {
  'xherdan-shaqiri': xherdanShaqiri,
  'yann-sommer': yannSommer,
  'granit-xhaka': granitXhaka,
};

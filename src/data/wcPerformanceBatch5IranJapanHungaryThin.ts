/**
 * Match-log style prompts for thin Select-a-Legend pools (Iran trio).
 * Japan legends: `japanLegendsAuthorVerbatimTiles` in merge chain. Hungary / Flórián Albert: `hungaryLegendsAuthorVerbatimTiles`.
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

const mehdiTaremi: Question[] = [
  pq(
    'mehdi-taremi-wcp-1',
    2022,
    'In the 2022 World Cup, how many goals did Mehdi Taremi score in total?',
    ['0', '1', '2', '3'],
    'C',
    ['England match', 'Brace in one game', '2'],
    'easy',
  ),
  pq(
    'mehdi-taremi-wcp-2',
    2022,
    'In the 2022 World Cup, did Mehdi Taremi score twice against England?',
    ['Yes', 'No', 'Only once', 'Only from a penalty'],
    'A',
    ['6–2 loss', 'Both in the second half', 'Yes'],
    'medium',
  ),
  pq(
    'mehdi-taremi-wcp-3',
    2018,
    'In the 2018 World Cup, was Iran in the same first-round group as Portugal and Spain?',
    ['Yes', 'No', 'Only Portugal', 'Only Spain'],
    'A',
    ['Russia', 'Group B', 'Yes'],
    'easy',
  ),
  pq(
    'mehdi-taremi-wcp-4',
    2018,
    'In the 2018 World Cup, did Iran beat Morocco in their opening group match?',
    ['Yes', 'No', 'Draw', 'Match abandoned'],
    'A',
    ['Stoppage-time own goal', '1–0', 'Yes'],
    'medium',
  ),
  pq(
    'mehdi-taremi-wcp-5',
    2022,
    'In the 2022 World Cup, did Mehdi Taremi score against the United States?',
    ['Yes', 'No', 'Only a penalty in a shootout', 'Two goals'],
    'B',
    ['1–0 loss to USA', 'No goal that match', 'No'],
    'medium',
  ),
];

const sardarAzmoun: Question[] = [
  pq(
    'sardar-azmoun-wcp-1',
    2018,
    'In the 2018 World Cup, did Iran defeat Morocco 1–0 in the group stage?',
    ['Yes', 'No', '2–0', '1–1'],
    'A',
    ['Opening win', 'Own goal decided it', 'Yes'],
    'easy',
  ),
  pq(
    'sardar-azmoun-wcp-2',
    2022,
    'In the 2022 World Cup, did Iran beat Wales 2–0?',
    ['Yes', 'No', '1–0', '0–0'],
    'A',
    ['Late goals', 'Cardiff crowd', 'Yes'],
    'easy',
  ),
  pq(
    'sardar-azmoun-wcp-3',
    2022,
    'In the 2022 World Cup, did Sardar Azmoun score against Wales?',
    ['Yes', 'No', 'Penalty only', 'Two goals'],
    'B',
    ['Scorers were teammates in stoppage time', 'No goal', 'No'],
    'medium',
  ),
  pq(
    'sardar-azmoun-wcp-4',
    2018,
    'In the 2018 World Cup, did Iran draw 1–1 with Portugal in the group stage?',
    ['Yes', 'No', 'Iran won', '0–0'],
    'A',
    ['Soares penalty', 'Iran penalty drama', 'Yes'],
    'medium',
  ),
];

const alirezaJahanbakhsh: Question[] = [
  pq(
    'alireza-jahanbakhsh-wcp-1',
    2018,
    'In the 2018 World Cup, did Iran keep a clean sheet in their 1–0 win over Morocco?',
    ['Yes', 'No', 'Only after extra time', '4–3'],
    'A',
    ['Shutout', 'Morocco did not score', 'Yes'],
    'easy',
  ),
  pq(
    'alireza-jahanbakhsh-wcp-2',
    2022,
    'In the 2022 World Cup, did Iran score two stoppage-time goals to beat Wales?',
    ['Yes', 'No', 'Only one goal', 'Only in extra time'],
    'A',
    ['Late drama', '2–0 final', 'Yes'],
    'medium',
  ),
  pq(
    'alireza-jahanbakhsh-wcp-3',
    2018,
    'In the 2018 World Cup, did Iran lose 1–0 to Spain in the group stage?',
    ['Yes', 'No', 'Iran won 2–1', '0–0'],
    'A',
    ['Kazan', 'Diego Costa winner', 'Yes'],
    'medium',
  ),
  pq(
    'alireza-jahanbakhsh-wcp-4',
    2022,
    'In the 2022 World Cup, did Iran lose to England?',
    ['Yes', 'No', 'Draw', 'Walkover'],
    'A',
    ['Heavy defeat', '6–2', 'Yes'],
    'easy',
  ),
];

export const wcPerformanceBatch5IranJapanHungaryThin: Record<string, Question[]> = {
  'mehdi-taremi': mehdiTaremi,
  'sardar-azmoun': sardarAzmoun,
  'alireza-jahanbakhsh': alirezaJahanbakhsh,
};

/**
 * World Cup finals — player performance only (goals, assists, cards, minutes, match outcomes involving the player).
 * Batch 3: Cameroon plus Czech Republic WCP stubs. Legacy filename mentions Chile, Colombia & Croatia — Chile, Colombia, and Croatia legends use verbatim author tiles elsewhere. No host-nation or stadium trivia.
 * Adds match-log questions; merges last so IDs stay unique vs authored pools.
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

/** Cameroon */
const rogerMilla: Question[] = [
  pq('roger-milla-wcp-1', 1990, 'At the 1990 World Cup, Roger Milla scored twice in extra time against which opponent in the round of 16?', ['Colombia', 'England', 'Romania', 'Argentina'], 'A', ['Corner-flag celebration', '2–1 win', 'Colombia'], 'easy'),
  pq('roger-milla-wcp-2', 1990, 'How many goals did Milla score at the 1990 World Cup?', ['1', '2', '3', '4'], 'B', ['Both vs Colombia', 'Two', '2'], 'medium'),
  pq('roger-milla-wcp-3', 1994, 'At the 1994 World Cup, Milla became the oldest goalscorer in tournament history against Russia. How old was he (nearest option)?', ['38', '40', '42', '44'], 'C', ['Birth 1952', '42', '42'], 'medium'),
  pq('roger-milla-wcp-4', 1994, 'Cameroon lost 6–1 to Russia at USA \'94. Did Milla score Cameroon\'s goal?', ['Yes', 'No', 'Own goal', 'Two goals'], 'A', ['Late consolation', 'Yes'], 'easy'),
  pq('roger-milla-wcp-5', 1990, 'In the 1990 quarter-final, England beat Cameroon 3–2 after extra time. Did Milla score?', ['Yes', 'No', 'Penalty only', 'Two goals'], 'B', ['Lineker penalties', 'No goal', 'No'], 'medium'),
  pq('roger-milla-wcp-6', 1982, 'At the 1982 World Cup, Cameroon drew 0–0 with Peru in their opener. Did Milla score?', ['Yes', 'No', 'Penalty', 'Two goals'], 'B', ['Goalless', 'No'], 'easy'),
  pq('roger-milla-wcp-7', 1982, 'How many World Cup tournaments did Roger Milla play in as a player?', ['1', '2', '3', '4'], 'C', ['1982, 1990, 1994', 'Three', '3'], 'easy'),
];

const samuelEtoo: Question[] = [
  pq('samuel-etoo-wcp-1', 2002, 'At the 2002 World Cup, Eto\'o scored in Cameroon\'s 2–0 win over which team?', ['Saudi Arabia', 'Ireland', 'Germany', 'Brazil'], 'A', ['Group E', 'Saudi Arabia'], 'easy'),
  pq('samuel-etoo-wcp-2', 2010, 'At the 2010 World Cup, Eto\'o scored Cameroon\'s only goal of the tournament — from what type of finish?', ['Open play header', 'Penalty kick', 'Direct free kick', 'Corner routine'], 'B', ['Against Denmark', 'Penalty', 'Penalty'], 'medium'),
  pq('samuel-etoo-wcp-3', 2014, 'How many goals did Eto\'o score at the 2014 World Cup?', ['0', '1', '2', '3'], 'A', ['Assisted vs Brazil', 'No goal', '0'], 'medium'),
  pq('samuel-etoo-wcp-4', 2002, 'In Cameroon\'s 1–1 draw with Ireland at the 2002 World Cup, did Eto\'o score?', ['Yes', 'No', 'Own goal', 'Penalty'], 'B', ['Mboma scored for Cameroon', 'No'], 'medium'),
  pq('samuel-etoo-wcp-6', 2014, 'How many FIFA World Cup finals goals did Samuel Eto\'o score in his entire career?', ['1', '2', '3', '4'], 'B', ['2002 Saudi, 2010 pen', 'Two', '2'], 'easy'),
];

/** Czech Republic */
const pavelNedved: Question[] = [
  pq('pavel-nedved-wcp-1', 2006, 'At the 2006 World Cup, did Nedvěd score in the 3–0 opening win over the United States?', ['Yes', 'No', 'Penalty', 'Two goals'], 'B', ['Rosický brace among scorers', 'No'], 'medium'),
  pq('pavel-nedved-wcp-2', 2006, 'Against Ghana at the 2006 World Cup, Czech Republic lost 2–0. Did Nedvěd complete the full 90 minutes?', ['Yes', 'No', 'Sent off', 'Subbed at half-time'], 'A', ['Played full match', 'Yes'], 'medium'),
  pq('pavel-nedved-wcp-3', 2006, 'How many World Cup matches did Nedvěd start at Germany 2006?', ['1', '2', '3', '4'], 'C', ['USA, Ghana, Italy', 'Three', '3'], 'medium'),
  pq('pavel-nedved-wcp-4', 2006, 'In the final group game vs Italy, Czech Republic lost 2–0 and went out. Did Nedvěd play the full match?', ['Yes', 'No', 'Subbed injured', 'Sent off early'], 'C', ['Knee issue', 'Subbed injured'], 'hard'),
];

const petrCech: Question[] = [
  pq('petr-cech-wcp-1', 2006, 'At the 2006 World Cup, how many goals did Čech concede against the United States?', ['0', '1', '2', '3'], 'A', ['3–0 Czech win', 'Clean sheet', '0'], 'easy'),
  pq('petr-cech-wcp-2', 2006, 'Against Ghana at the 2006 World Cup, how many goals did Čech concede?', ['0', '1', '2', '3'], 'C', ['Muntari and Gyan', 'Two', '2'], 'easy'),
  pq('petr-cech-wcp-3', 2006, 'Against Italy in 2006, did Čech concede from the penalty spot?', ['Yes', 'No', 'Penalty missed', 'Two penalties'], 'A', ['Totti converted', 'Yes'], 'medium'),
  pq('petr-cech-wcp-4', 2006, 'How many World Cup matches did Čech play in total at Germany 2006?', ['1', '2', '3', '4'], 'C', ['Every group game', '3'], 'easy'),
];

const tomasRosicky: Question[] = [
  pq('tomas-rosicky-wcp-1', 2006, 'Against the United States at the 2006 World Cup, how many goals did Rosický score?', ['0', '1', '2', '3'], 'C', ['Long-range strikes', 'Two', '2'], 'easy'),
  pq('tomas-rosicky-wcp-2', 2006, 'Did Rosický score against Ghana at the 2006 World Cup?', ['Yes', 'No', 'Own goal', 'Penalty'], 'B', ['2–0 Ghana win', 'No'], 'easy'),
  pq('tomas-rosicky-wcp-3', 2006, 'Against Italy at the 2006 World Cup, did Rosický start the match?', ['Yes', 'No', 'Only as sub', 'Suspended'], 'A', ['Must-win game', 'Yes'], 'medium'),
  pq('tomas-rosicky-wcp-4', 2006, 'How many total World Cup goals did Rosický score in his career?', ['0', '1', '2', '3'], 'C', ['Both vs USA 2006', '2'], 'medium'),
];

export const wcPerformanceBatch3CameroonChileColombiaCroatiaCzechRepublic: Record<string, Question[]> = {
  'roger-milla': rogerMilla,
  'samuel-etoo': samuelEtoo,
  'pavel-nedved': pavelNedved,
  'petr-cech': petrCech,
  'tomas-rosicky': tomasRosicky,
};

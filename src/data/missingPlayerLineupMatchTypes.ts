/**
 * Shared types for Missing Player pitch mode lineup definitions.
 */

export interface MissingPlayerLineupSlot {
  key: string;
  displayName: string;
  x: number;
  y: number;
}

export interface MissingPlayerLineupMatchDef {
  id: string;
  year: number;
  /** e.g. Round of 16, Quarter-Final, Semi-Final, Final, Group Stage */
  stage: string;
  team1: string;
  team2: string;
  focusTeam: string;
  /** Lowercase keys matching two or three slots (levels 15–18: two; 19–21: three) */
  targetPlayers: [string, string] | [string, string, string];
  slots: MissingPlayerLineupSlot[];
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  hint1: string;
  hint2: string;
  hint3: string;
}

/** Same shape as LineupQuestion in MissingPlayerGame.tsx */
export interface MissingPlayerLineupGameQuestion {
  id: number;
  match: string;
  year: number;
  team: string;
  teamFlag: string;
  team1?: string;
  team2?: string;
  team1Flag?: string;
  team2Flag?: string;
  positions: { name: string; flag: string; x: number; y: number }[];
  missingIndex: number;
  missingIndex2: number;
  missingIndex3?: number;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  hint1: string;
  hint2: string;
  hint3: string;
}

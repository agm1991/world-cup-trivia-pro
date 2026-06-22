export const PREDICTOR_TACTICS = ['Attacking', 'Defensive', 'Possession'] as const;
export type Tactic = (typeof PREDICTOR_TACTICS)[number];

export type SquadPayload = {
  starting11: string[];
  subs: string[];
  subsNations: string[];
  formation: string;
  tactic: Tactic;
  worldXiNations: string[];
};

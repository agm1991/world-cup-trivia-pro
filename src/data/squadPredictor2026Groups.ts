/** 48 qualified nations — Groups A–L (common English spellings / FIFA-style names). */
export const SQUAD_PREDICTOR_GROUPS: { id: string; teams: readonly string[] }[] = [
  { id: 'A', teams: ['Mexico', 'South Africa', 'South Korea', 'Czechia'] },
  { id: 'B', teams: ['Canada', 'Bosnia', 'Qatar', 'Switzerland'] },
  { id: 'C', teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'] },
  { id: 'D', teams: ['USA', 'Australia', 'Paraguay', 'Turkey'] },
  { id: 'E', teams: ['Germany', 'Curaçao', 'Côte d\'Ivoire', 'Ecuador'] },
  { id: 'F', teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'] },
  { id: 'G', teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'] },
  { id: 'H', teams: ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'] },
  { id: 'I', teams: ['France', 'Norway', 'Senegal', 'Iraq'] },
  { id: 'J', teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'] },
  { id: 'K', teams: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'] },
  { id: 'L', teams: ['England', 'Croatia', 'Ghana', 'Panama'] },
];

/** Round-robin pair indices (each group has 4 teams → 6 matches). */
export const SQUAD_PREDICTOR_GROUP_MATCH_PAIRS: readonly [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

export const SQUAD_PREDICTOR_ALL_NATIONS: readonly string[] = SQUAD_PREDICTOR_GROUPS.flatMap((g) => [...g.teams]);

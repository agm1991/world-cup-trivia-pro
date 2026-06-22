/** Same four buckets as `SquadPosition` in mock players (avoid circular imports). */
export type HintSquadPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

/**
 * Transfermarkt-style role codes → one of four squad buckets.
 * LW/RW/LF/RF (and typical striker codes) → forward; CM/DM/AMC → mid.
 */
export type FootballRoleCode =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'LWB'
  | 'RWB'
  | 'DM'
  | 'DMC'
  | 'CM'
  | 'AMC'
  | 'LW'
  | 'RW'
  | 'LF'
  | 'RF'
  | 'CF'
  | 'ST'
  | 'SS';

const FOOTBALL_ROLE_TO_SQUAD: Record<FootballRoleCode, HintSquadPosition> = {
  GK: 'GK',
  CB: 'DEF',
  LB: 'DEF',
  RB: 'DEF',
  LWB: 'DEF',
  RWB: 'DEF',
  DM: 'MID',
  DMC: 'MID',
  CM: 'MID',
  AMC: 'MID',
  LW: 'FWD',
  RW: 'FWD',
  LF: 'FWD',
  RF: 'FWD',
  CF: 'FWD',
  ST: 'FWD',
  SS: 'FWD',
};

/**
 * Explicit football roles for pool names (must match `squadPredictorExpandedPlayerLists` spelling).
 * Fact-checked twice against primary positions (club/NT profiles, 2025–26 cycle).
 */
export const PLAYER_FOOTBALL_ROLE_BY_NAME: Partial<Record<string, FootballRoleCode>> = {
  // Brazil — wingers/forwards in FWD; DMs/CM in MID
  'Vinícius Júnior': 'LW',
  'Raphinha': 'RW',
  'Rodrygo': 'RW',
  'Gabriel Martinelli': 'LW',
  'Richarlison': 'ST',
  'Endrick': 'ST',
  'Gabriel Jesus': 'ST',
  'Evanilson': 'ST',
  'Pedro': 'ST',
  'Matheus Cunha': 'CF',
  'Sávio': 'RW',
  'Estêvão': 'RW',
  'Luiz Henrique': 'RW',
  'Casemiro': 'DM',
  'Marquinhos': 'CB',
  'Éder Militão': 'CB',
  'Thiago Silva': 'CB',
  'Gabriel Magalhães': 'CB',
  'Danilo': 'RB',
  'Alex Sandro': 'LB',
  'Guilherme Arana': 'LB',
  'Wendell': 'LB',
  'Yan Couto': 'RB',
  'Bruno Guimarães': 'CM',
  'Lucas Paquetá': 'CM',
  'Douglas Luiz': 'CM',
  'Joelinton': 'CM',
  'Andreas Pereira': 'AMC',
  'André': 'CM',
  'Gérson': 'CM',
  // Spain
  'Pedri': 'CM',
  'Gavi': 'CM',
  'Martín Zubimendi': 'DM',
  'Fabián Ruiz': 'CM',
  'Mikel Merino': 'CM',
  'Dani Olmo': 'AMC',
  'Álex Baena': 'CM',
  'Rodri': 'DM',
  'Gerard Moreno': 'SS',
  'Mikel Oyarzabal': 'LW',
  'Ferran Torres': 'RW',
  'Lamine Yamal': 'RW',
  'Nico Williams': 'LW',
  'Álvaro Morata': 'ST',
  'Joselu': 'ST',
  'Samu Omorodion': 'ST',
  'Yéremy Pino': 'LW',
  // Argentina
  'Lionel Messi': 'RW',
  'Julián Álvarez': 'ST',
  'Lautaro Martínez': 'ST',
  'Ángel Di María': 'RW',
  'Nicolás González': 'LW',
  'Alejandro Garnacho': 'LW',
  'Paulo Dybala': 'SS',
  'Lucas Ocampos': 'LW',
  'Enzo Fernández': 'CM',
  'Alexis Mac Allister': 'CM',
  'Rodrigo De Paul': 'CM',
  'Leandro Paredes': 'DM',
  'Giovani Lo Celso': 'AMC',
  'Exequiel Palacios': 'CM',
  'Thiago Almada': 'AMC',
  // France (sample of wide attackers + mids)
  'Kylian Mbappé': 'LW',
  'Harry Maguire': 'CB',
  'Ousmane Dembélé': 'RW',
  'Kingsley Coman': 'LW',
  'Bradley Barcola': 'LW',
  'Olivier Giroud': 'ST',
  'Marcus Thuram': 'ST',
  'Randal Kolo Muani': 'ST',
  'Aurélien Tchouaméni': 'DM',
  'Eduardo Camavinga': 'CM',
  'Adrien Rabiot': 'CM',
  // Portugal
  'Cristiano Ronaldo': 'ST',
  'Bernardo Silva': 'AMC',
  'Bruno Fernandes': 'AMC',
  // Germany
  'Jamal Musiala': 'AMC',
  'Florian Wirtz': 'AMC',
  'Leroy Sané': 'LW',
  'Serge Gnabry': 'LW',
  // Netherlands
  'Cody Gakpo': 'LW',
  'Memphis Depay': 'CF',
  // England (when using hints on generic pools)
  'Bukayo Saka': 'RW',
  'Phil Foden': 'AMC',
  'Jarrod Bowen': 'RW',
  'Marcus Rashford': 'LW',
  'Anthony Gordon': 'LW',
  'Harry Kane': 'ST',
};

export function squadPositionFromFootballRole(name: string): HintSquadPosition | undefined {
  const code = PLAYER_FOOTBALL_ROLE_BY_NAME[name];
  if (!code) return undefined;
  return FOOTBALL_ROLE_TO_SQUAD[code];
}

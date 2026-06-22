import type { FootballRoleCode } from '@/data/squadPredictorPlayerRoleHints';
import { PLAYER_FOOTBALL_ROLE_BY_NAME } from '@/data/squadPredictorPlayerRoleHints';
import {
  PLAYERS_MEXICO_35,
  PLAYERS_SOUTH_AFRICA_35,
  PLAYERS_SOUTH_KOREA_35,
  PLAYERS_CZECHIA_35,
  PLAYERS_CANADA_35,
  PLAYERS_BOSNIA_35,
  PLAYERS_QATAR_35,
  PLAYERS_SWITZERLAND_35,
  PLAYERS_BRAZIL_35,
  PLAYERS_MOROCCO_35,
  PLAYERS_HAITI_35,
  PLAYERS_SCOTLAND_35,
  PLAYERS_USA_35,
  PLAYERS_AUSTRALIA_35,
  PLAYERS_PARAGUAY_35,
  PLAYERS_TURKEY_35,
  PLAYERS_GERMANY_35,
  PLAYERS_CURACAO_35,
  PLAYERS_COTE_DIVOIRE_35,
  PLAYERS_ECUADOR_35,
  PLAYERS_NETHERLANDS_35,
  PLAYERS_JAPAN_35,
  PLAYERS_SWEDEN_35,
  PLAYERS_TUNISIA_35,
  PLAYERS_BELGIUM_35,
  PLAYERS_EGYPT_35,
  PLAYERS_IRAN_35,
  PLAYERS_NEW_ZEALAND_35,
  PLAYERS_SPAIN_35,
  PLAYERS_CAPE_VERDE_35,
  PLAYERS_SAUDI_ARABIA_35,
  PLAYERS_URUGUAY_35,
  PLAYERS_FRANCE_35,
  PLAYERS_NORWAY_35,
  PLAYERS_SENEGAL_35,
  PLAYERS_IRAQ_35,
  PLAYERS_ARGENTINA_35,
  PLAYERS_ALGERIA_35,
  PLAYERS_AUSTRIA_35,
  PLAYERS_JORDAN_35,
  PLAYERS_PORTUGAL_35,
  PLAYERS_DR_CONGO_35,
  PLAYERS_UZBEKISTAN_35,
  PLAYERS_COLOMBIA_35,
  PLAYERS_CROATIA_35,
  PLAYERS_GHANA_35,
  PLAYERS_PANAMA_35,
} from '@/data/squadPredictorExpandedPlayerLists';

function splitRoles(s: string): FootballRoleCode[] {
  return s.trim().split(/\s+/).filter(Boolean) as FootballRoleCode[];
}

function zip(
  poolLabel: string,
  names: readonly string[],
  roles: readonly FootballRoleCode[],
): Record<string, FootballRoleCode> {
  if (names.length !== roles.length) {
    throw new Error(`${poolLabel}: expected ${names.length} roles, got ${roles.length}`);
  }
  const out: Record<string, FootballRoleCode> = {};
  for (let i = 0; i < names.length; i++) {
    const n = names[i]!;
    const r = roles[i]!;
    out[n] = r;
  }
  return out;
}

const ROLES_MEXICO_35 = splitRoles(`
GK GK GK RB CB CB CB LB LB DM DM AMC
AMC AMC CM CM AMC CM RW LW RW ST ST ST ST ST
`);

const ROLES_SOUTH_AFRICA_35 = splitRoles(`
GK GK GK LB RB CB CB CB CB CB RB RW CB CB DM CM CM CM CM
ST ST RW ST LW LW ST
`);

const ROLES_SOUTH_KOREA_35 = splitRoles(`
GK GK GK RB CB CB CB RB RB CB LB CB LB CB LW CM LW RW AMC CM CM DM RW LW ST ST
`);

const ROLES_CZECHIA_35 = splitRoles(`
GK GK GK RB RB DM CB CB LB LB CB CB
CM CM CM CM CM CM DM AMC CM LW ST ST ST ST
`);

const ROLES_CANADA_35 = splitRoles(`
GK GK GK RB CB RB CB CB CB LB CB CB
CM CM RW CM CM DM LW LW CM ST ST ST ST
`);

const ROLES_BOSNIA_35 = splitRoles(`
GK GK GK LB RB CB CB CB CB CB RB
CM DM CM CM CM CM AMC CM RW RW ST ST ST ST ST
`);

const ROLES_QATAR_35 = splitRoles(`
GK GK GK CB CB CB CB CB LB CB CB CB CM CM CM CM
DM RW RW ST AMC LW ST ST ST ST
`);

const ROLES_SWITZERLAND_35 = splitRoles(`
GK GK GK CB CB LB RB LB CB CB CB CM CM CM DM CM CM CM
RW AMC LW ST LW RW CF ST
`);

const ROLES_BRAZIL_35 = splitRoles(`
GK GK GK CB CB LB RB CB LB LB CB CM
DM CM DM CM CM LW CF LW RW ST RW LW ST RW
`);

const ROLES_MOROCCO_35 = splitRoles(`
GK GK GK RB LB CB CB CB LB RB CB LB DM CM CM
AMC RW CM AMC CM RW ST LW ST LW ST
`);

const ROLES_HAITI_35 = splitRoles(`
GK GK GK RB RB RB CB CB CB CB LB CM CM
DM CM CM CM RW LW RW LW ST ST ST RW ST
`);

const ROLES_SCOTLAND_35 = splitRoles(`
GK GK GK CB CB RB CB CB RB RB LB CB LB CM AMC CM RW AMC
CM CM CM ST ST ST ST ST
`);

const ROLES_USA_35 = splitRoles(`
GK GK GK RB CB LB CB CB RB RB RB CB RB DM AMC CM CM CM AMC ST RW AMC ST ST RW RW
`);

const ROLES_AUSTRALIA_35 = splitRoles(`
GK GK GK LB LB CB CB CB RB LB LW CB LB
CM DM CM CM CM DM RW LW LW ST RW AMC ST
`);

const ROLES_PARAGUAY_35 = splitRoles(`
GK GK GK RB RB CB CB CB CB CB CB CM CM CM CM
DM CM AMC CM LW ST ST ST RW LW ST
`);

const ROLES_TURKEY_35 = splitRoles(`
GK GK GK CB CB LB LB CB RB CB CB RB DM DM CB CM DM AMC
LW AMC ST RW LW LW ST RW
`);

const ROLES_GERMANY_35 = splitRoles(`
GK GK GK CB CB CB CB LB LB CB DM RB
CM RW AMC CM DM AMC LW CM CM AMC CF ST RW ST
`);

const ROLES_CURACAO_35 = splitRoles(`
GK GK GK CB CB LB LB RB CB CB RB
CM CM CM CM AMC RW RW RW LW ST LW ST ST RW AMC
`);

const ROLES_COTE_DIVOIRE_35 = splitRoles(`
GK GK GK CB LB CB RB LB CB CB RB CM
AMC CM CM DM DM LW ST RW ST LW CF RW LW ST
`);

const ROLES_ECUADOR_35 = splitRoles(`
GK GK GK CB CB LB CB CB CB RB RB DM
DM AMC RW AMC CM CM RW LW LW CF ST ST LW ST
`);

const ROLES_NETHERLANDS_35 = splitRoles(`
GK GK GK CB RB LB RB CB CB CB DM CM DM CM
AMC CM AMC AMC CM ST CF LW LW RW LW ST
`);

const ROLES_JAPAN_35 = splitRoles(`
GK GK GK CB CB RB CB RB CB CB LB DM DM
CM CM RW RW RW LW CB AMC LW ST ST ST ST
`);

const ROLES_SWEDEN_35 = splitRoles(`
GK GK GK CB CB LB RB CB CB CB CB CB CB CM DM CM CM CM LW ST RW RW ST ST ST RW
`);

const ROLES_TUNISIA_35 = splitRoles(`
GK GK GK LB CB CB RB CB CB RB RB CB CB AMC AMC DM CM CM
DM CM CM LW LW ST ST ST
`);

const ROLES_BELGIUM_35 = splitRoles(`
GK GK GK RB CB LB CB CB RB RB RB CB
AMC DM CM CM AMC DM AMC LW ST ST RW LW RW LW
`);

const ROLES_EGYPT_35 = splitRoles(`
GK GK GK GK CB RB CB CB CB LB LB LB
CM CM AMC DM CM CM RW LW RW CF LW RW ST AMC
`);

const ROLES_IRAN_35 = splitRoles(`
GK GK GK RB LB CB LB CB CB CB RB LB
DM RW LW AMC DM LW CM CM ST RW ST AMC ST ST
`);

const ROLES_NEW_ZEALAND_35 = splitRoles(`
GK GK GK CB CB LB CB RB RB CB CB CB CM CM CM CM
CM CM CM CM ST LW RW ST ST ST
`);

const ROLES_SPAIN_35 = splitRoles(`
GK GK GK CB LB RB CB RB LB CB RB DM AMC CM CM CM CM DM
RW ST RW RW RW AMC ST LW
`);

const ROLES_CAPE_VERDE_35 = splitRoles(`
GK GK GK CB CB LB CB CB RB LB RB LB
CM CM CM RW CM DM LW RW LW LW ST ST RW ST
`);

const ROLES_SAUDI_ARABIA_35 = splitRoles(`
GK GK GK RB CB CB CB CB LB CB RB LB CB CM LW DM DM CM AMC
ST RW RW LW ST ST ST
`);

const ROLES_URUGUAY_35 = splitRoles(`
GK GK GK RB CB CB CB CB LB LB LB LW AMC CM LW AMC CM RW LW CM DM CM CM ST ST ST
`);

const ROLES_FRANCE_35 = splitRoles(`
GK GK GK LB RB CB LB CB RB CB CB CB
DM CM CM DM CM RW LW AMC RW RW ST LW RW ST
`);

const ROLES_NORWAY_35 = splitRoles(`
GK GK GK CB CB CB LB RB CB CB CB RB CM DM DM
AMC CM CM AMC LW LW RW LW ST ST ST
`);

const ROLES_SENEGAL_35 = splitRoles(`
GK GK GK RW CB CB LB CB CB CB LB DM CM CM CM DM CM CM
LW RW LW LW RW ST ST ST
`);

const ROLES_IRAQ_35 = splitRoles(`
GK GK GK CB CB CB CB CB CB CB CM CB
CB CM CM CM AMC CM RW CM RW LW ST ST ST ST
`);

const ROLES_ARGENTINA_35 = splitRoles(`
GK GK GK LB RB CB CB CB CB RB DM CM
LB AMC CM CM CM ST RW LW AMC RW AMC ST ST
`);

const ROLES_ALGERIA_35 = splitRoles(`
GK GK GK CB LB CB RB LB RB LB CB CB
AMC CM CM AMC AMC DM CM ST LW RW LW CF RW LW
`);

const ROLES_AUSTRIA_35 = splitRoles(`
GK GK GK CB CB CB LB CB LB RB LB CB
CM DM CM CM CM CM CM DM AMC LW ST ST ST
`);

const ROLES_JORDAN_35 = splitRoles(`
GK GK GK CB CB CB CB RB RB CB RB CB
CM CM CM CM CM CM CM RW ST RW ST ST ST ST
`);

const ROLES_PORTUGAL_35 = splitRoles(`
GK GK GK CB RB RB LB RB CB CB CB AMC AMC DM
CM DM CM RW CM ST CF LW LW ST RW RW
`);

const ROLES_DR_CONGO_35 = splitRoles(`
GK GK GK CB LB RB LB CB CB RB CB
RW CM DM LW CM AMC DM LW CM CM RW ST ST LW ST
`);

const ROLES_UZBEKISTAN_35 = splitRoles(`
GK GK GK CB RB CB CB LB CB CB CB RB CB CM CM CM DM RW CM CM AMC ST ST ST CM ST
`);

const ROLES_COLOMBIA_35 = splitRoles(`
GK GK GK LB RB RB CB CB CB LB LB CB DM
AMC DM RW CM AMC AMC DM LW ST ST ST LW RW
`);

const ROLES_CROATIA_35 = splitRoles(`
GK GK GK LB CB CB RB CB CB CB
CM CM CM AMC CM AMC DM CM DM AMC LW ST ST AMC ST ST
`);

const ROLES_GHANA_35 = splitRoles(`
GK GK GK CB CB LB CB CB CB LB RB RB
LW RW CM DM CM LW CM RW CF RW ST LW ST RW
`);

const ROLES_PANAMA_35 = splitRoles(`
GK GK GK LB CB RB CB CB RB CB CB RB CB DM CM RW
AMC CM CM CM CM ST ST LW ST ST
`);

/** Single source of truth: each pool's `roles` must match `players` index-for-index (official 26 each). */
export const EXPANDED_POOLS: { label: string; players: readonly string[]; roles: readonly FootballRoleCode[] }[] = [
  { label: 'Mexico', players: PLAYERS_MEXICO_35, roles: ROLES_MEXICO_35 },
  { label: 'South Africa', players: PLAYERS_SOUTH_AFRICA_35, roles: ROLES_SOUTH_AFRICA_35 },
  { label: 'South Korea', players: PLAYERS_SOUTH_KOREA_35, roles: ROLES_SOUTH_KOREA_35 },
  { label: 'Czechia', players: PLAYERS_CZECHIA_35, roles: ROLES_CZECHIA_35 },
  { label: 'Canada', players: PLAYERS_CANADA_35, roles: ROLES_CANADA_35 },
  { label: 'Bosnia', players: PLAYERS_BOSNIA_35, roles: ROLES_BOSNIA_35 },
  { label: 'Qatar', players: PLAYERS_QATAR_35, roles: ROLES_QATAR_35 },
  { label: 'Switzerland', players: PLAYERS_SWITZERLAND_35, roles: ROLES_SWITZERLAND_35 },
  { label: 'Brazil', players: PLAYERS_BRAZIL_35, roles: ROLES_BRAZIL_35 },
  { label: 'Morocco', players: PLAYERS_MOROCCO_35, roles: ROLES_MOROCCO_35 },
  { label: 'Haiti', players: PLAYERS_HAITI_35, roles: ROLES_HAITI_35 },
  { label: 'Scotland', players: PLAYERS_SCOTLAND_35, roles: ROLES_SCOTLAND_35 },
  { label: 'USA', players: PLAYERS_USA_35, roles: ROLES_USA_35 },
  { label: 'Australia', players: PLAYERS_AUSTRALIA_35, roles: ROLES_AUSTRALIA_35 },
  { label: 'Paraguay', players: PLAYERS_PARAGUAY_35, roles: ROLES_PARAGUAY_35 },
  { label: 'Turkey', players: PLAYERS_TURKEY_35, roles: ROLES_TURKEY_35 },
  { label: 'Germany', players: PLAYERS_GERMANY_35, roles: ROLES_GERMANY_35 },
  { label: 'Curaçao', players: PLAYERS_CURACAO_35, roles: ROLES_CURACAO_35 },
  { label: 'Côte d\'Ivoire', players: PLAYERS_COTE_DIVOIRE_35, roles: ROLES_COTE_DIVOIRE_35 },
  { label: 'Ecuador', players: PLAYERS_ECUADOR_35, roles: ROLES_ECUADOR_35 },
  { label: 'Netherlands', players: PLAYERS_NETHERLANDS_35, roles: ROLES_NETHERLANDS_35 },
  { label: 'Japan', players: PLAYERS_JAPAN_35, roles: ROLES_JAPAN_35 },
  { label: 'Sweden', players: PLAYERS_SWEDEN_35, roles: ROLES_SWEDEN_35 },
  { label: 'Tunisia', players: PLAYERS_TUNISIA_35, roles: ROLES_TUNISIA_35 },
  { label: 'Belgium', players: PLAYERS_BELGIUM_35, roles: ROLES_BELGIUM_35 },
  { label: 'Egypt', players: PLAYERS_EGYPT_35, roles: ROLES_EGYPT_35 },
  { label: 'Iran', players: PLAYERS_IRAN_35, roles: ROLES_IRAN_35 },
  { label: 'New Zealand', players: PLAYERS_NEW_ZEALAND_35, roles: ROLES_NEW_ZEALAND_35 },
  { label: 'Spain', players: PLAYERS_SPAIN_35, roles: ROLES_SPAIN_35 },
  { label: 'Cape Verde', players: PLAYERS_CAPE_VERDE_35, roles: ROLES_CAPE_VERDE_35 },
  { label: 'Saudi Arabia', players: PLAYERS_SAUDI_ARABIA_35, roles: ROLES_SAUDI_ARABIA_35 },
  { label: 'Uruguay', players: PLAYERS_URUGUAY_35, roles: ROLES_URUGUAY_35 },
  { label: 'France', players: PLAYERS_FRANCE_35, roles: ROLES_FRANCE_35 },
  { label: 'Norway', players: PLAYERS_NORWAY_35, roles: ROLES_NORWAY_35 },
  { label: 'Senegal', players: PLAYERS_SENEGAL_35, roles: ROLES_SENEGAL_35 },
  { label: 'Iraq', players: PLAYERS_IRAQ_35, roles: ROLES_IRAQ_35 },
  { label: 'Argentina', players: PLAYERS_ARGENTINA_35, roles: ROLES_ARGENTINA_35 },
  { label: 'Algeria', players: PLAYERS_ALGERIA_35, roles: ROLES_ALGERIA_35 },
  { label: 'Austria', players: PLAYERS_AUSTRIA_35, roles: ROLES_AUSTRIA_35 },
  { label: 'Jordan', players: PLAYERS_JORDAN_35, roles: ROLES_JORDAN_35 },
  { label: 'Portugal', players: PLAYERS_PORTUGAL_35, roles: ROLES_PORTUGAL_35 },
  { label: 'DR Congo', players: PLAYERS_DR_CONGO_35, roles: ROLES_DR_CONGO_35 },
  { label: 'Uzbekistan', players: PLAYERS_UZBEKISTAN_35, roles: ROLES_UZBEKISTAN_35 },
  { label: 'Colombia', players: PLAYERS_COLOMBIA_35, roles: ROLES_COLOMBIA_35 },
  { label: 'Croatia', players: PLAYERS_CROATIA_35, roles: ROLES_CROATIA_35 },
  { label: 'Ghana', players: PLAYERS_GHANA_35, roles: ROLES_GHANA_35 },
  { label: 'Panama', players: PLAYERS_PANAMA_35, roles: ROLES_PANAMA_35 },
];

/** Per qualified nation: name → primary tactical role (avoids collisions on duplicate names across pools). */
export const EXPANDED_TACTICAL_ROLE_BY_NATION: Record<string, Record<string, FootballRoleCode>> =
  Object.fromEntries(EXPANDED_POOLS.map((p) => [p.label, zip(p.label, p.players, p.roles)]));

/**
 * Flat name → role map for expanded pools. If the same full name appears in two pools, the later pool in
 * `EXPANDED_POOLS` wins; prefer `lookupFootballRoleForPlayerName(name, _, nation)` when nation is known.
 */
export const EXPANDED_TACTICAL_ROLE_BY_NAME: Record<string, FootballRoleCode> = Object.assign(
  {},
  ...EXPANDED_POOLS.map((p) => zip(p.label, p.players, p.roles)),
);

export function lookupFootballRoleForPlayerName(
  name: string,
  rosterTactical?: FootballRoleCode,
  nation?: string,
): FootballRoleCode | undefined {
  if (rosterTactical) return rosterTactical;
  if (nation) {
    const byNation = EXPANDED_TACTICAL_ROLE_BY_NATION[nation]?.[name];
    if (byNation) return byNation;
  }
  const curated = PLAYER_FOOTBALL_ROLE_BY_NAME[name];
  if (curated) return curated;
  return EXPANDED_TACTICAL_ROLE_BY_NAME[name];
}

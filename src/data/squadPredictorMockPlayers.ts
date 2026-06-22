import { SQUAD_PREDICTOR_ALL_NATIONS } from '@/data/squadPredictor2026Groups';
import { SQUAD_PREDICTOR_2026_NATION_PLAYERS } from '@/data/squadPredictor2026AwardPool';
import { ENGLAND_2026_ROSTER_ENTRIES } from '@/data/squadPredictorEnglandRoster2026';
import type { FootballRoleCode } from '@/data/squadPredictorPlayerRoleHints';
import { squadPositionFromFootballRole } from '@/data/squadPredictorPlayerRoleHints';
import { lookupFootballRoleForPlayerName } from '@/data/squadPredictorExpandedTacticalRoles';

const FOOTBALL_ROLE_TO_SQUAD: Record<FootballRoleCode, SquadPosition> = {
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

export type SquadPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type MockPlayer = {
  id: string;
  name: string;
  nation: string;
  position: SquadPosition;
  /** When set, primary tactical role for slot filtering (Transfermarkt-style codes). */
  tactical?: FootballRoleCode;
};

/** Line-up order: goalkeepers → defence → midfield → forwards (35 total). */
export const ROSTER35_POSITION_ORDER: readonly SquadPosition[] = [
  ...Array(3).fill('GK'),
  ...Array(10).fill('DEF'),
  ...Array(11).fill('MID'),
  ...Array(11).fill('FWD'),
] as SquadPosition[];

/** @deprecated Use ROSTER35_POSITION_ORDER */
export const ROSTER20_POSITION_ORDER = ROSTER35_POSITION_ORDER;

const GOALKEEPER_NAMES = new Set([
  'Guillermo Ochoa',
  'Ronwen Williams',
  'Kim Seung-gyu',
  'Tomáš Vaclík',
  'Jindřich Staněk',
  'Milan Borjan',
  'Maxime Crépeau',
  'Ibrahim Šehić',
  'Asmir Begović',
  'Saad Al-Sheeb',
  'Yann Sommer',
  'Alisson',
  'Ederson',
  'Bento',
  'Weverton',
  'Yassine Bounou',
  'Johny Placide',
  'Angus Gunn',
  'Matt Turner',
  'Mathew Ryan',
  'Carlos Coronel',
  'Uğurcan Çakır',
  'Altay Bayındır',
  'Manuel Neuer',
  'Eloy Room',
  'Édouard Mendy',
  'Hernán Galíndez',
  'Shūichi Gonda',
  'Robin Olsen',
  'Mouez Hassen',
  'Thibaut Courtois',
  'Mohamed Abou Gabal',
  'Mohamed El Shenawy',
  'Alireza Beiranvand',
  'Amir Abedzadeh',
  'Max Crocombe',
  'Unai Simón',
  'David Raya',
  'Álex Remiro',
  'Joan García',
  'Vozinha',
  'Abdullah Al-Mayouf',
  'Sergio Rochet',
  'Mike Maignan',
  'Ørjan Nyland',
  'Mory Diaw',
  'Jalal Hassan',
  'Emiliano Martínez',
  'Raïs M\'Bolhi',
  'Patrick Pentz',
  'Amer Shafi',
  'Diogo Costa',
  'Utkir Yusupov',
  'Álvaro Montero',
  'Jordan Pickford',
  'Aaron Ramsdale',
  'Nick Pope',
  'Dean Henderson',
  'Dominik Livaković',
  'Richard Ofori',
  'Luis Mejía',
  // Argentina & other pools — reserve keepers (max three GK slots in roster bands)
  'Gerónimo Rulli',
  'Walter Benítez',
  'Franco Armani',
  'Viktor Johansson',
  'Gregor Kobel',
  'Yvon Mvogo',
  'Marvin Keller',
  'Munir Mohamedi',
  'Ahmed Reda Tagnaouti',
  'Mehdi Benabid',
  'Aymen Dahmen',
  'Bechir Ben Saïd',
  'Aymen Mathlouthi',
  'Camilo Vargas',
  'David Ospina',
  'José Luis Chunga',
  'Alexander Domínguez',
  'Carlos Acevedo',
  'Julio González',
  'Luis Malagón',
  'Song Bum-keun',
  'Cho Hyun-woo',
  'Kim Jeong-hoon',
  'Veli Mothwa',
  'Ricardo Goss',
  'Bruce Bvuma',
  'Bart Verbruggen',
  'Justin Bijlow',
  'Mark Flekken',
  'Nick Olij',
  'Matz Sels',
  'Koen Casteels',
  'Arnaud Bodart',
  'Hendrik Van Crombrugge',
  'Alphonse Areola',
  'Marc-André ter Stegen',
  'Lucas Chevalier',
  'Yahia Fofana',
  'Brice Samba',
  'Garissone Innocent',
  'Alfred Gomis',
  'Ethan Horvath',
  'Zion Suzuki',
  'Daiya Maekawa',
  'Keisuke Osako',
  'Raghed Al-Najjar',
  'Meshaal Barsham',
  'Yousef Hassan',
  'Nawaf Al-Aqidi',
  'Mohamed Al-Owais',
  'Ahmed El Shenawy',
  'Ahmed Abdel-Sattar',
  'Ahmed Basil',
  'Mohammed Saleh',
  'Salah Zakaria',
  'Fahad Talib',
  'Payam Niazmand',
  'Badra Ali Sangaré',
  'Pape Sy',
  'Charles Folly',
  'Orlando Mosquera',
  'César Samudio',
  'Javier Burrai',
  'Juan Espínola',
  'Antony Silva',
  'Keven Ramos',
  'Joshua Silva',
  'Zeus de la Paz',
  'Johnder Cadet',
  'Jarzinho Piña',
  'José Sa',
  'José Sá',
  'Rui Patrício',
  'Rui Silva',
  'Oliver Baumann',
  'Alexander Nübel',
  'Nikolas Polster',
  'Egil Selvik',
  'André Hansen',
  'Kristoffer Nordfeldt',
  'Samuel Brolin',
  'Robbie McCrorie',
  'Zander Clark',
  'Tom McGill',
  'Lionel Mpasi',
  'Dimitry Bertaud',
  'Baggio Siadi',
  'Mathieu Epolo',
  'Theo Fayulu',
  'Sebastián Sosa',
  'Santiago Mele',
  'Franco Israel',
  'Santiago Rojas',
  'Ira Eliezer Tape',
  'Márcio Rosa',
  'Raul Roosenburg',
  'Nikola Vasilj',
  'Yazid Abu Layla',
  'Oybek Boymurodov',
  'Botirali Ergashev',
  'Abduvohid Nematov',
  'Alexandre Pierre',
  'Alexandre Oukidja',
  'Anthony Mandréa',
  'Moustapha Zeghba',
  'Joël Kiassumbi',
  'Tom Glover',
  'Joe Gauci',
  'Lawrence Thomas',
  'Alex Paulsen',
  'Oliver Sail',
  'Michael Woud',
  'Liam Kelly',
  'Gabriel Simon',
  'Sean Johnson',
  'Gaga Slonina',
  'Dayne St. Clair',
  'Moisés Ramírez',
  'Alexander Schlager',
  'Matej Kovář',
  'Vítězslav Jaroš',
  'Yazeed Abulaila',
  'Marcos Allen',
]);

/** Move recognised keepers to the front (max three, stable order) for 35-name pools. */
function reorderPool35ForBandLayout(names: readonly string[]): string[] {
  if (names.length !== 35) return [...names];
  const gk: string[] = [];
  const seen = new Set<string>();
  for (const n of names) {
    if (GOALKEEPER_NAMES.has(n) && gk.length < 3 && !seen.has(n)) {
      gk.push(n);
      seen.add(n);
    }
  }
  const rest = names.filter((n) => !seen.has(n));
  return [...gk, ...rest];
}

const ROSTER_CAPS: Record<SquadPosition, number> = { GK: 3, DEF: 10, MID: 11, FWD: 11 };

function tallyPositions(pos: readonly SquadPosition[]) {
  const t: Record<SquadPosition, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const p of pos) t[p] += 1;
  return t;
}

/** Demote extras so counts match `ROSTER_CAPS` (hinted roles can overflow a bucket). */
function rebalanceToCaps(pos: SquadPosition[]): SquadPosition[] {
  const out = [...pos];
  const cap = ROSTER_CAPS;
  for (let iter = 0; iter < 120; iter++) {
    const t = tallyPositions(out);
    if (
      t.GK <= cap.GK &&
      t.DEF <= cap.DEF &&
      t.MID <= cap.MID &&
      t.FWD <= cap.FWD
    ) {
      break;
    }
    let moved = false;
    for (let i = out.length - 1; i >= 0; i--) {
      if (t.FWD > cap.FWD && out[i] === 'FWD') {
        out[i] = 'MID';
        moved = true;
        break;
      }
    }
    if (moved) continue;
    for (let i = out.length - 1; i >= 0; i--) {
      if (t.MID > cap.MID && out[i] === 'MID') {
        out[i] = 'DEF';
        moved = true;
        break;
      }
    }
    if (moved) continue;
    for (let i = out.length - 1; i >= 0; i--) {
      if (t.DEF > cap.DEF && out[i] === 'DEF') {
        out[i] = 'MID';
        moved = true;
        break;
      }
    }
    if (moved) continue;
    for (let i = out.length - 1; i >= 0; i--) {
      if (t.GK > cap.GK && out[i] === 'GK') {
        out[i] = 'DEF';
        break;
      }
    }
  }
  return out;
}

function indexFallback35Band(i: number, name: string): SquadPosition {
  if (i < 3) return GOALKEEPER_NAMES.has(name) ? 'GK' : 'DEF';
  if (i < 13) return 'DEF';
  if (i < 24) return 'MID';
  return 'FWD';
}

function squadPositionFromNationRole(name: string, nation: string): SquadPosition | undefined {
  const role = lookupFootballRoleForPlayerName(name, undefined, nation);
  if (role) return FOOTBALL_ROLE_TO_SQUAD[role];
  const hinted = squadPositionFromFootballRole(name);
  if (hinted) return hinted as SquadPosition;
  return undefined;
}

/**
 * 35-name pools: 3 GK → 10 DEF → 11 MID → 11 FWD, with per-nation tactical roles (LW/RW → FWD, etc.).
 */
function assignPositions35BandLayout(names: readonly string[], nation: string): SquadPosition[] {
  const rough = names.map((name, i) => {
    const hinted = squadPositionFromNationRole(name, nation);
    if (hinted) return hinted;
    return indexFallback35Band(i, name);
  });
  return rebalanceToCaps(rough);
}

/**
 * Legacy: non–35-name pools or uneven lengths — percentile split on outfield order.
 */
function assignPositions(names: readonly string[]): SquadPosition[] {
  const pos: SquadPosition[] = names.map(() => 'MID');
  const outfieldIdx: number[] = [];
  let gkUsed = 0;
  names.forEach((name, i) => {
    if (GOALKEEPER_NAMES.has(name) && gkUsed < 3) {
      pos[i] = 'GK';
      gkUsed += 1;
    } else {
      outfieldIdx.push(i);
    }
  });
  const n = outfieldIdx.length;
  if (n === 0) return pos;
  outfieldIdx.forEach((idx, j) => {
    const t = j / n;
    if (t < 0.42) pos[idx] = 'DEF';
    else if (t < 0.78) pos[idx] = 'MID';
    else pos[idx] = 'FWD';
  });
  return pos;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i)!;
  return Math.abs(h);
}

const FILL_GK = [
  'Alexandre Ribeiro',
  'Marco Lindberg',
  'Diego Ferreira',
  'Samuel Okonkwo',
  'Henrik Dahl',
  'Luca Romano',
  'André Santos',
  'Felix Hartmann',
  'Omar Hassan',
  'Victor Lindqvist',
  'Nicolas Dupont',
  'James Porter',
  'Rui Mendes',
  'Igor Stepanov',
  'Hassan Farouk',
];

const FILL_DEF = [
  'Theo Andersen',
  'Marcus Silva',
  'Julian Kovač',
  'Pablo Herrera',
  'Stefan Nielsen',
  'André Costa',
  'Luis Morales',
  'Niklas Berg',
  'Samuel Mensah',
  'Diego Rojas',
  'Oliver Clarke',
  'Mateo Petrović',
  'Hugo Fernández',
  'Ivan Horvat',
  'Kenji Tanaka',
];

const FILL_MID = [
  'Lucas Ferreira',
  'Marco Lindström',
  'Daniel Mensah',
  'Felix Andersen',
  'Rafael Duarte',
  'Jonas Meyer',
  'Emilio Vargas',
  'Victor Nkosi',
  'Alexandre Dubois',
  'Hugo Martins',
  'Stefan Popescu',
  'Mateo Suárez',
  'Oliver Nyström',
  'Rui Carvalho',
  'Kenji Yamamoto',
];

const FILL_FWD = [
  'Gabriel Santos',
  'Nicolas Ferreira',
  'Diego Ribeiro',
  'Marco Lindqvist',
  'Felix Andersson',
  'Lucas Duarte',
  'Rafael Costa',
  'Jonas Silva',
  'Emilio Herrera',
  'Victor Nunes',
  'Alexandre Mendes',
  'Hugo Rojas',
  'Stefan Berg',
  'Mateo García',
  'Oliver Kovač',
];

const POOLS: Record<SquadPosition, readonly string[]> = {
  GK: FILL_GK,
  DEF: FILL_DEF,
  MID: FILL_MID,
  FWD: FILL_FWD,
};

const CAPS: Record<SquadPosition, number> = { ...ROSTER_CAPS };

function fillSyntheticName(nation: string, pos: SquadPosition, salt: number, used: Set<string>): string {
  const pool = POOLS[pos];
  const h = hashCode(nation) + salt * 17 + pos.charCodeAt(0);
  for (let k = 0; k < 80; k++) {
    const base = pool[(h + k * 7) % pool.length]!;
    const label = `${base} (${nation})`;
    if (!used.has(label)) {
      used.add(label);
      return label;
    }
  }
  const fallback = `${pos} ${salt + 1} (${nation})`;
  used.add(fallback);
  return fallback;
}

/** Official FIFA 23–26 squads: role-based buckets, no synthetic fillers. */
function buildOfficialNationRoster(nation: string, names: readonly string[]): MockPlayer[] {
  const buckets: Record<SquadPosition, MockPlayer[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  for (const name of names) {
    const position = squadPositionFromNationRole(name, nation) ?? 'MID';
    buckets[position].push({
      id: `${nation}-r26-${buckets[position].length}-${name.replace(/\s+/g, '_')}`,
      name,
      nation,
      position,
      tactical: lookupFootballRoleForPlayerName(name, undefined, nation),
    });
  }
  return (['GK', 'DEF', 'MID', 'FWD'] as const).flatMap((pos) => buckets[pos]);
}

/** Legacy 35-band pools (awards fallback) or official 26 — listed goalkeeper → striker. */
function buildNationRoster35(nation: string): MockPlayer[] {
  const raw = SQUAD_PREDICTOR_2026_NATION_PLAYERS[nation] ?? [];
  if (raw.length >= 23 && raw.length <= 26) {
    return buildOfficialNationRoster(nation, raw);
  }

  const baseNames =
    raw.length === 35 ? reorderPool35ForBandLayout(raw) : [...raw];
  const rough = baseNames.length
    ? baseNames.length === 35
      ? assignPositions35BandLayout(baseNames, nation)
      : assignPositions(baseNames)
    : [];
  const buckets: Record<SquadPosition, string[]> = { GK: [], DEF: [], MID: [], FWD: [] };
  baseNames.forEach((name, i) => {
    buckets[rough[i] ?? 'MID'].push(name);
  });

  const used = new Set<string>(baseNames);
  (['GK', 'DEF', 'MID', 'FWD'] as const).forEach((pos) => {
    while (buckets[pos].length < CAPS[pos]) {
      buckets[pos].push(fillSyntheticName(nation, pos, buckets[pos].length, used));
    }
    buckets[pos] = buckets[pos].slice(0, CAPS[pos]);
  });

  const c: Record<SquadPosition, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  const out: MockPlayer[] = [];
  for (let i = 0; i < ROSTER35_POSITION_ORDER.length; i++) {
    const pos = ROSTER35_POSITION_ORDER[i]!;
    const name = buckets[pos][c[pos]++]!;
    out.push({
      id: `${nation}-r35-${i}-${name.replace(/\s+/g, '_')}`,
      name,
      nation,
      position: pos,
      tactical: lookupFootballRoleForPlayerName(name, undefined, nation),
    });
  }
  return out;
}

const cache = new Map<string, MockPlayer[]>();

/** Bump when `ENGLAND_2026_ROSTER_ENTRIES` changes so cached squads refresh. */
const ENGLAND_ROSTER_CACHE_KEY = 'England@5';

/** 35 players per nation (GK → striker order in list). */
export function getPlayersForNation(nation: string): MockPlayer[] {
  if (nation === 'England') {
    if (!cache.has(ENGLAND_ROSTER_CACHE_KEY)) {
      cache.set(
        ENGLAND_ROSTER_CACHE_KEY,
        ENGLAND_2026_ROSTER_ENTRIES.map((p) => ({
          id: p.id,
          name: p.name,
          nation: 'England',
          position: p.position,
          tactical: lookupFootballRoleForPlayerName(p.name, p.role),
        })),
      );
    }
    return cache.get(ENGLAND_ROSTER_CACHE_KEY)!;
  }
  if (!cache.has(nation)) {
    cache.set(nation, buildNationRoster35(nation));
  }
  return cache.get(nation)!;
}

export function findPlayerInNation(name: string, nation: string): MockPlayer | undefined {
  return getPlayersForNation(nation).find((p) => p.name === name);
}

/** Curated pool for World XI — one goalkeeper + one forward per nation. */
export function getWorldXiPool(): MockPlayer[] {
  const pool: MockPlayer[] = [];
  for (const nation of SQUAD_PREDICTOR_ALL_NATIONS) {
    const r = getPlayersForNation(nation);
    const firstGk = r.find((p) => p.position === 'GK');
    const lastFwd = [...r].reverse().find((p) => p.position === 'FWD');
    if (firstGk && lastFwd) {
      pool.push(firstGk, lastFwd);
    } else if (r.length >= 2) {
      pool.push(r[0]!, r[r.length - 1]!);
    } else if (r.length === 1) {
      pool.push(r[0]!);
    }
  }
  return pool;
}

const POS_ORDER: Record<SquadPosition, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

export function sortPlayersByPosition(players: MockPlayer[]): MockPlayer[] {
  return [...players].sort((a, b) => {
    const p = POS_ORDER[a.position] - POS_ORDER[b.position];
    if (p !== 0) return p;
    return a.name.localeCompare(b.name);
  });
}

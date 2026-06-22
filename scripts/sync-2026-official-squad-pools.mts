/**
 * Regenerate 35-player squad pools from FIFA-confirmed 26-man squads (June 2026)
 * plus reserve players from the previous pool. Run: npx tsx scripts/sync-2026-official-squad-pools.mts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FootballRoleCode } from '../src/data/squadPredictorPlayerRoleHints.ts';
import { SQUAD_PREDICTOR_ALL_NATIONS } from '../src/data/squadPredictor2026Groups.ts';
import {
  EXPANDED_TACTICAL_ROLE_BY_NATION,
  lookupFootballRoleForPlayerName,
} from '../src/data/squadPredictorExpandedTacticalRoles.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const WIKI_PATH =
  process.env.WC2026_SQUADS_MD ??
  join(
    process.env.HOME ?? '',
    '.cursor/projects/Users-abelghebremichael-Documents-world-cup-trivia-pro/agent-tools/0863c7cf-896d-48b5-93df-3ed6f7c95401.txt',
  );

const NATION_LABEL: Record<string, string> = {
  Algeria: 'Algeria',
  Argentina: 'Argentina',
  Australia: 'Australia',
  Austria: 'Austria',
  Belgium: 'Belgium',
  'Bosnia & Herzegovina': 'Bosnia',
  Brazil: 'Brazil',
  Canada: 'Canada',
  'Cape Verde': 'Cape Verde',
  Colombia: 'Colombia',
  Croatia: 'Croatia',
  Curaçao: 'Curaçao',
  Czechia: 'Czechia',
  'DR Congo': 'DR Congo',
  Ecuador: 'Ecuador',
  Egypt: 'Egypt',
  France: 'France',
  Germany: 'Germany',
  Ghana: 'Ghana',
  Haiti: 'Haiti',
  Iran: 'Iran',
  Iraq: 'Iraq',
  'Ivory Coast': "Côte d'Ivoire",
  Japan: 'Japan',
  Jordan: 'Jordan',
  Mexico: 'Mexico',
  Morocco: 'Morocco',
  Netherlands: 'Netherlands',
  'New Zealand': 'New Zealand',
  Norway: 'Norway',
  Panama: 'Panama',
  Paraguay: 'Paraguay',
  Portugal: 'Portugal',
  Qatar: 'Qatar',
  'Saudi Arabia': 'Saudi Arabia',
  Scotland: 'Scotland',
  Senegal: 'Senegal',
  'South Africa': 'South Africa',
  'South Korea': 'South Korea',
  Spain: 'Spain',
  Sweden: 'Sweden',
  Switzerland: 'Switzerland',
  Tunisia: 'Tunisia',
  Türkiye: 'Turkey',
  'United States': 'USA',
  Uruguay: 'Uruguay',
  Uzbekistan: 'Uzbekistan',
};

type Bucket = 'GK' | 'DEF' | 'MID' | 'FWD';

const BUCKET_ORDER: Bucket[] = ['GK', 'DEF', 'MID', 'FWD'];
const FIFA_SQUAD_MAX = 26;

const ROLE_TO_BUCKET: Record<FootballRoleCode, Bucket> = {
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

const DEFAULT_CYCLE: Record<Bucket, FootballRoleCode[]> = {
  GK: ['GK', 'GK', 'GK'],
  DEF: ['CB', 'RB', 'LB', 'CB', 'CB', 'RB', 'LB', 'RB', 'CB', 'CB'],
  MID: ['CM', 'DM', 'CM', 'AMC', 'CM', 'DM', 'CM', 'AMC', 'CM', 'DM', 'CM'],
  FWD: ['ST', 'LW', 'RW', 'ST', 'CF', 'RW', 'LW', 'ST', 'RW', 'ST', 'RW'],
};

function parsePlayersFromLine(line: string): string[] {
  const m = line.match(/^(?:Goalkeepers|Defenders|Midfielders|Forwards|Attackers):\s*(.+)$/i);
  if (!m) return [];
  const names: string[] = [];
  const re = /([^,]+?)\s*\([^)]+\)/g;
  let hit: RegExpExecArray | null;
  while ((hit = re.exec(m[1]!)) !== null) {
    names.push(hit[1]!.trim().replace(/\+$/, ''));
  }
  return names;
}

function parseWikiSquads(md: string): Map<string, { GK: string[]; DEF: string[]; MID: string[]; FWD: string[] }> {
  const out = new Map<string, { GK: string[]; DEF: string[]; MID: string[]; FWD: string[] }>();
  const sections = md.split(/^## /m).slice(1);
  for (const section of sections) {
    const title = section.split('\n')[0]?.trim() ?? '';
    const label = NATION_LABEL[title];
    if (!label || title === 'FIFA World Cup 2026 Squads: Everything You Need to Know') continue;

    const squad = { GK: [] as string[], DEF: [] as string[], MID: [] as string[], FWD: [] as string[] };
    for (const line of section.split('\n')) {
      if (/^Goalkeepers:/i.test(line)) squad.GK.push(...parsePlayersFromLine(line));
      else if (/^Defenders:/i.test(line)) squad.DEF.push(...parsePlayersFromLine(line));
      else if (/^Midfielders:/i.test(line)) squad.MID.push(...parsePlayersFromLine(line));
      else if (/^(?:Forwards|Attackers):/i.test(line)) squad.FWD.push(...parsePlayersFromLine(line));
    }

    // FIFA allows max 3 GKs in 26 — trim extras (e.g. Colombia, Egypt lists)
    squad.GK = squad.GK.slice(0, 3);

    const total = squad.GK.length + squad.DEF.length + squad.MID.length + squad.FWD.length;
    if (total < 20 || total > 28) {
      console.warn(`WARN ${label}: parsed ${total} official players`);
    }
    out.set(label, squad);
  }
  return out;
}

function roleFor(
  name: string,
  nation: string,
  bucket: Bucket,
  indexInBucket: number,
  oldRoles: Record<string, FootballRoleCode>,
): FootballRoleCode {
  const hinted =
    lookupFootballRoleForPlayerName(name, oldRoles[name], nation) ??
    lookupFootballRoleForPlayerName(name, undefined, nation);
  if (hinted && ROLE_TO_BUCKET[hinted] === bucket) return hinted;
  if (hinted && bucket === 'DEF' && ROLE_TO_BUCKET[hinted] === 'DEF') return hinted;
  if (hinted && bucket === 'MID' && ROLE_TO_BUCKET[hinted] === 'MID') return hinted;
  if (hinted && bucket === 'FWD' && ROLE_TO_BUCKET[hinted] === 'FWD') return hinted;
  return DEFAULT_CYCLE[bucket][indexInBucket % DEFAULT_CYCLE[bucket].length]!;
}

/** Trim parsed wiki lists to FIFA's 26-man cap (max 3 GKs). */
function trimToFifa26(official: { GK: string[]; DEF: string[]; MID: string[]; FWD: string[] }) {
  const gk = official.GK.slice(0, 3);
  let remaining = FIFA_SQUAD_MAX - gk.length;
  const def = official.DEF.slice(0, Math.min(official.DEF.length, remaining));
  remaining -= def.length;
  const mid = official.MID.slice(0, Math.min(official.MID.length, remaining));
  remaining -= mid.length;
  const fwd = official.FWD.slice(0, Math.min(official.FWD.length, remaining));
  return { GK: gk, DEF: def, MID: mid, FWD: fwd };
}

/** Official FIFA squad only — no reserve alternates. */
function buildPoolOfficial26(
  nation: string,
  official: { GK: string[]; DEF: string[]; MID: string[]; FWD: string[] },
  roleHints: Record<string, FootballRoleCode>,
): { names: string[]; roles: FootballRoleCode[] } {
  const trimmed = trimToFifa26(official);
  const names: string[] = [];
  const roles: FootballRoleCode[] = [];
  for (const b of BUCKET_ORDER) {
    trimmed[b].forEach((name, i) => {
      names.push(name);
      roles.push(roleFor(name, nation, b, i, roleHints));
    });
  }
  return { names, roles };
}

function constKey(nation: string): string {
  return nation
    .toUpperCase()
    .replace(/'/g, '')
    .replace(/Ô/g, 'O')
    .replace(/É/g, 'E')
    .replace(/Ç/g, 'C')
    .replace(/Ö/g, 'O')
    .replace(/Ü/g, 'U')
    .replace(/Á/g, 'A')
    .replace(/Í/g, 'I')
    .replace(/Â/g, 'A')
    .replace(/Ã/g, 'A')
    .replace(/Ê/g, 'E')
    .replace(/Ë/g, 'E')
    .replace(/Ì/g, 'I')
    .replace(/Ò/g, 'O')
    .replace(/Ù/g, 'U')
    .replace(/Ú/g, 'U')
    .replace(/Ñ/g, 'N')
    .replace(/Č/g, 'C')
    .replace(/Ć/g, 'C')
    .replace(/Đ/g, 'D')
    .replace(/Š/g, 'S')
    .replace(/Ž/g, 'Z')
    .replace(/Ř/g, 'R')
    .replace(/Ů/g, 'U')
    .replace(/Ě/g, 'E')
    .replace(/Ł/g, 'L')
    .replace(/Ś/g, 'S')
    .replace(/Ğ/g, 'G')
    .replace(/Ş/g, 'S')
    .replace(/İ/g, 'I')
    .replace(/Ş/g, 'S')
    .replace(/Ğ/g, 'G')
    .replace(/Ö/g, 'O')
    .replace(/Ü/g, 'U')
    .replace(/Ä/g, 'A')
    .replace(/ /g, '_')
    .replace(/-/g, '_')
    .replace(/__/g, '_');
}

function formatPlayersConst(label: string, names: string[]): string {
  const key = constKey(label);
  const lines = names.map((n) => `  '${n.replace(/'/g, "\\'")}',`);
  return `export const PLAYERS_${key}_35: readonly string[] = [\n${lines.join('\n')}\n];`;
}

function formatRolesConst(label: string, roles: FootballRoleCode[]): string {
  const key = constKey(label);
  const chunks: string[] = [];
  for (let i = 0; i < roles.length; i += 12) {
    chunks.push(roles.slice(i, i + 12).join(' '));
  }
  return `const ROLES_${key}_35 = splitRoles(\`\n${chunks.join('\n')}\n\`);`;
}

function main() {
  const md = readFileSync(WIKI_PATH, 'utf8');
  const officialByNation = parseWikiSquads(md);
  const generated: { label: string; names: string[]; roles: FootballRoleCode[] }[] = [];

  for (const label of SQUAD_PREDICTOR_ALL_NATIONS.filter((l) => l !== 'England')) {
    const official = officialByNation.get(label);
    if (!official) throw new Error(`Missing official squad for ${label}`);
    const roleHints = EXPANDED_TACTICAL_ROLE_BY_NATION[label] ?? {};
    const built = buildPoolOfficial26(label, official, roleHints);
    if (built.names.length < 23 || built.names.length > FIFA_SQUAD_MAX) {
      throw new Error(`${label}: expected 23–${FIFA_SQUAD_MAX} players, got ${built.names.length}`);
    }
    generated.push({ label, ...built });
    console.log(`OK ${label}: ${built.names.length} official players`);
  }

  const playersHeader = `/**
 * Official FIFA 26-man squads for squad builder / awards (all 2026 qualified nations).
 * Source: FIFA-confirmed lists (June 2026). No reserve alternates.
 * Order: goalkeepers → defenders → midfielders → forwards.
 * Regenerate: npx tsx scripts/sync-2026-official-squad-pools.mts
 */\n\n`;

  const playersBody = generated.map((g) => formatPlayersConst(g.label, g.names)).join('\n\n');
  writeFileSync(join(ROOT, 'src/data/squadPredictorExpandedPlayerLists.ts'), playersHeader + playersBody + '\n');

  const rolesImports = generated
    .map((g) => `  PLAYERS_${constKey(g.label)}_35,`)
    .join('\n');

  const rolesBlocks = generated.map((g) => formatRolesConst(g.label, g.roles)).join('\n\n');

  const rolesFile = `import type { FootballRoleCode } from '@/data/squadPredictorPlayerRoleHints';
import { PLAYER_FOOTBALL_ROLE_BY_NAME } from '@/data/squadPredictorPlayerRoleHints';
import {
${rolesImports}
} from '@/data/squadPredictorExpandedPlayerLists';

function splitRoles(s: string): FootballRoleCode[] {
  return s.trim().split(/\\s+/).filter(Boolean) as FootballRoleCode[];
}

function zip(
  poolLabel: string,
  names: readonly string[],
  roles: readonly FootballRoleCode[],
): Record<string, FootballRoleCode> {
  if (names.length !== roles.length) {
    throw new Error(\`\${poolLabel}: expected \${names.length} roles, got \${roles.length}\`);
  }
  const out: Record<string, FootballRoleCode> = {};
  for (let i = 0; i < names.length; i++) {
    const n = names[i]!;
    const r = roles[i]!;
    out[n] = r;
  }
  return out;
}

${rolesBlocks}

/** Single source of truth: each pool's \`roles\` must match \`players\` index-for-index (official 26 each). */
export const EXPANDED_POOLS: { label: string; players: readonly string[]; roles: readonly FootballRoleCode[] }[] = [
${generated
  .map(
    (g) =>
      `  { label: '${g.label.replace(/'/g, "\\'")}', players: PLAYERS_${constKey(g.label)}_35, roles: ROLES_${constKey(g.label)}_35 },`,
  )
  .join('\n')}
];

/** Per qualified nation: name → primary tactical role (avoids collisions on duplicate names across pools). */
export const EXPANDED_TACTICAL_ROLE_BY_NATION: Record<string, Record<string, FootballRoleCode>> =
  Object.fromEntries(EXPANDED_POOLS.map((p) => [p.label, zip(p.label, p.players, p.roles)]));

/**
 * Flat name → role map for expanded pools. If the same full name appears in two pools, the later pool in
 * \`EXPANDED_POOLS\` wins; prefer \`lookupFootballRoleForPlayerName(name, _, nation)\` when nation is known.
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
`;

  writeFileSync(join(ROOT, 'src/data/squadPredictorExpandedTacticalRoles.ts'), rolesFile);
  console.log(`\nWrote ${generated.length} nation pools.`);
}

main();

import {
  SQUAD_PREDICTOR_GROUPS,
  SQUAD_PREDICTOR_GROUP_MATCH_PAIRS,
} from '@/data/squadPredictor2026Groups';
import { FIFA_2026_ANNEX_C_THIRD_BY_ADVANCING_GROUPS } from '@/data/fifa2026AnnexCThirdPlace';

export type TeamStanding = {
  name: string;
  groupId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
};

export type QualifiedSlot = {
  name: string;
  groupId: string;
  bucket: 'winner' | 'runner' | 'third';
  points: number;
  gd: number;
  gf: number;
};

/** Parse "2-1", "2 – 1", "2:1"; blank or invalid → null (safe for advancement logic). */
export function parseScoreInput(raw: string): { a: number; b: number } | null {
  const s = raw.trim();
  if (!s) return null;
  const m = s.match(/^(\d{1,2})\s*[-–:]\s*(\d{1,2})$/);
  if (m) return { a: Number(m[1]), b: Number(m[2]) };
  return null;
}

/** Single-team goals for knockout inputs; blank or invalid → null. */
export function parseGoals(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0 || n > 99) return null;
  return Math.floor(n);
}

export function groupStageMatchKey(groupId: string, i: number, j: number): string {
  const [lo, hi] = i < j ? [i, j] : [j, i];
  return `${groupId}-${lo}-${hi}`;
}

function compareStandings(a: TeamStanding, b: TeamStanding): number {
  if (a.points !== b.points) return b.points - a.points;
  const gdA = a.gf - a.ga;
  const gdB = b.gf - b.ga;
  if (gdA !== gdB) return gdB - gdA;
  if (a.gf !== b.gf) return b.gf - a.gf;
  return a.name.localeCompare(b.name);
}

export function computeGroupStandings(
  groupId: string,
  teams: readonly string[],
  scores: Record<string, string>,
): TeamStanding[] {
  const idx = (name: string) => teams.indexOf(name);
  const table = new Map<string, TeamStanding>();

  for (const t of teams) {
    table.set(t, {
      name: t,
      groupId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      points: 0,
    });
  }

  for (const [i, j] of SQUAD_PREDICTOR_GROUP_MATCH_PAIRS) {
    const key = groupStageMatchKey(groupId, i, j);
    const parsed = parseScoreInput(scores[key] ?? '');
    if (!parsed) continue;
    const ti = teams[i];
    const tj = teams[j];
    const si = table.get(ti)!;
    const sj = table.get(tj)!;
    si.played += 1;
    sj.played += 1;
    si.gf += parsed.a;
    si.ga += parsed.b;
    sj.gf += parsed.b;
    sj.ga += parsed.a;
    if (parsed.a > parsed.b) {
      si.won += 1;
      si.points += 3;
      sj.lost += 1;
    } else if (parsed.b > parsed.a) {
      sj.won += 1;
      sj.points += 3;
      si.lost += 1;
    } else {
      si.drawn += 1;
      sj.drawn += 1;
      si.points += 1;
      sj.points += 1;
    }
  }

  return [...table.values()].sort(compareStandings);
}

/** All 12 groups × six fixtures have a valid scoreline (e.g. 2-1). */
export function isGroupStageComplete(scores: Record<string, string>): boolean {
  for (const g of SQUAD_PREDICTOR_GROUPS) {
    for (const [i, j] of SQUAD_PREDICTOR_GROUP_MATCH_PAIRS) {
      const key = groupStageMatchKey(g.id, i, j);
      if (!parseScoreInput(scores[key] ?? '')) return false;
    }
  }
  return true;
}

/** First group (A–L) still missing a score, or null if {@link isGroupStageComplete}. */
export function getFirstIncompleteGroupId(scores: Record<string, string>): string | null {
  for (const g of SQUAD_PREDICTOR_GROUPS) {
    for (const [i, j] of SQUAD_PREDICTOR_GROUP_MATCH_PAIRS) {
      const key = groupStageMatchKey(g.id, i, j);
      if (!parseScoreInput(scores[key] ?? '')) return g.id;
    }
  }
  return null;
}

function compareQualified(a: QualifiedSlot, b: QualifiedSlot): number {
  if (a.points !== b.points) return b.points - a.points;
  if (a.gd !== b.gd) return b.gd - a.gd;
  if (a.gf !== b.gf) return b.gf - a.gf;
  return a.name.localeCompare(b.name);
}

/**
 * 32 qualifiers: 12 group winners + 12 runners-up + 8 best third places.
 * Returns ordered list for bracket (index 0 = strongest seed, 31 = weakest).
 */
export function computeBracket32(scores: Record<string, string>): {
  qualifiers: QualifiedSlot[];
  thirdPlaceOut: QualifiedSlot[];
} {
  const winners: QualifiedSlot[] = [];
  const runners: QualifiedSlot[] = [];
  const thirds: QualifiedSlot[] = [];

  for (const g of SQUAD_PREDICTOR_GROUPS) {
    const standings = computeGroupStandings(g.id, g.teams, scores);
    const mk = (s: TeamStanding, bucket: QualifiedSlot['bucket']): QualifiedSlot => ({
      name: s.name,
      groupId: g.id,
      bucket,
      points: s.points,
      gd: s.gf - s.ga,
      gf: s.gf,
    });
    if (standings.length >= 3) {
      winners.push(mk(standings[0]!, 'winner'));
      runners.push(mk(standings[1]!, 'runner'));
      thirds.push(mk(standings[2]!, 'third'));
    }
  }

  const sortedThirds = [...thirds].sort(compareQualified);
  const thirdIn = sortedThirds.slice(0, 8);
  const thirdOut = sortedThirds.slice(8);

  const w = [...winners].sort(compareQualified);
  const r = [...runners].sort(compareQualified);
  const t = [...thirdIn].sort(compareQualified);

  const qualifiers: QualifiedSlot[] = [...w, ...r, ...t];
  return { qualifiers, thirdPlaceOut: thirdOut };
}

/**
 * @deprecated Prefer {@link buildRoundOf32PairingsFromScores} — FIFA 2026 uses fixed match slots (73–88), not 1v32 seeding.
 * Kept for tests / tooling.
 */
export function buildRoundOf32Pairings(qualifiersOrdered: QualifiedSlot[]): [string, string][] {
  if (qualifiersOrdered.length < 32) return [];
  const out: [string, string][] = [];
  for (let i = 0; i < 16; i++) {
    const a = qualifiersOrdered[i]!.name;
    const b = qualifiersOrdered[31 - i]!.name;
    out.push([a, b]);
  }
  return out;
}

type R32Side =
  | { k: 'W'; g: string }
  | { k: 'R'; g: string }
  | { k: 'T'; pool: readonly string[] };

/**
 * FIFA 2026 Round of 32 — official match order M73–M88 (array index i = match 73 + i).
 * Winner = 1st in group, Runner-up = 2nd, T pool = eligible groups for the “best third” placed in that match.
 *
 * | Match | Fixture |
 * |------|---------|
 * | 73 | 2A vs 2B |
 * | 74 | 1E vs 3 A/B/C/D/F |
 * | 75 | 1F vs 2C |
 * | 76 | 1C vs 2F |
 * | 77 | 1I vs 3 C/D/F/G/H |
 * | 78 | 2E vs 2I |
 * | 79 | 1A vs 3 C/E/F/H/I |
 * | 80 | 1L vs 3 E/H/I/J/K |
 * | 81 | 1D vs 3 B/E/F/I/J |
 * | 82 | 1G vs 3 A/E/H/I/J |
 * | 83 | 2K vs 2L |
 * | 84 | 1H vs 2J |
 * | 85 | 1B vs 3 E/F/G/I/J |
 * | 86 | 1J vs 2H |
 * | 87 | 1K vs 3 D/E/I/J/L |
 * | 88 | 2D vs 2G |
 *
 * Third-place slot assignment uses Annex C (see {@link assignThirdsToR32Slots}); pools above are eligibility only.
 * @see https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage#Round_of_32
 */
const R32_MATCHES_73_88: readonly [R32Side, R32Side][] = [
  /* M73 */ [{ k: 'R', g: 'A' }, { k: 'R', g: 'B' }],
  /* M74 */ [{ k: 'W', g: 'E' }, { k: 'T', pool: ['A', 'B', 'C', 'D', 'F'] }],
  /* M75 */ [{ k: 'W', g: 'F' }, { k: 'R', g: 'C' }],
  /* M76 */ [{ k: 'W', g: 'C' }, { k: 'R', g: 'F' }],
  /* M77 */ [{ k: 'W', g: 'I' }, { k: 'T', pool: ['C', 'D', 'F', 'G', 'H'] }],
  /* M78 */ [{ k: 'R', g: 'E' }, { k: 'R', g: 'I' }],
  /* M79 */ [{ k: 'W', g: 'A' }, { k: 'T', pool: ['C', 'E', 'F', 'H', 'I'] }],
  /* M80 */ [{ k: 'W', g: 'L' }, { k: 'T', pool: ['E', 'H', 'I', 'J', 'K'] }],
  /* M81 */ [{ k: 'W', g: 'D' }, { k: 'T', pool: ['B', 'E', 'F', 'I', 'J'] }],
  /* M82 */ [{ k: 'W', g: 'G' }, { k: 'T', pool: ['A', 'E', 'H', 'I', 'J'] }],
  /* M83 */ [{ k: 'R', g: 'K' }, { k: 'R', g: 'L' }],
  /* M84 */ [{ k: 'W', g: 'H' }, { k: 'R', g: 'J' }],
  /* M85 */ [{ k: 'W', g: 'B' }, { k: 'T', pool: ['E', 'F', 'G', 'I', 'J'] }],
  /* M86 */ [{ k: 'W', g: 'J' }, { k: 'R', g: 'H' }],
  /* M87 */ [{ k: 'W', g: 'K' }, { k: 'T', pool: ['D', 'E', 'I', 'J', 'L'] }],
  /* M88 */ [{ k: 'R', g: 'D' }, { k: 'R', g: 'G' }],
];

function groupFinishes(scores: Record<string, string>): Map<string, TeamStanding[]> {
  const m = new Map<string, TeamStanding[]>();
  for (const g of SQUAD_PREDICTOR_GROUPS) {
    m.set(g.id, computeGroupStandings(g.id, g.teams, scores));
  }
  return m;
}

function resolveR32SideWR(side: Extract<R32Side, { k: 'W' | 'R' }>, finishes: Map<string, TeamStanding[]>): string {
  const rows = finishes.get(side.g);
  const idx = side.k === 'W' ? 0 : 1;
  return rows?.[idx]?.name ?? 'TBD';
}

/** Third-place R32 slots in match order (M74, M77, …) — same sequence as T sides in {@link R32_MATCHES_73_88}. */
const R32_THIRD_PLACE_POOLS: readonly (readonly string[])[] = R32_MATCHES_73_88.flatMap(([_, b]) =>
  b.k === 'T' ? [b.pool] : [],
);

/**
 * R32 third slots in order M74, M77, M79, M80, M81, M82, M85, M87 → column index in Annex C Wikimedia order
 * (1Avs…1Lvs = A,B,D,E,G,I,K,L).
 */
const R32_THIRD_SLOT_ANNEX_COL_IDX: readonly number[] = [3, 5, 0, 7, 2, 4, 1, 6];

/**
 * Official Annex C: 8 advancing third-place groups (sorted key) → which group's third fills each winner-with-third slot.
 */
function assignThirdsAnnexC(thirdsAdvancing: QualifiedSlot[]): QualifiedSlot[] | null {
  if (thirdsAdvancing.length !== 8) return null;
  const ids = thirdsAdvancing.map((t) => t.groupId);
  if (new Set(ids).size !== 8) return null;
  const key = [...ids].sort().join('');
  const line = FIFA_2026_ANNEX_C_THIRD_BY_ADVANCING_GROUPS[key];
  if (!line || line.length !== 8) return null;
  const out: QualifiedSlot[] = [];
  for (let s = 0; s < 8; s++) {
    const col = R32_THIRD_SLOT_ANNEX_COL_IDX[s]!;
    const g = line[col]!;
    const team = thirdsAdvancing.find((t) => t.groupId === g);
    if (!team) return null;
    out.push(team);
  }
  return out;
}

/**
 * Backtracking fallback if Annex lookup fails (should not happen for valid keys from {@link computeBracket32}).
 */
function assignThirdsToR32Slots(thirdsAdvancing: QualifiedSlot[]): QualifiedSlot[] | null {
  if (thirdsAdvancing.length !== R32_THIRD_PLACE_POOLS.length) return null;
  const thirdsSorted = [...thirdsAdvancing].sort(compareQualified);
  const used = new Set<string>();
  const out: QualifiedSlot[] = new Array(R32_THIRD_PLACE_POOLS.length);

  function dfs(slotIdx: number): boolean {
    if (slotIdx === R32_THIRD_PLACE_POOLS.length) return true;
    const pool = new Set(R32_THIRD_PLACE_POOLS[slotIdx]!);
    for (const t of thirdsSorted) {
      if (used.has(t.name)) continue;
      if (!pool.has(t.groupId)) continue;
      used.add(t.name);
      out[slotIdx] = t;
      if (dfs(slotIdx + 1)) return true;
      used.delete(t.name);
    }
    return false;
  }

  return dfs(0) ? out : null;
}

/** Legacy greedy assignment (may leave later slots as TBD). Used only if {@link assignThirdsToR32Slots} finds no matching. */
function assignThirdsGreedyLegacy(thirdsAdvancing: QualifiedSlot[]): (QualifiedSlot | undefined)[] {
  const thirdsSorted = [...thirdsAdvancing].sort(compareQualified);
  const used = new Set<string>();
  return R32_THIRD_PLACE_POOLS.map((pool) => {
    const poolSet = new Set(pool);
    for (const t of thirdsSorted) {
      if (used.has(t.name)) continue;
      if (poolSet.has(t.groupId)) {
        used.add(t.name);
        return t;
      }
    }
    return undefined;
  });
}

/**
 * Round of 32 pairings aligned with FIFA matches 73–88 (array index = match − 73).
 */
export function buildRoundOf32PairingsFromScores(scores: Record<string, string>): [string, string][] {
  const { thirdPlaceOut: _out, qualifiers } = computeBracket32(scores);
  void _out;
  const thirdsAdvancing = qualifiers.filter((q) => q.bucket === 'third');
  const finishes = groupFinishes(scores);
  const assigned =
    assignThirdsAnnexC(thirdsAdvancing) ??
    assignThirdsToR32Slots(thirdsAdvancing) ??
    assignThirdsGreedyLegacy(thirdsAdvancing);
  let thirdSlotCursor = 0;
  const pairs: [string, string][] = [];
  for (const [a, b] of R32_MATCHES_73_88) {
    const teamA = resolveR32SideWR(a, finishes);
    let teamB: string;
    if (b.k === 'T') {
      const pick = assigned[thirdSlotCursor];
      thirdSlotCursor += 1;
      teamB = pick?.name ?? 'TBD';
    } else {
      teamB = resolveR32SideWR(b, finishes);
    }
    pairs.push([teamA, teamB]);
  }
  return pairs;
}

/**
 * FIFA Round of 16: `winners[k]` = winner of R32 match M(73+k).
 * M89=W73×W75, M90=W74×W77, M91=W76×W78, M92=W79×W80, M93=W83×W84, M94=W81×W82, M95=W86×W88, M96=W85×W87.
 * @see https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage#Round_of_16
 */
export function pairRoundOf16FromR32(winners: (string | null)[]): [string, string][] | null {
  if (winners.length !== 16) return null;
  const w = (i: number) => winners[i];
  const idxPairs: [number, number][] = [
    [0, 2],
    [1, 4],
    [3, 5],
    [6, 7],
    [10, 11],
    [8, 9],
    [13, 15],
    [12, 14],
  ];
  const out: [string, string][] = [];
  for (const [ia, ib] of idxPairs) {
    const x = w(ia);
    const y = w(ib);
    if (!x || !y) return null;
    out.push([x, y]);
  }
  return out;
}

/** R16 order in {@link pairRoundOf16FromR32} output: M89, M90, … M96. */
export const FIFA_R16_LABELS = ['M89', 'M90', 'M91', 'M92', 'M93', 'M94', 'M95', 'M96'] as const;

/**
 * Quarter-finals: M97=W89×W90, M98=W93×W94, M99=W91×W92, M100=W95×W96 (R16 slot order M89…M96).
 * @see https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage#Quarter-finals
 */
export function pairQuarterFinalsFromR16(winners: (string | null)[]): [string, string][] | null {
  if (winners.length !== 8) return null;
  const idxPairs: [number, number][] = [
    [0, 1],
    [4, 5],
    [2, 3],
    [6, 7],
  ];
  const out: [string, string][] = [];
  for (const [ia, ib] of idxPairs) {
    const x = winners[ia];
    const y = winners[ib];
    if (!x || !y) return null;
    out.push([x, y]);
  }
  return out;
}

export const FIFA_QF_LABELS = ['M97', 'M98', 'M99', 'M100'] as const;

/** Semi-finals: M101=W97×W98, M102=W99×W100. */
export function pairSemiFinalsFromQuarter(winners: (string | null)[]): [string, string][] | null {
  if (winners.length !== 4) return null;
  const pairs: [number, number][] = [
    [0, 1],
    [2, 3],
  ];
  const out: [string, string][] = [];
  for (const [ia, ib] of pairs) {
    const x = winners[ia];
    const y = winners[ib];
    if (!x || !y) return null;
    out.push([x, y]);
  }
  return out;
}

export const FIFA_SF_LABELS = ['M101', 'M102'] as const;

export const FIFA_THIRD_PLACE_LABEL = 'M103' as const;

/** M103: semi-final losers (loser M101 vs loser M102, i.e. SF1 loser vs SF2 loser). */
export function pairThirdPlaceFromSemi(
  sf: readonly { teamA: string; teamB: string; sA: string; sB: string; tie: '' | 'A' | 'B' }[],
): [string, string] | null {
  if (sf.length !== 2) return null;
  const losers: string[] = [];
  for (const m of sf) {
    const r = resolveKnockout(m.teamA, m.teamB, m.sA, m.sB, m.tie);
    if (!('winner' in r)) return null;
    losers.push(r.winner === m.teamA ? m.teamB : m.teamA);
  }
  return [losers[0]!, losers[1]!];
}

export type KnockResult = { winner: string } | { needTieBreak: true } | { pending: true };

export function resolveKnockout(
  teamA: string,
  teamB: string,
  rawA: string,
  rawB: string,
  tieWinner: 'A' | 'B' | '',
): KnockResult {
  const ga = parseGoals(rawA);
  const gb = parseGoals(rawB);
  if (ga === null || gb === null) return { pending: true };
  if (ga > gb) return { winner: teamA };
  if (gb > ga) return { winner: teamB };
  if (tieWinner === 'A') return { winner: teamA };
  if (tieWinner === 'B') return { winner: teamB };
  return { needTieBreak: true };
}

/** Given 16 match winners in order, build 8 RO16 pairings (0 vs 1, 2 vs 3, …). */
export function pairWinnersSequential(winners: (string | null)[]): [string, string][] | null {
  if (winners.length % 2 !== 0) return null;
  const out: [string, string][] = [];
  for (let i = 0; i < winners.length; i += 2) {
    const x = winners[i];
    const y = winners[i + 1];
    if (!x || !y) return null;
    out.push([x, y]);
  }
  return out;
}

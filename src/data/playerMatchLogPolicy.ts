import type { Question } from '@/types/game';
import { isAuthorVerbatimLegendId } from './legendAuthorVerbatimId';

/** Optional legacy opener — stripped when redundant with locked `eventYear` / tournament context. */
const LEADING_AT_OR_IN_WC_RE = /^(?:At|In) the (19\d{2}|20\d{2}) World Cup,?\s*/i;

/** Career-wide / aggregate prompts — not allowed in era-locked match-log mode. */
const CAREER_AGGREGATE_RE =
  /\b(how many different (fifa )?world cup|how many world cups did|how many total world cup|total world cup (goals|matches|minutes|appearances)|in (his|her) (world cup )?career|across (his|her|their) world cup career|how many world cup matches did .{0,80}(play in (his|her) career|in (his|her) career)|how many total minutes did .{0,80}in world cup tournaments|how many different (teammates|world cup tournaments|stadiums)|how many different teammates assisted|span in years between (his|her) first and last|which list contains every calendar year|played at more than one fifa world cup|played at a fifa world cup held in the (2000s|2010s)|how many years separate first and last)/i;

function extractYearsFromText(text: string): number[] {
  const years = new Set<number>();
  const re = /\b(19\d{2}|20\d{2})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const y = parseInt(m[1], 10);
    if (y >= 1930 && y <= 2038) years.add(y);
  }
  return [...years].sort((a, b) => a - b);
}

/** Strip `(...)` for cross-year leakage checks only — editorial asides (e.g. “also wore in 2022”) must not zero the pool. */
function stripParenSegmentsForCrossYearScan(text: string): string {
  let result = text;
  let prev = '';
  while (result !== prev) {
    prev = result;
    result = result.replace(/\([^)]*\)/g, ' ');
  }
  return result;
}

/**
 * True if **any** of the player’s other World Cup years appear in the prompt surface (stem + hints).
 * Used so a level locked to e.g. 2018 never pulls cards whose copy still references 2014/2022.
 * Years mentioned only inside parentheses are ignored — they flag editorial cross-references, not wrong-level stems.
 * When `eventYear` already matches the level’s target year, trust that tag (verbatim stems may cite prior finals).
 */
export function hasContaminatingPlayerWcYear(
  q: Question,
  targetYear: number,
  playerYears: number[],
): boolean {
  if (q.eventYear != null && q.eventYear === targetYear) return false;
  const blob = [q.question, q.hint1, q.hint2, q.hint3, q.hint4].filter(Boolean).join(' ');
  const sanitized = stripParenSegmentsForCrossYearScan(blob);
  for (const y of extractYearsFromText(sanitized)) {
    if (playerYears.includes(y) && y !== targetYear) return true;
  }
  return false;
}

export function isCareerAggregateQuestion(q: Question): boolean {
  if (isAuthorVerbatimLegendId(q.id)) return false;
  const t = [q.question, q.hint1, q.hint2, q.hint3, q.hint4].filter(Boolean).join(' ');
  // Totals explicitly locked to a short list of named finals years (e.g. “campaigns (2002 and 2006)”) are level-safe.
  if (/\bworld cup campaigns\b/i.test(t) && /\(\s*19\d{2}\s+and\s+19\d{2}\s*\)/i.test(t)) return false;
  if (/\bworld cup campaigns\b/i.test(t) && /\(\s*19\d{2}\s+and\s+20\d{2}\s*\)/i.test(t)) return false;
  if (/\bworld cup campaigns\b/i.test(t) && /\(\s*20\d{2}\s+and\s+20\d{2}\s*\)/i.test(t)) return false;
  return CAREER_AGGREGATE_RE.test(t);
}

function resolveSingleTournamentYear(q: Question, playerYears: number[]): number | undefined {
  const stem = [q.question, q.hint1, q.hint2, q.hint3, q.hint4].filter(Boolean).join(' ');
  const inStem = extractYearsFromText(stem).filter((y) => playerYears.includes(y));
  if (inStem.length === 1) return inStem[0];
  return undefined;
}

function sentenceCapitalize(question: string): string {
  const t = question.trim();
  if (t.length === 0) return t;
  if (/^[a-z]/.test(t)) return t.charAt(0).toUpperCase() + t.slice(1);
  return t;
}

/**
 * Tags prompts to exactly one playable tournament year (`eventYear`) without forcibly rewriting natural stems.
 * Strips redundant "In/At the [YEAR] World Cup, …" openers — the tile already communicates the finals year.
 */
export function normalizePlayerQuestionEraStem(q: Question, playerYears: number[]): Question | null {
  const raw = q.question.trim();

  let yPref: number | undefined;
  const prefM = raw.match(LEADING_AT_OR_IN_WC_RE);
  if (prefM) {
    const py = parseInt(prefM[1], 10);
    if (playerYears.includes(py)) yPref = py;
    else return null;
  }

  let y =
    q.eventYear != null && playerYears.includes(q.eventYear)
      ? q.eventYear
      : yPref != null
        ? yPref
        : resolveSingleTournamentYear(q, playerYears);

  if (y == null || !playerYears.includes(y)) return null;

  if (yPref != null && yPref !== y) return null;

  let body = raw.replace(new RegExp(`^(?:At|In) the ${y} World Cup,?\\s*`, 'i'), '').trim();
  body = sentenceCapitalize(body);
  if (body.length === 0) return null;

  return { ...q, question: body, eventYear: y };
}

/**
 * Drop career/total prompts; assign `eventYear` and normalize stems (no enforced "In the [YEAR] World Cup…" opener).
 */
/**
 * @param playedWorldCupYears Years the player had minutes (squad-only years excluded)
 * @param eraWorldCupYears Full finals years (including squad-only) for era resolution / verbatim squad tiles
 */
export function applyMatchLogPolicyToPool(
  questions: Question[],
  playedWorldCupYears: number[],
  eraWorldCupYears?: number[],
): Question[] {
  const eraYears =
    eraWorldCupYears != null && eraWorldCupYears.length > 0
      ? eraWorldCupYears
      : playedWorldCupYears;
  if (eraYears.length === 0) {
    return questions.filter((q) => !isCareerAggregateQuestion(q));
  }
  const out: Question[] = [];
  for (const q of questions) {
    if (isCareerAggregateQuestion(q)) continue;
    const n = normalizePlayerQuestionEraStem(q, eraYears);
    if (!n || isCareerAggregateQuestion(n)) continue;
    if (n.eventYear == null || !eraYears.includes(n.eventYear)) continue;
    const played = playedWorldCupYears.includes(n.eventYear);
    const verbatimSquad =
      isAuthorVerbatimLegendId(n.id) && eraYears.includes(n.eventYear) && !played;
    if (!played && !verbatimSquad) continue;
    out.push(n);
  }
  return out;
}

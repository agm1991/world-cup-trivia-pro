import type { Question } from '@/types/game';
import {
  parseScorelineMatchQuestion,
  parseYearFromScorelineQuestionId,
} from '@/components/ScorelineMatchHeading';
import { SCORELINE_SINGLE_TEAM_OPPONENT } from '@/data/scorelineSingleTeamOpponents';
import { countries, getCountryFlag, stripTeamNameFlags } from '@/lib/countryFlags';
import { formatQuizQuestionDisplay, stripUiParentheticals } from '@/lib/utils';

const SCORELINE_STAGE_IN_QUESTION =
  / - (group stage|round of 16|quarter-final|semi-final|final|third(-place)?)/i;

const SCORELINE_OPTION = /^\d{1,2}\s*-\s*\d{1,2}(\s*\([a-z.]+\))?$/i;

/** Known kickoff dates for legacy `sc-YYYY-*` rows (presentation only). */
const SCORELINE_MATCH_DATE_BY_ID: Record<string, string> = {
  'sc-1966-4-3': '12 July 1966',
  'sc-1966-4-5': '20 July 1966',
  'sc-1986-1-9': '16 June 1986',
  'sc-2014-1-6': '4 July 2014',
  'sc-2014-5-7': '26 June 2014',
  'sc-2018-1-1': '14 June 2018',
  'sc-2018-4-8': '28 June 2018',
  'sc-2018-5-8': '21 June 2018',
  'sc-2022-5-8': '29 November 2022',
};

/** Fallback month window when no exact date is on file. */
const TOURNAMENT_GROUP_MONTH: Record<number, string> = {
  1958: 'June 1958',
  1962: 'May–June 1962',
  1966: 'July 1966',
  1970: 'May–June 1970',
  1974: 'June 1974',
  1978: 'June 1978',
  1982: 'June 1982',
  1986: 'May–June 1986',
  1990: 'June 1990',
  1994: 'June 1994',
  1998: 'June 1998',
  2002: 'May–June 2002',
  2006: 'June 2006',
  2010: 'June 2010',
  2014: 'June 2014',
  2018: 'June 2018',
  2022: 'November 2022',
};

const TOURNAMENT_FINAL_DATE: Record<number, string> = {
  1966: '30 July 1966',
  1986: '29 June 1986',
  1998: '12 July 1998',
  2002: '30 June 2002',
  2006: '9 July 2006',
  2010: '11 July 2010',
  2014: '13 July 2014',
  2018: '15 July 2018',
  2022: '18 December 2022',
};

export function parseYearFromScorelineQuestionText(question: string): number | null {
  const m = /FIFA World Cup\s+(\d{4})/i.exec(question);
  if (!m) return null;
  const y = parseInt(m[1]!, 10);
  return Number.isFinite(y) ? y : null;
}

/** Pull embedded `sc-1966-4-3` / `sc-cur-25-01` from bingo-tagged ids. */
export function extractEmbeddedScorelineId(id: string): string | null {
  const m = /(sc-\d{4}-\d+-\d+)/.exec(id) ?? /(sc-cur-\d+-\d+)/.exec(id);
  return m?.[1] ?? null;
}

/** Year from embedded `sc-YYYY-*`, bingo-tagged id, question text, or hints. */
export function resolveScorelineYear(q: Question): number | null {
  const embedded = extractEmbeddedScorelineId(q.id);
  if (embedded) {
    const m = /^sc-(\d{4})-/.exec(embedded);
    if (m) {
      const y = parseInt(m[1]!, 10);
      if (Number.isFinite(y)) return y;
    }
  }

  const fromId = parseYearFromScorelineQuestionId(q.id);
  if (fromId != null) return fromId;

  const fromFifa = parseYearFromScorelineQuestionText(q.question);
  if (fromFifa != null) return fromFifa;

  const fromQuestion = /\b(19|20)\d{2}\b/.exec(q.question);
  if (fromQuestion) {
    const y = parseInt(fromQuestion[0], 10);
    if (Number.isFinite(y)) return y;
  }

  for (const hint of [q.hint1, q.hint2, q.hint3]) {
    const fromHint = /\b(19|20)\d{2}\b/.exec(hint);
    if (fromHint) {
      const y = parseInt(fromHint[0], 10);
      if (Number.isFinite(y)) return y;
    }
  }

  if (typeof q.eventYear === 'number' && Number.isFinite(q.eventYear)) {
    return q.eventYear;
  }

  return null;
}

/** Detect scoreline rows in the mixed World Cup Bingo pool (levels 1–50 and beyond). */
export function isBingoScorelineQuestion(q: Question): boolean {
  if (q.sourceCategory === 'guess-scoreline') return true;

  // MCQ trivia rows — copy often mentions "vs" and "Final" but is not a scoreline guess.
  if (
    q.sourceCategory === 'world-cup' ||
    q.sourceCategory === 'managers' ||
    q.sourceCategory === 'stadiums' ||
    q.sourceCategory === 'guess-who' ||
    q.sourceCategory === 'guess-who-photo' ||
    q.sourceCategory === 'missing-player' ||
    q.sourceCategory === 'country-history' ||
    q.sourceCategory === 'world-cup-winners'
  ) {
    return false;
  }

  if (/FIFA World Cup\s+\d{4}/i.test(q.question) && q.question.includes(' — ')) {
    return true;
  }

  if (SCORELINE_STAGE_IN_QUESTION.test(q.question)) {
    return true;
  }

  if (
    /\bvs\b/i.test(q.question) &&
    /(group stage|round of 16|quarter-final|semi-final|final)/i.test(q.question)
  ) {
    return true;
  }

  const opts = [q.optionA, q.optionB, q.optionC, q.optionD].map((o) =>
    stripUiParentheticals(o).trim(),
  );
  return opts.length === 4 && opts.every((o) => SCORELINE_OPTION.test(o));
}

/** Readable casing for non-scoreline bingo copy (e.g. legacy ALL CAPS). */
export function formatBingoPlainQuestion(text: string): string {
  return formatQuizQuestionDisplay(text);
}

function normalizeStageForHeading(stage: string): string {
  return stage
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const COUNTRIES_BY_LENGTH = [...countries].sort((a, b) => b.length - a.length);

function stripFlagsAndEmoji(text: string): string {
  return stripTeamNameFlags(text);
}

function findCountriesInText(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const country of COUNTRIES_BY_LENGTH) {
    if (lower.includes(country.toLowerCase())) found.push(country);
  }
  return found;
}

function resolveCountryName(fragment: string): string | null {
  const f = fragment.trim().toLowerCase();
  for (const country of COUNTRIES_BY_LENGTH) {
    const cLower = country.toLowerCase();
    if (f === cLower || f.startsWith(`${cLower} `) || f.endsWith(` ${cLower}`)) {
      return country;
    }
  }
  return null;
}

function scoreOpponentCandidate(country: string, hints: string[], primaryNorm: string): number {
  const cLower = country.toLowerCase();
  if (primaryNorm.includes(cLower)) return -1;

  let score = 0;
  for (const hint of hints) {
    if (new RegExp(`${country}[^.]{0,50}got (?:a consolation|eliminated)`, 'i').test(hint)) {
      score += 12;
    }
    if (new RegExp(`scored for\\s+${country}`, 'i').test(hint)) score += 10;
    if (new RegExp(`${country}[^.]{0,40}(?:got a consolation|finished with zero points)`, 'i').test(hint)) {
      score += 10;
    }
    if (new RegExp(`${country}\\s+won\\b`, 'i').test(hint)) score += 6;
    if (new RegExp(`${country}\\s+advanced\\b`, 'i').test(hint)) score += 4;
    if (new RegExp(`${country}[^.]{0,30}scored`, 'i').test(hint)) score += 2;
  }
  return score;
}

function inferOpponentFromHints(primaryLine: string, hints: string[]): string | null {
  const primaryNorm = stripFlagsAndEmoji(primaryLine).toLowerCase();
  const hintText = hints.join(' ');

  const hintPatterns = [
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\s+(?:got a consolation|got eliminated|finished with zero points)\b/i,
    /scored for\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\b/i,
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\s+advanced\b/i,
    /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]{2,40}?)\s+won\b/i,
  ];

  for (const hint of hints) {
    for (const pattern of hintPatterns) {
      const match = pattern.exec(hint);
      if (!match?.[1]) continue;
      const resolved = resolveCountryName(match[1].trim());
      if (resolved && !primaryNorm.includes(resolved.toLowerCase())) return resolved;
    }
  }

  const inHints = findCountriesInText(hintText);
  const inPrimary = findCountriesInText(primaryLine);
  const candidates = inHints.filter(
    (c) =>
      !inPrimary.includes(c) &&
      !primaryNorm.includes(c.toLowerCase()) &&
      scoreOpponentCandidate(c, hints, primaryNorm) > 0,
  );

  if (candidates.length === 0) {
    const fallback = inHints.filter(
      (c) => !inPrimary.includes(c) && !primaryNorm.includes(c.toLowerCase()),
    );
    if (fallback.length === 1) return fallback[0]!;
    return null;
  }

  return candidates.sort(
    (a, b) => scoreOpponentCandidate(b, hints, primaryNorm) - scoreOpponentCandidate(a, hints, primaryNorm),
  )[0]!;
}

function formatTeamWithFlag(teamLine: string): string {
  const trimmed = teamLine.trim();
  if (/[\u{1F1E6}-\u{1F1FF}]/u.test(trimmed)) return trimmed;
  const name = stripFlagsAndEmoji(trimmed);
  const flag = getCountryFlag(name);
  return flag !== '🏳️' ? `${name} ${flag}` : name;
}

function repairTeamsLine(question: string, hints: string[], embeddedId: string | null): string {
  if (/\bvs\b/i.test(question)) {
    const idx = question.lastIndexOf(' - ');
    return idx === -1 ? question.trim() : question.slice(0, idx).trim();
  }

  const single = /^(.+?)\s*-\s*(group|round|semi|quarter|final|third)/i.exec(question);
  if (!single?.[1]) return question.trim();

  const primary = single[1].trim();
  const override =
    embeddedId && SCORELINE_SINGLE_TEAM_OPPONENT[embeddedId]
      ? SCORELINE_SINGLE_TEAM_OPPONENT[embeddedId]
      : null;
  const opponent = override ?? inferOpponentFromHints(primary, hints);
  if (!opponent) return primary;

  return `${formatTeamWithFlag(primary)} vs ${formatTeamWithFlag(opponent)}`;
}

/** True when both teams are present for the gold match heading. */
export function isScorelineMatchupComplete(teamsLine: string): boolean {
  const pair = teamsLine.split(/\s+vs\s+/i).map((s) => s.trim());
  return pair.length === 2 && Boolean(pair[0]) && Boolean(pair[1]);
}

function inferApproxMatchPeriod(year: number, stage: string | null): string | null {
  if (!stage) return `${year}`;
  const s = stage.toLowerCase();
  // Order matters: 'quarter-final' and 'semi-final' contain the substring 'final'.
  if (s.includes('third')) return `${year}`;
  if (s.includes('semi')) return `${year}`;
  if (s.includes('quarter') || s.includes('round of 16')) return `${year}`;
  if (s.includes('group')) return `${year}`;
  if (/\bfinal\b/.test(s)) {
    return TOURNAMENT_FINAL_DATE[year] ?? `${year}`;
  }
  return `${year}`;
}

function resolveMatchDate(
  embeddedId: string | null,
  year: number | null,
  stage: string | null,
): string | null {
  if (embeddedId && SCORELINE_MATCH_DATE_BY_ID[embeddedId]) {
    return SCORELINE_MATCH_DATE_BY_ID[embeddedId];
  }
  if (year != null) return inferApproxMatchPeriod(year, stage);
  return null;
}

/**
 * Build curated-style heading text + metadata for legacy scoreline rows in World Cup Bingo.
 */
export function resolveScorelinePresentation(q: Question): {
  headingQuestion: string;
  year: number | null;
  matchDate: string | null;
  matchupComplete: boolean;
} {
  const hints = [q.hint1, q.hint2, q.hint3].filter(Boolean);
  const embeddedId = extractEmbeddedScorelineId(q.id);
  const year = resolveScorelineYear(q);

  const repairedTeams = repairTeamsLine(q.question, hints, embeddedId);
  const legacyParsed = parseScorelineMatchQuestion(q.question);
  const stage =
    legacyParsed.stage ??
    (q.question.includes(' - ')
      ? normalizeStageForHeading(q.question.slice(q.question.lastIndexOf(' - ') + 3))
      : null);

  const matchDate = resolveMatchDate(embeddedId, year, stage);
  const matchupComplete = isScorelineMatchupComplete(repairedTeams);

  if (/FIFA World Cup\s+\d{4}/i.test(q.question) && q.question.includes(' — ')) {
    const curatedTeams = parseScorelineMatchQuestion(q.question).teams;
    return {
      headingQuestion: q.question,
      year,
      matchDate,
      matchupComplete: isScorelineMatchupComplete(curatedTeams),
    };
  }

  if (year != null && repairedTeams && matchupComplete && stage) {
    return {
      headingQuestion: `FIFA World Cup ${year} — ${repairedTeams} — ${stage.toUpperCase()}`,
      year,
      matchDate,
      matchupComplete: true,
    };
  }

  if (year != null && repairedTeams && matchupComplete) {
    return {
      headingQuestion: `FIFA World Cup ${year} — ${repairedTeams}`,
      year,
      matchDate,
      matchupComplete: true,
    };
  }

  return { headingQuestion: q.question, year, matchDate, matchupComplete: false };
}

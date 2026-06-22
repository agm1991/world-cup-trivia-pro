/**
 * Parse Missing Player text prompts (from `missingPlayerQuestions.ts`) for World Cup Bingo.
 */

export type BingoMissingPlayerSlot = {
  /** Display label (may still include ? for trivia copy) */
  label: string;
  isMissing: boolean;
};

export type ParsedBingoMissingPlayerPrompt = {
  eventTitle: string;
  matchup: string;
  team: string;
  teamFlag: string;
  year: string;
  stageLabel: string;
  slots: BingoMissingPlayerSlot[];
  footnote: string | null;
};

/** e.g. "Italy vs France" → "Italy 🇮🇹 vs France 🇫🇷" (same order as Missing Player) */
export function formatBingoMatchupWithFlags(matchup: string, getFlag: (country: string) => string): string {
  const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
  if (parts.length === 2 && parts[0] && parts[1]) {
    return `${parts[0]} ${getFlag(parts[0])} vs ${parts[1]} ${getFlag(parts[1])}`;
  }
  return matchup;
}

function parseEventTitleParts(eventTitle: string): { year: string; stageLabel: string } {
  const yearMatch = eventTitle.match(/(\d{4})/);
  const year = yearMatch?.[1] ?? '';
  let stageLabel =
    eventTitle.replace(/^\d{4}\s+FIFA\s+World Cup\s+/i, '').trim() ||
    eventTitle.replace(/^\d{4}\s+FIFA\s+/i, '').trim() ||
    eventTitle;
  if (year && !/^world cup\b/i.test(stageLabel)) {
    stageLabel = `World Cup ${stageLabel}`;
  }
  return { year, stageLabel };
}

function normalizeQuestionSeparators(s: string): string {
  return s
    .replace(/\u2019/g, "'")
    .replace(/\u2013/g, '\u2014')
    .replace(/\u2014{2,}/g, '\u2014');
}

function isMissingToken(s: string): boolean {
  return /___|---|\?\?\?/.test(s);
}

function expandSlotsFromXiBody(body: string): BingoMissingPlayerSlot[] {
  const segments = body
    .split(';')
    .map((x) => x.trim())
    .filter(Boolean);
  const out: BingoMissingPlayerSlot[] = [];
  for (const seg of segments) {
    for (const part of seg.split(',').map((p) => p.trim())) {
      if (!part) continue;
      const cleaned = part.replace(/\?+$/, '').trim();
      out.push({
        label: cleaned,
        isMissing: isMissingToken(part) || isMissingToken(cleaned),
      });
    }
  }
  return out;
}

function slotsFromBlankTokens(text: string): BingoMissingPlayerSlot[] {
  const parts = text.split(/\s*·\s*|\s*,\s*/).map((p) => p.trim()).filter(Boolean);
  const out: BingoMissingPlayerSlot[] = [];
  for (const part of parts) {
    const roleMatch = /^([A-Z]{2,3})\s+___$/i.exec(part);
    const bareBlank = /^___$/i.test(part);
    if (roleMatch) {
      out.push({ label: roleMatch[1]!.toUpperCase(), isMissing: true });
    } else if (bareBlank || isMissingToken(part)) {
      out.push({ label: '?', isMissing: true });
    } else if (isMissingToken(part)) {
      const cleaned = part.replace(/___/g, '').trim();
      out.push({ label: cleaned || '?', isMissing: true });
    }
  }
  if (out.length === 0 && /___/.test(text)) {
    const count = (text.match(/___/g) ?? []).length;
    for (let i = 0; i < count; i++) out.push({ label: '?', isMissing: true });
  }
  return out;
}

function inferTeamFromRest(rest: string, matchup: string): string | null {
  const m1 =
    /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?)\s+three:/i.exec(rest) ??
    /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?)\s+XI\b/i.exec(rest);
  if (m1) return m1[1]!.trim();

  const m2 =
    /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?)\s+missing\b/i.exec(rest) ??
    /^Missing\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?)(?:'s|'s)?\s/i.exec(rest);
  if (m2) return m2[1]!.trim();

  const m3 = /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?):\s*(?:RW|LW|CB|AM|CM|DM|SW|ST|DF|MF|FW)/i.exec(rest);
  if (m3) return m3[1]!.trim();

  const m4 = /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?)(?:'s|'s)\s+/i.exec(rest);
  if (m4) return m4[1]!.trim();

  const m5 = /^([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]+?)\s+box-to-box/i.exec(rest);
  if (m5) return m5[1]!.trim();

  if (/miracle of bern|west germany/i.test(rest)) {
    const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
    if (/germany/i.test(parts[0] ?? '')) return parts[0]!;
    if (/germany/i.test(parts[1] ?? '')) return parts[1]!;
    return 'West Germany';
  }
  if (/magical magyars|hungary/i.test(rest)) {
    const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
    return /hungary/i.test(parts[0] ?? '') ? parts[0]! : parts[1] ?? 'Hungary';
  }
  if (/total football/i.test(rest)) return 'Netherlands';

  if (
    /^three\s+roles/i.test(rest) ||
    /three\s+(?:roles|starters|gaps)|^three\b|four\s+blanks|which\s+pair/i.test(rest) ||
    /miracle of bern|magical magyars/i.test(rest)
  ) {
    const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
    return parts[0] ?? null;
  }

  const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
  return parts[0] ?? null;
}

function parseXiSection(restJoined: string): { team: string; body: string } | null {
  const xiMatch =
    /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:\s*(.+)$/is.exec(restJoined) ??
    /^(.+?)\s+XI\s*:\s*(.+)$/is.exec(restJoined);
  if (!xiMatch) return null;
  return { team: xiMatch[1]!.trim(), body: xiMatch[2]!.trim() };
}

function parseLineupBodyAfterDash(
  restJoined: string,
  matchup: string,
): { team: string; body: string } | null {
  const dashIdx = restJoined.indexOf(' — ');
  if (dashIdx < 0) return null;
  const prefix = restJoined.slice(0, dashIdx).trim();
  const body = restJoined.slice(dashIdx + 3).trim();
  if (!body.includes(';')) return null;
  let team = inferTeamFromRest(prefix, matchup) ?? inferTeamFromRest(restJoined, matchup);
  if (!team) {
    const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
    team = parts[0] ?? '';
  }
  if (!team) return null;
  return { team, body };
}

function parseRestSection(
  restJoined: string,
  matchup: string,
): { team: string; slots: BingoMissingPlayerSlot[]; footnote: string | null } | null {
  const xi = parseXiSection(restJoined);
  if (xi) {
    let body = xi.body;
    let footnote: string | null = null;
    const paren = /\(([^)]+)\)\s*$/.exec(body);
    if (paren && paren.index != null) {
      footnote = paren[1]!.trim();
      body = body.slice(0, paren.index).trim();
    }
    const slots = expandSlotsFromXiBody(body);
    if (slots.length > 0) return { team: xi.team, slots, footnote };
  }

  const dashLineup = parseLineupBodyAfterDash(restJoined, matchup);
  if (dashLineup) {
    const slots = expandSlotsFromXiBody(dashLineup.body);
    if (slots.length > 0) return { team: dashLineup.team, slots, footnote: null };
  }

  const matchupTeams = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
  const team = inferTeamFromRest(restJoined, matchup) ?? matchupTeams[0] ?? '';
  if (!team) return null;

  let footnote: string | null = null;
  const parenTail = /\(([^)]+)\)\s*$/.exec(restJoined);
  if (parenTail) footnote = parenTail[1]!.trim();

  const threeMatch = /^(.+?)\s+three:\s*(.+)$/is.exec(restJoined);
  if (threeMatch) {
    const slots = slotsFromBlankTokens(threeMatch[2]!);
    if (slots.length > 0) return { team: threeMatch[1]!.trim(), slots, footnote };
  }

  if (
    /three\s+(?:gaps|starters|roles)|^three\b|three:/i.test(restJoined) ||
    /^Three\b/i.test(restJoined)
  ) {
    const afterColon = restJoined.split(':').slice(1).join(':').trim() || restJoined;
    const blankChunk = afterColon.split('—')[0]!.trim();
    const slots = slotsFromBlankTokens(blankChunk);
    if (slots.length > 0) return { team, slots, footnote };
  }

  if (/four\s+blanks/i.test(restJoined)) {
    const slots = slotsFromBlankTokens(restJoined);
    if (slots.length > 0) return { team, slots, footnote };
  }

  const blankRun = restJoined.match(/(?:___\s*·\s*)+___|___\s+and\s+___|___\s*,\s*___/gi);
  if (blankRun) {
    const count = (restJoined.match(/___/g) ?? []).length;
    const slots: BingoMissingPlayerSlot[] = [];
    for (let i = 0; i < count; i++) slots.push({ label: '?', isMissing: true });
    if (slots.length > 0) return { team, slots, footnote };
  }

  const roleBlanks = [...restJoined.matchAll(/([A-Z]{2,3})\s+___/gi)];
  if (roleBlanks.length > 0) {
    const slots = roleBlanks.map((m) => ({ label: m[1]!.toUpperCase(), isMissing: true }));
    return { team, slots, footnote };
  }

  const blankCount = (restJoined.match(/___/g) ?? []).length;
  if (blankCount > 0) {
    const slots = Array.from({ length: blankCount }, () => ({
      label: '?',
      isMissing: true,
    }));
    return { team, slots, footnote };
  }

  return null;
}

/**
 * Returns null only if the string is not a missing-player style prompt at all.
 */
export function parseMissingPlayerPromptForBingo(question: string): ParsedBingoMissingPlayerPrompt | null {
  const raw = normalizeQuestionSeparators(question.trim());
  if (!raw) return null;

  const triple = raw.split(/\s*—\s*/);
  if (triple.length < 3) return null;

  const eventTitle = triple[0]!.trim();
  const matchup = triple[1]!.trim();
  const restJoined = triple.slice(2).join(' — ');

  const parsed = parseRestSection(restJoined, matchup);
  if (!parsed || parsed.slots.length < 1) return null;

  const { year, stageLabel } = parseEventTitleParts(eventTitle);

  return {
    eventTitle,
    matchup,
    team: parsed.team,
    teamFlag: '',
    year,
    stageLabel,
    slots: parsed.slots,
    footnote: parsed.footnote,
  };
}

/** Coords for partial lineups (2–4 blanks) when no curated 11-a-side layout exists. */
export const BINGO_PARTIAL_MISSING_COORDS: Record<number, { x: number; y: number }[]> = {
  2: [
    { x: 50, y: 55 },
    { x: 50, y: 28 },
  ],
  3: [
    { x: 50, y: 76 },
    { x: 50, y: 52 },
    { x: 75, y: 28 },
  ],
  4: [
    { x: 82, y: 72 },
    { x: 50, y: 76 },
    { x: 50, y: 52 },
    { x: 50, y: 18 },
  ],
};

/** Standard 4–3–3 style grid (legacy flat fallback). */
export const BINGO_MISSING_PLAYER_COORDS: { x: number; y: number }[] = [
  { x: 50, y: 90 },
  { x: 80, y: 72 },
  { x: 65, y: 75 },
  { x: 35, y: 75 },
  { x: 20, y: 72 },
  { x: 65, y: 52 },
  { x: 50, y: 58 },
  { x: 35, y: 52 },
  { x: 75, y: 30 },
  { x: 50, y: 18 },
  { x: 25, y: 30 },
];

const SEMICOLON_LINE_Y: Record<number, number[]> = {
  4: [90, 74, 52, 20],
  5: [90, 74, 54, 42, 22],
  6: [90, 74, 54, 44, 32, 18],
};

function xCoordsForLine(playerCount: number, lineIndex: number, lineCount: number): number[] {
  if (playerCount === 1) return [50];
  if (playerCount === 2) return [42, 58];
  if (playerCount === 3) {
    if (lineIndex === lineCount - 1) return [78, 50, 22];
    return [30, 50, 70];
  }
  if (playerCount === 4) return [82, 65, 35, 18];
  return Array.from({ length: playerCount }, (_, i) =>
    playerCount === 1 ? 50 : 18 + (64 * i) / (playerCount - 1),
  );
}

/** Map semicolon-separated XI lines to pitch coords (4-2-3-1, 4-3-3, etc.). */
export function buildSemicolonLineCoords(body: string): { x: number; y: number }[] {
  let cleanBody = body.trim();
  const paren = /\(([^)]+)\)\s*$/.exec(cleanBody);
  if (paren && paren.index != null) {
    cleanBody = cleanBody.slice(0, paren.index).trim();
  }

  const lines = cleanBody.split(';').map((line) => line.trim()).filter(Boolean);
  if (lines.length < 4) return [];

  const counts = lines.map((line) => line.split(',').map((part) => part.trim()).filter(Boolean).length);
  const countKey = counts.join(',');

  if (countKey === '1,4,2,4') {
    return [
      { x: 50, y: 90 },
      { x: 82, y: 74 },
      { x: 65, y: 74 },
      { x: 35, y: 74 },
      { x: 18, y: 74 },
      { x: 42, y: 54 },
      { x: 58, y: 54 },
      { x: 78, y: 28 },
      { x: 50, y: 36 },
      { x: 22, y: 28 },
      { x: 50, y: 16 },
    ];
  }

  /** 4-3-3 — CF central (y≈12), wingers wide (LW x≈22, RW x≈78). */
  if (countKey === '1,4,3,3') {
    return [
      { x: 50, y: 90 },
      { x: 16, y: 72 },
      { x: 36, y: 78 },
      { x: 64, y: 78 },
      { x: 84, y: 72 },
      { x: 30, y: 40 },
      { x: 50, y: 52 },
      { x: 70, y: 40 },
      { x: 22, y: 24 },
      { x: 50, y: 12 },
      { x: 78, y: 24 },
    ];
  }

  /** 4-1-2-2-1 — holding DM deep, two CMs spaced, wide mids, lone CF. */
  if (countKey === '1,4,1,2,2,1') {
    return [
      { x: 50, y: 90 },
      { x: 16, y: 72 },
      { x: 34, y: 76 },
      { x: 66, y: 76 },
      { x: 84, y: 72 },
      { x: 50, y: 62 },
      { x: 34, y: 46 },
      { x: 66, y: 46 },
      { x: 22, y: 28 },
      { x: 78, y: 28 },
      { x: 50, y: 12 },
    ];
  }

  if (countKey === '1,3,4,3') {
    return [
      { x: 50, y: 90 },
      { x: 30, y: 74 },
      { x: 50, y: 74 },
      { x: 70, y: 74 },
      { x: 82, y: 52 },
      { x: 65, y: 52 },
      { x: 35, y: 52 },
      { x: 18, y: 52 },
      { x: 78, y: 20 },
      { x: 50, y: 20 },
      { x: 22, y: 20 },
    ];
  }

  if (countKey === '1,4,3,1,2') {
    return [
      { x: 50, y: 90 },
      { x: 82, y: 74 },
      { x: 65, y: 74 },
      { x: 35, y: 74 },
      { x: 18, y: 74 },
      { x: 30, y: 54 },
      { x: 50, y: 54 },
      { x: 70, y: 54 },
      { x: 50, y: 42 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
    ];
  }

  if (countKey === '1,3,5,2') {
    return [
      { x: 50, y: 90 },
      { x: 30, y: 74 },
      { x: 50, y: 74 },
      { x: 70, y: 74 },
      { x: 82, y: 52 },
      { x: 65, y: 54 },
      { x: 50, y: 52 },
      { x: 35, y: 54 },
      { x: 18, y: 52 },
      { x: 42, y: 22 },
      { x: 58, y: 22 },
    ];
  }

  const yValues = SEMICOLON_LINE_Y[lines.length] ?? lines.map((_, i) => Math.max(18, 90 - i * 14));
  const coords: { x: number; y: number }[] = [];

  lines.forEach((line, lineIndex) => {
    const parts = line.split(',').map((part) => part.trim()).filter(Boolean);
    const xs = xCoordsForLine(parts.length, lineIndex, lines.length);
    parts.forEach((_, i) => {
      coords.push({ x: xs[i] ?? 50, y: yValues[lineIndex] ?? 50 });
    });
  });

  return coords.length === 11 ? coords : [];
}

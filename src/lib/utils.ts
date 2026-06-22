import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Removes bracketed editorial asides for on-screen quiz copy. */
export function stripUiParentheticals(text: string): string {
  if (!text) return text;
  let result = text;
  let prev = "";
  while (result !== prev) {
    prev = result;
    result = result
      .replace(/\([^)]*\)/g, " ")
      .replace(/\[[^\]]*\]/g, " ");
  }
  return result.replace(/\s+/g, " ").trim();
}

/** Lowercase words (incl. "vs") unless sentence start or exception. */
const TITLE_SMALL_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "nor",
  "as",
  "at",
  "by",
  "for",
  "in",
  "of",
  "on",
  "per",
  "to",
  "from",
  "with",
  "vs",
  "v",
]);

const TITLE_UPPER_WORDS = new Set(["fifa", "ii", "iii", "iv", "vi", "vii", "viii", "ix", "xi", "xii"]);

/**
 * If the string looks like legacy ALL CAPS quiz copy, convert to readable title-style casing.
 * Leaves normal mixed-case prose unchanged. Used for World Cup Bingo (mixed pools) presentation.
 */
export function formatQuizQuestionDisplay(text: string): string {
  const raw = text.trim();
  if (!raw) return raw;

  const letters = raw.replace(/[^A-Za-z\u00C0-\u024f]/g, "");
  if (letters.length < 4) return raw;

  const upperLetters = raw.replace(/[^A-Z\u00C0-\u00DE]/g, "").length;
  const lowerLetters = raw.replace(/[^a-z\u00DF-\u00ff]/g, "").length;
  const looksShouting = lowerLetters === 0 && upperLetters >= 4;

  if (!looksShouting) {
    return raw;
  }

  return titleCasishMultiline(raw);
}

/** Title-style casing for a line; `wordIndex` starts at `startIdx` (mutated). */
function titleCasishLine(line: string, startIdx: { n: number }): string {
  return line.replace(/[A-Za-z\u00C0-\u024f]+(?:'[A-Za-z\u00C0-\u024f]+)?/g, (core) => {
    const idx = startIdx.n;
    startIdx.n += 1;
    const lower = core.toLocaleLowerCase("en");
    if (TITLE_UPPER_WORDS.has(lower) || /^xi$/i.test(core)) {
      return core.toUpperCase();
    }
    if (idx > 0 && TITLE_SMALL_WORDS.has(lower)) {
      return lower;
    }
    return lower.charAt(0).toLocaleUpperCase("en") + lower.slice(1);
  });
}

function titleCasishMultiline(text: string): string {
  const startIdx = { n: 0 };
  return text
    .split(/\n+/)
    .map((line) => titleCasishLine(line, startIdx))
    .join("\n");
}

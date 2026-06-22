import type { MissingPlayerPitchSlot } from '@/components/missing-player/MissingPlayerLineupPitch';
import type { Question } from '@/types/game';
import { findBingoMpLineupPitch } from '@/data/bingoMpLineupCatalog';
import {
  BINGO_MISSING_PLAYER_COORDS,
  buildSemicolonLineCoords,
  type BingoMissingPlayerSlot,
  type ParsedBingoMissingPlayerPrompt,
} from '@/lib/missingPlayerBingoPrompt';
import { getMissingPlayerTeamFlag } from '@/lib/countryFlags';
import { getCorrectAnswerPlayerNames } from '@/lib/missingPlayerBingoAnswers';

export { getCorrectAnswerPlayerNames } from '@/lib/missingPlayerBingoAnswers';

function labelForSlot(slot: BingoMissingPlayerSlot): string {
  if (slot.isMissing) return '???';
  const cleaned = slot.label
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/\?+$/, '')
    .replace(/___/g, '')
    .trim();
  return cleaned || '???';
}

/** Full 11-a-side grid from an `XI:` prompt when catalog lookup misses. */
export function buildPitchFromParsedXiSlots(
  parsed: ParsedBingoMissingPlayerPrompt,
  questionText?: string,
): MissingPlayerPitchSlot[] {
  if (parsed.slots.length !== 11) return [];

  let semicolonCoords: { x: number; y: number }[] = [];
  if (questionText) {
    const triple = questionText.split(/\s*—\s*/);
    const restJoined = triple.slice(2).join(' — ');
    const xiMatch =
      /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:\s*(.+)$/is.exec(restJoined) ??
      /^(.+?)\s+XI\s*:\s*(.+)$/is.exec(restJoined);
    if (xiMatch?.[2]) {
      semicolonCoords = buildSemicolonLineCoords(xiMatch[2]);
    }
  }

  const coords =
    semicolonCoords.length === 11 ? semicolonCoords : BINGO_MISSING_PLAYER_COORDS;

  const flag = parsed.teamFlag || getMissingPlayerTeamFlag(parsed.team);
  return parsed.slots.map((slot, i) => {
    const c = coords[i]!;
    const missing = slot.isMissing;
    return {
      name: labelForSlot(slot),
      flag,
      x: c.x,
      y: c.y,
      isMissing: missing,
    };
  });
}

export function resolveBingoLineupPitch(
  parsed: ParsedBingoMissingPlayerPrompt,
  question: Question,
): MissingPlayerPitchSlot[] {
  const fromCatalog = findBingoMpLineupPitch(parsed, question);
  if (fromCatalog && fromCatalog.length === 11) return fromCatalog;

  const fromXi = buildPitchFromParsedXiSlots(parsed, question.question);
  if (fromXi.length === 11) return fromXi;

  // Never show the 2–4 gold-dot partial fallback — full XI from catalog only.
  return [];
}

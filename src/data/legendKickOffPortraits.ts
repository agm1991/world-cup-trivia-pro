/**
 * Per-tournament portraits for Kick Off, level tiles, and Player Game header.
 *
 * **Asset naming** (files in `src/assets/kickoff-portraits/`):
 *   `{playerId}-wc{year}.{jpg|jpeg|png|webp}`
 * Example: `messi-wc2014.jpg`, `ronaldo-r9-wc2002.jpg`
 *
 * Images should be solo head/shoulders portraits from the correct World Cup cycle
 * (era-accurate look). Vite bundles every matching file; add new files and rebuild.
 *
 * `getLegendKickOffPortraitUrl` falls back to the Select a Legend roster image when
 * no per-year file exists.
 */
const portraitModules = import.meta.glob<{ default: string }>(
  '@/assets/kickoff-portraits/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

const OVERRIDES: Record<string, string> = {};

const FILE_RE = /^([a-z0-9-]+)-wc(\d{4})\.(jpg|jpeg|png|webp)$/i;

for (const modPath of Object.keys(portraitModules)) {
  const file = modPath.split('/').pop() ?? '';
  const m = file.match(FILE_RE);
  if (!m) continue;
  const playerId = m[1];
  const year = m[2];
  const mod = portraitModules[modPath];
  const url = mod?.default;
  if (url) OVERRIDES[`${playerId}:${year}`] = url;
}

export function getLegendKickOffPortraitUrl(
  playerId: string,
  wcYear: number,
  fallback: string | undefined,
): string | undefined {
  const key = `${playerId}:${wcYear}`;
  return OVERRIDES[key] ?? fallback;
}

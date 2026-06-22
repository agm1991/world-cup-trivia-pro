/**
 * IDs from `*AuthorVerbatimTiles` files (e.g. `ev-av-2014-01`, `ml-av-1998-03`).
 * Used to preserve authored prompts through dedupe and career-aggregate filters.
 */
export function isAuthorVerbatimLegendId(id: string): boolean {
  return /-av-(19|20)\d{2}-\d+/.test(id);
}

# Player kickoff screen — Composer prompt + reference screenshot

Use this as one block when asking for changes to `src/pages/PlayerKickOff.tsx`.

## Reference screenshot

Cursor may attach chat screenshots under your project’s Cursor assets folder, e.g.:

`~/.cursor/projects/Users-abelghebremichael-Documents-world-cup-trivia-pro/assets/Screenshot_2026-03-24_at_22.11.39-*.png`

Drop any updated screenshot there and replace the glob with the exact filename if you need a permanent link in docs.

Example URL while testing: `http://localhost:8080/player-kickoff/maradona/4`

## Original prompt (Composer)

> revert back with flags, but fix it please make it structured well.

## Follow-up requirements (same thread)

1. **Layout:** Host flag **inside the card only** — not full-viewport bleed alone; rounded card, flag as `background-image` covering the whole card face, with dark gradients on top for readability.
2. **Proportions:** Move FIFA World Cup / player / host / year toward the **lower half** of the card; keep the **play control inside the same card** at the bottom.
3. **Gold styling:** Match legend player titles and level tiles:
   - `category-title-animated` — FIFA World Cup, player name, host short label (e.g. USA), play button label.
   - `animate-flicker-gold` — large year digits (e.g. 1994).
4. **Background note:** Keep the **host flag as full-bleed within the card** (cover + overlays), not removed.
5. **Later tweaks:**
   - Remove **“Level N · Country”** line.
   - Remove **small flag** under the year (was emoji flags from summary text).
   - Put the **host flag image inside the bottom play box** next to the “USA 1994” label (use `getWorldCupHostFlagImageUrl`; correct host per World Cup year).

## Implementation map

| Requirement | Where |
|-------------|--------|
| Flag fills card | `getWorldCupHostFlagImageUrl(wcYear, 1920)` on absolute layer in card |
| Lower-half hero | Flex spacer + `justify-end` on hero column |
| Gold titles | `category-title-animated` |
| Gold year | `animate-flicker-gold` |
| Flag in button | `<img src={getWorldCupHostFlagImageUrl(wcYear, 256)} />` inside play `<button>` |

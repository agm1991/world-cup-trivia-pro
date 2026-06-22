# Manager Images – Sources & Maintenance

Portraits live in `src/assets/managers/` and are wired in `ManagersSelect.tsx` (one image per manager per country category).

## Regenerating / adding images

```bash
node scripts/fetch-manager-images.mjs
```

The script pulls **Wikipedia** lead thumbnails (and **Wikidata P18** as fallback), with slow requests to avoid rate limits. It **skips** filenames that already exist so your hand-picked assets stay put.

Some files were added manually from **English Wikipedia** `upload.wikimedia.org` (e.g. Stephen Keshi, Craig Brown) where the lead image is not on Commons; those may be subject to **fair use** on Wikipedia—verify licensing if you distribute the app publicly.

## Already in the project (examples)

| Region | Notes |
|--------|--------|
| Australia | Guus Hiddink, Pim Verbeek, Ange Postecoglou (Commons) |
| France | Raymond Domenech, Laurent Blanc (on-disk assets) + others from script |
| England / Italy / etc. | Mix of existing assets + downloads |

## Still using placeholder (no API thumbnail / Wikidata P18)

`node scripts/fetch-manager-images.mjs` could not resolve a Wikipedia `pageimages` thumbnail or Wikidata **P18** Commons file for:

- **Andy Roxburgh** (Scotland)
- **Sunday Oliseh** (Nigeria)
- **Shuaibu Amodu** (Nigeria)
- **Lamine Diop** (Senegal)
- **Nasser Al-Johar** (Saudi Arabia)

These cards use `src/assets/managers/placeholder-manager.svg` (neutral silhouette — **not** another coach’s photo). When you add a real portrait, save as `kebab-case` under `src/assets/managers/`, wire the import in `ManagersSelect.tsx`, and replace `placeholderImg` for that row only.

### UI: faces clipped in cards

Manager and “Guess Who” image cards use **`object-top`** so portrait crops favour the head/shoulders instead of cutting off the top of the face when the container is shorter than the photo.

## License note

Wikimedia Commons files are often **CC BY** / **CC BY-SA**. English Wikipedia-only files may be **non-free**; check each file page before commercial use.

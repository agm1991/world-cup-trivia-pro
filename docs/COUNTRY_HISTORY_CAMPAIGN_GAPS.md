# Country History — campaigns without a playable 10-question quiz

Regenerate with:

```bash
npx tsx scripts/scan-country-history-campaign-gaps.mts
```

## Rules (matches `CountryGame.tsx`)

For each FIFA appearance `(country, year)` in `WORLD_CUP_NATIONS`:

1. If `getCampaignQuestions(countryName, year)` returns **≥ 10** items → playable.
2. If it returns **1–9** → **broken** in the UI today (campaign exists but quiz does **not** fall back to bank questions).
3. If it returns **0** → playable only when **≥ 10** `countryHistoryQuestions` items match **year tags** (`id` contains `-YYYY-`/`_YYYY_`, **or** `question` mentions that year).

Any year that fails (3) and is not satisfied by (1) is listed below — **78** gaps as of last scan output.

---

## By country (`country · years`)

| Country | Missing years |
|------|----------------|
| **Belgium** | 1930, 1934, 1970, 1982, 1986, 1990, 1994, 1998, 2002, 2014, 2018, 2022 |
| **Costa Rica** | 1990, 2014, 2018 |
| **Czechoslovakia** | 1934, 1958, 1962, 1970, 1982, 1990 |
| **East Germany** | 1974 (only **8/10** year-tagged bank questions — add **2**) |
| **Mexico** | 1930, 1958, 1962, 1966, 1970, 1978, 1986, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022 |
| **Paraguay** | 1930, 1958, 1986, 1998 |
| **Poland** | 2002, 2006, 2018, 2022 |
| **Portugal** | 1966, 1986, 2002, 2006, 2010 |
| **Saudi Arabia** | 1994, 1998, 2002, 2018 |
| **Scotland** | 1954, 1958, 1982, 1986, 1990, 1998 |
| **Soviet Union** | 1970, 1990 |
| **Switzerland** | 2006, 2010, 2014, 2018, 2022 |
| **United States** | 1930, 1934, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2022 |
| **Yugoslavia** | 1954 |

## Fix options

- Add a **`campaignQuestions`** block for that **country lowercase key** + **year** (preferred), **or**
- Add **≥ 10** `countryHistoryQuestions` entries whose **ids**/wording reliably tag that **`year`** (fallback path).

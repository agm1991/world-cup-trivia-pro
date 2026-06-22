#!/usr/bin/env npx tsx
/**
 * Country History playable gap scan (matches `/country-game/:code/:year` logic in CountryGame.tsx):
 * - If `getCampaignQuestions(countryName, year)` has ≥10 items → playable from campaign DB.
 * - Else if campaign has 1–9 items → **broken** (UI returns no questions — does not fall back).
 * - Else if campaign empty → playable only if ≥10 bank questions match `isQuestionAboutWorldCupYear`.
 *
 * Usage: `npx tsx scripts/scan-country-history-campaign-gaps.mts`
 */
import type { Question } from '../src/types/game.ts';
import { WORLD_CUP_NATIONS } from '../src/data/worldCupAppearances.ts';
import { getCampaignQuestions } from '../src/data/campaignQuestions.ts';
import { getCountryQuestions } from '../src/data/countryHistoryQuestions.ts';

const TARGET = 10;

/** Same heuristic as CountryGame.tsx */
function isQuestionAboutWorldCupYear(q: Question, year: number): boolean {
  const y = String(year);
  if (q.id.includes(`-${year}-`) || q.id.includes(`-${year}_`)) return true;
  return new RegExp(`\\b${year}\\b`).test(q.question);
}

type Missing = { country: string; code: string; year: number; bankYearCount: number };
type Orphan = { country: string; code: string; year: number; campaignCount: number };

const playableGaps: Missing[] = [];
const orphanCampaigns: Orphan[] = [];

for (const row of WORLD_CUP_NATIONS) {
  const name = row.name;
  const code = row.code.trim();
  const bank = getCountryQuestions(code.toUpperCase());

  for (const year of row.worldCupYears) {
    const cq = getCampaignQuestions(name, year);
    if (cq.length >= TARGET) continue;

    if (cq.length > 0 && cq.length < TARGET) {
      orphanCampaigns.push({ country: name, code, year, campaignCount: cq.length });
      continue;
    }

    const bankYearCount = bank.filter((q) => isQuestionAboutWorldCupYear(q, year)).length;
    if (bankYearCount < TARGET) {
      playableGaps.push({ country: name, code, year, bankYearCount });
    }
  }
}

const appearanceYears = WORLD_CUP_NATIONS.reduce((s, r) => s + r.worldCupYears.length, 0);

console.log(`Country History — campaigns that cannot run a ${TARGET}-question quiz\n`);
console.log(`(Same rules as CountryGame.tsx — campaign-first, id/year text fallback.)\n`);
console.log(`Nations: ${WORLD_CUP_NATIONS.length} · FIFA appearance-years: ${appearanceYears}\n`);

console.log(`=== Missing (${playableGaps.length}) — add campaign block OR ≥${TARGET} bank questions with ids/text for that year ===\n`);

if (playableGaps.length === 0) {
  console.log('(none)\n');
} else {
  const sorted = [...playableGaps].sort((a, b) => a.country.localeCompare(b.country) || a.year - b.year);
  for (const g of sorted) {
    console.log(`${g.country} · ${g.year} · code ${g.code} · bankTagged ${g.bankYearCount}/${TARGET}`);
  }
}

console.log(
  `\n=== Broken partial campaigns (${orphanCampaigns.length}) — 1–9 campaign questions (${TARGET} required; no bank fallback in UI) ===\n`,
);
if (orphanCampaigns.length === 0) {
  console.log('(none)\n');
} else {
  const sorted = [...orphanCampaigns].sort((a, b) => a.country.localeCompare(b.country) || a.year - b.year);
  for (const o of sorted) {
    console.log(`${o.country} · ${o.year} · code ${o.code} · campaign ${o.campaignCount}/${TARGET}`);
  }
}

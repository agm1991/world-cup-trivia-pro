#!/usr/bin/env node
/**
 * Validates Destiny Route data:
 * - All opponents in routes must exist in countryToFlag
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../src/data/destinyRouteQuestions.ts');

const file = readFileSync(DATA_PATH, 'utf-8');

// Extract countryToFlag keys - supports both 'Key Name': 'flag' and Key: 'flag'
const countryToFlag = {};
const flagStart = file.indexOf('countryToFlag: Record');
const flagEnd = file.indexOf('};', flagStart);
const flagSection = file.slice(flagStart, flagEnd);
for (const m of flagSection.matchAll(/(?:'([^']+)'|([A-Za-z][A-Za-z0-9]*)):\s*'[^']+'/g)) {
  const key = (m[1] || m[2] || '').trim();
  if (key) countryToFlag[key] = true;
}

// Extract all opponents from route arrays: ['X', 'Y', 'Z'] or ["X", "Y"]
const opponents = new Set();
for (const m of file.matchAll(/\d{4}:\s*\[([^\]]+)\]/g)) {
  const items = m[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
  items.forEach((o) => opponents.add(o));
}

// Validate
let errors = 0;
const missing = [];

for (const opp of opponents) {
  if (!opp) continue;
  if (!countryToFlag[opp]) {
    errors++;
    missing.push(opp);
    console.error(`❌ Missing flag: "${opp}"`);
  }
}

if (missing.length > 0) {
  console.log('\n📋 Add these to countryToFlag:', [...new Set(missing)].sort().join(', '));
}

const total = opponents.size;
console.log(`\n✅ Validated ${total} unique opponents`);
if (errors === 0) {
  console.log('✅ All opponents have flags in countryToFlag');
} else {
  console.log(`❌ ${errors} opponent(s) missing from countryToFlag`);
  process.exit(1);
}

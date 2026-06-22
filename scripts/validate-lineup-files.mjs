/**
 * Guard against corrupted missing-player lineup data (truncated arrays, double export).
 * Run before dev/build so Vite does not fail with obscure "Unexpected eof" errors.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LINEUP_DIRS = [
  path.join(ROOT, 'src/data/mediumLineups'),
];
const LINEUP_FILES = [
  path.join(ROOT, 'src/data/missingPlayerLineupLevels1to6.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels7.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels8.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels9.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels10.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels11.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels12.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels13.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels14.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels15.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels16.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels17.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels18.frozen.ts'),
  path.join(ROOT, 'src/data/missingPlayerLineupLevels7to17.ts'),
  path.join(ROOT, 'src/pages/MissingPlayerGame.tsx'),
];

const errors = [];

function checkLineupArrayFile(fp) {
  const rel = path.relative(ROOT, fp);
  const text = fs.readFileSync(fp, 'utf8');

  if (text.includes('export export')) {
    errors.push(`${rel}: contains "export export" (duplicate export keyword)`);
  }

  const exportNames = [...text.matchAll(/\bexport (?:const|function|class|type|interface|enum) (\w+)/g)].map((m) => m[1]);
  const reExportNames = [...text.matchAll(/\bexport \{([^}]+)\}/g)].flatMap((m) =>
    m[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim()),
  );
  const seen = new Set();
  for (const name of [...exportNames, ...reExportNames]) {
    if (seen.has(name)) errors.push(`${rel}: duplicate export "${name}"`);
    seen.add(name);
  }

  // Single-file level modules only (not the combined 7–17 registry).
  if (!rel.includes('mediumLineups/')) return;

  if (/export const LEVEL_\d+.*=\s*\[/.test(text) && !/\];\s*$/.test(text.trimEnd())) {
    errors.push(`${rel}: LEVEL array not closed with ];`);
  }
}

for (const dir of LINEUP_DIRS) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('level') && name.endsWith('.ts')) {
      checkLineupArrayFile(path.join(dir, name));
    }
  }
}

for (const fp of LINEUP_FILES) {
  if (fs.existsSync(fp)) {
    checkLineupArrayFile(fp);
  }
}

if (errors.length) {
  console.error('Lineup validation failed:\n');
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

try {
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' });
} catch (e) {
  console.error('TypeScript check failed:\n');
  console.error(e.stdout?.toString() || e.message);
  process.exit(1);
}

console.log('Lineup files OK');

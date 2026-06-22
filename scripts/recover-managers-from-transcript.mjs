#!/usr/bin/env node
/**
 * Recover World Cup Managers questions + routing from agent transcript.
 * Replays StrReplace edits (before fact-check) then runs all patch scripts in order.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TRANSCRIPT = path.join(
  process.env.HOME,
  '.cursor/projects/Users-abelghebremichael-Documents-world-cup-trivia-pro/agent-transcripts/3741b4bd-f701-42b1-841d-029dd7311513/3741b4bd-f701-42b1-841d-029dd7311513.jsonl',
);

const FACT_CHECK_START_LINE = 274;

const PATCH_ORDER = [
  '_patch-france-eng-managers-questions.mjs',
  '_patch-germany-managers-questions.mjs',
  '_patch-hungary-italy-managers-questions.mjs',
  '_patch-morocco-ned-nor-pol-managers.mjs',
  '_patch-irl-sau-sen-kor-sov-managers.mjs',
  '_patch-esp-swe-tur-uru-managers.mjs',
  '_patch-alg-aut-por-rou-usa-managers.mjs',
  '_patch-bul-eng-managers.mjs',
  'patch-managers-gha-ned-por-swe.mjs',
  'patch-managers-thys-piontek-hiddink-westerhof-piechniczek.mjs',
  'patch-managers-osim-yug.mjs',
  'patch-managers-vicini-okada-herrera.mjs',
  'patch-managers-martino-rappan.mjs',
  'patch-managers-batch6.mjs',
  'patch-managers-batch7.mjs',
];

function readTranscriptStrReplaces() {
  const lines = fs.readFileSync(TRANSCRIPT, 'utf8').split('\n').filter(Boolean);
  const events = [];
  for (let i = 0; i < lines.length; i++) {
    if (i + 1 >= FACT_CHECK_START_LINE) break;
    let obj;
    try {
      obj = JSON.parse(lines[i]);
    } catch {
      continue;
    }
    for (const block of obj.message?.content || []) {
      if (block.type !== 'tool_use' || block.name !== 'StrReplace') continue;
      const inp = block.input;
      if (!inp?.path?.includes('managersQuestions.ts') && !inp?.path?.includes('ManagersGame.tsx')) continue;
      if (!inp.old_string || !inp.new_string) continue;
      events.push({
        line: i + 1,
        relPath: inp.path.replace(/.*world-cup-trivia-pro\//, ''),
        old_string: inp.old_string,
        new_string: inp.new_string,
      });
    }
  }
  return events;
}

function applyStrReplaces(events) {
  let applied = 0;
  let skipped = 0;
  for (const ev of events) {
    const filePath = path.join(ROOT, ev.relPath);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(ev.old_string)) {
      console.warn(`SKIP line ${ev.line} ${ev.relPath}`);
      skipped++;
      continue;
    }
    content = content.replace(ev.old_string, ev.new_string);
    fs.writeFileSync(filePath, content);
    applied++;
  }
  console.log(`StrReplace: applied ${applied}, skipped ${skipped}`);
}

function runPatches() {
  const patchDir = path.join(__dirname, 'recovery');
  for (const name of PATCH_ORDER) {
    const script = path.join(patchDir, name);
    console.log('Running', name);
    execSync(`node "${script}"`, { cwd: ROOT, stdio: 'inherit' });
  }
}

/** Re-apply France block if esp-swe removed markers (insert before Sebes). */
function ensureFranceBlock() {
  const franceScript = path.join(__dirname, 'recovery', '_patch-france-eng-managers-questions.mjs');
  let script = fs.readFileSync(franceScript, 'utf8');
  const fallback = `
if (start === -1 || end === -1) {
  const insertMarker = '  // Gusztáv Sebes - Hungary 1954 World Cup Campaign';
  const insertIdx = content.indexOf(insertMarker);
  if (insertIdx === -1) {
    console.error('Could not find France or Sebes markers');
    process.exit(1);
  }
  content = content.slice(0, insertIdx) + franceBlock + '\\n\\n' + content.slice(insertIdx);
  fs.writeFileSync(file, content);
  console.log('Patched France manager questions (fallback before Sebes)');
  process.exit(0);
}
`;
  if (!script.includes('fallback before Sebes')) {
    script = script.replace(
      "if (start === -1 || end === -1) {\n  console.error('Could not find replacement markers');\n  process.exit(1);\n}",
      fallback.trim(),
    );
    fs.writeFileSync(franceScript, script);
  }
  execSync(`node "${franceScript}"`, { cwd: ROOT, stdio: 'inherit' });
}

function validate() {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/managersQuestions.ts'), 'utf8');
  const prefixes = [...src.matchAll(/id: '([a-z0-9]+-[a-z0-9]+)-\d+'/g)].map(m => m[1]);
  const map = new Map();
  for (const p of prefixes) map.set(p, (map.get(p) || 0) + 1);
  const mgrPrefixes = [...map.keys()].filter(p => !p.startsWith('mgr-'));
  const bad = [...map.entries()].filter(([p, c]) => c !== 10 && !p.startsWith('mgr-'));
  console.log('\nValidation:');
  console.log('  Total questions:', prefixes.length);
  console.log('  Manager prefixes:', mgrPrefixes.length);
  console.log('  Prefixes not exactly 10:', bad.length);
  if (bad.length) bad.slice(0, 30).forEach(([p, c]) => console.log('   ', p, c));
}

console.log('Resetting to git HEAD baseline...');
execSync('git checkout HEAD -- src/data/managersQuestions.ts src/pages/ManagersGame.tsx', { cwd: ROOT });

const events = readTranscriptStrReplaces();
console.log(`Found ${events.length} StrReplace events before line ${FACT_CHECK_START_LINE}`);
applyStrReplaces(events);
runPatches();
ensureFranceBlock();
execSync(`node "${path.join(__dirname, 'recovery/patch-delbosque-if-missing.mjs')}"`, { cwd: ROOT, stdio: 'inherit' });
validate();

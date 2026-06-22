/**
 * Triple-pass audit for World Cup Managers category.
 * Report-only — never modifies question text.
 *
 *   node scripts/audit-managers-triple-scan.mjs
 *   node scripts/audit-managers-triple-scan.mjs --pass 2
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUESTIONS = path.join(ROOT, 'src/data/managersQuestions.ts');
const COUNTRIES = path.join(ROOT, 'src/data/managersCountries.ts');
const GAME = path.join(ROOT, 'src/pages/ManagersGame.tsx');

/** Curated factual flags (verified externally). Report only. */
const FACT_CHECKS = [
  {
    id: 'westerhof-nga-3',
    severity: 'error',
    issue: 'Nigeria\'s first-ever WC match (1994) was a 3-0 win vs Bulgaria, not Greece.',
    source: 'FIFA/RSSSF Group D',
  },
  {
    id: 'scaloni-arg-6',
    severity: 'warning',
    issue: 'hint2 says "Won Golden Boot" — Messi was top scorer for Argentina (7) but Mbappé won the Golden Boot (8).',
    source: 'FIFA 2022 awards',
  },
  {
    id: 'hiddink-aus-5',
    severity: 'error',
    issue: 'Croatia equalizer (79\') was scored by Harry Kewell; Aloisi assisted with a flick-on.',
    source: 'Socceroos.com / BBC 2006',
  },
  {
    id: 'penev-bul-1',
    severity: 'error',
    issue: 'Penev\'s nickname is "The Strategist" (Strategist from Mirovyane), not "The Professor".',
    source: 'UEFA / Wikipedia',
  },
  {
    id: 'scolari-bra-9',
    severity: 'error',
    issue: 'Bicycle kick vs Costa Rica (2002) was scored by Edmílson; Roque Júnior did not play that match.',
    source: 'BBC Sport / FIFA',
  },
  {
    id: 'scolari-por-7',
    severity: 'warning',
    issue: '"12-match World Cup winning streak" overstates — streak includes Brazil 2002 wins; Portugal 2006 semi loss ended run.',
    source: 'wording review',
  },
  {
    id: 'mgr-easy-3',
    severity: 'warning',
    issue: '"Current England manager" — answer/hints may go stale (Southgate left; Tuchel appointed 2025).',
    source: 'time-sensitive',
  },
  {
    id: 'mgr-easy-1',
    severity: 'info',
    issue: 'hint2 "Youngest manager at 2022 World Cup" — verify vs other nations\' managers if challenged.',
    source: 'wording review',
  },
  {
    id: 'hiddink-aus-9',
    severity: 'warning',
    issue: 'Viduka was striker/captain, not a centre-back pairing anchor.',
    source: '2006 squad sheet',
  },
  {
    id: 'meisl-aut-9',
    severity: 'info',
    issue: '"Greatest goalscorer in football history" for Bican is debatable vs Pelé/Ronaldo/Messi records.',
    source: 'wording review',
  },
  {
    id: 'westerhof-nga-10',
    severity: 'info',
    issue: 'Claim about personally funding Lagos national training complex — verify off-pitch legacy.',
    source: 'wording review',
  },
  {
    id: 'myung-nkp-2',
    severity: 'info',
    issue: 'North Korea 1966 anthem compromise — verify "banned until quarter-final" detail.',
    source: '1966 WC history',
  },
];

function pickQuoted(block, key) {
  const idx = block.indexOf(`${key}:`);
  if (idx < 0) return undefined;
  const rest = block.slice(idx + key.length + 1).trimStart();
  const q = rest[0];
  if (q !== "'" && q !== '"') return undefined;
  let i = 1;
  let out = '';
  while (i < rest.length) {
    const ch = rest[i];
    if (ch === '\\') {
      out += rest[i + 1] ?? '';
      i += 2;
      continue;
    }
    if (ch === q) return out;
    out += ch;
    i += 1;
  }
  return undefined;
}

function parseQuestions(text) {
  const idRe = /^\s+id: '([^']+)',/gm;
  const anchors = [];
  let m;
  while ((m = idRe.exec(text)) !== null) {
    anchors.push({ id: m[1], start: m.index });
  }
  return anchors.map((anchor, i) => {
    const end = i + 1 < anchors.length ? anchors[i + 1].start : text.indexOf('\n];', anchor.start);
    const block = text.slice(anchor.start, end);
    const pickLetter = (key) => {
      const hit = new RegExp(`${key}: '([A-D])'`).exec(block);
      return hit?.[1];
    };
    return {
      id: anchor.id,
      category: pickQuoted(block, 'category'),
      difficulty: pickQuoted(block, 'difficulty'),
      question: pickQuoted(block, 'question'),
      optionA: pickQuoted(block, 'optionA'),
      optionB: pickQuoted(block, 'optionB'),
      optionC: pickQuoted(block, 'optionC'),
      optionD: pickQuoted(block, 'optionD'),
      correctAnswer: pickLetter('correctAnswer'),
      hint1: pickQuoted(block, 'hint1'),
      hint2: pickQuoted(block, 'hint2'),
      hint3: pickQuoted(block, 'hint3'),
    };
  });
}

function prefix(id) {
  const m = id.match(/^(.+)-(\d+)$/);
  return m ? m[1] : id;
}

function routingPrefixes(gameText) {
  return [...gameText.matchAll(/startsWith\('([^']+)'\)/g)].map((m) => m[1]);
}

function catalogManagers(countriesText) {
  return [...countriesText.matchAll(/\{\s*name: '([^']+)'/g)]
    .map((m) => m[1])
    .filter((name) => !['Algeria', 'Argentina', 'Australia'].includes(name) || true);
}

function pass1Structure(questions) {
  const findings = [];
  const ids = questions.map((q) => q.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) findings.push({ level: 'error', msg: `Duplicate IDs: ${[...new Set(dupes)].join(', ')}` });

  if (questions.length !== 900) {
    findings.push({ level: 'error', msg: `Expected 900 questions, found ${questions.length}` });
  }

  for (const q of questions) {
    if (q.category !== 'managers') findings.push({ level: 'error', msg: `${q.id}: category is "${q.category}"` });
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer ?? '')) {
      findings.push({ level: 'error', msg: `${q.id}: invalid correctAnswer "${q.correctAnswer}"` });
    }
    for (const field of ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'hint1', 'hint2', 'hint3']) {
      if (!q[field]?.trim()) findings.push({ level: 'error', msg: `${q.id}: missing ${field}` });
    }
    const opt = q[`option${q.correctAnswer}`];
    if (opt && q.hint3 && opt.replace(/^"|"$/g, '').toLowerCase() === q.hint3.toLowerCase()) {
      // hint3 often intentionally gives away the answer — skip noise in pass 1
    }
  }

  const byPrefix = {};
  for (const q of questions) {
    const p = prefix(q.id);
    (byPrefix[p] ??= []).push(q.id);
  }
  for (const [p, list] of Object.entries(byPrefix)) {
    if (list.length !== 10) findings.push({ level: 'error', msg: `Prefix ${p} has ${list.length} questions (expected 10)` });
    for (let i = 1; i <= 10; i++) {
      const expected = `${p}-${i}`;
      if (!list.includes(expected)) findings.push({ level: 'error', msg: `Missing ${expected}` });
    }
  }

  return { findings, byPrefix };
}

function pass2Routing(questions, gameText, countriesText) {
  const findings = [];
  const routes = routingPrefixes(gameText);
  const managerPrefixes = [...new Set(questions.map((q) => prefix(q.id)).filter((p) => !p.startsWith('mgr-')))];
  const orphans = managerPrefixes.filter((p) => !routes.some((r) => r.startsWith(`${p}-`)));
  for (const p of orphans) {
    findings.push({ level: 'warning', msg: `Question prefix "${p}" has no ManagersGame routing (orphan set)` });
  }

  const managerNames = [...countriesText.matchAll(/name: '([^']+)',\s*image:/g)].map((m) => m[1]);
  findings.push({ level: 'info', msg: `Catalog: ${managerNames.length} managers across countries file` });
  findings.push({ level: 'info', msg: `Routing: ${routes.length} startsWith handlers` });
  findings.push({ level: 'info', msg: `Dedicated sets: ${managerPrefixes.length} manager prefixes + 3 generic (mgr-easy/med/hard)` });

  const blancInCatalog = /Blanc|Prandelli/.test(countriesText);
  if (!blancInCatalog) {
    if (managerPrefixes.includes('blanc-fra')) {
      findings.push({ level: 'warning', msg: 'blanc-fra questions exist + routed, but Laurent Blanc not in managersCountries catalog' });
    }
    if (managerPrefixes.includes('prandelli-ita')) {
      findings.push({ level: 'warning', msg: 'prandelli-ita questions exist but no routing and not in catalog' });
    }
  }

  return { findings, managerPrefixes, routes };
}

function pass3Facts(questions) {
  const findings = [];
  const byId = Object.fromEntries(questions.map((q) => [q.id, q]));

  for (const check of FACT_CHECKS) {
    const q = byId[check.id];
    if (!q) {
      findings.push({ level: 'error', msg: `Curated check target missing: ${check.id}` });
      continue;
    }
    findings.push({
      level: check.severity,
      msg: `[${check.id}] ${check.issue} (${check.source})`,
    });
  }

  for (const q of questions) {
    if (/current|today|recently|still manages/i.test(q.question)) {
      findings.push({ level: 'info', msg: `${q.id}: time-sensitive wording in question` });
    }
  }

  return { findings };
}

function runPass(n, questions, gameText, countriesText, pass1Extra) {
  if (n === 1) return pass1Structure(questions);
  if (n === 2) return pass2Routing(questions, gameText, countriesText);
  if (n === 3) return pass3Facts(questions);
  throw new Error(`Invalid pass ${n}`);
}

function summarize(findings) {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const f of findings) counts[f.level] = (counts[f.level] ?? 0) + 1;
  return counts;
}

const onlyPass = process.argv.includes('--pass')
  ? Number(process.argv[process.argv.indexOf('--pass') + 1])
  : null;

const qText = fs.readFileSync(QUESTIONS, 'utf8');
const cText = fs.readFileSync(COUNTRIES, 'utf8');
const gText = fs.readFileSync(GAME, 'utf8');
const questions = parseQuestions(qText);

console.log('=== World Cup Managers — Triple Scan (report only) ===\n');
console.log(`Parsed ${questions.length} questions from managersQuestions.ts\n`);

const allFindings = [];
const passes = onlyPass ? [onlyPass] : [1, 2, 3];
const passNames = { 1: 'Structure & schema', 2: 'Routing & catalog sync', 3: 'Factual risk flags' };

for (const n of passes) {
  console.log(`--- Pass ${n}: ${passNames[n]} ---`);
  const result = runPass(n, questions, gText, cText);
  const findings = result.findings ?? result;
  allFindings.push(...findings.map((f) => ({ ...f, pass: n })));
  const counts = summarize(findings);
  console.log(`  errors: ${counts.error}, warnings: ${counts.warning}, info: ${counts.info}`);
  for (const f of findings.filter((x) => x.level === 'error')) console.log(`  ERROR  ${f.msg}`);
  for (const f of findings.filter((x) => x.level === 'warning')) console.log(`  WARN   ${f.msg}`);
  console.log('');
}

if (passes.length === 3) {
  const totals = summarize(allFindings);
  const structural = allFindings.filter((f) => f.pass === 1 && f.level === 'error');
  console.log('=== Triple-scan totals ===');
  console.log(`  factual/structural flags: ${totals.error} errors, ${totals.warning} warnings, ${totals.info} info`);
  console.log('  Questions were NOT modified.');
  if (structural.length > 0) process.exitCode = 1;
}

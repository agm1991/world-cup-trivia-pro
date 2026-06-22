/**
 * Fix Missing Player tactics for levels 3–10: Wikipedia 4-2-3-1 / 4-4-2 coords, no overlaps.
 * Updates x/y only in MissingPlayerGame (by array index) and slot coords in L7–L10 files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const C = {
  gk: [50, 90],
  rb: [84, 72],
  rcb: [66, 76],
  lcb: [34, 76],
  lb: [16, 72],
  lcb3: [22, 72],
  cb: [50, 72],
  rcb3: [78, 72],
  lwb: [12, 46],
  rwb: [88, 46],
  ldm: [32, 56],
  rdm: [68, 56],
  dm: [50, 58],
  lcm: [22, 46],
  rcm: [78, 46],
  cam: [50, 36],
  lw: [18, 22],
  rw: [82, 22],
  st: [50, 10],
  lst: [32, 16],
  rst: [68, 16],
  lm: [18, 28],
  rm: [82, 28],
};

function r(...keys) {
  return keys.map((k) => {
    const c = C[k];
    if (!c) throw new Error(`Unknown role ${k}`);
    return c;
  });
}

/** allLineupQuestions array index → 11 [x,y] in slot order */
const INDEX_COORDS = {
  // L3/L6 shared
  50: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'rw', 'rdm', 'ldm', 'lw', 'cam', 'st'), // Italy 2006 final id51
  51: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lw', 'ldm', 'rdm', 'rw', 'st', 'cam'), // France 2006 final id52 Zidane missing CAM
  52: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Germany 2006 semi id53 Podolski missing LW
  53: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lm', 'rm', 'lst', 'rst'), // Brazil 2006 QF id54 4-4-2
  54: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rm', 'rcm', 'lcm', 'lm', 'st'), // England 2006 QF id55
  55: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'rcm', 'dm', 'lm', 'st', 'rw'), // Spain 2006 R16 id56 Villa missing RW
  57: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Portugal 2006 id58
  // L3 extras
  19: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Portugal 2018 id20
  16: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'cam', 'st', 'lw'), // Spain 2018 R16 id17 Costa missing ST
  17: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Germany 2018 id18
  71: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Japan 2022 id72 Mitoma missing LW
  // L4
  30: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'lw', 'rw', 'st'), // Spain 2010 final id31 Iniesta missing LW
  31: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'lw', 'st'), // Netherlands 2010 final id32 Sneijder missing CAM
  32: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'st', 'lw'), // Germany 2010 semi id33
  33: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Uruguay 2010 QF id34
  34: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'st', 'lw'), // Brazil 2010 R16 id35
  35: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'), // Argentina 2010 id36
  36: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rm', 'st', 'lm'), // England 2010 id37 Rooney missing
  37: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'cam', 'lcm', 'rw', 'st', 'lw'), // France 2010 id38
  38: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lcm', 'st', 'lw', 'rw'), // Portugal 2010 id39
  39: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rcm', 'rw', 'st', 'lw'), // Italy 2010 id40
  // L5 id41 Netherlands semi - same as fixed id41
  40: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'lw', 'st'), // Netherlands 2010 semi id41 van Persie missing ST
  41: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lw', 'rw', 'st', 'cam'), // Germany 2010 QF id42 Özil missing CAM
  42: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'), // Argentina 2010 id53
  43: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Brazil 2010 QF id54
  44: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rcm', 'lcm', 'rw', 'st'), // Ghana 2010 QF id55
  45: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Paraguay 2010 id56
  46: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Japan 2010 id57
  47: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // South Korea 2010 id58
  48: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // USA 2010 id59
  49: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Chile 2010 id60
  // L6 duplicates of 50-57, 56-59
  56: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Argentina 2006 id57 Messi missing
  58: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Netherlands 2006 id59
  59: r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'st', 'lw'), // Czech 2006 id60
};

/** Override script coords for duplicate-id / hand-verified lineups */
const INDEX_CUSTOM = {
  54: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [50, 64], [82, 28], [62, 50], [38, 50], [18, 28],
    [50, 10],
  ],
};

function coordsForIndex(index) {
  if (INDEX_CUSTOM[index]) return INDEX_CUSTOM[index];
  return INDEX_COORDS[index] ?? null;
}

/** Name fixes: [index, slotIndex, newName] — Wikipedia starters only */
const INDEX_NAME_FIXES = [
  [40, 1, 'Boulahrouz'],
  [40, 6, 'de Zeeuw'],
  [41, 1, 'Boulahrouz'], // duplicate id in L5 - wait index 41 is Germany QF
];

/** Per match id in L7-L10 → 11 role keys matching slot order in file */
const L7_MATCH_ROLES = {
  'level-7-match-1': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lw', 'cam', 'rw', 'st'),
  'level-7-match-2': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'lcm', 'rcm', 'lm', 'lst', 'rst'),
  'level-7-match-3': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'lw', 'st'),
  'level-7-match-4': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'dm', 'rcm', 'lm', 'rm', 'st'),
  'level-7-match-5': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'lw', 'st'),
  'level-7-match-6': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lm', 'dm', 'rm', 'cam', 'lst', 'rst'),
  'level-7-match-7': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-7-match-8': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'rm', 'lm', 'st'),
  'level-7-match-9': r('gk', 'lcb3', 'cb', 'rcb3', 'lcm', 'dm', 'rcm', 'cam', 'lw', 'rst', 'st'),
  'level-7-match-10': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
};

const L8_MATCH_ROLES = {
  'level-8-match-1': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lw', 'cam', 'rw', 'st'),
  'level-8-match-2': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'lw', 'st'),
  'level-8-match-3': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'lw', 'st'),
  'level-8-match-4': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lm', 'ldm', 'rdm', 'rm', 'lst', 'rst'),
  'level-8-match-5': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'rcm', 'rdm', 'lw', 'rw', 'st'),
  'level-8-match-6': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lw', 'cam', 'rw', 'st'),
  'level-8-match-7': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'dm', 'rcm', 'cam', 'lst', 'rst'),
  'level-8-match-8': r('gk', 'rcb3', 'cb', 'lcb3', 'lm', 'ldm', 'rdm', 'rm', 'lw', 'rw', 'st'),
  'level-8-match-9': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'lw', 'rw', 'st'),
  'level-8-match-10': r('gk', 'rcb3', 'cb', 'lcb3', 'dm', 'rm', 'lcm', 'rcm', 'lm', 'lst', 'rst'),
};

const L9_MATCH_ROLES = {
  'level-9-match-1': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'dm', 'rcm', 'lw', 'st', 'rw'),
  'level-9-match-2': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'lw', 'st'),
  'level-9-match-3': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'lst', 'rst', 'st'),
  'level-9-match-4': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-9-match-5': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'lw', 'st'),
  'level-9-match-6': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-9-match-7': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-9-match-8': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'lw', 'st', 'rw'),
  'level-9-match-9': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'dm', 'rcm', 'lw', 'st', 'rw'),
  'level-9-match-10': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'lw', 'st'),
};

const L10_MATCH_ROLES = {
  'level-10-match-1': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-10-match-2': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-10-match-3': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'lw', 'st'),
  'level-10-match-4': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'lcm', 'rcm', 'lm', 'lst', 'rst'),
  'level-10-match-5': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'lcm', 'rcm', 'cam', 'st'),
  'level-10-match-6': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-10-match-7': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-10-match-8': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'rw', 'lw', 'st'),
  'level-10-match-9': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
  'level-10-match-10': r('gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'),
};

function fixOverlaps(coords, minDist = 18) {
  const out = coords.map((c) => [...c]);
  for (let pass = 0; pass < 24; pass++) {
    let moved = false;
    for (let i = 0; i < 11; i++) {
      for (let j = i + 1; j < 11; j++) {
        const dx = out[j][0] - out[i][0];
        const dy = out[j][1] - out[i][1];
        const d = Math.hypot(dx, dy);
        if (d < minDist && d > 0.1) {
          const push = (minDist - d) / 2 + 0.5;
          const nx = dx / d;
          const ny = dy / d;
          out[i][0] = Math.round(Math.max(10, Math.min(90, out[i][0] - nx * push)));
          out[i][1] = Math.round(Math.max(10, Math.min(92, out[i][1] - ny * push)));
          out[j][0] = Math.round(Math.max(10, Math.min(90, out[j][0] + nx * push)));
          out[j][1] = Math.round(Math.max(10, Math.min(92, out[j][1] + ny * push)));
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return out;
}

function patchCoordsInBlock(inner, coords) {
  const fixed = fixOverlaps(coords);
  let i = 0;
  return inner.replace(/x:\s*\d+,\s*y:\s*\d+/g, () => {
    const [x, y] = fixed[i++];
    return `x: ${x}, y: ${y}`;
  });
}

function patchMissingPlayerGame() {
  console.log('Skipping MissingPlayerGame.tsx — levels 1–6 are frozen in missingPlayerLineupLevels1to6.frozen.ts');
}

function patchLevelFile(relPath, roleMap) {
  const file = path.join(ROOT, relPath);
  let content = fs.readFileSync(file, 'utf8');
  let n = 0;
  content = content.replace(
    /id: '(level-\d+-match-\d+)'[\s\S]*?slots:\s*\[([\s\S]*?)\n    \],/g,
    (full, matchId, inner) => {
      const roles = roleMap[matchId];
      if (!roles) return full;
      const coords = roles;
      n++;
      const newInner = patchCoordsInBlock(inner, coords);
      return full.replace(inner, newInner);
    },
  );
  fs.writeFileSync(file, content);
  console.log(`${relPath}: patched ${n} matches`);
}

function auditLevel(minDist = 18) {
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let issues = 0;

  const game = fs.readFileSync(path.join(ROOT, 'src/pages/MissingPlayerGame.tsx'), 'utf8');
  const orders = {
    3: [50, 52, 53, 54, 55, 57, 19, 16, 17, 71],
    4: Array.from({ length: 10 }, (_, i) => 30 + i),
    5: Array.from({ length: 10 }, (_, i) => 40 + i),
    6: Array.from({ length: 10 }, (_, i) => 50 + i),
  };
  const qText = game.slice(game.indexOf('const allLineupQuestions'), game.indexOf('const MISSING_PLAYER_LEVEL_1_ORDER'));
  const blocks = [...qText.matchAll(/\{\s*\n\s*id:\s*(\d+),[\s\S]*?positions:\s*\[([\s\S]*?)\],\s*\n\s*missingIndex:/g)];

  const check = (label, inner) => {
    const coords = [...inner.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((m) => [+m[1], +m[2]]);
    if (coords.length !== 11) return;
    for (let i = 0; i < 11; i++)
      for (let j = i + 1; j < 11; j++) {
        const d = dist(coords[i], coords[j]);
        if (d < minDist) {
          issues++;
          console.log(`  ${label}: ${d.toFixed(1)}px`);
        }
      }
  };

  for (let level = 3; level <= 6; level++) {
    orders[level].forEach((idx, qi) => {
      const b = blocks[idx];
      if (b) check(`L${level}Q${qi + 1} id${b[1]}`, b[2]);
    });
  }

  for (const level of [7, 8, 9]) {
    const content = fs.readFileSync(path.join(ROOT, 'src/data/missingPlayerLineupLevels7to17.ts'), 'utf8');
    const m = new RegExp(`export const LEVEL_${level}[^=]*= \\[([\\s\\S]*?)\\];`).exec(content);
    if (!m) continue;
    m[1].split(/\n  \{\n    id:/).slice(1).forEach((mt, qi) => {
      const coords = [...mt.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((x) => [+x[1], +x[2]]).slice(0, 11);
      if (coords.length === 11) {
        for (let i = 0; i < 11; i++)
          for (let j = i + 1; j < 11; j++) {
            const d = dist(coords[i], coords[j]);
            if (d < minDist) {
              issues++;
              console.log(`  L${level}Q${qi + 1}: ${d.toFixed(1)}px`);
            }
          }
      }
    });
  }

  const l10 = fs.readFileSync(path.join(ROOT, 'src/data/mediumLineups/level10.ts'), 'utf8');
  l10.split(/\n  \{\n    id:/).slice(1).forEach((mt, qi) => {
    const coords = [...mt.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((x) => [+x[1], +x[2]]).slice(0, 11);
    if (coords.length === 11) {
      for (let i = 0; i < 11; i++)
        for (let j = i + 1; j < 11; j++) {
          const d = dist(coords[i], coords[j]);
          if (d < minDist) {
            issues++;
            console.log(`  L10Q${qi + 1}: ${d.toFixed(1)}px`);
          }
        }
    }
  });

  console.log(`Total overlaps (<${minDist}px): ${issues}`);
  return issues;
}

patchMissingPlayerGame();
console.log('Skipping missingPlayerLineupLevels7to17.ts — levels 7–9 are frozen');
console.log('Skipping mediumLineups/level10.ts — level 10 is frozen');
console.log('Skipping mediumLineups/level11.ts — level 11 is frozen');
console.log('Skipping mediumLineups/level12.ts — level 12 is frozen');
console.log('Skipping mediumLineups/level13.ts — level 13 is frozen');
auditLevel(18);

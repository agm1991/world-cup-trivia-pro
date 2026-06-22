/**
 * Fix Missing Player pitch x/y for levels 1–20 only.
 * Maps each lineup slot index → tactical role coords (no overlap, min 18px).
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
  lcb3: [28, 76],
  cb: [50, 76],
  rcb3: [72, 76],
  lwb: [12, 46],
  rwb: [88, 46],
  rdm: [30, 56],
  ldm: [70, 56],
  dm: [50, 60],
  rcm: [72, 52],
  cm: [50, 46],
  lcm: [28, 52],
  cam: [50, 36],
  rw: [78, 24],
  lw: [22, 24],
  st: [50, 12],
  lst: [36, 12],
  rst: [64, 12],
  ss: [50, 22],
  rm: [70, 32],
  lm: [22, 30],
  rcm442: [78, 48],
  lcm442: [22, 48],
};

/** question id → 11 tactical role keys (slot order in data) */
const ID_ROLES = {
  1: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'cm', 'lcm', 'rw', 'st', 'lw'],
  2: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'cam', 'rdm', 'ldm', 'rw', 'lw', 'st'],
  3: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'cm', 'lcm', 'rw', 'st', 'lw'],
  4: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'cam', 'ldm', 'rdm', 'rw', 'st', 'lw'],
  5: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'dm', 'rcm', 'rw', 'st', 'lw'],
  6: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'],
  7: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'rw', 'st', 'lw'],
  8: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'rw', 'st', 'lw'],
  9: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'ldm', 'rw', 'st', 'lw'],
  10: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rdm', 'rcm', 'cam', 'st', 'lw'],
  11: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'lm', 'cam', 'rw', 'st'],
  12: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'lcm', 'rw', 'st', 'lw', 'cam'],
  13: ['gk', 'lcb3', 'cb', 'rcb3', 'lwb', 'rwb', 'dm', 'lcm', 'rcm', 'lm', 'st'],
  14: ['gk', 'rcb3', 'cb', 'lcb3', 'rwb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'],
  15: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  16: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'],
  17: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'rcm', 'rw', 'st', 'lw'],
  18: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'lcm', 'cam', 'rw', 'st', 'lw'],
  19: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'],
  20: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  21: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'lw', 'st'],
  22: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'cam', 'rw', 'st'],
  23: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'rw', 'st'],
  24: ['gk', 'rwb', 'rcb3', 'cb', 'lcb3', 'lwb', 'rdm', 'ldm', 'cam', 'rw', 'st'],
  25: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'lm', 'st'],
  26: ['gk', 'rcb3', 'cb', 'lcb3', 'dm', 'rcm', 'lcm', 'rw', 'lw', 'st', 'rwb'],
  27: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lm', 'rdm', 'ldm', 'cam', 'st', 'rw'],
  28: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rcm', 'rw', 'st', 'lw'],
  29: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rcm', 'rw', 'st', 'lw'],
  30: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rw', 'st', 'lw', 'cm'],
  31: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'cm', 'rcm', 'lw', 'rw', 'st'],
  32: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rw', 'cam', 'rm', 'st'],
  33: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rw', 'cam', 'st', 'lw'],
  34: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  35: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rdm', 'ldm', 'rw', 'st', 'lw'],
  36: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rw', 'st', 'lw'],
  37: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'rm', 'st', 'lm'],
  38: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'cam', 'lcm', 'rw', 'st', 'lw'],
  39: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'lcm', 'st', 'lw', 'rw'],
  40: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rcm', 'rw', 'st', 'lw'],
  41: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rw', 'cam', 'rm', 'st'],
  42: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'lcm', 'rw', 'st', 'cam'],
  51: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'cam', 'rdm', 'lcm442', 'rcm442', 'st'],
  52: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lw', 'dm', 'rdm', 'lm', 'st', 'cam'],
  53: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  54: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm', 'cam', 'lw', 'st', 'rw'],
  55: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rcm', 'lcm', 'rm', 'st'],
  56: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'lcm', 'rdm', 'lm', 'st', 'rw'],
  57: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  58: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'st', 'lw', 'rw'],
  59: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  60: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rcm', 'lcm', 'cam', 'st', 'lw'],
  71: ['gk', 'rwb', 'rcb3', 'lcb3', 'lwb', 'rdm', 'ldm', 'cam', 'ss', 'rst', 'lst'],
  72: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
};

/** Hand-tuned full coord overrides by allLineupQuestions array index (levels 1–6) */
const INDEX_CUSTOM = {
  /** Level 1 — Argentina 2022 final (4-4-2) */
  0: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [72, 52], [50, 46], [28, 52], [78, 24], [50, 12],
    [22, 24],
  ],
  /** Level 1 — Argentina 2022 semi (4-4-2) */
  2: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [72, 52], [50, 46], [28, 52], [78, 24], [50, 12],
    [22, 24],
  ],
  /** Level 1 — France 2022 semi vs Morocco (4-2-3-1) */
  3: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [32, 56], [68, 56], [78, 24], [50, 32], [22, 24],
    [50, 12],
  ],
  /** Level 1 — Croatia 2022 QF vs Brazil (4-4-2) */
  4: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [22, 48], [50, 56], [78, 48], [72, 24], [50, 12],
    [22, 24],
  ],
  /** Level 1 — Morocco 2022 R16 vs Spain (4-1-4-1) */
  6: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [50, 62], [22, 44], [42, 44], [62, 44], [82, 44],
    [50, 12],
  ],
  /** Level 1 — Spain 2022 vs Germany (4-3-3) */
  7: [
    [50, 90], [84, 72], [66, 76], [16, 72], [54, 62], [28, 52], [72, 52], [46, 42], [78, 24], [50, 12],
    [22, 24],
  ],
  /** Level 1 — France 2018 final (4-2-3-1) */
  10: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [32, 56], [68, 56], [18, 38], [50, 32], [82, 24],
    [50, 12],
  ],
  /** Level 1 — Brazil 2018 QF vs Belgium (4-2-3-1) */
  14: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [32, 56], [68, 56], [50, 32], [78, 24], [50, 12],
    [22, 24],
  ],
  12: [
    [50, 90], [24, 76], [52, 78], [76, 76], [10, 44], [90, 44], [50, 58], [34, 36], [66, 36], [22, 14],
    [58, 12],
  ],
  41: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [30, 56], [70, 56], [24, 44], [78, 24], [50, 12],
    [50, 36],
  ],
  44: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [30, 56], [70, 56], [76, 48], [22, 48], [78, 30],
    [50, 12],
  ],
  45: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [74, 50], [26, 50], [50, 58], [22, 30], [50, 12],
    [78, 24],
  ],
  54: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [30, 56], [70, 56], [76, 48], [22, 48], [70, 32],
    [50, 12],
  ],
  40: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [30, 56], [70, 56], [50, 36], [82, 20], [50, 12],
    [22, 24],
  ],
  50: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [70, 32], [50, 36], [30, 56], [22, 48], [78, 48],
    [50, 12],
  ],
  55: [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72], [72, 52], [28, 52], [50, 58], [22, 30], [50, 12],
    [78, 24],
  ],
  70: [
    [50, 90], [12, 48], [24, 72], [50, 74], [72, 72], [88, 48], [32, 50], [68, 50], [50, 30], [64, 12],
    [36, 12],
  ],
};

/** Per-index role overrides where duplicate question ids need different shapes */
const INDEX_ROLE_OVERRIDES = {
  45: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'lcm', 'rdm', 'lm', 'st', 'rw'],
  52: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  54: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'lcm442', 'rcm442', 'rm', 'st'],
  58: ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
};

const LEVELS_1_6_INDICES = new Set([...Array.from({ length: 60 }, (_, i) => i), 70, 71]);

function rolesToCoords(roles) {
  return roles.map((r) => {
    const c = C[r];
    if (!c) throw new Error(`Unknown role: ${r}`);
    return c;
  });
}

function coordsForIndex(index, id) {
  if (INDEX_CUSTOM[index]) return INDEX_CUSTOM[index];
  const roles = INDEX_ROLE_OVERRIDES[index] ?? ID_ROLES[id];
  if (!roles) return null;
  return rolesToCoords(roles);
}

/** Spread 11 slots by vertical band — preserves slot order, eliminates crowding */
function layoutLineupByBand(coords) {
  const out = coords.map((c) => [...c]);
  const indexed = out.map((c, i) => ({ i, y: c[1], x: c[0] }));
  indexed.sort((a, b) => b.y - a.y);

  const groups = [];
  for (const item of indexed) {
    const g = groups.find((gr) => Math.abs(gr.yAvg - item.y) <= 8);
    if (g) {
      g.items.push(item);
      g.yAvg = g.items.reduce((s, it) => s + it.y, 0) / g.items.length;
    } else {
      groups.push({ yAvg: item.y, items: [item] });
    }
  }
  groups.sort((a, b) => b.yAvg - a.yAvg);

  const bandY = [90, 74, 56, 36, 14];
  groups.forEach((g, gi) => {
    const yBase = bandY[Math.min(gi, bandY.length - 1)] ?? 50;
    const items = g.items.sort((a, b) => a.x - b.x);
    const n = items.length;
    items.forEach((item, j) => {
      out[item.i][0] = n === 1 ? 50 : Math.round(14 + (72 * j) / (n - 1));
      out[item.i][1] = yBase;
      if (gi === 1 && n === 4 && (j === 1 || j === 2)) out[item.i][1] = 76;
      if (gi === 1 && n === 3) out[item.i][1] = 76;
    });
  });
  return out;
}

function patchMissingPlayerGame() {
  console.log('Skipping MissingPlayerGame.tsx — levels 1–6 are frozen in missingPlayerLineupLevels1to6.frozen.ts');
}

const BULK_REPLACEMENTS = [
  [/x:\s*42,\s*y:\s*54/g, 'x: 32, y: 56'],
  [/x:\s*58,\s*y:\s*54/g, 'x: 68, y: 56'],
  [/x:\s*42,\s*y:\s*52/g, 'x: 28, y: 52'],
  [/x:\s*58,\s*y:\s*52/g, 'x: 72, y: 52'],
  [/x:\s*38,\s*y:\s*52/g, 'x: 26, y: 52'],
  [/x:\s*62,\s*y:\s*52/g, 'x: 74, y: 52'],
  [/x:\s*50,\s*y:\s*42/g, 'x: 50, y: 36'],
  [/x:\s*50,\s*y:\s*44/g, 'x: 50, y: 36'],
  [/x:\s*50,\s*y:\s*40/g, 'x: 50, y: 34'],
  [/x:\s*50,\s*y:\s*46/g, 'x: 50, y: 38'],
  [/x:\s*50,\s*y:\s*55/g, 'x: 50, y: 58'],
  [/x:\s*50,\s*y:\s*56(?!\n\s*option)/g, 'x: 50, y: 58'],
];

function patchLineupFile(relPath, { skipMatchIdPrefix = [] } = {}) {
  const file = path.join(ROOT, relPath);
  let content = fs.readFileSync(file, 'utf8');
  for (const [re, rep] of BULK_REPLACEMENTS) content = content.replace(re, rep);

  content = content.replace(
    /(\{[\s\S]*?id: '([^']+)'[\s\S]*?slots:\s*\[)([\s\S]*?)(\n    \],)/g,
    (full, pre, matchId, inner, post) => {
      if (skipMatchIdPrefix.some((p) => matchId.startsWith(p))) return full;
      const coords = [];
      inner.replace(/x:\s*(\d+),\s*y:\s*(\d+)/g, (_, x, y) => {
        coords.push([+x, +y]);
        return _;
      });
      if (coords.length !== 11) return full;
      const fixed = layoutLineupByBand(coords);
      let idx = 0;
      const newInner = inner.replace(/x:\s*(\d+),\s*y:\s*(\d+)/g, () => {
        const [x, y] = fixed[idx++];
        return `x: ${x}, y: ${y}`;
      });
      return `${pre}${newInner}${post}`;
    },
  );

  fs.writeFileSync(file, content);
  console.log('Layout spacing:', relPath);
}

function exportLevel789() {
  const file = path.join(ROOT, 'src/data/missingPlayerLineupLevels7to17.ts');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/^const LEVEL_7:/m, 'export const LEVEL_7:');
  content = content.replace(/^const LEVEL_8:/m, 'export const LEVEL_8:');
  content = content.replace(/^const LEVEL_9:/m, 'export const LEVEL_9:');
  // Avoid duplicate export when LEVEL_7/8/9 are already exported inline.
  content = content.replace(/\nexport \{ LEVEL_7, LEVEL_8, LEVEL_9 \};\n/, '\n');
  fs.writeFileSync(file, content);
  console.log('Exported LEVEL_7/8/9');
}

function audit(minDist = 18) {
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let issues = 0;

  const game = fs.readFileSync(path.join(ROOT, 'src/pages/MissingPlayerGame.tsx'), 'utf8');
  const orders = {
    1: [0, 2, 3, 4, 6, 7, 10, 12, 14, 70],
    2: [20, 22, 23, 24, 25, 30, 32, 33, 40, 41],
    3: [50, 52, 53, 54, 55, 57, 19, 16, 17, 71],
  };
  const qText = game.slice(game.indexOf('const allLineupQuestions'), game.indexOf('const MISSING_PLAYER_LEVEL_1_ORDER'));
  const blocks = [...qText.matchAll(/\{\s*\n\s*id:\s*(\d+),[\s\S]*?positions:\s*\[([\s\S]*?)\],\s*\n\s*missingIndex:/g)];

  const checkBlock = (label, inner) => {
    const coords = [...inner.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((m) => [+m[1], +m[2]]);
    if (coords.length !== 11) return;
    for (let i = 0; i < 11; i++) {
      for (let j = i + 1; j < 11; j++) {
        const d = dist(coords[i], coords[j]);
        if (d < minDist) {
          issues++;
          if (issues <= 15) console.log(`  ${label}: d=${d.toFixed(1)}`);
        }
      }
    }
  };

  for (let level = 1; level <= 3; level++) {
    orders[level].forEach((idx, qi) => {
      const b = blocks[idx];
      if (b) checkBlock(`L${level}Q${qi + 1} id${b[1]}`, b[2]);
    });
  }
  for (let level = 4; level <= 6; level++) {
    const base = 30 + (level - 4) * 10;
    for (let qi = 0; qi < 10; qi++) {
      const b = blocks[base + qi];
      if (b) checkBlock(`L${level}Q${qi + 1} id${b[1]}`, b[2]);
    }
  }

  for (const level of [7, 8, 9]) {
    const content = fs.readFileSync(path.join(ROOT, 'src/data/missingPlayerLineupLevels7to17.ts'), 'utf8');
    const m = new RegExp(`const LEVEL_${level}[^=]*= \\[([\\s\\S]*?)\\];`).exec(content);
    if (!m) continue;
    m[1].split(/\n  \{\n    id:/).slice(1).forEach((mt, qi) => {
      const coords = [...mt.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((x) => [+x[1], +x[2]]).slice(0, 11);
      if (coords.length === 11) {
        for (let i = 0; i < 11; i++) for (let j = i + 1; j < 11; j++) {
          const d = dist(coords[i], coords[j]);
          if (d < minDist) { issues++; if (issues <= 15) console.log(`  L${level}Q${qi + 1}: d=${d.toFixed(1)}`); }
        }
      }
    });
  }

  for (let level = 10; level <= 20; level++) {
    const content = fs.readFileSync(path.join(ROOT, `src/data/mediumLineups/level${level}.ts`), 'utf8');
    content.split(/\n  \{\n    id:/).slice(1).forEach((mt, qi) => {
      const coords = [...mt.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((x) => [+x[1], +x[2]]).slice(0, 11);
      if (coords.length === 11) {
        for (let i = 0; i < 11; i++) for (let j = i + 1; j < 11; j++) {
          const d = dist(coords[i], coords[j]);
          if (d < minDist) { issues++; if (issues <= 15) console.log(`  L${level}Q${qi + 1}: d=${d.toFixed(1)}`); }
        }
      }
    });
  }

  console.log(`Audit overlaps (<${minDist}px): ${issues}`);
}

patchMissingPlayerGame();
exportLevel789();
patchLineupFile('src/data/missingPlayerLineupLevels7to17.ts', { skipMatchIdPrefix: ['level-7-match-', 'level-8-match-', 'level-9-match-'] });
patchLineupFile('src/data/mediumLineups/level10.ts', { skipMatchIdPrefix: ['level-10-match-'] });
patchLineupFile('src/data/mediumLineups/level11.ts', { skipMatchIdPrefix: ['level-11-match-'] });
patchLineupFile('src/data/mediumLineups/level12.ts', { skipMatchIdPrefix: ['level-12-match-'] });
patchLineupFile('src/data/mediumLineups/level13.ts', { skipMatchIdPrefix: ['level-13-match-'] });
patchLineupFile('src/data/mediumLineups/level14.ts', { skipMatchIdPrefix: ['level-14-match-'] });
patchLineupFile('src/data/mediumLineups/level15.ts', { skipMatchIdPrefix: ['level-15-match-'] });
patchLineupFile('src/data/mediumLineups/level16.ts', { skipMatchIdPrefix: ['level-16-match-'] });
patchLineupFile('src/data/mediumLineups/level17.ts', { skipMatchIdPrefix: ['level-17-match-'] });
for (let l = 18; l <= 20; l++) patchLineupFile(`src/data/mediumLineups/level${l}.ts`, { skipMatchIdPrefix: [`level-${l}-match-`] });
audit(18);

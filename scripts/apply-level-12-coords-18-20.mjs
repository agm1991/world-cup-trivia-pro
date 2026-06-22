/**
 * Apply level-12 pitch coordinate system to medium lineups 18–20.
 * Uses MATCH_SLOT_ROLES + MATCH_COORD_OVERRIDES from missing-player-slot-roles-15-20.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MATCH_SLOT_ROLES, MATCH_COORD_OVERRIDES } from './missing-player-slot-roles-15-20.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Level-12 / pitch-layout rule coordinate system */
const C = {
  gk: [50, 90],
  rb: [84, 72],
  rcb: [66, 76],
  lcb: [34, 76],
  lb: [16, 72],
  lcb3: [28, 76],
  cb: [50, 76],
  rcb3: [72, 76],
  lwb: [16, 48],
  rwb: [84, 48],
  rdm: [62, 60],
  ldm: [38, 60],
  dm: [50, 60],
  rcm: [62, 50],
  cm: [50, 50],
  lcm: [38, 50],
  lcm442: [38, 50],
  rcm442: [62, 50],
  cam: [50, 36],
  rw: [78, 24],
  lw: [22, 24],
  st: [50, 12],
  lst: [38, 12],
  rst: [62, 12],
  ss: [50, 24],
  rm: [78, 32],
  lm: [22, 32],
  sw: [50, 72],
};

function getCoords(matchId, slotKeys) {
  if (MATCH_COORD_OVERRIDES[matchId]) {
    const c = MATCH_COORD_OVERRIDES[matchId];
    if (c.length !== slotKeys.length) {
      throw new Error(`${matchId}: override length ${c.length} != ${slotKeys.length}`);
    }
    return c;
  }
  const slotRoles = MATCH_SLOT_ROLES[matchId];
  if (!slotRoles) throw new Error(`No roles for ${matchId}`);
  return slotKeys.map((k) => {
    const role = slotRoles[k];
    if (!role || !C[role]) throw new Error(`${matchId}.${k}: unknown role "${role}"`);
    return C[role];
  });
}

function patchLevel(level) {
  const file = path.join(ROOT, `src/data/mediumLineups/level${level}.ts`);
  let content = fs.readFileSync(file, 'utf8');
  let patched = 0;
  content = content.replace(
    /(\{[\s\S]*?id: '([^']+)'[\s\S]*?slots:\s*\[)([\s\S]*?)(\n    \],)/g,
    (full, pre, matchId, inner, post) => {
      const slotKeys = [...inner.matchAll(/key: '([^']+)'/g)].map((m) => m[1]);
      if (slotKeys.length !== 11) return full;
      const coords = getCoords(matchId, slotKeys);
      let idx = 0;
      const newInner = inner.replace(/x:\s*(\d+),\s*y:\s*(\d+)/g, () => {
        const [x, y] = coords[idx++];
        return `x: ${x}, y: ${y}`;
      });
      if (idx !== 11) return full;
      patched++;
      return `${pre}${newInner}${post}`;
    },
  );
  fs.writeFileSync(file, content);
  console.log(`Level ${level}: patched ${patched}/10 coords`);
}

function auditLevel(level) {
  const content = fs.readFileSync(path.join(ROOT, `src/data/mediumLineups/level${level}.ts`), 'utf8');
  const minDist = 16;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let overlaps = 0;
  const blocks = content.split(/\n  \{\n    id:/).slice(1);
  blocks.forEach((mt, qi) => {
    const id = mt.match(/^ '([^']+)'/)?.[1] ?? '?';
    const coords = [...mt.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((x) => [+x[1], +x[2]]).slice(0, 11);
    const names = [...mt.matchAll(/displayName: '([^']+)'/g)].map((m) => m[1]);
    for (let i = 0; i < 11; i++) {
      for (let j = i + 1; j < 11; j++) {
        const d = dist(coords[i], coords[j]);
        if (d < minDist) {
          overlaps++;
          console.log(`  L${level} ${id}: ${names[i]} vs ${names[j]} d=${d.toFixed(1)}`);
        }
      }
    }
  });
  console.log(`Level ${level} overlaps (<${minDist}px): ${overlaps}`);
}

for (const l of [18, 19, 20]) patchLevel(l);
console.log('');
for (const l of [18, 19, 20]) auditLevel(l);

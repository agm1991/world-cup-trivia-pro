/**
 * Apply hand-tuned tactical pitch coords to medium levels 10–20.
 * Replaces stretched band-layout (x:14/86) with compact formation shapes.
 */
import fs from 'fs';
import { MATCH_SLOT_ROLES, MATCH_COORD_OVERRIDES as OVERRIDES_15_20 } from './missing-player-slot-roles-15-20.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const C = {
  gk: [50, 86],
  rb: [86, 70],
  rcb: [68, 72],
  lcb: [32, 72],
  lb: [14, 70],
  lcb3: [26, 72],
  cb: [50, 72],
  rcb3: [74, 72],
  lwb: [14, 48],
  rwb: [86, 48],
  rdm: [36, 46],
  ldm: [64, 46],
  rcm: [72, 42],
  cm: [50, 42],
  lcm: [28, 42],
  cam: [50, 32],
  rw: [78, 22],
  lw: [22, 22],
  st: [50, 14],
  lst: [38, 14],
  rst: [62, 14],
  rm: [84, 44],
  lm: [16, 44],
  rcm442: [62, 46],
  lcm442: [38, 46],
  dm: [50, 46],
  ss: [50, 24],
  sw: [50, 56],
};

/** match id → 11 tactical roles in slot order */
const MATCH_ROLES = {
  'level-10-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'cm', 'lcm', 'lw', 'st', 'rw'],
  'level-10-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'rw', 'st'],
  'level-10-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'rw', 'st'],
  'level-10-match-4': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rcm442', 'lcm442', 'lm', 'rst', 'lst'],
  'level-10-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'rcm', 'lcm', 'cam', 'st'],
  'level-10-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'rw', 'st'],
  'level-10-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rcm442', 'lcm442', 'lm', 'rst', 'lst'],
  'level-10-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-10-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'rw', 'st'],
  'level-10-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  // level 11 frozen — entries removed; do not patch
  'level-12-match-1': ['gk', 'lcb3', 'cb', 'rcb3', 'lwb', 'lcm442', 'rcm442', 'rwb', 'lw', 'st', 'rw'],
  'level-12-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-4': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rcm442', 'lcm442', 'lm', 'rst', 'lst'],
  'level-12-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-12-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-4': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-5': ['gk', 'rwb', 'rcb3', 'cb', 'lcb3', 'lwb', 'rcm', 'lcm', 'cam', 'lst', 'rst'],
  'level-13-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rcm442', 'lcm442', 'lm', 'rst', 'lst'],
  'level-13-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-13-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-14-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rdm', 'cm', 'lcm', 'lm', 'st'],
  'level-14-match-2': ['gk', 'rcb3', 'cb', 'lcb3', 'rwb', 'rcm442', 'cm', 'lcm442', 'lwb', 'lst', 'rst'],
  'level-14-match-3': ['gk', 'rcb3', 'cb', 'lcb3', 'rwb', 'rdm', 'ldm', 'lcm', 'cam', 'lst', 'rst'],
  'level-14-match-4': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-14-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-14-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'cm', 'rdm', 'rw', 'st', 'lw'],
  'level-14-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-14-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-14-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-14-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-15-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rcm', 'lcm', 'cm', 'cam', 'lst', 'rst'],
  'level-15-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'st', 'rw'],
  'level-15-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rcm442', 'lcm442', 'lm', 'lst', 'rst'],
  'level-15-match-4': ['gk', 'lcb3', 'cb', 'rcb3', 'lwb', 'lcm', 'cam', 'rcm', 'rwb', 'lst', 'rst'],
  'level-15-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'rw', 'st', 'lw'],
  'level-15-match-6': ['gk', 'lb', 'lcb', 'rcb', 'rb', 'dm', 'lm', 'lcm442', 'rcm442', 'rm', 'st'],
  'level-15-match-7': ['gk', 'rwb', 'rcb3', 'cb', 'lcb3', 'lwb', 'rcm', 'lcm', 'rw', 'lw', 'st'],
  'level-15-match-8': ['gk', 'rb', 'rcb', 'sw', 'lb', 'lm', 'lcm442', 'rcm442', 'rm', 'lst', 'rst'],
  'level-15-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'lcm442', 'rcm442', 'cam', 'lst', 'rst'],
  'level-15-match-10': ['gk', 'rwb', 'rcb3', 'cb', 'lcb3', 'lwb', 'rcm442', 'lcm442', 'cam', 'lst', 'rst'],
  // Level 16
  'level-16-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'st', 'lw'],
  'level-16-match-2': ['gk', 'lb', 'lcb', 'rcb', 'rb', 'lcm442', 'cm', 'rcm442', 'lw', 'st', 'rw'],
  'level-16-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'lw', 'st', 'cam'],
  'level-16-match-4': ['gk', 'lwb', 'lcb', 'cb', 'rcb', 'rwb', 'dm', 'lcm442', 'rcm442', 'cam', 'st'],
  'level-16-match-5': ['gk', 'sw', 'rcb', 'lcb', 'rwb', 'lwb', 'lcm442', 'cam', 'rcm442', 'lst', 'rst'],
  'level-16-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-16-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lm', 'lcm442', 'rcm442', 'rm', 'lst', 'rst'],
  'level-16-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lm', 'lcm442', 'rcm442', 'rm', 'lst', 'rst'],
  'level-16-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'],
  'level-16-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'ss', 'lw', 'st'],
  // Level 17
  'level-17-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'st', 'rst', 'lst'],
  'level-17-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm', 'rdm', 'cam', 'ss', 'rw', 'lm'],
  'level-17-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm442', 'cam', 'rcm442', 'lm', 'st', 'rm'],
  'level-17-match-4': ['gk', 'lwb', 'rcb', 'cb', 'lcb', 'rwb', 'ldm', 'rdm', 'cam', 'ss', 'st'],
  'level-17-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lm', 'st', 'rm'],
  'level-17-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm442', 'rcm442', 'cam', 'lm', 'rm', 'st'],
  'level-17-match-7': ['gk', 'rcb3', 'cb', 'lcb3', 'rwb', 'lwb', 'rcm442', 'lcm442', 'cam', 'lst', 'rst'],
  'level-17-match-8': ['gk', 'lwb', 'lcb3', 'rcb3', 'rwb', 'lcm442', 'rcm442', 'cam', 'rm', 'lm', 'st'],
  'level-17-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lcm442', 'rcm442', 'cam', 'rm', 'lm', 'st'],
  'level-17-match-10': ['gk', 'lwb', 'lcb3', 'rcb3', 'cb', 'rwb', 'lcm442', 'rcm442', 'cam', 'lst', 'rst'],
  // Level 18
  'level-18-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-4': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-18-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'st', 'rst', 'lst'],
  // Level 19
  'level-19-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'lm', 'rdm', 'cam', 'rm', 'rst', 'lst'],
  'level-19-match-2': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-19-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'lw', 'st', 'cam'],
  'level-19-match-4': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'ss', 'lw', 'st'],
  'level-19-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-19-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rm', 'cam', 'lcm', 'st'],
  'level-19-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-19-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rw', 'rdm', 'cam', 'lcm', 'ss', 'st'],
  'level-19-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'dm', 'rdm', 'ldm', 'rw', 'cam', 'st'],
  'level-19-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'st', 'lw'],
  // Level 20
  'level-20-match-1': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rw', 'cam', 'st', 'lw'],
  'level-20-match-2': ['gk', 'lb', 'lcb', 'rcb', 'rb', 'ldm', 'rdm', 'lcm', 'rw', 'ss', 'lw'],
  'level-20-match-3': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lw', 'rw', 'st'],
  'level-20-match-4': ['gk', 'lb', 'lcb', 'rcb', 'rb', 'ldm', 'rdm', 'rw', 'ss', 'lw', 'st'],
  'level-20-match-5': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-20-match-6': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-20-match-7': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'rm', 'cam', 'lcm', 'st'],
  'level-20-match-8': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'ldm', 'rdm', 'cam', 'lcm', 'rw', 'st'],
  'level-20-match-9': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rm', 'rdm', 'ldm', 'lcm', 'lst', 'rst'],
  'level-20-match-10': ['gk', 'rb', 'rcb', 'lcb', 'lb', 'rdm', 'ldm', 'cam', 'lw', 'rw', 'st'],
};

/** Full coordinate overrides where role templates still clash or lineups are hand-tuned */
const MATCH_COORDS = {
  'level-12-match-7': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [32, 50], [50, 50], [68, 50], [22, 12], [50, 12], [78, 12],
  ],
  'level-13-match-1': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [38, 50], [62, 50], [78, 32], [22, 32], [50, 30], [50, 12],
  ],
  'level-13-match-5': [
    [50, 90], [84, 48], [66, 76], [50, 72], [34, 76],
    [16, 48], [32, 32], [50, 36], [68, 32], [38, 12], [62, 12],
  ],
  'level-14-match-1': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [88, 38], [68, 46], [50, 44], [30, 48], [10, 36], [50, 12],
  ],
  'level-14-match-2': [
    [50, 90], [72, 78], [50, 72], [28, 78], [88, 48],
    [66, 50], [50, 38], [34, 50], [12, 48], [38, 12], [62, 12],
  ],
  'level-14-match-3': [
    [50, 90], [72, 78], [50, 72], [28, 78], [82, 48],
    [38, 46], [62, 46], [18, 48], [50, 28], [38, 10], [62, 10],
  ],
  'level-14-match-6': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [32, 54], [50, 54], [68, 54], [84, 20], [16, 20], [50, 10],
  ],
  'level-15-match-5': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [78, 32], [62, 50], [38, 50], [22, 32], [38, 12], [62, 12],
  ],
  'level-10-match-5': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [22, 46], [78, 46], [86, 28], [14, 28], [56, 22], [44, 4],
  ],
  'level-15-match-1': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [68, 50], [32, 50], [50, 50], [50, 34], [38, 12], [62, 12],
  ],
  'level-15-match-3': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [88, 44], [72, 48], [28, 48], [12, 44], [38, 12],
    [62, 12],
  ],
  'level-16-match-2': [
    [50, 90], [16, 72], [34, 76], [66, 76], [84, 72],
    [60, 52], [40, 52], [22, 44], [82, 18], [50, 16],
    [18, 18],
  ],
  'level-16-match-6': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [82, 46], [18, 46], [50, 32], [72, 18], [28, 18],
    [50, 10],
  ],
  'level-16-match-4': [
    [50, 90], [16, 48], [34, 76], [50, 76], [66, 76],
    [84, 48], [50, 60], [32, 50], [68, 50], [50, 34], [50, 12],
  ],
  'level-16-match-7': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [22, 32], [38, 50], [62, 50], [78, 32], [38, 12], [62, 12],
  ],
  'level-16-match-8': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [22, 32], [38, 50], [62, 50], [78, 32], [38, 12], [62, 12],
  ],
  'level-17-match-1': [
    [50, 90], [50, 72], [86, 72], [68, 76], [32, 76],
    [82, 46], [62, 54], [38, 54], [14, 46], [38, 12],
    [62, 12],
  ],
  'level-17-match-2': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [50, 58], [66, 48], [34, 48], [50, 28], [72, 14],
    [28, 14],
  ],
  'level-17-match-3': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [32, 50], [50, 50], [68, 50], [22, 24], [50, 12], [78, 24],
  ],
  'level-17-match-4': [
    [50, 90], [16, 48], [34, 76], [50, 72], [66, 76],
    [84, 48], [34, 50], [66, 50], [50, 36], [50, 56], [50, 12],
  ],
  'level-17-match-5': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [38, 50], [62, 50], [50, 36], [22, 24], [50, 12], [78, 24],
  ],
  'level-17-match-7': [
    [50, 90], [66, 76], [50, 72], [34, 76], [84, 48],
    [16, 48], [62, 50], [38, 50], [50, 28], [38, 12], [62, 12],
  ],
  'level-17-match-8': [
    [50, 90], [16, 48], [34, 76], [66, 76], [84, 48],
    [38, 50], [62, 50], [50, 36], [78, 32], [22, 32], [50, 12],
  ],
  'level-17-match-6': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [38, 50], [62, 50], [50, 28], [26, 26], [74, 26], [50, 12],
  ],
  'level-17-match-9': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [38, 50], [62, 50], [50, 36], [78, 32], [22, 32], [50, 12],
  ],
  'level-17-match-10': [
    [50, 90], [16, 48], [34, 76], [66, 76], [50, 72],
    [84, 48], [38, 50], [62, 50], [50, 36], [38, 12], [62, 12],
  ],
  'level-15-match-8': [
    [50, 90], [84, 72], [66, 76], [50, 72], [16, 72],
    [22, 32], [38, 50], [62, 50], [78, 32], [38, 12], [62, 12],
  ],
  'level-15-match-9': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [50, 60], [32, 50], [68, 50], [50, 12], [22, 12], [78, 12],
  ],
  'level-19-match-9': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [50, 58], [34, 48], [66, 48], [78, 24], [50, 32], [50, 12],
  ],
  'level-20-match-9': [
    [50, 90], [84, 72], [66, 76], [34, 76], [16, 72],
    [82, 42], [60, 48], [40, 48], [18, 42], [38, 12], [62, 12],
  ],
};

function rolesToCoords(roles) {
  return roles.map((r) => {
    const c = C[r];
    if (!c) throw new Error(`Unknown role: ${r}`);
    return c;
  });
}

function getCoords(matchId, slotKeys) {
  const overrides = { ...MATCH_COORDS, ...OVERRIDES_15_20 };
  if (overrides[matchId]) {
    const c = overrides[matchId];
    if (c.length !== slotKeys.length) {
      throw new Error(`${matchId}: override has ${c.length} coords, expected ${slotKeys.length}`);
    }
    return c;
  }
  const slotRoles = MATCH_SLOT_ROLES[matchId];
  if (slotRoles) {
    return slotKeys.map((k) => {
      const role = slotRoles[k];
      if (!role || !C[role]) throw new Error(`${matchId}.${k}: unknown role "${role}"`);
      return C[role];
    });
  }
  const roles = MATCH_ROLES[matchId];
  if (!roles) return null;
  if (roles.length !== slotKeys.length) {
    throw new Error(`${matchId}: MATCH_ROLES length ${roles.length} != ${slotKeys.length} slots`);
  }
  return rolesToCoords(roles);
}

function patchLevelFile(level) {
  if (level >= 10 && level <= 13) {
    console.log(`Level ${level}: skipped (frozen)`);
    return;
  }
  const file = path.join(ROOT, `src/data/mediumLineups/level${level}.ts`);
  let content = fs.readFileSync(file, 'utf8');
  let patched = 0;

  content = content.replace(
    /(\{[\s\S]*?id: '([^']+)'[\s\S]*?slots:\s*\[)([\s\S]*?)(\n    \],)/g,
    (full, pre, matchId, inner, post) => {
      const slotKeys = [...inner.matchAll(/key: '([^']+)'/g)].map((m) => m[1]);
      if (slotKeys.length !== 11) return full;
      let coords;
      try {
        coords = getCoords(matchId, slotKeys);
      } catch (e) {
        console.error(String(e.message));
        return full;
      }
      if (!coords) return full;
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
  console.log(`Level ${level}: patched ${patched}/10 matches`);
}

function auditLevel(level) {
  const content = fs.readFileSync(path.join(ROOT, `src/data/mediumLineups/level${level}.ts`), 'utf8');
  const minDist = 22;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  let overlaps = 0;
  let stretched = 0;
  content.split(/\n  \{\n    id:/).slice(1).forEach((mt, qi) => {
    const id = mt.match(/^ '([^']+)'/)?.[1] ?? '?';
    const coords = [...mt.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((x) => [+x[1], +x[2]]).slice(0, 11);
    if (coords.filter((c) => c[0] === 14 || c[0] === 86).length >= 6) stretched++;
    for (let i = 0; i < 11; i++)
      for (let j = i + 1; j < 11; j++) {
        const d = dist(coords[i], coords[j]);
        if (d < minDist) {
          overlaps++;
          if (overlaps <= 20) {
            const names = [...mt.matchAll(/displayName: '([^']+)'/g)].map((m) => m[1]);
            console.log(`  L${level}Q${qi + 1} ${id}: ${names[i]} vs ${names[j]} d=${d.toFixed(1)}`);
          }
        }
      }
  });
  console.log(`Level ${level} audit — overlaps: ${overlaps}, heavily stretched: ${stretched}`);
}

for (let l = 10; l <= 20; l++) patchLevelFile(l);
console.log('');
for (let l = 10; l <= 20; l++) auditLevel(l);

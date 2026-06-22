/**
 * Ultimate pool: 1930–1966 only (event-driven). IDs wc-ultimate-1…200.
 * Aggregates split modules for maintainability.
 */
import { ultimateEntries1 } from './ultimateEntries1.mjs';
import { ultimateEntries2 } from './ultimateEntries2.mjs';
import { ultimateEntries3 } from './ultimateEntries3.mjs';
import { ultimateEntries4 } from './ultimateEntries4.mjs';

const ultimateEntries = [...ultimateEntries1, ...ultimateEntries2, ...ultimateEntries3, ...ultimateEntries4];

if (ultimateEntries.length !== 200) {
  throw new Error(`ultimateEntries expected 200, got ${ultimateEntries.length}`);
}

export const ultimatePool = ultimateEntries.map((x, i) => ({
  id: `wc-ultimate-${i + 1}`,
  difficulty: 'ultimate',
  ...x,
}));

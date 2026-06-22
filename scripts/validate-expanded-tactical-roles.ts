/**
 * Run: npx tsx scripts/validate-expanded-tactical-roles.ts
 * Ensures every expanded nation has official FIFA squads (23–26), roles aligned.
 */
import {
  EXPANDED_POOLS,
  EXPANDED_TACTICAL_ROLE_BY_NATION,
} from '../src/data/squadPredictorExpandedTacticalRoles';

const EXPECTED_NATIONS = 47;

function main() {
  if (EXPANDED_POOLS.length !== EXPECTED_NATIONS) {
    throw new Error(`Expected ${EXPECTED_NATIONS} expanded pools, got ${EXPANDED_POOLS.length}`);
  }

  const labels = new Set<string>();
  for (const p of EXPANDED_POOLS) {
    if (labels.has(p.label)) throw new Error(`Duplicate pool label: ${p.label}`);
    labels.add(p.label);

    if (p.players.length < 23 || p.players.length > 26) {
      throw new Error(`${p.label}: expected 23–26 players, got ${p.players.length}`);
    }
    if (p.roles.length !== p.players.length) {
      throw new Error(`${p.label}: expected ${p.players.length} roles, got ${p.roles.length}`);
    }

    const byNation = EXPANDED_TACTICAL_ROLE_BY_NATION[p.label];
    if (!byNation) throw new Error(`${p.label}: missing EXPANDED_TACTICAL_ROLE_BY_NATION entry`);

    for (let i = 0; i < p.players.length; i++) {
      const name = p.players[i]!;
      const role = p.roles[i]!;
      if (byNation[name] !== role) {
        throw new Error(`${p.label}: index ${i} ${name} → map has ${byNation[name]}, expected ${role}`);
      }
    }

    const mapKeys = Object.keys(byNation);
    if (mapKeys.length !== p.players.length) {
      throw new Error(`${p.label}: nation map has ${mapKeys.length} keys, expected ${p.players.length}`);
    }
  }

  if (Object.keys(EXPANDED_TACTICAL_ROLE_BY_NATION).length !== EXPECTED_NATIONS) {
    throw new Error(
      `BY_NATION key count ${Object.keys(EXPANDED_TACTICAL_ROLE_BY_NATION).length} !== ${EXPECTED_NATIONS}`,
    );
  }

  console.log(`OK: ${EXPECTED_NATIONS} nations, official FIFA squads, roles aligned.`);
}

main();

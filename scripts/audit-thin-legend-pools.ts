/**
 * One-off: list Select-a-Legend players whose usable pool (after match-log policy) is &lt; 3.
 * Usage: npx vite-node scripts/audit-thin-legend-pools.ts [AC|DG|ALL]
 */
import { buildPlayerQuestionPool } from '../src/data/playerQuestions';
import { defaultCountries } from '../src/data/selectLegendCountries';

const band = (process.argv[2] || 'ALL').toUpperCase();

for (const c of defaultCountries) {
  const first = c.name.trim().charAt(0).toUpperCase();
  const inAc = first >= 'A' && first <= 'C';
  const inDg = first >= 'D' && first <= 'G';
  const include =
    band === 'ALL' ? true : band === 'AC' ? inAc : band === 'DG' ? inDg : true;
  if (!include) continue;

  for (const p of c.players) {
    const n = buildPlayerQuestionPool(p.id).length;
    if (n < 3) {
      console.log(`${n}\t${c.name}\t${p.id}\t${p.name}`);
    }
  }
}

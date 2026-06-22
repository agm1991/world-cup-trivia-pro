import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const mod = await server.ssrLoadModule('/src/data/missingPlayerLineupLevels7to17.ts');
  for (let level = 7; level <= 30; level++) {
    const qs = mod.getMissingPlayerLineupQuestionsForLevel(level);
    console.log(`Level ${level}: ${qs.length} questions`);
  }
  console.log('OK');
} catch (e) {
  console.error('FAIL:', e.message);
  process.exit(1);
} finally {
  await server.close();
}

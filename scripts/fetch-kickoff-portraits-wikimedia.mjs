#!/usr/bin/env node
/**
 * Deep-search Wikimedia Commons for tournament-era solo portraits and save as
 *   src/assets/kickoff-portraits/{playerId}-wc{year}.jpg
 *
 * Search query format (per product spec):
 *   "[Player Name] [Year] World Cup portrait face close-up solo"
 *
 * Skips if file already exists. Uses Commons File: search (namespace 6).
 * Rate-limited; run: node scripts/fetch-kickoff-portraits-wikimedia.mjs [--limit N] [--dry-run]
 *
 * After adding/replacing assets, verify likeness and licensing on Commons.
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PQ = path.join(ROOT, 'src/data/playerQuestions.ts');
const OUT_DIR = path.join(ROOT, 'src/assets/kickoff-portraits');

const UA = 'WorldCupTriviaPro/1.0 (educational; Wikimedia API)';

function apiUrl(params) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

function extractPlayerWorldCupYears(text) {
  const start = text.indexOf('export const playerWorldCupYears');
  if (start === -1) throw new Error('playerWorldCupYears not found');
  const sub = text.slice(start);
  const brace = sub.indexOf('{');
  let i = brace;
  let depth = 0;
  for (; i < sub.length; i++) {
    if (sub[i] === '{') depth++;
    else if (sub[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = sub.slice(brace + 1, i);
  const out = {};
  const re = /'([a-z0-9-]+)'\s*:\s*\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(body))) {
    const years = m[2]
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    out[m[1]] = years;
  }
  return out;
}

function extractAllPlayerNames(text) {
  const start = text.indexOf('export const allPlayers = [');
  if (start === -1) throw new Error('allPlayers not found');
  let i = start + 'export const allPlayers = '.length;
  while (text[i] !== '[') i++;
  i++;
  let depth = 1;
  const from = i;
  while (depth > 0 && i < text.length) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') depth--;
    i++;
  }
  const body = text.slice(from, i - 1);
  const names = {};
  const re = /id:\s*'([^']+)',\s*name:\s*'((?:[^'\\]|\\.)*)'/g;
  let m;
  while ((m = re.exec(body))) {
    names[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  }
  return names;
}

async function searchFiles(srsearch, limit = 12) {
  const url = apiUrl({
    action: 'query',
    list: 'search',
    srsearch,
    srnamespace: 6,
    srlimit: limit,
    format: 'json',
  });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  return data.query?.search?.map((s) => s.title) ?? [];
}

/** Tiered queries: strict phrase often has 0 hits on Commons; broaden until results appear. */
function searchQueriesForPlayerYear(name, year) {
  const extra =
    year === 2006
      ? [`${name} Germany 2006 FIFA`, `${name} 2006 portrait national team`]
      : year === 2010
        ? [`${name} South Africa 2010 FIFA`]
        : [];
  return [
    `${name} ${year} World Cup portrait face close-up solo`,
    `${name} ${year} FIFA World Cup`,
    `${name} World Cup ${year}`,
    `${name} ${year} world cup`,
    `${name} ${year} national team portrait`,
    ...extra,
  ];
}

function scoreTitleForPortrait(t) {
  let s = 0;
  if (/portrait|headshot|head shot|face|bust|cropped\)/i.test(t)) s += 12;
  if (/world cup|fifa|coupe du monde|mundial|wm\s*\d/i.test(t)) s += 6;
  if (/celebrat|scoring|goal|penalty|kick|match|vs\.|against|group stage|round of/i.test(t)) s -= 5;
  if (/team|squad|line-?up|lineup|bench/i.test(t)) s -= 8;
  if (/stadium|crowd|fans|audience/i.test(t)) s -= 6;
  return s;
}

async function findFileTitles(name, year) {
  const queries = searchQueriesForPlayerYear(name, year);
  for (const q of queries) {
    const titles = await searchFiles(q, 20);
    if (titles.length) {
      const preferred = titles.filter(
        (t) =>
          /\.(jpe?g|png|webp|gif)$/i.test(t) &&
          !/\.(pdf|svg|djvu|webm|ogv|mp4)(\||$)/i.test(t) &&
          !/logo|flag|badge|poster|ticket/i.test(t),
      );
      const pool = preferred.length ? preferred : titles;
      return [...pool].sort((a, b) => scoreTitleForPortrait(b) - scoreTitleForPortrait(a));
    }
  }
  return [];
}

async function getImageInfo(fileTitle) {
  const url = apiUrl({
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url|mime',
    format: 'json',
  });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) throw new Error(`No pages for ${fileTitle}`);
  const page = Object.values(pages)[0];
  if (page.missing) throw new Error(`Missing: ${fileTitle}`);
  const ii = page.imageinfo?.[0];
  if (!ii?.url) throw new Error(`No URL for ${fileTitle}`);
  return { url: ii.url, mime: ii.mime || '' };
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function extForMime(mime) {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/gif') return '.gif';
  return '.jpg';
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const f = fs.createWriteStream(dest);
    https
      .get(url, { headers: { 'User-Agent': UA } }, (r) => {
        if (r.statusCode === 301 || r.statusCode === 302) {
          const loc = r.headers.location;
          r.resume();
          if (!loc) return reject(new Error('Redirect without location'));
          return download(loc, dest).then(resolve).catch(reject);
        }
        if (r.statusCode !== 200) {
          r.resume();
          return reject(new Error(`HTTP ${r.statusCode}`));
        }
        r.pipe(f);
        f.on('finish', () => f.close(resolve));
      })
      .on('error', reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = process.argv.slice(2);
  let limit = Infinity;
  let dry = false;
  for (let a = 0; a < args.length; a++) {
    if (args[a] === '--limit' && args[a + 1]) limit = parseInt(args[++a], 10);
    if (args[a] === '--dry-run') dry = true;
  }

  const text = fs.readFileSync(PQ, 'utf8');
  const yearsMap = extractPlayerWorldCupYears(text);
  const names = extractAllPlayerNames(text);

  const jobs = [];
  for (const [playerId, years] of Object.entries(yearsMap)) {
    const name = names[playerId];
    if (!name) continue;
    for (const y of years) {
      jobs.push({ playerId, year: y, name });
    }
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const { playerId, year, name } of jobs) {
    if (done >= limit) break;
    const baseDest = path.join(OUT_DIR, `${playerId}-wc${year}`);
    if (
      fs.existsSync(`${baseDest}.jpg`) ||
      fs.existsSync(`${baseDest}.png`) ||
      fs.existsSync(`${baseDest}.webp`) ||
      fs.existsSync(`${baseDest}.gif`)
    ) {
      skipped++;
      continue;
    }

    process.stdout.write(`${playerId} ${year} … `);

    if (dry) {
      console.log(`dry-run: ${searchQueriesForPlayerYear(name, year)[0]}`);
      done++;
      continue;
    }

    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        await sleep(350);
        const titles = await findFileTitles(name, year);
        if (!titles.length) throw new Error('no search results');
        let lastErr;
        for (const title of titles) {
          try {
            const info = await getImageInfo(title);
            if (!ALLOWED_MIME.has(info.mime)) continue;
            await sleep(200);
            const ext = extForMime(info.mime);
            const outFile = `${baseDest}${ext}`;
            await download(info.url, outFile);
            console.log(`ok ← ${title}`);
            ok = true;
            done++;
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (!ok) throw lastErr ?? new Error('all candidates failed');
      } catch (e) {
        if (attempt === 2) {
          console.log(`fail: ${e.message}`);
          failed++;
        } else await sleep(500 * (attempt + 1));
      }
    }
  }

  console.error(
    `\nDone: ${done} fetched, ${skipped} skipped (file exists), ${failed} failed, ${jobs.length} total jobs.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

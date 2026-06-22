#!/usr/bin/env node
/**
 * Refresh André Ayew and Kevin-Prince Boateng portraits in Ghana kit from Wikimedia Commons.
 * (Focused subset of download-legend-ten-countries-and-fixes.mjs — use when rate limits block bulk runs.)
 *
 * Run from repo root: node scripts/download-ghana-ayew-boateng.mjs
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const UA = 'WorldCupTriviaPro/1.0 (educational; Wikimedia API)';

function apiUrl(params) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

async function getImageUrl(fileTitle) {
  const url = apiUrl({
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
  });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) throw new Error(`No pages for ${fileTitle}`);
  const page = Object.values(pages)[0];
  if (page.missing) throw new Error(`Missing: ${fileTitle}`);
  const raw = page.imageinfo?.[0]?.url;
  if (!raw) throw new Error('no url');
  return raw.split('?')[0];
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

const jobs = [
  ['src/assets/players/Ghana/Andre_Ayew.jpg', 'File:Ghana (1) (cropped André Ayew).jpg'],
  [
    'src/assets/players/Ghana/KevinPrince_Boateng.jpg',
    'File:Kevin-Prince Boateng and Álvaro Fernández – Ghana vs. Uruguay 2010 FIFA World Cup.jpg',
  ],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const [rel, fileTitle] of jobs) {
    const dest = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    process.stdout.write(`${rel} ... `);
    let ok = false;
    for (let attempt = 0; attempt < 5 && !ok; attempt++) {
      try {
        const url = await getImageUrl(fileTitle);
        await download(url, dest);
        console.log('ok');
        ok = true;
      } catch (e) {
        const wait = 3000 * (attempt + 1);
        if (attempt < 4) {
          console.log(`retry in ${wait}ms (${e.message})`);
          await sleep(wait);
        } else {
          console.log('FAIL', e.message);
          process.exitCode = 1;
        }
      }
    }
    await sleep(1200);
  }
}

main();

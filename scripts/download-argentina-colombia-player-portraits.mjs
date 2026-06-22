#!/usr/bin/env node
/**
 * Portrait-style player photos (national kit where available) from Wikimedia Commons.
 * Replaces duplicate/wide-match crops for Argentina + Colombia guess-who grid.
 * Run: node scripts/download-argentina-colombia-player-portraits.mjs
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const UA = 'WorldCupTriviaPro/1.0 (https://github; educational; Wikimedia API)';

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
  return page.imageinfo?.[0]?.url;
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
  // Argentina — Mascherano / Martínez were copies of Maradona.jpg
  ['src/assets/players/Argentina/Javier_Mascherano.jpg', 'File:Javier Mascherano - 2011.jpg'],
  [
    'src/assets/players/Argentina/Emiliano_Martinez.jpg',
    'File:ARG Line-up - ARG vs MEX for 2022 FIFA WC (Dibu Martínez).jpg',
  ],
  // Colombia — national kit match photos (Falcao/Yepes: World Cup; Ospina: solo crop from 2018)
  [
    'src/assets/players/Colombia/Radamel_Falcao.jpg',
    'File:FWC 2018 - Round of 16 - COL v ENG - Photo 026 (cropped).jpg',
  ],
  [
    'src/assets/players/Colombia/David_Ospina.jpg',
    'File:FWC 2018 - Round of 16 - COL v ENG - Photo 003 (cropped).jpg',
  ],
  [
    'src/assets/players/Colombia/Mario_Yepes.jpg',
    'File:Brazil and Colombia match at the FIFA World Cup 2014-07-04 (12).jpg',
  ],
  ['src/assets/players/Colombia/Faustino_Asprilla.jpg', 'File:Tino Asprilla en 2019 01.jpg'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const [rel, fileTitle] of jobs) {
    const dest = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    process.stdout.write(`${rel} ... `);
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const url = await getImageUrl(fileTitle);
        if (!url) throw new Error('no url');
        await download(url, dest);
        console.log('ok');
        ok = true;
      } catch (e) {
        if (attempt < 2) {
          await sleep(2500 * (attempt + 1));
        } else {
          console.log('FAIL', e.message);
          process.exitCode = 1;
        }
      }
    }
    await sleep(800);
  }
}

main();

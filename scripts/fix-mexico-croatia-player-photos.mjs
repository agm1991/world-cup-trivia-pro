#!/usr/bin/env node
/**
 * Re-downloads Croatia + Mexico player portraits from verified Wikimedia Commons files.
 * Fixes mislabeled/synthetic/wrong-source images (Modrić/Šuker, Mexico legends).
 * Alen Bokšić: no verifiable CC portrait on Commons (same as download-croatia-japan note).
 * Run: node scripts/fix-mexico-croatia-player-photos.mjs
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
  ['src/assets/players/Croatia/Luka_Modric.jpg', 'File:Luka Modrić in 2018.jpg'],
  ['src/assets/players/Croatia/Davor_Suker.jpg', 'File:Football against poverty 2014 - Davor Šuker (cropped).jpg'],
  // National-team / clear portrait sources (replace FUT17 render, club-only crops, etc.)
  ['src/assets/players/Mexico/Hugo_Sanchez.jpg', 'File:Hugo Sánchez 1988 (cropped).jpg'],
  ['src/assets/players/Mexico/Luis_Hernandez.png', 'File:Luis Hernández.png'],
  ['src/assets/players/Mexico/Omar_Bravo.jpg', 'File:Omar Bravo.jpg'],
  ['src/assets/players/Mexico/Andres_Guardado.jpg', 'File:Mex-Kor (25).jpg'],
  ['src/assets/players/Mexico/Rafa_Marquez.jpg', 'File:2017 Confederation Cup - MEXNZL - Rafael Márquez (cropped).jpg'],
  ['src/assets/players/Mexico/Cuauhtemoc_Blanco.jpg', 'File:Cuauhtemoc Blanco.jpg'],
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
    await sleep(400);
  }
}

main();

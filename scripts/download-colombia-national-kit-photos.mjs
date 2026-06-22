#!/usr/bin/env node
/**
 * Wikimedia Commons — Colombia national team kit (James Rodríguez unchanged; run separately).
 * node scripts/download-colombia-national-kit-photos.mjs
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const UA = 'WorldCupTriviaPro/1.0 (https://github.com; educational; Wikimedia API)';

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

/** [dest relative to repo root, File: title on Commons] — all Colombia national kit except James (unchanged). */
const jobs = [
  ['src/assets/players/Colombia/Carlos_Valderrama.jpg', 'File:Carlos Valderrama 1998.jpg'],
  // Prefer portrait script: scripts/download-argentina-colombia-player-portraits.mjs (FWC 2018 cropped)
  ['src/assets/players/Colombia/Radamel_Falcao.jpg', 'File:FWC 2018 - Round of 16 - COL v ENG - Photo 026 (cropped).jpg'],
  [
    'src/assets/players/Colombia/Juan_Cuadrado_WC.jpg',
    'File:Brazil and Colombia match at the FIFA World Cup 2014-07-04 - Juan Cuadrado.jpg',
  ],
  [
    'src/assets/players/Colombia/David_Ospina.jpg',
    'File:Brazil and Colombia match at the FIFA World Cup 2014-07-04 (25).jpg',
  ],
  [
    'src/assets/players/Colombia/Mario_Yepes.jpg',
    'File:Brazil and Colombia match at the FIFA World Cup 2014-07-04 (12).jpg',
  ],
  [
    'src/assets/players/Colombia/Freddy_Rincon.jpg',
    'File:Formacion de la Selección Colombia antes del Partido contra Paraguay en la Repesca a Mundial de México 1986.jpg',
  ],
  // Match photo: Colombia vs Brazil 2007 — both teams in national kits (Commons has no clear solo Asprilla in Selección kit).
  ['src/assets/players/Colombia/Faustino_Asprilla.jpg', 'File:Colombia vs Brasil.jpg'],
  ['src/assets/players/Colombia/Leonel_Alvarez.jpg', 'File:Leonel de Jesús Álvarez Zuleta.jpg'],
  ['src/assets/players/Colombia/Rene_Higuita.jpg', 'File:Selección de fútbol de Colombia, Italia 90.jpg'],
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

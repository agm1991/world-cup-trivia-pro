#!/usr/bin/env node
/**
 * Re-download zero-byte files under src/assets/players (Guess Who portraits).
 * Run: node scripts/fix-empty-player-portraits.mjs
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const UA = 'WorldCupTriviaPro/1.0 (educational; Wikimedia API)';

const DOWNLOADS = {
  'src/assets/players/Cameroon/Rigobert_Song.jpg': 'File:Rigobert Song.jpg',
  'src/assets/players/Cameroon/Roger_Milla.jpg': 'File:Milla2008.JPG',
  'src/assets/players/Belgium/Thibaut_Courtois.jpg': 'File:Thibaut Courtois 2018.jpg',
  'src/assets/players/Belgium/Eden_Hazard.jpg': 'File:Eden Hazard 2018.jpg',
  'src/assets/players/Belgium/Kevin_De_Bruyne.jpg': 'File:Kevin De Bruyne 2018.jpg',
  'src/assets/players/Morocco/Achraf_Hakimi.jpg': 'File:Achraf Hakimi 2024.jpg',
  'src/assets/players/Croatia/Alen_Boksic.jpg': 'File:Bokšić.jpg',
  'src/assets/players/Uruguay/Alvaro_Recoba.jpg': 'File:Alvaro Recoba.jpg',
  'src/assets/players/Uruguay/Obdulio_Varela.jpg': 'File:Obdulio varela uruguay.jpg',
  'src/assets/players/Algeria/Riyad_Mahrez.jpg': 'File:Riyad Mahrez 2018.jpg',
  'src/assets/players/Algeria/Islam_Slimani.jpg':
    'File:Algérie - Arménie - 20140531 - Islam Slimani (cropped).jpg',
  'src/assets/players/Switzerland/Haris_Seferovic.jpg': 'File:Haris Seferović 2018.jpg',
  'src/assets/players/Switzerland/Valon_Behrami.jpg': 'File:Valon Behrami 2018.jpg',
  'src/assets/players/Switzerland/Stephane_Chapuisat.jpg':
    'File:Football against poverty 2014 - Stéphane Chapuisat.jpg',
  'src/assets/players/Senegal/Sadio_Mane.jpg': 'File:Sadio Mané 2018.jpg',
};

function apiUrl(params) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

async function getImageUrl(fileTitle) {
  const res = await fetch(apiUrl({
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
  }), { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  if (!page || page.missing) throw new Error(`Missing: ${fileTitle}`);
  return page.imageinfo?.[0]?.url;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const f = fs.createWriteStream(dest);
    https
      .get(url, { headers: { 'User-Agent': UA } }, (r) => {
        if (r.statusCode === 301 || r.statusCode === 302) {
          r.resume();
          return download(r.headers.location, dest).then(resolve).catch(reject);
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

async function main() {
  let failed = 0;
  for (const [rel, title] of Object.entries(DOWNLOADS)) {
    const dest = path.join(ROOT, rel);
    const stat = fs.existsSync(dest) ? fs.statSync(dest) : null;
    if (stat && stat.size > 5000) {
      console.log(`skip ${rel} (${stat.size} bytes)`);
      continue;
    }
    process.stdout.write(`${rel} ... `);
    try {
      const url = await getImageUrl(title);
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log(size > 5000 ? `ok (${size})` : `WARN small (${size})`);
      if (size < 5000) failed++;
    } catch (e) {
      console.log('FAIL', e.message);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 2500));
  }
  process.exit(failed ? 1 : 0);
}

main();

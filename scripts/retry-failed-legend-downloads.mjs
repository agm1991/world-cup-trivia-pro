#!/usr/bin/env node
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
  ['src/assets/players/Australia/Tim_Cahill.jpg', 'File:Tim Cahill Australian football player.JPG'],
  ['src/assets/players/Australia/Harry_Kewell.jpg', 'File:Harry Kewell.jpg'],
  ['src/assets/players/Morocco/Achraf_Hakimi.jpg', 'File:Achraf Hakimi 2024.jpg'],
  ['src/assets/players/Morocco/Yassine_Bounou.jpg', 'File:Yassine Bounou.jpg'],
  ['src/assets/players/Senegal/El_Hadji_Diouf.jpg', 'File:El Hadji Diouf.jpg'],
  ['src/assets/players/Senegal/Kalidou_Koulibaly.jpg', 'File:Kalidou Koulibaly (cropped).jpg'],
  ['src/assets/players/Ghana/Michael_Essien.jpg', 'File:Michael Essien 4598.jpg'],
  ['src/assets/players/Ghana/Andre_Ayew.jpg', 'File:Ghana (1) (cropped André Ayew).jpg'],
  [
    'src/assets/players/Ghana/KevinPrince_Boateng.jpg',
    'File:Kevin-Prince Boateng and Álvaro Fernández – Ghana vs. Uruguay 2010 FIFA World Cup.jpg',
  ],
  ['src/assets/players/Cameroon/Roger_Milla.jpg', 'File:Milla2008.JPG'],
  ['src/assets/players/Cameroon/Rigobert_Song.jpg', 'File:Rigobert Song.jpg'],
  ['src/assets/players/Algeria/Rabah_Madjer.jpg', 'File:Madjer, rabah 1986.jpg'],
  ['src/assets/players/Algeria/Islam_Slimani.jpg', 'File:Algérie - Arménie - 20140531 - Islam Slimani (cropped).jpg'],
  ['src/assets/players/Algeria/Sofiane_Feghouli.jpg', 'File:Algérie - Arménie - 20140531 - Sofiane Feghouli.jpg'],
  ['src/assets/players/Greece/Giorgos_Karagounis.jpg', 'File:Georgios Karagounis 2010.jpg'],
  ['src/assets/players/Greece/Angelos_Charisteas.jpg', 'File:Angelos Charisteas 2007.jpg'],
  ['src/assets/players/Greece/Georgios_Samaras.jpg', 'File:Georgios Samaras Greece 2010.jpg'],
  ['src/assets/players/Croatia/Alen_Boksic.jpg', 'File:Bokšić.jpg'],
  ['src/assets/players/Switzerland/Stephane_Chapuisat.jpg', 'File:Football against poverty 2014 - Stéphane Chapuisat.jpg'],
  ['src/assets/players/Switzerland/Valon_Behrami.jpg', 'File:Valon Behrami 2018.jpg'],
  ['src/assets/players/Switzerland/Blerim_Dzemaili.jpg', 'File:Blerim Dzemaili 2018.jpg'],
  ['src/assets/players/Switzerland/Haris_Seferovic.jpg', 'File:Haris Seferović 2018.jpg'],
  ['src/assets/players/Uruguay/Enzo_Francescoli.jpg', 'File:Enzo Francescoli 2011.jpg'],
  ['src/assets/players/Uruguay/Alvaro_Recoba.jpg', 'File:Alvaro Recoba.jpg'],
  ['src/assets/players/Uruguay/Juan_Schiaffino.jpg', 'File:Schiaffino (cropped).jpg'],
  ['src/assets/players/Uruguay/Obdulio_Varela.jpg', 'File:Obdulio varela uruguay.jpg'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  for (const [rel, fileTitle] of jobs) {
    const dest = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    process.stdout.write(`${rel} ... `);
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const url = await getImageUrl(fileTitle);
        if (!url) throw new Error('no url');
        await download(url, dest);
        console.log('ok');
        break;
      } catch (e) {
        const wait = 8000 + attempt * 4000;
        if (attempt === 4) {
          console.log('FAIL', e.message);
          process.exitCode = 1;
        } else {
          await sleep(wait);
        }
      }
    }
    await sleep(5000);
  }
}

main();

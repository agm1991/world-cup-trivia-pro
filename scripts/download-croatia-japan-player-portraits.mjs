#!/usr/bin/env node
/**
 * Wikimedia Commons — Croatia + Japan national-team style portraits.
 * Run: node scripts/download-croatia-japan-player-portraits.mjs
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
  // Croatia (replace zidaneImg placeholders)
  ['src/assets/players/Croatia/Luka_Modric.jpg', 'File:Luka Modrić in 2018.jpg'],
  ['src/assets/players/Croatia/Davor_Suker.jpg', 'File:Football against poverty 2014 - Davor Šuker (cropped).jpg'],
  ['src/assets/players/Croatia/Ivan_Rakitic.jpg', 'File:Ivan Rakitic 2018 (cropped).jpg'],
  ['src/assets/players/Croatia/Mario_Mandzukic.jpg', 'File:Mario Mandžukić in 2018.jpg'],
  ['src/assets/players/Croatia/Ivan_Perisic.jpg', 'File:Perisic final (cropped).jpg'],
  ['src/assets/players/Croatia/Dejan_Lovren.jpg', 'File:Dejan Lovren Croatia.jpg'],
  ['src/assets/players/Croatia/Marcelo_Brozovic.jpg', 'File:Marcelo Brozović 2021 (cropped).jpg'],
  ['src/assets/players/Croatia/Sime_Vrsaljko.jpg', 'File:Šime Vrsaljko 2018.jpg'],
  ['src/assets/players/Croatia/Zvonimir_Boban.jpg', 'File:Zvonimir Boban in 2018.jpg'],
  // Alen Bokšić: no verifiable player photo on Commons (File:Bokšić.jpg is a map) — use placeholder in UI
  // Japan (replace peleImg placeholders)
  ['src/assets/players/Japan/Shinji_Kagawa.jpg', 'File:Shinji Kagawa 2018 (cropped).jpg'],
  ['src/assets/players/Japan/Keisuke_Honda.jpg', 'File:Keisuke Honda 2018 (cropped).jpg'],
  ['src/assets/players/Japan/Makoto_Hasebe.jpg', 'File:Makoto Hasebe 2018 (cropped).jpg'],
  ['src/assets/players/Japan/Yuto_Nagatomo.jpg', 'File:Yuto Nagatomo 2018 (cropped).jpg'],
  ['src/assets/players/Japan/Shinji_Okazaki.jpg', 'File:Shinji Okazaki Japan 2018.jpg'],
  ['src/assets/players/Japan/Hidetoshi_Nakata.jpg', 'File:Hidetoshi Nakata, preparing for Football World Cup 2006.jpg'],
  ['src/assets/players/Japan/Junichi_Inamoto.jpg', 'File:Junichi Inamoto.jpg'],
  [
    'src/assets/players/Japan/Yoshikatsu_Kawaguchi.jpg',
    'File:Yoshikatsu Kawaguchi in national team of Japan.JPG',
  ],
  ['src/assets/players/Japan/Takashi_Inui.jpg', 'File:Takashi Inui 2018 (cropped).jpg'],
  ['src/assets/players/Japan/Genki_Haraguchi.jpg', 'File:Genki Haraguchi Japan 2018.jpg'],
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

#!/usr/bin/env node
/**
 * Wikimedia Commons portraits for new Select a Legend countries + roster fixes.
 * Run: node scripts/download-legend-ten-countries-and-fixes.mjs
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
  // Belgium
  ['src/assets/players/Belgium/Kevin_De_Bruyne.jpg', 'File:Kevin De Bruyne WC2022.jpg'],
  ['src/assets/players/Belgium/Eden_Hazard.jpg', 'File:Eden Hazard Rajasekharan 2017.jpg'],
  ['src/assets/players/Belgium/Thibaut_Courtois.jpg', 'File:Thibaut Courtois WC2022.jpg'],
  // Poland
  ['src/assets/players/Poland/Robert_Lewandowski.jpg', 'File:Robert Lewandowski 2018, JAP-POL (cropped).jpg'],
  ['src/assets/players/Poland/Zbigniew_Boniek.jpg', 'File:Zbigniew Boniek 2015.jpg'],
  ['src/assets/players/Poland/Piotr_Zielinski.jpg', 'File:Piotr Zieliński 2018.jpg'],
  // South Korea
  ['src/assets/players/SouthKorea/Son_Heung-min.jpg', 'File:190608 오픈 트레이닝 데이 손흥민 2.jpg'],
  ['src/assets/players/SouthKorea/Park_Ji-sung.jpg', 'File:Ji-Sung Park vs Fulham (cropped).jpg'],
  ['src/assets/players/SouthKorea/Cha_Bum-kun.jpg', 'File:Cha Bum-Kun.jpg'],
  // Australia
  ['src/assets/players/Australia/Tim_Cahill.jpg', 'File:Tim Cahill (53557484101).jpg'],
  ['src/assets/players/Australia/Harry_Kewell.jpg', 'File:Harry Kewell.jpg'],
  ['src/assets/players/Australia/Mark_Viduka.jpg', 'File:Mark Viduka 2005 WCQ.jpg'],
  // Morocco
  ['src/assets/players/Morocco/Achraf_Hakimi.jpg', 'File:Achraf Hakimi 2024.jpg'],
  ['src/assets/players/Morocco/Hakim_Ziyech.jpg', 'File:Hakim Ziyech 2021.jpg'],
  ['src/assets/players/Morocco/Yassine_Bounou.jpg', 'File:Yassine Bounou.jpg'],
  // Senegal
  ['src/assets/players/Senegal/Sadio_Mane.jpg', 'File:Sadio Mané Senegal.jpg'],
  ['src/assets/players/Senegal/El_Hadji_Diouf.jpg', 'File:El Hadji Diouf.jpg'],
  ['src/assets/players/Senegal/Kalidou_Koulibaly.jpg', 'File:Kalidou Koulibaly (cropped).jpg'],
  // Ghana
  ['src/assets/players/Ghana/Michael_Essien.jpg', 'File:Michael Essien 4598.jpg'],
  ['src/assets/players/Ghana/Asamoah_Gyan.jpg', 'File:Asamoah Gyan (2014).jpg'],
  ['src/assets/players/Ghana/Abedi_Pele.jpg', 'File:Abédi Pélé (cropped).jpg'],
  // Ghana kit: cropped national-team portraits on Commons (prior filenames were missing / placeholders).
  ['src/assets/players/Ghana/Andre_Ayew.jpg', 'File:Ghana (1) (cropped André Ayew).jpg'],
  [
    'src/assets/players/Ghana/KevinPrince_Boateng.jpg',
    'File:Kevin-Prince Boateng and Álvaro Fernández – Ghana vs. Uruguay 2010 FIFA World Cup.jpg',
  ],
  // Cameroon
  ['src/assets/players/Cameroon/Samuel_Etoo.jpg', "File:Samuel Eto'o vs Morocco.jpg"],
  ['src/assets/players/Cameroon/Roger_Milla.jpg', 'File:Milla2008.JPG'],
  ['src/assets/players/Cameroon/Rigobert_Song.jpg', 'File:Rigobert Song.jpg'],
  // Algeria (national-team kit; solo framing where available on Commons)
  ['src/assets/players/Algeria/Riyad_Mahrez.jpg', 'File:Riyad Mahrez - 2014 World Cup.jpg'],
  ['src/assets/players/Algeria/Rabah_Madjer.jpg', 'File:Madjer, rabah 1986.jpg'],
  ['src/assets/players/Algeria/Islam_Slimani.jpg', 'File:Algérie - Arménie - 20140531 - Islam Slimani (cropped).jpg'],
  ['src/assets/players/Algeria/Sofiane_Feghouli.jpg', 'File:Algérie - Arménie - 20140531 - Sofiane Feghouli.jpg'],
  // Greece
  ['src/assets/players/Greece/Giorgos_Karagounis.jpg', 'File:Georgios Karagounis 2010.jpg'],
  ['src/assets/players/Greece/Angelos_Charisteas.jpg', 'File:Angelos Charisteas 2007.jpg'],
  ['src/assets/players/Greece/Georgios_Samaras.jpg', 'File:Georgios Samaras Greece 2010.jpg'],
  // Fixes: Croatia, Switzerland, Uruguay
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

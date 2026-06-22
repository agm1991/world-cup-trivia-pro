#!/usr/bin/env node
/**
 * Wikimedia Commons — national-team / tournament portraits for legends that used placeholders.
 * Prefers face-forward or bust shots; many are from WC/Euro qualifiers or friendly series.
 * Run: node scripts/download-missing-legend-portraits.mjs
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
  // Sweden
  ['src/assets/players/Sweden/Olof_Mellberg.jpg', 'File:Olof Mellberg (cropped).jpg'],
  ['src/assets/players/Sweden/Anders_Svensson.jpg', 'File:Anders Svensson (cropped).jpg'],
  ['src/assets/players/Sweden/Emil_Forsberg.jpg', 'File:Forsberg 2018 (cropped).jpg'],
  [
    'src/assets/players/Sweden/Victor_Lindelof.jpg',
    'File:UEFA EURO qualifiers Sweden vs Spain 20191015 Victor Nilsson Lindelöf 2 (cropped).jpg',
  ],
  [
    'src/assets/players/Sweden/Sebastian_Larsson.jpg',
    'File:UEFA EURO qualifiers Sweden vs Romaina 20190323 Sebastian Larsson (cropped).jpg',
  ],
  ['src/assets/players/Sweden/Kennet_Andersson.jpg', 'File:Kennet Andersson in Jan 2014.jpg'],
  ['src/assets/players/Sweden/Tomas_Brolin.jpg', 'File:Tomas Brolin.jpg'],
  // Turkey
  ['src/assets/players/Turkey/Hakan_Sukur.jpg', 'File:Hakan şükür.jpg'],
  ['src/assets/players/Turkey/Rustu_Recber.jpg', 'File:Rustu Recber 2010.jpg'],
  ['src/assets/players/Turkey/Nihat_Kahveci.jpg', 'File:AUT vs. TUR 2016-03-29 (193).jpg'],
  ['src/assets/players/Turkey/Emre_Belozoglu.jpg', 'File:Emre in national team (11.08.2010) (cropped).JPG'],
  ['src/assets/players/Turkey/Hasan_Sas.jpg', "File:Hasan Şaş'13.JPG"],
  // Hungary
  ['src/assets/players/Hungary/Gyula_Grosics.jpg', 'File:Gyula Grosics 1953.jpg'],
  ['src/assets/players/Hungary/Florian_Albert.jpg', 'File:Florian Albert en 1966.jpg'],
  ['src/assets/players/Hungary/Lajos_Tichy.jpg', 'File:Tichy Lajos Fortepan 261534.jpg'],
  ['src/assets/players/Hungary/Ferenc_Bene.jpg', 'File:Ferenc Bene in Dorog, 1998.jpg'],
  ['src/assets/players/Hungary/Tibor_Nyilasi.jpg', 'File:Tibor Nyilasi (cropped).jpg'],
  ['src/assets/players/Hungary/Lajos_Detari.jpg', 'File:Détári Lajos 2011.jpg'],
  // Denmark
  ['src/assets/players/Denmark/Preben_Elkjaer.jpg', 'File:Preben Elkjær.jpg'],
  ['src/assets/players/Denmark/Morten_Olsen.jpg', 'File:Morten Olsen 2012 (cropped).jpg'],
  ['src/assets/players/Denmark/Thomas_Delaney.jpg', 'File:Delaney, Thomas Werder 17-18 WP (cropped).jpg'],
  ['src/assets/players/Denmark/Yussuf_Poulsen.jpg', 'File:Yussuf Poulsen (cropped).JPG'],
  ['src/assets/players/Denmark/Simon_Kjaer.jpg', 'File:Simon Kjær 2017 (cropped).jpg'],
  // Saudi Arabia
  ['src/assets/players/SaudiArabia/Sami_Al-Jaber.jpg', 'File:Sami Al-Jaber - سامي الجابر.jpg'],
  ['src/assets/players/SaudiArabia/Mohammed_Al-Deayea.jpg', 'File:Mohamed Al-Deayea 2010.jpg'],
  ['src/assets/players/SaudiArabia/Saeed_Al-Owairan.jpg', 'File:Saeed Al Owarian.jpg'],
  ['src/assets/players/SaudiArabia/Yasser_Al-Qahtani.jpg', 'File:Yasser Al-Qahtani 2010.jpg'],
  // Ecuador
  ['src/assets/players/Ecuador/Enner_Valencia.jpg', 'File:Enner Valencia, January 2016.jpg'],
  ['src/assets/players/Ecuador/Antonio_Valencia.jpg', 'File:Antonio Valencia cropped.jpg'],
  ['src/assets/players/Ecuador/Ivan_Kaviedes.jpg', 'File:Ivan Kaviedes Aucas 2012.jpg'],
  ['src/assets/players/Ecuador/Agustin_Delgado.jpg', 'File:Agustín Delgado 2016.jpg'],
  ['src/assets/players/Ecuador/Edison_Mendez.jpg', 'File:Edison Mendez (cropped).jpg'],
  // Russia
  ['src/assets/players/Russia/Igor_Akinfeev.jpg', 'File:Igor Akinfeev Russia.jpg'],
  ['src/assets/players/Russia/Yuri_Zhirkov.jpg', 'File:Yuri Zhirkov 4535.jpg'],
  ['src/assets/players/Russia/Aleksandr_Kerzhakov.jpg', 'File:Aleksandr Kerzhakov in 2014.jpg'],
  ['src/assets/players/Russia/Andrey_Arshavin.jpg', 'File:Andrey Arshavin.jpg'],
  // Norway
  ['src/assets/players/Norway/Ole_Gunnar_Solskjaer.jpg', 'File:Solskjaer cropped.jpg'],
  ['src/assets/players/Norway/Tore_Andre_Flo.jpg', 'File:Tore Andre Flo 2006 06 06.jpg'],
  ['src/assets/players/Norway/Rune_Bratseth.jpg', 'File:Rune Bratseth.jpg'],
  ['src/assets/players/Norway/Kjetil_Rekdal.jpg', 'File:Kjetil Rekdal 2006-06-06.jpg'],
  ['src/assets/players/Norway/Henning_Berg.jpg', 'File:Legia tren (2).jpg'],
  // Chile
  [
    'src/assets/players/Chile/Alexis_Sanchez.jpg',
    'File:Alexis Sánchez Footballteam of Chile - Spain vs. Chile, 10th September 2013 (cropped).jpg',
  ],
  [
    'src/assets/players/Chile/Arturo_Vidal.jpg',
    'File:Arturo Vidal Footballteam of Chile - Spain vs. Chile, 10th September 2013 (cropped).jpg',
  ],
  [
    'src/assets/players/Chile/Claudio_Bravo.jpg',
    'File:Claudio Bravo Footballteam of Chile - Spain vs. Chile, 10th September 2013 (cropped).jpg',
  ],
  ['src/assets/players/Chile/Ivan_Zamorano.jpg', 'File:Iván Zamorano.jpg'],
  ['src/assets/players/Chile/Marcelo_Salas.jpg', 'File:Marcelo Salas.jpg'],
  // Bulgaria
  ['src/assets/players/Bulgaria/Hristo_Stoichkov.jpg', 'File:Hristo stoichkov-2010 (crop).jpg'],
  ['src/assets/players/Bulgaria/Krasimir_Balakov.jpg', 'File:Krasimir Balakov 2015 (cropped).JPG'],
  ['src/assets/players/Bulgaria/Dimitar_Berbatov.jpg', 'File:Dimitar Berbatov (51100401402).jpg'],
  ['src/assets/players/Bulgaria/Stiliyan_Petrov.jpg', 'File:Stiliyan Petrov - 2011 (2).jpg'],
  ['src/assets/players/Bulgaria/Emil_Kostadinov.jpg', 'File:Emil Kostadinov new.JPG'],
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

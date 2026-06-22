/**
 * Downloads Wikimedia Commons portraits for Select a Legend (one title at a time; avoids 429s).
 * Run: node scripts/download-select-legend-kit-photos.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../src/assets/players');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @type {{ dir: string; file: string; commonsTitle: string }[]} */
const MANIFEST = [
  { dir: 'SouthKorea', file: 'Son_Heung-min.jpg', commonsTitle: 'File:Mex-Kor (19) (cropped).jpg' },
  {
    dir: 'SouthKorea',
    file: 'Park_Ji-sung.jpg',
    commonsTitle: 'File:Korea Republic national football team Samsung Galaxy S in 2010 from acrofan.jpg',
  },
  { dir: 'SouthKorea', file: 'Cha_Bum-kun.jpg', commonsTitle: 'File:Corea del Sur 1970.jpg' },
  // Switzerland — prefer Russia 2018 kit portraits over generic/club-adjacent uploads
  { dir: 'Switzerland', file: 'Xherdan_Shaqiri.jpg', commonsTitle: 'File:Xherdan Shaqiri 2018.jpg' },
  { dir: 'Switzerland', file: 'Granit_Xhaka.jpg', commonsTitle: 'File:Granit Xhaka 2018.jpg' },
  { dir: 'Switzerland', file: 'Yann_Sommer.jpg', commonsTitle: 'File:Yann Sommer 2018.jpg' },
  { dir: 'Switzerland', file: 'Alexander_Frei.jpg', commonsTitle: 'File:Alexander Frei.jpg' },
  { dir: 'Switzerland', file: 'Stephan_Lichtsteiner.jpg', commonsTitle: 'File:Stephan Lichtsteiner.jpg' },
  { dir: 'Switzerland', file: 'Stephane_Chapuisat.jpg', commonsTitle: 'File:Stephane Chapuisat.jpg' },
  { dir: 'Switzerland', file: 'Ricardo_Rodriguez.jpg', commonsTitle: 'File:Ricardo Rodríguez.jpg' },
  { dir: 'Switzerland', file: 'Valon_Behrami.jpg', commonsTitle: 'File:Valon Behrami.jpg' },
  { dir: 'Switzerland', file: 'Blerim_Dzemaili.jpg', commonsTitle: 'File:Blerim Džemaili.jpg' },
  { dir: 'Switzerland', file: 'Haris_Seferovic.jpg', commonsTitle: 'File:Haris Seferovic.jpg' },
  { dir: 'CzechRepublic', file: 'Tomas_Rosicky.jpg', commonsTitle: 'File:Tomáš Rosický.jpg' },
  { dir: 'CzechRepublic', file: 'Petr_Cech.jpg', commonsTitle: 'File:Petr Čech.jpg' },
  { dir: 'CzechRepublic', file: 'Jan_Koller.jpg', commonsTitle: 'File:Jan Koller.jpg' },
  { dir: 'CzechRepublic', file: 'Milan_Baros.jpg', commonsTitle: 'File:Milan Baroš.jpg' },
  { dir: 'CzechRepublic', file: 'Tomas_Ujfalusi.jpg', commonsTitle: 'File:Tomáš Ujfaluši.jpg' },
  { dir: 'CzechRepublic', file: 'Jaroslav_Plasil.jpg', commonsTitle: 'File:Jaroslav Plašil.jpg' },
  { dir: 'CzechRepublic', file: 'Karel_Poborsky.jpg', commonsTitle: 'File:Karel Poborský.jpg' },
  { dir: 'CzechRepublic', file: 'Patrik_Berger.jpg', commonsTitle: 'File:Patrik Berger.jpg' },
  { dir: 'CzechRepublic', file: 'Vladimir_Smicer.jpg', commonsTitle: 'File:Vladimír Šmicer.jpg' },
  { dir: 'Nigeria', file: 'JayJay_Okocha.jpg', commonsTitle: 'File:Match legends 2017 CC (1).jpg' },
  { dir: 'Nigeria', file: 'Nwankwo_Kanu.jpg', commonsTitle: 'File:1 nwankwo kanu 2017 (cropped).jpg' },
  { dir: 'Nigeria', file: 'Ahmed_Musa.jpg', commonsTitle: 'File:Ahmed Musa 2018.jpg' },
  { dir: 'Denmark', file: 'Michael_Laudrup.jpg', commonsTitle: 'File:Michael Laudrup.jpg' },
  { dir: 'Denmark', file: 'Peter_Schmeichel.jpg', commonsTitle: 'File:Peter Schmeichel 2012-01-25 001.jpg' },
  { dir: 'Denmark', file: 'Kasper_Schmeichel.jpg', commonsTitle: 'File:Kasper Schmeichel 2021.jpg' },
  { dir: 'Denmark', file: 'Preben_Elkjaer.jpg', commonsTitle: 'File:Preben Elkjær.jpg' },
  { dir: 'Denmark', file: 'Morten_Olsen.jpg', commonsTitle: 'File:Morten Olsen.jpg' },
  { dir: 'Denmark', file: 'Thomas_Delaney.jpg', commonsTitle: 'File:Thomas Delaney.jpg' },
  { dir: 'Denmark', file: 'Yussuf_Poulsen.jpg', commonsTitle: 'File:Yussuf Poulsen.jpg' },
  { dir: 'Denmark', file: 'Simon_Kjaer.jpg', commonsTitle: 'File:Simon Kjær.jpg' },
  { dir: 'Hungary', file: 'Ferenc_Puskas.jpg', commonsTitle: 'File:Ferenc Puskás.jpg' },
  { dir: 'Hungary', file: 'Sandor_Kocsis.jpg', commonsTitle: 'File:Kocsis Sándor.jpg' },
  { dir: 'Hungary', file: 'Nandor_Hidegkuti.jpg', commonsTitle: 'File:Hidegkuti Nándor.jpg' },
  { dir: 'Hungary', file: 'Zoltan_Czibor.jpg', commonsTitle: 'File:Czibor Zoltán.jpg' },
  { dir: 'Hungary', file: 'Gyula_Grosics.jpg', commonsTitle: 'File:Grosics Gyula.jpg' },
  { dir: 'Hungary', file: 'Florian_Albert.jpg', commonsTitle: 'File:Albert Flórián.jpg' },
  { dir: 'Hungary', file: 'Lajos_Tichy.jpg', commonsTitle: 'File:Tichy Lajos.jpg' },
  { dir: 'Hungary', file: 'Ferenc_Bene.jpg', commonsTitle: 'File:Bene Ferenc.jpg' },
  { dir: 'Hungary', file: 'Tibor_Nyilasi.jpg', commonsTitle: 'File:Nyilasi Tibor.jpg' },
  { dir: 'Hungary', file: 'Lajos_Detari.jpg', commonsTitle: 'File:Détári Lajos.jpg' },
  { dir: 'Turkey', file: 'Hakan_Sukur.jpg', commonsTitle: 'File:Hakan Şükür.jpg' },
  { dir: 'Turkey', file: 'Rustu_Recber.jpg', commonsTitle: 'File:Rüştü Reçber.jpg' },
  { dir: 'Turkey', file: 'Arda_Turan.jpg', commonsTitle: 'File:Arda Turan.jpg' },
  { dir: 'Turkey', file: 'Nihat_Kahveci.jpg', commonsTitle: 'File:Nihat Kahveci.jpg' },
  { dir: 'Turkey', file: 'Emre_Belozoglu.jpg', commonsTitle: 'File:Emre Belözoğlu.jpg' },
  { dir: 'SaudiArabia', file: 'Sami_Al-Jaber.jpg', commonsTitle: 'File:Sami Al-Jaber.jpg' },
  { dir: 'SaudiArabia', file: 'Saeed_Al-Owairan.jpg', commonsTitle: 'File:Saeed Al-Owairan.jpg' },
  { dir: 'SaudiArabia', file: 'Mohamed_Al-Deayea.jpg', commonsTitle: 'File:Mohamed Al-Deayea.jpg' },
  { dir: 'SaudiArabia', file: 'Yasser_Al-Mosailem.jpg', commonsTitle: 'File:Yasser Al-Mosailem.jpg' },
  { dir: 'SaudiArabia', file: 'Salem_Al-Dawsari.jpg', commonsTitle: 'File:Salem Al-Dawsari.jpg' },
  { dir: 'Ecuador', file: 'Enner_Valencia.jpg', commonsTitle: 'File:Enner Valencia.jpg' },
  { dir: 'Ecuador', file: 'Antonio_Valencia.jpg', commonsTitle: 'File:Antonio Valencia.jpg' },
  { dir: 'Ecuador', file: 'Agustin_Delgado.jpg', commonsTitle: 'File:Agustín Delgado.jpg' },
  { dir: 'Ecuador', file: 'Edison_Mendez.jpg', commonsTitle: 'File:Edison Méndez.jpg' },
  { dir: 'Ecuador', file: 'Ivan_Kaviedes.jpg', commonsTitle: 'File:Iván Kaviedes.jpg' },
  // Russia Select-a-Legend — Wikimedia originals in national-team kit (re-download with: node scripts/download-select-legend-kit-photos.mjs)
  { dir: 'Russia', file: 'Igor_Akinfeev.jpg', commonsTitle: 'File:Igor Akinfeev Russia.jpg' },
  { dir: 'Russia', file: 'Artem_Dzyuba.jpg', commonsTitle: 'File:Dzyuba 2018.jpg' },
  {
    dir: 'Russia',
    file: 'Lev_Yashin.jpg',
    commonsTitle:
      'File:Lev Yashin, fails to stop a goal during the soccer match agains Israel, 1958 D448-092.jpg',
  },
  { dir: 'Russia', file: 'Oleg_Salenko.jpg', commonsTitle: 'File:O.Salenko.JPG' },
  { dir: 'Russia', file: 'Yuri_Zhirkov.jpg', commonsTitle: 'File:Yuri Zhirkov.jpg' },
  { dir: 'Russia', file: 'Sergei_Ignashevich.jpg', commonsTitle: 'File:Sergei Ignashevich.jpg' },
  { dir: 'Norway', file: 'Erling_Haaland.jpg', commonsTitle: 'File:Erling Haaland 2023 (cropped).jpg' },
  { dir: 'Norway', file: 'Ole_Gunnar_Solskjaer.jpg', commonsTitle: 'File:Ole Gunnar Solskjær.jpg' },
  { dir: 'Norway', file: 'Martin_Odegaard.jpg', commonsTitle: 'File:Martin Ødegaard.jpg' },
  { dir: 'Norway', file: 'Tore_Andre_Flo.jpg', commonsTitle: 'File:Tore André Flo.jpg' },
  { dir: 'Norway', file: 'John_Arne_Riise.jpg', commonsTitle: 'File:John Arne Riise.jpg' },
  { dir: 'Chile', file: 'Alexis_Sanchez.jpg', commonsTitle: 'File:Alexis Sánchez.jpg' },
  { dir: 'Chile', file: 'Arturo_Vidal.jpg', commonsTitle: 'File:Arturo Vidal.jpg' },
  { dir: 'Chile', file: 'Claudio_Bravo.jpg', commonsTitle: 'File:Claudio Bravo.jpg' },
  { dir: 'Chile', file: 'Mauricio_Isla.jpg', commonsTitle: 'File:Mauricio Isla.jpg' },
  { dir: 'Chile', file: 'Eduardo_Vargas.jpg', commonsTitle: 'File:Eduardo Vargas.jpg' },
  { dir: 'Bulgaria', file: 'Hristo_Stoichkov.jpg', commonsTitle: 'File:Hristo Stoichkov (cropped).jpg' },
  { dir: 'Bulgaria', file: 'Krasimir_Balakov.jpg', commonsTitle: 'File:Krasimir Balakov.jpg' },
  { dir: 'Bulgaria', file: 'Dimitar_Berbatov.jpg', commonsTitle: 'File:Dimitar Berbatov.jpg' },
  { dir: 'Bulgaria', file: 'Daniel_Borimirov.jpg', commonsTitle: 'File:Daniel Borimirov.jpg' },
  { dir: 'Bulgaria', file: 'Yordan_Letchkov.jpg', commonsTitle: 'File:Yordan Letchkov.jpg' },
];

async function getUrl(title) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  u.searchParams.set('action', 'query');
  u.searchParams.set('titles', title);
  u.searchParams.set('prop', 'imageinfo');
  u.searchParams.set('iiprop', 'url');
  u.searchParams.set('format', 'json');
  const j = await (await fetch(u)).json();
  const page = Object.values(j.query.pages)[0];
  if (page.missing || !page.imageinfo?.[0]?.url) return null;
  return page.imageinfo[0].url;
}

async function downloadFile(url, dest) {
  for (let a = 0; a < 6; a++) {
    const res = await fetch(url);
    if (res.status === 429) {
      await sleep(2000 * (a + 1));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    return;
  }
  throw new Error('HTTP 429');
}

async function main() {
  const failed = [];
  for (const item of MANIFEST) {
    const dest = path.join(ROOT, item.dir, item.file);
    try {
      await sleep(900);
      const url = await getUrl(item.commonsTitle);
      if (!url) {
        failed.push({ ...item, reason: 'no Commons URL' });
        continue;
      }
      await sleep(400);
      await downloadFile(url, dest);
      process.stdout.write(`OK ${item.dir}/${item.file}\n`);
    } catch (e) {
      failed.push({ ...item, reason: String(e.message || e) });
    }
  }
  if (failed.length) {
    console.error('\n--- Failed ---');
    for (const f of failed) console.error(f.dir, f.file, f.reason);
    process.exitCode = 1;
  }
}

main();

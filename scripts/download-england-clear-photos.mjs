#!/usr/bin/env node
/**
 * Replaces England player photos (except Gerrard, Kane, Bobby Moore, Gordon Banks)
 * with Wikimedia Commons images.
 * License: CC / public domain per each file’s page (Commons or it.wikipedia for Gascoigne).
 *
 * Charlton: Panini México 70 sticker (England kit). Lineker: Euro 1988 England–Netherlands (Anefo; England kit, B&W). Rooney: England kit on Commons. Gascoigne: it.wikipedia. Scaled thumbs where noted.
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const UA = 'WorldCupTriviaPro/1.0 (https://github.com; educational; Wikimedia API)';

function apiUrl(apiBase, params) {
  const u = new URL(apiBase);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

/** @param {{ thumbMaxWidth?: number; apiBase?: string }} [opts] — thumbMaxWidth uses scaled thumburl; apiBase defaults to Commons */
async function getImageUrl(fileTitle, opts = {}) {
  const apiBase = opts.apiBase ?? 'https://commons.wikimedia.org/w/api.php';
  const params = {
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
  };
  if (opts.thumbMaxWidth) {
    params.iiprop = 'url|size';
    params.iiurlwidth = String(opts.thumbMaxWidth);
  }
  const url = apiUrl(apiBase, params);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) throw new Error(`No pages for ${fileTitle}`);
  const page = Object.values(pages)[0];
  if (page.missing) throw new Error(`Missing: ${fileTitle}`);
  const ii = page.imageinfo?.[0];
  if (!ii) throw new Error(`No imageinfo for ${fileTitle}`);
  if (opts.thumbMaxWidth && ii.thumburl) return ii.thumburl;
  return ii.url;
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const jobs = [
  // Panini México 70 — England kit (same series as Geoff Hurst sticker). Not File:Bobby Charlton (1966).jpg (Schiphol arrival, plain clothes).
  ['src/assets/players/England/Bobby_Charlton.png', 'File:Bobby Charlton México 70.png'],
  // Euro 1988 England–Netherlands — England kit, match action (CC0). Not Gary Lineker (cropped).jpg (2010 event photo, not kit).
  [
    'src/assets/players/England/Gary_Lineker.jpg',
    'File:EK voetbal in West Duitsland Engeland tegen Nederland 1-3, Bestanddeelnr 934-2662.jpg',
    { thumbMaxWidth: 1400 },
  ],
  // Mexico 1970 World Cup — Panini England sticker (face + England kit)
  ['src/assets/players/England/Geoff_Hurst.png', 'File:Geoff Hurst México 70.png'],
  ['src/assets/players/England/David_Beckham.jpg', 'File:David Beckham.jpg'],
  // 1990 kit action shot — hosted on it.wikipedia (same filename; not duplicated on Commons)
  [
    'src/assets/players/England/Paul_Gascoigne.jpg',
    'File:Paul_Gascoigne_-_Inghilterra_-_Mondiali_1990.jpg',
    { thumbMaxWidth: 1400, apiBase: 'https://it.wikipedia.org/w/api.php' },
  ],
  // White Nike England kit — File:England_striker_Wayne_Rooney_(23125438141).jpg on Commons
  ['src/assets/players/England/Wayne_Rooney.jpg', 'File:England striker Wayne Rooney (23125438141).jpg', { thumbMaxWidth: 1400 }],
];

async function main() {
  for (const job of jobs) {
    const [rel, fileTitle, imgOpts] = job;
    const dest = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    process.stdout.write(`${rel} ... `);
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const url = await getImageUrl(fileTitle, imgOpts ?? {});
        if (!url) throw new Error('no url');
        await download(url, dest);
        const st = fs.statSync(dest);
        if (st.size < 5000) throw new Error(`file too small (${st.size})`);
        console.log('ok', `(${Math.round(st.size / 1024)} KB)`);
        ok = true;
      } catch (e) {
        if (attempt < 2) await sleep(2500 * (attempt + 1));
        else {
          console.log('FAIL', e.message);
          process.exitCode = 1;
        }
      }
    }
    await sleep(600);
  }
}

main();

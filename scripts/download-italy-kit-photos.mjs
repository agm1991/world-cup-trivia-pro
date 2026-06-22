#!/usr/bin/env node
/**
 * Italy national kit — Totti (Commons 2006 final), Maldini & Nesta (it.wikipedia match photos).
 * License per each file page (CC / own work where stated).
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

/** @param {{ thumbMaxWidth?: number; apiBase?: string }} [opts] */
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
  [
    'src/assets/players/Italy/Francesco_Totti.jpg',
    'File:Italy vs France - FIFA World Cup 2006 final - Francesco Totti.jpg',
    { thumbMaxWidth: 1400 },
  ],
  [
    'src/assets/players/Italy/Paolo_Maldini.jpg',
    'File:Italia vs Argentina 2001-02-28 Roma - Paolo Maldini.jpg',
    { thumbMaxWidth: 1200, apiBase: 'https://it.wikipedia.org/w/api.php' },
  ],
  [
    'src/assets/players/Italy/Alessandro_Nesta.jpg',
    'File:Italia vs Inghilterra (Roma, 1997) - Nesta, Costacurta, Southgate.jpg',
    { thumbMaxWidth: 1400, apiBase: 'https://it.wikipedia.org/w/api.php' },
  ],
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

#!/usr/bin/env node
/**
 * Wesley Sneijder & Robin van Persie — Netherlands-kit portraits from Wikimedia Commons.
 * Run from repo root: node scripts/download-netherlands-sneijder-van-persie.mjs
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
  const raw = page.imageinfo?.[0]?.url;
  if (!raw) throw new Error('no url');
  return raw.split('?')[0];
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
  ['src/assets/players/Holland/Wesley_Sneijder.jpg', 'File:Wesley Sneijder (15487233555) (cropped).jpg'],
  [
    'src/assets/players/Holland/Robin_van_Persie.jpg',
    // Netherlands training 2014 — sharp portrait, KNVB kit (CC BY 2.0 — Kathi Rudminat; attribute if required)
    'File:Van Persie (15300483040) (crop).jpg',
  ],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let first = true;
  for (const [rel, fileTitle] of jobs) {
    if (!first) await sleep(4000);
    first = false;
    const dest = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    process.stdout.write(`${rel} ... `);
    try {
      const imgUrl = await getImageUrl(fileTitle);
      await download(imgUrl, dest);
      console.log(`ok (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      process.exitCode = 1;
    }
  }
}

main();

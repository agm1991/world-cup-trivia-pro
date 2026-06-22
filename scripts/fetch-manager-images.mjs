#!/usr/bin/env node
/**
 * Downloads Wikipedia lead images (or Wikidata P18) for managers into src/assets/managers/.
 * Skips slugs whose files already exist (keeps your manually added images).
 * Run: node scripts/fetch-manager-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../src/assets/managers');
const UA = 'WorldCupTriviaPro/1.0 (https://github.com/local; manager portraits for educational trivia)';
const DELAY_MS = 2200;

/** Wikipedia page title → filename slug (must match import names in ManagersSelect) */
const TARGETS = [
  { wiki: 'Enzo Bearzot', slug: 'enzo-bearzot' },
  { wiki: 'Vittorio Pozzo', slug: 'vittorio-pozzo' },
  { wiki: 'Carlos Alberto Parreira', slug: 'carlos-alberto-parreira' },
  { wiki: 'Mário Zagallo', slug: 'mario-zagallo' },
  { wiki: 'Vicente Feola', slug: 'vicente-feola' },
  { wiki: 'Aymoré Moreira', slug: 'aymore-moreira' },
  { wiki: 'Michel Hidalgo', slug: 'michel-hidalgo' },
  { wiki: 'Franz Beckenbauer', slug: 'franz-beckenbauer' },
  { wiki: 'Helmut Schön', slug: 'helmut-schon' },
  { wiki: 'Sepp Herberger', slug: 'sepp-herberger' },
  { wiki: 'Rudi Völler', slug: 'rudi-voller' },
  { wiki: 'Luis Aragonés', slug: 'luis-aragones' },
  { wiki: 'José Antonio Camacho', slug: 'jose-antonio-camacho' },
  { wiki: 'Javier Clemente', slug: 'javier-clemente' },
  { wiki: 'Fernando Hierro', slug: 'fernando-hierro' },
  { wiki: 'Alberto Suppici', slug: 'alberto-suppici' },
  { wiki: 'Juan López Fontana', slug: 'juan-lopez-fontana', wikidataSearch: 'Juan López Fontana Uruguay coach' },
  { wiki: 'Ondino Viera', slug: 'ondino-viera' },
  { wiki: 'Hugo Bagnulo', slug: 'hugo-bagnulo' },
  { wiki: 'Carlos Bilardo', slug: 'carlos-bilardo' },
  { wiki: 'César Luis Menotti', slug: 'cesar-luis-menotti' },
  { wiki: 'José Pékerman', slug: 'jose-pekerman' },
  { wiki: 'Daniel Passarella', slug: 'daniel-passarella' },
  { wiki: 'Javier Aguirre', slug: 'javier-aguirre' },
  { wiki: 'Ricardo La Volpe', slug: 'ricardo-la-volpe' },
  { wiki: 'Miguel Herrera', slug: 'miguel-herrera' },
  { wiki: 'Juan Carlos Osorio', slug: 'juan-carlos-osorio' },
  { wiki: 'Gerardo Martino', slug: 'gerardo-martino' },
  { wiki: 'Andy Roxburgh', slug: 'andy-roxburgh' },
  { wiki: 'Craig Brown (footballer, born 1940)', slug: 'craig-brown', wikidataSearch: 'Craig Brown Scottish football manager' },
  { wiki: 'Berti Vogts', slug: 'berti-vogts' },
  { wiki: 'Alex McLeish', slug: 'alex-mcleish' },
  { wiki: 'Gordon Strachan', slug: 'gordon-strachan' },
  { wiki: 'Guy Thys', slug: 'guy-thys' },
  { wiki: 'Marc Wilmots', slug: 'marc-wilmots' },
  { wiki: 'Roberto Martínez', slug: 'roberto-martinez' },
  { wiki: 'Domenico Tedesco', slug: 'domenico-tedesco' },
  { wiki: 'Graham Arnold', slug: 'graham-arnold' },
  { wiki: 'Clemens Westerhof', slug: 'clemens-westerhof' },
  { wiki: 'Stephen Keshi', slug: 'stephen-keshi' },
  { wiki: 'Gernot Rohr', slug: 'gernot-rohr' },
  { wiki: 'Sunday Oliseh', slug: 'sunday-oliseh' },
  { wiki: 'Shuaibu Amodu', slug: 'shuaibu-amodu' },
  { wiki: 'Aliou Cissé', slug: 'aliou-cisse' },
  { wiki: 'Bruno Metsu', slug: 'bruno-metsu' },
  { wiki: 'Otto Pfister', slug: 'otto-pfister' },
  { wiki: 'Lamine Diop', slug: 'lamine-diop', wikidataSearch: 'Lamine Diop Senegal football' },
  { wiki: 'Rinus Michels', slug: 'rinus-michels' },
  { wiki: 'Louis van Gaal', slug: 'louis-van-gaal' },
  { wiki: 'Dick Advocaat', slug: 'dick-advocaat' },
  { wiki: 'Frank de Boer', slug: 'frank-de-boer' },
  { wiki: 'Fernando Santos (football manager)', slug: 'fernando-santos' },
  { wiki: 'Carlos Queiroz', slug: 'carlos-queiroz' },
  { wiki: 'Paulo Bento', slug: 'paulo-bento' },
  { wiki: 'Zlatko Dalić', slug: 'zlatko-dalic' },
  { wiki: 'Miroslav Blažević', slug: 'miroslav-blazevic' },
  { wiki: 'Slaven Bilić', slug: 'slaven-bilic' },
  { wiki: 'Niko Kovač', slug: 'niko-kovac' },
  { wiki: 'Czesław Michniewicz', slug: 'czeslaw-michniewicz' },
  { wiki: 'Adam Nawałka', slug: 'adam-nawalka' },
  { wiki: 'Janusz Wójcik', slug: 'janusz-wojcik' },
  { wiki: 'Paweł Janas', slug: 'pawel-janas' },
  { wiki: 'Janne Andersson', slug: 'janne-andersson' },
  { wiki: 'Lars Lagerbäck', slug: 'lars-lagerback' },
  { wiki: 'Erik Hamrén', slug: 'erik-hamren' },
  { wiki: 'Tommy Söderberg', slug: 'tommy-soderberg' },
  { wiki: 'Hajime Moriyasu', slug: 'hajime-moriyasu' },
  { wiki: 'Takeshi Okada', slug: 'takeshi-okada' },
  { wiki: 'Philippe Troussier', slug: 'philippe-troussier' },
  { wiki: 'Ivica Osim', slug: 'ivica-osim' },
  { wiki: 'Hong Myung-bo', slug: 'hong-myung-bo' },
  { wiki: 'Uli Stielike', slug: 'uli-stielike' },
  { wiki: 'Hervé Renard', slug: 'herve-renard' },
  { wiki: 'Juan Antonio Pizzi', slug: 'juan-antonio-pizzi' },
  { wiki: 'Bert van Marwijk', slug: 'bert-van-marwijk' },
  { wiki: 'Nasser Al-Johar', slug: 'nasser-al-johar', wikidataSearch: 'Nasser Al-Johar' },
  { wiki: 'Dragan Skočić', slug: 'dragan-skocic' },
  { wiki: 'Branko Ivanković', slug: 'branko-ivankovic' },
  { wiki: 'Francisco Maturana', slug: 'francisco-maturana' },
  { wiki: 'Reinaldo Rueda', slug: 'reinaldo-rueda' },
  { wiki: 'Néstor Lorenzo', slug: 'nestor-lorenzo' },
  // Placeholders in managersCountries.ts (A–Z audit)
  { wiki: 'Vahid Halilhodžić', slug: 'vahid-halilhodzic' },
  { wiki: 'Hugo Meisl', slug: 'hugo-meisl' },
  { wiki: 'Dimitar Penev', slug: 'dimitar-penev' },
  { wiki: 'Valery Nepomnyashchy', slug: 'valeri-nepomnyashchy' },
  { wiki: 'Marcelo Bielsa', slug: 'marcelo-bielsa' },
  { wiki: 'Jorge Sampaoli', slug: 'jorge-sampaoli' },
  { wiki: 'Jorge Luis Pinto', slug: 'jorge-luis-pinto' },
  { wiki: 'Rudolf Vytlačil', slug: 'rudolf-vytlacil' },
  { wiki: 'Sepp Piontek', slug: 'sepp-piontek' },
  { wiki: 'Bobby Robson', slug: 'bobby-robson' },
  { wiki: 'Raymond Domenech', slug: 'raymond-domenech' },
  { wiki: 'Milovan Rajevac', slug: 'milovan-rajevac' },
  { wiki: 'Jürgen Klinsmann', slug: 'jurgen-klinsmann' },
  { wiki: 'Gusztáv Sebes', slug: 'gusztav-sebes' },
  { wiki: 'Azeglio Vicini', slug: 'azeglio-vicini' },
  { wiki: 'Arrigo Sacchi', slug: 'arrigo-sacchi' },
  { wiki: 'Walid Regragui', slug: 'walid-regragui' },
  { wiki: 'Ernst Happel', slug: 'ernst-happel' },
  { wiki: 'Myung Rye-hyun', slug: 'myung-rye-hyun', wikidataSearch: 'Myung Rye-hyun North Korea football' },
  { wiki: 'Egil Olsen', slug: 'egil-olsen' },
  { wiki: 'Didi (footballer, born 1928)', slug: 'didi' },
  { wiki: 'Kazimierz Górski', slug: 'kazimierz-gorski' },
  { wiki: 'Antoni Piechniczek', slug: 'antoni-piechniczek' },
  { wiki: 'Otto Glória', slug: 'otto-gloria' },
  { wiki: 'Jack Charlton', slug: 'jack-charlton' },
  { wiki: 'Mick McCarthy', slug: 'mick-mccarthy' },
  { wiki: 'Anghel Iordănescu', slug: 'anghel-iordanescu' },
  { wiki: 'Valeriy Lobanovskyi', slug: 'valeriy-lobanovskyi' },
  { wiki: 'George Raynor', slug: 'george-raynor' },
  { wiki: 'Tommy Svensson', slug: 'tommy-svensson' },
  { wiki: 'Karl Rappan', slug: 'karl-rappan' },
  { wiki: 'Köbi Kuhn', slug: 'kobi-kuhn' },
  { wiki: 'Şenol Güneş', slug: 'senol-gunes' },
  { wiki: 'Oleh Blokhin', slug: 'oleh-blokhin' },
  { wiki: 'Bruce Arena', slug: 'bruce-arena' },
  { wiki: 'Alejandro Sabella', slug: 'alejandro-sabella' },
  { wiki: 'Telê Santana', slug: 'tele-santana' },
];

function extFromUrl(u) {
  const p = new URL(u).pathname.toLowerCase();
  if (p.endsWith('.png')) return '.png';
  if (p.endsWith('.webp')) return '.webp';
  if (p.endsWith('.jpeg')) return '.jpeg';
  return '.jpg';
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.status === 429 || r.status === 503) {
      await sleep(5000 * (i + 1));
      continue;
    }
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  }
  throw new Error('429');
}

async function fetchThumb(wikiTitle) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=900`;
  const j = await fetchJson(url);
  const pages = j.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  if (page.missing || page.invalid) return null;
  return page.thumbnail?.source ?? null;
}

/** Commons scaled image from Wikidata P18 */
async function fetchWikidataCommonsUrl(searchName) {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchName)}&language=en&limit=3&format=json`;
  const j = await fetchJson(url);
  const hit = j.search?.[0];
  if (!hit?.id) return null;
  const id = hit.id;
  const u2 = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=claims&format=json`;
  const j2 = await fetchJson(u2);
  const p18 = j2.entities?.[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!p18 || typeof p18 !== 'string') return null;
  const enc = p18.replace(/ /g, '_');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(enc)}?width=900`;
}

async function download(url, dest, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.status === 429 || r.status === 503) {
      await sleep(5000 * (i + 1));
      continue;
    }
    if (!r.ok) throw new Error(String(r.status));
    const buf = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync(dest, buf);
    return;
  }
  throw new Error('429');
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const ok = [];
  const skip = [];
  const fail = [];

  for (const entry of TARGETS) {
    const { wiki, slug, wikidataSearch } = entry;
    const hasFile = ['.jpg', '.jpeg', '.png', '.webp'].some((ext) => fs.existsSync(path.join(OUT, `${slug}${ext}`)));
    if (hasFile) {
      skip.push(`${slug} (file exists)`);
      continue;
    }

    try {
      let thumb = await fetchThumb(wiki);
      if (!thumb && wikidataSearch) {
        await sleep(DELAY_MS);
        thumb = await fetchWikidataCommonsUrl(wikidataSearch);
      }
      if (!thumb) {
        await sleep(DELAY_MS);
        thumb = await fetchWikidataCommonsUrl(wiki.replace(/\s*\([^)]*\)\s*$/, '').trim());
      }
      if (!thumb) {
        fail.push({ wiki, slug, reason: 'no thumbnail' });
        await sleep(DELAY_MS);
        continue;
      }
      const ext = extFromUrl(thumb);
      const dest = path.join(OUT, `${slug}${ext}`);
      await download(thumb, dest);
      ok.push(`${slug} ← ${wiki}`);
    } catch (e) {
      fail.push({ wiki, slug, reason: String(e.message || e) });
    }
    await sleep(DELAY_MS);
  }

  console.log('Downloaded:', ok.length);
  ok.forEach((l) => console.log('  OK', l));
  console.log('Skipped:', skip.length);
  skip.slice(0, 12).forEach((l) => console.log('  --', l));
  if (skip.length > 12) console.log(`  ... +${skip.length - 12} more`);
  console.log('Failed:', fail.length);
  fail.forEach((f) => console.log('  FAIL', f.slug, f.wiki, f.reason));
}

main().catch(console.error);

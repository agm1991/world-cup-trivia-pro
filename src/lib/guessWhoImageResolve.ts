import type { Question } from '@/types/game';
import { findLegendPortraitUrl } from '@/lib/legendPlayerPortrait';
import { defaultCountries } from '@/data/selectLegendCountries';

const PLAYER_PORTRAIT_MODULES = import.meta.glob<{ default: string }>(
  '@/assets/players/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const KICKOFF_PORTRAIT_MODULES = import.meta.glob<{ default: string }>(
  '@/assets/kickoff-portraits/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

function normalizePlayerName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[''`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Remote fallbacks when local assets under `src/assets/players` are empty (0-byte). */
const WIKIMEDIA_PORTRAIT: Record<string, string> = {
  'rigobert song': 'https://commons.wikimedia.org/wiki/Special:FilePath/Rigobert_Song.jpg',
  'roger milla': 'https://commons.wikimedia.org/wiki/Special:FilePath/Milla2008.JPG',
  'eden hazard': 'https://commons.wikimedia.org/wiki/Special:FilePath/Eden_Hazard_2018.jpg',
  'thibaut courtois': 'https://commons.wikimedia.org/wiki/Special:FilePath/Thibaut_Courtois_2018.jpg',
  'kevin de bruyne': 'https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_De_Bruyne_2018.jpg',
  'riyad mahrez': 'https://commons.wikimedia.org/wiki/Special:FilePath/Riyad_Mahrez_2018.jpg',
  'islam slimani': 'https://commons.wikimedia.org/wiki/Special:FilePath/Islam_Slimani.jpg',
  'achraf hakimi': 'https://commons.wikimedia.org/wiki/Special:FilePath/Achraf_Hakimi_2024.jpg',
  'alen boksic': 'https://commons.wikimedia.org/wiki/Special:FilePath/Bokšić.jpg',
  'alvaro recoba': 'https://commons.wikimedia.org/wiki/Special:FilePath/Alvaro_Recoba.jpg',
  'obdulio varela': 'https://commons.wikimedia.org/wiki/Special:FilePath/Obdulio_varela_uruguay.jpg',
  'haris seferovic': 'https://commons.wikimedia.org/wiki/Special:FilePath/Haris_Seferović_2018.jpg',
  'valon behrami': 'https://commons.wikimedia.org/wiki/Special:FilePath/Valon_Behrami_2018.jpg',
  'stephane chapuisat': 'https://commons.wikimedia.org/wiki/Special:FilePath/Stéphane_Chapuisat.jpg',
  'sadio mane': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sadio_Mané_2018.jpg',
  // Guess Who L21–30 hard — correct-answer portraits (avoid wrong-option fallback)
  'sunday oliseh': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunday_Oliseh.jpg',
  'henri camara': 'https://commons.wikimedia.org/wiki/Special:FilePath/Henri_Camara.jpg',
  'ahn jung-hwan': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Ahn_Jung-hwan_in_November_2021.png',
  'salvatore schillaci': 'https://upload.wikimedia.org/wikipedia/commons/1/10/Salvatore_Schillaci.jpg',
  'david platt': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/DavidPlatt.jpg',
  'ilhan mansiz': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ilhan_Mansiz.jpg',
  'ilhan mansız': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ilhan_Mansiz.jpg',
  'claudio caniggia': 'https://upload.wikimedia.org/wikipedia/commons/1/17/Caniggia_sonriente_1988.jpg',
  'trifon ivanov': 'https://commons.wikimedia.org/wiki/Special:FilePath/Trifon_Ivanov.jpg',
  'preben elkjaer': 'https://commons.wikimedia.org/wiki/Special:FilePath/Preben_Elkjaer.jpg',
  'preben elkjær': 'https://commons.wikimedia.org/wiki/Special:FilePath/Preben_Elkjaer.jpg',
  'dragan stojkovic': 'https://commons.wikimedia.org/wiki/Special:FilePath/Dragan_Stojkovic.jpg',
  branco: 'https://commons.wikimedia.org/wiki/Special:FilePath/Branco_-_Brazil_1994.jpg',
  'marc overmars': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Marc_Overmars.jpg',
  'jared borgetti': 'https://upload.wikimedia.org/wikipedia/commons/1/11/JaredBorgetti.jpg',
  'aron winter': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Aron_Winter_2013.jpg',
  'seol ki-hyeon': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Seol.JPG',
  'hong myung-bo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Hong_Myung-Bo.jpg',
  'hasan sas': 'https://commons.wikimedia.org/wiki/Special:FilePath/Hasan_Sas.jpg',
  'sulley muntari': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sulley_Muntari.jpg',
  'sebastian abreu': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sebastian_Abreu.jpg',
  'maxi pereira': 'https://commons.wikimedia.org/wiki/Special:FilePath/Maxi_Pereira.jpg',
  'yasuhito endo': 'https://commons.wikimedia.org/wiki/Special:FilePath/Yasuhito_Endo.jpg',
  'grzegorz lato': 'https://commons.wikimedia.org/wiki/Special:FilePath/Grzegorz_Lato.jpg',
  'arie haan': 'https://commons.wikimedia.org/wiki/Special:FilePath/Arie_Haan.jpg',
  eder: 'https://commons.wikimedia.org/wiki/Special:FilePath/Eder_Aleixo_de_Andrade_Nascimento.jpg',
  'jorge burruchaga': 'https://commons.wikimedia.org/wiki/Special:FilePath/Jorge_Burruchaga.jpg',
  'jean-marie pfaff': 'https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Marie_Pfaff.jpg',
  'rinat dasayev': 'https://commons.wikimedia.org/wiki/Special:FilePath/Rinat_Dasayev.jpg',
  'emilio butragueño': 'https://commons.wikimedia.org/wiki/Special:FilePath/Emilio_Butragueno.jpg',
  'emilio butragueno': 'https://commons.wikimedia.org/wiki/Special:FilePath/Emilio_Butragueno.jpg',
  tostao: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tostao.jpg',
  'patrick battiston': 'https://commons.wikimedia.org/wiki/Special:FilePath/Patrick_Battiston.jpg',
  'marius tresor': 'https://commons.wikimedia.org/wiki/Special:FilePath/Marius_Tresor.jpg',
  'martin peters': 'https://upload.wikimedia.org/wikipedia/commons/3/39/Martin_Peters_%281970%29.jpg',
  'paul breitner': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Paul_Breitner_2011.jpg',
  'alain giresse': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Alain_Giresse.jpg',
  'jean tigana': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Jean_Tigana_cropped.jpg',
  'daniel amokachi': 'https://commons.wikimedia.org/wiki/Special:FilePath/Daniel_Amokachi.jpg',
};

const portraitByName = new Map<string, string>();

for (const [name, url] of Object.entries(WIKIMEDIA_PORTRAIT)) {
  registerPortrait(name, url);
}

function registerPortrait(displayName: string, url: string) {
  if (!url) return;
  const key = normalizePlayerName(displayName);
  if (!portraitByName.has(key)) portraitByName.set(key, url);
}

for (const [path, mod] of Object.entries(PLAYER_PORTRAIT_MODULES)) {
  const stem = path.split('/').pop()?.replace(/\.[^.]+$/i, '') ?? '';
  if (stem) registerPortrait(stem, mod.default);
}

for (const [, mod] of Object.entries(KICKOFF_PORTRAIT_MODULES)) {
  const file = Object.keys(KICKOFF_PORTRAIT_MODULES).find((p) => KICKOFF_PORTRAIT_MODULES[p] === mod);
  if (!file) continue;
  const m = file.match(/\/([a-z0-9-]+)-wc\d{4}\./i);
  if (m?.[1]) {
    const id = m[1].replace(/-/g, ' ');
    registerPortrait(id, mod.default);
  }
}

for (const c of defaultCountries) {
  for (const p of c.players) {
    if (p.image) registerPortrait(p.name, p.image as string);
    if (p.id) {
      const fromLegend = findLegendPortraitUrl(p.id);
      if (fromLegend) registerPortrait(p.name, fromLegend);
    }
  }
}

function findPortraitByDisplayName(name: string): string | undefined {
  const key = normalizePlayerName(name);
  if (portraitByName.has(key)) return portraitByName.get(key);

  for (const [registered, url] of portraitByName) {
    if (registered.includes(key) || key.includes(registered)) return url;
  }
  return undefined;
}

function optionText(q: Question, letter: Question['correctAnswer']): string {
  const raw = q[`option${letter}` as keyof Question];
  return typeof raw === 'string' ? raw.trim() : '';
}

/** Resolve a displayable portrait URL for Guess Who / bingo guess-who rows. */
export function resolveGuessWhoDisplayImage(q: Question): string | undefined {
  // Image clues ship a bundled portrait — use it first so wiki/name lookup cannot override.
  if (q.image && q.questionType !== 'text') {
    return q.image;
  }

  const correctName = optionText(q, q.correctAnswer);
  if (correctName) {
    const fromCorrect = findPortraitByDisplayName(correctName);
    if (fromCorrect) return fromCorrect;
  }

  if (q.image) return q.image;

  // Text clues must not borrow a wrong option's portrait when the answer has no image.
  if (q.questionType === 'text') return undefined;

  for (const letter of ['A', 'B', 'C', 'D'] as const) {
    const name = optionText(q, letter);
    if (!name) continue;
    const url = findPortraitByDisplayName(name);
    if (url) return url;
  }

  return undefined;
}

export function isGuessWhoPhotoQuestion(q: Question): boolean {
  if (q.sourceCategory === 'guess-who-photo' || q.sourceCategory === 'guess-who') return true;
  if (q.category === 'guess-who') return true;
  if (q.questionType === 'image' || q.questionType === 'half-image') return true;
  if (/^who am i\??$/i.test(q.question.trim())) return true;
  return false;
}

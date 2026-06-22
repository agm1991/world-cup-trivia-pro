#!/usr/bin/env node
/**
 * One-off builder for bingoMissingPlayerLineupVerifiedFixtures append block.
 * Run: node scripts/build-verified-bingo-fixtures.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function slotKey(name) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 24);
}

/** @type {Record<string, { id: string, slots: { name: string, x: number, y: number }[], targets: string[] }>} */
const FIXTURES = {
  'mp-easy-011': {
    id: 'bingo-verified-1994-final-ita-bra-ita',
    targets: ['roberto_baggio'],
    slots: [
      ['Pagliuca', 50, 90],
      ['Baresi', 35, 78],
      ['Maldini', 50, 80],
      ['Mussi', 65, 78],
      ['Benarrivo', 18, 68],
      ['Donadoni', 82, 68],
      ['Albertini', 38, 52],
      ['Dino Baggio', 62, 52],
      ['Berti', 50, 44],
      ['Roberto Baggio', 50, 28],
      ['Massaro', 50, 18],
    ],
  },
  'mp-easy-019': {
    id: 'bingo-verified-1998-final-bra-fra-bra-rivaldo',
    targets: ['rivaldo'],
    slots: [
      ['Taffarel', 50, 90],
      ['Cafu', 82, 72],
      ['Baiano', 65, 76],
      ['Aldair', 35, 76],
      ['Roberto Carlos', 18, 72],
      ['Dunga', 42, 54],
      ['César Sampaio', 58, 54],
      ['Leonardo', 50, 42],
      ['Rivaldo', 78, 32],
      ['Ronaldo', 50, 18],
      ['Bebeto', 22, 30],
    ],
  },
  'mp-easy-036': {
    id: 'bingo-verified-1998-final-bra-fra-bra-dunga',
    targets: ['dunga'],
    slots: [
      ['Taffarel', 50, 90],
      ['Cafu', 82, 72],
      ['Aldair', 65, 76],
      ['Baiano', 35, 76],
      ['Roberto Carlos', 18, 72],
      ['Dunga', 42, 54],
      ['César Sampaio', 58, 54],
      ['Leonardo', 50, 42],
      ['Rivaldo', 78, 32],
      ['Bebeto', 22, 30],
      ['Ronaldo', 50, 18],
    ],
  },
  'mp-easy-035': {
    id: 'bingo-verified-2010-final-ned-esp-ned',
    targets: ['van_persie'],
    slots: [
      ['Stekelenburg', 50, 90],
      ['van der Wiel', 82, 72],
      ['Heitinga', 65, 76],
      ['Mathijsen', 35, 76],
      ['van Bronckhorst', 18, 72],
      ['van Bommel', 42, 54],
      ['de Jong', 58, 54],
      ['Robben', 78, 32],
      ['Sneijder', 50, 40],
      ['Kuyt', 22, 32],
      ['Robin van Persie', 50, 18],
    ],
  },
  'mp-easy-037': {
    id: 'bingo-verified-2014-semi-bra-ger-bra',
    targets: ['fred'],
    slots: [
      ['Júlio César', 50, 90],
      ['Maicon', 82, 72],
      ['David Luiz', 65, 76],
      ['Dante', 35, 76],
      ['Marcelo', 18, 72],
      ['Gustavo', 42, 54],
      ['Fernandinho', 58, 54],
      ['Bernard', 22, 32],
      ['Oscar', 50, 40],
      ['Hulk', 78, 32],
      ['Fred', 50, 18],
    ],
  },
  'mp-easy-038': {
    id: 'bingo-verified-2014-semi-bra-ger-ger',
    targets: ['klose'],
    slots: [
      ['Neuer', 50, 90],
      ['Höwedes', 18, 72],
      ['Boateng', 35, 76],
      ['Hummels', 65, 76],
      ['Lahm', 82, 72],
      ['Kroos', 42, 54],
      ['Khedira', 58, 54],
      ['Müller', 78, 32],
      ['Özil', 50, 40],
      ['Schürrle', 22, 32],
      ['Miroslav Klose', 50, 18],
    ],
  },
  'mp-easy-043': {
    id: 'bingo-verified-2014-final-ger-arg-ger-lahm',
    targets: ['lahm'],
    slots: [
      ['Neuer', 50, 90],
      ['Höwedes', 18, 72],
      ['Hummels', 35, 76],
      ['Boateng', 65, 76],
      ['Philipp Lahm', 82, 72],
      ['Schweinsteiger', 42, 54],
      ['Kroos', 58, 54],
      ['Müller', 78, 32],
      ['Özil', 50, 40],
      ['Klose', 22, 32],
      ['Kramer', 50, 18],
    ],
  },
  'mp-easy-045': {
    id: 'bingo-verified-2014-final-ger-arg-arg-messi',
    targets: ['messi'],
    slots: [
      ['Romero', 50, 90],
      ['Zabaleta', 82, 72],
      ['Garay', 65, 76],
      ['Demichelis', 35, 76],
      ['Rojo', 18, 72],
      ['Mascherano', 42, 54],
      ['Biglia', 58, 54],
      ['Pérez', 50, 44],
      ['Messi', 50, 36],
      ['Higuaín', 30, 22],
      ['Lionel Messi', 70, 32],
    ],
  },
  'mp-easy-060': {
    id: 'bingo-verified-2014-final-ger-arg-ger-sweini',
    targets: ['schweinsteiger'],
    slots: [
      ['Neuer', 50, 90],
      ['Höwedes', 18, 72],
      ['Hummels', 35, 76],
      ['Boateng', 65, 76],
      ['Lahm', 82, 72],
      ['Bastian Schweinsteiger', 42, 54],
      ['Kroos', 58, 54],
      ['Müller', 78, 32],
      ['Özil', 50, 40],
      ['Kramer', 22, 32],
      ['Klose', 50, 18],
    ],
  },
  'mp-easy-046': {
    id: 'bingo-verified-2018-semi-cro-eng-cro',
    targets: ['modric'],
    slots: [
      ['Subašić', 50, 90],
      ['Vrsaljko', 82, 72],
      ['Lovren', 65, 76],
      ['Vida', 35, 76],
      ['Strinić', 18, 72],
      ['Rakitić', 42, 54],
      ['Brozović', 58, 54],
      ['Rebić', 78, 32],
      ['Mandžukić', 50, 18],
      ['Perišić', 22, 32],
      ['Luka Modrić', 50, 40],
    ],
  },
  'mp-easy-049': {
    id: 'bingo-verified-2018-final-fra-cro-fra',
    targets: ['giroud'],
    slots: [
      ['Lloris', 50, 90],
      ['Pavard', 82, 72],
      ['Varane', 65, 76],
      ['Umtiti', 35, 76],
      ['Lucas Hernández', 18, 72],
      ['Kanté', 42, 54],
      ['Pogba', 58, 54],
      ['Matuidi', 22, 32],
      ['Griezmann', 50, 40],
      ['Mbappé', 78, 32],
      ['Olivier Giroud', 50, 18],
    ],
  },
  'mp-easy-050': {
    id: 'bingo-verified-2018-final-fra-cro-cro',
    targets: ['mandzukic'],
    slots: [
      ['Subašić', 50, 90],
      ['Vrsaljko', 82, 72],
      ['Lovren', 65, 76],
      ['Vida', 35, 76],
      ['Strinić', 18, 72],
      ['Brozović', 50, 55],
      ['Rakitić', 42, 52],
      ['Modrić', 58, 52],
      ['Perišić', 22, 32],
      ['Rebić', 78, 32],
      ['Mario Mandžukić', 50, 18],
    ],
  },
  'mp-easy-062': {
    id: 'bingo-verified-2006-r16-por-ned-ned',
    targets: ['van_persie', 'robben'],
    slots: [
      ['van der Sar', 50, 90],
      ['Boulahrouz', 82, 72],
      ['Ooijer', 65, 76],
      ['Mathijsen', 35, 76],
      ['van Bronckhorst', 18, 72],
      ['van Bommel', 42, 54],
      ['Sneijder', 58, 54],
      ['Cocu', 50, 44],
      ['Robin van Persie', 78, 32],
      ['Dirk Kuyt', 22, 32],
      ['Arjen Robben', 50, 18],
    ],
  },
  'mp-easy-063': {
    id: 'bingo-verified-2014-r16-bra-chi-bra',
    targets: ['neymar', 'fred'],
    slots: [
      ['Júlio César', 50, 90],
      ['Dani Alves', 82, 72],
      ['Thiago Silva', 65, 76],
      ['David Luiz', 35, 76],
      ['Marcelo', 18, 72],
      ['Fernandinho', 42, 54],
      ['Luiz Gustavo', 58, 54],
      ['Hulk', 78, 32],
      ['Oscar', 50, 40],
      ['Neymar', 22, 32],
      ['Fred', 50, 18],
    ],
  },
  'mp-easy-064': {
    id: 'bingo-verified-2014-r16-bra-chi-chi',
    targets: ['alexis_sanchez', 'eduardo_vargas'],
    slots: [
      ['Bravo', 50, 90],
      ['F. Silva', 65, 78],
      ['Medel', 50, 80],
      ['Jara', 35, 78],
      ['Mena', 18, 68],
      ['Isla', 82, 68],
      ['Aránguiz', 42, 52],
      ['Díaz', 58, 52],
      ['Vidal', 50, 40],
      ['Alexis Sánchez', 30, 24],
      ['Eduardo Vargas', 70, 24],
    ],
  },
  'mp-easy-066': {
    id: 'bingo-verified-2014-r16-bel-usa-bel',
    targets: ['hazard', 'origi'],
    slots: [
      ['Courtois', 50, 90],
      ['Alderweireld', 65, 78],
      ['Van Buyten', 50, 80],
      ['Kompany', 35, 78],
      ['Vertonghen', 18, 68],
      ['Witsel', 42, 54],
      ['Fellaini', 58, 54],
      ['Mertens', 78, 32],
      ['De Bruyne', 50, 40],
      ['Eden Hazard', 22, 32],
      ['Divock Origi', 50, 18],
    ],
  },
  'mp-easy-069': {
    id: 'bingo-verified-2014-r16-ned-mex-mex',
    targets: ['dos_santos', 'peralta'],
    slots: [
      ['Ochoa', 50, 90],
      ['Aguilar', 82, 68],
      ['F. Javier Rodríguez', 65, 78],
      ['Márquez', 50, 80],
      ['Moreno', 35, 78],
      ['Layún', 18, 68],
      ['Herrera', 42, 52],
      ['Salcido', 58, 52],
      ['Guardado', 50, 40],
      ['Giovani dos Santos', 30, 24],
      ['Oribe Peralta', 70, 24],
    ],
  },
  'mp-easy-071': {
    id: 'bingo-verified-2014-r16-fra-nga-nga',
    targets: ['odemwingie', 'emenike'],
    slots: [
      ['Enyeama', 50, 90],
      ['Ambrose', 82, 72],
      ['Yobo', 65, 76],
      ['Oshaniwa', 35, 76],
      ['Omeruo', 18, 72],
      ['Musa', 78, 38],
      ['Onazi', 42, 52],
      ['Mikel', 58, 52],
      ['Moses', 50, 40],
      ['Peter Odemwingie', 30, 22],
      ['Emmanuel Emenike', 70, 22],
    ],
  },
  'mp-easy-075': {
    id: 'bingo-verified-2014-r16-arg-sui-arg',
    targets: ['higuain', 'lavezzi'],
    slots: [
      ['Romero', 50, 90],
      ['Zabaleta', 82, 72],
      ['Fernández', 65, 76],
      ['Garay', 35, 76],
      ['Rojo', 18, 72],
      ['Gago', 42, 54],
      ['Mascherano', 58, 54],
      ['Di María', 78, 32],
      ['Lionel Messi', 50, 28],
      ['Gonzalo Higuaín', 30, 22],
      ['Ezequiel Lavezzi', 70, 32],
    ],
  },
  'mp-easy-076': {
    id: 'bingo-verified-2014-r16-arg-sui-sui',
    targets: ['mehmedi', 'drmic'],
    slots: [
      ['Benaglio', 50, 90],
      ['Lichtsteiner', 82, 72],
      ['Djourou', 65, 76],
      ['Schär', 35, 76],
      ['Ricardo Rodríguez', 18, 72],
      ['Behrami', 42, 54],
      ['Inler', 58, 54],
      ['Shaqiri', 78, 32],
      ['Xhaka', 50, 40],
      ['Admir Mehmedi', 22, 32],
      ['Josip Drmić', 50, 18],
    ],
  },
  'mp-easy-077': {
    id: 'bingo-verified-2014-r16-crc-gre-crc',
    targets: ['gamboa', 'junior_diaz'],
    slots: [
      ['Navas', 50, 90],
      ['Duarte', 35, 78],
      ['González', 50, 80],
      ['Umaña', 65, 78],
      ['Cristian Gamboa', 82, 68],
      ['Júnior Díaz', 18, 68],
      ['Borges', 42, 52],
      ['Tejeda', 58, 52],
      ['Ruiz', 50, 40],
      ['Bolaños', 78, 32],
      ['Campbell', 22, 32],
    ],
  },
  'mp-easy-078': {
    id: 'bingo-verified-2014-r16-crc-gre-gre',
    targets: ['salpingidis', 'christodoulopoulos'],
    slots: [
      ['Karnezis', 50, 90],
      ['Torosidis', 82, 72],
      ['Manolas', 65, 76],
      ['Papastathopoulos', 35, 76],
      ['Holebas', 18, 72],
      ['Karagounis', 42, 54],
      ['Maniatis', 58, 54],
      ['Samaris', 50, 44],
      ['Dimitris Salpingidis', 78, 32],
      ['Lazaros Christodoulopoulos', 50, 36],
      ['Samaras', 22, 32],
    ],
  },
  'mp-easy-080': {
    id: 'bingo-verified-2014-qf-bra-col-col',
    targets: ['james_rodriguez', 'teofilo_gutierrez'],
    slots: [
      ['Ospina', 50, 90],
      ['Zúñiga', 82, 72],
      ['Zapata', 65, 76],
      ['Yepes', 35, 76],
      ['Armero', 18, 72],
      ['Cuadrado', 78, 38],
      ['Guarín', 42, 52],
      ['Carlos Sánchez', 58, 52],
      ['Ibarbo', 22, 32],
      ['James Rodríguez', 50, 36],
      ['Teófilo Gutiérrez', 50, 18],
    ],
  },
  'mp-easy-081': {
    id: 'bingo-verified-2014-qf-arg-bel-arg',
    targets: ['lavezzi', 'di_maria'],
    slots: [
      ['Romero', 50, 90],
      ['Zabaleta', 82, 72],
      ['Demichelis', 65, 76],
      ['Garay', 35, 76],
      ['Basanta', 18, 72],
      ['Biglia', 42, 54],
      ['Mascherano', 58, 54],
      ['Ezequiel Lavezzi', 78, 32],
      ['Ángel Di María', 22, 32],
      ['Lionel Messi', 50, 36],
      ['Gonzalo Higuaín', 50, 18],
    ],
  },
  'mp-easy-082': {
    id: 'bingo-verified-2014-qf-arg-bel-bel',
    targets: ['mirallas', 'de_bruyne'],
    slots: [
      ['Courtois', 50, 90],
      ['Alderweireld', 65, 78],
      ['Van Buyten', 50, 80],
      ['Kompany', 35, 78],
      ['Vertonghen', 18, 68],
      ['Witsel', 42, 54],
      ['Fellaini', 58, 54],
      ['Kevin Mirallas', 78, 32],
      ['Kevin De Bruyne', 50, 40],
      ['Eden Hazard', 22, 32],
      ['Divock Origi', 50, 18],
    ],
  },
  'mp-easy-083': {
    id: 'bingo-verified-2014-qf-ned-crc-ned',
    targets: ['kuyt', 'blind'],
    slots: [
      ['Cillessen', 50, 90],
      ['de Vrij', 65, 78],
      ['Vlaar', 50, 80],
      ['Martins Indi', 35, 78],
      ['Dirk Kuyt', 82, 68],
      ['Daley Blind', 18, 68],
      ['Wijnaldum', 42, 52],
      ['Sneijder', 58, 52],
      ['Robben', 78, 32],
      ['Depay', 22, 32],
      ['Robin van Persie', 50, 18],
    ],
  },
  'mp-easy-084': {
    id: 'bingo-verified-2014-qf-ned-crc-crc',
    targets: ['borges', 'tejeda'],
    slots: [
      ['Navas', 50, 90],
      ['Acosta', 82, 72],
      ['González', 65, 76],
      ['Umaña', 35, 76],
      ['Gamboa', 82, 68],
      ['Júnior Díaz', 18, 68],
      ['Celso Borges', 42, 52],
      ['Yeltsin Tejeda', 58, 52],
      ['Ruiz', 50, 40],
      ['Bolaños', 78, 32],
      ['Campbell', 22, 32],
    ],
  },
  'mp-easy-085': {
    id: 'bingo-verified-2022-r16-mar-esp-esp',
    targets: ['ferran_torres', 'marco_asensio'],
    slots: [
      ['Simón', 50, 90],
      ['Llorente', 82, 72],
      ['Rodri', 65, 76],
      ['Laporte', 35, 76],
      ['Alba', 18, 72],
      ['Busquets', 50, 55],
      ['Gavi', 42, 52],
      ['Pedri', 58, 52],
      ['Ferran Torres', 78, 32],
      ['Marco Asensio', 50, 22],
      ['Olmo', 22, 32],
    ],
  },
  'mp-easy-086': {
    id: 'bingo-verified-2022-r16-mar-esp-mar',
    targets: ['en_nesyri', 'boufal'],
    slots: [
      ['Bounou', 50, 90],
      ['Hakimi', 82, 68],
      ['Aguerd', 65, 78],
      ['Saïss', 35, 78],
      ['Mazraoui', 18, 68],
      ['Amrabat', 50, 55],
      ['Ounahi', 42, 52],
      ['Amallah', 58, 52],
      ['Ziyech', 78, 32],
      ['Youssef En-Nesyri', 50, 18],
      ['Sofiane Boufal', 22, 32],
    ],
  },
  'mp-easy-087': {
    id: 'bingo-verified-2022-r16-jpn-cro-jpn',
    targets: ['ritsu_doan', 'daizen_maeda'],
    slots: [
      ['Gonda', 50, 90],
      ['Tomiyasu', 82, 72],
      ['Yoshida', 65, 76],
      ['Taniguchi', 35, 76],
      ['Itō', 78, 48],
      ['Endo', 42, 52],
      ['Morita', 58, 52],
      ['Nagatomo', 18, 68],
      ['Ritsu Dōan', 78, 32],
      ['Daizen Maeda', 50, 18],
      ['Kamada', 22, 32],
    ],
  },
  'mp-easy-088': {
    id: 'bingo-verified-2022-r16-jpn-cro-cro',
    targets: ['kramaric', 'perisic'],
    slots: [
      ['Livaković', 50, 90],
      ['Juranović', 82, 72],
      ['Lovren', 65, 76],
      ['Gvardiol', 35, 76],
      ['Barišić', 18, 72],
      ['Brozović', 50, 55],
      ['Modrić', 42, 52],
      ['Kovačić', 58, 52],
      ['Andrej Kramarić', 78, 32],
      ['Petković', 50, 36],
      ['Ivan Perišić', 22, 32],
    ],
  },
  'mp-easy-090': {
    id: 'bingo-verified-2022-r16-por-sui-sui',
    targets: ['sow', 'freuler'],
    slots: [
      ['Sommer', 50, 90],
      ['Akanji', 65, 78],
      ['Schär', 50, 80],
      ['Ricardo Rodríguez', 35, 78],
      ['Xhaka', 50, 55],
      ['Edimilson Fernandes', 42, 52],
      ['Djibril Sow', 58, 52],
      ['Remo Freuler', 50, 44],
      ['Vargas', 78, 32],
      ['Embolo', 50, 18],
      ['Shaqiri', 22, 32],
    ],
  },
  'mp-easy-092': {
    id: 'bingo-verified-2022-r16-bra-kor-kor',
    targets: ['lee_jae_sung', 'jung_woo_young'],
    slots: [
      ['Kim Seung-gyu', 50, 90],
      ['Kim Moon-hwan', 82, 72],
      ['Kim Min-jae', 65, 76],
      ['Kim Young-gwon', 35, 76],
      ['Kim Jin-su', 18, 72],
      ['Lee Jae-sung', 42, 52],
      ['Jung Woo-young', 58, 52],
      ['Hwang In-beom', 50, 44],
      ['Hwang Hee-chan', 78, 32],
      ['Cho Gue-sung', 50, 18],
      ['Son Heung-min', 22, 32],
    ],
  },
  'mp-easy-093': {
    id: 'bingo-verified-2022-r16-eng-sen-eng',
    targets: ['henderson', 'bellingham'],
    slots: [
      ['Pickford', 50, 90],
      ['Walker', 82, 68],
      ['Stones', 65, 76],
      ['Maguire', 35, 76],
      ['Shaw', 18, 68],
      ['Rice', 50, 55],
      ['Jordan Henderson', 42, 52],
      ['Jude Bellingham', 58, 52],
      ['Saka', 78, 32],
      ['Harry Kane', 50, 18],
      ['Foden', 22, 32],
    ],
  },
  'mp-easy-094': {
    id: 'bingo-verified-2022-r16-eng-sen-sen',
    targets: ['pathe_ciss', 'nampalys_mendy'],
    slots: [
      ['Mendy', 50, 90],
      ['Sabaly', 82, 72],
      ['Koulibaly', 65, 76],
      ['Diallo', 35, 76],
      ['Jakobs', 18, 72],
      ['Pathé Ciss', 42, 54],
      ['Nampalys Mendy', 58, 54],
      ['Diatta', 78, 38],
      ['Ndiaye', 50, 40],
      ['Sarr', 22, 32],
      ['Dia', 50, 18],
    ],
  },
  'mp-easy-096': {
    id: 'bingo-verified-2022-r16-fra-pol-pol',
    targets: ['zielinski', 'szymanski'],
    slots: [
      ['Szczęsny', 50, 90],
      ['Cash', 82, 72],
      ['Glik', 65, 76],
      ['Kiwior', 35, 76],
      ['Bereszyński', 18, 72],
      ['Krychowiak', 50, 55],
      ['Piotr Zieliński', 42, 52],
      ['Sebastian Szymański', 58, 52],
      ['Kamiński', 78, 32],
      ['Frankowski', 22, 32],
      ['Lewandowski', 50, 18],
    ],
  },
  'mp-easy-099': {
    id: 'bingo-verified-2022-grp-aus-den-aus',
    targets: ['mooy', 'irvine'],
    slots: [
      ['Ryan', 50, 90],
      ['Degenek', 82, 72],
      ['Souttar', 65, 76],
      ['Rowles', 35, 76],
      ['Behich', 18, 72],
      ['Leckie', 78, 38],
      ['Aaron Mooy', 42, 52],
      ['Jackson Irvine', 58, 52],
      ['Goodwin', 22, 32],
      ['McGree', 50, 40],
      ['Duke', 50, 18],
    ],
  },
  'mp-easy-100': {
    id: 'bingo-verified-2022-grp-aus-den-den',
    targets: ['jensen', 'eriksen'],
    slots: [
      ['Schmeichel', 50, 90],
      ['Kristensen', 82, 72],
      ['Andersen', 65, 76],
      ['Christensen', 35, 76],
      ['Mæhle', 18, 72],
      ['Højbjerg', 50, 55],
      ['Mathias Jensen', 42, 52],
      ['Christian Eriksen', 58, 52],
      ['Skov Olsen', 78, 32],
      ['Braithwaite', 22, 32],
      ['Lindstrøm', 50, 18],
    ],
  },
  'mp-m-05': {
    id: 'bingo-verified-2006-qf-ger-arg-ger',
    targets: ['klose', 'podolski'],
    slots: [
      ['Lehmann', 50, 90],
      ['Friedrich', 82, 72],
      ['Metzelder', 65, 76],
      ['Mertesacker', 35, 76],
      ['Lahm', 18, 72],
      ['Schweinsteiger', 42, 54],
      ['Ballack', 58, 54],
      ['Borowski', 50, 44],
      ['Bernd Schneider', 78, 32],
      ['Miroslav Klose', 30, 22],
      ['Lukas Podolski', 70, 22],
    ],
  },
  'mp-m-22': {
    id: 'bingo-verified-2022-qf-ned-arg-arg',
    targets: ['de_paul', 'mac_allister'],
    slots: [
      ['E. Martínez', 50, 90],
      ['Molina', 82, 68],
      ['Romero', 65, 78],
      ['Otamendi', 50, 80],
      ['Lisandro Martínez', 35, 78],
      ['Acuña', 18, 68],
      ['Rodrigo De Paul', 42, 52],
      ['Enzo Fernández', 50, 52],
      ['Alexis Mac Allister', 58, 52],
      ['Lionel Messi', 42, 20],
      ['Julián Álvarez', 58, 20],
    ],
  },
  'mp-m-23': {
    id: 'bingo-verified-2022-qf-ned-arg-ned',
    targets: ['de_roon', 'de_jong'],
    slots: [
      ['Noppert', 50, 90],
      ['Timber', 82, 72],
      ['van Dijk', 65, 76],
      ['Aké', 35, 76],
      ['Dumfries', 78, 38],
      ['Marten de Roon', 42, 52],
      ['Frenkie de Jong', 58, 52],
      ['Daley Blind', 22, 38],
      ['Cody Gakpo', 50, 36],
      ['Steven Bergwijn', 30, 24],
      ['Memphis Depay', 70, 24],
    ],
  },
  'mp-m-27': {
    id: 'bingo-verified-2010-qf-uru-gha-gha',
    targets: ['annan', 'derek_boateng'],
    slots: [
      ['Kingson', 50, 90],
      ['Pantsil', 82, 72],
      ['Vorsah', 65, 76],
      ['Mensah', 35, 76],
      ['Sarpei', 18, 72],
      ['Anthony Annan', 42, 54],
      ['Derek Boateng', 58, 54],
      ['Muntari', 50, 44],
      ['Asamoah Gyan', 50, 18],
      ['Kevin-Prince Boateng', 78, 32],
      ['André Ayew', 22, 32],
    ],
  },
  'mp-m-28': {
    id: 'bingo-verified-2006-semi-fra-por-fra',
    targets: ['vieira', 'makelele'],
    slots: [
      ['Barthez', 50, 90],
      ['Sagnol', 82, 72],
      ['Thuram', 65, 76],
      ['Gallas', 35, 76],
      ['Abidal', 18, 72],
      ['Patrick Vieira', 42, 54],
      ['Claude Makélélé', 58, 54],
      ['Franck Ribéry', 78, 32],
      ['Zinedine Zidane', 50, 36],
      ['Florent Malouda', 22, 32],
      ['Thierry Henry', 50, 18],
    ],
  },
  'mp-m-29': {
    id: 'bingo-verified-2006-semi-fra-por-por',
    targets: ['costinha', 'maniche'],
    slots: [
      ['Ricardo', 50, 90],
      ['Miguel', 82, 72],
      ['Fernando Meira', 65, 76],
      ['Ricardo Carvalho', 35, 76],
      ['Nuno Valente', 18, 72],
      ['Costinha', 42, 54],
      ['Maniche', 58, 54],
      ['Luís Figo', 78, 32],
      ['Deco', 50, 40],
      ['Cristiano Ronaldo', 22, 32],
      ['Pauleta', 50, 18],
    ],
  },
  'mp-m-36': {
    id: 'bingo-verified-2010-qf-esp-par-esp',
    targets: ['navas', 'pedro'],
    slots: [
      ['Casillas', 50, 90],
      ['Sergio Ramos', 82, 72],
      ['Piqué', 65, 76],
      ['Puyol', 35, 76],
      ['Capdevila', 18, 72],
      ['Busquets', 50, 55],
      ['Xabi Alonso', 42, 52],
      ['Jesús Navas', 78, 32],
      ['Pedro', 22, 32],
      ['Andrés Iniesta', 50, 40],
      ['David Villa', 50, 18],
    ],
  },
  'mp-m-37': {
    id: 'bingo-verified-2010-qf-esp-par-par',
    targets: ['caceres', 'ortigoza'],
    slots: [
      ['Villar', 50, 90],
      ['Bonet', 82, 72],
      ['Da Silva', 65, 76],
      ['Alcaraz', 35, 76],
      ['Morel', 18, 72],
      ['Víctor Cáceres', 42, 54],
      ['Néstor Ortigoza', 58, 54],
      ['Riveros', 78, 38],
      ['Vera', 50, 40],
      ['Ortigoza', 22, 32],
      ['Valdez', 50, 18],
    ],
  },
  'mp-m-39': {
    id: 'bingo-verified-2002-qf-kor-esp-esp',
    targets: ['baraja', 'xabi_alonso'],
    slots: [
      ['Casillas', 50, 90],
      ['Puyol', 82, 72],
      ['Hierro', 65, 76],
      ['Juanfran', 35, 76],
      ['Romero', 18, 72],
      ['Rubén Baraja', 42, 54],
      ['Xabi Alonso', 58, 54],
      ['Joaquín', 78, 32],
      ['Valerón', 50, 40],
      ['De Pedro', 22, 32],
      ['Raúl', 50, 18],
    ],
  },
  'mp-m-40': {
    id: 'bingo-verified-2002-qf-kor-esp-kor',
    targets: ['kim_nam_il', 'park_ji_sung'],
    slots: [
      ['Lee Woon-jae', 50, 90],
      ['Song Chong-gug', 82, 72],
      ['Hong Myung-bo', 65, 76],
      ['Kim Tae-young', 35, 76],
      ['Lee Young-pyo', 18, 72],
      ['Kim Nam-il', 42, 54],
      ['Park Ji-sung', 58, 54],
      ['Park Ji-sung', 50, 44],
      ['Yoo Sang-chul', 78, 32],
      ['Lee Chun-soo', 22, 32],
      ['Ahn Jung-hwan', 50, 18],
    ],
  },
  'mp-m-42': {
    id: 'bingo-verified-2018-semi-fra-bel-bel',
    targets: ['witsel', 'fellaini'],
    slots: [
      ['Courtois', 50, 90],
      ['Alderweireld', 65, 78],
      ['Kompany', 50, 80],
      ['Vertonghen', 35, 78],
      ['Meunier', 82, 68],
      ['Axel Witsel', 42, 52],
      ['Marouane Fellaini', 58, 52],
      ['Nacer Chadli', 18, 68],
      ['Kevin De Bruyne', 50, 40],
      ['Romelu Lukaku', 50, 18],
      ['Eden Hazard', 78, 32],
    ],
  },
  'mp-m-44': {
    id: 'bingo-verified-2022-qf-mar-por-por',
    targets: ['carvalho', 'otavio'],
    slots: [
      ['Diogo Costa', 50, 90],
      ['Dalot', 82, 72],
      ['Pepe', 65, 76],
      ['Rúben Dias', 35, 76],
      ['Raphael Guerreiro', 18, 72],
      ['William Carvalho', 42, 54],
      ['Otávio', 58, 54],
      ['Bruno Fernandes', 50, 40],
      ['Bernardo Silva', 78, 32],
      ['João Félix', 22, 32],
      ['Gonçalo Ramos', 50, 18],
    ],
  },
  'mp-m-47': {
    id: 'bingo-verified-2002-r16-esp-irl-esp',
    targets: ['joaquin', 'mendieta'],
    slots: [
      ['Casillas', 50, 90],
      ['Puyol', 82, 72],
      ['Hierro', 65, 76],
      ['Helguera', 35, 76],
      ['Romero', 18, 72],
      ['Baraja', 50, 55],
      ['Xavi', 42, 52],
      ['Joaquín', 78, 32],
      ['Gaizka Mendieta', 50, 40],
      ['De Pedro', 22, 32],
      ['Raúl', 50, 18],
    ],
  },
  'mp-m-48': {
    id: 'bingo-verified-2002-r16-esp-irl-irl',
    targets: ['kinsella', 'holland'],
    slots: [
      ['Given', 50, 90],
      ['Finnan', 82, 72],
      ['Breen', 65, 76],
      ['Cunningham', 35, 76],
      ['Harte', 18, 72],
      ['Mark Kinsella', 42, 54],
      ['Matt Holland', 58, 54],
      ['Kinsella', 50, 44],
      ['Holland', 50, 40],
      ['Kilbane', 78, 32],
      ['Robbie Keane', 50, 18],
    ],
  },
  'mp-m-50': {
    id: 'bingo-verified-2010-r16-usa-gha-gha',
    targets: ['asamoah', 'derek_boateng'],
    slots: [
      ['Kingson', 50, 90],
      ['Pantsil', 82, 72],
      ['Vorsah', 65, 76],
      ['Mensah', 35, 76],
      ['Sarpei', 18, 72],
      ['Kwadwo Asamoah', 42, 54],
      ['Derek Boateng', 58, 54],
      ['Anthony Annan', 50, 44],
      ['Asamoah Gyan', 50, 18],
      ['Prince Tagoe', 78, 32],
      ['André Ayew', 22, 32],
    ],
  },
};

function parseMpQuestions() {
  const text = fs.readFileSync(path.join(root, 'src/data/missingPlayerQuestions.ts'), 'utf8');
  const blocks = text.split(/\n  \{\n    id: '/).slice(1);
  const out = new Map();
  for (const block of blocks) {
    const id = block.match(/^([^']+)'/)?.[1];
    if (!id?.startsWith('mp-')) continue;
    const qMatch = block.match(/question:\s*\n\s*'([\s\S]*?)',/);
    const ca = block.match(/correctAnswer: '([ABCD])'/)?.[1];
    const parseQuoted = (field) => {
      const re = new RegExp(`${field}:\\s*'((?:\\\\'|[^'])*)'`);
      return block.match(re)?.[1]?.replace(/\\'/g, "'") ?? '';
    };
    if (!qMatch || !ca) continue;
    out.set(id, {
      question: qMatch[1].replace(/\s+/g, ' ').trim(),
      correctAnswer: ca,
      optionA: parseQuoted('optionA'),
      optionB: parseQuoted('optionB'),
      optionC: parseQuoted('optionC'),
      optionD: parseQuoted('optionD'),
      hint1: parseQuoted('hint1'),
      hint2: parseQuoted('hint2'),
      hint3: parseQuoted('hint3'),
    });
  }
  return out;
}

function parseXi(q) {
  const triple = q.split(/\s*—\s*/);
  if (triple.length < 3) return null;
  const rest = triple.slice(2).join(' — ');
  const xi =
    /^(.+?)\s+XI(?:\s*\([^)]+\))?\s*:\s*(.+)$/is.exec(rest) ??
    /^(.+?)\s+XI\s*:\s*(.+)$/is.exec(rest);
  if (!xi) return null;
  const stageMatch = triple[0].match(
    /Quarter-Final|Semi-Final|Final|Round of 16|Group Stage|Group [A-Z]/i,
  );
  const parts = triple[1].split(/\s+vs\s+/i).map((s) => s.trim());
  return {
    year: +(q.match(/(\d{4})/)?.[1] ?? 0),
    stage: stageMatch?.[0] ?? 'Match',
    team1: parts[0] ?? '',
    team2: parts[1] ?? '',
    focusTeam: xi[1].trim(),
  };
}

function renderDef(mpId, meta, fix) {
  const xi = parseXi(meta.question);
  if (!xi) throw new Error(`Cannot parse XI for ${mpId}`);

  const targets =
    fix.targets.length === 1 ? [fix.targets[0], fix.targets[0]] : fix.targets;

  const lines = [];
  lines.push('  {');
  lines.push(`    id: '${fix.id}',`);
  lines.push(`    year: ${xi.year},`);
  lines.push(`    stage: '${esc(xi.stage)}',`);
  lines.push(`    team1: '${esc(xi.team1)}',`);
  lines.push(`    team2: '${esc(xi.team2)}',`);
  lines.push(`    focusTeam: '${esc(xi.focusTeam)}',`);
  lines.push(`    targetPlayers: [${targets.map((k) => `'${k}'`).join(', ')}],`);
  lines.push('    slots: [');
  for (const [name, x, y] of fix.slots) {
    const key = slotKey(name);
    lines.push(`      { key: '${key}', displayName: '${esc(name)}', x: ${x}, y: ${y} },`);
  }
  lines.push('    ],');
  lines.push(`    optionA: '${esc(meta.optionA)}',`);
  lines.push(`    optionB: '${esc(meta.optionB)}',`);
  lines.push(`    optionC: '${esc(meta.optionC)}',`);
  lines.push(`    optionD: '${esc(meta.optionD)}',`);
  lines.push(`    correctAnswer: '${meta.correctAnswer}',`);
  lines.push(`    hint1: '${esc(meta.hint1)}',`);
  lines.push(`    hint2: '${esc(meta.hint2)}',`);
  lines.push(`    hint3: '${esc(meta.hint3)}',`);
  lines.push('  },');
  return lines.join('\n');
}

const questions = parseMpQuestions();
const mpIds = Object.keys(FIXTURES);
const blocks = ['  // ——— Remaining bingo-auto fixtures (verified) ———'];

for (const mpId of mpIds) {
  const meta = questions.get(mpId);
  if (!meta) throw new Error(`Missing question ${mpId}`);
  blocks.push(renderDef(mpId, meta, FIXTURES[mpId]));
}

const append = '\n' + blocks.join('\n') + '\n';
process.stdout.write(append);

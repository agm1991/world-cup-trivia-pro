export interface SquadPosition {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  countryFlag: string;
  correctPlayer: string;
}

export interface SquadPuzzle {
  id: string;
  title: string;
  subtitle: string;
  /** FIFA World Cup year (match sheet). */
  year: number;
  /** Knockout / group label, e.g. Final, Semi-Final. */
  stage: string;
  /** Opponent nation (no flag — UI may add). */
  opponent: string;
  formation: string;
  positions: SquadPosition[];
  playerOptions: string[];
}

/**
 * Levels 1–10: World Cup finals (or iconic WC matches) with household-name starters.
 * Order = difficulty / teaching progression (winners & icons first).
 */
export const SQUAD_PUZZLE_IDS_BY_LEVEL: readonly string[] = [
  'messi', // 1 — Argentina 2022 Final (winner)
  'pele', // 2 — Brazil 1970 Final (winner)
  'ronaldo-r9', // 3 — Brazil 2002 Final (winner)
  'zidane', // 4 — France 1998 Final (winner)
  'maradona', // 5 — Argentina 1986 Final (winner)
  'totti', // 6 — Italy 2006 Final (winner)
  'beckham', // 7 — England 2002 QF vs Brazil (iconic)
  'spain-2010', // 8 — Spain 2010 Final (winner)
  'germany-2014', // 9 — Germany 2014 Final (winner)
  'cristiano', // 10 — Portugal 2018 vs Spain (legend; best WC run)
];

export const squadPuzzles: Record<string, SquadPuzzle> = {
  messi: {
    id: 'argentina-2022',
    title: '2022 WORLD CUP FINAL',
    subtitle: 'Argentina — Starting XI',
    year: 2022,
    stage: 'Final',
    opponent: 'France',
    formation: '4-3-3',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇦🇷', correctPlayer: 'E. Martínez' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇦🇷', correctPlayer: 'N. Tagliafico' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇦🇷', correctPlayer: 'N. Otamendi' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇦🇷', correctPlayer: 'C. Romero' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇦🇷', correctPlayer: 'N. Molina' },
      { id: 'cm1', x: 30, y: 45, countryFlag: '🇦🇷', correctPlayer: 'R. De Paul' },
      { id: 'cm2', x: 50, y: 50, countryFlag: '🇦🇷', correctPlayer: 'E. Fernández' },
      { id: 'cm3', x: 70, y: 45, countryFlag: '🇦🇷', correctPlayer: 'A. Mac Allister' },
      { id: 'lw', x: 20, y: 25, countryFlag: '🇦🇷', correctPlayer: 'Á. Di María' },
      { id: 'st', x: 50, y: 20, countryFlag: '🇦🇷', correctPlayer: 'J. Álvarez' },
      { id: 'rw', x: 80, y: 25, countryFlag: '🇦🇷', correctPlayer: 'L. Messi' },
    ],
    playerOptions: [
      'L. Messi',
      'Á. Di María',
      'J. Álvarez',
      'E. Martínez',
      'N. Otamendi',
      'C. Romero',
      'N. Molina',
      'N. Tagliafico',
      'R. De Paul',
      'E. Fernández',
      'A. Mac Allister',
    ],
  },
  pele: {
    id: 'brazil-1970',
    title: '1970 WORLD CUP FINAL',
    subtitle: 'Brazil — Starting XI',
    year: 1970,
    stage: 'Final',
    opponent: 'Italy',
    formation: '4-3-3',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇧🇷', correctPlayer: 'Félix' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇧🇷', correctPlayer: 'Everaldo' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇧🇷', correctPlayer: 'Brito' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇧🇷', correctPlayer: 'Piazza' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇧🇷', correctPlayer: 'Carlos Alberto' },
      { id: 'cm1', x: 30, y: 45, countryFlag: '🇧🇷', correctPlayer: 'Clodoaldo' },
      { id: 'cm2', x: 50, y: 50, countryFlag: '🇧🇷', correctPlayer: 'Gérson' },
      { id: 'cm3', x: 70, y: 45, countryFlag: '🇧🇷', correctPlayer: 'Rivellino' },
      { id: 'lw', x: 20, y: 25, countryFlag: '🇧🇷', correctPlayer: 'Jairzinho' },
      { id: 'st', x: 50, y: 20, countryFlag: '🇧🇷', correctPlayer: 'Pelé' },
      { id: 'rw', x: 80, y: 25, countryFlag: '🇧🇷', correctPlayer: 'Tostão' },
    ],
    playerOptions: [
      'Pelé',
      'Jairzinho',
      'Tostão',
      'Félix',
      'Brito',
      'Piazza',
      'Carlos Alberto',
      'Everaldo',
      'Clodoaldo',
      'Gérson',
      'Rivellino',
    ],
  },
  'ronaldo-r9': {
    id: 'brazil-2002',
    title: '2002 WORLD CUP FINAL',
    subtitle: 'Brazil — Starting XI (Yokohama)',
    year: 2002,
    stage: 'Final',
    opponent: 'Germany',
    /** FIFA sheet: 3 CBs, wing-backs Cafu / Roberto Carlos, twin pivots, Ronaldinho behind Rivaldo & Ronaldo */
    formation: '3-5-2',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇧🇷', correctPlayer: 'Marcos' },
      { id: 'cb1', x: 25, y: 68, countryFlag: '🇧🇷', correctPlayer: 'Lúcio' },
      { id: 'cb2', x: 50, y: 72, countryFlag: '🇧🇷', correctPlayer: 'Edmílson' },
      { id: 'cb3', x: 75, y: 68, countryFlag: '🇧🇷', correctPlayer: 'Roque Júnior' },
      { id: 'lm', x: 15, y: 50, countryFlag: '🇧🇷', correctPlayer: 'Roberto Carlos' },
      { id: 'cm1', x: 35, y: 52, countryFlag: '🇧🇷', correctPlayer: 'Gilberto Silva' },
      { id: 'cm2', x: 65, y: 52, countryFlag: '🇧🇷', correctPlayer: 'Kléberson' },
      { id: 'rm', x: 85, y: 50, countryFlag: '🇧🇷', correctPlayer: 'Cafu' },
      { id: 'am', x: 50, y: 35, countryFlag: '🇧🇷', correctPlayer: 'Ronaldinho' },
      { id: 'st1', x: 35, y: 18, countryFlag: '🇧🇷', correctPlayer: 'Rivaldo' },
      { id: 'st2', x: 65, y: 18, countryFlag: '🇧🇷', correctPlayer: 'Ronaldo' },
    ],
    playerOptions: [
      'Ronaldo',
      'Rivaldo',
      'Ronaldinho',
      'Marcos',
      'Lúcio',
      'Edmílson',
      'Roque Júnior',
      'Cafu',
      'Roberto Carlos',
      'Gilberto Silva',
      'Kléberson',
    ],
  },
  zidane: {
    id: 'france-1998',
    title: '1998 WORLD CUP FINAL',
    subtitle: 'France — Starting XI',
    year: 1998,
    stage: 'Final',
    opponent: 'Brazil',
    formation: '4-3-2-1',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇫🇷', correctPlayer: 'Barthez' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇫🇷', correctPlayer: 'Lizarazu' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇫🇷', correctPlayer: 'Desailly' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇫🇷', correctPlayer: 'Leboeuf' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇫🇷', correctPlayer: 'Thuram' },
      { id: 'cm1', x: 30, y: 48, countryFlag: '🇫🇷', correctPlayer: 'Deschamps' },
      { id: 'cm2', x: 50, y: 52, countryFlag: '🇫🇷', correctPlayer: 'Petit' },
      { id: 'cm3', x: 70, y: 48, countryFlag: '🇫🇷', correctPlayer: 'Karembeu' },
      { id: 'am1', x: 35, y: 32, countryFlag: '🇫🇷', correctPlayer: 'Zidane' },
      { id: 'am2', x: 65, y: 32, countryFlag: '🇫🇷', correctPlayer: 'Djorkaeff' },
      { id: 'st', x: 50, y: 18, countryFlag: '🇫🇷', correctPlayer: "Guivarc'h" },
    ],
    playerOptions: [
      'Zidane',
      'Djorkaeff',
      "Guivarc'h",
      'Barthez',
      'Desailly',
      'Leboeuf',
      'Thuram',
      'Lizarazu',
      'Deschamps',
      'Petit',
      'Karembeu',
    ],
  },
  maradona: {
    id: 'argentina-1986',
    title: '1986 WORLD CUP FINAL',
    subtitle: 'Argentina — Starting XI',
    year: 1986,
    stage: 'Final',
    opponent: 'West Germany',
    formation: '3-5-2',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇦🇷', correctPlayer: 'Pumpido' },
      { id: 'cb1', x: 25, y: 68, countryFlag: '🇦🇷', correctPlayer: 'Ruggeri' },
      { id: 'cb2', x: 50, y: 72, countryFlag: '🇦🇷', correctPlayer: 'Brown' },
      { id: 'cb3', x: 75, y: 68, countryFlag: '🇦🇷', correctPlayer: 'Cuciuffo' },
      { id: 'lm', x: 15, y: 50, countryFlag: '🇦🇷', correctPlayer: 'Olarticoechea' },
      { id: 'cm1', x: 35, y: 52, countryFlag: '🇦🇷', correctPlayer: 'Batista' },
      { id: 'cm2', x: 50, y: 48, countryFlag: '🇦🇷', correctPlayer: 'Giusti' },
      { id: 'cm3', x: 65, y: 52, countryFlag: '🇦🇷', correctPlayer: 'Burruchaga' },
      { id: 'rm', x: 85, y: 50, countryFlag: '🇦🇷', correctPlayer: 'Enrique' },
      { id: 'st1', x: 38, y: 18, countryFlag: '🇦🇷', correctPlayer: 'Maradona' },
      { id: 'st2', x: 62, y: 18, countryFlag: '🇦🇷', correctPlayer: 'Valdano' },
    ],
    playerOptions: [
      'Maradona',
      'Valdano',
      'Pumpido',
      'Ruggeri',
      'Brown',
      'Cuciuffo',
      'Batista',
      'Giusti',
      'Burruchaga',
      'Olarticoechea',
      'Enrique',
    ],
  },
  totti: {
    id: 'italy-2006',
    title: '2006 WORLD CUP FINAL',
    subtitle: 'Italy — Starting XI',
    year: 2006,
    stage: 'Final',
    opponent: 'France',
    formation: '4-4-2',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇮🇹', correctPlayer: 'Buffon' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇮🇹', correctPlayer: 'Grosso' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇮🇹', correctPlayer: 'Cannavaro' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇮🇹', correctPlayer: 'Materazzi' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇮🇹', correctPlayer: 'Zambrotta' },
      { id: 'lm', x: 15, y: 45, countryFlag: '🇮🇹', correctPlayer: 'Perrotta' },
      { id: 'cm1', x: 35, y: 48, countryFlag: '🇮🇹', correctPlayer: 'Gattuso' },
      { id: 'cm2', x: 65, y: 48, countryFlag: '🇮🇹', correctPlayer: 'Pirlo' },
      { id: 'rm', x: 85, y: 45, countryFlag: '🇮🇹', correctPlayer: 'Camoranesi' },
      { id: 'st1', x: 35, y: 22, countryFlag: '🇮🇹', correctPlayer: 'Totti' },
      { id: 'st2', x: 65, y: 22, countryFlag: '🇮🇹', correctPlayer: 'Toni' },
    ],
    playerOptions: [
      'Totti',
      'Toni',
      'Buffon',
      'Cannavaro',
      'Materazzi',
      'Grosso',
      'Zambrotta',
      'Pirlo',
      'Gattuso',
      'Perrotta',
      'Camoranesi',
    ],
  },
  beckham: {
    id: 'england-2002',
    title: '2002 WORLD CUP QUARTER-FINAL',
    subtitle: 'England — Starting XI',
    year: 2002,
    stage: 'Quarter-Final',
    opponent: 'Brazil',
    formation: '4-4-2',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Seaman' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'A. Cole' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Campbell' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Ferdinand' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Mills' },
      { id: 'lm', x: 15, y: 45, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Sinclair' },
      { id: 'cm1', x: 35, y: 48, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Butt' },
      { id: 'cm2', x: 65, y: 48, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Scholes' },
      { id: 'rm', x: 85, y: 45, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Beckham' },
      { id: 'st1', x: 35, y: 22, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Owen' },
      { id: 'st2', x: 65, y: 22, countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', correctPlayer: 'Heskey' },
    ],
    playerOptions: [
      'Beckham',
      'Owen',
      'Heskey',
      'Seaman',
      'Ferdinand',
      'Campbell',
      'Mills',
      'A. Cole',
      'Scholes',
      'Butt',
      'Sinclair',
    ],
  },
  'spain-2010': {
    id: 'spain-2010',
    title: '2010 WORLD CUP FINAL',
    subtitle: 'Spain — Starting XI',
    year: 2010,
    stage: 'Final',
    opponent: 'Netherlands',
    formation: '4-3-3',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇪🇸', correctPlayer: 'Casillas' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇪🇸', correctPlayer: 'Capdevila' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇪🇸', correctPlayer: 'Piqué' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇪🇸', correctPlayer: 'Puyol' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇪🇸', correctPlayer: 'Ramos' },
      { id: 'cm1', x: 30, y: 45, countryFlag: '🇪🇸', correctPlayer: 'Busquets' },
      { id: 'cm2', x: 50, y: 50, countryFlag: '🇪🇸', correctPlayer: 'Xabi Alonso' },
      { id: 'cm3', x: 70, y: 45, countryFlag: '🇪🇸', correctPlayer: 'Xavi' },
      { id: 'lw', x: 20, y: 25, countryFlag: '🇪🇸', correctPlayer: 'Iniesta' },
      { id: 'st', x: 50, y: 20, countryFlag: '🇪🇸', correctPlayer: 'Villa' },
      { id: 'rw', x: 80, y: 25, countryFlag: '🇪🇸', correctPlayer: 'Pedro' },
    ],
    playerOptions: [
      'Casillas',
      'Ramos',
      'Piqué',
      'Puyol',
      'Capdevila',
      'Busquets',
      'Xabi Alonso',
      'Xavi',
      'Iniesta',
      'Pedro',
      'Villa',
    ],
  },
  'germany-2014': {
    id: 'germany-2014',
    title: '2014 WORLD CUP FINAL',
    subtitle: 'Germany — Starting XI',
    year: 2014,
    stage: 'Final',
    opponent: 'Argentina',
    formation: '4-2-3-1',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇩🇪', correctPlayer: 'Neuer' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇩🇪', correctPlayer: 'Höwedes' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇩🇪', correctPlayer: 'Hummels' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇩🇪', correctPlayer: 'Boateng' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇩🇪', correctPlayer: 'Lahm' },
      { id: 'dm1', x: 35, y: 48, countryFlag: '🇩🇪', correctPlayer: 'Schweinsteiger' },
      { id: 'dm2', x: 65, y: 48, countryFlag: '🇩🇪', correctPlayer: 'Kroos' },
      { id: 'lam', x: 22, y: 28, countryFlag: '🇩🇪', correctPlayer: 'Kramer' },
      { id: 'cam', x: 50, y: 30, countryFlag: '🇩🇪', correctPlayer: 'Özil' },
      { id: 'ram', x: 78, y: 28, countryFlag: '🇩🇪', correctPlayer: 'Müller' },
      { id: 'st', x: 50, y: 16, countryFlag: '🇩🇪', correctPlayer: 'Klose' },
    ],
    playerOptions: [
      'Neuer',
      'Lahm',
      'Hummels',
      'Boateng',
      'Höwedes',
      'Schweinsteiger',
      'Kroos',
      'Kramer',
      'Özil',
      'Müller',
      'Klose',
    ],
  },
  cristiano: {
    id: 'portugal-2018',
    title: '2018 WORLD CUP — GROUP STAGE',
    subtitle: 'Portugal — Starting XI',
    year: 2018,
    stage: 'Group Stage',
    opponent: 'Spain',
    formation: '4-4-2',
    positions: [
      { id: 'gk', x: 50, y: 85, countryFlag: '🇵🇹', correctPlayer: 'Rui Patrício' },
      { id: 'lb', x: 15, y: 65, countryFlag: '🇵🇹', correctPlayer: 'Raphaël Guerreiro' },
      { id: 'cb1', x: 35, y: 70, countryFlag: '🇵🇹', correctPlayer: 'José Fonte' },
      { id: 'cb2', x: 65, y: 70, countryFlag: '🇵🇹', correctPlayer: 'Pepe' },
      { id: 'rb', x: 85, y: 65, countryFlag: '🇵🇹', correctPlayer: 'Cédric' },
      { id: 'lm', x: 15, y: 45, countryFlag: '🇵🇹', correctPlayer: 'João Mário' },
      { id: 'cm1', x: 35, y: 48, countryFlag: '🇵🇹', correctPlayer: 'William Carvalho' },
      { id: 'cm2', x: 65, y: 48, countryFlag: '🇵🇹', correctPlayer: 'João Moutinho' },
      { id: 'rm', x: 85, y: 45, countryFlag: '🇵🇹', correctPlayer: 'Bernardo Silva' },
      { id: 'st1', x: 35, y: 22, countryFlag: '🇵🇹', correctPlayer: 'Gonçalo Guedes' },
      { id: 'st2', x: 65, y: 22, countryFlag: '🇵🇹', correctPlayer: 'Cristiano Ronaldo' },
    ],
    playerOptions: [
      'Cristiano Ronaldo',
      'Gonçalo Guedes',
      'Pepe',
      'Rui Patrício',
      'José Fonte',
      'Cédric',
      'Raphaël Guerreiro',
      'Bernardo Silva',
      'William Carvalho',
      'João Moutinho',
      'João Mário',
    ],
  },
};

export function getSquadPuzzleIdForLevel(level: number): string | undefined {
  if (level < 1 || level > SQUAD_PUZZLE_IDS_BY_LEVEL.length) return undefined;
  return SQUAD_PUZZLE_IDS_BY_LEVEL[level - 1];
}

export function resolveSquadPuzzleKey(routeKey: string): string | undefined {
  if (squadPuzzles[routeKey]) return routeKey;
  const n = parseInt(routeKey, 10);
  if (!Number.isNaN(n)) return getSquadPuzzleIdForLevel(n);
  return undefined;
}

export const getSquadPuzzle = (routeKey: string): SquadPuzzle | undefined => {
  const k = resolveSquadPuzzleKey(routeKey);
  return k ? squadPuzzles[k] : undefined;
};

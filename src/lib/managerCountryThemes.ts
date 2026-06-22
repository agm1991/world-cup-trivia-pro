// Country-specific themes for Managers pages - consistent styling per country
// Uses flag colors and football nicknames for each nation

export type ManagerCountryTheme = {
  bg: string;
  titleGradient: string;
  accentColor: string;
  nickname: string;
};

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export const managerCountryThemes: Record<string, ManagerCountryTheme> = {
  [slug('Hungary')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(120 60% 30% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #ce2939 0%, #fff 35%, #477050 70%, #ce2939 100%)',
    accentColor: '#ce2939',
    nickname: 'Magyarosok',
  },
  [slug('Italy')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 100% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(120 60% 35% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(0 80% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #009246 0%, #fff 35%, #ce2b37 70%, #009246 100%)',
    accentColor: '#009246',
    nickname: 'Gli Azzurri',
  },
  [slug('Brazil')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 100% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(130 80% 30% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #002776 0%, #009c3b 35%, #ffdf00 70%, #009c3b 100%)',
    accentColor: '#ffdf00',
    nickname: 'A Seleção',
  },
  [slug('France')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 90% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(0 80% 50% / 0.05) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #002395 0%, #fff 35%, #ed2939 70%, #002395 100%)',
    accentColor: '#ed2939',
    nickname: 'Les Bleus',
  },
  [slug('Ghana')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(145 60% 35% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(45 90% 50% / 0.05) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #006b3f 0%, #fcd116 35%, #ce1126 70%, #006b3f 100%)',
    accentColor: '#fcd116',
    nickname: 'Black Stars',
  },
  [slug('Germany')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 0% 100% / 0.04) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(45 90% 50% / 0.05) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #000 0%, #dd0000 35%, #ffce00 70%, #000 100%)',
    accentColor: '#ffce00',
    nickname: 'Die Mannschaft',
  },
  [slug('Spain')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 90% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 50% / 0.05) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #c60b1e 0%, #ffc400 35%, #c60b1e 70%, #ffc400 100%)',
    accentColor: '#ffc400',
    nickname: 'La Roja',
  },
  [slug('United States')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 70% 35% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #002868 0%, #fff 35%, #bf0a30 70%, #002868 100%)',
    accentColor: '#bf0a30',
    nickname: 'USMNT',
  },
  [slug('Uruguay')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 70% 55% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #002395 0%, #fff 35%, #002395 70%, #fff 100%)',
    accentColor: '#002395',
    nickname: 'La Celeste',
  },
  [slug('Denmark')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #c8102e 0%, #fff 50%, #c8102e 100%)',
    accentColor: '#c8102e',
    nickname: 'Danish Dynamite',
  },
  [slug('England')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #cf081f 0%, #fff 35%, #012169 70%, #cf081f 100%)',
    accentColor: '#cf081f',
    nickname: 'The Three Lions',
  },
  [slug('Algeria')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(145 60% 35% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(0 80% 45% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #006233 0%, #fff 35%, #d21034 70%, #006233 100%)',
    accentColor: '#006233',
    nickname: 'Les Fennecs',
  },
  [slug('Argentina')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 80% 55% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #75aadb 0%, #fff 50%, #75aadb 100%)',
    accentColor: '#75aadb',
    nickname: 'La Albiceleste',
  },
  [slug('Mexico')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(120 70% 25% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #006847 0%, #fff 35%, #ce1126 70%, #006847 100%)',
    accentColor: '#ce1126',
    nickname: 'El Tri',
  },
  [slug('Scotland')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(210 70% 50% / 0.05) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #0065bd 0%, #fff 50%, #0065bd 100%)',
    accentColor: '#0065bd',
    nickname: 'The Tartan Army',
  },
  [slug('Austria')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #ed2939 0%, #fff 50%, #ed2939 100%)',
    accentColor: '#ed2939',
    nickname: 'Das Wunderteam',
  },
  [slug('Belgium')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(45 90% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #000 0%, #fae042 35%, #ed2939 70%, #000 100%)',
    accentColor: '#ed2939',
    nickname: 'Red Devils',
  },
  [slug('Australia')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 70% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #000 0%, #00843d 35%, #ffcd00 70%, #000 100%)',
    accentColor: '#00843d',
    nickname: 'Socceroos',
  },
  [slug('Nigeria')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(120 60% 25% / 0.08) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #008751 0%, #fff 50%, #008751 100%)',
    accentColor: '#008751',
    nickname: 'Super Eagles',
  },
  [slug('Senegal')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 90% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(120 60% 25% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #00853f 0%, #fcd116 50%, #ce1126 100%)',
    accentColor: '#fcd116',
    nickname: 'Lions of Teranga',
  },
  [slug('Morocco')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(145 60% 30% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #c1272d 0%, #006233 50%, #c1272d 100%)',
    accentColor: '#c1272d',
    nickname: 'Atlas Lions',
  },
  [slug('Netherlands')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(30 100% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #ff6600 0%, #fff 35%, #21468b 70%, #ff6600 100%)',
    accentColor: '#ff6600',
    nickname: 'Oranje',
  },
  [slug('Portugal')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(120 60% 25% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #006600 0%, #ff0000 50%, #006600 100%)',
    accentColor: '#ff0000',
    nickname: 'Seleção das Quinas',
  },
  [slug('Croatia')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(200 80% 45% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #ff0000 0%, #fff 35%, #0093dd 70%, #ff0000 100%)',
    accentColor: '#ff0000',
    nickname: 'Vatreni',
  },
  [slug('Norway')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #ba0c2f 0%, #fff 35%, #00205b 70%, #ba0c2f 100%)',
    accentColor: '#ba0c2f',
    nickname: 'Løvene',
  },
  [slug('Poland')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 0% 100% / 0.05) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.08) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #fff 0%, #dc143c 50%, #fff 100%)',
    accentColor: '#dc143c',
    nickname: 'Biało-Czerwoni',
  },
  [slug('Sweden')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 80% 40% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(45 90% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #005293 0%, #fecd00 50%, #005293 100%)',
    accentColor: '#fecd00',
    nickname: 'Blågult',
  },
  [slug('Romania')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(245 80% 50% / 0.05) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #002b7f 0%, #fcd116 35%, #ce1126 70%, #002b7f 100%)',
    accentColor: '#fcd116',
    nickname: 'Tricolorii',
  },
  [slug('Republic of Ireland')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(145 60% 30% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(45 90% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #169b62 0%, #fff 35%, #ff883e 70%, #169b62 100%)',
    accentColor: '#169b62',
    nickname: 'The Boys in Green',
  },
  [slug('Soviet Union')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #cc0000 0%, #fff 35%, #cc0000 70%, #fff 100%)',
    accentColor: '#cc0000',
    nickname: 'Sbornaya',
  },
  [slug('Yugoslavia')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 70% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #003893 0%, #fff 35%, #ce1126 70%, #003893 100%)',
    accentColor: '#003893',
    nickname: 'Plavi',
  },
  [slug('Paraguay')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 70% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #0038a8 0%, #fff 35%, #ce1126 70%, #0038a8 100%)',
    accentColor: '#0038a8',
    nickname: 'Albirroja',
  },
  [slug('Switzerland')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #d52b1e 0%, #fff 50%, #d52b1e 100%)',
    accentColor: '#d52b1e',
    nickname: 'Nati',
  },
  [slug('Turkey')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #e30a17 0%, #fff 50%, #e30a17 100%)',
    accentColor: '#e30a17',
    nickname: 'Ay-Yıldızlılar',
  },
  [slug('Japan')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #bc002d 0%, #fff 50%, #bc002d 100%)',
    accentColor: '#bc002d',
    nickname: 'Samurai Blue',
  },
  [slug('South Korea')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 70% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(45 90% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #003478 0%, #c60c30 50%, #003478 100%)',
    accentColor: '#c60c30',
    nickname: 'Taegeuk Warriors',
  },
  [slug('Saudi Arabia')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(120 60% 25% / 0.08) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #006c35 0%, #fff 50%, #006c35 100%)',
    accentColor: '#006c35',
    nickname: 'Green Falcons',
  },
  [slug('Iran')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(120 60% 25% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #239f40 0%, #fff 35%, #da0000 70%, #239f40 100%)',
    accentColor: '#239f40',
    nickname: 'Team Melli',
  },
  [slug('Colombia')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 90% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #fcd116 0%, #003087 35%, #ce1126 70%, #fcd116 100%)',
    accentColor: '#fcd116',
    nickname: 'Los Cafeteros',
  },
  [slug('Bulgaria')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(145 60% 35% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #fff 0%, #00966e 35%, #d62612 70%, #fff 100%)',
    accentColor: '#00966e',
    nickname: 'Lavovete',
  },
  [slug('Cameroon')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(120 60% 30% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(45 90% 50% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #007a5e 0%, #fcd116 35%, #ce1126 70%, #007a5e 100%)',
    accentColor: '#fcd116',
    nickname: 'Les Lions Indomptables',
  },
  [slug('Chile')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #0039a6 0%, #fff 35%, #d52b1e 70%, #0039a6 100%)',
    accentColor: '#d52b1e',
    nickname: 'La Roja',
  },
  [slug('Ukraine')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 90% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(220 70% 45% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #005bbb 0%, #ffd500 50%, #005bbb 100%)',
    accentColor: '#005bbb',
    nickname: 'Zbirna',
  },
  [slug('Wales')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(120 60% 30% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #d30731 0%, #fff 35%, #00843d 70%, #d30731 100%)',
    accentColor: '#d30731',
    nickname: 'The Dragons',
  },
  [slug('Costa Rica')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 70% 40% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #002b7f 0%, #fff 35%, #ce1126 70%, #002b7f 100%)',
    accentColor: '#002b7f',
    nickname: 'Los Ticos',
  },
  [slug('Czechoslovakia')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #11457e 0%, #fff 35%, #d7141a 70%, #11457e 100%)',
    accentColor: '#d7141a',
    nickname: 'Rosičáci',
  },
  [slug('North Korea')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(220 70% 35% / 0.06) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #024fa2 0%, #fff 35%, #ed1c27 70%, #024fa2 100%)',
    accentColor: '#ed1c27',
    nickname: 'Chollima',
  },
  [slug('Peru')]: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 45% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    titleGradient: 'linear-gradient(90deg, #d91023 0%, #fff 50%, #d91023 100%)',
    accentColor: '#d91023',
    nickname: 'La Blanquirroja',
  },
};

export const getManagerCountryTheme = (countryName: string): ManagerCountryTheme | null => {
  const key = slug(countryName);
  return managerCountryThemes[key] ?? null;
};

export const getManagerSubtitle = (nickname: string, titles: number): string => {
  if (titles === 0) return nickname;
  if (titles === 1) return `${nickname} · World Cup Champion`;
  return `${nickname} · ${titles}× World Cup Champions`;
};

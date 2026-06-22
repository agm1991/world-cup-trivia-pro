/** Shared country colour themes for World Cup Winners hub + campaign quiz. */
export type WorldCupWinnerCountryTheme = {
  bg: string;
  cardStyles: Array<{ bg: string; border: string; accent: string; radius: string }>;
};

export const WORLD_CUP_WINNER_COUNTRY_THEMES: Record<string, WorldCupWinnerCountryTheme> = {
  brazil: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 100% 45% / 0.12) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(130 80% 30% / 0.1) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(45 90% 50% / 0.08) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(45 95% 45% / 0.2), hsl(45 80% 35% / 0.15))', border: 'hsl(45 90% 50% / 0.4)', accent: 'hsl(45 100% 55%)', radius: '1rem' },
      { bg: 'linear-gradient(145deg, hsl(130 70% 25% / 0.2), hsl(130 60% 20% / 0.15))', border: 'hsl(130 70% 35% / 0.4)', accent: 'hsl(130 80% 45%)', radius: '0.5rem' },
      { bg: 'linear-gradient(145deg, hsl(45 90% 40% / 0.18), hsl(45 70% 30% / 0.12))', border: 'hsl(45 85% 45% / 0.35)', accent: 'hsl(45 95% 50%)', radius: '1.5rem' },
      { bg: 'linear-gradient(145deg, hsl(130 65% 22% / 0.18), hsl(130 55% 18% / 0.12))', border: 'hsl(130 65% 32% / 0.35)', accent: 'hsl(130 75% 42%)', radius: '0.75rem' },
      { bg: 'linear-gradient(145deg, hsl(45 100% 50% / 0.15), hsl(130 80% 30% / 0.1))', border: 'hsl(45 95% 48% / 0.3)', accent: 'hsl(45 100% 60%)', radius: '2rem' },
    ],
  },
  germany: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 0% 100% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 45% / 0.1) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(45 90% 50% / 0.08) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(0 0% 15% / 0.9), hsl(0 0% 8% / 0.9))', border: 'hsl(0 0% 25% / 0.6)', accent: 'hsl(0 0% 90%)', radius: '0.5rem' },
      { bg: 'linear-gradient(145deg, hsl(0 80% 45% / 0.25), hsl(0 70% 35% / 0.2))', border: 'hsl(0 75% 50% / 0.5)', accent: 'hsl(0 85% 55%)', radius: '1rem' },
      { bg: 'linear-gradient(145deg, hsl(45 90% 50% / 0.2), hsl(45 80% 40% / 0.15))', border: 'hsl(45 85% 48% / 0.4)', accent: 'hsl(45 95% 55%)', radius: '0.25rem' },
      { bg: 'linear-gradient(145deg, hsl(0 0% 18% / 0.85), hsl(0 0% 10% / 0.85))', border: 'hsl(0 0% 28% / 0.5)', accent: 'hsl(0 0% 85%)', radius: '1.25rem' },
    ],
  },
  italy: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 100% 50% / 0.1) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(120 60% 35% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(0 80% 50% / 0.08) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(210 100% 45% / 0.25), hsl(210 90% 35% / 0.2))', border: 'hsl(210 95% 50% / 0.5)', accent: 'hsl(210 100% 55%)', radius: '1rem' },
      { bg: 'linear-gradient(145deg, hsl(0 0% 100% / 0.12), hsl(0 0% 90% / 0.08))', border: 'hsl(0 0% 80% / 0.3)', accent: 'hsl(0 0% 95%)', radius: '0.5rem' },
      { bg: 'linear-gradient(145deg, hsl(120 55% 30% / 0.2), hsl(120 50% 25% / 0.15))', border: 'hsl(120 60% 35% / 0.4)', accent: 'hsl(120 70% 45%)', radius: '1.5rem' },
      { bg: 'linear-gradient(145deg, hsl(0 75% 48% / 0.2), hsl(0 70% 40% / 0.15))', border: 'hsl(0 80% 52% / 0.4)', accent: 'hsl(0 85% 58%)', radius: '0.75rem' },
    ],
  },
  argentina: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 80% 55% / 0.12) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(210 70% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 80%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(210 75% 55% / 0.22), hsl(210 65% 45% / 0.18))', border: 'hsl(210 80% 60% / 0.45)', accent: 'hsl(210 90% 70%)', radius: '1.25rem' },
      { bg: 'linear-gradient(145deg, hsl(0 0% 100% / 0.1), hsl(0 0% 90% / 0.06))', border: 'hsl(0 0% 85% / 0.25)', accent: 'hsl(0 0% 98%)', radius: '0.5rem' },
      { bg: 'linear-gradient(145deg, hsl(210 70% 50% / 0.2), hsl(210 60% 40% / 0.15))', border: 'hsl(210 75% 55% / 0.4)', accent: 'hsl(210 85% 65%)', radius: '0.75rem' },
    ],
  },
  france: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(220 90% 50% / 0.1) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 20% 100%, hsl(0 0% 100% / 0.05) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(0 80% 50% / 0.08) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(220 85% 45% / 0.22), hsl(220 75% 35% / 0.18))', border: 'hsl(220 90% 50% / 0.45)', accent: 'hsl(220 95% 60%)', radius: '1rem' },
      { bg: 'linear-gradient(145deg, hsl(0 0% 100% / 0.1), hsl(0 0% 92% / 0.06))', border: 'hsl(0 0% 88% / 0.3)', accent: 'hsl(0 0% 98%)', radius: '0.5rem' },
      { bg: 'linear-gradient(145deg, hsl(0 75% 48% / 0.22), hsl(0 70% 40% / 0.18))', border: 'hsl(0 80% 52% / 0.45)', accent: 'hsl(0 85% 58%)', radius: '1.5rem' },
    ],
  },
  uruguay: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(210 70% 55% / 0.1) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(210 60% 50% / 0.06) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(210 65% 50% / 0.2), hsl(210 55% 40% / 0.15))', border: 'hsl(210 70% 55% / 0.4)', accent: 'hsl(210 80% 65%)', radius: '1rem' },
      { bg: 'linear-gradient(145deg, hsl(0 0% 100% / 0.08), hsl(0 0% 92% / 0.05))', border: 'hsl(0 0% 85% / 0.25)', accent: 'hsl(0 0% 96%)', radius: '0.75rem' },
    ],
  },
  england: {
    bg: 'linear-gradient(90deg, transparent 42%, hsl(0 72% 46% / 0.14) 42%, hsl(0 72% 46% / 0.14) 58%, transparent 58%), linear-gradient(180deg, transparent 42%, hsl(0 72% 46% / 0.12) 42%, hsl(0 72% 46% / 0.12) 58%, transparent 58%), radial-gradient(ellipse 100% 60% at 50% 0%, hsl(0 80% 50% / 0.08) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 0% 100% / 0.04) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(0 75% 45% / 0.25), hsl(0 70% 35% / 0.2))', border: 'hsl(0 80% 50% / 0.5)', accent: 'hsl(0 85% 58%)', radius: '1rem' },
    ],
  },
  spain: {
    bg: 'radial-gradient(ellipse 100% 60% at 50% 0%, hsl(45 90% 50% / 0.1) 0%, transparent 50%), radial-gradient(ellipse 80% 50% at 80% 100%, hsl(0 80% 50% / 0.08) 0%, transparent 50%)',
    cardStyles: [
      { bg: 'linear-gradient(145deg, hsl(0 75% 48% / 0.22), hsl(0 70% 40% / 0.18))', border: 'hsl(0 80% 52% / 0.45)', accent: 'hsl(0 85% 58%)', radius: '1rem' },
      { bg: 'linear-gradient(145deg, hsl(45 90% 48% / 0.2), hsl(45 80% 40% / 0.15))', border: 'hsl(45 85% 50% / 0.4)', accent: 'hsl(45 95% 55%)', radius: '0.75rem' },
    ],
  },
};

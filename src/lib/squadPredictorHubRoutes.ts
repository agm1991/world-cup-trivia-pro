/** Shared routes and labels for the 2026 Squad & Predictor hub (four pages). */

export const PREDICTOR_SECTIONS = ['squad', 'tournament', 'awards', 'community'] as const;
export type PredictorSection = (typeof PREDICTOR_SECTIONS)[number];

export const PREDICTOR_PATHS: Record<PredictorSection, string> = {
  squad: '/squad-predictor/squad',
  tournament: '/squad-predictor/tournament',
  awards: '/squad-predictor/awards',
  community: '/squad-predictor/community',
};

/** Full bracket (R32→final) after group stage — FIFA route M73–M104. */
export const PREDICTOR_KNOCKOUT_ROAD_PATH = '/squad-predictor/tournament/knockouts' as const;

export const PREDICTOR_SECTION_LABELS: Record<PredictorSection, { headline: string }> = {
  squad: { headline: 'Squad & predictor' },
  tournament: { headline: 'Tournament & bracket' },
  awards: { headline: 'Awards' },
  community: { headline: 'Community' },
};

export function isPredictorSection(s: string | undefined): s is PredictorSection {
  return !!s && (PREDICTOR_SECTIONS as readonly string[]).includes(s);
}

export function predictorSectionFromPathname(pathname: string): PredictorSection | undefined {
  const seg = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  if (seg.includes('tournament')) return 'tournament';
  const last = seg[seg.length - 1];
  return isPredictorSection(last) ? last : undefined;
}

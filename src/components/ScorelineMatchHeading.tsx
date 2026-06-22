import { cn } from '@/lib/utils';
import type { Question } from '@/types/game';
import { TeamNameWithFlag } from '@/components/TeamNameWithFlag';

const STAGE_LABELS: Record<string, string> = {
  final: 'Final',
  'semi-final': 'Semi-final',
  'quarter-final': 'Quarter-final',
  'round of 16': 'Round of 16',
  'group stage': 'Group stage',
  'third-place playoff': 'Third-place playoff',
  'third place playoff': 'Third-place playoff',
};

function formatStageLabel(raw: string): string {
  const key = raw.trim().toLowerCase();
  if (STAGE_LABELS[key]) return STAGE_LABELS[key];
  return raw.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Year from ids like `sc-2022-1-1` or bingo-tagged `bingo-12_sc-2022-1-1` (presentation only). */
export function parseYearFromScorelineQuestionId(id: string): number | null {
  const m = /(^|_)sc-(\d{4})-/.exec(id);
  if (!m) return null;
  const y = parseInt(m[2], 10);
  return Number.isFinite(y) ? y : null;
}

/** Uses explicit `scorelineResultNote` or the correct option text (e.g. contains "(AET)" / "(pens)"). */
export function inferScorelineResultNote(q: Question): 'aet' | 'pens' | null {
  if (q.scorelineResultNote === 'aet' || q.scorelineResultNote === 'pens') {
    return q.scorelineResultNote;
  }
  const key = `option${q.correctAnswer}` as keyof Question;
  const raw = String(q[key] ?? '');
  const t = raw.toLowerCase();
  if (t.includes('(aet)') || t.includes('a.e.t') || /\baet\b/.test(t)) return 'aet';
  if (t.includes('(pens)')) return 'pens';
  return null;
}

const FIFA_YEAR = /FIFA World Cup\s+(\d{4})/i;

/** Splits curated "FIFA World Cup YYYY — A vs B — STAGE" or legacy "A vs B - stage". */
export function parseScorelineMatchQuestion(question: string): {
  stage: string | null;
  teams: string;
  /** When the question text includes "FIFA World Cup YYYY" (curated levels 1–10). */
  tournamentYear: number | null;
} {
  const emSep = ' — ';
  if (question.includes(emSep)) {
    const parts = question
      .split(emSep)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length >= 3) {
      const header = parts[0] ?? '';
      const matchup = parts[1] ?? '';
      const rawStage = parts.slice(2).join(emSep);
      const yearMatch = FIFA_YEAR.exec(header);
      const tournamentYear = yearMatch ? parseInt(yearMatch[1]!, 10) : null;
      if (matchup) {
        return {
          stage: formatStageLabel(rawStage),
          teams: matchup,
          tournamentYear,
        };
      }
    }
  }

  const sep = ' - ';
  const idx = question.lastIndexOf(sep);
  const yearFromAnywhere = (): number | null => {
    const m = FIFA_YEAR.exec(question);
    return m ? parseInt(m[1]!, 10) : null;
  };
  if (idx === -1) {
    return { stage: null, teams: question, tournamentYear: yearFromAnywhere() };
  }
  const teams = question.slice(0, idx).trim();
  const rawStage = question.slice(idx + sep.length).trim();
  if (!teams || !rawStage) {
    return { stage: null, teams: question, tournamentYear: yearFromAnywhere() };
  }
  return {
    stage: formatStageLabel(rawStage),
    teams,
    tournamentYear: yearFromAnywhere(),
  };
}

function splitTeams(teamsLine: string): string[] | null {
  const parts = teamsLine.split(/\s+vs\s+/i).map((s) => s.trim());
  if (parts.length === 2 && parts[0] && parts[1]) return parts;
  return null;
}

type Props = {
  question: string;
  /** When set, shows boxed title block + matchup + stage + optional AET/Pens. */
  year?: number | null;
  /** Kickoff or tournament window (e.g. "12 July 1966"). */
  matchDate?: string | null;
  resultNote?: 'aet' | 'pens' | null;
  className?: string;
  teamsClassName?: string;
};

export function ScorelineMatchHeading({
  question,
  year,
  matchDate,
  resultNote,
  className,
  teamsClassName,
}: Props) {
  const { stage, teams, tournamentYear } = parseScorelineMatchQuestion(question);
  const pair = splitTeams(teams);
  const displayYear = year ?? tournamentYear;
  const showFeatured = displayYear != null;

  if (!showFeatured) {
    if (!stage && displayYear == null && !matchDate) {
      return (
        <h2
          className={cn(
            'text-xl md:text-2xl font-semibold text-foreground text-center leading-snug',
            teamsClassName,
            className,
          )}
        >
          {teams}
        </h2>
      );
    }

    return (
      <div className={cn('text-center', className)}>
        {displayYear != null && (
          <p className="text-[11px] md:text-xs font-bold tracking-[0.12em] text-primary mb-2">
            FIFA World Cup {displayYear}
          </p>
        )}
        {stage && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2.5">
            {stage}
          </p>
        )}
        <p
          className={cn(
            'text-xl md:text-2xl font-semibold text-foreground leading-snug tracking-tight',
            teamsClassName,
          )}
        >
          {pair ? (
            <>
              <TeamNameWithFlag team={pair[0]!} />
              <span className="mx-1.5 font-semibold text-foreground/90">vs</span>
              <TeamNameWithFlag team={pair[1]!} />
            </>
          ) : (
            teams
          )}
        </p>
        {matchDate && (
          <p className="text-[10px] md:text-xs font-bold tracking-[0.12em] text-primary mt-2">
            {matchDate}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mx-auto max-w-lg rounded-xl border-2 border-primary/45 bg-muted/40 px-3 py-4 text-center shadow-sm md:px-5 md:py-5',
        className,
      )}
    >
      <div className="flex flex-col gap-2 md:gap-2.5">
        <p className="text-[11px] md:text-xs font-bold tracking-[0.12em] text-primary">
          FIFA World Cup {displayYear}
        </p>
        {pair ? (
          <p
            className={cn(
              'text-xl md:text-2xl font-bold text-primary leading-snug tracking-tight flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1',
              teamsClassName,
            )}
          >
            <TeamNameWithFlag team={pair[0]!} />
            <span className="font-semibold text-foreground/90">vs</span>
            <TeamNameWithFlag team={pair[1]!} />
          </p>
        ) : (
          <p
            className={cn(
              'text-lg md:text-xl font-bold text-primary leading-snug tracking-tight',
              teamsClassName,
            )}
          >
            {teams}
          </p>
        )}
        {stage && (
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            {stage}
          </p>
        )}
        {matchDate && (
          <p className="text-[10px] md:text-xs font-bold tracking-[0.12em] text-primary">
            {matchDate}
          </p>
        )}
        {resultNote === 'aet' && (
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/90">AET</p>
        )}
        {resultNote === 'pens' && (
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/90">Pens</p>
        )}
      </div>
    </div>
  );
}

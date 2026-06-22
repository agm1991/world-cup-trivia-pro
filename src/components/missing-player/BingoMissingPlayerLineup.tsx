import { Card } from '@/components/ui/card';
import { MatchupWithTeamFlags } from '@/components/TeamNameWithFlag';
import { resolveBingoLineupPitch } from '@/lib/missingPlayerBingoLineupResolve';
import type { ParsedBingoMissingPlayerPrompt } from '@/lib/missingPlayerBingoPrompt';
import { MissingPlayerLineupPitch } from '@/components/missing-player/MissingPlayerLineupPitch';
import type { Question } from '@/types/game';

type Props = {
  parsed: ParsedBingoMissingPlayerPrompt;
  question: Question;
};

/**
 * Same header + pitch layout as `MissingPlayerGame` (screenshot 3 reference).
 */
export function BingoMissingPlayerLineup({ parsed, question }: Props) {
  const { matchup, team, year, stageLabel, footnote } = parsed;
  const positions = resolveBingoLineupPitch(parsed, question);
  const missingCount = positions.filter((p) => p.isMissing).length;

  return (
    <div className="space-y-4">
      <Card className="p-4 mb-4 border-border text-center bg-card/50">
        <h2 className="text-xl font-bold text-primary tracking-wide space-y-1">
          <div className="block">
            <MatchupWithTeamFlags matchup={matchup} />
          </div>
          {year ? <div className="block">{year}</div> : null}
          {stageLabel ? <div className="block">{stageLabel}</div> : null}
        </h2>
        <p className="text-foreground font-semibold mt-2">{team} Starting XI</p>
      </Card>

      {positions.length > 0 ? (
        <MissingPlayerLineupPitch positions={positions} className="mb-4" />
      ) : null}

      {footnote ? (
        <p className="text-center text-xs text-muted-foreground px-2 leading-snug normal-case">
          ({footnote})
        </p>
      ) : null}

      <h3 className="text-lg font-bold text-center text-foreground tracking-wide normal-case">
        {missingCount >= 2 ? 'Who are the missing players?' : 'Who is the missing player?'}
      </h3>
    </div>
  );
}

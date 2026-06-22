import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TournamentBracket,
  type BracketSnapshot,
} from '@/components/SquadPredictor/TournamentBracket';

type KnockMatch = {
  teamA: string;
  teamB: string;
  sA: string;
  sB: string;
  tie: '' | 'A' | 'B';
};

export type TournamentTabProps = {
  /** When true (knockout road page), only the bracket — no duplicate hero cards above. */
  compact?: boolean;
  bracketView: 'group' | 'knockouts';
  bracket: BracketSnapshot;
  groupScores: Record<string, string>;
  onSaveMatch: (key: string, value: string) => void;
  ro32: KnockMatch[];
  ro16: KnockMatch[];
  qf: KnockMatch[];
  sf: KnockMatch[];
  thirdPlace: KnockMatch;
  final: KnockMatch;
  onRo32Change: (i: number, m: KnockMatch) => void;
  onRo16Change: (i: number, m: KnockMatch) => void;
  onQfChange: (i: number, m: KnockMatch) => void;
  onSfChange: (i: number, m: KnockMatch) => void;
  onThirdPlaceChange: (m: KnockMatch) => void;
  onFinalChange: (m: KnockMatch) => void;
  /** From knockout: switch to group-stage tab. */
  onRequestGroupView?: () => void;
  /** From group stage: switch to knockout tab (FIFA M73–M104). */
  onRequestKnockoutView?: () => void;
};

export function TournamentTab({
  compact = false,
  bracketView,
  bracket,
  groupScores,
  onSaveMatch,
  ro32,
  ro16,
  qf,
  sf,
  thirdPlace,
  final,
  onRo32Change,
  onRo16Change,
  onQfChange,
  onSfChange,
  onThirdPlaceChange,
  onFinalChange,
  onRequestGroupView,
  onRequestKnockoutView,
}: TournamentTabProps) {
  return (
    <div className="space-y-8 outline-none pt-1 sm:pt-2">
      {!compact && (
        <>
          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7 shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 mb-1">Tournament</p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">2026 ROUTE &amp; BRACKET</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
              Enter every group scoreline, then use the <span className="font-semibold text-foreground/90">Knockout bracket</span>{' '}
              tab for FIFA M73–M104 (Annex C third-place mapping). Switch between group and knockout anytime.
            </p>
          </div>
          <Card className="border-dashed border-primary/20 bg-muted/10 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase tracking-[0.12em]">Tournament tools</CardTitle>
              <CardDescription>
                Groups feed the bracket — scores and knockout picks stay in sync with the 2026 format.
              </CardDescription>
            </CardHeader>
          </Card>
        </>
      )}
      <TournamentBracket
        view={bracketView}
        bracket={bracket}
        groupScores={groupScores}
        onSaveMatch={onSaveMatch}
        ro32={ro32}
        ro16={ro16}
        qf={qf}
        sf={sf}
        thirdPlace={thirdPlace}
        final={final}
        onRo32Change={onRo32Change}
        onRo16Change={onRo16Change}
        onQfChange={onQfChange}
        onSfChange={onSfChange}
        onThirdPlaceChange={onThirdPlaceChange}
        onFinalChange={onFinalChange}
        onRequestGroupView={onRequestGroupView}
        onRequestKnockoutView={onRequestKnockoutView}
      />
    </div>
  );
}

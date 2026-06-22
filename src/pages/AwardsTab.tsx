import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { AwardPoolEntry } from '@/data/squadPredictor2026AwardPool';
import { AwardPickCombobox } from '@/components/SquadPredictor/AwardPickCombobox';
import {
  filterAwardPoolByNationAndPosition,
  filterAwardPoolGoalkeepers,
  type AwardPositionFilter,
} from '@/lib/squadPredictorAwardFilters';
import type { AwardsState } from '@/lib/awardsState';

export type { AwardsState };
export { normalizeAwardsFromPersisted } from '@/lib/awardsState';

export type AwardsTabProps = {
  awards: AwardsState;
  setAwards: Dispatch<SetStateAction<AwardsState>>;
  awardPoolPlayers: AwardPoolEntry[];
  nationItems: AwardPoolEntry[];
  /** Saves a named profile entry and publishes award picks to the local Community feed. */
  onShareAwardsToCommunity: () => void;
};

function useFilteredPlayers(
  awardPoolPlayers: AwardPoolEntry[],
  nation: string,
  position: AwardPositionFilter,
) {
  return useMemo(
    () => filterAwardPoolByNationAndPosition(awardPoolPlayers, nation, position),
    [awardPoolPlayers, nation, position],
  );
}

function useFilteredGoalkeepers(awardPoolPlayers: AwardPoolEntry[], nation: string) {
  return useMemo(
    () => filterAwardPoolGoalkeepers(awardPoolPlayers, nation),
    [awardPoolPlayers, nation],
  );
}

type PlayerAwardBlockProps = {
  /** Award category — blocks are ordered A–Z by this label. */
  categoryTitle: string;
  nationId: string;
  playerId: string;
  nation: string;
  onNationChange: (n: string) => void;
  playerValue: string;
  onPlayerChange: (v: string) => void;
  playerItems: AwardPoolEntry[];
  nationItems: AwardPoolEntry[];
  nationPlaceholder?: string;
  playerPlaceholder: string;
  emptyPlayerText: string;
};

function PlayerAwardBlock({
  categoryTitle,
  nationId,
  playerId,
  nation,
  onNationChange,
  playerValue,
  onPlayerChange,
  playerItems,
  nationItems,
  nationPlaceholder = 'Select nation (A–Z)',
  playerPlaceholder,
  emptyPlayerText,
}: PlayerAwardBlockProps) {
  const dim = !nation;
  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-4">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary/90">{categoryTitle}</p>
      <div className="space-y-2">
        <Label htmlFor={nationId}>Nation</Label>
        <AwardPickCombobox
          id={nationId}
          value={nation}
          onChange={onNationChange}
          items={nationItems}
          placeholder={nationPlaceholder}
          searchPlaceholder="Search nations…"
          listGroupHeading="A–Z"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={playerId} className={dim ? 'text-muted-foreground' : undefined}>
          Player
        </Label>
        <AwardPickCombobox
          id={playerId}
          value={playerValue}
          onChange={onPlayerChange}
          items={playerItems}
          placeholder={nation ? playerPlaceholder : 'Pick a nation first'}
          searchPlaceholder="Search players…"
          emptyText={nation ? emptyPlayerText : 'Choose a nation first.'}
        />
      </div>
    </div>
  );
}

export function AwardsTab({
  awards,
  setAwards,
  awardPoolPlayers,
  nationItems,
  onShareAwardsToCommunity,
}: AwardsTabProps) {
  const goldenBootItems = useFilteredPlayers(awardPoolPlayers, awards.goldenBootNation, 'FWD');
  const gkItems = useFilteredGoalkeepers(awardPoolPlayers, awards.bestGoalkeeperNation);
  const defenderItems = useFilteredPlayers(awardPoolPlayers, awards.bestDefenderNation, 'DEF');
  const midfielderItems = useFilteredPlayers(awardPoolPlayers, awards.bestMidfielderNation, 'MID');
  const strikerItems = useFilteredPlayers(awardPoolPlayers, awards.bestStrikerNation, 'FWD');

  return (
    <div className="space-y-8 outline-none pt-1 sm:pt-2">
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 mb-1">Awards</p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">TOURNAMENT AWARDS</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Player award <span className="font-medium text-foreground">categories</span> are listed A–Z (Best defender through
          Golden Boot). Use the <span className="font-medium text-foreground">first dropdown</span> (nations A–Z), then
          choose a player — same idea as{' '}
          <span className="font-medium text-foreground">Winner</span>, <span className="font-medium text-foreground">Runner-up</span>
          , and <span className="font-medium text-foreground">Third place</span> for placements (one nation each).
        </p>
      </div>
      <Card className="border-border bg-card/90 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-xl font-black uppercase tracking-[0.08em] sm:text-2xl">Your picks</CardTitle>
          <CardDescription>
            Categories A–Z in the player section; tournament placements follow podium order. The{' '}
            <span className="font-medium text-foreground">first</span> dropdown in each block is nation — labeled
            &quot;Select nation (A–Z)&quot; — then pick a player.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2 mb-4">
              Player awards (A–Z by category)
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <PlayerAwardBlock
                categoryTitle="Best defender"
                nationId="award-best-defender-nation"
                playerId="award-best-defender"
                nation={awards.bestDefenderNation}
                onNationChange={(bestDefenderNation) =>
                  setAwards((a) => ({ ...a, bestDefenderNation, bestDefender: '' }))
                }
                playerValue={awards.bestDefender}
                onPlayerChange={(bestDefender) => setAwards((a) => ({ ...a, bestDefender }))}
                playerItems={defenderItems}
                nationItems={nationItems}
                playerPlaceholder="Pick a defender"
                emptyPlayerText="No defenders in pool for this nation."
              />
              <PlayerAwardBlock
                categoryTitle="Best goalkeeper"
                nationId="award-best-gk-nation"
                playerId="award-best-gk"
                nation={awards.bestGoalkeeperNation}
                onNationChange={(bestGoalkeeperNation) =>
                  setAwards((a) => ({ ...a, bestGoalkeeperNation, bestGoalkeeper: '' }))
                }
                playerValue={awards.bestGoalkeeper}
                onPlayerChange={(bestGoalkeeper) => setAwards((a) => ({ ...a, bestGoalkeeper }))}
                playerItems={gkItems}
                nationItems={nationItems}
                playerPlaceholder="Pick a goalkeeper"
                emptyPlayerText="No goalkeepers in pool for this nation."
              />
              <PlayerAwardBlock
                categoryTitle="Best midfielder"
                nationId="award-best-midfielder-nation"
                playerId="award-best-midfielder"
                nation={awards.bestMidfielderNation}
                onNationChange={(bestMidfielderNation) =>
                  setAwards((a) => ({ ...a, bestMidfielderNation, bestMidfielder: '' }))
                }
                playerValue={awards.bestMidfielder}
                onPlayerChange={(bestMidfielder) => setAwards((a) => ({ ...a, bestMidfielder }))}
                playerItems={midfielderItems}
                nationItems={nationItems}
                playerPlaceholder="Pick a midfielder"
                emptyPlayerText="No midfielders in pool for this nation."
              />
              <PlayerAwardBlock
                categoryTitle="Best striker"
                nationId="award-best-striker-nation"
                playerId="award-best-striker"
                nation={awards.bestStrikerNation}
                onNationChange={(bestStrikerNation) =>
                  setAwards((a) => ({ ...a, bestStrikerNation, bestStriker: '' }))
                }
                playerValue={awards.bestStriker}
                onPlayerChange={(bestStriker) => setAwards((a) => ({ ...a, bestStriker }))}
                playerItems={strikerItems}
                nationItems={nationItems}
                playerPlaceholder="Pick a forward"
                emptyPlayerText="No forwards in pool for this nation."
              />
              <PlayerAwardBlock
                categoryTitle="Golden Boot"
                nationId="award-golden-boot-nation"
                playerId="award-golden-boot"
                nation={awards.goldenBootNation}
                onNationChange={(goldenBootNation) =>
                  setAwards((a) => ({ ...a, goldenBootNation, goldenBoot: '' }))
                }
                playerValue={awards.goldenBoot}
                onPlayerChange={(goldenBoot) => setAwards((a) => ({ ...a, goldenBoot }))}
                playerItems={goldenBootItems}
                nationItems={nationItems}
                playerPlaceholder="Pick a forward / winger"
                emptyPlayerText="No forwards in pool for this nation."
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground border-b border-border pb-2 mb-4">
              Tournament finish (podium order)
            </h3>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="award-winner">Winner</Label>
                <AwardPickCombobox
                  id="award-winner"
                  value={awards.tournamentWinner}
                  onChange={(tournamentWinner) => setAwards((a) => ({ ...a, tournamentWinner }))}
                  items={nationItems}
                  placeholder="Select nation (A–Z)"
                  searchPlaceholder="Search nations…"
                  listGroupHeading="A–Z"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-runner-up">Runner-up</Label>
                <AwardPickCombobox
                  id="award-runner-up"
                  value={awards.tournamentRunnerUp}
                  onChange={(tournamentRunnerUp) => setAwards((a) => ({ ...a, tournamentRunnerUp }))}
                  items={nationItems}
                  placeholder="Select nation (A–Z)"
                  searchPlaceholder="Search nations…"
                  listGroupHeading="A–Z"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="award-third">Third place</Label>
                <AwardPickCombobox
                  id="award-third"
                  value={awards.thirdPlace}
                  onChange={(thirdPlace) => setAwards((a) => ({ ...a, thirdPlace }))}
                  items={nationItems}
                  placeholder="Select nation (A–Z)"
                  searchPlaceholder="Search nations…"
                  listGroupHeading="A–Z"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t border-border/60">
            <Button
              type="button"
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold shadow-sm"
              onClick={onShareAwardsToCommunity}
            >
              Save &amp; share to community
            </Button>
            <p className="text-xs text-muted-foreground self-center max-w-md leading-relaxed">
              Stores your full predictor snapshot (squad, bracket, awards) on this device, adds a profile save, and posts
              your award picks to Community — next to World XI in the feed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

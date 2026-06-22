import { cn } from '@/lib/utils';
import { getMissingPlayerTeamFlag, stripTeamNameFlags } from '@/lib/countryFlags';
import { MissingPlayerFlagIcon } from '@/components/missing-player/MissingPlayerFlagIcon';

type TeamNameWithFlagProps = {
  team: string;
  className?: string;
  emojiClassName?: string;
  imageClassName?: string;
};

export function TeamNameWithFlag({
  team,
  className,
  emojiClassName = 'text-[1.15em] leading-none',
  imageClassName = 'h-5 w-7 object-cover rounded-sm shrink-0',
}: TeamNameWithFlagProps) {
  const name = stripTeamNameFlags(team);
  const flag = getMissingPlayerTeamFlag(name);
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <MissingPlayerFlagIcon flag={flag} emojiClassName={emojiClassName} imageClassName={imageClassName} />
      <span>{name}</span>
    </span>
  );
}

type MatchupWithTeamFlagsProps = {
  matchup: string;
  className?: string;
};

export function MatchupWithTeamFlags({ matchup, className }: MatchupWithTeamFlagsProps) {
  const parts = matchup.split(/\s+vs\s+/i).map((s) => s.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return <span className={className}>{matchup}</span>;
  }
  return (
    <span className={cn('inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1', className)}>
      <TeamNameWithFlag team={parts[0]} />
      <span className="font-semibold text-foreground/90">vs</span>
      <TeamNameWithFlag team={parts[1]} />
    </span>
  );
}

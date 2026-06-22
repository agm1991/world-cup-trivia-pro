import { Card } from '@/components/ui/card';
import { MissingPlayerFlagIcon } from '@/components/missing-player/MissingPlayerFlagIcon';

export type MissingPlayerPitchSlot = {
  name: string;
  flag: string;
  x: number;
  y: number;
  isMissing: boolean;
};

type Props = {
  positions: MissingPlayerPitchSlot[];
  className?: string;
};

/** Same positioning as `MissingPlayerGame` — raw 0–100% with center anchor. */
export function MissingPlayerLineupPitch({ positions, className }: Props) {
  return (
    <Card
      className={`relative aspect-[4/5] mb-0 overflow-hidden border-border bg-[#2d6b3f] shadow-inner max-w-lg mx-auto w-full ${className ?? ''}`}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-90"
        style={{
          backgroundColor: '#2f6d42',
          backgroundImage: `
            linear-gradient(45deg, rgba(0,0,0,0.14) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(0,0,0,0.14) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.14) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.14) 75%)
          `,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 0 14px, 14px -14px, -14px 0px',
        }}
      />
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-2 border-2 border-white/30 rounded-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/30 rounded-full" />
        <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-t-0 border-white/30" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-t-0 border-white/30" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-b-0 border-white/30" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-b-0 border-white/30" />
      </div>

      {positions.map((position, index) => {
        const showBlank = position.isMissing || position.name === '???';

        return (
          <div
            key={`pitch-${index}-${position.name}`}
            className="absolute z-[2] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
          >
            <div
              className={`rounded-full flex items-center justify-center text-lg transition-all duration-200 ${
                showBlank
                  ? 'relative z-[3] w-11 h-11 md:w-14 md:h-14 scale-[1.06] border-2 border-amber-400/95 bg-gradient-to-b from-amber-950/90 via-amber-950/75 to-black/80 shadow-[0_0_20px_rgba(251,191,36,0.55),inset_0_1px_0_rgba(255,255,255,0.18)] ring-2 ring-amber-300/45'
                  : 'z-[2] w-10 h-10 md:w-12 md:h-12 bg-card/90 border border-border shadow-md'
              }`}
            >
              {showBlank ? (
                <span
                  className="font-black tabular-nums text-[17px] md:text-xl leading-none text-amber-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  aria-hidden
                >
                  ?
                </span>
              ) : (
                <MissingPlayerFlagIcon flag={position.flag} />
              )}
            </div>
            {!showBlank && (
              <span className="text-[10px] md:text-xs font-semibold mt-1 px-1.5 py-0.5 rounded-md text-center leading-tight max-w-[4.5rem] text-white bg-black/50">
                {position.name}
              </span>
            )}
          </div>
        );
      })}
    </Card>
  );
}

/**
 * Broadcast-style header for the post–group-stage bracket (FIFA 2026 route).
 */
export function RoadToFinalHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[hsl(215_35%_22%)] bg-[linear-gradient(165deg,hsl(222_55%_8%)_0%,hsl(222_47%_11%)_45%,hsl(222_50%_6%)_100%)] px-4 py-8 shadow-[inset_0_1px_0_hsl(45_93%_47%/0.12)] sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[120%] w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,hsl(45_90%_55%/0.35),transparent_55%)]" />
      </div>
      <div className="relative mx-auto max-w-5xl">
        <svg
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-32 w-full -translate-y-1/2 opacity-50 sm:h-40"
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points="40,60 120,60 120,30 200,30 200,90 280,90 280,60 360,60"
            fill="none"
            stroke="hsl(45 93% 52%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="760,60 680,60 680,30 600,30 600,90 520,90 520,60 440,60"
            fill="none"
            stroke="hsl(350 75% 52%)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="relative text-center font-black uppercase tracking-[0.2em] text-foreground text-lg sm:text-2xl md:text-3xl">
          Road to the World Cup final
        </h2>
        <p className="relative mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
          FIFA 2026 knockout route · M73–M88 · M89–M96 · M97–M104
        </p>
      </div>
    </div>
  );
}

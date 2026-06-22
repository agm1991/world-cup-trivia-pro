/**
 * Hub banner: pitch + schematic XI with several “missing” slots — matches the mode’s core hook.
 */
export function MissingPlayersPitchBanner() {
  return (
    <div
      className="mx-auto mb-6 max-w-3xl overflow-hidden rounded-2xl border border-amber-500/35 bg-[#0f2e1c] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55)] ring-1 ring-amber-400/15"
      role="img"
      aria-label="Football pitch with a starting eleven; several shirt positions show a question mark for missing players"
    >
      <svg viewBox="0 0 400 232" className="block w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mp-stripes" width="16" height="232" patternUnits="userSpaceOnUse">
            <rect width="8" height="232" fill="#1a5530" />
            <rect x="8" width="8" height="232" fill="#23693d" />
          </pattern>
          <linearGradient id="mp-vignette" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#071810" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#071810" stopOpacity="0" />
            <stop offset="60%" stopColor="#071810" stopOpacity="0" />
            <stop offset="100%" stopColor="#050f0c" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="mp-missing-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="14" y="10" width="372" height="212" rx="6" fill="url(#mp-stripes)" stroke="#e8eef2" strokeWidth="2.5" />
        <line x1="200" y1="10" x2="200" y2="222" stroke="#e8eef2" strokeWidth="2" opacity={0.95} />
        <circle cx="200" cy="116" r="44" fill="none" stroke="#e8eef2" strokeWidth="2" />
        <circle cx="200" cy="116" r="4" fill="#e8eef2" />
        <rect x="146" y="10" width="108" height="54" fill="none" stroke="#e8eef2" strokeWidth="2" />
        <rect x="146" y="168" width="108" height="54" fill="none" stroke="#e8eef2" strokeWidth="2" />

        {/* Faint diamond — back four + midfield pair + front two */}
        <path
          d="M 200 198 L 85 178 L 155 130 L 85 125 M 315 178 L 245 130 L 315 125 M 155 72 L 245 72"
          fill="none"
          stroke="rgba(248,250,252,0.2)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />

        {/* 4-4-2 style: 7 named dots + 4 missing = XI */}
        <g fontFamily="system-ui, Segoe UI, sans-serif">
          {[
            [200, 198],
            [85, 178],
            [155, 182],
            [245, 182],
            [315, 178],
            [155, 130],
            [245, 130],
          ].map(([cx, cy], i) => (
            <g key={`ok-${i}`}>
              <circle cx={cx} cy={cy} r="9" fill="rgba(15,23,42,0.45)" stroke="rgba(248,250,252,0.5)" strokeWidth="1.5" />
              <circle cx={cx} cy={cy} r="3.5" fill="rgba(226,232,240,0.85)" />
            </g>
          ))}

          {[
            [85, 125],
            [315, 125],
            [155, 72],
            [245, 72],
          ].map(([cx, cy], i) => (
            <g key={`miss-${i}`}>
              <circle cx={cx} cy={cy} r="22" fill="url(#mp-missing-glow)" opacity={0.95} />
              <circle
                cx={cx}
                cy={cy}
                r="13"
                fill="rgba(30,20,5,0.75)"
                stroke="#fbbf24"
                strokeWidth="2.25"
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fef3c7"
                fontSize="15"
                fontWeight={800}
              >
                ?
              </text>
            </g>
          ))}
        </g>

        <text x="200" y="228" textAnchor="middle" fill="rgba(254,243,199,0.85)" fontSize="10" fontFamily="system-ui, sans-serif" letterSpacing="0.08em">
          SPOTS TO FILL ON THE XI
        </text>

        <rect x="0" y="0" width="400" height="232" fill="url(#mp-vignette)" pointerEvents="none" />
      </svg>
    </div>
  );
}

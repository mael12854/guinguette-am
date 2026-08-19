type LogoVariant = "primary" | "reversed" | "icon";

const TERRACOTTA = "oklch(0.48 0.14 38)";
const BOIS = "oklch(0.32 0.09 42)";
const TAGLINE_BOIS = "oklch(0.55 0.05 45)";
const LIGHT = "oklch(0.9 0.02 75)";
const LIGHT_WORDMARK = "oklch(0.96 0.01 75)";
const LIGHT_TAGLINE = "oklch(0.75 0.03 70)";
const VELUX = "oklch(0.85 0.12 85)";
const CREME = "oklch(0.95 0.025 68)";

export function Logo({
  variant = "primary",
  className = "",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  if (variant === "icon") {
    return (
      <Monogram
        size={64}
        borderWidth={2.5}
        ringColor={TERRACOTTA}
        background={BOIS}
        textColor={CREME}
        fontSize={24}
        className={className}
      />
    );
  }

  const isReversed = variant === "reversed";

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <Monogram
        size={120}
        borderWidth={3}
        ringColor={isReversed ? LIGHT : TERRACOTTA}
        background={BOIS}
        textColor={CREME}
        fontSize={44}
      />
      <div className="text-center">
        <div
          className="font-serif font-bold text-[26px] tracking-[0.02em]"
          style={{ color: isReversed ? LIGHT_WORDMARK : BOIS }}
        >
          GUINGUETTE A&amp;M
        </div>
        <div
          className="mt-1 text-[11px] uppercase tracking-[0.25em]"
          style={{ color: isReversed ? LIGHT_TAGLINE : TAGLINE_BOIS }}
        >
          Depuis 2026
        </div>
      </div>
    </div>
  );
}

function Monogram({
  size,
  borderWidth,
  ringColor,
  background,
  textColor,
  fontSize,
  className = "",
}: {
  size: number;
  borderWidth: number;
  ringColor: string;
  background: string;
  textColor: string;
  fontSize: number;
  className?: string;
}) {
  // sun — evokes the "jaune velux" accent and the room's verrière skylight
  const sunCx = size * 0.5;
  const sunCy = size * 0.24;
  const sunR = size * 0.055;
  const rayInner = size * 0.09;
  const rayOuter = size * 0.15;
  const rayAngles = [-60, -30, 0, 30, 60];

  // river — the guinguette sits on the riverbank
  const waveY = size * 0.78;
  const waveX0 = size * 0.24;
  const waveX1 = size * 0.5;
  const waveX2 = size * 0.76;
  const waveAmp = size * 0.035;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background,
        border: `${borderWidth}px solid ${ringColor}`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 left-0"
      >
        <circle cx={sunCx} cy={sunCy} r={sunR} fill={VELUX} />
        {rayAngles.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const dx = Math.sin(rad);
          const dy = -Math.cos(rad);
          return (
            <line
              key={deg}
              x1={sunCx + dx * rayInner}
              y1={sunCy + dy * rayInner}
              x2={sunCx + dx * rayOuter}
              y2={sunCy + dy * rayOuter}
              stroke={VELUX}
              strokeWidth={Math.max(1, size * 0.018)}
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={`M${waveX0},${waveY} Q${(waveX0 + waveX1) / 2},${waveY - waveAmp} ${waveX1},${waveY} Q${(waveX1 + waveX2) / 2},${waveY + waveAmp} ${waveX2},${waveY}`}
          stroke={textColor}
          strokeWidth={Math.max(1, size * 0.02)}
          fill="none"
          opacity={0.6}
          strokeLinecap="round"
        />
      </svg>

      <span
        className="font-serif font-semibold relative"
        style={{ color: textColor, fontSize }}
      >
        A&amp;M
      </span>
    </div>
  );
}

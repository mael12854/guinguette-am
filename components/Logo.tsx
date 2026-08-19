type LogoVariant = "primary" | "reversed" | "icon";

const TERRACOTTA = "oklch(0.48 0.14 38)";
const BOIS = "oklch(0.32 0.09 42)";
const TAGLINE_BOIS = "oklch(0.55 0.05 45)";
const LIGHT = "oklch(0.9 0.02 75)";
const LIGHT_WORDMARK = "oklch(0.96 0.01 75)";
const LIGHT_TAGLINE = "oklch(0.75 0.03 70)";
const VELUX = "oklch(0.85 0.12 85)";

export function Logo({
  variant = "primary",
  className = "",
}: {
  variant?: LogoVariant;
  className?: string;
}) {
  if (variant === "icon") {
    return <Monogram size={64} borderWidth={2.5} color={TERRACOTTA} fontSize={24} className={className} />;
  }

  const isReversed = variant === "reversed";

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <Monogram
        size={120}
        borderWidth={3}
        color={isReversed ? LIGHT : TERRACOTTA}
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
  color,
  fontSize,
  className = "",
}: {
  size: number;
  borderWidth: number;
  color: string;
  fontSize: number;
  className?: string;
}) {
  const bulbR = size * 0.045;
  const wireY = size * 0.34;
  const peakY = size * 0.16;
  const leftX = size * 0.22;
  const midLeftX = size * 0.4;
  const midRightX = size * 0.6;
  const rightX = size * 0.78;

  return (
    <div
      className={`relative flex items-end justify-center rounded-full shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid ${color}`,
        paddingBottom: size * 0.16,
      }}
    >
      {/* string of guinguette lights */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 left-0"
      >
        <path
          d={`M${leftX},${wireY} Q${size / 2},${peakY} ${rightX},${wireY}`}
          stroke={color}
          strokeWidth={Math.max(1, size * 0.012)}
          fill="none"
          opacity={0.5}
        />
        <circle cx={leftX} cy={wireY} r={bulbR} fill={VELUX} />
        <circle cx={midLeftX} cy={peakY + (wireY - peakY) * 0.18} r={bulbR} fill={VELUX} />
        <circle cx={midRightX} cy={peakY + (wireY - peakY) * 0.18} r={bulbR} fill={VELUX} />
        <circle cx={rightX} cy={wireY} r={bulbR} fill={VELUX} />
      </svg>

      <span
        className="font-serif font-semibold relative"
        style={{ color, fontSize }}
      >
        A&amp;M
      </span>
    </div>
  );
}

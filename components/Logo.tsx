type LogoVariant = "primary" | "reversed" | "icon";

const TERRACOTTA = "oklch(0.48 0.14 38)";
const BOIS = "oklch(0.32 0.09 42)";
const TAGLINE_BOIS = "oklch(0.55 0.05 45)";
const LIGHT = "oklch(0.9 0.02 75)";
const LIGHT_WORDMARK = "oklch(0.96 0.01 75)";
const LIGHT_TAGLINE = "oklch(0.75 0.03 70)";

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
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid ${color}`,
      }}
    >
      <span
        className="font-serif font-semibold"
        style={{ color, fontSize }}
      >
        A&amp;M
      </span>
    </div>
  );
}

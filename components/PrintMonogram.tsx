const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const CREME = "#F3EEE3";
const VELUX = "#E8B94A";

export function PrintMonogram({ size = 100 }: { size?: number }) {
  const s = size;
  const sunCx = s * 0.5;
  const sunCy = s * 0.24;
  const sunR = s * 0.055;
  const rayInner = s * 0.09;
  const rayOuter = s * 0.15;
  const rayAngles = [-60, -30, 0, 30, 60];
  const waveY = s * 0.78;
  const waveX0 = s * 0.24;
  const waveX1 = s * 0.5;
  const waveX2 = s * 0.76;
  const waveAmp = s * 0.035;

  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: BOIS,
        border: `2.5px solid ${TERRACOTTA}`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ position: "absolute", inset: 0 }}>
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
              strokeWidth={Math.max(1, s * 0.018)}
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={`M${waveX0},${waveY} Q${(waveX0 + waveX1) / 2},${waveY - waveAmp} ${waveX1},${waveY} Q${(waveX1 + waveX2) / 2},${waveY + waveAmp} ${waveX2},${waveY}`}
          stroke={CREME}
          strokeWidth={Math.max(1, s * 0.02)}
          fill="none"
          opacity={0.6}
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: s * 0.34,
          color: CREME,
        }}
      >
        A&amp;M
      </span>
    </div>
  );
}

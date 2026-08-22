import QRCode from "qrcode";

const SITE_URL = "https://guinguette-am.vercel.app";
const TARGET_URL = `${SITE_URL}/carte`;

const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const CREME = "#F3EEE3";
const VELUX = "#E8B94A";

async function getQrSvg() {
  const svg = await QRCode.toString(TARGET_URL, {
    type: "svg",
    margin: 0,
    color: { dark: BOIS, light: "#00000000" },
  });
  return svg;
}

function Monogram() {
  const s = 100;
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
          fontSize: 34,
          color: CREME,
        }}
      >
        A&amp;M
      </span>
    </div>
  );
}

function Panel({ qrSvg, upsideDown }: { qrSvg: string; upsideDown: boolean }) {
  return (
    <div
      style={{
        transform: upsideDown ? "rotate(180deg)" : undefined,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "28px 20px",
        background: CREME,
        color: BOIS,
        textAlign: "center",
      }}
    >
      <Monogram />
      <div>
        <div
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.02em",
          }}
        >
          GUINGUETTE A&amp;M
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: "var(--font-poppins), Arial, sans-serif",
            fontSize: 13,
            color: TERRACOTTA,
          }}
        >
          Commandez depuis votre table
        </div>
      </div>
      <div
        style={{ width: 130, height: 130 }}
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />
      <div
        style={{
          fontFamily: "var(--font-poppins), Arial, sans-serif",
          fontSize: 11,
          color: "#8A7A64",
        }}
      >
        Scannez pour voir la carte
      </div>
    </div>
  );
}

export default async function ChevaletPage() {
  const qrSvg = await getQrSvg();

  return (
    <div className="min-h-screen bg-[#DEDAD2] py-10 print:bg-white print:py-0 flex flex-col items-center gap-6 print:gap-0">
      <p className="text-sm text-noir/60 print:hidden max-w-sm text-center">
        Imprimez cette page (Ctrl/Cmd + P), découpez le long du cadre, puis pliez au
        milieu — le chevalet tient debout tout seul, lisible des deux côtés.
      </p>

      <div
        className="print:shadow-none"
        style={{
          width: "300px",
          border: "1px solid #C9C0B2",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ height: "200px" }}>
          <Panel qrSvg={qrSvg} upsideDown={true} />
        </div>
        <div
          style={{
            borderTop: `2px dashed ${TERRACOTTA}`,
            position: "relative",
          }}
        >
          <span
            className="print:hidden"
            style={{
              position: "absolute",
              left: "50%",
              top: -9,
              transform: "translateX(-50%)",
              background: CREME,
              fontSize: 10,
              color: TERRACOTTA,
              padding: "0 8px",
            }}
          >
            plier ici
          </span>
        </div>
        <div style={{ height: "200px" }}>
          <Panel qrSvg={qrSvg} upsideDown={false} />
        </div>
      </div>
    </div>
  );
}

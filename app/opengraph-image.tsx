import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const CREME = "#F3EEE3";
const VELUX = "#E8B94A";
const BLANC_CASSE = "#FCFBF9";

async function loadFraunces(text: string, italic: boolean, weight: 400 | 700) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@${italic ? 1 : 0},${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(cssUrl, {
      headers: {
        // legacy UA so Google serves woff/ttf instead of woff2, which satori can't parse
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
      },
    })
  ).text();

  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error("Could not find font URL");
  const fontResponse = await fetch(match[1]);
  return fontResponse.arrayBuffer();
}

export default async function OpengraphImage() {
  const [wordmarkFont, monogramFont] = await Promise.all([
    loadFraunces("GUINGUETTE A&M", false, 700),
    loadFraunces("A&M", true, 700),
  ]);

  const s = 220; // monogram size
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 72,
          background: BOIS,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: s,
            height: s,
            borderRadius: "50%",
            background: BOIS,
            border: `5px solid ${TERRACOTTA}`,
          }}
        >
          <svg
            width={s}
            height={s}
            viewBox={`0 0 ${s} ${s}`}
            style={{ position: "absolute", top: 0, left: 0 }}
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
              fontSize: 80,
              fontFamily: "Fraunces Italic",
              color: CREME,
              letterSpacing: -1,
              position: "relative",
            }}
          >
            A&amp;M
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 64,
              fontFamily: "Fraunces",
              fontWeight: 700,
              color: BLANC_CASSE,
              letterSpacing: 1,
            }}
          >
            GUINGUETTE A&amp;M
          </span>
          <span
            style={{
              marginTop: 18,
              fontSize: 26,
              fontFamily: "sans-serif",
              color: "#D8C9B4",
            }}
          >
            Une grande salle, deux amis, à Igny.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: wordmarkFont, style: "normal", weight: 700 },
        { name: "Fraunces Italic", data: monogramFont, style: "italic", weight: 700 },
      ],
    }
  );
}

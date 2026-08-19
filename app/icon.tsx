import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const BOIS = "#4A3324";
const TERRACOTTA = "#7A4B2A";
const CREME = "#F3EEE3";

async function loadFrauncesItalic(text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,700&text=${encodeURIComponent(text)}`;
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

export default async function Icon() {
  const fontData = await loadFrauncesItalic("A&M");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: BOIS,
        }}
      >
        <div
          style={{
            width: "88%",
            height: "88%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: `2px solid ${TERRACOTTA}`,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontFamily: "Fraunces",
              fontStyle: "italic",
              fontWeight: 700,
              color: CREME,
              letterSpacing: -1,
            }}
          >
            A&amp;M
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fontData, style: "italic", weight: 700 },
      ],
    }
  );
}

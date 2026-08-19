import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          background: "#4A3324",
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#F3EEE3",
            fontFamily: "Georgia, serif",
          }}
        >
          A&amp;M
        </span>
      </div>
    ),
    { ...size }
  );
}

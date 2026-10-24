import { ImageResponse } from "next/og";

export const alt =
  "Liang Xikun — Designer & Full-stack Developer · Form × Build";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only on purpose: the OG renderer ships without CJK glyphs.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background:
          "radial-gradient(circle at 85% 10%, rgba(197,111,77,0.35), transparent 45%), #0d161c",
        color: "#f2eee5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: 6,
          color: "#8ea0a9",
          textTransform: "uppercase",
        }}
      >
        <span>Form × Build</span>
        <span style={{ color: "#c56f4d" }}>Portfolio · 2026</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 132,
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: -6,
          }}
        >
          LIANG XIKUN
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 40,
            color: "#c56f4d",
          }}
        >
          Designer &amp; Full-stack Developer
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 24,
          color: "#8ea0a9",
        }}
      >
        <span>From visual direction to full-stack delivery.</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 8,
            background: "#b4432c",
            color: "#f6eee4",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          LX
        </span>
      </div>
    </div>,
    size,
  );
}

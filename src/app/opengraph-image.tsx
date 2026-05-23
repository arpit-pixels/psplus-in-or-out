import { ImageResponse } from "next/og";

export const alt = "PS Plus — Are you IN or OUT? Live subscriber sentiment vote.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          background:
            "radial-gradient(900px 600px at 20% 0%, rgba(0, 112, 209, 0.55), transparent 60%), radial-gradient(900px 700px at 90% 30%, rgba(0, 80, 180, 0.45), transparent 60%), linear-gradient(160deg, #001952 0%, #00041a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span>PlayStation Plus · Subscriber sentiment</span>
          <span style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28 }}>
            <span>△</span>
            <span>○</span>
            <span>×</span>
            <span>□</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            fontSize: 108,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            textTransform: "uppercase",
          }}
        >
          <span>Sony just hiked</span>
          <span>PS Plus.</span>
          <span style={{ display: "flex", gap: "0.3em" }}>
            <span>Are you</span>
            <span>IN</span>
            <span>or</span>
            <span>OUT?</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 40,
            fontSize: 22,
            color: "rgba(255,255,255,0.70)",
            letterSpacing: "0.04em",
          }}
        >
          <span>India just got a 30% jump · Other regions are next</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 26px",
              borderRadius: 999,
              background: "#ffffff",
              color: "#0070d1",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Vote live →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

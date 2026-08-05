import { ImageResponse } from "next/og";

export const alt = "DekaByte — ვებსაიტები და Android აპლიკაციები";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Twitter / X large image card (same visual as Open Graph). */
export default function TwitterImage() {
  const host = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dekabyte-zeta.vercel.app"
  ).replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(145deg, #0E1116 0%, #12151A 48%, #1a2744 100%)",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#F5F6F8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#12151A",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Db
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#F5F6F8",
              letterSpacing: "-0.03em",
            }}
          >
            DekaByte
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 650,
              color: "#FFFFFF",
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
              maxWidth: 920,
            }}
          >
            ვებსაიტები, Android აპლიკაციები და ციფრული სისტემები
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#9AA3B2",
              lineHeight: 1.4,
              maxWidth: 780,
            }}
          >
            იდეიდან გაშვებამდე — თანამედროვე პროდუქტები ბიზნესისთვის
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 22, color: "#60A5FA", fontWeight: 600 }}>
            {host}
          </div>
          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 4,
              background: "#1D4ED8",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}

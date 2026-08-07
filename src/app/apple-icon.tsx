import { ImageResponse } from "next/og";
import { getBrandMarkDataUri } from "@/lib/brand-mark-data-uri";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS / Add to Home Screen — same mark as favicon. */
export default async function AppleIcon() {
  const mark = await getBrandMarkDataUri();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#12151A",
        }}
      >
        <img src={mark} alt="" width={148} height={148} />
      </div>
    ),
    { ...size },
  );
}

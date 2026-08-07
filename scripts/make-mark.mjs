import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
const dest = process.argv[3] || "public/brand/mark.png";

if (!src) {
  console.error("Usage: node scripts/make-mark.mjs <src> [dest]");
  process.exit(1);
}

const img = sharp(src);
const { data, info } = await img.ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const threshold = 28; // near-black → transparent
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r <= threshold && g <= threshold && b <= threshold) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(dest);

console.log("wrote", dest, info.width, "x", info.height);

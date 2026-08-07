import sharp from "sharp";

const mark = "public/brand/mark.png";
const bg = { r: 18, g: 21, b: 26, alpha: 1 };

async function makeIcon(size, dest) {
  const inner = Math.round(size * 0.76);
  const resized = await sharp(mark)
    .resize(inner, inner, { fit: "contain" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(dest);
  console.log("wrote", dest);
}

await makeIcon(192, "public/icons/admin-192.png");
await makeIcon(512, "public/icons/admin-512.png");

import { readFile } from "node:fs/promises";
import path from "node:path";

/** Square DekaByte mark from public/brand/mark.png as data URI for OG/icon routes. */
export async function getBrandMarkDataUri(): Promise<string> {
  const file = path.join(process.cwd(), "public/brand/mark.png");
  const buf = await readFile(/* turbopackIgnore: true */ file);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

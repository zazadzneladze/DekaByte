import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const pdf = path.resolve("scripts/_generated_invoice.pdf");
const out = path.resolve("scripts/_gen_preview");

const tools = [
  ["magick", ["-density", "150", pdf, `${out}.png`]],
  ["pdftoppm", ["-png", "-r", "150", pdf, out]],
];

for (const [cmd, args] of tools) {
  try {
    execFileSync(cmd, args, { stdio: "inherit" });
    console.log("ok", cmd);
    break;
  } catch (e) {
    console.log("fail", cmd, e.message);
  }
}

console.log(
  fs
    .readdirSync("scripts")
    .filter((f) => f.includes("_gen") || f.includes("preview"))
    .join("\n"),
);

const fontsDir = "C:/Windows/Fonts";
const fonts = fs
  .readdirSync(fontsDir)
  .filter((n) =>
    /noto|georgian|sylfaen|dejavu|segoeui|arial/i.test(n),
  );
console.log("fonts sample:\n" + fonts.slice(0, 40).join("\n"));

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const pdfPath = path.resolve("scripts/_generated_invoice.pdf");
const outPath = path.resolve("scripts/_gen_preview.png");

const chromeCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

let executablePath;
for (const c of chromeCandidates) {
  if (fs.existsSync(c)) {
    executablePath = c;
    break;
  }
}
if (!executablePath) throw new Error("no chrome");

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 1270, deviceScaleFactor: 2 });
  const b64 = fs.readFileSync(pdfPath).toString("base64");
  await page.goto(`data:application/pdf;base64,${b64}`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: outPath, fullPage: true });
  console.log("wrote", outPath, fs.statSync(outPath).size);
} finally {
  await browser.close();
}

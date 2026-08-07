import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

// Compile-free: duplicate minimal call via dynamic import of built path won't work.
// Use tsx-compatible approach by spawning - instead inline font embedding into existing HTML builder via child.
import { register } from "node:module";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

async function main() {
  // Use pnpm exec tsx to load TS module
  const { buildInvoiceTemplateHtml } = await import(
    pathToFileURL(
      path.resolve("src/lib/invoice-template-html.ts"),
    ).href
  );

  const fontReg = fs
    .readFileSync("public/fonts/NotoSansGeorgian-Regular.ttf")
    .toString("base64");
  const fontBold = fs
    .readFileSync("public/fonts/NotoSansGeorgian-Bold.ttf")
    .toString("base64");
  const logo = fs
    .readFileSync("public/brand/invoice-mark.png")
    .toString("base64");

  const html = buildInvoiceTemplateHtml({
    invoiceNumber: "DB-2026-0002",
    issuedAt: new Date("2026-08-07"),
    dueDate: new Date("2026-08-07"),
    status: "sent",
    projectTitle: "GB-ტესტ პროექტი",
    paymentStage: "ავანსი",
    currency: "GEL",
    contractRef: "11",
    recipientName: "ტესტ კომპანია",
    recipientPersonalId: "245245245",
    recipientAddress: "ბათუმი",
    recipientContactPerson: "გიორგი გორგასალი",
    recipientPhone: "+9955757779797",
    recipientEmail: "gbgorgasali@gmail.com",
    lineItems: [
      { description: "GB-ტესტ პროექტი ავანსი", qty: 1, unitPrice: 5000 },
      { description: "დამატებითი ხაზი", qty: 1, unitPrice: 1500 },
    ],
    subtotal: 6500,
    discount: 0,
    gross: 6500,
    taxWithheld: 1300,
    net: 5200,
    logoSrc: `data:image/png;base64,${logo}`,
    fontRegularDataUri: `data:font/ttf;base64,${fontReg}`,
    fontBoldDataUri: `data:font/ttf;base64,${fontBold}`,
  });

  fs.writeFileSync("scripts/_invoice_preview.html", html);

  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const edge = "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe";
  const browser = await puppeteer.launch({
    executablePath: fs.existsSync(chrome) ? chrome : edge,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluateHandle("document.fonts.ready");
  await page.screenshot({
    path: "scripts/_invoice_html_preview.png",
    fullPage: true,
  });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "8mm", right: "8mm", bottom: "10mm", left: "8mm" },
  });
  fs.writeFileSync("scripts/_invoice_local.pdf", pdf);
  await browser.close();
  console.log("ok", {
    html: fs.statSync("scripts/_invoice_preview.html").size,
    png: fs.statSync("scripts/_invoice_html_preview.png").size,
    pdf: fs.statSync("scripts/_invoice_local.pdf").size,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

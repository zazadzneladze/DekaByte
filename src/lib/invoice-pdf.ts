import "server-only";

import fs from "node:fs";
import path from "node:path";
import {
  buildInvoiceTemplateHtml,
  type InvoiceTemplateData,
} from "@/lib/invoice-template-html";

export type InvoicePdfData = Omit<
  InvoiceTemplateData,
  | "logoSrc"
  | "fontRegularDataUri"
  | "fontBoldDataUri"
  | "supplierSignatureSrc"
  | "clientSignatureSrc"
> & {
  supplierSignatureUrl?: string | null;
  clientSignatureUrl?: string | null;
};

/** Remote Chromium pack for Vercel (chromium-min has no bundled bin/). */
const CHROMIUM_PACK_URL =
  process.env.CHROMIUM_REMOTE_EXEC_PATH ??
  "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar";

function readPublicAsset(relPath: string): Buffer | null {
  const file = path.join(process.cwd(), "public", ...relPath.split("/"));
  if (fs.existsSync(/*turbopackIgnore: true*/ file)) {
    return fs.readFileSync(/*turbopackIgnore: true*/ file);
  }
  return null;
}

async function imageToDataUri(src: string | null | undefined): Promise<string> {
  if (!src) return "";
  if (src.startsWith("data:")) return src;

  try {
    const res = await fetch(src);
    if (!res.ok) return src;
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") || "image/png";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return src;
  }
}

function invoiceAssets() {
  const logoBuf =
    readPublicAsset("brand/invoice-mark.png") ??
    readPublicAsset("brand/logo.png") ??
    readPublicAsset("brand/mark.png");
  const fontRegular = readPublicAsset("fonts/NotoSansGeorgian-Regular.ttf");
  const fontBold = readPublicAsset("fonts/NotoSansGeorgian-Bold.ttf");

  return {
    logoSrc: logoBuf
      ? `data:image/png;base64,${logoBuf.toString("base64")}`
      : "",
    fontRegularDataUri: fontRegular
      ? `data:font/ttf;base64,${fontRegular.toString("base64")}`
      : undefined,
    fontBoldDataUri: fontBold
      ? `data:font/ttf;base64,${fontBold.toString("base64")}`
      : undefined,
  };
}

export async function buildInvoiceHtml(data: InvoicePdfData): Promise<string> {
  const assets = invoiceAssets();
  const [supplierSignatureSrc, clientSignatureSrc] = await Promise.all([
    imageToDataUri(data.supplierSignatureUrl),
    imageToDataUri(data.clientSignatureUrl),
  ]);

  const { supplierSignatureUrl, clientSignatureUrl, ...rest } = data;

  return buildInvoiceTemplateHtml({
    ...rest,
    ...assets,
    logoSrc: assets.logoSrc || "/brand/invoice-mark.png",
    supplierSignatureSrc: supplierSignatureSrc || undefined,
    clientSignatureSrc: clientSignatureSrc || undefined,
  });
}

export async function renderInvoicePdf(
  data: InvoicePdfData,
): Promise<Buffer> {
  const html = await buildInvoiceHtml(data);
  const isVercel = Boolean(process.env.VERCEL);

  const puppeteer = await import("puppeteer-core");

  let browser;
  if (isVercel) {
    const chromium = await import("@sparticuz/chromium-min");
    const executablePath = await chromium.default.executablePath(
      CHROMIUM_PACK_URL,
    );
    browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath,
      headless: true,
    });
  } else {
    const candidates = [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      process.env.CHROME_PATH,
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    ].filter(Boolean) as string[];

    let executablePath: string | undefined;
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        executablePath = candidate;
        break;
      }
    }
    if (!executablePath) {
      throw new Error(
        "PDF გენერაციისთვის საჭიროა Chrome/Edge, ან დააყენე PUPPETEER_EXECUTABLE_PATH",
      );
    }
    browser = await puppeteer.default.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "8mm", right: "8mm", bottom: "10mm", left: "8mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

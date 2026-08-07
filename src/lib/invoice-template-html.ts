/**
 * HTML twin of templates/invoice-ge.docx (DekaByte_Invoice_Template_GE).
 * Used for PDF generation and admin live preview.
 */

import {
  INVOICE_SUPPLIER,
  formatMoney,
  invoiceStatusLabelKa,
  type InvoiceBankProfile,
  type InvoiceCurrency,
  type InvoiceLineItem,
} from "@/config/invoice";
import { formatAmountWithWords } from "@/lib/georgian-amount";
import {
  clampSignatureTransform,
  signatureTransformCss,
  signatureTransformStyle,
  type InvoiceSignatureTransform,
} from "@/lib/invoice-signature";

export type InvoiceTemplateData = {
  invoiceNumber: string;
  issuedAt: Date;
  dueDate: Date | null;
  status: "draft" | "sent" | "paid";
  projectTitle: string;
  paymentStage: string;
  currency: InvoiceCurrency;
  contractRef: string;
  recipientName: string;
  recipientPersonalId: string;
  recipientAddress: string;
  recipientContactPerson: string;
  recipientIsCompany: boolean;
  recipientPhone: string;
  recipientEmail: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  discountPercent: number;
  gross: number;
  taxWithheld: number;
  net: number;
  withholdIncomeTax: boolean;
  logoSrc?: string;
  supplierSignatureSrc?: string;
  clientSignatureSrc?: string;
  supplierSignatureTransform?: InvoiceSignatureTransform;
  clientSignatureTransform?: InvoiceSignatureTransform;
  bankProfile: InvoiceBankProfile;
  /** data:font/ttf;base64,... — required for PDF so Georgian glyphs embed */
  fontRegularDataUri?: string;
  fontBoldDataUri?: string;
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateKa(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ka-GE", { dateStyle: "medium" }).format(date);
}

function phoneEmailLine(phone: string, email: string) {
  return [phone, email].filter(Boolean).join(" / ") || "—";
}

function metaCell(label: string, value: string) {
  return `<td class="meta-cell">
    <div class="meta-label">${esc(label)}</div>
    <div class="meta-value">${value}</div>
  </td>`;
}

export function buildInvoiceTemplateHtml(data: InvoiceTemplateData): string {
  const supplier = INVOICE_SUPPLIER;
  const bank = data.bankProfile;
  const logo = data.logoSrc || "/brand/invoice-mark.png";
  const amountWords = formatAmountWithWords(data.net, data.currency);
  const purpose = `Invoice ${data.invoiceNumber} - ${data.projectTitle}`;
  const statusLabel = invoiceStatusLabelKa(data.status);
  const discountLabel =
    data.discountPercent > 0
      ? `ფასდაკლება (${data.discountPercent}%)`
      : "ფასდაკლება";

  const contactPersonLine =
    data.recipientIsCompany && data.recipientContactPerson.trim()
      ? `<div class="party-line"><span class="lbl">საკონტაქტო პირი:</span> ${esc(data.recipientContactPerson)}</div>`
      : "";

  function signBlock(
    src: string | undefined,
    caption: string,
    transform?: InvoiceSignatureTransform,
  ) {
    const style = signatureTransformCss(clampSignatureTransform(transform));
    const img = src
      ? `<div class="sign-img-wrap" style="${style}"><img src="${esc(src)}" alt="" class="sign-img" /></div>`
      : "";
    return `<div class="sign-box">
      <div class="sign-area">${img}</div>
      <div class="sign-caption">${esc(caption)}</div>
    </div>`;
  }

  const fontFace =
    data.fontRegularDataUri && data.fontBoldDataUri
      ? `
@font-face {
  font-family: "Noto Sans Georgian";
  src: url("${data.fontRegularDataUri}") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Noto Sans Georgian";
  src: url("${data.fontBoldDataUri}") format("truetype");
  font-weight: 700;
  font-style: normal;
}`
      : `
@font-face {
  font-family: "Noto Sans Georgian";
  src: url("/fonts/NotoSansGeorgian-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Noto Sans Georgian";
  src: url("/fonts/NotoSansGeorgian-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}`;

  const items =
    data.lineItems.length > 0
      ? data.lineItems
      : [{ description: "—", qty: 0, unitPrice: 0 }];

  const lineRows = items
    .map((item, i) => {
      const lineTotal = Math.round(item.qty * item.unitPrice);
      return `<tr>
        <td class="c-idx">${i + 1}</td>
        <td>${esc(item.description || "—")}</td>
        <td class="num">${item.qty || "—"}</td>
        <td class="num">${item.qty ? formatMoney(item.unitPrice, data.currency) : "—"}</td>
        <td class="num">${item.qty ? formatMoney(lineTotal, data.currency) : "—"}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="utf-8" />
<title>ინვოისი ${esc(data.invoiceNumber)}</title>
<style>
  ${fontFace}
  @page { size: A4; margin: 12mm 12mm 14mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    color: #1a2330;
    font-family: "Noto Sans Georgian", "Segoe UI", Arial, sans-serif;
    font-size: 10.5px;
    line-height: 1.45;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet { width: 100%; max-width: 186mm; margin: 0 auto; padding: 2mm; }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 2.5px solid #2D9CDB;
  }
  .header-logo {
    flex: 0 1 auto;
    max-width: 220px;
    height: 52px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .header-logo img {
    max-width: 220px;
    max-height: 52px;
    width: auto;
    height: auto;
    object-fit: contain;
    object-position: left center;
    display: block;
  }
  .header-title { text-align: right; }
  .header-title .en {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.18em;
    color: #1a2330;
    line-height: 1;
  }
  .header-title .ka {
    margin: 6px 0 0;
    font-size: 12px;
    font-weight: 700;
    color: #2D9CDB;
    letter-spacing: 0.02em;
  }
  table.meta { width: 100%; border-collapse: collapse; margin: 0 0 12px; table-layout: fixed; }
  .meta-cell {
    width: 25%;
    vertical-align: top;
    border: 1px solid #cfd8df;
    padding: 7px 8px;
    background: #f5f9fc;
  }
  .meta-label {
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #61727D;
    margin-bottom: 3px;
    font-weight: 700;
  }
  .meta-value {
    font-weight: 700;
    font-size: 11px;
    color: #1a2330;
    word-break: break-word;
  }
  table.parties { width: 100%; border-collapse: collapse; margin-bottom: 14px; table-layout: fixed; }
  table.parties > tbody > tr > td {
    width: 50%;
    vertical-align: top;
    border: 1px solid #cfd8df;
    padding: 10px 12px;
  }
  .party-h {
    margin: 0 0 8px;
    font-size: 10px;
    font-weight: 700;
    color: #2D9CDB;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .party-name { font-weight: 700; font-size: 12px; margin-bottom: 6px; }
  .party-line { color: #2c3642; margin: 3px 0; }
  .party-line .lbl { color: #61727D; }
  table.lines { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  table.lines th {
    background: #2D9CDB;
    color: #fff;
    text-align: left;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 8px;
    border: 1px solid #2490c9;
  }
  table.lines th.num, table.lines td.num { text-align: right; white-space: nowrap; }
  table.lines td {
    border: 1px solid #cfd8df;
    padding: 7px 8px;
    vertical-align: top;
  }
  table.lines td.c-idx { width: 28px; text-align: center; color: #61727D; }
  .split { width: 100%; border-collapse: collapse; margin-bottom: 12px; table-layout: fixed; }
  .split > tbody > tr > td { vertical-align: top; padding: 0; }
  .split .bank-wrap { width: 56%; padding-right: 10px; }
  .split .totals-wrap { width: 44%; }
  table.bank, table.totals { width: 100%; border-collapse: collapse; }
  table.bank th {
    text-align: left;
    background: #eef6fb;
    color: #2D9CDB;
    font-size: 10px;
    padding: 7px 8px;
    border: 1px solid #cfd8df;
  }
  table.bank td { border: 1px solid #cfd8df; padding: 5px 8px; }
  table.bank td.k { width: 36%; color: #61727D; background: #fafbfc; font-weight: 700; }
  table.totals td { border: 1px solid #cfd8df; padding: 6px 8px; }
  table.totals td.k { color: #2c3642; }
  table.totals td.v { text-align: right; white-space: nowrap; font-weight: 700; }
  table.totals tr.net td {
    background: #e8f5fc;
    color: #1a2330;
    font-weight: 800;
    border-color: #2D9CDB;
  }
  .words {
    margin: 10px 0 8px;
    padding: 8px 10px;
    border-left: 3px solid #2D9CDB;
    background: #f5f9fc;
    font-size: 11px;
  }
  .terms {
    margin-top: 10px;
    font-size: 9px;
    color: #61727D;
  }
  .terms strong {
    display: block;
    color: #1a2330;
    margin-bottom: 4px;
    font-size: 10px;
  }
  .terms ul { margin: 0; padding-left: 16px; }
  .terms li { margin-bottom: 3px; }
  .sign {
    margin-top: 10px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 24px;
  }
  .sign-box {
    flex: 1;
    max-width: 48%;
    display: flex;
    flex-direction: column;
  }
  .sign-area {
    position: relative;
    height: 28px;
    flex-shrink: 0;
    overflow: visible;
  }
  .sign-img-wrap {
    position: absolute;
    left: 0;
    bottom: 0;
    max-width: 100%;
  }
  .sign-img {
    display: block;
    max-height: 68px;
    max-width: 100%;
    object-fit: contain;
    object-position: left bottom;
  }
  .sign-caption {
    flex-shrink: 0;
    margin-top: 6px;
    border-top: 1px solid #9aa7b2;
    padding-top: 6px;
    font-size: 9px;
    color: #61727D;
    min-height: 32px;
  }
  .doc-footer {
    margin-top: 18px;
    padding-top: 8px;
    border-top: 1px solid #cfd8df;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 8px;
    color: #61727D;
    font-weight: 700;
  }
  .doc-footer .c { color: #2D9CDB; }
  .doc-footer .r { font-weight: 400; }
</style>
</head>
<body>
<div class="sheet">
  <div class="header">
    <div class="header-logo">
      <img src="${esc(logo)}" alt="DekaByte" />
    </div>
    <div class="header-title">
      <p class="en">INVOICE</p>
      <p class="ka">მომსახურების ინვოისი</p>
    </div>
  </div>

  <table class="meta">
    <tr>
      ${metaCell("ინვოისის №", `<strong>${esc(data.invoiceNumber)}</strong>`)}
      ${metaCell("გამოწერის თარიღი", esc(formatDateKa(data.issuedAt)))}
      ${metaCell("გადახდის ვადა", esc(formatDateKa(data.dueDate)))}
      ${metaCell("სტატუსი", esc(statusLabel))}
    </tr>
    <tr>
      ${metaCell("პროექტი", esc(data.projectTitle || "—"))}
      ${metaCell("გადახდის ეტაპი", esc(data.paymentStage || "—"))}
      ${metaCell("ვალუტა", esc(data.currency))}
      ${metaCell("ხელშეკრულება / შეკვეთა", esc(data.contractRef || "—"))}
    </tr>
  </table>

  <table class="parties">
    <tr>
      <td>
        <div class="party-h">მომსახურების მიმწოდებელი</div>
        <div class="party-name">${esc(supplier.nameKa)} / ${esc(supplier.nameEn)}</div>
        <div class="party-line"><span class="lbl">პირადი ნომერი:</span> ${esc(supplier.personalId)}</div>
        <div class="party-line"><span class="lbl">მისამართი:</span> ${esc(supplier.address)}</div>
        <div class="party-line"><span class="lbl">ტელეფონი:</span> ${esc(supplier.phone)}</div>
        <div class="party-line"><span class="lbl">მომსახურება:</span> ${esc(supplier.serviceLine)}</div>
      </td>
      <td>
        <div class="party-h">დამკვეთი / კლიენტი</div>
        <div class="party-name">${esc(data.recipientName || "—")}</div>
        <div class="party-line"><span class="lbl">საიდენტიფიკაციო / პირადი №:</span> ${esc(data.recipientPersonalId || "—")}</div>
        <div class="party-line"><span class="lbl">მისამართი:</span> ${esc(data.recipientAddress || "—")}</div>
        ${contactPersonLine}
        <div class="party-line"><span class="lbl">ტელეფონი / ელფოსტა:</span> ${esc(phoneEmailLine(data.recipientPhone, data.recipientEmail))}</div>
      </td>
    </tr>
  </table>

  <table class="lines">
    <thead>
      <tr>
        <th style="width:28px">#</th>
        <th>მომსახურების აღწერა</th>
        <th class="num" style="width:56px">რაოდ.</th>
        <th class="num" style="width:100px">ერთეულის ფასი</th>
        <th class="num" style="width:100px">თანხა</th>
      </tr>
    </thead>
    <tbody>${lineRows}</tbody>
  </table>

  <table class="split">
    <tr>
      <td class="bank-wrap">
        <table class="bank">
          <tr><th colspan="2">საბანკო რეკვიზიტები</th></tr>
          <tr><td class="k">მიმღები</td><td>${esc(supplier.nameKa)} / ${esc(supplier.nameEn)}</td></tr>
          <tr><td class="k">ბანკი</td><td>${esc(bank.bankName)}</td></tr>
          <tr><td class="k">SWIFT / BIC</td><td>${esc(bank.swift)}</td></tr>
          <tr><td class="k">ანგარიშის ნომერი</td><td>${esc(bank.accountNumber || "—")}</td></tr>
          <tr><td class="k">IBAN (GEL)</td><td>${esc(bank.ibanGel || "—")}</td></tr>
          <tr><td class="k">დანიშნულება</td><td>${esc(purpose)}</td></tr>
        </table>
      </td>
      <td class="totals-wrap">
        <table class="totals">
          <tr><td class="k">ქვეჯამი</td><td class="v">${formatMoney(data.subtotal, data.currency)}</td></tr>
          <tr><td class="k">${esc(discountLabel)}</td><td class="v">${formatMoney(data.discount, data.currency)}</td></tr>
          <tr><td class="k">ღირებულება (Gross)</td><td class="v">${formatMoney(data.gross, data.currency)}</td></tr>
          ${
            data.withholdIncomeTax
              ? `<tr><td class="k">საშემოსავლო 20%*</td><td class="v">${formatMoney(data.taxWithheld, data.currency)}</td></tr>`
              : ""
          }
          <tr><td class="k">დღგ</td><td class="v">არ ერიცხება</td></tr>
          <tr class="net"><td class="k">${data.withholdIncomeTax ? "ჩასარიცხი თანხა (Net)" : "ჩასარიცხი თანხა"}</td><td class="v">${formatMoney(data.net, data.currency)}</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <div class="words"><strong>თანხა სიტყვიერად:</strong> ${esc(amountWords)}</div>

  <div class="terms">
    <strong>გადახდისა და სამართლებრივი პირობები</strong>
    <ul>
      <li>გადახდის დანიშნულებაში მიუთითეთ ინვოისის ნომერი და პროექტის დასახელება;</li>
      <li>საგადასახადო ვალდებულებები სრულდება მოქმედი კანონმდებლობის შესაბამისად:</li>
      <li>ინვოისი წარმოადგენს მომსახურების საფასურის გადახდის მოთხოვნას და არ არის დღგ-ის საგადასახადო ანგარიშ-ფაქტურა.</li>
      <li>ვებგვერდის კოდი, არქიტექტურა და ტექნიკური რესურსები რჩება DekaByte-ის საკუთრებად. მათი სრული გადაცემა შესაძლებელია მხოლოდ ცალკე შეთანხმებითა და დამატებითი საფასურით.</li>
      <li>დამკვეთს ეძლევა ვებგვერდით სარგებლობის უფლება შეთანხმებული პირობების ფარგლებში.</li>
      <li>ჰოსტინგი და ტექნიკური მომსახურება წარმოადგენს ცალკე პერიოდულ მომსახურებას და მისი საფასური გადაიხდება DekaByte-სთან შეთანხმებული პირობებით.</li>
      <li>დომენის, API-ების, ლიცენზიებისა და სხვა მესამე მხარის სერვისების ხარჯები ცალკეა, თუ სხვა რამ არ არის შეთანხმებული.</li>
    </ul>
  </div>

  <div class="sign">
    ${signBlock(data.supplierSignatureSrc, "ხელმოწერა / Signature — მიმწოდებელი", data.supplierSignatureTransform)}
    ${signBlock(data.clientSignatureSrc, "ხელმოწერა / Signature — დამკვეთი", data.clientSignatureTransform)}
  </div>

  <div class="doc-footer">
    <span>DekaByte • Digital Product Studio</span>
    <span class="c">dekabyte.ge</span>
    <span class="r">ელექტრონულად გენერირებული ინვოისი · 2026</span>
  </div>
</div>
</body>
</html>`;
}

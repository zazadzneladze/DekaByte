/**
 * Shared invoice signature positioning helpers.
 */
import type { CSSProperties } from "react";

export type InvoiceSignatureTransform = {
  offsetX: number;
  offsetY: number;
  rotate: number;
};

export const DEFAULT_INVOICE_SIGNATURE_TRANSFORM: InvoiceSignatureTransform = {
  offsetX: 0,
  offsetY: 8,
  rotate: 0,
};

/** Match invoice-template-html.ts sign block metrics. */
export const INVOICE_SIGNATURE_LAYOUT = {
  areaHeightPx: 72,
  imageMaxHeightPx: 68,
  captionMarginTopPx: 6,
  captionPaddingTopPx: 20,
  lineColor: "#9aa7b2",
} as const;

const LIMITS = {
  offsetX: { min: -80, max: 80 },
  offsetY: { min: -40, max: 48 },
  rotate: { min: -45, max: 45 },
} as const;

export function clampSignatureTransform(
  raw: Partial<InvoiceSignatureTransform> | null | undefined,
): InvoiceSignatureTransform {
  const base = DEFAULT_INVOICE_SIGNATURE_TRANSFORM;
  if (!raw) return base;
  return {
    offsetX: clamp(raw.offsetX ?? base.offsetX, LIMITS.offsetX.min, LIMITS.offsetX.max),
    offsetY: clamp(raw.offsetY ?? base.offsetY, LIMITS.offsetY.min, LIMITS.offsetY.max),
    rotate: clamp(raw.rotate ?? base.rotate, LIMITS.rotate.min, LIMITS.rotate.max),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function signatureTransformStyle(
  transform: InvoiceSignatureTransform,
): CSSProperties {
  const t = clampSignatureTransform(transform);
  return {
    transform: `translate(${t.offsetX}px, ${t.offsetY}px) rotate(${t.rotate}deg)`,
    transformOrigin: "left bottom",
  };
}

export function signatureTransformCss(
  transform: InvoiceSignatureTransform,
): string {
  const t = clampSignatureTransform(transform);
  return `transform: translate(${t.offsetX}px, ${t.offsetY}px) rotate(${t.rotate}deg); transform-origin: left bottom;`;
}

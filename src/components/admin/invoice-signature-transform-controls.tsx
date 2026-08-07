"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INVOICE_SIGNATURE_LAYOUT,
  clampSignatureTransform,
  signatureTransformStyle,
  type InvoiceSignatureTransform,
} from "@/lib/invoice-signature";

type Props = {
  imageUrl: string;
  transform: InvoiceSignatureTransform;
  onChange?: (next: InvoiceSignatureTransform) => void;
  compact?: boolean;
  readOnly?: boolean;
  captionPreview?: string;
};

function SliderField({
  id,
  label,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <div className="grid grid-cols-[1fr_3.5rem] items-center gap-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <Input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) =>
            onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))
          }
          className="h-8 px-1 text-center text-xs tabular-nums"
        />
      </div>
    </div>
  );
}

export function InvoiceSignatureTransformControls({
  imageUrl,
  transform,
  onChange,
  compact = false,
  readOnly = false,
  captionPreview = "ხელმოწერა / Signature — მიმწოდებელი",
}: Props) {
  const t = clampSignatureTransform(transform);
  const layout = INVOICE_SIGNATURE_LAYOUT;

  function patch(partial: Partial<InvoiceSignatureTransform>) {
    onChange?.(clampSignatureTransform({ ...t, ...partial }));
  }

  return (
    <div className={compact ? "flex flex-col gap-2" : "flex flex-col gap-3"}>
      <div className="rounded-lg border border-border bg-white p-3">
        <div
          className="relative overflow-visible"
          style={{ height: layout.areaHeightPx }}
        >
          <div
            className="absolute bottom-0 left-0 max-w-full"
            style={signatureTransformStyle(t)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imageUrl}
              src={imageUrl}
              alt=""
              className="block max-w-full object-contain object-left-bottom"
              style={{ maxHeight: layout.imageMaxHeightPx }}
            />
          </div>
        </div>
        <div
          className="text-[9px] leading-snug text-[#61727D]"
          style={{
            marginTop: layout.captionMarginTopPx,
            borderTop: `1px solid ${layout.lineColor}`,
            paddingTop: layout.captionPaddingTopPx,
            minHeight: 32,
          }}
        >
          {captionPreview}
        </div>
      </div>

      {readOnly ? null : (
        <div className="grid gap-2 sm:grid-cols-2">
          <SliderField
            id="sig-x"
            label="მარცხნივ ← / მარჯვნივ →"
            min={-80}
            max={80}
            value={t.offsetX}
            onChange={(offsetX) => patch({ offsetX })}
          />
          <SliderField
            id="sig-y"
            label="ზემოთ ↑ / ქვემოთ ↓"
            min={-40}
            max={48}
            value={t.offsetY}
            onChange={(offsetY) => patch({ offsetY })}
          />
          <SliderField
            id="sig-r"
            label="მობრუნება (°)"
            min={-45}
            max={45}
            value={t.rotate}
            onChange={(rotate) => patch({ rotate })}
          />
        </div>
      )}
    </div>
  );
}

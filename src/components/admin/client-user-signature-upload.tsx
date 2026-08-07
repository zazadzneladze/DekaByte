"use client";

import { SignatureUploadPanel } from "@/components/shared/signature-upload-panel";
import type { InvoiceSignatureTransform } from "@/lib/invoice-signature";

type Props = {
  projectId: string;
  clientUserId: string | null;
  clientEmail?: string;
  label: string;
  initialTransform: InvoiceSignatureTransform;
  value: string | null;
  onChange: (url: string | null) => void;
  transform: InvoiceSignatureTransform;
  onTransformChange: (next: InvoiceSignatureTransform) => void;
  className?: string;
};

export function ClientUserSignatureUpload({
  projectId,
  clientUserId,
  clientEmail,
  label,
  initialTransform,
  value,
  onChange,
  transform,
  onTransformChange,
  className,
}: Props) {
  const emailHint = clientEmail?.trim();
  return (
    <SignatureUploadPanel
      mode="admin"
      projectId={projectId}
      clientUserId={clientUserId}
      label={label}
      description={
        emailHint
          ? `${emailHint} · კლიენტის პროფილში ინახება — მხოლოდ ამ კლიენტის ინვოისებზე`
          : "კლიენტის პროფილში ინახება — ყველა პროექტის ინვოისზე გამოიყენება"
      }
      initialTransform={initialTransform}
      value={value}
      onChange={onChange}
      transform={transform}
      onTransformChange={onTransformChange}
      className={className}
    />
  );
}

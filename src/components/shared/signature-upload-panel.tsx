"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import {
  ChevronDown,
  Eraser,
  ImagePlus,
  Loader2,
  Move,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  clearClientUserSignature,
  ensureClientUserForProject,
  updateClientUserSignature,
  updateClientUserSignatureTransform,
} from "@/actions/clients";
import {
  clearClientSignature,
  updateClientSignature,
  updateClientSignatureTransform,
} from "@/actions/portal";
import { InvoiceSignatureTransformControls } from "@/components/admin/invoice-signature-transform-controls";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
  canvasToObjectUrl,
  processSignatureImage,
} from "@/lib/signature-background";
import {
  DEFAULT_INVOICE_SIGNATURE_TRANSFORM,
  clampSignatureTransform,
  type InvoiceSignatureTransform,
} from "@/lib/invoice-signature";
import { clientSignatureBlobPath } from "@/lib/blob";
import { cn } from "@/lib/utils";

type Props = {
  mode: "admin" | "portal";
  clientUserId: string | null;
  projectId?: string;
  label: string;
  description?: string;
  initialTransform: InvoiceSignatureTransform;
  value: string | null;
  onChange: (url: string | null) => void;
  transform: InvoiceSignatureTransform;
  onTransformChange: (next: InvoiceSignatureTransform) => void;
  className?: string;
  showPositionControls?: boolean;
};

export function SignatureUploadPanel({
  mode,
  clientUserId: initialClientUserId,
  projectId,
  label,
  description,
  initialTransform,
  value,
  onChange,
  transform,
  onTransformChange,
  className,
  showPositionControls = true,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [clientUserId, setClientUserId] = useState(initialClientUserId);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [positionOpen, setPositionOpen] = useState(false);
  const [threshold, setThreshold] = useState(238);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [bgRemoved, setBgRemoved] = useState(false);

  useEffect(() => {
    return () => {
      if (originalPreview) URL.revokeObjectURL(originalPreview);
      if (processedPreview) URL.revokeObjectURL(processedPreview);
    };
  }, [originalPreview, processedPreview]);

  function resetPending() {
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (processedPreview) URL.revokeObjectURL(processedPreview);
    setPendingFile(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setProcessedBlob(null);
    setBgRemoved(false);
  }

  useEffect(() => {
    setClientUserId(initialClientUserId);
    resetPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when switching client
  }, [initialClientUserId]);

  async function resolveClientUserId(): Promise<string | null> {
    if (mode === "portal") {
      return clientUserId;
    }
    if (clientUserId) return clientUserId;
    if (!projectId) {
      toast.error("პროექტი არ არის მითითებული");
      return null;
    }
    const result = await ensureClientUserForProject(projectId);
    if (!result.ok) {
      toast.error(result.error);
      return null;
    }
    setClientUserId(result.data.clientUserId);
    return result.data.clientUserId;
  }

  function handlePick(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("მხოლოდ სურათი (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("სურათი ძალიან დიდია (მაქს. 8MB)");
      return;
    }
    resetPending();
    setPendingFile(file);
    setOriginalPreview(URL.createObjectURL(file));
  }

  async function removeBackground() {
    if (!pendingFile) return;
    setProcessing(true);
    try {
      if (processedPreview) URL.revokeObjectURL(processedPreview);
      const { canvas, blob } = await processSignatureImage(pendingFile, {
        threshold,
      });
      const url = await canvasToObjectUrl(canvas);
      setProcessedPreview(url);
      setProcessedBlob(blob);
      setBgRemoved(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "დამუშავება ვერ მოხერხდა");
    } finally {
      setProcessing(false);
    }
  }

  function undoBackground() {
    if (processedPreview) URL.revokeObjectURL(processedPreview);
    setProcessedPreview(null);
    setProcessedBlob(null);
    setBgRemoved(false);
  }

  async function uploadSignature() {
    const userId = await resolveClientUserId();
    if (!userId) return;

    const fileToUpload = processedBlob
      ? new File([processedBlob], "signature.png", { type: "image/png" })
      : pendingFile;

    if (!fileToUpload) {
      toast.error("ჯერ აირჩიეთ სურათი");
      return;
    }

    setUploading(true);
    try {
      const ext = processedBlob
        ? "png"
        : fileToUpload.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") ||
          "png";
      const blobPath = clientSignatureBlobPath(userId, ext);
      const blob = await upload(blobPath, fileToUpload, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({
          purpose: "client-signature",
          clientUserId: userId,
        }),
        contentType: processedBlob ? "image/png" : fileToUpload.type,
      });

      const nextTransform =
        value === null
          ? DEFAULT_INVOICE_SIGNATURE_TRANSFORM
          : clampSignatureTransform(transform);

      const result =
        mode === "portal"
          ? await updateClientSignature({
              url: blob.url,
              pathname: blob.pathname,
              transform: nextTransform,
            })
          : await updateClientUserSignature({
              clientUserId: userId,
              projectId: projectId!,
              url: blob.url,
              pathname: blob.pathname,
              transform: nextTransform,
            });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      onChange(blob.url);
      onTransformChange(nextTransform);
      setPositionOpen(true);
      resetPending();
      toast.success(
        mode === "portal"
          ? "ხელმოწერა შენახულია"
          : "ხელმოწერა შენახულია კლიენტის პროფილში",
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function saveTransform() {
    startTransition(async () => {
      const userId = await resolveClientUserId();
      if (!userId) return;

      const payload = { transform: clampSignatureTransform(transform) };
      const result =
        mode === "portal"
          ? await updateClientSignatureTransform(payload)
          : await updateClientUserSignatureTransform({
              clientUserId: userId,
              projectId: projectId!,
              ...payload,
            });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("პოზიცია შენახულია");
      router.refresh();
    });
  }

  function clear() {
    startTransition(async () => {
      const userId = await resolveClientUserId();
      if (!userId) return;

      const result =
        mode === "portal"
          ? await clearClientSignature()
          : await clearClientUserSignature({
              clientUserId: userId,
              projectId: projectId!,
            });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      onChange(null);
      onTransformChange(DEFAULT_INVOICE_SIGNATURE_TRANSFORM);
      setPositionOpen(false);
      resetPending();
      toast.success("ხელმოწერა წაიშალა");
      router.refresh();
    });
  }

  const transformDirty =
    value !== null &&
    JSON.stringify(clampSignatureTransform(transform)) !==
      JSON.stringify(clampSignatureTransform(initialTransform));

  const previewUrl = processedPreview ?? originalPreview ?? value;
  const hasPending = Boolean(pendingFile);

  const positionControls =
    value && showPositionControls ? (
      <div className="space-y-3">
        <InvoiceSignatureTransformControls
          imageUrl={value}
          transform={clampSignatureTransform(transform)}
          onChange={onTransformChange}
          compact
        />
        {transformDirty ? (
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={saveTransform}
          >
            {pending ? "ინახება…" : "პოზიციის შენახვა"}
          </Button>
        ) : null}
      </div>
    ) : null;

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border border-border/70 bg-card p-3",
        className,
      )}
    >
      <div>
        <Label>{label}</Label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePick(file);
        }}
      />

      {previewUrl ? (
        <div className="overflow-hidden rounded-lg border border-border/70 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%,#e5e7eb)] bg-size-[12px_12px] bg-position-[0_0,6px_6px] p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={previewUrl}
            src={previewUrl}
            alt="ხელმოწერის preview"
            className="mx-auto max-h-32 w-full object-contain"
          />
        </div>
      ) : null}

      {hasPending ? (
        <div className="space-y-2 rounded-lg border border-dashed border-border/80 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            თეთრ ფურცელზე გადაღებული ფოტო — ღილაკით ფონი გახდება გამჭვირვალე.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`sig-threshold-${mode}`} className="text-xs">
              მგრძნობიარობა ({threshold})
            </Label>
            <input
              id={`sig-threshold-${mode}`}
              type="range"
              min={220}
              max={250}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="h-2 w-full accent-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {!bgRemoved ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={processing || uploading}
                onClick={() => void removeBackground()}
              >
                {processing ? (
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                ) : (
                  <Eraser className="size-4" data-icon="inline-start" />
                )}
                ფონის გამჭვირვალება
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={uploading}
                onClick={undoBackground}
              >
                <RotateCcw className="size-4" data-icon="inline-start" />
                უკან
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              disabled={uploading || processing}
              onClick={() => void uploadSignature()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              ) : (
                <Upload className="size-4" data-icon="inline-start" />
              )}
              შენახვა
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={uploading || processing}
              onClick={resetPending}
            >
              გაუქმება
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading || pending}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : (
              <ImagePlus className="size-4" data-icon="inline-start" />
            )}
            {value ? "შეცვლა" : "სურათის ატვირთვა"}
          </Button>
          {value ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={clear}
            >
              <X className="size-4" data-icon="inline-start" />
              წაშლა
            </Button>
          ) : null}
        </div>
      )}

      {!hasPending && !value ? (
        <p className="text-xs text-muted-foreground">
          გადაიღეთ ხელმოწერა თეთრ ფურცელზე, ატვირთეთ და დააჭირეთ „ფონის
          გამჭვირვალებას“. შავ/ლურჯ კალმზე საუკეთესოა.
        </p>
      ) : null}

      {value && showPositionControls ? (
        <Collapsible open={positionOpen} onOpenChange={setPositionOpen}>
          <CollapsibleTrigger
            type="button"
            className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 sm:w-auto"
          >
            <Move className="size-4" />
            პოზიციის მორგება
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                positionOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">{positionControls}</CollapsibleContent>
        </Collapsible>
      ) : null}
    </div>
  );
}

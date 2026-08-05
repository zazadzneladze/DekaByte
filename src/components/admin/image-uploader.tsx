"use client";

import { useRef, useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 8 * 1024 * 1024;

export type UploadedImage = {
  url: string;
  pathname: string;
  contentType?: string;
};

type ImageUploaderProps = {
  projectId: string;
  value?: UploadedImage | null;
  onChange: (value: UploadedImage | null) => void;
  onDelete?: () => Promise<void> | void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "avif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  switch (file.type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

export function ImageUploader({
  projectId,
  value,
  onChange,
  onDelete,
  label = "სურათი",
  className,
  disabled,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();

  async function runUpload(file: File) {
    setError(null);
    setLastFile(file);

    if (!ACCEPT.split(",").includes(file.type)) {
      setError("დასაშვებია მხოლოდ JPEG, PNG, WebP ან AVIF");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("ფაილი ძალიან დიდია (მაქს. 8MB)");
      return;
    }
    if (!projectId) {
      setError("ჯერ შეინახეთ პროექტი, შემდეგ ატვირთეთ სურათი");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const ext = extensionFor(file);
      const pathname = `projects/${projectId}/${crypto.randomUUID()}.${ext}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ projectId }),
        contentType: file.type,
        multipart: file.size > 4 * 1024 * 1024,
        onUploadProgress: (event) => {
          setProgress(Math.round(event.percentage));
        },
      });

      onChange({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
      });
      setProgress(100);
      toast.success("სურათი ატვირთულია");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void runUpload(file);
  }

  function handleDelete() {
    if (!value) return;
    const confirmed = window.confirm("ნამდვილად წავშალოთ ეს სურათი?");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        await onDelete?.();
        onChange(null);
        setProgress(0);
        setLastFile(null);
        toast.success("სურათი წაიშალა");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
        toast.error(message);
      }
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium">{label}</div>

      <div className="overflow-hidden rounded-lg border border-border bg-secondary/40">
        {value?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value.url}
            alt=""
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="size-8 opacity-50" />
            <span className="text-xs">სურათი არ არის</span>
          </div>
        )}
      </div>

      {(uploading || progress > 0) && progress < 100 && (
        <div className="space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled || uploading || pending}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading || pending || !projectId}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Upload className="size-3.5" data-icon="inline-start" />
          )}
          {value ? "შეცვლა" : "ატვირთვა"}
        </Button>

        {error && lastFile ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading || pending}
            onClick={() => void runUpload(lastFile)}
          >
            ხელახლა
          </Button>
        ) : null}

        {value ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={disabled || uploading || pending}
            onClick={handleDelete}
          >
            <Trash2 className="size-3.5" data-icon="inline-start" />
            წაშლა
          </Button>
        ) : null}
      </div>

      {!projectId ? (
        <p className="text-xs text-muted-foreground">
          სურათის ატვირთვა ხელმისაწვდომია პროექტის შენახვის შემდეგ.
        </p>
      ) : null}
    </div>
  );
}

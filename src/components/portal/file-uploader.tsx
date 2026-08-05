"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,application/pdf";
const MAX_BYTES = 20 * 1024 * 1024;

export type UploadedClientFile = {
  url: string;
  pathname: string;
  filename: string;
  mime: string;
  size: number;
};

type Props = {
  projectId: string;
  onUploaded: (file: UploadedClientFile) => Promise<void> | void;
  label?: string;
  accept?: string;
  purpose?: "client-asset" | "client-invoice";
  className?: string;
};

export function ClientFileUploader({
  projectId,
  onUploaded,
  label = "ფაილის ატვირთვა",
  accept = ACCEPT,
  purpose = "client-asset",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function runUpload(file: File) {
    if (file.size > MAX_BYTES) {
      toast.error("ფაილი ძალიან დიდია (მაქს. 20MB)");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const safeName = file.name.replace(/[^\w.\-ა-ჰ]+/gi, "_");
      const prefix =
        purpose === "client-invoice"
          ? `client-invoices/${projectId}`
          : `client-projects/${projectId}`;
      const pathname = `${prefix}/${safeName}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ purpose, projectId }),
        contentType: file.type,
        multipart: file.size > 4 * 1024 * 1024,
        onUploadProgress: (event) => {
          setProgress(Math.round(event.percentage));
        },
      });

      await onUploaded({
        url: blob.url,
        pathname: blob.pathname,
        filename: file.name,
        mime: file.type || "application/octet-stream",
        size: file.size,
      });
      toast.success("ფაილი ატვირთულია");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void runUpload(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileUp className="size-4" />
        )}
        {uploading ? `იტვირთება… ${progress}%` : label}
      </Button>
    </div>
  );
}

type AvatarProps = {
  userId: string;
  onUploaded: (file: { url: string; pathname: string }) => Promise<void> | void;
  onCleared?: () => Promise<void> | void;
  currentUrl?: string | null;
};

export function ClientAvatarUploader({
  userId,
  onUploaded,
  onCleared,
  currentUrl,
}: AvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function runUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("დასაშვებია მხოლოდ სურათი");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("ფაილი ძალიან დიდია (მაქს. 8MB)");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const pathname = `client-avatars/${userId}/avatar.${ext}`;
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ purpose: "client-avatar" }),
        contentType: file.type,
      });
      await onUploaded({ url: blob.url, pathname: blob.pathname });
      toast.success("ფოტო ატვირთულია");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt=""
          className="size-16 rounded-full object-cover ring-1 ring-border"
        />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-xs text-muted-foreground">
          ფოტო
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void runUpload(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : null}
        {uploading ? "იტვირთება…" : "ფოტოს ატვირთვა"}
      </Button>
      {currentUrl && onCleared ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void onCleared()}
        >
          <Trash2 className="size-4" />
          წაშლა
        </Button>
      ) : null}
    </div>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { updateSiteLogo } from "@/actions/settings";
import { DEFAULT_LOGO_SRC } from "@/components/public/logo";
import { Button } from "@/components/ui/button";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";
const MAX_BYTES = 8 * 1024 * 1024;

type Props = {
  initialUrl: string | null;
  initialPathname: string | null;
};

export function LogoUploader({ initialUrl, initialPathname }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [pathname, setPathname] = useState(initialPathname);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onFile(file: File) {
    if (!ACCEPT.split(",").includes(file.type)) {
      toast.error("დასაშვებია JPEG, PNG, WebP ან AVIF");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("ფაილი ძალიან დიდია (მაქს. 8MB)");
      return;
    }

    setUploading(true);
    try {
      const ext =
        file.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") ||
        "png";
      const blob = await upload(`brand/logo.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ purpose: "site-logo" }),
      });

      const result = await updateSiteLogo({
        logoUrl: blob.url,
        logoPathname: blob.pathname,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setUrl(blob.url);
      setPathname(blob.pathname);
      toast.success("ლოგო განახლებულია");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");
    } finally {
      setUploading(false);
    }
  }

  function clearLogo() {
    startTransition(async () => {
      const result = await updateSiteLogo({
        logoUrl: null,
        logoPathname: null,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setUrl(null);
      setPathname(null);
      toast.success("ნაგულისხმევი ლოგო დაბრუნდა");
      router.refresh();
    });
  }

  const preview = url || DEFAULT_LOGO_SRC;

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">ბრენდის ლოგო</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          გამჭვირვალე PNG რეკომენდებულია. გამოჩნდება ჰედერში, ფუტერში, admin /
          portal და login გვერდებზე.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-h-16 items-center rounded-xl border border-dashed border-border bg-off-white px-4 py-3">
          <Image
            src={preview}
            alt="ლოგოს პრევიუ"
            width={220}
            height={54}
            className="h-12 w-auto object-contain"
            unoptimized={Boolean(url)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading || pending}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            {uploading ? "იტვირთება…" : "ლოგოს ატვირთვა"}
          </Button>
          {pathname ? (
            <Button
              type="button"
              variant="ghost"
              disabled={uploading || pending}
              onClick={clearLogo}
            >
              <Trash2 />
              წაშლა
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void onFile(file);
        }}
      />
    </div>
  );
}

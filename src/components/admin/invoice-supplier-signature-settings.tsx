"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  clearInvoiceSupplierSignature,
  updateInvoiceSupplierSignature,
  updateInvoiceSupplierSignatureTransform,
} from "@/actions/settings";
import { InvoiceSignatureTransformControls } from "@/components/admin/invoice-signature-transform-controls";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_INVOICE_SIGNATURE_TRANSFORM,
  clampSignatureTransform,
  type InvoiceSignatureTransform,
} from "@/lib/invoice-signature";

type Props = {
  initialUrl: string | null;
  initialPathname: string | null;
  initialTransform: InvoiceSignatureTransform;
};

export function InvoiceSupplierSignatureSettings({
  initialUrl,
  initialPathname,
  initialTransform,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [pathname, setPathname] = useState(initialPathname);
  const [transform, setTransform] = useState(
    clampSignatureTransform(initialTransform),
  );
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function onFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("მხოლოდ სურათი (PNG, JPG, WebP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("სურათი ძალიან დიდია (მაქს. 2MB)");
      return;
    }

    setUploading(true);
    try {
      const ext =
        file.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") ||
        "png";
      const blob = await upload(`brand/invoice-supplier-signature.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ purpose: "invoice-supplier-signature" }),
        contentType: file.type,
      });

      const nextTransform =
        url === null
          ? DEFAULT_INVOICE_SIGNATURE_TRANSFORM
          : clampSignatureTransform(transform);

      const result = await updateInvoiceSupplierSignature({
        url: blob.url,
        pathname: blob.pathname,
        transform: nextTransform,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setUrl(blob.url);
      setPathname(blob.pathname);
      setTransform(nextTransform);
      toast.success("ხელმოწერა შენახულია");
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
      const result = await updateInvoiceSupplierSignatureTransform(transform);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("პოზიცია შენახულია");
      router.refresh();
    });
  }

  function removeSignature() {
    startTransition(async () => {
      const result = await clearInvoiceSupplierSignature();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setUrl(null);
      setPathname(null);
      setTransform(DEFAULT_INVOICE_SIGNATURE_TRANSFORM);
      toast.success("ხელმოწერა წაიშალა");
      router.refresh();
    });
  }

  const transformDirty =
    JSON.stringify(transform) !==
    JSON.stringify(clampSignatureTransform(initialTransform));

  return (
    <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">
          ინვოისის ხელმოწერა (მიმწოდებელი)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ატვირთეთ ერთხელ — ყოველ ინვოისზე შეგიძლიათ ჩასვა ან გამოტოვოთ. გამჭვირვალე
          PNG რეკომენდებულია.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void onFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading || pending}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <ImagePlus className="size-4" data-icon="inline-start" />
          )}
          {url ? "ხელმოწერის შეცვლა" : "ხელმოწერის ატვირთვა"}
        </Button>
        {pathname ? (
          <Button
            type="button"
            variant="ghost"
            disabled={uploading || pending}
            onClick={removeSignature}
          >
            <Trash2 className="size-4" data-icon="inline-start" />
            წაშლა
          </Button>
        ) : null}
      </div>

      {url ? (
        <div className="space-y-3">
          <InvoiceSignatureTransformControls
            imageUrl={url}
            transform={transform}
            onChange={setTransform}
          />
          <Button
            type="button"
            disabled={pending || !transformDirty}
            onClick={saveTransform}
          >
            {pending ? "ინახება…" : "პოზიციის შენახვა"}
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          ინვოისის ფორმაში გამოჩნდება მოსანიშნი „ჩავსვა ჩემი ხელმოწერა“ —{" "}
          <Link href="/admin/clients" className="text-electric underline-offset-2 hover:underline">
            კლიენტის გვერდზე
          </Link>
          .
        </p>
      )}
    </div>
  );
}

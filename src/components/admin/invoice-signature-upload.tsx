"use client";



import { useRef, useState } from "react";

import { upload } from "@vercel/blob/client";

import { ChevronDown, ImagePlus, Loader2, Move, X } from "lucide-react";

import { toast } from "sonner";

import { InvoiceSignatureTransformControls } from "@/components/admin/invoice-signature-transform-controls";

import { Button } from "@/components/ui/button";

import {

  Collapsible,

  CollapsibleContent,

  CollapsibleTrigger,

} from "@/components/ui/collapsible";

import { Label } from "@/components/ui/label";

import {

  DEFAULT_INVOICE_SIGNATURE_TRANSFORM,

  clampSignatureTransform,

  type InvoiceSignatureTransform,

} from "@/lib/invoice-signature";

import { cn } from "@/lib/utils";



type Props = {

  projectId: string;

  label: string;

  value: string | null;

  onChange: (url: string | null) => void;

  transform: InvoiceSignatureTransform;

  onTransformChange: (next: InvoiceSignatureTransform) => void;

  /** When true, positioning controls open from a menu button instead of always showing. */

  positionMenu?: boolean;

  className?: string;

};



export function InvoiceSignatureUpload({

  projectId,

  label,

  value,

  onChange,

  transform,

  onTransformChange,

  positionMenu = false,

  className,

}: Props) {

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const [positionOpen, setPositionOpen] = useState(false);



  async function handleFile(file: File) {

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

      const safeName = file.name.replace(/[^\w.\-]+/gi, "_");

      const pathname = `client-invoices/${projectId}/signatures/${Date.now()}-${safeName}`;

      const blob = await upload(pathname, file, {

        access: "public",

        handleUploadUrl: "/api/blob/upload",

        clientPayload: JSON.stringify({ purpose: "client-invoice", projectId }),

        contentType: file.type,

      });

      onChange(blob.url);

      onTransformChange(DEFAULT_INVOICE_SIGNATURE_TRANSFORM);

      if (positionMenu) setPositionOpen(true);

      toast.success("ხელმოწერა ატვირთულია");

    } catch (err) {

      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");

    } finally {

      setUploading(false);

      if (inputRef.current) inputRef.current.value = "";

    }

  }



  function clear() {

    onChange(null);

    onTransformChange(DEFAULT_INVOICE_SIGNATURE_TRANSFORM);

    setPositionOpen(false);

  }



  const positionControls = value ? (

    <InvoiceSignatureTransformControls

      imageUrl={value}

      transform={clampSignatureTransform(transform)}

      onChange={onTransformChange}

      compact

    />

  ) : null;



  return (

    <div className={cn("space-y-2 rounded-lg border border-border/70 bg-card p-3", className)}>

      <Label>{label}</Label>

      <div className="flex flex-wrap items-center gap-2">

        <input

          ref={inputRef}

          type="file"

          accept="image/png,image/jpeg,image/webp"

          className="hidden"

          onChange={(e) => {

            const file = e.target.files?.[0];

            if (file) void handleFile(file);

          }}

        />

        <Button

          type="button"

          size="sm"

          variant="outline"

          disabled={uploading}

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

          <Button type="button" size="sm" variant="ghost" onClick={clear}>

            <X className="size-4" data-icon="inline-start" />

            წაშლა

          </Button>

        ) : null}

      </div>



      {value ? (

        positionMenu ? (

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

        ) : (

          positionControls

        )

      ) : (

        <p className="text-xs text-muted-foreground">

          PNG/JPG/WebP, გამჭვირვალე ფონი. ხელმოწერა ან ბეჭედი.

        </p>

      )}

    </div>

  );

}


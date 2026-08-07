"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  clearClientAvatar,
  updateClientProfile,
} from "@/actions/portal";
import { ClientAvatarUploader } from "@/components/portal/file-uploader";
import { SignatureUploadPanel } from "@/components/shared/signature-upload-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  clampSignatureTransform,
  DEFAULT_INVOICE_SIGNATURE_TRANSFORM,
  type InvoiceSignatureTransform,
} from "@/lib/invoice-signature";

type Props = {
  userId: string;
  initialName: string;
  initialPhone?: string | null;
  initialAddress?: string | null;
  initialAvatarUrl: string | null;
  initialSignatureUrl?: string | null;
  initialSignatureTransform?: InvoiceSignatureTransform;
  mode: "onboarding" | "profile";
};

export function PortalProfileForm({
  userId,
  initialName,
  initialPhone = "",
  initialAddress = "",
  initialAvatarUrl,
  initialSignatureUrl = null,
  initialSignatureTransform = DEFAULT_INVOICE_SIGNATURE_TRANSFORM,
  mode,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [address, setAddress] = useState(initialAddress ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarPathname, setAvatarPathname] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState(initialSignatureUrl);
  const [signatureTransform, setSignatureTransform] =
    useState<InvoiceSignatureTransform>(
      clampSignatureTransform(initialSignatureTransform),
    );
  useEffect(() => {
    setSignatureUrl(initialSignatureUrl);
    setSignatureTransform(clampSignatureTransform(initialSignatureTransform));
  }, [initialSignatureUrl, initialSignatureTransform, userId]);

  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateClientProfile({
        displayName: name,
        phone: phone.trim() || null,
        address: address.trim() || null,
        avatarUrl: avatarUrl,
        avatarPathname:
          avatarPathname !== null
            ? avatarPathname
            : avatarUrl
              ? undefined
              : null,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("პროფილი შენახულია");
      if (mode === "onboarding") {
        router.push("/portal");
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">
          {mode === "onboarding" ? "მოგესალმებით" : "პროფილი"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "onboarding"
            ? "გთხოვთ მიუთითოთ თქვენი სახელი. ტელეფონი, მისამართი და ფოტო არასავალდებულოა."
            : "სახელი, კონტაქტი და პროფილის ფოტო — ინვოისებისთვის მომავალში."}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="displayName">სახელი</Label>
        <Input
          id="displayName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">ტელეფონი</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+995 …"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">მისამართი</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="ქალაქი, ქუჩა…"
        />
      </div>

      <div className="space-y-2">
        <Label>პროფილის ფოტო</Label>
        <ClientAvatarUploader
          userId={userId}
          currentUrl={avatarUrl}
          onUploaded={(file) => {
            setAvatarUrl(file.url);
            setAvatarPathname(file.pathname);
          }}
          onCleared={async () => {
            const result = await clearClientAvatar();
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            setAvatarUrl(null);
            setAvatarPathname(null);
            router.refresh();
          }}
        />
      </div>

      {mode === "profile" ? (
        <SignatureUploadPanel
          key={userId}
          mode="portal"
          clientUserId={userId}
          label="ინვოისის ხელმოწერა"
          description="გადაიღეთ ხელმოწერა თეთრ ფურცელზე, ატვირთეთ და გამოიყენეთ „ფონის გამჭვირვალება“."
          initialTransform={clampSignatureTransform(initialSignatureTransform)}
          value={signatureUrl}
          onChange={setSignatureUrl}
          transform={signatureTransform}
          onTransformChange={setSignatureTransform}
          showPositionControls={false}
        />
      ) : null}

      <Button
        type="button"
        disabled={pending || name.trim().length < 2}
        onClick={save}
      >
        {pending
          ? "ინახება…"
          : mode === "onboarding"
            ? "გაგრძელება"
            : "შენახვა"}
      </Button>
    </div>
  );
}

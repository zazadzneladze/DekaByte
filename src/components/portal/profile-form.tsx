"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  clearClientAvatar,
  updateClientProfile,
} from "@/actions/portal";
import { ClientAvatarUploader } from "@/components/portal/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  userId: string;
  initialName: string;
  initialAvatarUrl: string | null;
  mode: "onboarding" | "profile";
};

export function PortalProfileForm({
  userId,
  initialName,
  initialAvatarUrl,
  mode,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarPathname, setAvatarPathname] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateClientProfile({
        displayName: name,
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
      router.push("/portal");
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
            ? "გთხოვთ მიუთითოთ თქვენი სახელი. ფოტო არასავალდებულოა."
            : "შეცვალეთ სახელი ან პროფილის ფოტო."}
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

      <Button type="button" disabled={pending || name.trim().length < 2} onClick={save}>
        {pending ? "ინახება…" : mode === "onboarding" ? "გაგრძელება" : "შენახვა"}
      </Button>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  changeAdminPassword,
  updateSiteSettings,
} from "@/actions/settings";

type SettingsValues = {
  brandName: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsappNumber: string;
  email: string;
  facebookUrl: string;
  messengerUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
};

export function SettingsForms({ initial }: { initial: SettingsValues }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initial);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function setSetting<K extends keyof SettingsValues>(
    key: K,
    value: SettingsValues[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateSiteSettings(settings);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("პარამეტრები შენახულია");
      router.refresh();
    });
  }

  function savePassword(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await changeAdminPassword(password);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("პაროლი შეიცვალა");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={saveSettings}
        className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5"
      >
        <h2 className="text-sm font-semibold">საიტის პარამეტრები</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="ბრენდი"
            id="brandName"
            value={settings.brandName}
            onChange={(v) => setSetting("brandName", v)}
          />
          <Field
            label="ელფოსტა"
            id="email"
            type="email"
            value={settings.email}
            onChange={(v) => setSetting("email", v)}
          />
          <Field
            label="ტელეფონი (ჩვენება)"
            id="phoneDisplay"
            value={settings.phoneDisplay}
            onChange={(v) => setSetting("phoneDisplay", v)}
          />
          <Field
            label="ტელეფონი (E.164)"
            id="phoneE164"
            value={settings.phoneE164}
            onChange={(v) => setSetting("phoneE164", v)}
          />
          <Field
            label="WhatsApp ნომერი"
            id="whatsappNumber"
            value={settings.whatsappNumber}
            onChange={(v) => setSetting("whatsappNumber", v)}
          />
          <Field
            label="Facebook"
            id="facebookUrl"
            value={settings.facebookUrl}
            onChange={(v) => setSetting("facebookUrl", v)}
          />
          <Field
            label="Messenger"
            id="messengerUrl"
            value={settings.messengerUrl}
            onChange={(v) => setSetting("messengerUrl", v)}
          />
          <Field
            label="Instagram"
            id="instagramUrl"
            value={settings.instagramUrl}
            onChange={(v) => setSetting("instagramUrl", v)}
          />
          <Field
            label="LinkedIn"
            id="linkedinUrl"
            value={settings.linkedinUrl}
            onChange={(v) => setSetting("linkedinUrl", v)}
          />
          <Field
            label="GitHub"
            id="githubUrl"
            value={settings.githubUrl}
            onChange={(v) => setSetting("githubUrl", v)}
          />
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="defaultSeoTitle">ნაგულისხმევი SEO სათაური</Label>
            <Input
              id="defaultSeoTitle"
              value={settings.defaultSeoTitle}
              onChange={(e) => setSetting("defaultSeoTitle", e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="defaultSeoDescription">
              ნაგულისხმევი SEO აღწერა
            </Label>
            <Textarea
              id="defaultSeoDescription"
              rows={3}
              value={settings.defaultSeoDescription}
              onChange={(e) =>
                setSetting("defaultSeoDescription", e.target.value)
              }
            />
          </div>
        </div>

        <Button type="submit" disabled={pending}>
          {pending ? "ინახება…" : "შენახვა"}
        </Button>
      </form>

      <form
        onSubmit={savePassword}
        className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5"
        autoComplete="off"
      >
        <h2 className="text-sm font-semibold">პაროლის შეცვლა</h2>
        <div className="grid max-w-md gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">მიმდინარე პაროლი</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword((p) => ({
                  ...p,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">ახალი პაროლი</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword((p) => ({ ...p, newPassword: e.target.value }))
              }
              required
              minLength={10}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">გაიმეორეთ ახალი პაროლი</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword((p) => ({
                  ...p,
                  confirmPassword: e.target.value,
                }))
              }
              required
              minLength={10}
            />
          </div>
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          პაროლის განახლება
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

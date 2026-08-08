"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "ღია", icon: SunIcon },
  { value: "dark", label: "მუქი", icon: MoonIcon },
  { value: "system", label: "სისტემა", icon: MonitorIcon },
] as const;

export function ThemeSettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? (theme ?? "system") : "system";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div>
        <h2 className="text-sm font-semibold">გარეგნობა</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          აირჩიეთ ღია, მუქი ან სისტემის თემა.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant={current === value ? "default" : "outline"}
            className={cn(
              "gap-2",
              !mounted && "pointer-events-none opacity-70",
            )}
            onClick={() => setTheme(value)}
            aria-pressed={current === value}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

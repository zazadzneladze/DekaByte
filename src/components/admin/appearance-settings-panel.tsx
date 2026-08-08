import { HeroVisualSettingsPanel } from "@/components/admin/hero-visual-settings-panel";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { ThemeSettingsPanel } from "@/components/admin/theme-settings-panel";
import type { HeroVisualMode } from "@/lib/hero-visual";

type AppearanceSettingsPanelProps = {
  heroVisual: HeroVisualMode;
  logoUrl: string | null;
  logoPathname: string | null;
};

export function AppearanceSettingsPanel({
  heroVisual,
  logoUrl,
  logoPathname,
}: AppearanceSettingsPanelProps) {
  return (
    <div className="space-y-4">
      <LogoUploader initialUrl={logoUrl} initialPathname={logoPathname} />
      <ThemeSettingsPanel />
      <HeroVisualSettingsPanel initial={heroVisual} />
    </div>
  );
}

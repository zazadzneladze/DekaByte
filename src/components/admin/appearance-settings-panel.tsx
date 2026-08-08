import { HeroVisualSettingsPanel } from "@/components/admin/hero-visual-settings-panel";
import { ThemeSettingsPanel } from "@/components/admin/theme-settings-panel";
import type { HeroVisualMode } from "@/lib/hero-visual";

type AppearanceSettingsPanelProps = {
  heroVisual: HeroVisualMode;
};

export function AppearanceSettingsPanel({
  heroVisual,
}: AppearanceSettingsPanelProps) {
  return (
    <div className="space-y-4">
      <ThemeSettingsPanel />
      <HeroVisualSettingsPanel initial={heroVisual} />
    </div>
  );
}

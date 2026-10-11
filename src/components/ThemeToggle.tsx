import { Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";
import { useI18n } from "../i18n/I18nProvider";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const { t } = useI18n();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? t.switchToLight : t.switchToDark}
      title={isDark ? t.lightMode : t.darkMode}
      className="grid size-11 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-ink"
    >
      {isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  );
}

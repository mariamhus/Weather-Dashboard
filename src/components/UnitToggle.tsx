import { useI18n } from "../i18n/I18nProvider";
import type { Units } from "../types";

interface UnitToggleProps {
  units: Units;
  onChange: (units: Units) => void;
}

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  const { t } = useI18n();
  const options: { value: Units; label: string; name: string }[] = [
    { value: "metric", label: "°C", name: t.celsius },
    { value: "imperial", label: "°F", name: t.fahrenheit },
  ];

  return (
    <div role="group" aria-label={t.temperatureUnit} className="flex rounded-full border border-line bg-surface p-1">
      {options.map((option) => {
        const selected = option.value === units;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={option.name}
            onClick={() => onChange(option.value)}
            className={`h-9 min-w-11 rounded-full px-3 text-sm font-medium transition-colors ${
              selected ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

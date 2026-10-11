import type { Units } from "../types";

interface UnitToggleProps {
  units: Units;
  onChange: (units: Units) => void;
}

const OPTIONS: { value: Units; label: string; name: string }[] = [
  { value: "metric", label: "°C", name: "Celsius" },
  { value: "imperial", label: "°F", name: "Fahrenheit" },
];

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  return (
    <div role="group" aria-label="Temperature unit" className="flex rounded-full border border-line bg-surface p-1">
      {OPTIONS.map((option) => {
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

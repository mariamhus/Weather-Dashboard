import { Droplet } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { degrees, formatWeekday } from "../lib/format";
import { describeWeather } from "../lib/weatherCodes";
import type { DailyPoint } from "../types";

interface DailyForecastProps {
  days: DailyPoint[];
}

function rangeStyle(min: number, max: number, weekMin: number, weekMax: number) {
  const span = weekMax - weekMin || 1;
  const left = ((min - weekMin) / span) * 100;
  const width = Math.max(((max - min) / span) * 100, 4);
  const imageWidth = (100 / width) * 100;
  const position = width >= 100 ? 0 : (left / (100 - width)) * 100;
  return {
    left: `${left}%`,
    width: `${width}%`,
    backgroundImage: "linear-gradient(90deg, var(--color-cool), var(--color-mild), var(--color-warm))",
    backgroundSize: `${imageWidth}% 100%`,
    backgroundPosition: `${position}% 0`,
  };
}

export function DailyForecast({ days }: DailyForecastProps) {
  const weekMin = Math.min(...days.map((day) => day.min));
  const weekMax = Math.max(...days.map((day) => day.max));

  return (
    <section aria-labelledby="daily-heading">
      <h2 id="daily-heading" className="text-lg font-semibold tracking-tight">
        7-day forecast
      </h2>
      <ul className="mt-3 border-t border-line">
        {days.map((day, index) => {
          const { label, sky } = describeWeather(day.weatherCode);
          return (
            <li
              key={day.date}
              className="grid grid-cols-[3.75rem_1.75rem_3rem_2.25rem_minmax(0,1fr)_2.25rem] items-center gap-3 border-b border-line py-3 sm:grid-cols-[5rem_2rem_3.5rem_2.5rem_minmax(0,1fr)_2.5rem] sm:gap-4"
            >
              <span className="font-medium">{formatWeekday(day.date, index)}</span>
              <span title={label}>
                <WeatherIcon sky={sky} isDay className="size-6 text-muted" strokeWidth={1.6} />
                <span className="sr-only">{label}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-rain tabular-nums">
                {day.precipitationChance >= 10 && (
                  <>
                    <Droplet aria-hidden="true" className="size-3" />
                    <span className="sr-only">Chance of precipitation </span>
                    {day.precipitationChance}%
                  </>
                )}
              </span>
              <span className="text-right text-muted tabular-nums">
                <span className="sr-only">Low </span>
                {degrees(day.min)}
              </span>
              <div aria-hidden="true" className="relative h-1.5 rounded-full bg-line">
                <div className="absolute inset-y-0 rounded-full" style={rangeStyle(day.min, day.max, weekMin, weekMax)} />
              </div>
              <span className="font-medium tabular-nums">
                <span className="sr-only">High </span>
                {degrees(day.max)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

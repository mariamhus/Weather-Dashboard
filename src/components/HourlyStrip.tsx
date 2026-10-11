import { WeatherIcon } from "./WeatherIcon";
import { useI18n } from "../i18n/I18nProvider";
import { degrees, formatHour } from "../lib/format";
import { describeWeather } from "../lib/weatherCodes";
import type { HourlyPoint } from "../types";

interface HourlyStripProps {
  hours: HourlyPoint[];
  lineColor: string;
}

export function HourlyStrip({ hours, lineColor }: HourlyStripProps) {
  const { t, locale } = useI18n();
  return (
    <div className="mt-10 border-t pt-4" style={{ borderColor: lineColor }}>
      <h2 className="sr-only">{t.next24Hours}</h2>
      <ol className="scrollbar-none -mx-2 flex snap-x overflow-x-auto pb-1">
        {hours.map((hour, index) => {
          const { label, sky } = describeWeather(hour.weatherCode, t);
          return (
            <li
              key={hour.time}
              className="relative flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center gap-2 px-2 py-2 text-center"
            >
              <span className="text-xs opacity-80">{index === 0 ? t.now : formatHour(hour.time, locale)}</span>
              <WeatherIcon sky={sky} isDay={hour.isDay} className="size-6" strokeWidth={1.6} />
              <span className="sr-only">{label}</span>
              <span className="text-base font-medium tabular-nums">{degrees(hour.temperature)}</span>
              <span className="min-h-4 text-[11px] tabular-nums opacity-75">
                {hour.precipitationChance >= 20 ? (
                  <>
                    <span className="sr-only">{t.chanceOfPrecipitation} </span>
                    {hour.precipitationChance}%
                  </>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

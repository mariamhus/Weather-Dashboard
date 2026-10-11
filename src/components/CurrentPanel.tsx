import { HourlyStrip } from "./HourlyStrip";
import { WeatherIcon } from "./WeatherIcon";
import { useI18n } from "../i18n/I18nProvider";
import { degrees, formatLongDate, placeRegion } from "../lib/format";
import { skyTheme } from "../lib/sky";
import { describeWeather } from "../lib/weatherCodes";
import type { Forecast, Place } from "../types";

interface CurrentPanelProps {
  place: Place;
  forecast: Forecast;
}

export function CurrentPanel({ place, forecast }: CurrentPanelProps) {
  const { t, locale } = useI18n();
  const { current, hourly, daily } = forecast;
  const { label, sky } = describeWeather(current.weatherCode, t);
  const theme = skyTheme(sky, current.isDay);
  const today = daily[0];
  const region = placeRegion(place, t.listSeparator);
  const name = place.id === -1 ? t.yourLocation : place.name;

  return (
    <section
      aria-labelledby="place-heading"
      className="sky-panel overflow-hidden rounded-[2rem] px-6 pt-7 pb-4 sm:px-10 sm:pt-10"
      style={{
        background: `linear-gradient(180deg, ${theme.top} 0%, ${theme.bottom} 100%)`,
        color: theme.text,
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 id="place-heading" className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            {name}
          </h1>
          {region && <p className="mt-1 truncate text-sm opacity-80">{region}</p>}
          <p className="mt-0.5 text-sm opacity-80">{formatLongDate(current.time, locale)}</p>
        </div>
        <WeatherIcon sky={sky} isDay={current.isDay} className="size-14 shrink-0 sm:size-20" strokeWidth={1.2} />
      </div>

      <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3 sm:mt-10">
        <p className="text-[clamp(5.5rem,20vw,10.5rem)] leading-[0.78] font-light tracking-[-0.06em] tabular-nums [font-variation-settings:'opsz'_96]">
          {degrees(current.temperature)}
        </p>
        <div className="pb-1">
          <p className="text-xl font-medium sm:text-2xl">{label}</p>
          <p className="mt-1 text-sm opacity-80">{t.feelsLike(degrees(current.apparentTemperature))}</p>
          {today && <p className="text-sm opacity-80">{t.highLow(degrees(today.max), degrees(today.min))}</p>}
        </div>
      </div>

      <HourlyStrip hours={hourly} lineColor={theme.line} />
    </section>
  );
}

import type { ReactNode } from "react";
import { Navigation2 } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { compassPoint, formatTime } from "../lib/format";
import type { Forecast, Units } from "../types";

interface ConditionsProps {
  forecast: Forecast;
  units: Units;
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-4 pe-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-medium tabular-nums">{children}</dd>
    </div>
  );
}

function Unit({ children }: { children: ReactNode }) {
  return <span className="ms-1 text-base font-normal text-muted">{children}</span>;
}

export function Conditions({ forecast, units }: ConditionsProps) {
  const { t, locale } = useI18n();
  const { current, daily } = forecast;
  const today = daily[0];
  const windUnit = units === "metric" ? t.kmh : t.mph;
  const rainUnit = units === "metric" ? t.mm : t.inches;

  return (
    <section aria-labelledby="conditions-heading">
      <h2 id="conditions-heading" className="text-lg font-semibold tracking-tight">
        {t.rightNow}
      </h2>
      <dl className="mt-3 grid grid-cols-2 border-t border-line">
        <Item label={t.humidity}>
          {Math.round(current.humidity)}
          <Unit>%</Unit>
        </Item>
        <Item label={t.wind}>
          <span className="inline-flex items-center gap-2">
            <span>
              {Math.round(current.windSpeed)}
              <Unit>
                {windUnit} {compassPoint(current.windDirection, t.compass)}
              </Unit>
            </span>
            <Navigation2
              aria-hidden="true"
              className="size-4 text-muted"
              style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
            />
          </span>
        </Item>
        <Item label={t.rainLastHour}>
          {current.precipitation}
          <Unit>{rainUnit}</Unit>
        </Item>
        <Item label={t.chanceOfRainToday}>
          {today?.precipitationChance ?? 0}
          <Unit>%</Unit>
        </Item>
        {today && (
          <>
            <Item label={t.sunrise}>{formatTime(today.sunrise, locale)}</Item>
            <Item label={t.sunset}>{formatTime(today.sunset, locale)}</Item>
          </>
        )}
      </dl>
    </section>
  );
}

import type { ReactNode } from "react";
import { Navigation2 } from "lucide-react";
import { compassPoint, formatTime } from "../lib/format";
import type { Forecast, Units } from "../types";

interface ConditionsProps {
  forecast: Forecast;
  units: Units;
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b border-line py-4 pr-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-medium tabular-nums">{children}</dd>
    </div>
  );
}

function Unit({ children }: { children: ReactNode }) {
  return <span className="ml-1 text-base font-normal text-muted">{children}</span>;
}

export function Conditions({ forecast, units }: ConditionsProps) {
  const { current, daily } = forecast;
  const today = daily[0];
  const windUnit = units === "metric" ? "km/h" : "mph";
  const rainUnit = units === "metric" ? "mm" : "in";

  return (
    <section aria-labelledby="conditions-heading">
      <h2 id="conditions-heading" className="text-lg font-semibold tracking-tight">
        Right now
      </h2>
      <dl className="mt-3 grid grid-cols-2 border-t border-line">
        <Item label="Humidity">
          {Math.round(current.humidity)}
          <Unit>%</Unit>
        </Item>
        <Item label="Wind">
          <span className="inline-flex items-center gap-2">
            <span>
              {Math.round(current.windSpeed)}
              <Unit>
                {windUnit} {compassPoint(current.windDirection)}
              </Unit>
            </span>
            <Navigation2
              aria-hidden="true"
              className="size-4 text-muted"
              style={{ transform: `rotate(${current.windDirection + 180}deg)` }}
            />
          </span>
        </Item>
        <Item label="Rain in the last hour">
          {current.precipitation}
          <Unit>{rainUnit}</Unit>
        </Item>
        <Item label="Chance of rain today">
          {today?.precipitationChance ?? 0}
          <Unit>%</Unit>
        </Item>
        {today && (
          <>
            <Item label="Sunrise">{formatTime(today.sunrise)}</Item>
            <Item label="Sunset">{formatTime(today.sunset)}</Item>
          </>
        )}
      </dl>
    </section>
  );
}

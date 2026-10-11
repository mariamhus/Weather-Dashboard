import type { Messages } from "../i18n/en";

export type SkyKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

interface CodeInfo {
  label: string;
  sky: SkyKind;
}

const SKIES: Record<number, SkyKind> = {
  0: "clear",
  1: "clear",
  2: "partly",
  3: "cloudy",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

export function describeWeather(code: number, t: Pick<Messages, "weatherCodes" | "unknownWeather">): CodeInfo {
  return { label: t.weatherCodes[code] ?? t.unknownWeather, sky: SKIES[code] ?? "cloudy" };
}

import type { SkyKind } from "./weatherCodes";

export interface SkyTheme {
  top: string;
  bottom: string;
  text: string;
  line: string;
  tint: string;
}

const LIGHT_TEXT = { text: "#FFFFFF", line: "rgba(255,255,255,0.22)", tint: "rgba(255,255,255,0.14)" };
const DARK_TEXT = { text: "#15222C", line: "rgba(21,34,44,0.16)", tint: "rgba(21,34,44,0.07)" };

const SKIES: Record<SkyKind, { day: [string, string]; night: [string, string]; darkTextByDay?: boolean }> = {
  clear: { day: ["#2F86D6", "#9FCDF2"], night: ["#0D1838", "#2B3D6E"] },
  partly: { day: ["#5592C7", "#C1D5E5"], night: ["#18223E", "#3D4B68"] },
  cloudy: { day: ["#76858F", "#BFC9D0"], night: ["#252C35", "#47515C"] },
  fog: { day: ["#AAB4BA", "#E0E5E7"], night: ["#394047", "#5F676E"], darkTextByDay: true },
  drizzle: { day: ["#5A7183", "#9EB1BF"], night: ["#1C2631", "#3A4755"] },
  rain: { day: ["#425667", "#7E92A2"], night: ["#141C26", "#323E4B"] },
  snow: { day: ["#B7CADB", "#EEF3F7"], night: ["#2C394C", "#5B6B81"], darkTextByDay: true },
  storm: { day: ["#2D3344", "#5A5E75"], night: ["#11131D", "#2B2E41"] },
};

export function skyTheme(sky: SkyKind, isDay: boolean): SkyTheme {
  const entry = SKIES[sky];
  const [top, bottom] = isDay ? entry.day : entry.night;
  const tone = isDay && entry.darkTextByDay ? DARK_TEXT : LIGHT_TEXT;
  return { top, bottom, ...tone };
}

import type { Place } from "../types";

export function parseLocal(iso: string): Date {
  const [datePart, timePart = "00:00"] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export function formatHour(iso: string, locale: string): string {
  return parseLocal(iso).toLocaleTimeString(locale, { hour: "numeric" });
}

export function formatTime(iso: string, locale: string): string {
  return parseLocal(iso).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
}

export function formatWeekday(iso: string, locale: string): string {
  return parseLocal(iso).toLocaleDateString(locale, { weekday: "short" });
}

export function formatLongDate(iso: string, locale: string): string {
  return parseLocal(iso).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
}

// The leading LRM keeps a minus sign in front of the number in right-to-left text.
export function degrees(value: number): string {
  return `‎${Math.round(value)}°`;
}

export function compassPoint(deg: number, points: string[]): string {
  return points[Math.round(deg / 45) % 8];
}

export function placeRegion(place: Place, separator: string): string {
  return [place.admin1, place.country].filter(Boolean).join(separator);
}

import type { Place } from "../types";

export function parseLocal(iso: string): Date {
  const [datePart, timePart = "00:00"] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export function formatHour(iso: string): string {
  return parseLocal(iso).toLocaleTimeString([], { hour: "numeric" });
}

export function formatTime(iso: string): string {
  return parseLocal(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatWeekday(iso: string, index: number): string {
  if (index === 0) return "Today";
  return parseLocal(iso).toLocaleDateString([], { weekday: "short" });
}

export function formatLongDate(iso: string): string {
  return parseLocal(iso).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}

export function degrees(value: number): string {
  return `${Math.round(value)}°`;
}

export function compassPoint(deg: number): string {
  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return points[Math.round(deg / 45) % 8];
}

export function placeRegion(place: Place): string {
  return [place.admin1, place.country].filter(Boolean).join(", ");
}

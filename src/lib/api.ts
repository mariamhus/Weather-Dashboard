import type { Forecast, Place, Units } from "../types";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

interface RawPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface RawForecast {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: (number | null)[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
}

export async function searchPlaces(query: string, language: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({ name: query, count: "6", language, format: "json" });
  const response = await fetch(`${GEO_URL}?${params}`, { signal });
  if (!response.ok) {
    throw new Error("Place search is unavailable right now. Try again in a moment.");
  }
  const data: { results?: RawPlace[] } = await response.json();
  return (data.results ?? []).map(({ id, name, latitude, longitude, country, admin1 }) => ({
    id,
    name,
    latitude,
    longitude,
    country,
    admin1,
  }));
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  units: Units,
  signal?: AbortSignal,
): Promise<Forecast> {
  const imperial = units === "imperial";
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code,is_day",
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: imperial ? "fahrenheit" : "celsius",
    wind_speed_unit: imperial ? "mph" : "kmh",
    precipitation_unit: imperial ? "inch" : "mm",
  });

  const response = await fetch(`${FORECAST_URL}?${params}`, { signal });
  if (!response.ok) {
    throw new Error("The forecast couldn't be loaded. Check your connection and try again.");
  }
  const raw: RawForecast = await response.json();

  const currentHour = raw.current.time.slice(0, 13);
  const startIndex = Math.max(
    0,
    raw.hourly.time.findIndex((time) => time.slice(0, 13) === currentHour),
  );

  const hourly = raw.hourly.time.slice(startIndex, startIndex + 24).map((time, offset) => {
    const i = startIndex + offset;
    return {
      time,
      temperature: raw.hourly.temperature_2m[i],
      weatherCode: raw.hourly.weather_code[i],
      precipitationChance: raw.hourly.precipitation_probability[i] ?? 0,
      isDay: raw.hourly.is_day[i] === 1,
    };
  });

  const daily = raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    max: raw.daily.temperature_2m_max[i],
    min: raw.daily.temperature_2m_min[i],
    precipitationChance: raw.daily.precipitation_probability_max[i] ?? 0,
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
  }));

  return {
    current: {
      time: raw.current.time,
      temperature: raw.current.temperature_2m,
      apparentTemperature: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      precipitation: raw.current.precipitation,
      windSpeed: raw.current.wind_speed_10m,
      windDirection: raw.current.wind_direction_10m,
      weatherCode: raw.current.weather_code,
      isDay: raw.current.is_day === 1,
    },
    hourly,
    daily,
  };
}

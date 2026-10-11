export type Units = "metric" | "imperial";

export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationChance: number;
  isDay: boolean;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  max: number;
  min: number;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
}

export interface Forecast {
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
}

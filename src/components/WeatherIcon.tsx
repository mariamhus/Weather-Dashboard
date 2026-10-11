import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { SkyKind } from "../lib/weatherCodes";

interface WeatherIconProps extends LucideProps {
  sky: SkyKind;
  isDay: boolean;
}

function pickIcon(sky: SkyKind, isDay: boolean): LucideIcon {
  switch (sky) {
    case "clear":
      return isDay ? Sun : Moon;
    case "partly":
      return isDay ? CloudSun : CloudMoon;
    case "cloudy":
      return Cloud;
    case "fog":
      return CloudFog;
    case "drizzle":
      return CloudDrizzle;
    case "rain":
      return CloudRain;
    case "snow":
      return CloudSnow;
    case "storm":
      return CloudLightning;
  }
}

export function WeatherIcon({ sky, isDay, ...props }: WeatherIconProps) {
  const Icon = pickIcon(sky, isDay);
  return <Icon aria-hidden="true" {...props} />;
}

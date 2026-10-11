import { useCallback, useEffect, useState } from "react";
import { fetchForecast } from "../lib/api";
import type { Forecast, Place, Units } from "../types";

type WeatherState =
  | { status: "loading" }
  | { status: "success"; data: Forecast }
  | { status: "error" };

export function useWeather(place: Place, units: Units) {
  const [state, setState] = useState<WeatherState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetchForecast(place.latitude, place.longitude, units, controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ status: "error" });
      });

    return () => controller.abort();
  }, [place.latitude, place.longitude, units, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, retry };
}

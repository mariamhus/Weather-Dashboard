import { useState } from "react";
import { Conditions } from "./components/Conditions";
import { CurrentPanel } from "./components/CurrentPanel";
import { DailyForecast } from "./components/DailyForecast";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { SearchBar } from "./components/SearchBar";
import { UnitToggle } from "./components/UnitToggle";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useWeather } from "./hooks/useWeather";
import type { Place, Units } from "./types";

const DEFAULT_PLACE: Place = {
  id: 2643743,
  name: "London",
  latitude: 51.50853,
  longitude: -0.12574,
  country: "United Kingdom",
  admin1: "England",
};

const MAX_RECENTS = 5;

export default function App() {
  const [units, setUnits] = useLocalStorage<Units>("weather:units", "metric");
  const [place, setPlace] = useLocalStorage<Place>("weather:place", DEFAULT_PLACE);
  const [recents, setRecents] = useLocalStorage<Place[]>("weather:recents", []);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { state, retry } = useWeather(place, units);

  function selectPlace(next: Place) {
    setPlace(next);
    setLocationError(null);
    setRecents((previous) => [next, ...previous.filter((item) => item.id !== next.id)].slice(0, MAX_RECENTS));
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setLocationError("This browser can't share your location. Search for a city instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setLocationError(null);
        setPlace({
          id: -1,
          name: "Your location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setLocating(false);
        setLocationError("Location access is turned off. Allow it in your browser settings, or search for a city.");
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <header className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-6">
        <p className="text-lg font-semibold tracking-tight">Weather</p>
        <div className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
          <SearchBar recents={recents} onSelect={selectPlace} onLocate={useMyLocation} locating={locating} />
        </div>
        <UnitToggle units={units} onChange={setUnits} />
      </header>

      {locationError && (
        <p role="alert" className="mt-4 text-sm text-muted">
          {locationError}
        </p>
      )}

      <main className="mt-6 flex-1 sm:mt-8">
        {state.status === "loading" && <LoadingState />}
        {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
        {state.status === "success" && (
          <>
            <CurrentPanel place={place} forecast={state.data} />
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <DailyForecast days={state.data.daily} />
              <Conditions forecast={state.data} units={units} />
            </div>
          </>
        )}
      </main>

      <footer className="mt-14 text-xs text-muted">
        Weather data by{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
          Open-Meteo
        </a>
      </footer>
    </div>
  );
}

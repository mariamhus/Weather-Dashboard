import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function useTheme() {
  const [stored, setStored] = useLocalStorage<Theme | null>("weather:theme", null);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia(DARK_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const theme: Theme = stored ?? (systemDark ? "dark" : "light");

  useEffect(() => {
    const root = document.documentElement;
    if (stored) {
      root.dataset.theme = stored;
    } else {
      delete root.dataset.theme;
    }
  }, [stored]);

  function toggle() {
    setStored(theme === "dark" ? "light" : "dark");
  }

  return { theme, toggle };
}

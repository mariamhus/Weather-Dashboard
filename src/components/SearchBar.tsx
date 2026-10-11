import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { LoaderCircle, LocateFixed, Search } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import { searchPlaces } from "../lib/api";
import { placeRegion } from "../lib/format";
import { useDebounce } from "../hooks/useDebounce";
import type { Place } from "../types";

interface SearchBarProps {
  recents: Place[];
  onSelect: (place: Place) => void;
  onLocate: () => void;
  locating: boolean;
}

export function SearchBar({ recents, onSelect, onLocate, locating }: SearchBarProps) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const trimmed = query.trim();
  const term = useDebounce(trimmed, 300);
  const showingRecents = trimmed.length < 2;
  const items = showingRecents ? recents : results;

  useEffect(() => {
    if (term.length < 2) {
      setResults([]);
      setError(false);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    searchPlaces(term, lang, controller.signal)
      .then((places) => {
        setResults(places);
        setError(false);
        setActive(places.length > 0 ? 0 : -1);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setResults([]);
        setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSearching(false);
      });
    return () => controller.abort();
  }, [term, lang]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function choose(place: Place) {
    onSelect(place);
    setQuery("");
    setResults([]);
    setOpen(false);
    setActive(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const place = items[active];
      if (open && place) {
        event.preventDefault();
        choose(place);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  let emptyMessage = t.typeCity;
  if (!showingRecents) {
    if (searching || term !== trimmed) emptyMessage = t.searching;
    else if (error) emptyMessage = t.searchFailed;
    else emptyMessage = t.noMatches(term);
  }

  const activeId = open && items[active] ? `${listId}-option-${active}` : undefined;

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          role="combobox"
          aria-label={t.searchPlaceholder}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-11 w-full rounded-full border border-line bg-surface ps-10 pe-10 text-base sm:text-[15px] placeholder:text-muted focus:border-rain focus:outline-none"
        />
        {searching && (
          <LoaderCircle
            aria-hidden="true"
            className="absolute end-4 top-1/2 size-4 -translate-y-1/2 text-muted motion-safe:animate-spin"
          />
        )}
      </div>

      <button
        type="button"
        onClick={onLocate}
        disabled={locating}
        aria-label={t.useMyLocation}
        title={t.useMyLocation}
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-muted disabled:opacity-60"
      >
        {locating ? (
          <LoaderCircle aria-hidden="true" className="size-4 motion-safe:animate-spin" />
        ) : (
          <LocateFixed aria-hidden="true" className="size-4" />
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-black/10">
          {showingRecents && recents.length > 0 && (
            <p className="px-4 pt-3 pb-1 text-xs text-muted">{t.recentSearches}</p>
          )}
          {items.length > 0 ? (
            <ul id={listId} role="listbox" aria-label={t.places} className="py-1">
              {items.map((place, index) => (
                <li
                  key={`${place.id}-${place.latitude}-${place.longitude}`}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => choose(place)}
                  onMouseEnter={() => setActive(index)}
                  className={`flex cursor-pointer items-baseline gap-2 px-4 py-2.5 ${
                    index === active ? "bg-line/60" : ""
                  }`}
                >
                  <span className="max-w-full shrink-0 truncate font-medium">{place.id === -1 ? t.yourLocation : place.name}</span>
                  <span className="min-w-0 truncate text-sm text-muted">{placeRegion(place, t.listSeparator)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} role="status" className="px-4 py-3 text-sm text-muted">
              {emptyMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

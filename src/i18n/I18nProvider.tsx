import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ar } from "./ar";
import { en, type Messages } from "./en";

export type Language = "en" | "ar";

const MESSAGES: Record<Language, Messages> = { en, ar };

interface I18n {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Messages;
  locale: string;
}

const I18nContext = createContext<I18n | null>(null);

function detectLanguage(): Language {
  return navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en";
}

function intlLocale(lang: Language): string {
  // Arabic text with Western digits, so dates and times match the temperatures.
  if (lang === "ar") return "ar-u-nu-latn";
  return navigator.language.toLowerCase().startsWith("en") ? navigator.language : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [stored, setLang] = useLocalStorage<Language>("weather:lang", detectLanguage());
  const lang: Language = stored === "ar" ? "ar" : "en";
  const t = MESSAGES[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t.pageTitle;
  }, [lang, t]);

  return <I18nContext value={{ lang, setLang, t, locale: intlLocale(lang) }}>{children}</I18nContext>;
}

export function useI18n(): I18n {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}

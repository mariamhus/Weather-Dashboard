import { useI18n } from "../i18n/I18nProvider";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const next = lang === "ar" ? { lang: "en" as const, label: "EN", name: "English" } : { lang: "ar" as const, label: "ع", name: "العربية" };

  return (
    <button
      type="button"
      lang={next.lang}
      onClick={() => setLang(next.lang)}
      aria-label={next.name}
      title={next.name}
      className="grid size-11 place-items-center rounded-full border border-line bg-surface text-sm font-medium text-muted transition-colors hover:text-ink"
    >
      {next.label}
    </button>
  );
}

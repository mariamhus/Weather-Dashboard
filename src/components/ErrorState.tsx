import { RotateCw } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div role="alert" className="rounded-[2rem] border border-line px-6 py-14 text-center sm:px-10">
      <p className="text-xl font-semibold tracking-tight">{t.forecastUnavailable}</p>
      <p className="mx-auto mt-2 max-w-md text-muted">{t.forecastError}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper"
      >
        <RotateCw aria-hidden="true" className="size-4" />
        {t.tryAgain}
      </button>
    </div>
  );
}

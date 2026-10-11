export function LoadingState() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading forecast</span>
      <div aria-hidden="true" className="h-[26rem] rounded-[2rem] bg-line motion-safe:animate-pulse sm:h-[30rem]" />
      <div aria-hidden="true" className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="h-72 rounded-2xl bg-line/70 motion-safe:animate-pulse" />
        <div className="h-72 rounded-2xl bg-line/70 motion-safe:animate-pulse" />
      </div>
    </div>
  );
}

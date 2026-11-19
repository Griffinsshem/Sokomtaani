export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div
        className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600 motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

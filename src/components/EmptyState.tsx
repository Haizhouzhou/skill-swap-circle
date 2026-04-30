export function EmptyState({ title, hint }: { title?: string; hint?: string }) {
  return (
    <div className="card-soft p-10 text-center">
      <p className="font-serif text-xl text-ink">{title ?? "Nothing here yet — but a small skill could change that."}</p>
      <p className="text-mutedInk mt-2 text-sm">{hint ?? "Try widening your filters, or come back in a quiet moment."}</p>
    </div>
  );
}

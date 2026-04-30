export function ImpactCounter({ value, label, hint }: { value: number | string; label: string; hint?: string }) {
  return (
    <div className="card-soft p-6 text-center">
      <p className="font-serif text-5xl text-moss leading-none">{value}</p>
      <p className="mt-2 text-ink">{label}</p>
      {hint && <p className="text-xs text-mutedInk mt-1">{hint}</p>}
    </div>
  );
}

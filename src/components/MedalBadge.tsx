import { MEDAL_BY_ID } from "@/mock/medals";
import * as Lucide from "lucide-react";

export function MedalBadge({ id, size = "md" }: { id: string; size?: "sm" | "md" }) {
  const m = MEDAL_BY_ID[id];
  if (!m) return null;
  const Icon = (Lucide as any)[m.icon] ?? Lucide.Award;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-borderSoft bg-cream ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
      title={m.description}
    >
      <Icon className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} text-clay`} />
      <span className="text-ink">{m.title}</span>
    </span>
  );
}

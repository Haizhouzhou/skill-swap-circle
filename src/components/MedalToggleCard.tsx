import { MEDAL_BY_ID } from "@/mock/medals";
import { Switch } from "@/components/ui/switch";
import * as Lucide from "lucide-react";

export function MedalToggleCard({ id, visible, onToggle, earnedAt }: { id: string; visible: boolean; onToggle: (v: boolean) => void; earnedAt?: string }) {
  const m = MEDAL_BY_ID[id];
  if (!m) return null;
  const Icon = (Lucide as any)[m.icon] ?? Lucide.Award;
  return (
    <div className="card-soft p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-accent grid place-items-center">
        <Icon className="w-5 h-5 text-moss" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-ink text-base">{m.title}</p>
        <p className="text-sm text-mutedInk">{m.description}</p>
        {earnedAt && <p className="text-xs text-mutedInk mt-1">Earned {new Date(earnedAt).toLocaleDateString()}</p>}
      </div>
      <div className="flex flex-col items-center gap-1">
        <Switch checked={visible} onCheckedChange={onToggle} />
        <span className="text-xs text-mutedInk">{visible ? "shown" : "private"}</span>
      </div>
    </div>
  );
}

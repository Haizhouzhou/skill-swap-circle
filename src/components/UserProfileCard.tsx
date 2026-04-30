import { Link } from "react-router-dom";
import type { User } from "@/mock/types";
import { MedalBadge } from "./MedalBadge";

export function UserProfileCard({ user, compact }: { user: User; compact?: boolean }) {
  return (
    <div className="card-soft p-5 flex items-start gap-4">
      <div className="w-14 h-14 rounded-full bg-sand grid place-items-center font-serif text-2xl text-moss shrink-0">{user.name[0]}</div>
      <div className="flex-1 min-w-0">
        <Link to={`/profile/${user.id}`} className="font-serif text-lg text-ink hover:text-moss transition-colors">{user.name}</Link>
        <p className="text-sm text-mutedInk">{user.city}, {user.canton} · {user.languages.join(", ")}</p>
        {!compact && <p className="text-sm text-mutedInk mt-2 leading-relaxed">{user.bio}</p>}
        {user.visibleMedalIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.visibleMedalIds.slice(0, 3).map((id) => <MedalBadge key={id} id={id} size="sm" />)}
          </div>
        )}
      </div>
    </div>
  );
}

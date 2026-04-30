import type { Listing } from "@/mock/types";
import { Link } from "react-router-dom";
import { MapPin, Clock, Languages, Globe, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequireDemoUser } from "@/hooks/useRequireDemoUser";
import { useNavigate } from "react-router-dom";
import { MEDAL_BY_ID } from "@/mock/medals";
import { getUserById } from "@/lib/appData";

export function ListingCard({ listing }: { listing: Listing }) {
  const owner = getUserById(listing.ownerUserId);
  const navigate = useNavigate();
  const { requireUser } = useRequireDemoUser();
  const isOffer = listing.type === "offer";

  function primary() {
    if (!requireUser(isOffer ? "Step in as a demo person to request this session." : "Step in as a demo person to offer help.")) return;
    navigate(`/listing/${listing.id}`);
  }

  return (
    <article className="card-soft p-5 flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-clay uppercase tracking-wide">{listing.category}</p>
          <h3 className="font-serif text-lg text-ink leading-snug mt-0.5">{listing.title}</h3>
        </div>
        <span className={`chip shrink-0 ${isOffer ? "" : "bg-sand/60"}`}>
          {isOffer ? "Teaching offer" : "Learning request"}
        </span>
      </header>

      <p className="text-sm text-mutedInk leading-relaxed line-clamp-3">{listing.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-mutedInk">
        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.city}, {listing.canton}</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{listing.durationMinutes} min</span>
        <span className="inline-flex items-center gap-1">
          {listing.mode.includes("online") && listing.mode.includes("in_person")
            ? <><Globe className="w-3.5 h-3.5" /> online or in person</>
            : listing.mode.includes("online")
              ? <><Globe className="w-3.5 h-3.5" /> online</>
              : <><UsersIcon className="w-3.5 h-3.5" /> in person</>}
        </span>
        <span className="inline-flex items-center gap-1"><Languages className="w-3.5 h-3.5" />{listing.languages.join(", ")}</span>
      </div>

      {listing.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {listing.tags.slice(0, 4).map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 mt-1 pt-3 border-t border-borderSoft">
        <Link to={`/profile/${owner?.id ?? listing.ownerUserId}`} className="flex min-w-0 items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-sand grid place-items-center font-serif text-moss text-sm">{owner?.name?.[0] ?? "?"}</span>
          <span className="min-w-0 text-sm">
            <span className="block truncate text-ink group-hover:text-moss transition-colors">{owner?.name ?? "Unknown user"}</span>
            {isOffer && owner && owner.visibleMedalIds.length > 0 && (
              <span className="block truncate text-mutedInk">· {MEDAL_BY_ID[owner.visibleMedalIds[0]]?.title}</span>
            )}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-mutedInk hover:text-ink">
            <Link to={`/listing/${listing.id}`}>View</Link>
          </Button>
          <Button size="sm" onClick={primary} className="bg-moss text-cream hover:bg-ink rounded-full">
            {isOffer ? "Request session" : "Offer help"}
          </Button>
        </div>
      </footer>
    </article>
  );
}

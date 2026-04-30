import { useMemo, useState } from "react";
import { SwapToggle } from "@/components/SwapToggle";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel, defaultFilters, type Filters } from "@/components/FilterPanel";
import { ListingGrid } from "@/components/ListingGrid";
import type { Listing, ListingType } from "@/mock/types";
import { SEED_LISTINGS } from "@/mock/listings";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import { useDemoUser } from "@/context/DemoUserContext";
import { recommendFor, matchScore } from "@/lib/match";
import { ListingCard } from "@/components/ListingCard";

export function BrowseView({ mode }: { mode: "learn" | "teach" }) {
  // /browse/learn shows OFFERS (people teaching), /browse/teach shows REQUESTS (people learning)
  const wanted: ListingType = mode === "learn" ? "offer" : "request";

  const [created] = useLocalStorage<Listing[]>(STORAGE.createdListings, []);
  const [saved] = useLocalStorage<string[]>(STORAGE.savedListings, []);
  const [clicked] = useLocalStorage<string[]>(STORAGE.clickedListings, []);
  const { user } = useDemoUser();

  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const allListings = useMemo<Listing[]>(() => [...created, ...SEED_LISTINGS], [created]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return allListings
      .filter((l) => l.type === wanted)
      .filter((l) => {
        if (filters.category !== "all" && l.category !== filters.category) return false;
        if (filters.city !== "all" && l.city !== filters.city) return false;
        if (filters.mode !== "all" && !l.mode.includes(filters.mode)) return false;
        if (filters.language !== "all" && !l.languages.includes(filters.language)) return false;
        if (filters.duration !== "all" && String(l.durationMinutes) !== filters.duration) return false;
        if (filters.beginnerOnly && !l.beginnerFriendly) return false;
        if (filters.recommendedOnly) {
          if (!user) return false;
          const m = matchScore(user, l);
          if (m.score < 30) return false;
        }
        if (text) {
          const hay = `${l.title} ${l.description} ${l.category} ${l.city} ${l.canton} ${l.tags.join(" ")}`.toLowerCase();
          if (!hay.includes(text)) return false;
        }
        return true;
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [allListings, wanted, filters, q, user]);

  const recommended = useMemo(
    () => recommendFor(user, allListings, { mode, limit: 4, saved, clicked }).filter((r) => r.score > 0),
    [user, allListings, mode, saved, clicked],
  );

  return (
    <div className="container py-10 page-fade">
      <header className="flex flex-col items-start md:items-center gap-5 mb-8">
        <SwapToggle mode={mode} />
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink text-center">
            {mode === "learn" ? "Learn something that makes life easier." : "Offer a little help."}
          </h1>
          <p className="text-mutedInk text-center mt-2">
            {mode === "learn"
              ? "These are teaching offers shared by people across Switzerland."
              : "These are gentle requests from people hoping to learn something."}
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 self-start space-y-5">
          <SearchBar value={q} onChange={setQ} />
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        <div className="space-y-10">
          {recommended.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="font-serif text-2xl text-ink">{user ? `Recommended for ${user.name}` : "A gentle starting point"}</h2>
                <p className="text-xs text-mutedInk">small skills that may fit you</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {recommended.slice(0, 4).map((r) => <ListingCard key={r.listing.id} listing={r.listing} />)}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-serif text-2xl text-ink">{mode === "learn" ? "All teaching offers" : "All learning requests"}</h2>
              <p className="text-xs text-mutedInk">{filtered.length} {filtered.length === 1 ? "listing" : "listings"}</p>
            </div>
            <ListingGrid listings={filtered} />
          </section>
        </div>
      </div>
    </div>
  );
}

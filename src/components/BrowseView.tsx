import { useMemo, useState } from "react";
import { SwapToggle } from "@/components/SwapToggle";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel, defaultFilters, type Filters } from "@/components/FilterPanel";
import { ListingGrid } from "@/components/ListingGrid";
import type { ListingType } from "@/mock/types";
import { useDemoUser } from "@/context/DemoUserContext";
import { ListingCard } from "@/components/ListingCard";
import { useBrowseListingsQuery, useRecommendationsQuery } from "@/lib/api-hooks";

export function BrowseView({ mode }: { mode: "learn" | "teach" }) {
  // /browse/learn shows OFFERS (people teaching), /browse/teach shows REQUESTS (people learning)
  const wanted: ListingType = mode === "learn" ? "offer" : "request";

  const { user } = useDemoUser();

  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const browseQuery = useBrowseListingsQuery({
    type: wanted,
    q,
    category: filters.category === "all" ? undefined : filters.category,
    city: filters.city === "all" ? undefined : filters.city,
    mode: filters.mode === "all" ? undefined : filters.mode,
    language: filters.language === "all" ? undefined : filters.language,
    duration: filters.duration === "all" ? undefined : Number(filters.duration),
    beginnerFriendly: filters.beginnerOnly || undefined,
    recommendedOnly: filters.recommendedOnly || undefined,
    userId: user?.id,
    limit: 400,
  });
  const recommendationsQuery = useRecommendationsQuery(user?.id, mode, 4);

  const filtered = useMemo(() => browseQuery.data?.items ?? [], [browseQuery.data]);
  const recommended = useMemo(
    () => (recommendationsQuery.data?.items ?? []).filter((entry) => entry.score > 0),
    [recommendationsQuery.data],
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

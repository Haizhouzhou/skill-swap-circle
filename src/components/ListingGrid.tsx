import type { Listing } from "@/mock/types";
import { ListingCard } from "./ListingCard";
import { EmptyState } from "./EmptyState";

export function ListingGrid({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) return <EmptyState />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
    </div>
  );
}

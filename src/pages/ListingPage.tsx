import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { SEED_LISTINGS } from "@/mock/listings";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE } from "@/lib/storageKeys";
import type { Listing } from "@/mock/types";
import { ListingDetail } from "@/components/ListingDetail";

export default function ListingPage() {
  const { id } = useParams();
  const [created] = useLocalStorage<Listing[]>(STORAGE.createdListings, []);
  const all = useMemo(() => [...created, ...SEED_LISTINGS], [created]);
  const listing = all.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="container py-16">
        <p className="font-serif text-2xl text-ink">This listing has wandered off.</p>
        <Link to="/browse/learn" className="text-moss hover:underline mt-3 inline-block">← Back to browse</Link>
      </div>
    );
  }
  return (
    <div className="container py-10 page-fade">
      <Link to={listing.type === "offer" ? "/browse/learn" : "/browse/teach"} className="text-sm text-mutedInk hover:text-moss">← Back to browse</Link>
      <div className="mt-4">
        <ListingDetail listing={listing} allListings={all} />
      </div>
    </div>
  );
}

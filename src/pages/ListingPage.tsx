import { useParams, Link } from "react-router-dom";
import { ListingDetail } from "@/components/ListingDetail";
import { useDemoUser } from "@/context/DemoUserContext";
import { useListingDetailQuery } from "@/lib/api-hooks";

export default function ListingPage() {
  const { id } = useParams();
  const { user } = useDemoUser();
  const { data } = useListingDetailQuery(id, user?.id);
  const listing = data?.listing;

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
        <ListingDetail listing={listing} allListings={data?.allListings ?? []} />
      </div>
    </div>
  );
}

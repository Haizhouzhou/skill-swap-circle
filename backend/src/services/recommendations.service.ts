import { collections, db } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import type { Listing, User } from "../types/domain";
import { matchScoreFor } from "./match.service";
import { clickedListingIds, savedListingIds } from "./savedListings.service";

export async function recommendations(query: { userId: string; intent: "learn" | "teach"; limit?: number }) {
  const user = (await db.collection(collections.users).doc(query.userId).get()).data() as User | undefined;
  if (!user) throw notFound(`User ${query.userId} not found`);
  const type = query.intent === "learn" ? "offer" : "request";
  const [listings, saved, clicked] = await Promise.all([db.collection(collections.listings).get(), savedListingIds(query.userId), clickedListingIds(query.userId)]);
  const scored = await Promise.all(listings.docs.map((doc) => doc.data() as Listing).filter((l) => l.type === type && l.status === "active" && l.ownerUserId !== user.id).map(async (l) => ({ listing: l, ...(await matchScoreFor(user, l, { saved, clicked })) })));
  return scored.sort((a, b) => b.score - a.score).slice(0, query.limit ?? 10);
}

import { collections, db } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import type { Listing, User } from "../types/domain";
import { clickedListingIds, savedListingIds } from "./savedListings.service";

export type MatchResult = { score: number; reasons: string[] };

export async function matchScore(userId: string, listingId: string): Promise<MatchResult> {
  const [userDoc, listingDoc, saved, clicked] = await Promise.all([db.collection(collections.users).doc(userId).get(), db.collection(collections.listings).doc(listingId).get(), savedListingIds(userId), clickedListingIds(userId)]);
  const user = userDoc.data() as User | undefined;
  const listing = listingDoc.data() as Listing | undefined;
  if (!user) throw notFound(`User ${userId} not found`);
  if (!listing) throw notFound(`Listing ${listingId} not found`);
  return matchScoreFor(user, listing, { saved, clicked });
}

export async function matchScoreFor(user: User, listing: Listing, opts?: { saved?: string[]; clicked?: string[] }): Promise<MatchResult> {
  const owner = (await db.collection(collections.users).doc(listing.ownerUserId).get()).data() as User | undefined;
  let score = 0;
  const reasons: string[] = [];
  if (user.interests.includes(listing.category)) { score += 25; reasons.push(`matches your interest in ${listing.category.toLowerCase()}`); }
  const target = listing.type === "offer" ? user.learnCategories : user.teachCategories;
  if (target.includes(listing.category)) { score += 25; reasons.push(listing.type === "offer" ? "fits something you want to learn" : "fits something you can teach"); }
  if (listing.city === user.city) { score += 15; reasons.push(`same city: ${user.city}`); } else if (listing.canton === user.canton) { score += 10; reasons.push(`same canton: ${user.canton}`); }
  const shared = listing.languages.filter((l) => user.languages.some((u) => u.toLowerCase() === l.toLowerCase()));
  if (shared.length) { score += Math.min(15, shared.length * 8); reasons.push(`shared language: ${shared.slice(0, 2).join(", ")}`); }
  if (listing.beginnerFriendly) { score += 5; reasons.push("beginner-friendly"); }
  if (opts?.saved?.includes(listing.id)) { score += 5; reasons.push("you saved this listing"); }
  if (opts?.clicked?.includes(listing.id)) { score += 5; reasons.push("similar to listings you viewed"); }
  if (owner) { score += Math.min(5, Math.round((owner.impactScore / 100) * 5)); if (owner.impactScore >= 75) reasons.push(`${owner.name} has strong community feedback`); }
  return { score: Math.min(100, score), reasons };
}

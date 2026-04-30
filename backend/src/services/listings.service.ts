import { randomUUID } from "node:crypto";
import { collections, db, getDocOrNull, nowIso } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import type { DemoRequestContext } from "../types/api";
import type { Feedback, Listing, ListingMode, ListingStatus, ListingType, Medal, SkillCategory, User } from "../types/domain";
import { matchScoreFor } from "./match.service";

export async function listListings(filters: { type?: ListingType; q?: string; category?: SkillCategory; city?: string; canton?: string; language?: string; mode?: ListingMode; duration?: number; beginnerFriendly?: boolean; recommendedFor?: string; status?: ListingStatus; limit?: number; sort?: "recommended" | "newest" | "popular"; userId?: string }) {
  let listings = (await db.collection(collections.listings).get()).docs.map((doc) => doc.data() as Listing);
  listings = listings.filter((l) => l.status === (filters.status ?? "active"));
  if (filters.type) listings = listings.filter((l) => l.type === filters.type);
  if (filters.category) listings = listings.filter((l) => l.category === filters.category);
  if (filters.city) listings = listings.filter((l) => l.city === filters.city);
  if (filters.canton) listings = listings.filter((l) => l.canton === filters.canton);
  if (filters.language) listings = listings.filter((l) => l.languages.some((x) => x.toLowerCase() === filters.language!.toLowerCase()));
  if (filters.mode) listings = listings.filter((l) => l.mode.includes(filters.mode!));
  if (filters.duration) listings = listings.filter((l) => l.durationMinutes === filters.duration);
  if (typeof filters.beginnerFriendly === "boolean") listings = listings.filter((l) => l.beginnerFriendly === filters.beginnerFriendly);
  if (filters.recommendedFor) listings = listings.filter((l) => l.recommendedFor.some((x) => x.toLowerCase().includes(filters.recommendedFor!.toLowerCase())));
  if (filters.q) listings = listings.filter((l) => l.searchText.includes(filters.q!.toLowerCase()));
  if (filters.userId) listings = listings.filter((l) => l.ownerUserId === filters.userId);
  listings.sort((a, b) => (filters.sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : b.updatedAt.localeCompare(a.updatedAt)));
  return listings.slice(0, filters.limit ?? 100);
}

export async function getListing(listingId: string): Promise<Listing> {
  const listing = await getDocOrNull<Listing>(collections.listings, listingId);
  if (!listing) throw notFound(`Listing ${listingId} not found`);
  return listing;
}

export async function getListingDetail(listingId: string, userId?: string) {
  const listing = await getListing(listingId);
  const [ownerDoc, medals, feedback] = await Promise.all([db.collection(collections.users).doc(listing.ownerUserId).get(), db.collection(collections.medalTypes).get(), db.collection(collections.feedback).get()]);
  const owner = ownerDoc.data() as User | undefined;
  if (!owner) throw notFound(`Owner ${listing.ownerUserId} not found`);
  const feedbackData = feedback.docs.map((doc) => doc.data() as Feedback).filter((f) => f.toUserId === owner.id);
  return { listing, owner, visibleMedals: medals.docs.map((doc) => doc.data() as Medal).filter((m) => owner.visibleMedalIds.includes(m.id)), feedbackTags: [...new Set(feedbackData.flatMap((f) => f.tags))], recentFeedback: feedbackData.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5), similarListings: await getSimilarListings(listingId, 4), recommendedMatches: userId ? await getRecommendedMatchesForListing(listingId, userId, 3) : [] };
}

export async function createListing(input: Omit<Listing, "id" | "source" | "ownerSessionId" | "searchText" | "createdAt" | "updatedAt">, context: DemoRequestContext): Promise<Listing> {
  const now = nowIso();
  const listing: Listing = { ...input, id: `listing_created_${randomUUID()}`, source: "created", ownerSessionId: context.demoSessionId, searchText: buildSearchText(input), createdAt: now, updatedAt: now };
  await db.collection(collections.listings).doc(listing.id).set(listing);
  return listing;
}

export async function updateListing(listingId: string, patch: Partial<Listing>): Promise<Listing> {
  const current = await getListing(listingId);
  await db.collection(collections.listings).doc(listingId).update({ ...patch, searchText: buildSearchText({ ...current, ...patch }), updatedAt: nowIso() });
  return getListing(listingId);
}
export const archiveListing = (listingId: string) => updateListing(listingId, { status: "archived" });

export async function getSimilarListings(listingId: string, limit = 4) {
  const listing = await getListing(listingId);
  return (await listListings({ type: listing.type, category: listing.category, limit: 500 })).filter((l) => l.id !== listingId).sort((a, b) => Number(b.city === listing.city) - Number(a.city === listing.city) || b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export async function getRecommendedMatchesForListing(listingId: string, userId: string, limit = 3) {
  const listing = await getListing(listingId);
  const user = (await db.collection(collections.users).doc(userId).get()).data() as User | undefined;
  if (!user) throw notFound(`User ${userId} not found`);
  const scored = await Promise.all((await listListings({ type: listing.type, limit: 500 })).filter((l) => l.id !== listingId).map(async (l) => ({ listing: l, ...(await matchScoreFor(user, l)) })));
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

function buildSearchText(listing: Pick<Listing, "title" | "description" | "category" | "tags" | "languages" | "city" | "canton">) {
  return [listing.title, listing.description, listing.category, listing.tags.join(" "), listing.languages.join(" "), listing.city, listing.canton].join(" ").toLowerCase();
}

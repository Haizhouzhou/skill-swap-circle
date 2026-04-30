import { randomUUID } from "node:crypto";
import { collections, db, nowIso } from "../firestore/db";
import { getListing } from "./listings.service";
import { getUser } from "./users.service";

export async function saveListing(userId: string, listingId: string) {
  await Promise.all([getUser(userId), getListing(listingId)]);
  const saved = { id: `${userId}_${listingId}`, userId, listingId, createdAt: nowIso() };
  await db.collection(collections.userSavedListings).doc(saved.id).set(saved, { merge: true });
  return saved;
}
export async function deleteSavedListing(userId: string, listingId: string) {
  await db.collection(collections.userSavedListings).doc(`${userId}_${listingId}`).delete();
  return { deleted: true, userId, listingId };
}
export async function listSavedListings(userId: string) {
  await getUser(userId);
  const refs = (await db.collection(collections.userSavedListings).where("userId", "==", userId).get()).docs.map((doc) => doc.data() as { listingId: string; createdAt: string });
  const listings = await Promise.all(refs.map((r) => getListing(r.listingId).catch(() => null)));
  return refs.map((r, i) => ({ ...r, listing: listings[i] })).filter((x) => x.listing).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function recordListingView(userId: string, listingId: string) {
  await Promise.all([getUser(userId), getListing(listingId)]);
  const record = { id: `history_${randomUUID()}`, userId, listingId, eventType: "listing_view", viewedAt: nowIso(), createdAt: nowIso() };
  await db.collection(collections.userListingHistory).doc(record.id).set(record);
  return record;
}
export async function savedListingIds(userId: string) {
  return (await db.collection(collections.userSavedListings).where("userId", "==", userId).get()).docs.map((doc) => (doc.data() as { listingId: string }).listingId);
}
export async function clickedListingIds(userId: string) {
  return (await db.collection(collections.userListingHistory).where("userId", "==", userId).get()).docs.map((doc) => doc.data() as { listingId?: string; eventType?: string }).filter((x) => x.eventType === "listing_view" && x.listingId).map((x) => x.listingId!);
}

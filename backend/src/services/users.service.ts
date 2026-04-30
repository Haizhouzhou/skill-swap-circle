import { randomUUID } from "node:crypto";
import { collections, db, getDocOrNull, nowIso } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import type { DemoRequestContext } from "../types/api";
import type { Feedback, Listing, Medal, SkillCategory, User } from "../types/domain";

export async function listUsers(query: { q?: string; city?: string; canton?: string; language?: string; category?: SkillCategory; limit?: number }) {
  const snapshot = await db.collection(collections.users).get();
  let users = snapshot.docs.map((doc) => doc.data() as User);
  if (query.q) users = users.filter((u) => `${u.name} ${u.bio} ${u.city}`.toLowerCase().includes(query.q!.toLowerCase()));
  if (query.city) users = users.filter((u) => u.city === query.city);
  if (query.canton) users = users.filter((u) => u.canton === query.canton);
  if (query.language) users = users.filter((u) => u.languages.some((l) => l.toLowerCase() === query.language!.toLowerCase()));
  if (query.category) users = users.filter((u) => u.interests.includes(query.category!) || u.teachCategories.includes(query.category!) || u.learnCategories.includes(query.category!));
  return users.slice(0, query.limit ?? 100);
}

export async function createUser(input: Omit<User, "id" | "source" | "createdAt" | "updatedAt" | "visibleMedalIds" | "allMedalIds" | "impactScore">, context: DemoRequestContext): Promise<User> {
  const now = nowIso();
  const user: User = { ...input, id: `user_created_${randomUUID()}`, source: "created", ownerSessionId: context.demoSessionId, bio: input.bio || `A Skillswap community member in ${input.city}.`, visibleMedalIds: [], allMedalIds: [], impactScore: 0, avatarSeed: input.avatarSeed || input.name, createdAt: now, updatedAt: now };
  await db.collection(collections.users).doc(user.id).set(user);
  return user;
}

export async function getUser(userId: string): Promise<User> {
  const user = await getDocOrNull<User>(collections.users, userId);
  if (!user) throw notFound(`User ${userId} not found`);
  return user;
}

export async function updateUser(userId: string, patch: Partial<User>): Promise<User> {
  await getUser(userId);
  await db.collection(collections.users).doc(userId).update({ ...patch, updatedAt: nowIso() });
  return getUser(userId);
}

export async function getUserProfile(userId: string) {
  const user = await getUser(userId);
  const [listings, feedback, medals, chains] = await Promise.all([db.collection(collections.listings).where("ownerUserId", "==", userId).get(), db.collection(collections.feedback).where("toUserId", "==", userId).get(), db.collection(collections.medalTypes).get(), db.collection(collections.skillChains).get()]);
  const listingData = listings.docs.map((doc) => doc.data() as Listing);
  const recentFeedback = feedback.docs.map((doc) => doc.data() as Feedback).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
  const visibleMedals = medals.docs.map((doc) => doc.data() as Medal).filter((m) => user.visibleMedalIds.includes(m.id));
  return { user, teachingOffers: listingData.filter((l) => l.type === "offer" && l.status === "active"), learningRequests: listingData.filter((l) => l.type === "request" && l.status === "active"), feedbackTags: [...new Set(recentFeedback.flatMap((f) => f.tags))], recentFeedback, visibleMedals, chainContributions: chains.docs.map((doc) => doc.data()).filter((chain) => (chain as { steps: { fromUserId: string; toUserId: string }[] }).steps.some((s) => s.fromUserId === userId || s.toUserId === userId)) };
}

export async function getUserDashboard(userId: string) {
  const user = await getUser(userId);
  const [listings, saved, sessions, receiverSessions, threads] = await Promise.all([db.collection(collections.listings).where("ownerUserId", "==", userId).get(), db.collection(collections.userSavedListings).where("userId", "==", userId).get(), db.collection(collections.sessions).where("requesterUserId", "==", userId).get(), db.collection(collections.sessions).where("receiverUserId", "==", userId).get(), db.collection(collections.chatThreads).where("participantIds", "array-contains", userId).get()]);
  return { user, listings: listings.docs.map((d) => d.data()), savedListings: saved.docs.map((d) => d.data()), sessions: [...sessions.docs, ...receiverSessions.docs].map((d) => d.data()).slice(0, 20), chatThreads: threads.docs.map((d) => d.data()).sort((a, b) => String((b as { updatedAt?: string }).updatedAt ?? "").localeCompare(String((a as { updatedAt?: string }).updatedAt ?? ""))).slice(0, 20) };
}

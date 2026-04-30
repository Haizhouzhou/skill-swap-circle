import { randomUUID } from "node:crypto";
import { collections, db, getDocOrNull, nowIso } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import { SKILLS_BY_CATEGORY } from "../seed/constants";
import type { DemoRequestContext } from "../types/api";
import type { ChatMessage, ChatThread, Feedback, Listing, Medal, Session, SkillCategory, User } from "../types/domain";

type CreateUserInput = Pick<User, "name" | "email" | "city" | "canton" | "languages" | "bio" | "interests" | "teachCategories" | "learnCategories"> &
  Partial<Pick<User, "teachSkills" | "learnSkills" | "avatarSeed">>;

function normalizeUser(user: User): User {
  return {
    ...user,
    teachSkills: user.teachSkills ?? defaultSkillsForCategories(user.teachCategories ?? [], 3),
    learnSkills: user.learnSkills ?? defaultSkillsForCategories(user.learnCategories ?? [], 3),
    points: user.points ?? Math.max(0, Math.round((user.impactScore ?? 0) / 2)),
    visibleMedalIds: user.visibleMedalIds ?? [],
    allMedalIds: user.allMedalIds ?? [],
    impactScore: user.impactScore ?? 0,
    avatarSeed: user.avatarSeed ?? user.name,
  };
}

function defaultSkillsForCategories(categories: SkillCategory[], count: number) {
  return [...new Set(categories.flatMap((category) => SKILLS_BY_CATEGORY[category] ?? []))].slice(0, count);
}

export async function listUsers(query: { q?: string; city?: string; canton?: string; language?: string; category?: SkillCategory; limit?: number }) {
  const snapshot = await db.collection(collections.users).get();
  let users = snapshot.docs.map((doc) => normalizeUser(doc.data() as User));
  if (query.q) users = users.filter((u) => `${u.name} ${u.bio} ${u.city}`.toLowerCase().includes(query.q!.toLowerCase()));
  if (query.city) users = users.filter((u) => u.city === query.city);
  if (query.canton) users = users.filter((u) => u.canton === query.canton);
  if (query.language) users = users.filter((u) => u.languages.some((l) => l.toLowerCase() === query.language!.toLowerCase()));
  if (query.category) users = users.filter((u) => u.interests.includes(query.category!) || u.teachCategories.includes(query.category!) || u.learnCategories.includes(query.category!));
  return users.slice(0, query.limit ?? 100);
}

export async function createUser(input: CreateUserInput, context: DemoRequestContext): Promise<User> {
  const now = nowIso();
  const user: User = {
    ...input,
    id: `user_created_${randomUUID()}`,
    source: "created",
    ownerSessionId: context.demoSessionId,
    bio: input.bio || `A Skillswap community member in ${input.city}.`,
    teachSkills: input.teachSkills ?? [],
    learnSkills: input.learnSkills ?? [],
    visibleMedalIds: [],
    allMedalIds: [],
    points: 20,
    impactScore: 0,
    avatarSeed: input.avatarSeed || input.name,
    createdAt: now,
    updatedAt: now,
  };
  await db.collection(collections.users).doc(user.id).set(user);
  return user;
}

export async function getUser(userId: string): Promise<User> {
  const user = await getDocOrNull<User>(collections.users, userId);
  if (!user) throw notFound(`User ${userId} not found`);
  return normalizeUser(user);
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
  const [listings, saved, requesterSessions, receiverSessions, threads, medals, chains] = await Promise.all([
    db.collection(collections.listings).where("ownerUserId", "==", userId).get(),
    db.collection(collections.userSavedListings).where("userId", "==", userId).get(),
    db.collection(collections.sessions).where("requesterUserId", "==", userId).get(),
    db.collection(collections.sessions).where("receiverUserId", "==", userId).get(),
    db.collection(collections.chatThreads).where("participantIds", "array-contains", userId).get(),
    db.collection(collections.medalTypes).get(),
    db.collection(collections.skillChains).get(),
  ]);
  const listingData = listings.docs.map((doc) => doc.data() as Listing);
  const sessionData = uniqueById([...requesterSessions.docs, ...receiverSessions.docs].map((doc) => doc.data() as Session));
  const recentSessions = sessionData
    .filter((session) => session.status === "completed" && session.completedAt)
    .sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)))
    .slice(0, 4);
  const savedRecords = saved.docs.map((doc) => doc.data() as { listingId: string; createdAt?: string });
  const savedListingPairs = await Promise.all(
    savedRecords.map(async (record) => {
      const listing = await getDocOrNull<Listing>(collections.listings, record.listingId);
      return listing ? { listing, createdAt: record.createdAt ?? "" } : null;
    }),
  );
  const recentChatThreads = await Promise.all(
    threads.docs
      .map((doc) => doc.data() as ChatThread)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4)
      .map(withRecentMessages),
  );
  return {
    user,
    teachingOffers: listingData.filter((listing) => listing.type === "offer" && listing.status === "active"),
    learningRequests: listingData.filter((listing) => listing.type === "request" && listing.status === "active"),
    savedListings: savedListingPairs
      .filter((entry): entry is { listing: Listing; createdAt: string } => Boolean(entry))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((entry) => entry.listing),
    recentSessions,
    recentChatThreads,
    visibleMedals: medals.docs.map((doc) => doc.data() as Medal).filter((medal) => user.visibleMedalIds.includes(medal.id)),
    impactSummary: {
      sessionsGiven: recentSessions.filter((session) => session.receiverUserId === user.id).length,
      sessionsTaken: recentSessions.filter((session) => session.requesterUserId === user.id).length,
      chainsJoined: chains.docs.map((doc) => doc.data()).filter((chain) => (chain as { steps: { fromUserId: string; toUserId: string }[] }).steps.some((step) => step.fromUserId === user.id || step.toUserId === user.id)).length,
      impactScore: user.impactScore,
    },
  };
}

function uniqueById<T extends { id: string }>(items: T[]) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

async function withRecentMessages(thread: ChatThread) {
  const snapshot = await db.collection(collections.chatThreads).doc(thread.id).collection("messages").orderBy("createdAt", "asc").limit(20).get();
  const messages = snapshot.docs.map((doc) => {
    const message = doc.data() as ChatMessage;
    return { id: message.id, senderId: message.senderUserId, senderUserId: message.senderUserId, text: message.text, createdAt: message.createdAt };
  });
  return {
    ...thread,
    messages: messages.length
      ? messages
      : thread.lastMessageText
        ? [{ id: `${thread.id}_last`, senderId: thread.participantIds[0] ?? "", senderUserId: thread.participantIds[0] ?? "", text: thread.lastMessageText, createdAt: thread.lastMessageAt }]
        : [],
  };
}

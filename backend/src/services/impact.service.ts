import { randomUUID } from "node:crypto";
import { collections, db, nowIso } from "../firestore/db";
import { CITIES } from "../seed/constants";
import type { AreaConnection, Feedback, Listing, Session, SkillChain, User } from "../types/domain";
import { getUser } from "./users.service";

export async function getImpact() {
  const [users, listings, sessions, chains, connections] = await Promise.all([db.collection(collections.users).get(), db.collection(collections.listings).get(), db.collection(collections.sessions).get(), db.collection(collections.skillChains).get(), db.collection(collections.areaConnections).get()]);
  const listingData = listings.docs.map((d) => d.data() as Listing);
  const sessionData = sessions.docs.map((d) => d.data() as Session);
  const chainData = chains.docs.map((d) => d.data() as SkillChain).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { counters: { users: users.size, teachingOffers: listingData.filter((l) => l.type === "offer" && l.status === "active").length, learningRequests: listingData.filter((l) => l.type === "request" && l.status === "active").length, completedSessions: sessionData.filter((s) => s.status === "completed").length, activeSkillChains: chainData.length }, featuredChains: chainData.slice(0, 5), areaConnections: connections.docs.map((d) => d.data() as AreaConnection).sort((a, b) => b.weight - a.weight), cityNodes: CITIES };
}
export async function listChains(query: { limit?: number; featured?: boolean; userId?: string }) {
  let chains = (await db.collection(collections.skillChains).get()).docs.map((doc) => doc.data() as SkillChain);
  if (query.userId) chains = chains.filter((c) => c.steps.some((s) => s.fromUserId === query.userId || s.toUserId === query.userId));
  if (query.featured) chains = chains.filter((c) => c.id === "chain_featured");
  return chains.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(0, query.limit ?? 20);
}
export async function getUserImpact(userId: string) {
  const user = await getUser(userId);
  const [sessions, feedback, chains] = await Promise.all([db.collection(collections.sessions).get(), db.collection(collections.feedback).where("toUserId", "==", userId).get(), listChains({ userId, limit: 20 })]);
  const data = sessions.docs.map((doc) => doc.data() as Session);
  return { userId, impactScore: user.impactScore, helpedCount: data.filter((s) => s.receiverUserId === userId && s.status === "completed").length, learnedCount: data.filter((s) => s.requesterUserId === userId && s.status === "completed").length, feedback: feedback.docs.map((doc) => doc.data()), chains };
}
export async function getVisualConnections() {
  const snapshot = await db.collection(collections.areaConnections).get();
  return { cityNodes: CITIES, areaConnections: snapshot.docs.map((doc) => doc.data() as AreaConnection).sort((a, b) => b.weight - a.weight) };
}
export async function recordSessionImpact(session: Session, feedback?: Feedback) {
  const now = nowIso();
  for (const [userId, delta] of [[session.receiverUserId, 3], [session.requesterUserId, 1]] as const) {
    const ref = db.collection(collections.users).doc(userId);
    const user = (await ref.get()).data() as User | undefined;
    if (user) {
      const medals = new Set(user.allMedalIds);
      medals.add("first_swap");
      if (userId === session.receiverUserId) medals.add("reliable_swapper");
      if (feedback?.tags.includes("patient")) medals.add("patient_helper");
      await ref.update({ impactScore: Math.min(100, user.impactScore + delta), allMedalIds: [...medals], visibleMedalIds: [...new Set([...user.visibleMedalIds, "first_swap"])].filter((id) => medals.has(id)), updatedAt: now });
    }
  }
  await upsertAreaConnection(session);
  const chainId = `chain_created_${randomUUID()}`;
  await db.collection(collections.skillChains).doc(chainId).set({ id: chainId, steps: [{ fromUserId: session.requesterUserId, toUserId: session.receiverUserId, skillTitle: session.skillTitle }], createdAt: now });
}
async function upsertAreaConnection(session: Session) {
  if (session.cityFrom === session.cityTo) return;
  const key = [session.cityFrom, session.cityTo].sort().join("__");
  const id = `area_${key.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
  const ref = db.collection(collections.areaConnections).doc(id);
  const current = (await ref.get()).data() as AreaConnection | undefined;
  if (!current) await ref.set({ id, sourceCity: session.cityFrom, targetCity: session.cityTo, weight: 1, topCategories: ["Swiss life"], latestSkill: session.skillTitle, updatedAt: nowIso() });
  else await ref.update({ weight: current.weight + 1, latestSkill: session.skillTitle, updatedAt: nowIso() });
}

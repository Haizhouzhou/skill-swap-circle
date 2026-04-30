import { randomUUID } from "node:crypto";
import { collections, db, getDocOrNull, nowIso } from "../firestore/db";
import { badRequest, notFound } from "../middleware/errorHandler";
import type { Session, SessionStatus } from "../types/domain";
import { addMessage, createChatThread } from "./chat.service";
import { createFeedback } from "./feedback.service";
import { recordSessionImpact } from "./impact.service";
import { getListing } from "./listings.service";
import { getUser } from "./users.service";

export async function requestSession(input: { fromUserId: string; toUserId: string; listingId: string; message: string; proposedStartAt?: string; proposedEndAt?: string; timezone?: string }) {
  if (input.proposedStartAt && input.proposedEndAt && Date.parse(input.proposedEndAt) <= Date.parse(input.proposedStartAt)) throw badRequest("proposedEndAt must be after proposedStartAt");
  const [listing, fromUser, toUser] = await Promise.all([getListing(input.listingId), getUser(input.fromUserId), getUser(input.toUserId)]);
  const now = nowIso();
  const session: Session = { id: `session_created_${randomUUID()}`, listingId: listing.id, requesterUserId: input.fromUserId, receiverUserId: input.toUserId, status: "requested", skillTitle: listing.title, cityFrom: fromUser.city, cityTo: toUser.city, message: input.message, proposedStartAt: input.proposedStartAt, proposedEndAt: input.proposedEndAt, timezone: input.timezone || "Europe/Zurich", createdAt: now, updatedAt: now };
  await db.collection(collections.sessions).doc(session.id).set(session);
  const thread = await createChatThread({ listingId: listing.id, sessionId: session.id, participantIds: [input.fromUserId, input.toUserId] });
  const firstMessage = await addMessage(thread.id, { senderUserId: input.fromUserId, text: input.message });
  await db.collection(collections.sessions).doc(session.id).update({ threadId: thread.id, updatedAt: nowIso() });
  return { session: { ...session, threadId: thread.id }, thread: { ...thread, lastMessageText: firstMessage.text, lastMessageAt: firstMessage.createdAt }, firstMessage };
}
export async function getSession(sessionId: string) {
  const session = await getDocOrNull<Session>(collections.sessions, sessionId);
  if (!session) throw notFound(`Session ${sessionId} not found`);
  return session;
}
export async function listUserSessions(query: { userId: string; status?: SessionStatus; role?: "requester" | "receiver" | "any"; limit?: number }) {
  await getUser(query.userId);
  let sessions = (await db.collection(collections.sessions).get()).docs.map((doc) => doc.data() as Session);
  sessions = sessions.filter((s) => query.role === "requester" ? s.requesterUserId === query.userId : query.role === "receiver" ? s.receiverUserId === query.userId : s.requesterUserId === query.userId || s.receiverUserId === query.userId);
  if (query.status) sessions = sessions.filter((s) => s.status === query.status);
  return sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, query.limit ?? 20);
}
export async function acceptSession(sessionId: string) { await getSession(sessionId); await db.collection(collections.sessions).doc(sessionId).update({ status: "accepted", updatedAt: nowIso() }); return getSession(sessionId); }
export async function transitionSession(sessionId: string, status: Exclude<SessionStatus, "requested" | "completed">) { await getSession(sessionId); await db.collection(collections.sessions).doc(sessionId).update({ status, updatedAt: nowIso() }); return getSession(sessionId); }
export async function completeSession(sessionId: string, input: { feedbackTags: string[]; note: string }) {
  const session = await getSession(sessionId);
  if (session.status === "completed") throw badRequest("Session is already completed");
  const completedAt = nowIso();
  const completed = { ...session, status: "completed" as const, completedAt, updatedAt: completedAt };
  await db.collection(collections.sessions).doc(sessionId).update({ status: "completed", completedAt, updatedAt: completedAt });
  const feedback = await createFeedback({ sessionId, fromUserId: session.requesterUserId, toUserId: session.receiverUserId, tags: input.feedbackTags, note: input.note });
  await recordSessionImpact(completed, feedback);
  return { session: completed, feedback };
}

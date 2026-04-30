import { randomUUID } from "node:crypto";
import { collections, db, getDocOrNull, nowIso } from "../firestore/db";
import { notFound } from "../middleware/errorHandler";
import type { ChatMessage, ChatThread } from "../types/domain";
import { getListing } from "./listings.service";
import { getUser } from "./users.service";

export async function createChatThread(input: { listingId: string; participantIds: string[]; sessionId?: string }): Promise<ChatThread> {
  await getListing(input.listingId);
  await Promise.all(input.participantIds.map((id) => getUser(id)));
  const now = nowIso();
  const thread = { id: `chat_${randomUUID()}`, listingId: input.listingId, sessionId: input.sessionId, participantIds: [...new Set(input.participantIds)], lastMessageText: "", lastMessageAt: now, createdAt: now, updatedAt: now };
  await db.collection(collections.chatThreads).doc(thread.id).set(thread);
  return thread;
}
export async function getThread(threadId: string) {
  const thread = await getDocOrNull<ChatThread>(collections.chatThreads, threadId);
  if (!thread) throw notFound(`Chat thread ${threadId} not found`);
  const messages = await db.collection(collections.chatThreads).doc(threadId).collection("messages").orderBy("createdAt", "asc").get();
  return { thread, messages: messages.docs.map((doc) => doc.data() as ChatMessage) };
}
export async function listUserChatThreads(userId: string) {
  await getUser(userId);
  return (await db.collection(collections.chatThreads).where("participantIds", "array-contains", userId).get()).docs.map((doc) => doc.data() as ChatThread).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
export async function addMessage(threadId: string, input: { senderUserId: string; text: string }) {
  const threadRef = db.collection(collections.chatThreads).doc(threadId);
  const thread = (await threadRef.get()).data() as ChatThread | undefined;
  if (!thread) throw notFound(`Chat thread ${threadId} not found`);
  await getUser(input.senderUserId);
  const now = nowIso();
  const message: ChatMessage = { id: `message_${randomUUID()}`, threadId, senderUserId: input.senderUserId, text: input.text, createdAt: now };
  await threadRef.collection("messages").doc(message.id).set(message);
  await threadRef.update({ lastMessageText: message.text, lastMessageAt: now, updatedAt: now, participantIds: thread.participantIds.includes(input.senderUserId) ? thread.participantIds : [...thread.participantIds, input.senderUserId] });
  return message;
}
export async function markThreadRead(threadId: string, actorUserId?: string) {
  const ref = db.collection(collections.chatThreads).doc(threadId);
  if (!(await ref.get()).exists) throw notFound(`Chat thread ${threadId} not found`);
  const now = nowIso();
  await ref.set({ readBy: actorUserId ? { [actorUserId]: now } : {}, updatedAt: now }, { merge: true });
  return { threadId, readAt: now };
}

import type { ChatMessage, ChatThread, Listing, Session, User } from "../types/domain";
import { dateDaysAgo, int, pick } from "./random";

export type GeneratedChat = { threads: ChatThread[]; messages: ChatMessage[] };
const snippets = ["Hi, I saw your listing. Would a short session work?", "That sounds good. I can keep it simple and practical.", "Could we do 30 minutes?", "Yes, that works for me.", "Thank you, this already feels less intimidating."];

export function generateChats(rand: () => number, users: User[], listings: Listing[], sessions: Session[], total = 120): GeneratedChat {
  const threads: ChatThread[] = [];
  const messages: ChatMessage[] = [];
  addThread(threads, messages, "chat_featured_sara_lina", "listing_german_smalltalk", ["user_sara", "user_lina"], sessions[0]?.id, ["Hi Lina, I saw your German small talk offer. Could we do a 30-minute session?", "Of course. We can practice simple introductions and everyday phrases.", "Saturday afternoon would be lovely."], dateDaysAgo(20, 14));
  while (threads.length < total) {
    const listing = pick(rand, listings);
    const owner = users.find((u) => u.id === listing.ownerUserId) ?? users[0];
    const other = pick(rand, users.filter((u) => u.id !== owner.id));
    addThread(threads, messages, `chat_${String(threads.length + 1).padStart(3, "0")}`, listing.id, [owner.id, other.id], sessions[threads.length]?.id, snippets.slice(0, int(rand, 2, snippets.length)), dateDaysAgo(int(rand, 1, 140), int(rand, 8, 19)));
  }
  return { threads, messages };
}

function addThread(threads: ChatThread[], messages: ChatMessage[], threadId: string, listingId: string, participantIds: string[], sessionId: string | undefined, texts: string[], baseDate: string) {
  const base = Date.parse(baseDate);
  const threadMessages = texts.map((text, i) => ({ id: `${threadId}_m_${i + 1}`, threadId, senderUserId: participantIds[i % participantIds.length], text, createdAt: new Date(base + i * 480000).toISOString() }));
  messages.push(...threadMessages);
  const last = threadMessages[threadMessages.length - 1];
  threads.push({ id: threadId, listingId, sessionId, participantIds, lastMessageText: last.text, lastMessageAt: last.createdAt, createdAt: threadMessages[0].createdAt, updatedAt: last.createdAt });
}

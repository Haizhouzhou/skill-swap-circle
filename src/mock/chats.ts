import type { ChatThread } from "./types";
import { SEED_LISTINGS } from "./listings";
import { USERS } from "./users";
import { makeRng, int, pick } from "./seed";

const SAMPLE_LINES = [
  "Hi, I saw your listing — would a short session work?",
  "Of course, I'd be happy to help.",
  "Saturday afternoon could work for me.",
  "Thank you, that would help a lot.",
  "Take your time, no pressure at all.",
  "Looking forward to it.",
];

function generate(): ChatThread[] {
  const rand = makeRng(2002);
  const out: ChatThread[] = [];

  // Featured Sara <-> Lina chat about German small talk
  const linaOffer = SEED_LISTINGS.find(
    (l) => l.ownerUserId === "user_lina" && l.type === "offer",
  );
  if (linaOffer) {
    out.push({
      id: "chat_featured_sara_lina",
      listingId: linaOffer.id,
      participantIds: ["user_sara", "user_lina"],
      messages: [
        { id: "m1", senderId: "user_sara", text: "Hi Lina, I saw your German small talk offer. Could we do a 30-minute session?", createdAt: new Date(2025, 3, 10, 14, 0).toISOString() },
        { id: "m2", senderId: "user_lina", text: "Of course. Saturday afternoon works for me.", createdAt: new Date(2025, 3, 10, 14, 12).toISOString() },
        { id: "m3", senderId: "user_sara", text: "Thank you, that would help a lot.", createdAt: new Date(2025, 3, 10, 14, 14).toISOString() },
      ],
    });
  }

  for (let i = 1; i < 120; i++) {
    const listing = SEED_LISTINGS[int(rand, 0, SEED_LISTINGS.length - 1)];
    const otherCandidates = USERS.filter((u) => u.id !== listing.ownerUserId);
    const other = otherCandidates[int(rand, 0, otherCandidates.length - 1)];
    const msgCount = int(rand, 2, 5);
    const messages = [];
    for (let m = 0; m < msgCount; m++) {
      const sender = m % 2 === 0 ? other.id : listing.ownerUserId;
      messages.push({
        id: `m_${i}_${m}`,
        senderId: sender,
        text: pick(rand, SAMPLE_LINES),
        createdAt: new Date(2025, int(rand, 0, 10), int(rand, 1, 28), int(rand, 8, 20), int(rand, 0, 59)).toISOString(),
      });
    }
    out.push({
      id: `chat_${i}`,
      listingId: listing.id,
      participantIds: [listing.ownerUserId, other.id],
      messages,
    });
  }
  return out;
}

export const SEED_CHATS: ChatThread[] = generate();

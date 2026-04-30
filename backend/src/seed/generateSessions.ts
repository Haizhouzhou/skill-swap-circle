import type { Listing, Session, User } from "../types/domain";
import { dateDaysAgo, int, pick } from "./random";

export function generateSessions(rand: () => number, users: User[], listings: Listing[], total = 300): Session[] {
  const offers = listings.filter((l) => l.type === "offer");
  return Array.from({ length: total }, (_, i) => {
    const listing = pick(rand, offers);
    const receiver = users.find((u) => u.id === listing.ownerUserId) ?? users[0];
    const requester = pick(rand, users.filter((u) => u.id !== receiver.id));
    const completedAt = dateDaysAgo(int(rand, 1, 180), int(rand, 8, 19));
    return {
      id: `session_${String(i + 1).padStart(3, "0")}`,
      listingId: listing.id,
      requesterUserId: requester.id,
      receiverUserId: receiver.id,
      status: "completed",
      skillTitle: listing.title,
      cityFrom: requester.city,
      cityTo: receiver.city,
      message: `Hi ${receiver.name}, could we do a short session about ${listing.title.toLowerCase()}?`,
      proposedStartAt: completedAt,
      proposedEndAt: new Date(Date.parse(completedAt) + listing.durationMinutes * 60_000).toISOString(),
      timezone: "Europe/Zurich",
      createdAt: dateDaysAgo(int(rand, 181, 260)),
      updatedAt: completedAt,
      completedAt,
    };
  });
}

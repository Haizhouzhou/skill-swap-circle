import type { Session } from "./types";
import { SEED_LISTINGS } from "./listings";
import { USERS_BY_ID } from "./users";
import { makeRng, int } from "./seed";

function generate(): Session[] {
  const rand = makeRng(412);
  const offers = SEED_LISTINGS.filter((l) => l.type === "offer");
  const out: Session[] = [];
  for (let i = 0; i < 300; i++) {
    const offer = offers[int(rand, 0, offers.length - 1)];
    const learnerIds = Object.keys(USERS_BY_ID).filter((id) => id !== offer.ownerUserId);
    const learnerId = learnerIds[int(rand, 0, learnerIds.length - 1)];
    const learner = USERS_BY_ID[learnerId];
    const owner = USERS_BY_ID[offer.ownerUserId];
    out.push({
      id: `session_${i}`,
      offerUserId: offer.ownerUserId,
      learnerUserId: learnerId,
      listingId: offer.id,
      skillTitle: offer.title,
      cityFrom: owner.city,
      cityTo: learner.city,
      completedAt: new Date(2025, int(rand, 0, 10), int(rand, 1, 28)).toISOString(),
    });
  }
  return out;
}

export const SEED_SESSIONS: Session[] = generate();

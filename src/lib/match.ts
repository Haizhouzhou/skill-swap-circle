import type { Listing, User } from "@/mock/types";
import { USERS_BY_ID } from "@/mock/users";

export type MatchResult = { score: number; reasons: string[] };

function langOverlap(a: string[], b: string[]) {
  const set = new Set(a.map((x) => x.toLowerCase()));
  return b.filter((x) => set.has(x.toLowerCase()));
}

export function matchScore(user: User | null, listing: Listing, opts?: { saved?: string[]; clicked?: string[] }): MatchResult {
  const reasons: string[] = [];
  let score = 0;
  if (!user) return { score: 0, reasons: [] };
  const owner = USERS_BY_ID[listing.ownerUserId];

  // Category overlap with interests (≤25)
  const interestHit = user.interests.includes(listing.category);
  if (interestHit) {
    score += 25;
    reasons.push(`matches your interest in ${listing.category.toLowerCase()}`);
  }

  // Match with learn/teach categories (≤25)
  const targetCats = listing.type === "offer" ? user.learnCategories : user.teachCategories;
  if (targetCats.includes(listing.category)) {
    score += 25;
    reasons.push(
      listing.type === "offer"
        ? `aligned with what you'd like to learn`
        : `aligned with what you can teach`,
    );
  }

  // Same city (15) / canton (10)
  if (listing.city === user.city) {
    score += 15;
    reasons.push(`also in ${user.city}`);
  } else if (listing.canton === user.canton) {
    score += 10;
    reasons.push(`nearby in canton ${user.canton}`);
  }

  // Language overlap (≤15)
  const shared = langOverlap(user.languages, listing.languages);
  if (shared.length) {
    score += Math.min(15, shared.length * 8);
    reasons.push(`speaks ${shared.join(" and ")}`);
  }

  // Beginner-friendly (5)
  if (listing.beginnerFriendly) {
    score += 5;
    reasons.push("beginner-friendly");
  }

  // Saved/clicked history (≤10)
  const sameCatSaved = (opts?.saved ?? [])
    .map((id) => id)
    .filter(Boolean).length;
  if (sameCatSaved) {
    score += Math.min(10, sameCatSaved * 2);
  }

  // Owner impact (≤5)
  if (owner) {
    score += Math.round((owner.impactScore / 100) * 5);
    if (owner.impactScore > 80) reasons.push(`${owner.name} has helped many people kindly`);
  }

  return { score, reasons };
}

export function recommendFor(
  user: User | null,
  listings: Listing[],
  opts: { mode: "learn" | "teach"; limit?: number; saved?: string[]; clicked?: string[] },
) {
  const wanted = opts.mode === "learn" ? "offer" : "request";
  const scored = listings
    .filter((l) => l.type === wanted)
    .map((l) => ({ listing: l, ...matchScore(user, l, { saved: opts.saved, clicked: opts.clicked }) }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, opts.limit ?? 6);
}

export function similarListings(listing: Listing, all: Listing[], limit = 4) {
  return all
    .filter((l) => l.id !== listing.id && l.type === listing.type && l.category === listing.category)
    .slice(0, limit);
}

export function reasonsSentence(user: User | null, listing: Listing) {
  if (!user) return "";
  const owner = USERS_BY_ID[listing.ownerUserId];
  const { reasons } = matchScore(user, listing);
  if (!reasons.length) return "";
  return `${owner?.name ?? "This person"} could be a good match — ${reasons.slice(0, 3).join(", ")}.`;
}

import { SKILL_CATEGORIES } from "../types/domain";
import { SKILLS_BY_CATEGORY } from "../seed/constants";
import { getListing } from "./listings.service";
import { matchScore } from "./match.service";
import { getUser } from "./users.service";

export function discoverSkills(text: string) {
  const lower = text.toLowerCase();
  const suggestedCategories = SKILL_CATEGORIES.filter((c) => lower.includes(c.toLowerCase().split(" ")[0]));
  return { suggestedCategories: suggestedCategories.length ? suggestedCategories : ["Swiss life", "Language practice", "Digital life"], suggestedSkills: Object.values(SKILLS_BY_CATEGORY).flat().filter((s) => lower.includes(s.toLowerCase().split(" ")[0])).slice(0, 5) };
}
export const recommendLearning = (intent?: "learn" | "teach") => ({ intent: intent ?? "learn", suggestions: intent === "teach" ? ["Share a tiny daily-life skill", "Answer a local learning request", "Offer a 30-minute beginner session"] : ["Practice a language phrase", "Ask for help with Swiss daily life", "Try a simple budgeting session"] });
export async function explainMatch(userId?: string, listingId?: string) { return userId && listingId ? matchScore(userId, listingId) : { score: 72, reasons: ["shared practical interest", "beginner-friendly", "works well for a short demo session"] }; }
export async function draftMessage(userId?: string, listingId?: string, text?: string) {
  const user = userId ? await getUser(userId).catch(() => null) : null;
  const listing = listingId ? await getListing(listingId).catch(() => null) : null;
  return { message: `Hi${listing ? `, I saw your listing about ${listing.title.toLowerCase()}` : ""}. ${text || "Could we set up a short Skillswap session?"}${user ? `\n\nBest,\n${user.name}` : ""}` };
}

import type { DurationMinutes, Listing, ListingMode, ListingType, SkillCategory, User } from "../types/domain";
import { AVAILABILITY_LABELS, CITIES, CONTEXT_TAGS, LANGUAGE_SUGGESTIONS, SKILLS_BY_CATEGORY } from "./constants";
import { dateDaysAgo, int, pick, sample } from "./random";

export function generateListings(rand: () => number, users: User[], offerCount = 180, requestCount = 160): Listing[] {
  const offers: Listing[] = [];
  const addOffer = (id: string, ownerId: string, title: string, city: string, canton: string, languages?: string[]) => {
    offers.push(makeListing(rand, id, "offer", users.find((u) => u.id === ownerId) ?? users[0], title, "Language practice", dateDaysAgo(offers.length + 2), { city, canton }, languages));
  };
  addOffer("listing_german_smalltalk", "user_lina", "Practice German small talk", "Basel", "BS", ["German", "English"]);
  addOffer("listing_practice_arabic_daily_phrases", "user_omar", "Practice Arabic daily phrases", "Lausanne", "VD", ["Arabic", "English"]);
  addOffer("listing_practice_spanish_small_talk", "user_014", "Practice Spanish small talk", "Geneva", "GE", ["Spanish", "English"]);
  addOffer("listing_practice_mandarin_basics", "user_021", "Practice Mandarin basics", "Zürich", "ZH", ["Mandarin", "English"]);
  addOffer("listing_practice_hindi_conversation", "user_033", "Practice Hindi conversation", "Basel", "BS", ["Hindi", "English"]);
  addOffer("listing_practice_portuguese_travel_phrases", "user_045", "Practice Portuguese travel phrases", "Bern", "BE", ["Portuguese", "English"]);
  while (offers.length < offerCount) {
    const category = pick(rand, Object.keys(SKILLS_BY_CATEGORY) as SkillCategory[]);
    offers.push(makeListing(rand, `listing_offer_${String(offers.length + 1).padStart(3, "0")}`, "offer", pick(rand, users), pick(rand, SKILLS_BY_CATEGORY[category]), category, dateDaysAgo(int(rand, 1, 160))));
  }
  const requests: Listing[] = [];
  const namedRequests: [string, string, string, SkillCategory][] = [
    ["user_sara", "I want to practice confident German introductions", "Social confidence", "Social confidence"],
    ["user_lina", "Show me how to organize Google Drive", "Digital life", "Digital life"],
    ["user_omar", "Could someone walk me through a monthly budget", "Money & budgeting", "Money & budgeting"],
    ["user_maya", "I want to practice French daily phrases", "Language practice", "Language practice"],
    ["user_noah", "I want to learn simple lunches for busy days", "Home & cooking", "Home & cooking"],
  ];
  for (const [ownerId, title, , category] of namedRequests) {
    requests.push(makeListing(rand, `listing_request_${ownerId.replace("user_", "")}`, "request", users.find((u) => u.id === ownerId) ?? users[0], title, category, dateDaysAgo(requests.length + 3)));
  }
  while (requests.length < requestCount) {
    const category = pick(rand, Object.keys(SKILLS_BY_CATEGORY) as SkillCategory[]);
    const skill = pick(rand, SKILLS_BY_CATEGORY[category]);
    requests.push(makeListing(rand, `listing_request_${String(requests.length + 1).padStart(3, "0")}`, "request", pick(rand, users), `I want to learn ${skill.toLowerCase()}`, category, dateDaysAgo(int(rand, 1, 160))));
  }
  return [...offers, ...requests];
}

function makeListing(rand: () => number, id: string, type: ListingType, owner: User, title: string, category: SkillCategory, createdAt: string, cityOverride?: { city: string; canton: string }, languageOverride?: string[]): Listing {
  const city = cityOverride ?? pick(rand, CITIES);
  const tags = sample(rand, CONTEXT_TAGS, int(rand, 1, 3));
  const languages = [...new Set(languageOverride ?? sample(rand, [...owner.languages, ...LANGUAGE_SUGGESTIONS], int(rand, 1, 3)))];
  const description = type === "offer" ? `A small, calm session about ${title.toLowerCase()}. No pressure, just practical help.` : `Looking for a kind person to help with ${title.toLowerCase()}.`;
  return {
    id, source: "seed", type, title, description, category, tags, ownerUserId: owner.id, city: city.city, canton: city.canton,
    mode: sample(rand, ["online", "in_person"] as ListingMode[], int(rand, 1, 2)),
    languages, durationMinutes: pick(rand, [20, 30, 45, 60] as DurationMinutes[]), availability: sample(rand, AVAILABILITY_LABELS, int(rand, 1, 3)),
    level: pick(rand, ["easy", "medium", "advanced"] as const), beginnerFriendly: type === "offer" ? rand() > 0.2 : true,
    recommendedFor: type === "offer" ? sample(rand, CONTEXT_TAGS, int(rand, 1, 3)) : [],
    searchText: `${title} ${description} ${category} ${tags.join(" ")} ${languages.join(" ")} ${city.city}`.toLowerCase(),
    status: "active", createdAt, updatedAt: createdAt,
  };
}

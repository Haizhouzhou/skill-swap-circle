import type { AreaConnection, Session } from "../types/domain";
import { CITIES, SKILL_CATEGORIES } from "./constants";
import { dateDaysAgo, int, sample } from "./random";

export function generateAreaConnections(rand: () => number, sessions: Session[]): AreaConnection[] {
  const byPair = new Map<string, AreaConnection>();
  for (const session of sessions) {
    if (session.cityFrom === session.cityTo) continue;
    const key = [session.cityFrom, session.cityTo].sort().join("__");
    const existing = byPair.get(key);
    if (existing) {
      existing.weight += 1;
      existing.latestSkill = session.skillTitle;
      existing.updatedAt = session.completedAt ?? session.updatedAt;
    } else {
      byPair.set(key, { id: `area_${key.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`, sourceCity: session.cityFrom, targetCity: session.cityTo, weight: 1, topCategories: sample(rand, SKILL_CATEGORIES, int(rand, 2, 4)), latestSkill: session.skillTitle, updatedAt: session.completedAt ?? session.updatedAt });
    }
  }
  const result = [...byPair.values()].sort((a, b) => b.weight - a.weight);
  for (let i = 0; i < CITIES.length - 1 && result.length < 28; i += 1) {
    const sourceCity = CITIES[i].city;
    const targetCity = CITIES[i + 1].city;
    result.push({ id: `area_extra_${i}`, sourceCity, targetCity, weight: int(rand, 1, 7), topCategories: sample(rand, SKILL_CATEGORIES, 3), latestSkill: "Use SBB / SwissPass efficiently", updatedAt: dateDaysAgo(int(rand, 1, 30)) });
  }
  return result.slice(0, 28);
}

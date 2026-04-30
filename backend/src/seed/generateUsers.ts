import type { User } from "../types/domain";
import { SKILL_CATEGORIES } from "../types/domain";
import { CITIES, FIRST_NAMES, LANGUAGE_SUGGESTIONS, MEDAL_DEFS, SKILLS_BY_CATEGORY } from "./constants";
import { dateDaysAgo, int, pick, sample } from "./random";

export const NAMED_DEMO_USER_IDS = ["user_sara", "user_lina", "user_omar", "user_maya", "user_noah"];

export function generateUsers(rand: () => number, total = 100): User[] {
  const now = dateDaysAgo(0);
  const medalIds = MEDAL_DEFS.map((m) => m.id);
  const named: User[] = [
    namedUser("user_sara", "Sara", "sara.demo@skillswap.ch", "Zürich", "ZH", ["English", "German"], ["Swiss life", "Language practice", "Home & cooking", "Social confidence"], ["Swiss life", "Home & cooking"], ["Language practice", "Social confidence"], 82, medalIds.slice(0, 5)),
    namedUser("user_lina", "Lina", "lina.demo@skillswap.ch", "Basel", "BS", ["German", "English", "French"], ["Language practice", "Wellbeing", "Study habits", "Creative"], ["Language practice", "Wellbeing"], ["Creative", "Digital life"], 96, medalIds.slice(0, 7)),
    namedUser("user_omar", "Omar", "omar.demo@skillswap.ch", "Lausanne", "VD", ["French", "English", "Arabic"], ["Home & cooking", "Study habits", "Career basics", "Money & budgeting"], ["Home & cooking", "Career basics"], ["Swiss life", "Money & budgeting"], 74, medalIds.slice(0, 4)),
    namedUser("user_maya", "Maya", "maya.demo@skillswap.ch", "Bern", "BE", ["German", "French", "English"], ["Study habits", "Swiss life", "Money & budgeting", "Social confidence"], ["Study habits", "Swiss life"], ["Money & budgeting", "Language practice"], 88, medalIds.slice(0, 6)),
    namedUser("user_noah", "Noah", "noah.demo@skillswap.ch", "Geneva", "GE", ["French", "English", "Italian"], ["Repair & DIY", "Digital life", "Wellbeing", "Career basics"], ["Repair & DIY", "Digital life"], ["Home & cooking", "Language practice"], 69, medalIds.slice(0, 3)),
  ].map((user) => ({ ...user, createdAt: now, updatedAt: now }));

  const users = [...named];
  for (let i = users.length; i < total; i += 1) {
    const name = FIRST_NAMES[i % FIRST_NAMES.length];
    const city = pick(rand, CITIES);
    const interests = sample(rand, SKILL_CATEGORIES, int(rand, 3, 5));
    const teachCategories = sample(rand, interests, 2);
    const learnCategories = sample(rand, SKILL_CATEGORIES, 2);
    const allMedalIds = sample(rand, medalIds, int(rand, 1, 6));
    users.push({
      id: `user_${String(i + 1).padStart(3, "0")}`,
      source: "seed",
      name,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.demo${i}@skillswap.ch`,
      city: city.city,
      canton: city.canton,
      languages: sample(rand, LANGUAGE_SUGGESTIONS, int(rand, 1, 3)),
      bio: `${name} is part of the Skillswap demo community in ${city.city}.`,
      interests,
      teachCategories,
      learnCategories,
      teachSkills: skillsForCategories(rand, teachCategories, 3),
      learnSkills: skillsForCategories(rand, learnCategories, 3),
      visibleMedalIds: allMedalIds.slice(0, 3),
      allMedalIds,
      points: int(rand, 5, 95),
      impactScore: int(rand, 20, 99),
      avatarSeed: `seed_${i}`,
      createdAt: dateDaysAgo(int(rand, 10, 180)),
      updatedAt: now,
    });
  }
  return users;
}

function namedUser(id: string, name: string, email: string, city: string, canton: string, languages: string[], interests: User["interests"], teachCategories: User["teachCategories"], learnCategories: User["learnCategories"], impactScore: number, allMedalIds: string[]): User {
  return { id, source: "seed", name, email, city, canton, languages, bio: `${name} swaps practical everyday skills from ${city}.`, interests, teachCategories, learnCategories, teachSkills: defaultSkillsForCategories(teachCategories, 2), learnSkills: defaultSkillsForCategories(learnCategories, 2), points: Math.max(5, Math.round(impactScore * 0.6)), impactScore, allMedalIds, visibleMedalIds: allMedalIds.slice(0, 3), avatarSeed: id, createdAt: "", updatedAt: "" };
}

function skillsForCategories(rand: () => number, categories: User["teachCategories"], count: number) {
  const pool = [...new Set(categories.flatMap((category) => SKILLS_BY_CATEGORY[category] ?? []))];
  return sample(rand, pool, count);
}

function defaultSkillsForCategories(categories: User["teachCategories"], count: number) {
  return [...new Set(categories.flatMap((category) => SKILLS_BY_CATEGORY[category] ?? []))].slice(0, count);
}

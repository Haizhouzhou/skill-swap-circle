import type { User, SkillCategory } from "./types";
import { CITIES, FIRST_NAMES, CATEGORIES } from "./constants";
import { makeRng, pick, pickN, int, chance } from "./seed";

const NAMED: User[] = [
  {
    id: "user_sara",
    name: "Sara",
    email: "sara.demo@skillswap.ch",
    city: "Zürich",
    canton: "ZH",
    languages: ["English", "German"],
    bio: "New to Zürich and quietly learning how daily life works here. Happy to share small practical things that helped me settle in.",
    interests: ["Swiss life", "Language practice", "Home & cooking", "Social confidence"],
    teachCategories: ["Swiss life", "Home & cooking"],
    learnCategories: ["Language practice", "Social confidence"],
    visibleMedalIds: ["first_swap", "swiss_life_guide", "friendly_teacher"],
    allMedalIds: ["first_swap", "swiss_life_guide", "friendly_teacher", "patient_helper"],
    points: 42,
    impactScore: 82,
    avatarSeed: "sara",
  },
  {
    id: "user_lina",
    name: "Lina",
    email: "lina.demo@skillswap.ch",
    city: "Basel",
    canton: "BS",
    languages: ["German", "English", "French"],
    bio: "Enjoys calm conversations and helping newcomers feel less lost in everyday situations.",
    interests: ["Language practice", "Wellbeing", "Study habits", "Creative"],
    teachCategories: ["Language practice", "Wellbeing"],
    learnCategories: ["Creative", "Digital life"],
    visibleMedalIds: ["patient_helper", "language_supporter", "community_builder"],
    allMedalIds: ["patient_helper", "language_supporter", "community_builder", "five_helped", "reliable_swapper"],
    points: 73,
    impactScore: 96,
    avatarSeed: "lina",
  },
  {
    id: "user_omar",
    name: "Omar",
    email: "omar.demo@skillswap.ch",
    city: "Lausanne",
    canton: "VD",
    languages: ["French", "English", "Arabic"],
    bio: "Likes practical skills, simple food, and helping people make daily routines easier.",
    interests: ["Home & cooking", "Study habits", "Career basics", "Money & budgeting"],
    teachCategories: ["Home & cooking", "Career basics"],
    learnCategories: ["Swiss life", "Money & budgeting"],
    visibleMedalIds: ["budget_buddy", "daily_life_hero"],
    allMedalIds: ["budget_buddy", "daily_life_hero", "first_swap", "friendly_teacher"],
    points: 31,
    impactScore: 74,
    avatarSeed: "omar",
  },
  {
    id: "user_maya",
    name: "Maya",
    email: "maya.demo@skillswap.ch",
    city: "Bern",
    canton: "BE",
    languages: ["German", "French", "English"],
    bio: "A careful planner who enjoys sharing small systems for study, housing, and daily organization.",
    interests: ["Study habits", "Swiss life", "Money & budgeting", "Social confidence"],
    teachCategories: ["Study habits", "Swiss life"],
    learnCategories: ["Money & budgeting", "Language practice"],
    visibleMedalIds: ["reliable_swapper", "swiss_life_guide", "five_helped"],
    allMedalIds: ["reliable_swapper", "swiss_life_guide", "five_helped", "patient_helper", "chain_starter"],
    points: 58,
    impactScore: 88,
    avatarSeed: "maya",
  },
  {
    id: "user_noah",
    name: "Noah",
    email: "noah.demo@skillswap.ch",
    city: "Geneva",
    canton: "GE",
    languages: ["French", "English", "Italian"],
    bio: "Good with practical repairs and digital safety. Believes useful knowledge should be easy to share.",
    interests: ["Repair & DIY", "Digital life", "Wellbeing", "Career basics"],
    teachCategories: ["Repair & DIY", "Digital life"],
    learnCategories: ["Home & cooking", "Language practice"],
    visibleMedalIds: ["first_swap", "daily_life_hero"],
    allMedalIds: ["first_swap", "daily_life_hero", "friendly_teacher"],
    points: 24,
    impactScore: 69,
    avatarSeed: "noah",
  },
];

export const NAMED_USER_IDS = NAMED.map((u) => u.id);

function generateUsers(): User[] {
  const rand = makeRng(20240501);
  const out: User[] = [...NAMED];
  const usedNames = new Set(NAMED.map((u) => u.name.toLowerCase()));
  let idCounter = 1;
  while (out.length < 100) {
    const first = pick(rand, FIRST_NAMES);
    const slug = `${first.toLowerCase().replace(/[^a-z]/g, "")}${idCounter}`;
    if (usedNames.has(slug)) {
      idCounter++;
      continue;
    }
    usedNames.add(slug);
    const cc = pick(rand, CITIES);
    const langs = pickN(rand, ["German", "French", "Italian", "English"], int(rand, 1, 3));
    if (!langs.length) langs.push("English");
    const interests = pickN(rand, CATEGORIES, int(rand, 2, 4)) as SkillCategory[];
    const teachCategories = pickN(rand, interests, Math.min(2, interests.length));
    const learnCategories = pickN(
      rand,
      CATEGORIES.filter((c) => !teachCategories.includes(c)),
      int(rand, 1, 2),
    ) as SkillCategory[];
    const allMedals = pickN(
      rand,
      ["first_swap", "patient_helper", "daily_life_hero", "swiss_life_guide", "budget_buddy", "friendly_teacher", "language_supporter", "community_builder", "five_helped", "chain_starter", "reliable_swapper"],
      int(rand, 1, 4),
    );
    const visibleMedals = allMedals.filter(() => chance(rand, 0.7));
    out.push({
      id: `user_${slug}`,
      name: first,
      email: `${first.toLowerCase()}.demo@skillswap.ch`,
      city: cc.city,
      canton: cc.canton,
      languages: langs,
      bio: `Lives in ${cc.city} and enjoys quiet, useful exchanges with people nearby.`,
      interests,
      teachCategories: teachCategories as SkillCategory[],
      learnCategories,
      visibleMedalIds: visibleMedals,
      allMedalIds: allMedals,
      points: int(rand, 5, 95),
      impactScore: int(rand, 20, 99),
      avatarSeed: slug,
    });
    idCounter++;
  }
  return out;
}

export const USERS: User[] = generateUsers();
export const USERS_BY_ID: Record<string, User> = Object.fromEntries(USERS.map((u) => [u.id, u]));

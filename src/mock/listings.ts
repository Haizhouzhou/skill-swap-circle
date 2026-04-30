import type { Listing, SkillCategory } from "./types";
import { USERS } from "./users";
import { SKILLS_BY_CATEGORY, REQUEST_PREFIX, AVAILABILITY_LABELS, CONTEXT_TAGS, CATEGORIES } from "./constants";
import { makeRng, pick, pickN, int, chance } from "./seed";

function generate(): Listing[] {
  const rand = makeRng(771);
  const out: Listing[] = [];

  function makeOne(type: "offer" | "request", idx: number): Listing {
    const user = type === "offer"
      ? USERS[int(rand, 0, USERS.length - 1)]
      : USERS[int(rand, 0, USERS.length - 1)];
    const category: SkillCategory =
      (type === "offer"
        ? user.teachCategories[int(rand, 0, Math.max(0, user.teachCategories.length - 1))]
        : user.learnCategories[int(rand, 0, Math.max(0, user.learnCategories.length - 1))]) ??
      pick(rand, CATEGORIES);
    const skill = pick(rand, SKILLS_BY_CATEGORY[category]);
    const title =
      type === "offer"
        ? skill
        : `${pick(rand, REQUEST_PREFIX[category] ?? ["I want to learn"])} ${skill.toLowerCase()}`;
    const langs = pickN(rand, user.languages.length ? user.languages : ["English"], Math.min(2, Math.max(1, user.languages.length)));
    const modes: ("online" | "in_person")[] = chance(rand, 0.5)
      ? ["in_person"]
      : chance(rand, 0.5)
        ? ["online"]
        : ["online", "in_person"];
    const dur = pick(rand, [20, 30, 45, 60] as const);
    const avail = pickN(rand, AVAILABILITY_LABELS, int(rand, 1, 3)).map((s) => ({
      day: s.day as any,
      label: s.label,
    }));
    const tags = type === "offer"
      ? pickN(rand, ["beginner-friendly", "calm pace", "newcomer welcome", "practical", "everyday", "step by step"], int(rand, 1, 3))
      : pickN(rand, CONTEXT_TAGS, int(rand, 1, 3));
    const beginnerFriendly = type === "offer" ? chance(rand, 0.7) : chance(rand, 0.5);
    const description =
      type === "offer"
        ? `A small, calm session about ${skill.toLowerCase()}. No pressure, just something useful to pass on.`
        : `Looking for someone patient who could help me with ${skill.toLowerCase()}. It would make my week a little lighter.`;
    return {
      id: `${type}_${idx}`,
      type,
      title,
      description,
      category,
      tags,
      ownerUserId: user.id,
      city: user.city,
      canton: user.canton,
      mode: modes,
      languages: langs,
      durationMinutes: dur,
      availability: avail,
      level: pick(rand, ["easy", "easy", "medium", "advanced"] as const),
      beginnerFriendly,
      recommendedFor: type === "offer"
        ? pickN(rand, ["newcomers", "students", "living alone", "career change"], int(rand, 1, 2))
        : [],
      createdAt: new Date(2025, int(rand, 0, 11), int(rand, 1, 28)).toISOString(),
    };
  }

  for (let i = 0; i < 180; i++) out.push(makeOne("offer", i));
  for (let i = 0; i < 160; i++) out.push(makeOne("request", i));

  // Ensure each named demo user has at least one offer and one request.
  const named = ["user_sara", "user_lina", "user_omar", "user_maya", "user_noah"];
  for (const uid of named) {
    const u = USERS.find((x) => x.id === uid)!;
    if (!out.some((l) => l.ownerUserId === uid && l.type === "offer")) {
      const cat = u.teachCategories[0] ?? "Swiss life";
      out.push({
        id: `offer_named_${uid}`,
        type: "offer",
        title: pick(rand, SKILLS_BY_CATEGORY[cat]),
        description: `A calm session about ${cat.toLowerCase()} from ${u.name}.`,
        category: cat,
        tags: ["beginner-friendly", "calm pace"],
        ownerUserId: uid,
        city: u.city,
        canton: u.canton,
        mode: ["in_person", "online"],
        languages: u.languages.slice(0, 2),
        durationMinutes: 30,
        availability: [{ day: "Saturday", label: "Saturday afternoon" }],
        level: "easy",
        beginnerFriendly: true,
        recommendedFor: ["newcomers"],
        createdAt: new Date(2025, 3, 12).toISOString(),
      });
    }
    if (!out.some((l) => l.ownerUserId === uid && l.type === "request")) {
      const cat = u.learnCategories[0] ?? "Language practice";
      out.push({
        id: `request_named_${uid}`,
        type: "request",
        title: `I want to learn ${pick(rand, SKILLS_BY_CATEGORY[cat]).toLowerCase()}`,
        description: `${u.name} would love a little help with something practical.`,
        category: cat,
        tags: ["newcomer"],
        ownerUserId: uid,
        city: u.city,
        canton: u.canton,
        mode: ["in_person", "online"],
        languages: u.languages.slice(0, 2),
        durationMinutes: 30,
        availability: [{ day: "Sunday", label: "Sunday afternoon" }],
        level: "easy",
        beginnerFriendly: true,
        recommendedFor: [],
        createdAt: new Date(2025, 3, 14).toISOString(),
      });
    }
  }

  return out;
}

export const SEED_LISTINGS: Listing[] = generate();

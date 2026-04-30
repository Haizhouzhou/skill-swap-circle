import type { SkillChain } from "./types";
import { USERS } from "./users";
import { SEED_LISTINGS } from "./listings";
import { makeRng, int } from "./seed";

function generate(): SkillChain[] {
  const out: SkillChain[] = [];
  // Featured chain
  out.push({
    id: "chain_featured",
    steps: [
      { fromUserId: "user_lina", toUserId: "user_sara", skillTitle: "Practice German small talk" },
      { fromUserId: "user_sara", toUserId: "user_omar", skillTitle: "Use SBB / SwissPass efficiently" },
      { fromUserId: "user_omar", toUserId: "user_maya", skillTitle: "Cook cheap student meals" },
    ],
  });
  const rand = makeRng(303);
  const offers = SEED_LISTINGS.filter((l) => l.type === "offer");
  for (let i = 1; i < 40; i++) {
    const stepCount = int(rand, 2, 4);
    const steps = [];
    let prev = USERS[int(rand, 0, USERS.length - 1)].id;
    for (let s = 0; s < stepCount; s++) {
      let next = USERS[int(rand, 0, USERS.length - 1)].id;
      while (next === prev) next = USERS[int(rand, 0, USERS.length - 1)].id;
      const skill = offers[int(rand, 0, offers.length - 1)].title;
      steps.push({ fromUserId: prev, toUserId: next, skillTitle: skill });
      prev = next;
    }
    out.push({ id: `chain_${i}`, steps });
  }
  return out;
}

export const SEED_CHAINS: SkillChain[] = generate();

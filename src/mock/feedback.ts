import type { Feedback } from "./types";
import { SEED_SESSIONS } from "./sessions";
import { FEEDBACK_TAGS } from "./constants";
import { makeRng, pick, pickN, int } from "./seed";

const NOTES = [
  "Felt calm and useful.",
  "I learned something I'll actually use this week.",
  "Kind and unhurried.",
  "Made me feel welcome.",
  "Patient with my questions.",
  "Simple and easy to follow.",
  "A small thing that made my week lighter.",
  "Thank you for taking the time.",
];

function generate(): Feedback[] {
  const rand = makeRng(909);
  const out: Feedback[] = [];
  for (let i = 0; i < 250; i++) {
    const s = SEED_SESSIONS[int(rand, 0, SEED_SESSIONS.length - 1)];
    out.push({
      id: `fb_${i}`,
      sessionId: s.id,
      fromUserId: s.learnerUserId,
      toUserId: s.offerUserId,
      tags: pickN(rand, FEEDBACK_TAGS, int(rand, 1, 3)),
      note: pick(rand, NOTES),
    });
  }
  return out;
}

export const SEED_FEEDBACK: Feedback[] = generate();

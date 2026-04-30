import type { Feedback, Session } from "../types/domain";
import { FEEDBACK_TAGS } from "./constants";
import { int, pick, sample } from "./random";

const notes = ["They explained everything calmly and made it easy to try.", "A very kind session with practical steps I can use this week.", "Patient, clear, and generous with time.", "It helped me feel more confident about a daily-life task.", "Simple advice, no pressure, exactly what I needed."];

export function generateFeedback(rand: () => number, sessions: Session[], total = 250): Feedback[] {
  return Array.from({ length: total }, (_, i) => {
    const session = sessions[i % sessions.length];
    return { id: `feedback_${String(i + 1).padStart(3, "0")}`, sessionId: session.id, fromUserId: session.requesterUserId, toUserId: session.receiverUserId, tags: sample(rand, FEEDBACK_TAGS, int(rand, 2, 4)), note: pick(rand, notes), createdAt: session.completedAt ?? session.updatedAt };
  });
}

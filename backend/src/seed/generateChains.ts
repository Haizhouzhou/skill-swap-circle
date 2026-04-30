import type { Session, SkillChain } from "../types/domain";
import { dateDaysAgo, int } from "./random";

export function generateChains(rand: () => number, sessions: Session[], total = 40): SkillChain[] {
  return Array.from({ length: total }, (_, i) => ({
    id: i === 0 ? "chain_featured" : `chain_${String(i + 1).padStart(3, "0")}`,
    steps: Array.from({ length: int(rand, 3, 5) }, (_x, step) => {
      const session = sessions[(i * 5 + step) % sessions.length];
      return { fromUserId: session.requesterUserId, toUserId: session.receiverUserId, skillTitle: session.skillTitle };
    }),
    createdAt: dateDaysAgo(int(rand, 1, 120)),
  }));
}

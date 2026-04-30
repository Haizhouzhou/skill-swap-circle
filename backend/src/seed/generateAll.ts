import { env } from "../config/env";
import type { AreaConnection, ChatMessage, ChatThread, Feedback, Listing, Medal, Session, SkillChain, User } from "../types/domain";
import { generateAreaConnections } from "./generateAreaConnections";
import { generateChats } from "./generateChats";
import { generateChains } from "./generateChains";
import { generateFeedback } from "./generateFeedback";
import { generateListings } from "./generateListings";
import { generateMedals } from "./generateMedals";
import { generateSessions } from "./generateSessions";
import { generateUsers, NAMED_DEMO_USER_IDS } from "./generateUsers";
import { mulberry32 } from "./random";

export type GeneratedSeedData = { users: User[]; listings: Listing[]; sessions: Session[]; chatThreads: ChatThread[]; chatMessages: ChatMessage[]; feedback: Feedback[]; skillChains: SkillChain[]; areaConnections: AreaConnection[]; medals: Medal[]; namedDemoUserIds: string[]; stats: Record<string, number | string> };

export function generateAllSeedData(): GeneratedSeedData {
  const rand = mulberry32(Number(env.demoSeedVersion) || 1);
  const medals = generateMedals();
  const users = generateUsers(rand, 100);
  const listings = generateListings(rand, users, 180, 160);
  const sessions = generateSessions(rand, users, listings, 300);
  const chats = generateChats(rand, users, listings, sessions, 120);
  const feedback = generateFeedback(rand, sessions, 250);
  const skillChains = generateChains(rand, sessions, 40);
  const areaConnections = generateAreaConnections(rand, sessions);
  return {
    users, listings, sessions, chatThreads: chats.threads, chatMessages: chats.messages, feedback, skillChains, areaConnections, medals, namedDemoUserIds: NAMED_DEMO_USER_IDS,
    stats: { seedVersion: env.demoSeedVersion, users: users.length, offers: listings.filter((l) => l.type === "offer").length, requests: listings.filter((l) => l.type === "request").length, sessions: sessions.length, chatThreads: chats.threads.length, feedback: feedback.length, skillChains: skillChains.length, areaConnections: areaConnections.length, medals: medals.length },
  };
}

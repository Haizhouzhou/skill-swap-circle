export const SKILL_CATEGORIES = [
  "Swiss life",
  "Home & cooking",
  "Social confidence",
  "Study habits",
  "Money & budgeting",
  "Digital life",
  "Repair & DIY",
  "Career basics",
  "Language practice",
  "Wellbeing",
  "Creative",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const LISTING_TYPES = ["offer", "request"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];
export const LISTING_MODES = ["online", "in_person"] as const;
export type ListingMode = (typeof LISTING_MODES)[number];
export const DURATIONS = [20, 30, 45, 60] as const;
export type DurationMinutes = (typeof DURATIONS)[number];
export const LEVELS = ["easy", "medium", "advanced"] as const;
export type Level = (typeof LEVELS)[number];
export const LISTING_STATUSES = ["active", "archived"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];
export const SESSION_STATUSES = ["requested", "accepted", "declined", "completed", "cancelled"] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];
export type Source = "seed" | "created";

export type AvailabilitySlot = { day: string; label: string };

export type User = {
  id: string;
  source: Source;
  ownerSessionId?: string;
  name: string;
  email: string;
  city: string;
  canton: string;
  languages: string[];
  bio: string;
  interests: SkillCategory[];
  teachCategories: SkillCategory[];
  learnCategories: SkillCategory[];
  teachSkills: string[];
  learnSkills: string[];
  visibleMedalIds: string[];
  allMedalIds: string[];
  points: number;
  impactScore: number;
  avatarSeed: string;
  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  id: string;
  source: Source;
  ownerSessionId?: string;
  type: ListingType;
  title: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  ownerUserId: string;
  city: string;
  canton: string;
  mode: ListingMode[];
  languages: string[];
  durationMinutes: DurationMinutes;
  availability: AvailabilitySlot[];
  level: Level;
  beginnerFriendly: boolean;
  recommendedFor: string[];
  searchText: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  listingId: string;
  requesterUserId: string;
  receiverUserId: string;
  status: SessionStatus;
  skillTitle: string;
  cityFrom: string;
  cityTo: string;
  message: string;
  proposedStartAt?: string;
  proposedEndAt?: string;
  timezone: string;
  threadId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type ChatThread = {
  id: string;
  listingId: string;
  sessionId?: string;
  participantIds: string[];
  lastMessageText: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = { id: string; threadId: string; senderUserId: string; text: string; createdAt: string };
export type Feedback = { id: string; sessionId: string; fromUserId: string; toUserId: string; tags: string[]; note: string; createdAt: string };
export type SkillChain = { id: string; steps: { fromUserId: string; toUserId: string; skillTitle: string }[]; createdAt: string };
export type AreaConnection = { id: string; sourceCity: string; targetCity: string; weight: number; topCategories: SkillCategory[]; latestSkill: string; updatedAt: string };
export type Medal = { id: string; title: string; description: string; icon: string };
export type DemoSession = { id: string; selectedUserId?: string; createdAt: string; updatedAt: string; seedVersion?: string };
export type CityNode = { city: string; canton: string; x: number; y: number };

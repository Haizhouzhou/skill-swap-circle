export type SkillCategory =
  | "Swiss life"
  | "Home & cooking"
  | "Social confidence"
  | "Study habits"
  | "Money & budgeting"
  | "Digital life"
  | "Repair & DIY"
  | "Career basics"
  | "Language practice"
  | "Wellbeing"
  | "Creative";

export type ListingType = "offer" | "request";

export type AvailabilitySlot = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  label: string;
};

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  ownerUserId: string;
  city: string;
  canton: string;
  mode: ("online" | "in_person")[];
  languages: string[];
  durationMinutes: 20 | 30 | 45 | 60;
  availability: AvailabilitySlot[];
  level: "easy" | "medium" | "advanced";
  beginnerFriendly: boolean;
  recommendedFor: string[];
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  city: string;
  canton: string;
  languages: string[];
  bio: string;
  interests: SkillCategory[];
  teachCategories: SkillCategory[];
  learnCategories: SkillCategory[];
  teachSkills?: string[];
  learnSkills?: string[];
  visibleMedalIds: string[];
  allMedalIds: string[];
  points: number;
  impactScore: number;
  avatarSeed: string;
};

export type Medal = {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  listingId: string;
  participantIds: string[];
  messages: ChatMessage[];
};

export type Session = {
  id: string;
  offerUserId: string;
  learnerUserId: string;
  listingId: string;
  skillTitle: string;
  cityFrom: string;
  cityTo: string;
  completedAt: string;
};

export type Feedback = {
  id: string;
  sessionId: string;
  fromUserId: string;
  toUserId: string;
  tags: string[];
  note: string;
};

export type SkillChain = {
  id: string;
  steps: {
    fromUserId: string;
    toUserId: string;
    skillTitle: string;
  }[];
};

export type AreaConnection = {
  sourceCity: string;
  targetCity: string;
  weight: number;
  topCategories: SkillCategory[];
  latestSkill: string;
};

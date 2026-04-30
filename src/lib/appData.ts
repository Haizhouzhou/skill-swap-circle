import { STORAGE } from "@/lib/storageKeys";
import { AREA_CONNECTIONS } from "@/mock/areaConnections";
import { SEED_CHATS } from "@/mock/chats";
import { SEED_CHAINS } from "@/mock/chains";
import { CATEGORIES, CITIES, LANGUAGES } from "@/mock/constants";
import { SEED_FEEDBACK } from "@/mock/feedback";
import { SEED_LISTINGS } from "@/mock/listings";
import { MEDAL_LIBRARY } from "@/mock/medals";
import { SEED_SESSIONS } from "@/mock/sessions";
import type { ChatThread, Listing, Medal, Session, SkillCategory, User } from "@/mock/types";
import { USERS } from "@/mock/users";

type Meta = {
  categories: typeof CATEGORIES;
  cities: typeof CITIES;
  languages: typeof LANGUAGES;
  durations: [20, 30, 45, 60];
  modes: ["online", "in_person"];
  levels: ["easy", "medium", "advanced"];
};

export function getMeta(): Meta {
  return {
    categories: CATEGORIES,
    cities: CITIES,
    languages: LANGUAGES,
    durations: [20, 30, 45, 60],
    modes: ["online", "in_person"],
    levels: ["easy", "medium", "advanced"],
  };
}

export function getCustomUser() {
  return readStorage<User | null>(STORAGE.customProfile, null);
}

export function getAllUsers() {
  const customUser = getCustomUser();
  return customUser ? [...USERS, withUserDefaults(customUser)] : USERS;
}

export function getUsersById() {
  return Object.fromEntries(getAllUsers().map((user) => [user.id, user])) as Record<string, User>;
}

export function getUserById(userId: string) {
  return getUsersById()[userId] ?? null;
}

export function getCreatedListings() {
  return readStorage<Listing[]>(STORAGE.createdListings, []).map(withListingDefaults);
}

export function getAllListings() {
  return [...getCreatedListings(), ...SEED_LISTINGS.map(withListingDefaults)];
}

export function getSavedListingIds() {
  return readStorage<string[]>(STORAGE.savedListings, []);
}

export function getClickedListingIds() {
  return readStorage<string[]>(STORAGE.clickedListings, []);
}

export function getStoredChatThreads() {
  return readStorage<ChatThread[]>(STORAGE.chatThreads, []);
}

export function getAllChatThreads() {
  const map = new Map<string, ChatThread>();
  [...SEED_CHATS, ...getStoredChatThreads()].forEach((thread) => map.set(thread.id, thread));
  return [...map.values()];
}

export function getSessions() {
  return SEED_SESSIONS;
}

export function getFeedback() {
  return SEED_FEEDBACK;
}

export function getMedals() {
  return MEDAL_LIBRARY as Medal[];
}

export function getBootstrapData() {
  const users = getAllUsers();
  const listings = getAllListings();
  return {
    demoUsers: users.slice(0, 5),
    users,
    listings,
    medals: getMedals(),
    featuredChains: SEED_CHAINS,
    areaConnections: AREA_CONNECTIONS,
    cityNodes: CITIES.map((entry) => ({ ...entry })),
    stats: {
      users: users.length,
      teachingOffers: listings.filter((listing) => listing.type === "offer").length,
      learningRequests: listings.filter((listing) => listing.type === "request").length,
      completedSessions: getSessions().length,
      activeSkillChains: SEED_CHAINS.length,
    },
  };
}

export function setCreatedListings(listings: Listing[]) {
  writeStorage(STORAGE.createdListings, listings);
}

export function setCustomUser(user: User | null) {
  writeStorage(STORAGE.customProfile, user);
}

export function withListingDefaults(listing: Listing): Listing {
  return {
    ...listing,
    createdAt: listing.createdAt ?? new Date().toISOString(),
  };
}

export function withUserDefaults(user: User): User {
  return {
    ...user,
    teachSkills: user.teachSkills ?? [],
    learnSkills: user.learnSkills ?? [],
  };
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function makeCreatedUser(input: {
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
}) {
  const slug = input.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_") || "created";
  const now = new Date().toISOString();
  return withUserDefaults({
    id: `user_created_${slug}`,
    name: input.name.trim(),
    email: input.email.trim(),
    city: input.city,
    canton: input.canton,
    languages: input.languages,
    bio: input.bio.trim(),
    interests: input.interests,
    teachCategories: input.teachCategories,
    learnCategories: input.learnCategories,
    teachSkills: input.teachSkills ?? [],
    learnSkills: input.learnSkills ?? [],
    visibleMedalIds: [],
    allMedalIds: [],
    points: 20,
    impactScore: 0,
    avatarSeed: slug,
  });
}

import { getBootstrapData, getMeta, getAllListings, getAllUsers, getClickedListingIds, getCreatedListings, getCustomUser, getFeedback, getMedals, getSavedListingIds, getSessions, getStoredChatThreads, getUserById, makeCreatedUser, setCreatedListings, setCustomUser, withListingDefaults } from "@/lib/appData";
import { STORAGE } from "@/lib/storageKeys";
import { recommendFor, similarListings, matchScore } from "@/lib/match";
import type { ChatThread, Listing, Session, SkillCategory, User } from "@/mock/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

type ApiSuccess<T> = { data: T; meta?: { count?: number; total?: number; page?: number; pageSize?: number; requestId?: string } };

type BrowseParams = {
  type?: Listing["type"];
  q?: string;
  category?: SkillCategory;
  city?: string;
  canton?: string;
  language?: string;
  mode?: "online" | "in_person";
  duration?: number;
  beginnerFriendly?: boolean;
  recommendedOnly?: boolean;
  limit?: number;
  sort?: "recommended" | "newest";
  userId?: string | null;
};

type CreateUserInput = {
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
};

type CreateListingInput = Omit<Listing, "id" | "createdAt">;

async function request<T>(path: string, init?: RequestInit, headers?: Record<string, string>): Promise<ApiSuccess<T>> {
  if (!API_BASE_URL) {
    throw new Error("API_NOT_CONFIGURED");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API_${response.status}`);
  }

  return response.json() as Promise<ApiSuccess<T>>;
}

function getSessionId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE.sessionId);
}

function getActorHeaders(actorUserId?: string | null) {
  const sessionId = getSessionId();
  return {
    ...(sessionId ? { "X-Demo-Session-Id": sessionId } : {}),
    ...(actorUserId ? { "X-Actor-User-Id": actorUserId } : {}),
  };
}

const fallbackApi = {
  async health() {
    return { data: { status: "ok", service: "skillswap-api-fallback", version: "local" } };
  },
  async createDemoSession() {
    const existing = getSessionId();
    const sessionId = existing ?? `demo_session_${Math.random().toString(36).slice(2, 10)}`;
    if (typeof window !== "undefined" && !existing) {
      window.localStorage.setItem(STORAGE.sessionId, sessionId);
    }
    return { data: { sessionId, selectedUserId: window?.localStorage.getItem(STORAGE.selectedUserId) ?? null, createdAt: new Date().toISOString() } };
  },
  async getDemoSession() {
    return {
      data: {
        sessionId: getSessionId() ?? "demo_session_local",
        selectedUserId: typeof window !== "undefined" ? window.localStorage.getItem(STORAGE.selectedUserId) : null,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      },
    };
  },
  async selectDemoUser(userId: string | null) {
    if (typeof window !== "undefined") {
      if (userId) window.localStorage.setItem(STORAGE.selectedUserId, userId);
      else window.localStorage.removeItem(STORAGE.selectedUserId);
    }
    return { data: { sessionId: getSessionId() ?? "demo_session_local", selectedUserId: userId } };
  },
  async bootstrap() {
    return { data: getBootstrapData() };
  },
  async meta() {
    return { data: getMeta() };
  },
  async listUsers() {
    const items = getAllUsers();
    return { data: { items, nextCursor: null }, meta: { count: items.length } };
  },
  async createUser(input: CreateUserInput) {
    const user = makeCreatedUser(input);
    setCustomUser(user);
    return { data: { user } };
  },
  async getUserProfile(userId: string) {
    const user = getUserById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");
    const listings = getAllListings();
    const teachingOffers = listings.filter((listing) => listing.ownerUserId === user.id && listing.type === "offer");
    const learningRequests = listings.filter((listing) => listing.ownerUserId === user.id && listing.type === "request");
    const feedback = getFeedback().filter((entry) => entry.toUserId === user.id);
    const feedbackTags = Array.from(new Set(feedback.flatMap((entry) => entry.tags))).slice(0, 8);
    return {
      data: {
        user,
        teachingOffers,
        learningRequests,
        feedbackTags,
        recentFeedback: feedback.slice(0, 4),
        visibleMedals: getMedals().filter((medal) => user.visibleMedalIds.includes(medal.id)),
        chainContributions: getBootstrapData().featuredChains.filter((chain) => chain.steps.some((step) => step.fromUserId === user.id || step.toUserId === user.id)).slice(0, 3),
      },
    };
  },
  async getUserDashboard(userId: string) {
    const user = getUserById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");
    const listings = getAllListings();
    const teachingOffers = listings.filter((listing) => listing.ownerUserId === user.id && listing.type === "offer");
    const learningRequests = listings.filter((listing) => listing.ownerUserId === user.id && listing.type === "request");
    const savedListings = listings.filter((listing) => getSavedListingIds().includes(listing.id));
    const recentSessions = getSessions().filter((session) => session.offerUserId === user.id || session.learnerUserId === user.id).slice(0, 4);
    const recentChatThreads = getRecentChatThreads(user.id);
    return {
      data: {
        user,
        teachingOffers,
        learningRequests,
        savedListings,
        recentSessions,
        recentChatThreads,
        visibleMedals: getMedals().filter((medal) => user.visibleMedalIds.includes(medal.id)),
        impactSummary: {
          sessionsGiven: recentSessions.filter((session) => session.offerUserId === user.id).length,
          sessionsTaken: recentSessions.filter((session) => session.learnerUserId === user.id).length,
          chainsJoined: getBootstrapData().featuredChains.filter((chain) => chain.steps.some((step) => step.fromUserId === user.id || step.toUserId === user.id)).length,
          impactScore: user.impactScore,
        },
      },
    };
  },
  async browseListings(params: BrowseParams) {
    const listings = filterListings(params);
    return { data: { items: listings, nextCursor: null }, meta: { count: listings.length, total: listings.length } };
  },
  async getRecommendations(userId: string | null, intent: "learn" | "teach", limit = 4) {
    const user = userId ? getUserById(userId) : null;
    const items = recommendFor(user, getAllListings(), { mode: intent, limit, saved: getSavedListingIds(), clicked: getClickedListingIds() });
    return { data: { items } };
  },
  async getListingDetail(listingId: string, userId?: string | null) {
    const listings = getAllListings();
    const listing = listings.find((entry) => entry.id === listingId);
    if (!listing) throw new Error("LISTING_NOT_FOUND");
    const owner = getUserById(listing.ownerUserId);
    const feedbackTags = owner ? Array.from(new Set(getFeedback().filter((entry) => entry.toUserId === owner.id).flatMap((entry) => entry.tags))).slice(0, 8) : [];
    const candidateUsers = getAllUsers().filter((entry) => entry.id !== listing.ownerUserId);
    return {
      data: {
        listing,
        owner,
        visibleMedals: owner ? getMedals().filter((medal) => owner.visibleMedalIds.includes(medal.id)) : [],
        feedbackTags,
        recentFeedback: owner ? getFeedback().filter((entry) => entry.toUserId === owner.id).slice(0, 4) : [],
        similarListings: similarListings(listing, listings),
        recommendedMatches: candidateUsers.slice(0, 5).map((user) => ({ user, ...matchScore(user, listing) })),
        allListings: listings,
        match: userId ? matchScore(getUserById(userId), listing) : null,
      },
    };
  },
  async createListing(input: CreateListingInput) {
    const listing = withListingDefaults({
      ...input,
      id: `${input.type}_user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
    const next = [listing, ...getCreatedListings()];
    setCreatedListings(next);
    return { data: { listing } };
  },
};

function filterListings(params: BrowseParams) {
  const text = params.q?.trim().toLowerCase() ?? "";
  const user = params.userId ? getUserById(params.userId) : null;
  return getAllListings()
    .filter((listing) => !params.type || listing.type === params.type)
    .filter((listing) => !params.category || listing.category === params.category)
    .filter((listing) => !params.city || listing.city === params.city)
    .filter((listing) => !params.canton || listing.canton === params.canton)
    .filter((listing) => !params.language || listing.languages.includes(params.language))
    .filter((listing) => !params.mode || listing.mode.includes(params.mode))
    .filter((listing) => !params.duration || listing.durationMinutes === params.duration)
    .filter((listing) => !params.beginnerFriendly || listing.beginnerFriendly)
    .filter((listing) => {
      if (!params.recommendedOnly) return true;
      if (!user) return false;
      return matchScore(user, listing).score >= 30;
    })
    .filter((listing) => {
      if (!text) return true;
      const hay = `${listing.title} ${listing.description} ${listing.category} ${listing.city} ${listing.canton} ${listing.tags.join(" ")}`.toLowerCase();
      return hay.includes(text);
    })
    .sort((left, right) => +new Date(right.createdAt) - +new Date(left.createdAt))
    .slice(0, params.limit ?? 400);
}

function getRecentChatThreads(userId: string) {
  return [...SEED_CHATS, ...getStoredChatThreads()].filter((thread) => thread.participantIds.includes(userId)).slice(0, 4);
}

export const api = {
  health: () => callOrFallback(() => request<{ status: string; service: string; version: string }>("/health"), () => fallbackApi.health()),
  createDemoSession: () => callOrFallback(() => request<{ sessionId: string; selectedUserId: string | null; createdAt: string }>("/demo/session", { method: "POST", body: "{}" }), () => fallbackApi.createDemoSession()),
  getDemoSession: () => callOrFallback(() => request<{ sessionId: string; selectedUserId: string | null; createdAt: string; lastSeenAt: string }>("/demo/session", { headers: getActorHeaders() }), () => fallbackApi.getDemoSession()),
  selectDemoUser: (userId: string | null) => callOrFallback(() => request<{ sessionId: string; selectedUserId: string | null }>("/demo/select-user", { method: "POST", body: JSON.stringify({ userId }) }, getActorHeaders()), () => fallbackApi.selectDemoUser(userId)),
  bootstrap: () => callOrFallback(() => request<ReturnType<typeof getBootstrapData>>("/bootstrap?includeUsers=true&includeListings=true&includeImpact=true"), () => fallbackApi.bootstrap()),
  meta: () => callOrFallback(() => request<ReturnType<typeof getMeta>>("/meta"), () => fallbackApi.meta()),
  listUsers: () => callOrFallback(() => request<{ items: User[]; nextCursor: string | null }>("/users"), () => fallbackApi.listUsers()),
  createUser: (input: CreateUserInput) => callOrFallback(() => request<{ user: User }>("/users", { method: "POST", body: JSON.stringify(input) }, getActorHeaders()), () => fallbackApi.createUser(input)),
  getUserProfile: (userId: string) => callOrFallback(() => request<any>(`/users/${userId}`), () => fallbackApi.getUserProfile(userId)),
  getUserDashboard: (userId: string) => callOrFallback(() => request<any>(`/users/${userId}/dashboard`), () => fallbackApi.getUserDashboard(userId)),
  browseListings: (params: BrowseParams) => callOrFallback(() => request<{ items: Listing[]; nextCursor: string | null }>(`/listings?${new URLSearchParams(compactParams(params))}`), () => fallbackApi.browseListings(params)),
  getRecommendations: (userId: string | null, intent: "learn" | "teach", limit = 4) => callOrFallback(() => request<any>(`/recommendations?${new URLSearchParams(compactParams({ userId, intent, limit }))}`), () => fallbackApi.getRecommendations(userId, intent, limit)),
  getListingDetail: (listingId: string, userId?: string | null) => callOrFallback(() => request<any>(`/listings/${listingId}${userId ? `?${new URLSearchParams({ userId })}` : ""}`), () => fallbackApi.getListingDetail(listingId, userId)),
  createListing: (input: CreateListingInput) => callOrFallback(() => request<{ listing: Listing }>("/listings", { method: "POST", body: JSON.stringify(input) }, getActorHeaders(input.ownerUserId)), () => fallbackApi.createListing(input)),
};

async function callOrFallback<T>(remote: () => Promise<ApiSuccess<T>>, local: () => Promise<ApiSuccess<T>>) {
  try {
    return await remote();
  } catch {
    return local();
  }
}

function compactParams(value: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ""));
}

# Skillswap — Handoff for IBM Bob

This document summarizes what Lovable generated and where to look next.

## What was generated

A fully frontend React + TypeScript + Tailwind demo of Skillswap, a calm Switzerland-wide volunteer skill-swap platform. No backend, no auth, no API calls. All data lives in `src/mock/` (seeded, deterministic) and `localStorage` (user actions).

## Routes

- `/` Landing
- `/browse/learn` — listings of `type === "offer"` (people teaching)
- `/browse/teach` — listings of `type === "request"` (people learning)
- `/listing/:id` — listing detail (offer or request)
- `/profile/:userId` — public profile (visible medals only)
- `/me` — demo user dashboard
- `/me/create-offer`, `/me/create-request` — create new listings
- `/me/medals` — toggle which medals are publicly visible
- `/chat/:threadId` — local chat (persists to localStorage)
- `/impact` — counters + skill chain + Switzerland connection SVG

## Component map

`AppShell`, `Navbar`, `SwapToggle`, `SearchBar`, `FilterPanel`, `ListingCard`, `ListingGrid`, `ListingDetail`, `ListingForm`, `BrowseView`, `UserProfileCard`, `MedalBadge`, `MedalToggleCard`, `ChatPanel`, `ImpactCounter`, `SkillChainView`, `AreaConnectionGraph`, `DemoUserSelector`, `EmptyState`, `GentleCTA`.

## Mock data

In `src/mock/`:

- `seed.ts` — deterministic mulberry32 PRNG.
- `constants.ts` — cities, languages, categories, curated skill pool, medal definitions, availability, tags, names.
- `users.ts` — 5 hand-built named demo users (Sara, Lina, Omar, Maya, Noah) + ~95 procedurally generated users.
- `listings.ts` — 180 teaching offers + 160 learning requests, plus guaranteed offers/requests for the named demo users.
- `sessions.ts`, `feedback.ts`, `chats.ts`, `chains.ts`, `areaConnections.ts` — supporting data.
- `index.ts` — barrel export.

## Matching logic

`src/lib/match.ts`:

- `matchScore(user, listing)` returns `{ score, reasons[] }`.
- `recommendFor(user, listings, { mode })` returns top scored listings of the appropriate type for the current browse mode.
- `similarListings(listing, all)` for detail pages.

## Demo identity

- `src/context/DemoUserContext.tsx` stores `selectedUserId` in `localStorage`. Default = visitor.
- `src/hooks/useRequireDemoUser.ts` gates write actions; visitors see a soft modal.

## localStorage keys (`src/lib/storageKeys.ts`)

| Key | Purpose |
|---|---|
| `skillswap:selectedUserId` | currently active demo persona (or null = visitor) |
| `skillswap:savedListings` | array of listing IDs saved by the persona |
| `skillswap:createdListings` | listings the persona created (merged into all browse pages) |
| `skillswap:medalVisibility` | `{ [userId]: { [medalId]: boolean } }` |
| `skillswap:chatThreads` | locally added threads + appended messages |
| `skillswap:clickedListings` | history used to bias recommendations |
| `skillswap:chatDrafts` | reserved for unsent drafts |

## What IBM Bob should improve next

1. **Real persistence** — replace `localStorage` with a small backend so listings survive across devices.
2. **Real authentication** — sign-in for actual people across cities.
3. **Real chat transport** — websockets or Supabase realtime; current chat is local-only.
4. **i18n** — German, French, Italian translations of the UI (the audience is Swiss).
5. **A real Switzerland map** — the SVG graph here is poetic, not cartographic.
6. **Accessibility audit** — keyboard navigation, screen reader labels, prefers-reduced-motion.
7. **Moderation tools** — gentle community guardrails (report a listing, flag unkind messages).
8. **Public medal visibility** — currently the visibility toggle persists locally; in production it would update the user record.

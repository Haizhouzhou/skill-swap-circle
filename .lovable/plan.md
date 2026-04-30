# Skillswap — Calm Switzerland-wide Skill Exchange (Frontend Demo)

A polished, frontend-only React + TS + Tailwind demo of a non-commercial, volunteer skill-swap platform. No backend, no auth, no API calls — only seeded mock data + `localStorage`.

## Visual identity & foundation

- **Design tokens** added to `src/index.css` and `tailwind.config.ts` as HSL custom properties: `cream`, `sage`, `moss`, `clay`, `sand`, `sky`, `ink`, `mutedInk`, `borderSoft`. Tailwind colors map to these (e.g. `bg-cream`, `border-borderSoft`, `text-ink`).
- Existing shadcn semantic tokens (`--background`, `--foreground`, `--primary`, `--border`, etc.) are remapped to the warm palette so all shadcn primitives inherit the calm look.
- **Fonts** loaded in `index.html` from Google Fonts: `Fraunces` (headings) + `Inter` (body). `font-serif` → Fraunces, default sans → Inter.
- **Surfaces:** `rounded-2xl` cards, 1px `border-borderSoft`, no shadows, generous spacing, hover = `translateY(-1px)` 200ms ease.
- **Icons:** thin lucide icons + a custom inline SVG swap glyph that flips 180° on toggle.
- `index.html` title/description updated to Skillswap.

## Folder structure (all created)

```text
src/
  components/  AppShell, Navbar, SwapToggle, SearchBar, FilterPanel,
               ListingCard, ListingGrid, ListingDetail, UserProfileCard,
               MedalBadge, MedalToggleCard, ChatPanel, ImpactCounter,
               SkillChainView, AreaConnectionGraph, DemoUserSelector,
               EmptyState, GentleCTA
  pages/       Landing, BrowseLearn, BrowseTeach, ListingPage,
               PublicProfile, Dashboard, CreateOffer, CreateRequest,
               MedalSettings, ChatPage, Impact
  context/     DemoUserContext.tsx
  hooks/       useRequireDemoUser.ts, useLocalStorage.ts
  lib/         match.ts, mailto.ts, storageKeys.ts
  mock/        seed.ts, types.ts, constants.ts, users.ts, listings.ts,
               sessions.ts, chats.ts, feedback.ts, medals.ts, chains.ts,
               areaConnections.ts, index.ts
docs/bob-handoff.md
```

## Routes (wired in `App.tsx` inside `AppShell`)

| Path | Page |
|---|---|
| `/` | Landing |
| `/browse/learn` | BrowseLearn — `type === "offer"` only |
| `/browse/teach` | BrowseTeach — `type === "request"` only |
| `/listing/:id` | ListingPage (offer or request variant) |
| `/profile/:userId` | PublicProfile |
| `/me` | Dashboard |
| `/me/create-offer` | CreateOffer |
| `/me/create-request` | CreateRequest |
| `/me/medals` | MedalSettings |
| `/chat/:threadId` | ChatPage |
| `/impact` | Impact |

Page transitions use a soft fade/slide; the swap toggle triggers a page-turn feel between `/browse/learn` and `/browse/teach`.

## Mock data (`src/mock/`)

- `seed.ts` — deterministic mulberry32 PRNG + helpers (`pick`, `pickN`, `int`).
- `constants.ts` — 10 Swiss cities with cantons, 4 languages, 11 skill categories with their curated skill pools (exact lists from the brief), 11 medal definitions, availability slot pool, feedback tag pool, context tag pool, demo first-name pool.
- `types.ts` — shared models (`Listing`, `User`, `Medal`, `ChatThread`, `ChatMessage`, `Session`, `Feedback`, `SkillChain`, `AreaConnection`, `AvailabilitySlot`, `SkillCategory`, `ListingType`).
- `users.ts` — 5 hand-built named demo users (Sara/Lina/Omar/Maya/Noah with the exact bios, languages, interests, impact scores, visible medals from the brief) + ~95 procedurally generated users with `firstname.demo@skillswap.ch` emails, distributed across the 10 cities.
- `listings.ts` — 180 offers + 160 requests generated from the curated skill pool, each tied to an owner whose `teachCategories`/`learnCategories` match.
- `sessions.ts` — 300 completed sessions linking offer/learner pairs.
- `chats.ts` — 120 threads, including the seeded Sara↔Lina exchange about German small talk.
- `feedback.ts` — 250 short kind notes with warm tags.
- `medals.ts` — assigns medal sets to all users with `earnedAt` dates.
- `chains.ts` — 40 skill chains, including the featured Lina→Sara→Omar→Maya chain.
- `areaConnections.ts` — the 10 hand-specified weighted edges between Swiss cities (with weights, top categories, latest skills exactly as listed in the brief).
- `index.ts` — barrel export combining seeded data with any user-created listings/chats from `localStorage`.

## Demo identity & gating

- `DemoUserContext` stores `selectedUserId` (one of `user_sara`, `user_lina`, `user_omar`, `user_maya`, `user_noah`, or `null` for visitor) in `localStorage` under `skillswap:selectedUserId`. Default = visitor.
- `Navbar` shows current persona + a "switch" button that opens `DemoUserSelector` (a Dialog listing the 5 personas + "Continue as visitor").
- `useRequireDemoUser()` returns `{ user, requireUser(action) }`. If visitor, calling `requireUser` opens a soft modal: *"Choose a demo profile to join the swap."* with the 5 persona buttons. Used by: Request session, Offer help, Save listing, Create offer/request, Send chat, Edit medals.

## localStorage keys (`src/lib/storageKeys.ts`)

`selectedUserId`, `savedListings`, `createdListings`, `medalVisibility`, `chatDrafts`, `chatThreads`, `clickedListings` — all prefixed `skillswap:`. Read via the typed `useLocalStorage` hook.

## Recommendation & matching (`src/lib/match.ts`)

Pure functions:

- `recommendFor(user, listings, { mode })` — scores per the brief: category∩interests (≤25), match with `learnCategories`/`teachCategories` depending on browse mode (≤25), same city (15), same canton (10), language overlap (≤15), beginner-friendly (5), saved/clicked history (≤10), owner impactScore (≤5).
- `matchScore(user, listing)` → `{ score, reasons[] }` producing human sentences like *"Lina is a strong match because she speaks English and German, is available on Saturday, and has helped newcomers before."*
- `similarListings(listing, all)` for detail-page "Similar listings".

Browse pages render a "Recommended for you" strip above the full grid; detail pages render match score + reasons + recommended matches.

## Key components

- **SwapToggle** — pill with "I want to learn" / "I want to teach" labels + central custom SVG swap glyph (two curved arrows). Click flips glyph 180° and navigates between `/browse/learn` ↔ `/browse/teach`.
- **ListingCard** — two visual variants (offer / request) per the brief's field lists; hover lift; View detail + Request session / Offer help buttons (gated).
- **FilterPanel** — category, city/canton, online/in-person, language, duration, beginner-friendly, recommended-only.
- **ListingDetail** — handles both offer and request variants with the exact field sets specified.
- **MedalBadge** / **MedalToggleCard** — calm, respectful styling; toggle uses shadcn `Switch`; persists to `skillswap:medalVisibility`.
- **ChatPanel** — listing context header, message list, input, send button. Threads merged from seed + `skillswap:chatThreads`. Visitor send is gated.
- **ImpactCounter** — large warm numerals with serif headings.
- **SkillChainView** — vertical flow with persona avatars and soft down-arrows; renders the Lina→Sara→Omar→Maya featured chain.
- **AreaConnectionGraph** — custom 700×430 SVG with the exact city node coordinates from the brief, abstract soft Switzerland-inspired backdrop shape, gentle bezier curves whose `strokeWidth` scales with `weight`. Hover/click shows a calm tooltip with cities, swap count, top categories, latest skill.
- **DemoUserSelector** — modal listing the 5 personas with city subtitles + visitor option.
- **EmptyState** — *"Nothing here yet — but a small skill could change that."*
- **GentleCTA** — reusable warm call-to-action block.

## Email (`src/lib/mailto.ts`)

`buildMailto(listing, owner)` returns a `mailto:` URL with prefilled subject like `Skillswap session request: German small talk` and a warm body referencing the listing.

## Pages summary

- **Landing** — Hero "Swap useful life skills for free." + subtext + buttons (Start as demo user → opens selector; Browse skills → `/browse/learn`) + 3 value cards (Discover hidden daily skills / Learn from people nearby / Pass help forward). Soft abstract sage/clay shapes, no stock illustration.
- **BrowseLearn / BrowseTeach** — header, SearchBar, SwapToggle, "Recommended for you", FilterPanel, ListingGrid filtered by `type`. Search across title, description, category, city, canton, tags.
- **ListingPage** — full detail per brief; Request/Offer + Contact by email (mailto) + Open chat (creates/opens a thread).
- **PublicProfile** — name, city/canton, bio, languages, this user's offers + requests, **only visible medals**, impact score, feedback tags, chain contributions, contact-by-email.
- **Dashboard `/me`** — current persona card, my offers, my requests, saved listings, recent chats, recent sessions, visible medals preview, chain contributions, buttons to create offer/request and manage medals.
- **CreateOffer / CreateRequest** — forms with all listed fields + warm microcopy ("Small everyday knowledge can be valuable to someone else." / "Asking for help is part of the swap."). On submit, append to `skillswap:createdListings`; new listings appear in browse + dashboard.
- **MedalSettings** — list of the user's medals with Switch toggles for visibility.
- **ChatPage** — listing context header, message list, input. Persists to `skillswap:chatThreads`.
- **Impact** — counters (100 / 180 / 160 / 300 / 40), SkillChainView, AreaConnectionGraph.

## Tone

All copy is humble, warm, non-promotional. Empty states, CTAs, and microcopy follow the approved phrases from the brief; promotional language is excluded everywhere.

## Handoff doc

`docs/bob-handoff.md` documents what Lovable generated, the component map, mock-data shape, where matching logic lives, how `localStorage` is used per key, and a short "what IBM Bob should improve next" list (real persistence, real auth, real chat transport, accessibility audit, i18n for DE/FR/IT, real Switzerland map).

## Acceptance checks (verified before finishing)

All 13 checks from the brief — including: only offers on `/browse/learn`, only requests on `/browse/teach`, working swap toggle, visitor read-only gating, persona write actions, visible-only medals on public profiles, persisted created listings + chats, impact page complete, no backend/API/auth code introduced, no AI/SaaS visual clichés, TypeScript clean.
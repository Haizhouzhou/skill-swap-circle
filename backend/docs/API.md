# API

Base path: `/api/v1`

Success:

```json
{ "data": {} }
```

Error:

```json
{ "error": { "code": "BAD_REQUEST", "message": "Example", "details": {} } }
```

Demo context headers:

```text
X-Demo-Session-Id: demo_session_...
X-Actor-User-Id: user_sara
```

## Routes

`GET /health`, `POST /demo/session`, `GET /demo/session`, `POST /demo/select-user`, `GET /bootstrap`, `GET /meta`, `GET /search/suggest`, `GET|POST /users`, `GET|PATCH /users/:userId`, `GET /users/:userId/dashboard`, `GET /medals`, `GET|PATCH /users/:userId/medals`, `GET|POST /listings`, `GET|PATCH /listings/:listingId`, `PATCH /listings/:listingId/archive`, `POST|GET /users/:userId/saved-listings`, `DELETE /users/:userId/saved-listings/:listingId`, `POST /users/:userId/history/listing-view`, `GET /recommendations`, `POST /match-score`, `GET /listings/:listingId/recommended-matches`, `GET /listings/:listingId/similar`, `POST /sessions/request`, `GET /sessions/:sessionId`, `GET /users/:userId/sessions`, `PATCH /sessions/:sessionId/accept|decline|cancel`, `POST /sessions/:sessionId/complete`, chat, feedback, impact, visual, contact, AI stub, and admin seed/reset/export routes.

Marketplace browsing:

```text
GET /api/v1/listings?type=offer&limit=10
GET /api/v1/listings?type=request&limit=10
```

`type=offer` returns teaching offers for `/browse/learn`. `type=request` returns learning requests for `/browse/teach`.

## Examples

Create user:

```json
POST /api/v1/users
{
  "name": "Ana",
  "email": "ana.demo@skillswap.ch",
  "city": "Zürich",
  "canton": "ZH",
  "languages": ["Spanish", "English"],
  "bio": "Happy to swap daily-life skills.",
  "interests": ["Swiss life"],
  "teachCategories": ["Language practice"],
  "learnCategories": ["Swiss life"]
}
```

Create offer:

```json
{
  "type": "offer",
  "title": "Practice Spanish small talk",
  "description": "A calm beginner-friendly session.",
  "category": "Language practice",
  "tags": ["beginner"],
  "ownerUserId": "user_sara",
  "city": "Zürich",
  "canton": "ZH",
  "mode": ["online"],
  "languages": ["Spanish", "English"],
  "durationMinutes": 30,
  "availability": [{ "day": "Saturday", "label": "Saturday afternoon" }],
  "level": "easy",
  "beginnerFriendly": true,
  "recommendedFor": ["newcomer"]
}
```

Create request:

```json
{
  "type": "request",
  "title": "I want to learn how to use SBB better",
  "description": "A short practical walkthrough would help.",
  "category": "Swiss life",
  "tags": ["newcomer"],
  "ownerUserId": "user_lina",
  "city": "Basel",
  "canton": "BS",
  "mode": ["online", "in_person"],
  "languages": ["German", "Arabic"],
  "durationMinutes": 30,
  "availability": [{ "day": "Monday", "label": "Monday evening" }],
  "level": "easy",
  "beginnerFriendly": true,
  "recommendedFor": []
}
```

Session request:

```json
{
  "fromUserId": "user_sara",
  "toUserId": "user_lina",
  "listingId": "listing_german_smalltalk",
  "message": "Hi Lina, could we do a 30-minute session?",
  "proposedStartAt": "2026-05-02T14:00:00+02:00",
  "proposedEndAt": "2026-05-02T14:30:00+02:00",
  "timezone": "Europe/Zurich"
}
```

Send chat message:

```json
POST /api/v1/chat/threads/chat_featured_sara_lina/messages
{
  "senderUserId": "user_sara",
  "text": "Saturday afternoon works for me."
}
```

Update visible medals:

```json
PATCH /api/v1/users/user_sara/medals
{
  "visibleMedalIds": ["first_swap", "swiss_life_guide"]
}
```

Seed:

```json
POST /api/v1/admin/seed
X-Demo-Admin-Key: YOUR_KEY
{ "resetBeforeSeed": true }
```

Reset:

```text
POST /api/v1/admin/reset
X-Demo-Admin-Key: YOUR_KEY
```

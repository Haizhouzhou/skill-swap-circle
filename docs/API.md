# Skillswap frontend API contract — v1

This is the complete API list I would give to the frontend team. It supports the current goal:

> Turn the frontend mock demo into a real persisted demo using Google Cloud Run + Firestore, without real auth.

The frontend should still keep mock/localStorage fallback, but when backend is available it should use these APIs.

---

# 0. API basics

## Base URL

```txt
Production demo:
https://skillswap-api-xxxxx.run.app/api/v1

Local development:
http://localhost:8080/api/v1
```

## Required headers

For all requests:

```http
Content-Type: application/json
```

For write actions:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

Because there is no real auth, the backend uses:

```txt
X-Demo-Session-Id
```

to know which browser/demo checker is using the app, and:

```txt
X-Actor-User-Id
```

to know which demo user is acting.

## Standard success response

```ts
type ApiSuccess<T> = {
  data: T;
  meta?: {
    requestId?: string;
    count?: number;
    total?: number;
    page?: number;
    pageSize?: number;
  };
};
```

Example:

```json
{
  "data": {
    "id": "user_sara",
    "name": "Sara"
  }
}
```

## Standard error response

```ts
type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
```

Example:

```json
{
  "error": {
    "code": "VISITOR_NOT_ALLOWED",
    "message": "Choose a demo profile to join the swap."
  }
}
```

## Recommended HTTP status codes

| Status | Meaning                                       |
| -----: | --------------------------------------------- |
|    200 | Successful read/update                        |
|    201 | Successful create                             |
|    400 | Invalid request body/query                    |
|    403 | Visitor or session cannot perform action      |
|    404 | Resource not found                            |
|    409 | Conflict, duplicate, invalid state transition |
|    500 | Backend error                                 |

---

# 1. Shared frontend types

These are the main types the frontend should expect.

```ts
export type ListingType = "offer" | "request";

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

export type Mode = "online" | "in_person";

export type SkillLevel = "easy" | "medium" | "advanced";

export type AvailabilitySlot = {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  label: string;
};

export type User = {
  id: string;
  source: "seed" | "created";

  name: string;
  email: string;
  city: string;
  canton: string;
  languages: string[];

  bio: string;
  interests: SkillCategory[];
  teachCategories: SkillCategory[];
  learnCategories: SkillCategory[];

  visibleMedalIds: string[];
  allMedalIds: string[];

  impactScore: number;
  avatarSeed: string;

  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  id: string;
  source: "seed" | "created";

  type: "offer" | "request";
  title: string;
  description: string;
  category: SkillCategory;
  tags: string[];

  ownerUserId: string;
  owner?: UserSummary;

  city: string;
  canton: string;
  mode: Mode[];

  languages: string[];
  durationMinutes: 20 | 30 | 45 | 60;
  availability: AvailabilitySlot[];

  level: SkillLevel;
  beginnerFriendly: boolean;
  recommendedFor: string[];

  status: "active" | "archived";

  createdAt: string;
  updatedAt: string;
};

export type UserSummary = {
  id: string;
  name: string;
  city: string;
  canton: string;
  languages: string[];
  impactScore: number;
  visibleMedalIds: string[];
  avatarSeed: string;
};

export type Medal = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type Session = {
  id: string;
  listingId: string;

  requesterUserId: string;
  receiverUserId: string;

  status: "requested" | "accepted" | "declined" | "completed" | "cancelled";

  skillTitle: string;
  cityFrom: string;
  cityTo: string;

  message?: string;

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

  participants?: UserSummary[];

  lastMessageText: string;
  lastMessageAt: string;

  createdAt: string;
};

export type ChatMessage = {
  id: string;
  threadId: string;
  senderUserId: string;
  text: string;
  createdAt: string;
};

export type Feedback = {
  id: string;
  sessionId: string;

  fromUserId: string;
  toUserId: string;

  tags: string[];
  note: string;

  createdAt: string;
};

export type SkillChain = {
  id: string;
  steps: {
    fromUserId: string;
    toUserId: string;
    skillTitle: string;
  }[];
  createdAt: string;
};

export type AreaConnection = {
  sourceCity: string;
  targetCity: string;
  weight: number;
  topCategories: SkillCategory[];
  latestSkill: string;
};

export type CityNode = {
  city: string;
  canton: string;
  x: number;
  y: number;
};
```

---

# 2. System and demo session APIs

These are used when the app starts.

## 2.1 Health check

```http
GET /api/v1/health
```

Response:

```json
{
  "data": {
    "status": "ok",
    "service": "skillswap-api",
    "version": "1.0.0"
  }
}
```

Frontend use:

```txt
Optional. Good for checking backend availability.
```

---

## 2.2 Create demo session

```http
POST /api/v1/demo/session
```

Request:

```json
{}
```

Response:

```json
{
  "data": {
    "sessionId": "demo_session_abc123",
    "selectedUserId": null,
    "createdAt": "2026-04-30T12:00:00.000Z"
  }
}
```

Frontend stores:

```txt
skillswap:sessionId
```

---

## 2.3 Select active demo user

```http
POST /api/v1/demo/select-user
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
```

Request:

```json
{
  "userId": "user_sara"
}
```

Response:

```json
{
  "data": {
    "sessionId": "demo_session_abc123",
    "selectedUserId": "user_sara"
  }
}
```

Use when user chooses:

```txt
Continue as Sara from Zürich
Continue as Lina from Basel
Continue as Omar from Lausanne
Continue as Maya from Bern
Continue as Noah from Geneva
```

---

## 2.4 Get current demo session

```http
GET /api/v1/demo/session
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
```

Response:

```json
{
  "data": {
    "sessionId": "demo_session_abc123",
    "selectedUserId": "user_sara",
    "createdAt": "2026-04-30T12:00:00.000Z",
    "lastSeenAt": "2026-04-30T12:05:00.000Z"
  }
}
```

---

## 2.5 Bootstrap app data

```http
GET /api/v1/bootstrap
```

Recommended query params:

```txt
includeUsers=true
includeListings=true
includeImpact=true
limitUsers=100
limitListings=400
```

Example:

```http
GET /api/v1/bootstrap?includeUsers=true&includeListings=true&includeImpact=true
```

Response:

```json
{
  "data": {
    "demoUsers": [],
    "users": [],
    "listings": [],
    "medals": [],
    "featuredChains": [],
    "areaConnections": [],
    "cityNodes": [],
    "stats": {
      "users": 100,
      "teachingOffers": 180,
      "learningRequests": 160,
      "completedSessions": 300,
      "activeSkillChains": 40
    }
  }
}
```

Frontend use:

```txt
First page load.
Also useful for local cache warming.
```

---

# 3. Metadata APIs

These power filters and form options.

## 3.1 Get app metadata

```http
GET /api/v1/meta
```

Response:

```json
{
  "data": {
    "categories": [
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
      "Creative"
    ],
    "cities": [
      {
        "city": "Zürich",
        "canton": "ZH"
      },
      {
        "city": "Basel",
        "canton": "BS"
      }
    ],
    "languages": ["German", "French", "Italian", "English"],
    "durations": [20, 30, 45, 60],
    "modes": ["online", "in_person"],
    "levels": ["easy", "medium", "advanced"]
  }
}
```

---

## 3.2 Search suggestions

```http
GET /api/v1/search/suggest?q=german
```

Response:

```json
{
  "data": {
    "suggestions": [
      {
        "type": "skill",
        "label": "Practice German small talk"
      },
      {
        "type": "category",
        "label": "Language practice"
      },
      {
        "type": "city",
        "label": "Geneva"
      }
    ]
  }
}
```

This is optional but useful for the search bar.

---

# 4. User APIs

## 4.1 List users

```http
GET /api/v1/users
```

Query params:

```txt
q
city
canton
language
category
limit
cursor
```

Example:

```http
GET /api/v1/users?city=Zürich&language=English&limit=20
```

Response:

```json
{
  "data": {
    "items": [],
    "nextCursor": null
  },
  "meta": {
    "count": 20
  }
}
```

Frontend use:

```txt
Demo user selector
Recommended matches
Profile discovery
```

---

## 4.2 Create user

```http
POST /api/v1/users
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
```

Request:

```json
{
  "name": "Elena",
  "email": "elena.demo@skillswap.ch",
  "city": "Zürich",
  "canton": "ZH",
  "languages": ["English", "German"],
  "bio": "I enjoy sharing small daily-life skills.",
  "interests": ["Swiss life", "Home & cooking"],
  "teachCategories": ["Home & cooking"],
  "learnCategories": ["Language practice"]
}
```

Response:

```json
{
  "data": {
    "user": {
      "id": "user_created_abc123",
      "name": "Elena",
      "email": "elena.demo@skillswap.ch",
      "city": "Zürich",
      "canton": "ZH",
      "languages": ["English", "German"],
      "bio": "I enjoy sharing small daily-life skills.",
      "interests": ["Swiss life", "Home & cooking"],
      "teachCategories": ["Home & cooking"],
      "learnCategories": ["Language practice"],
      "visibleMedalIds": ["medal_first_swap"],
      "allMedalIds": ["medal_first_swap"],
      "impactScore": 0,
      "avatarSeed": "elena",
      "source": "created",
      "createdAt": "2026-04-30T12:00:00.000Z",
      "updatedAt": "2026-04-30T12:00:00.000Z"
    }
  }
}
```

---

## 4.3 Get user profile

```http
GET /api/v1/users/:userId
```

Example:

```http
GET /api/v1/users/user_sara
```

Response:

```json
{
  "data": {
    "user": {},
    "teachingOffers": [],
    "learningRequests": [],
    "feedbackTags": ["patient", "clear", "warm"],
    "recentFeedback": [],
    "visibleMedals": [],
    "chainContributions": []
  }
}
```

Frontend use:

```txt
/profile/:userId
```

---

## 4.4 Update user

```http
PATCH /api/v1/users/:userId
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

Request:

```json
{
  "bio": "Updated bio",
  "languages": ["English", "German", "French"],
  "interests": ["Swiss life", "Language practice"],
  "teachCategories": ["Swiss life"],
  "learnCategories": ["Language practice"]
}
```

Response:

```json
{
  "data": {
    "user": {}
  }
}
```

---

## 4.5 Get my dashboard

```http
GET /api/v1/users/:userId/dashboard
```

Example:

```http
GET /api/v1/users/user_sara/dashboard
```

Response:

```json
{
  "data": {
    "user": {},
    "teachingOffers": [],
    "learningRequests": [],
    "savedListings": [],
    "recentSessions": [],
    "recentChatThreads": [],
    "visibleMedals": [],
    "impactSummary": {
      "sessionsGiven": 5,
      "sessionsTaken": 3,
      "chainsJoined": 2,
      "impactScore": 82
    }
  }
}
```

Frontend use:

```txt
/me
```

---

# 5. Medal APIs

## 5.1 List medal types

```http
GET /api/v1/medals
```

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "medal_first_swap",
        "title": "First Swap",
        "description": "Completed your first skill exchange.",
        "icon": "sprout"
      }
    ]
  }
}
```

---

## 5.2 Get user medals

```http
GET /api/v1/users/:userId/medals
```

Response:

```json
{
  "data": {
    "allMedals": [],
    "visibleMedalIds": [
      "medal_first_swap",
      "medal_swiss_life_guide"
    ]
  }
}
```

---

## 5.3 Update visible medals

```http
PATCH /api/v1/users/:userId/medals
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

Request:

```json
{
  "visibleMedalIds": [
    "medal_first_swap",
    "medal_swiss_life_guide",
    "medal_friendly_teacher"
  ]
}
```

Response:

```json
{
  "data": {
    "visibleMedalIds": [
      "medal_first_swap",
      "medal_swiss_life_guide",
      "medal_friendly_teacher"
    ]
  }
}
```

Frontend use:

```txt
/me/medals
```

---

# 6. Listing APIs

Listings are the core marketplace objects.

Important:

```txt
type = offer   → teaching offer
type = request → learning request
```

So:

```txt
/browse/learn → GET listings?type=offer
/browse/teach → GET listings?type=request
```

---

## 6.1 Browse listings

```http
GET /api/v1/listings
```

Query params:

```txt
type=offer | request
q=search text
category=Swiss life
city=Zürich
canton=ZH
language=English
mode=online | in_person
duration=30
beginnerFriendly=true
recommendedFor=newcomers
status=active
limit=50
cursor=abc
sort=recommended | newest | popular
userId=user_sara
```

Example for `/browse/learn`:

```http
GET /api/v1/listings?type=offer&q=german&city=Zürich&language=English&limit=50
```

Example for `/browse/teach`:

```http
GET /api/v1/listings?type=request&category=Swiss%20life&limit=50
```

Response:

```json
{
  "data": {
    "items": [],
    "nextCursor": null
  },
  "meta": {
    "count": 50,
    "total": 180
  }
}
```

---

## 6.2 Get listing detail

```http
GET /api/v1/listings/:listingId
```

Example:

```http
GET /api/v1/listings/listing_123
```

Response:

```json
{
  "data": {
    "listing": {},
    "owner": {},
    "visibleMedals": [],
    "feedbackTags": ["patient", "clear", "warm"],
    "recentFeedback": [],
    "similarListings": [],
    "recommendedMatches": [
      {
        "user": {},
        "score": 91,
        "reasons": [
          "Speaks English and German.",
          "Available on Saturday.",
          "Has helped newcomers before."
        ]
      }
    ]
  }
}
```

Frontend use:

```txt
/listing/:id
```

---

## 6.3 Create listing

```http
POST /api/v1/listings
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

### Create teaching offer

```json
{
  "ownerUserId": "user_sara",
  "type": "offer",
  "title": "Use SBB / SwissPass efficiently",
  "description": "I can show you how to find better connections and travel more confidently.",
  "category": "Swiss life",
  "tags": ["SBB", "SwissPass", "newcomer"],
  "city": "Zürich",
  "canton": "ZH",
  "mode": ["online", "in_person"],
  "languages": ["English", "German"],
  "durationMinutes": 30,
  "availability": [
    {
      "day": "Saturday",
      "label": "Saturday afternoon"
    }
  ],
  "level": "easy",
  "beginnerFriendly": true,
  "recommendedFor": ["newcomers", "students"]
}
```

### Create learning request

```json
{
  "ownerUserId": "user_maya",
  "type": "request",
  "title": "I want to prepare for a flat viewing",
  "description": "I need help understanding what documents to bring and what questions to ask.",
  "category": "Swiss life",
  "tags": ["housing", "flat viewing", "newcomer"],
  "city": "Bern",
  "canton": "BE",
  "mode": ["online"],
  "languages": ["English", "French"],
  "durationMinutes": 30,
  "availability": [
    {
      "day": "Sunday",
      "label": "Sunday evening"
    }
  ],
  "level": "easy",
  "beginnerFriendly": true,
  "recommendedFor": ["newcomers"]
}
```

Response:

```json
{
  "data": {
    "listing": {}
  }
}
```

Frontend use:

```txt
/me/create-offer
/me/create-request
```

---

## 6.4 Update listing

```http
PATCH /api/v1/listings/:listingId
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

Request:

```json
{
  "title": "Use SBB and SwissPass with confidence",
  "description": "Updated description",
  "status": "active"
}
```

Response:

```json
{
  "data": {
    "listing": {}
  }
}
```

---

## 6.5 Archive listing

```http
PATCH /api/v1/listings/:listingId/archive
```

Response:

```json
{
  "data": {
    "listingId": "listing_123",
    "status": "archived"
  }
}
```

---

## 6.6 Save listing

```http
POST /api/v1/users/:userId/saved-listings
```

Request:

```json
{
  "listingId": "listing_123"
}
```

Response:

```json
{
  "data": {
    "saved": true,
    "listingId": "listing_123"
  }
}
```

---

## 6.7 Unsave listing

```http
DELETE /api/v1/users/:userId/saved-listings/:listingId
```

Response:

```json
{
  "data": {
    "saved": false,
    "listingId": "listing_123"
  }
}
```

---

## 6.8 Get saved listings

```http
GET /api/v1/users/:userId/saved-listings
```

Response:

```json
{
  "data": {
    "items": []
  }
}
```

---

## 6.9 Record clicked/viewed listing

```http
POST /api/v1/users/:userId/history/listing-view
```

Request:

```json
{
  "listingId": "listing_123"
}
```

Response:

```json
{
  "data": {
    "recorded": true
  }
}
```

Frontend use:

```txt
Improves recommendation behavior.
Optional but useful.
```

---

# 7. Recommendation and matching APIs

These are important because they make the marketplace feel intelligent.

---

## 7.1 Get recommendations

```http
GET /api/v1/recommendations
```

Query params:

```txt
userId=user_sara
intent=learn | teach
limit=12
```

Example:

```http
GET /api/v1/recommendations?userId=user_sara&intent=learn&limit=12
```

Rules:

```txt
intent=learn → recommend offer listings
intent=teach → recommend request listings
```

Response:

```json
{
  "data": {
    "items": [
      {
        "listing": {},
        "score": 92,
        "reasons": [
          "Matches your interest in Language practice.",
          "The teacher speaks English and German.",
          "Beginner-friendly."
        ]
      }
    ]
  }
}
```

Frontend use:

```txt
Recommended section on /browse/learn
Recommended section on /browse/teach
```

---

## 7.2 Get match score for user + listing

```http
POST /api/v1/match-score
```

Request:

```json
{
  "userId": "user_sara",
  "listingId": "listing_123"
}
```

Response:

```json
{
  "data": {
    "score": 91,
    "reasons": [
      "This matches your Language practice goal.",
      "The owner speaks English and German.",
      "Saturday availability overlaps.",
      "The owner has strong community feedback."
    ]
  }
}
```

Frontend use:

```txt
Listing detail page.
Request confirmation modal.
Offer help modal.
```

---

## 7.3 Get recommended matches for listing

```http
GET /api/v1/listings/:listingId/recommended-matches
```

Query params:

```txt
userId=user_sara
limit=5
```

Response:

```json
{
  "data": {
    "items": [
      {
        "user": {},
        "score": 93,
        "reasons": [
          "Speaks English and German.",
          "Same city.",
          "Has helped newcomers before."
        ]
      }
    ]
  }
}
```

---

## 7.4 Get similar listings

```http
GET /api/v1/listings/:listingId/similar
```

Query params:

```txt
limit=6
```

Response:

```json
{
  "data": {
    "items": []
  }
}
```

---

# 8. Optional AI helper APIs

These are not required for the first backend, but they are useful if the pitch wants to show AI.

The frontend can call these only when available. Otherwise it can use local/mock suggestions.

---

## 8.1 Discover possible teaching skills

```http
POST /api/v1/ai/discover-skills
```

Request:

```json
{
  "userId": "user_sara",
  "freeText": "I helped friends use SBB, cook cheap meals, and understand recycling.",
  "knownTools": ["Canva", "Google Sheets"],
  "lifeContext": ["newcomer", "student"]
}
```

Response:

```json
{
  "data": {
    "suggestedOffers": [
      {
        "title": "Use SBB / SwissPass efficiently",
        "category": "Swiss life",
        "reason": "You mentioned helping friends with SBB."
      },
      {
        "title": "Cook cheap student meals",
        "category": "Home & cooking",
        "reason": "This is a practical daily-life skill many students need."
      }
    ]
  }
}
```

---

## 8.2 Recommend learning skills

```http
POST /api/v1/ai/recommend-learning
```

Request:

```json
{
  "userId": "user_sara",
  "goal": "I want to feel more confident living in Switzerland.",
  "city": "Zürich",
  "languages": ["English", "German"],
  "interests": ["Swiss life", "Language practice"]
}
```

Response:

```json
{
  "data": {
    "suggestedRequests": [
      {
        "title": "Practice German small talk",
        "category": "Language practice",
        "reason": "This can help with daily confidence in Switzerland."
      },
      {
        "title": "Prepare for a flat viewing",
        "category": "Swiss life",
        "reason": "This is useful local knowledge for settling in."
      }
    ]
  }
}
```

---

## 8.3 Generate match explanation

```http
POST /api/v1/ai/explain-match
```

Request:

```json
{
  "userId": "user_sara",
  "listingId": "listing_123",
  "score": 91,
  "rawReasons": [
    "same language",
    "same city",
    "matching category"
  ]
}
```

Response:

```json
{
  "data": {
    "reason": "Lina is a strong match because she speaks English and German, is nearby, and has helped newcomers before."
  }
}
```

---

## 8.4 Draft first message

```http
POST /api/v1/ai/draft-message
```

Request:

```json
{
  "fromUserId": "user_sara",
  "toUserId": "user_lina",
  "listingId": "listing_123",
  "intent": "request_session"
}
```

Response:

```json
{
  "data": {
    "message": "Hi Lina, I saw your Skillswap listing about German small talk. Would you be open to a short session this weekend?"
  }
}
```

---

# 9. Session APIs

Sessions represent a user requesting or offering help.

---

## 9.1 Request session

```http
POST /api/v1/sessions/request
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

Request:

```json
{
  "fromUserId": "user_sara",
  "toUserId": "user_lina",
  "listingId": "listing_german_smalltalk",
  "message": "Hi Lina, could we do a 30-minute session this Saturday?"
}
```

Response:

```json
{
  "data": {
    "session": {
      "id": "session_abc123",
      "status": "requested"
    },
    "thread": {
      "id": "thread_abc123"
    }
  }
}
```

Backend behavior:

```txt
1. Create session.
2. Create chat thread.
3. Add first message.
4. Return sessionId and threadId.
```

---

## 9.2 Get session detail

```http
GET /api/v1/sessions/:sessionId
```

Response:

```json
{
  "data": {
    "session": {},
    "listing": {},
    "requester": {},
    "receiver": {},
    "thread": {}
  }
}
```

---

## 9.3 List sessions for user

```http
GET /api/v1/users/:userId/sessions
```

Query params:

```txt
status=requested | accepted | completed | cancelled
role=requester | receiver | any
limit=20
```

Example:

```http
GET /api/v1/users/user_sara/sessions?role=any&limit=20
```

Response:

```json
{
  "data": {
    "items": []
  }
}
```

---

## 9.4 Accept session

```http
PATCH /api/v1/sessions/:sessionId/accept
```

Response:

```json
{
  "data": {
    "session": {
      "id": "session_abc123",
      "status": "accepted"
    }
  }
}
```

Optional for demo.

---

## 9.5 Decline session

```http
PATCH /api/v1/sessions/:sessionId/decline
```

Request:

```json
{
  "reason": "Not available this week"
}
```

Response:

```json
{
  "data": {
    "session": {
      "id": "session_abc123",
      "status": "declined"
    }
  }
}
```

Optional for demo.

---

## 9.6 Cancel session

```http
PATCH /api/v1/sessions/:sessionId/cancel
```

Request:

```json
{
  "reason": "Plans changed"
}
```

Response:

```json
{
  "data": {
    "session": {
      "id": "session_abc123",
      "status": "cancelled"
    }
  }
}
```

Optional for demo.

---

## 9.7 Complete session

```http
POST /api/v1/sessions/:sessionId/complete
```

Request:

```json
{
  "feedbackTags": ["patient", "clear", "warm"],
  "note": "Lina helped me feel more confident speaking German."
}
```

Response:

```json
{
  "data": {
    "session": {
      "id": "session_abc123",
      "status": "completed"
    },
    "feedback": {
      "id": "feedback_abc123"
    },
    "impactScoreAdded": 25,
    "newChainStep": {
      "fromUserId": "user_lina",
      "toUserId": "user_sara",
      "skillTitle": "Practice German small talk"
    }
  }
}
```

Backend behavior:

```txt
1. Mark session completed.
2. Create feedback.
3. Update impact score.
4. Add skill-chain contribution.
5. Update area connection weight.
```

---

# 10. Chat APIs

Simple persisted demo chat. No WebSocket needed.

---

## 10.1 List chat threads for user

```http
GET /api/v1/users/:userId/chat-threads
```

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "thread_abc123",
        "listingId": "listing_123",
        "participantIds": ["user_sara", "user_lina"],
        "lastMessageText": "Saturday works for me.",
        "lastMessageAt": "2026-04-30T12:30:00.000Z",
        "participants": []
      }
    ]
  }
}
```

Frontend use:

```txt
/me dashboard
/chat/:threadId
```

---

## 10.2 Get chat thread

```http
GET /api/v1/chat/threads/:threadId
```

Response:

```json
{
  "data": {
    "thread": {},
    "listing": {},
    "participants": [],
    "messages": []
  }
}
```

---

## 10.3 Create chat thread

```http
POST /api/v1/chat/threads
```

Request:

```json
{
  "listingId": "listing_123",
  "participantIds": ["user_sara", "user_lina"],
  "initialMessage": "Hi Lina, I saw your listing and would love to learn more."
}
```

Response:

```json
{
  "data": {
    "thread": {},
    "firstMessage": {}
  }
}
```

Usually `POST /sessions/request` will create the thread, so this endpoint is optional.

---

## 10.4 Send chat message

```http
POST /api/v1/chat/threads/:threadId/messages
```

Headers:

```http
X-Demo-Session-Id: demo_session_abc123
X-Actor-User-Id: user_sara
```

Request:

```json
{
  "senderUserId": "user_sara",
  "text": "Thank you, Saturday afternoon works for me."
}
```

Response:

```json
{
  "data": {
    "message": {
      "id": "msg_abc123",
      "threadId": "thread_abc123",
      "senderUserId": "user_sara",
      "text": "Thank you, Saturday afternoon works for me.",
      "createdAt": "2026-04-30T12:30:00.000Z"
    },
    "thread": {
      "id": "thread_abc123",
      "lastMessageText": "Thank you, Saturday afternoon works for me."
    }
  }
}
```

---

## 10.5 Mark thread as read

```http
PATCH /api/v1/chat/threads/:threadId/read
```

Request:

```json
{
  "userId": "user_sara"
}
```

Response:

```json
{
  "data": {
    "read": true
  }
}
```

Optional for demo.

---

# 11. Feedback APIs

## 11.1 Create feedback

```http
POST /api/v1/feedback
```

Request:

```json
{
  "sessionId": "session_abc123",
  "fromUserId": "user_sara",
  "toUserId": "user_lina",
  "tags": ["patient", "clear", "warm"],
  "note": "Lina helped me feel more confident."
}
```

Response:

```json
{
  "data": {
    "feedback": {}
  }
}
```

Usually this is handled through:

```txt
POST /sessions/:sessionId/complete
```

So this separate feedback endpoint is optional.

---

## 11.2 Get feedback for user

```http
GET /api/v1/users/:userId/feedback
```

Response:

```json
{
  "data": {
    "items": [],
    "tagSummary": [
      {
        "tag": "patient",
        "count": 12
      },
      {
        "tag": "clear",
        "count": 9
      }
    ]
  }
}
```

Frontend use:

```txt
/profile/:userId
/listing/:id owner preview
```

---

# 12. Impact and visualization APIs

These power the emotional demo pages.

---

## 12.1 Get impact overview

```http
GET /api/v1/impact
```

Response:

```json
{
  "data": {
    "counters": {
      "users": 100,
      "teachingOffers": 180,
      "learningRequests": 160,
      "completedSessions": 300,
      "activeSkillChains": 40
    },
    "featuredChains": [],
    "areaConnections": [],
    "cityNodes": []
  }
}
```

Frontend use:

```txt
/impact
```

---

## 12.2 Get skill chains

```http
GET /api/v1/impact/chains
```

Query params:

```txt
limit=10
featured=true
userId=user_sara
```

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "chain_001",
        "steps": [
          {
            "fromUserId": "user_lina",
            "toUserId": "user_sara",
            "skillTitle": "Practice German small talk"
          },
          {
            "fromUserId": "user_sara",
            "toUserId": "user_omar",
            "skillTitle": "Use SBB / SwissPass efficiently"
          },
          {
            "fromUserId": "user_omar",
            "toUserId": "user_maya",
            "skillTitle": "Cook cheap student meals"
          }
        ]
      }
    ]
  }
}
```

---

## 12.3 Get user impact summary

```http
GET /api/v1/users/:userId/impact
```

Response:

```json
{
  "data": {
    "impactScore": 82,
    "sessionsGiven": 5,
    "sessionsTaken": 3,
    "chainsJoined": 2,
    "peopleHelped": 5,
    "topCategories": ["Swiss life", "Home & cooking"],
    "recentChainSteps": []
  }
}
```

---

## 12.4 Get area connections

```http
GET /api/v1/visual/connections
```

Response:

```json
{
  "data": {
    "nodes": [
      {
        "city": "Zürich",
        "canton": "ZH",
        "x": 505,
        "y": 165
      },
      {
        "city": "Bern",
        "canton": "BE",
        "x": 320,
        "y": 210
      }
    ],
    "edges": [
      {
        "sourceCity": "Zürich",
        "targetCity": "Bern",
        "weight": 18,
        "topCategories": ["Swiss life", "Language practice"],
        "latestSkill": "Prepare for a flat viewing"
      }
    ]
  }
}
```

Frontend use:

```txt
AreaConnectionGraph
```

---

# 13. Contact APIs

For the demo, email contact can be pure frontend `mailto:`. Still, one optional backend endpoint can record contact intent.

---

## 13.1 Record contact intent

```http
POST /api/v1/contact-intents
```

Request:

```json
{
  "fromUserId": "user_sara",
  "toUserId": "user_lina",
  "listingId": "listing_123",
  "method": "email"
}
```

Response:

```json
{
  "data": {
    "recorded": true
  }
}
```

Frontend behavior:

```txt
1. Call this endpoint optionally.
2. Open mailto link.
```

---

# 14. Admin APIs for demo setup

These are not for normal frontend users, but they are very useful for your team.

Protect with:

```http
X-Demo-Admin-Key: your-secret
```

---

## 14.1 Seed database

```http
POST /api/v1/admin/seed
```

Headers:

```http
X-Demo-Admin-Key: your-secret
```

Request:

```json
{
  "resetBeforeSeed": true
}
```

Response:

```json
{
  "data": {
    "seeded": true,
    "counts": {
      "users": 100,
      "listings": 340,
      "sessions": 300,
      "chatThreads": 120,
      "feedback": 250,
      "skillChains": 40,
      "areaConnections": 10
    }
  }
}
```

---

## 14.2 Reset database

```http
POST /api/v1/admin/reset
```

Response:

```json
{
  "data": {
    "reset": true
  }
}
```

---

## 14.3 Export demo data

```http
GET /api/v1/admin/export
```

Response:

```json
{
  "data": {
    "users": [],
    "listings": [],
    "sessions": [],
    "chatThreads": [],
    "feedback": [],
    "skillChains": [],
    "areaConnections": []
  }
}
```

Useful for debugging or restoring frontend mock data.

---

# 15. Frontend route → API mapping

## Landing page `/`

Use:

```txt
GET /api/v1/bootstrap
GET /api/v1/impact
POST /api/v1/demo/session
POST /api/v1/demo/select-user
```

---

## Browse learn `/browse/learn`

Use:

```txt
GET /api/v1/listings?type=offer
GET /api/v1/recommendations?intent=learn&userId=:userId
POST /api/v1/users/:userId/history/listing-view
POST /api/v1/users/:userId/saved-listings
DELETE /api/v1/users/:userId/saved-listings/:listingId
```

---

## Browse teach `/browse/teach`

Use:

```txt
GET /api/v1/listings?type=request
GET /api/v1/recommendations?intent=teach&userId=:userId
POST /api/v1/users/:userId/history/listing-view
```

---

## Listing detail `/listing/:id`

Use:

```txt
GET /api/v1/listings/:listingId
POST /api/v1/match-score
GET /api/v1/listings/:listingId/similar
GET /api/v1/listings/:listingId/recommended-matches
POST /api/v1/sessions/request
POST /api/v1/contact-intents
```

---

## Public profile `/profile/:userId`

Use:

```txt
GET /api/v1/users/:userId
GET /api/v1/users/:userId/feedback
GET /api/v1/users/:userId/impact
```

---

## Dashboard `/me`

Use:

```txt
GET /api/v1/users/:userId/dashboard
GET /api/v1/users/:userId/saved-listings
GET /api/v1/users/:userId/sessions
GET /api/v1/users/:userId/chat-threads
GET /api/v1/users/:userId/impact
```

---

## Create offer `/me/create-offer`

Use:

```txt
POST /api/v1/listings
```

with:

```json
{
  "type": "offer"
}
```

---

## Create request `/me/create-request`

Use:

```txt
POST /api/v1/listings
```

with:

```json
{
  "type": "request"
}
```

---

## Medal settings `/me/medals`

Use:

```txt
GET /api/v1/users/:userId/medals
PATCH /api/v1/users/:userId/medals
```

---

## Chat `/chat/:threadId`

Use:

```txt
GET /api/v1/chat/threads/:threadId
POST /api/v1/chat/threads/:threadId/messages
PATCH /api/v1/chat/threads/:threadId/read
```

---

## Impact `/impact`

Use:

```txt
GET /api/v1/impact
GET /api/v1/impact/chains
GET /api/v1/visual/connections
```

---

# 16. Minimal API set for the first real backend

To make the frontend “mock fake” become real, implement these first:

| Priority | Endpoint                          | Why                       |
| -------: | --------------------------------- | ------------------------- |
|        1 | `POST /demo/session`              | Demo session without auth |
|        2 | `GET /bootstrap`                  | Load real seed data       |
|        3 | `GET /listings`                   | Browse learn/teach pages  |
|        4 | `GET /listings/:id`               | Listing detail            |
|        5 | `POST /users`                     | Create user               |
|        6 | `POST /listings`                  | Create offer/request      |
|        7 | `GET /recommendations`            | Smart marketplace feel    |
|        8 | `POST /sessions/request`          | Main interaction          |
|        9 | `GET /chat/threads/:id`           | Chat detail               |
|       10 | `POST /chat/threads/:id/messages` | Persist chat              |
|       11 | `PATCH /users/:id/medals`         | Medal visibility          |
|       12 | `GET /impact`                     | Emotional pitch page      |
|       13 | `POST /admin/seed`                | Resettable pitch demo     |

Everything else can be added after.

---

# 17. Suggested frontend API client shape

```ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const sessionId = localStorage.getItem("skillswap:sessionId");
  const actorUserId = localStorage.getItem("skillswap:selectedUserId");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "X-Demo-Session-Id": sessionId } : {}),
      ...(actorUserId && actorUserId !== "visitor"
        ? { "X-Actor-User-Id": actorUserId }
        : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw error ?? new Error(`API error: ${res.status}`);
  }

  const json = await res.json();
  return json.data as T;
}
```

Example functions:

```ts
export const skillswapApi = {
  createDemoSession: () =>
    apiFetch<{ sessionId: string }>("/demo/session", {
      method: "POST",
      body: JSON.stringify({})
    }),

  getBootstrap: () =>
    apiFetch<BootstrapData>("/bootstrap"),

  getListings: (params: URLSearchParams) =>
    apiFetch<{ items: Listing[]; nextCursor: string | null }>(
      `/listings?${params.toString()}`
    ),

  getListing: (listingId: string) =>
    apiFetch<ListingDetailResponse>(`/listings/${listingId}`),

  createListing: (payload: CreateListingPayload) =>
    apiFetch<{ listing: Listing }>("/listings", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  requestSession: (payload: RequestSessionPayload) =>
    apiFetch<{ session: Session; thread: ChatThread }>("/sessions/request", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  sendMessage: (threadId: string, text: string, senderUserId: string) =>
    apiFetch<{ message: ChatMessage }>(
      `/chat/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ senderUserId, text })
      }
    )
};
```

---

# Final API recommendation

The frontend should be designed around these core backend capabilities:

```txt
1. Demo session
2. Bootstrap data
3. Users
4. Listings
5. Recommendations
6. Match scores
7. Sessions
8. Chat
9. Medals
10. Feedback
11. Impact
12. Area connections
13. Admin seed/reset
```

This gives you a backend that is real enough for the pitch checker to use, but still simple enough to build quickly.

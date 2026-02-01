## Context

Greenfield personal project to aggregate news from multiple interest areas (tech, India, AI) into a single feed. Single user, no authentication needed. Tavily API provides unified news search across sources.

**Current state**: No existing codebase. Starting fresh with `backend/` and `frontend/` directories.

## Goals / Non-Goals

**Goals:**
- Simple, fast news aggregation for personal use
- Easy topic management without backend complexity
- Deduplicated feed showing articles tagged with all matching topics
- Clean, card-based UI optimized for scanning headlines

**Non-Goals:**
- User authentication or multi-user support
- Server-side topic/preference storage
- Real-time push updates (on-demand refresh only)
- Full-text article content (link to original source)
- Offline support or caching

## Decisions

### 1. Backend: FastAPI (Python)

**Choice**: FastAPI with async support

**Why over alternatives**:
- Flask: FastAPI has built-in async, better for IO-bound Tavily calls
- Django: Overkill for a single endpoint, no ORM needed
- Direct frontend calls: Hides API key server-side, enables deduplication logic

**Structure**:
```
backend/
├── main.py          # FastAPI app, single POST /feed endpoint
├── tavily_client.py # Tavily API wrapper
├── dedup.py         # Deduplication logic
└── requirements.txt
```

### 2. Frontend: React (Vite)

**Choice**: React with Vite for fast dev experience

**Why over alternatives**:
- Next.js: SSR unnecessary for personal SPA
- Vue/Svelte: React familiarity, larger ecosystem

**Structure**:
```
frontend/
├── src/
│   ├── App.jsx           # Main layout
│   ├── components/
│   │   ├── TopicBar.jsx  # Topic chips + add/edit
│   │   ├── TopicModal.jsx# Add/edit topic dialog
│   │   ├── NewsFeed.jsx  # Card list container
│   │   └── NewsCard.jsx  # Individual article card
│   ├── hooks/
│   │   └── useTopics.js  # localStorage CRUD
│   └── api/
│       └── feed.js       # Backend fetch wrapper
└── package.json
```

### 3. Topic Storage: localStorage

**Choice**: Browser localStorage, no backend persistence

**Why**:
- Single user, single browser—no sync needed
- Zero backend complexity
- Topics are small (~1KB for dozens of topics)

**Schema**:
```json
{
  "topics": [
    { "id": "uuid", "name": "Tech", "query": "programming OR software", "enabled": true },
    { "id": "uuid", "name": "India", "query": "India news", "enabled": true }
  ]
}
```

### 4. Deduplication: URL-based

**Choice**: Exact URL match, merge topic tags

**Why over alternatives**:
- Title similarity: False positives, complex fuzzy matching
- Content hash: Requires fetching full content

**Logic**:
1. Fetch results for each enabled topic
2. Build map: `URL → { article, topics: Set }`
3. If URL seen, add topic to set
4. Return unique articles with merged topic arrays

### 5. API Contract

**Endpoint**: `POST /feed`

**Request**:
```json
{
  "topics": [
    { "name": "Tech", "query": "programming OR software" },
    { "name": "India", "query": "India news" }
  ]
}
```

**Response**:
```json
{
  "articles": [
    {
      "title": "...",
      "url": "https://...",
      "source": "TechCrunch",
      "published": "2026-02-01T10:00:00Z",
      "snippet": "...",
      "topics": ["Tech", "AI"]
    }
  ]
}
```

## Risks / Trade-offs

**[Tavily rate limits]** → Start with `search_depth=basic` (1 credit/query). Monitor usage, upgrade if needed.

**[localStorage limits (~5MB)]** → Topics are tiny. Not a practical concern.

**[No offline mode]** → Acceptable for personal use. Could add service worker later if needed.

**[API key exposure]** → Backend proxies all Tavily calls. Key never reaches frontend.

**[Stale news on slow refresh]** → Stateless by design. User controls refresh timing.

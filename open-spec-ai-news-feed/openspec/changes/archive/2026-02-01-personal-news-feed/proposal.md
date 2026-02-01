## Why

Staying informed across multiple interest areas (tech, India news, AI) requires visiting multiple sites and manually filtering noise. A personalized news aggregator that fetches from a single API (Tavily) and filters by user-defined topics would streamline this into a single, on-demand experience.

## What Changes

- Add Python backend (FastAPI) with endpoint to fetch news from Tavily API
- Add React frontend with topic management and card-based news display
- Implement deduplication logic to merge duplicate stories across topics
- Store user topics in browser localStorage (no backend persistence needed)
- Support on-demand refresh (stateless, no caching)

## Capabilities

### New Capabilities

- `news-aggregation`: Backend service that queries Tavily API for multiple topics, deduplicates results by URL, and returns merged feed sorted by recency
- `topic-management`: Frontend UI for creating, editing, deleting, and toggling topics with localStorage persistence
- `news-display`: Card-based frontend UI showing news articles with headline, source, age, topic tags, and link to original

### Modified Capabilities

None (greenfield project)

## Impact

- **New directories**: `backend/` (Python/FastAPI), `frontend/` (React)
- **External dependencies**: Tavily API (requires API key), React, FastAPI
- **Environment**: Tavily API key must be configured
- **No database**: Topics stored client-side in localStorage

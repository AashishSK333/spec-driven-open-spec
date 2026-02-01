## ADDED Requirements

### Requirement: Fetch news for multiple topics
The system SHALL accept a list of topics (each with name and query string) and return news articles from Tavily API for all enabled topics.

#### Scenario: Fetch news for two topics
- **WHEN** client sends POST /feed with topics [{ name: "Tech", query: "programming" }, { name: "AI", query: "artificial intelligence" }]
- **THEN** system queries Tavily API for each topic
- **AND** returns articles from both queries in a single response

#### Scenario: Empty topics list
- **WHEN** client sends POST /feed with empty topics array
- **THEN** system returns empty articles array

### Requirement: Deduplicate articles by URL
The system SHALL deduplicate articles across topics using exact URL match, merging topic tags for duplicates.

#### Scenario: Same article appears in two topics
- **WHEN** Tavily returns article with URL "https://example.com/news" for both "Tech" and "AI" queries
- **THEN** system returns single article with topics ["Tech", "AI"]

#### Scenario: Different articles with same title
- **WHEN** two articles have identical titles but different URLs
- **THEN** system returns both articles as separate entries

### Requirement: Sort articles by recency
The system SHALL return articles sorted by published date, newest first.

#### Scenario: Mixed date results
- **WHEN** Tavily returns articles with dates 2026-02-01, 2026-01-30, 2026-02-01
- **THEN** response orders articles: 2026-02-01, 2026-02-01, 2026-01-30

### Requirement: Return article metadata
The system SHALL return each article with title, url, source, published date, snippet, and topic tags.

#### Scenario: Complete article response
- **WHEN** Tavily returns an article
- **THEN** response includes title, url, source, published (ISO format), snippet, and topics array

### Requirement: Handle Tavily API errors
The system SHALL return appropriate error responses when Tavily API fails.

#### Scenario: Tavily API unavailable
- **WHEN** Tavily API returns 5xx error
- **THEN** system returns 502 Bad Gateway with error message

#### Scenario: Tavily rate limit exceeded
- **WHEN** Tavily API returns 429 rate limit error
- **THEN** system returns 429 with message indicating rate limit

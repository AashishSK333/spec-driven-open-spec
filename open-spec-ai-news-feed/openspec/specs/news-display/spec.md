## ADDED Requirements

### Requirement: Display news as cards
The system SHALL display news articles as cards in a vertical list.

#### Scenario: Card layout
- **WHEN** feed contains articles
- **THEN** each article displays as a card with headline, source, age, snippet, and topic tags

#### Scenario: Empty feed
- **WHEN** feed returns zero articles
- **THEN** system displays "No articles found" message

### Requirement: Show article headline
The system SHALL display article headline as the primary card element, linked to original source.

#### Scenario: Clickable headline
- **WHEN** user clicks article headline
- **THEN** browser opens original article URL in new tab

### Requirement: Show article source and age
The system SHALL display the source name and relative time (e.g., "2h ago") for each article.

#### Scenario: Source display
- **WHEN** article has source "TechCrunch"
- **THEN** card shows "TechCrunch" as source

#### Scenario: Relative time display
- **WHEN** article was published 2 hours ago
- **THEN** card shows "2h ago"

### Requirement: Show topic tags
The system SHALL display topic tags for each article, showing all topics the article matched.

#### Scenario: Single topic tag
- **WHEN** article matched only "Tech" topic
- **THEN** card shows single "Tech" tag

#### Scenario: Multiple topic tags
- **WHEN** article matched "Tech" and "AI" topics
- **THEN** card shows both "Tech" and "AI" tags

### Requirement: On-demand refresh
The system SHALL provide a refresh button to fetch latest news.

#### Scenario: Manual refresh
- **WHEN** user clicks Refresh button
- **THEN** system fetches fresh news for all enabled topics
- **AND** displays loading indicator during fetch
- **AND** replaces feed with new results

### Requirement: Show loading state
The system SHALL indicate loading state during news fetch.

#### Scenario: Loading indicator
- **WHEN** fetch is in progress
- **THEN** system shows loading spinner or skeleton cards

### Requirement: Show error state
The system SHALL display error message when fetch fails.

#### Scenario: API error display
- **WHEN** backend returns error
- **THEN** system displays error message with retry option

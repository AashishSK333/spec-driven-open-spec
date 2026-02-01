## ADDED Requirements

### Requirement: Create topic
The system SHALL allow users to create a new topic with name and query string.

#### Scenario: Create valid topic
- **WHEN** user enters name "Tech" and query "programming OR software"
- **AND** clicks Save
- **THEN** topic is added to localStorage
- **AND** topic appears in topic bar

#### Scenario: Create topic with empty name
- **WHEN** user leaves name field empty
- **THEN** Save button is disabled

### Requirement: Edit topic
The system SHALL allow users to edit existing topic name and query.

#### Scenario: Edit topic name
- **WHEN** user clicks edit on topic "Tech"
- **AND** changes name to "Technology"
- **AND** clicks Save
- **THEN** topic name updates in localStorage and UI

#### Scenario: Edit topic query
- **WHEN** user edits topic query from "programming" to "programming OR coding"
- **THEN** next refresh uses updated query

### Requirement: Delete topic
The system SHALL allow users to delete topics.

#### Scenario: Delete topic
- **WHEN** user clicks delete on topic "Tech"
- **THEN** topic is removed from localStorage
- **AND** topic disappears from topic bar

### Requirement: Toggle topic enabled state
The system SHALL allow users to enable/disable topics without deleting them.

#### Scenario: Disable topic
- **WHEN** user clicks on enabled topic chip
- **THEN** topic enabled state toggles to false
- **AND** chip shows disabled visual state

#### Scenario: Disabled topic excluded from fetch
- **WHEN** user refreshes feed with topic "Tech" disabled
- **THEN** POST /feed request excludes "Tech" from topics array

### Requirement: Persist topics in localStorage
The system SHALL persist all topic data in browser localStorage.

#### Scenario: Topics survive page reload
- **WHEN** user creates topic "AI"
- **AND** reloads the page
- **THEN** topic "AI" appears in topic bar with saved settings

#### Scenario: localStorage schema
- **WHEN** topics are saved
- **THEN** localStorage contains JSON with topics array, each having id, name, query, and enabled fields

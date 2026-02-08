---
name: ticket-management
description: Create, read, update, query, and close ITSM tickets with full audit trail and agent attribution.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 1
  requires_approval: true
---

Perform CRUD operations on ITSM tickets (Jira Service Management). Read operations are available at all autonomy levels; write operations require Level 2+ and human approval at lower levels.

**Input:** An action (`read` | `create` | `update` | `query` | `close`) and associated parameters — ticket ID, field values, or search filters.

## Steps

### 1. Determine action type

Parse the input to identify the requested action:
- **read**: Retrieve and display a single ticket
- **create**: Create a new incident or service request ticket
- **update**: Modify fields or add work notes to an existing ticket
- **query**: Search for tickets matching criteria (JQL or filters)
- **close**: Close a ticket after verifying closure criteria

### 2. Read — Fetch ticket details

- Retrieve the ticket from ITSM using the ticket ID
- Extract and format: summary, description, reporter, assignee, priority, status, category, creation time, SLA targets, work notes history
- Check for related or linked tickets (parent incidents, related requests)
- Show the full timeline of status changes

### 3. Create — Draft and submit a new ticket

- Validate that all required fields are present:
  - Summary, description, category, priority, reporter, affected system
- Apply categorization rules from `specs/incident-management.md` or `specs/request-management.md`
- Apply field mappings from `integrations/jira/field-mappings.yaml`
- **At L1**: Present the draft ticket for human review and approval — do NOT submit
- **At L2+**: Submit the ticket, add work note: "Ticket created by IT Support Agent — automated triage"
- Return the created ticket ID

### 4. Update — Modify an existing ticket

- Fetch the current ticket state
- Present a diff: what will change (old value → new value)
- Add a work note documenting the change reason
- Apply the update with agent attribution
- **At L1-L2**: Present changes for human approval before applying
- **At L3+**: Apply routine updates automatically (status, work notes, category adjustments)

### 5. Query — Search for matching tickets

- Build a search query from the provided filters:
  - Priority, status, category, assignee, date range, keyword
- Execute the search via ITSM MCP
- Return a summary table: ticket ID, summary, priority, status, assignee, age

### 6. Close — Verify and close a ticket

- Fetch the ticket and verify closure criteria from `specs/incident-management.md`:
  - Root cause documented
  - Resolution steps recorded
  - Resolution category tagged
  - Requestor/reporter notified
  - Verification performed (service restored)
- If criteria not met: list missing items, do NOT close
- If criteria met:
  - **At L1-L2**: Present summary for human to close
  - **At L3+**: Close the ticket, add final work note

## Output

**For read/create/update/close:**

```
## Ticket: <ticket-id>

| Field       | Value                          |
|-------------|--------------------------------|
| Summary     | <summary>                      |
| Priority    | <P1-P4>                        |
| Status      | <status>                       |
| Category    | <category> > <subcategory>     |
| Assignee    | <assignee>                     |
| Reporter    | <reporter>                     |
| Created     | <timestamp>                    |
| SLA Target  | Response: <time> / Resolution: <time> |

### Work Notes
- <timestamp> — <note>
- <timestamp> — <note>
```

**For query:**

```
## Ticket Search Results

**Query**: <search criteria>
**Results**: <N> tickets found

| Ticket      | Summary          | Priority | Status    | Assignee | Age  |
|-------------|------------------|----------|-----------|----------|------|
| INC0012345  | <summary>        | P2       | In Progress| <name>  | 3h   |
| INC0012346  | <summary>        | P3       | Open      | Unassigned| 1d  |
```

## Guardrails

- **NEVER delete tickets** — tickets are permanent records
- **ALWAYS add work notes** with "Automated by IT Support Agent" attribution for every modification
- At L1-L2: ticket creation and status changes require human approval — always show the draft first
- Always show the before/after diff for updates — never apply changes silently
- Never modify tickets belonging to other teams without explicit instruction
- If the ITSM system is unreachable, report this as a finding rather than failing silently
- Respect field-level permissions from `integrations/jira/field-mappings.yaml`

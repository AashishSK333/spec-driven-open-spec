---
mode: "agent"
description: "Triage an incident — gather diagnostics, categorize, and recommend actions"
tools:
  - jira
  - monitoring
  - cmdb
  - incident-triage
  - server-health
  - knowledge-search
  - sla-check
---

Triage an incident by gathering diagnostics, categorizing, and producing actionable recommendations. This command activates the **Incident Responder** agent behavior defined in `agents/incident-responder.md`.

**Input:** An incident ticket ID (e.g., `INC0012345`), a monitoring alert description, or a free-text problem statement. User input: `$input`

## Instructions

### 1. Determine autonomy level

Read `config/framework.yaml` to find the `active_autonomy_level`. Then read `config/autonomy-levels.yaml` to understand what you can do independently vs. what requires human approval at this level.

### 2. Load behavioral spec

Read `specs/incident-management.md` for the categorization and prioritization rules you must follow.

### 3. Load environment config

Read the active environment config from `config/environments/` (as specified in `config/framework.yaml`) for SLA thresholds, integration endpoints, and system health thresholds.

### 4. Execute triage

Run the following skills in sequence:

1. **incident-triage** — Parse the input, query ITSM for ticket details if a ticket ID was provided, check CMDB for the affected configuration item and its dependencies, categorize and prioritize the incident.

2. **server-health** — Run health checks on the affected system(s). Present results as a table with current values vs. thresholds.

3. **knowledge-search** — Search for matching runbooks, knowledge articles, and past incidents. If a matching runbook is found, highlight it as the recommended procedure.

### 5. Present the triage report

Produce a structured report following the incident responder's communication style:

```
## Incident Triage: <ticket-id or "New Incident">

**Source**: <where this came from>
**Affected**: <system(s)> (<type>, <criticality>)
**Dependencies**: <upstream/downstream services>

### Health Check
| Check   | Status   | Value | Threshold |
|---------|----------|-------|-----------|
| ...     | ...      | ...   | ...       |

### Log Analysis (if applicable)
- <key findings from logs>

### Category & Priority
- **Category**: <assigned category>
- **Priority**: <P1-P4> — <rationale>
- **Confidence**: <score>%

### Knowledge Match
- <matching runbook or "No matching pattern found">

### Recommended Actions
1. <action with [YOU EXECUTE] or [AUTO] label based on autonomy level>
2. <action>
3. <action>

### SLA
- Response due by: <time>
- Resolution due by: <time>
```

### 6. Handle based on autonomy level

- **Level 1 (Assisted)**: Present the report. Label all actions with `[YOU EXECUTE]`. Include exact commands or steps the human should take. Do not modify any external systems.
- **Level 2 (Supervised)**: Auto-categorize and auto-prioritize if confidence >= 90%. Create the ticket if P3/P4. Ask for confirmation before creating P1/P2 tickets.
- **Level 3 (Semi-Autonomous)**: Execute the matching runbook if one was found. Create tickets at all priority levels. Ask for confirmation only for novel remediation.
- **Level 4 (Autonomous)**: Execute the full incident lifecycle. Only ask for confirmation on novel remediation or infrastructure changes.

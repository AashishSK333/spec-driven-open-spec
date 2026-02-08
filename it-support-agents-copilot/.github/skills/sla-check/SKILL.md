---
name: sla-check
description: Check SLA compliance for a single ticket or generate an overall SLA compliance dashboard across all open tickets.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 1
  requires_approval: false
---

Query SLA compliance status for individual tickets or produce an aggregate compliance dashboard. Uses SLA definitions from the active environment config and ticket data from the ITSM system.

**Input:** A ticket ID (e.g., `INC0012345`) for single-ticket SLA check, OR `summary` for an overall SLA compliance dashboard.

## Steps

### 1. Load SLA definitions

- Read the active environment config (`config/environments/<env>.yaml`) for SLA targets:
  - P1: response time, resolution time
  - P2: response time, resolution time
  - P3: response time, resolution time
  - P4: response time, resolution time
- Read `specs/sla-definitions.md` for SLA clock rules (when clock starts, pauses, stops)

### 2. Single ticket — Calculate compliance

If a ticket ID is provided:
- Fetch the ticket from ITSM via `ticket-management` skill
- Determine the ticket's priority level
- Calculate:
  - **Response SLA**: Time from ticket creation to first response (work note or assignment)
  - **Resolution SLA**: Time from ticket creation to resolution (status = Resolved/Closed)
  - **Clock adjustments**: Subtract any time the ticket was in "Pending Customer" or "On Hold" status
- Calculate **time remaining** before SLA breach
- Determine status:
  - **On Track**: < 75% of SLA elapsed
  - **At Risk**: 75–99% of SLA elapsed
  - **Breached**: SLA time exceeded

### 3. Summary — Aggregate compliance

If `summary` is requested:
- Query all open tickets from ITSM grouped by priority
- For each ticket, calculate SLA status (On Track / At Risk / Breached)
- Aggregate:
  - Compliance % by priority (tickets on track / total tickets at that priority)
  - Overall compliance %
  - List of at-risk and breached tickets (sorted by urgency — closest to breach first)

### 4. Flag anomalies

- Flag tickets where priority was changed (SLA may need recalculation based on original vs current priority)
- Flag tickets with unusually long hold times (potential SLA gaming)
- Flag tickets approaching breach that are unassigned

## Output

**For single ticket:**

```
## SLA Status: <ticket-id>

| Metric             | Value                    |
|--------------------|--------------------------|
| Priority           | <P1-P4>                  |
| Created            | <timestamp>              |
| Current Status     | <status>                 |
| Assignee           | <assignee>               |

### Response SLA
- **Target**: <time> (per <priority> SLA)
- **Actual/Elapsed**: <time>
- **Status**: <On Track ✅ / At Risk ⚠️ / Breached 🔴>

### Resolution SLA
- **Target**: <time> (per <priority> SLA)
- **Elapsed**: <time> (clock adjustments: <hold time> deducted)
- **Time Remaining**: <time>
- **Status**: <On Track ✅ / At Risk ⚠️ / Breached 🔴>

### Notes
- <any anomalies — re-prioritization, long holds, etc.>
```

**For summary:**

```
## SLA Compliance Dashboard

**Generated**: <timestamp>
**Open Tickets**: <total count>

### Compliance by Priority
| Priority | Open | On Track | At Risk | Breached | Compliance |
|----------|------|----------|---------|----------|------------|
| P1       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| P2       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| P3       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| P4       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| **Total**| <n>  | <n>      | <n>     | <n>      | **<pct>%** |

### At-Risk Tickets (action needed)
| Ticket      | Priority | Time Remaining | Assignee     |
|-------------|----------|----------------|--------------|
| INC0012345  | P1       | 45 min         | <name>       |
| INC0012350  | P2       | 2h 15min       | Unassigned   |

### Breached Tickets
| Ticket      | Priority | Breached By | Assignee     |
|-------------|----------|-------------|--------------|
| INC0012340  | P2       | 1h 30min    | <name>       |
```

## Guardrails

- This skill is **read-only** — it never modifies tickets or SLA definitions
- Always show the **calculation basis**: which SLA definition was used, when the clock started, any clock adjustments applied
- If a ticket has been re-prioritized, flag it: "Priority changed from <old> to <new> on <date> — SLA calculation uses current priority"
- If SLA data is incomplete (missing timestamps, no response recorded): flag as a data quality issue, do not guess
- Never fabricate SLA metrics — if data is unavailable, report "Unable to calculate — <reason>"
- If the ITSM system is unreachable, report this rather than showing stale data

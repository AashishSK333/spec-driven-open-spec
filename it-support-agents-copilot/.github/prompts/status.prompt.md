---
mode: "agent"
description: "Display a real-time dashboard of open incidents, service requests, and SLA compliance"
tools:
  - jira
  - ticket-management
  - sla-check
---

Generate a real-time operational status dashboard showing open incidents, pending service requests, SLA compliance, and recent activity.

**Input:** None required. Optionally specify a filter: `incidents`, `requests`, `sla`, or `all` (default). User input: `$input`

## Instructions

Follow these steps to compile the status dashboard. This command aggregates data from multiple skills.

### 1. Determine autonomy level

Read `config/framework.yaml` for `active_autonomy_level` and the active environment.

### 2. Query open incidents

Use the **ticket-management** skill (query action):
- Query all open incidents (status not Resolved or Closed)
- Group by priority (P1, P2, P3, P4)
- Sort within each priority by age (oldest first)
- Highlight any P1 or P2 incidents prominently

### 3. Query open service requests

Use the **ticket-management** skill (query action):
- Query all open service requests (status not Completed or Closed)
- Group by status (Pending Approval, In Progress, Pending Customer)
- Identify the oldest pending request

### 4. Check SLA compliance

Use the **sla-check** skill (summary mode):
- Overall compliance % across all open tickets
- Compliance breakdown by priority
- List of at-risk tickets (>75% SLA elapsed)
- List of breached tickets

### 5. Get recent resolutions

Use the **ticket-management** skill (query action):
- Query the last 5 resolved/closed incidents (most recent first)
- Show: ticket ID, summary, priority, resolution time, SLA met (yes/no)

### 6. Morning check status

If today's morning check has been run:
- Show the overall status (GREEN/AMBER/RED)
- Show the count of findings by status
- Note the time of the last check

If no morning check has been run today:
- Note: "Morning check not yet completed today"

### 7. Present the dashboard

```
## IT Operations Status Dashboard

**Generated**: <timestamp>
**Environment**: <environment name>

---

### 🔴 Open Incidents

**Total**: <count> | **P1**: <count> | **P2**: <count> | **P3**: <count> | **P4**: <count>

#### P1 — Critical (immediate attention)
| Ticket      | Summary                    | Age    | Assignee     | SLA Status |
|-------------|----------------------------|--------|--------------|------------|
| INC0012345  | <summary>                  | 2h 15m | <name>       | At Risk    |

#### P2 — High
| Ticket      | Summary                    | Age    | Assignee     | SLA Status |
|-------------|----------------------------|--------|--------------|------------|
| INC0012350  | <summary>                  | 5h     | <name>       | On Track   |

#### P3/P4
<count> open (P3: <count>, P4: <count>)

---

### 📋 Open Service Requests

**Total**: <count> | **Pending Approval**: <count> | **In Progress**: <count> | **Pending Customer**: <count>

**Oldest pending**: <ticket-id> — <summary> (<age>)

---

### 📊 SLA Compliance

| Priority | Open | On Track | At Risk | Breached | Compliance |
|----------|------|----------|---------|----------|------------|
| P1       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| P2       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| P3       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| P4       | <n>  | <n>      | <n>     | <n>      | <pct>%     |
| **Total**| <n>  | <n>      | <n>     | <n>      | **<pct>%** |

**At-risk tickets**: <list or "None">

---

### ✅ Recent Resolutions (last 5)

| Ticket      | Summary          | Priority | Resolution Time | SLA Met |
|-------------|------------------|----------|-----------------|---------|
| INC0012340  | <summary>        | P2       | 6h 30m          | Yes     |
| INC0012338  | <summary>        | P3       | 18h             | Yes     |

---

### 🌅 Morning Check

**Last run**: <timestamp or "Not yet today">
**Status**: <GREEN/AMBER/RED or "Pending">
**Findings**: <RED count> critical, <AMBER count> warnings
```

This command is read-only at all autonomy levels — it aggregates and presents data without modifying any systems.

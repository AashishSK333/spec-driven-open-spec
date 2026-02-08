---
mode: "agent"
description: "Escalate an incident to the appropriate team with full context package"
tools:
  - jira
  - slack
  - cmdb
  - ticket-management
  - notification
  - sla-check
---

Route an incident to the correct specialist team with a complete context package, ensuring smooth handover and SLA tracking. This command activates the **Escalation Manager** agent behavior defined in `.github/agents/escalation-manager.agent.md`.

**Input:** An incident ticket ID (e.g., `INC0012345`) and optionally the target team or reason for escalation. User input: `$input`

## Instructions

### 1. Load routing rules

Read `config/escalation-matrix.yaml` for:
- Category-based routing (which category goes to which team)
- Escalation chain (team member → team lead → IT manager → IT director)
- Response expectations at each level

### 2. Determine autonomy level

Read `config/framework.yaml` for `active_autonomy_level`, then read `config/autonomy-levels.yaml`.

### 3. Load escalation spec

Read `specs/escalation-policy.md` for:
- Escalation triggers
- Context requirements (mandatory information for every escalation)
- Anti-ping-pong rules
- Communication rules per escalation level

### 4. Retrieve incident details

Use the **ticket-management** skill (read action) to fetch:
- Full ticket details: summary, description, category, priority, status
- Work notes history: what has been done so far
- Status change history: timeline of the incident
- Any previous escalation attempts

### 5. Determine target team

Based on the incident category, use `config/escalation-matrix.yaml` to determine the correct team:

```
### Escalation Routing

| Incident Category   | Target Team        |
|----------------------|--------------------|
| <current category>   | <determined team>  |

**Routing basis**: <category> → <team> per escalation-matrix.yaml
```

If a target team was specified in the input, validate it against the matrix:
- If it matches: proceed
- If it doesn't match: flag the discrepancy and recommend the matrix-suggested team

### 6. Compile context package

Build the mandatory context package per `specs/escalation-policy.md`:

```
### Escalation Context — <ticket-id>

**Ticket**: <ticket-id> | **Priority**: <P1-P4> | **Age**: <time since creation>

**Timeline**:
- <timestamp> — Incident reported
- <timestamp> — <action taken>
- <timestamp> — Escalation initiated

**What was checked**:
- <diagnostic step 1 — result>
- <diagnostic step 2 — result>

**What was tried**:
- <remediation attempt 1 — outcome>

**What was ruled out**:
- <system/cause confirmed not the issue>

**Why escalation is needed**:
<specific reason — lack of access, need expertise, SLA pressure, etc.>

**Recommended next steps**:
1. <suggested action for the receiving team>
2. <suggested action>
```

### 7. Update the ticket

Use **ticket-management** (update action) to:
- Add the context package as a work note
- Update the assignee/assignment group to the target team
- Set status to "Escalated"
- **L1**: Present the update for human approval
- **L2+**: Apply the update automatically

### 8. Notify the target team

Use the **notification** skill:
- Post to the target team's Slack channel with the context summary
- Include: ticket ID, priority, SLA status, reason for escalation
- For P1/P2: use urgency level "critical"
- For P3/P4: use urgency level "important"

### 9. Set SLA follow-up

Use the **sla-check** skill to:
- Record the current SLA status at time of escalation
- Note the expected response time from the receiving team
- Flag if SLA is already at risk or breached

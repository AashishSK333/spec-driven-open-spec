# Morning Check Workflow

Orchestrates the daily operational health check sequence across all system groups.

## References

- **Agent**: `agents/morning-check-operator.md`
- **Spec**: `specs/morning-checks.md`
- **Config**: `config/framework.yaml` (system groups, schedule, notification channels)
- **Environment**: `config/environments/<active>.yaml` (thresholds)
- **Template**: `templates/morning-check-report.md`

## Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. Load     │───▶│  2. Execute  │───▶│  3. Trend    │───▶│  4. Compile  │───▶│  5. Distribute│
│  Definitions │    │  Checks      │    │  Analysis    │    │  Report      │    │  and Act      │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## Phase 1: Load Check Definitions

**Trigger**: `/morning-check` command executed or scheduled trigger

**Skills used**: None (configuration loading)

**Steps**:
1. Read `config/framework.yaml` to identify system groups and check schedule
2. Read `specs/morning-checks.md` for check scope per group and threshold definitions
3. Read the active environment config for numeric threshold values
4. Load the morning check operator agent definition

**Output**: Check plan — list of system groups and the checks to perform for each

**Transition**: Proceed to Phase 2 for each system group

---

## Phase 2: Execute Checks Per System Group

**Trigger**: Check plan loaded from Phase 1

**Skills used**: `server-health`, `log-analysis`, `sla-check`

**Steps**:
1. For each system group (production-servers, databases, network, security):
   a. Run `server-health` on every system in the group
   b. Run `log-analysis` on each system (time range: last 24 hours)
   c. Note: `sla-check` runs once in summary mode (not per system)
2. Classify each finding as GREEN, AMBER, or RED per `specs/morning-checks.md` thresholds
3. Record all findings with: system name, check type, value, threshold, status

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Execute all checks (read-only); present raw findings |
| L2 | Execute all checks; auto-classify findings |
| L3 | Execute all checks; auto-classify; begin preparing incidents for RED findings |
| L4 | Execute all checks; auto-classify; auto-create incidents; begin remediation for known patterns |

**Output**: Raw findings per system group with GREEN/AMBER/RED classification

**Transition**: Proceed to Phase 3

---

## Phase 3: Trend Analysis

**Trigger**: All checks from Phase 2 complete

**Skills used**: None (data comparison)

**Steps**:
1. Load yesterday's morning check report (if available)
2. For each metric, compare today's value against yesterday's:
   - Calculate trend: ↑ improving, → stable, ↓ degrading
3. Apply trend escalation rules from `specs/morning-checks.md`:
   - AMBER persisting 3+ consecutive days → escalate to RED
   - AMBER worsening (trending toward critical) → escalate to RED
   - Multiple AMBER findings in same group → escalate group to RED
4. If no comparison data is available: note "First check — no trend data"

**Output**: Findings with trend annotations and any escalated statuses

**Transition**: Proceed to Phase 4

---

## Phase 4: Compile Report

**Trigger**: Trend analysis complete

**Skills used**: `report-generation`

**Steps**:
1. Use `report-generation` skill with `templates/morning-check-report.md`
2. Populate:
   - Header: date, time, environment, overall status
   - Summary table: system group, status, issue count, trend
   - RED findings: detailed with recommended actions
   - AMBER findings: listed with trend information
   - Comparison with yesterday: notable changes highlighted
   - Checks completed: total count
3. Flag any required data that is missing

**Output**: Complete morning check report (markdown)

**Transition**: Proceed to Phase 5

---

## Phase 5: Distribute and Act

**Trigger**: Report compiled

**Skills used**: `notification`, `ticket-management`

**Steps**:

### 5a. Post the report
- Use `notification` skill to post the report to the configured morning check channel
- Urgency level:
  - If overall status is RED: "important"
  - If overall status is AMBER: "routine"
  - If overall status is GREEN: "routine"

### 5b. Create incidents for RED findings

Per `specs/morning-checks.md` incident creation rules:

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Present list of recommended incidents with pre-filled details — human creates them |
| L2 | Create P3/P4 incidents automatically; present P1/P2 for human approval |
| L3 | Create all incidents automatically; notify team |
| L4 | Create all incidents; begin auto-remediation for known patterns |

For each incident to create:
1. Use `ticket-management` (create action) with:
   - Summary: "[Morning Check] <system> — <finding>"
   - Category: per `specs/incident-management.md`
   - Priority: RED findings default to P2; P1 if business-critical
   - Description: finding details, current value, threshold, trend
2. Link the incident to the morning check report

### 5c. Flag persistent issues
- If any AMBER finding has persisted for 3+ days without an existing ticket: recommend investigation

**Output**: Distribution confirmation + list of created or recommended incidents

---

## Completion

The morning check workflow is complete when:
1. All system groups have been checked
2. Report has been compiled and posted
3. Incidents have been created or recommended for RED findings
4. Team has been notified

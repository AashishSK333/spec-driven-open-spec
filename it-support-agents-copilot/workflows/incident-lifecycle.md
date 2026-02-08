# Incident Lifecycle Workflow

End-to-end workflow for handling an incident from detection through resolution and post-incident review.

**Active Agent**: `.github/agents/incident-responder.agent.md`
**Behavioral Spec**: `specs/incident-management.md`
**Autonomy Config**: `config/autonomy-levels.yaml`

---

## Overview

```
Phase 1          Phase 2        Phase 3         Phase 4         Phase 5         Phase 6
DETECTION   →   TRIAGE    →   DIAGNOSIS   →   RESOLUTION  →   CLOSURE    →   POST-INCIDENT
& INTAKE                                                                      (P1-P2 only)
```

---

## Phase 1: Detection & Intake

**Trigger**: New monitoring alert, user report, morning check finding, or direct request.

**Skills**: `ticket-management`

**Steps**:
1. Capture the incident source and initial details
2. If a ticket already exists: link to it and read existing context
3. If no ticket exists: draft a new ticket (at Level 1: present draft for human creation; at Level 2+: create automatically for P3/P4)
4. Acknowledge the alert in the monitoring system (at Level 3+)

**Output**: Incident ticket ID and initial details captured.

**Transition**: Proceed immediately to Phase 2.

---

## Phase 2: Triage

**Trigger**: Incident ticket exists with initial details.

**Skills**: `incident-triage`, `knowledge-search`, `sla-check`

**Steps**:
1. Run `incident-triage` skill:
   - Parse incident context
   - Query ITSM for ticket details
   - Check CMDB for configuration items and dependencies
   - Search knowledge base for matching patterns
   - Assign category and priority
   - Calculate confidence score
2. Run `sla-check` skill:
   - Determine SLA targets based on assigned priority
   - Calculate response deadline and resolution deadline
3. Present triage summary

**Decision Point — Autonomy Gate**:

| Autonomy Level | Action |
|----------------|--------|
| Level 1 | Present triage report. Human reviews and confirms category/priority. Human assigns to team. |
| Level 2 | Auto-confirm category/priority if confidence >= 90%. Auto-assign to team. Human reviews P1/P2 assignments. |
| Level 3 | Auto-confirm and auto-assign all priorities. Human notified but not blocked. |
| Level 4 | Fully autonomous triage with no human involvement. |

**Output**: Categorized, prioritized, and assigned incident with SLA clock started.

**Transition**: Proceed to Phase 3.

---

## Phase 3: Diagnosis

**Trigger**: Incident is categorized and assigned.

**Skills**: `server-health`, `log-analysis`, `knowledge-search`

**Steps**:
1. If a matching runbook was found during triage: begin executing the runbook
   - Follow the runbook steps sequentially
   - At each decision point, take the branch matching the current situation
2. If no runbook found: systematic diagnosis:
   a. Run `server-health` on all affected systems
   b. Run `log-analysis` on affected systems (last 30 minutes)
   c. Check for related incidents — search current open incidents for the same system
   d. Check for recent changes — query change management for last 48 hours
   e. Check for known problem records
3. Document all findings in ticket work notes with timestamps

**Escalation Check**:
- If diagnosis has taken longer than 50% of the resolution SLA: warn the analyst
- If diagnosis has taken longer than 75% of the resolution SLA: recommend escalation
- If the issue is outside the analyst's technical scope: escalate per escalation matrix

**Output**: Root cause identified (or best hypothesis with supporting evidence).

**Transition**: If root cause found → Phase 4. If stuck → escalate per `config/escalation-matrix.yaml`.

---

## Phase 4: Resolution

**Trigger**: Root cause identified and remediation plan determined.

**Skills**: `service-restart`, `ticket-management`

**Steps**:
1. Determine the remediation action based on diagnosis findings
2. Check if the action is safe to execute:
   - Is there a maintenance window? Check the calendar.
   - Is this a known, safe remediation? Check runbook.
   - What is the blast radius? How many other services could be affected?
3. Execute the remediation

**Decision Point — Autonomy Gate**:

| Autonomy Level | Action |
|----------------|--------|
| Level 1 | Present the remediation plan with exact commands. Human executes manually. |
| Level 2 | Present the remediation plan. Human approves, then agent executes. |
| Level 3 | Auto-execute if remediation is from a known runbook. Human approval for novel actions. |
| Level 4 | Auto-execute all known remediations. Human approval only for novel or infrastructure-level changes. |

4. After execution: immediately proceed to verification (Phase 5 step 1)

**Output**: Remediation action applied.

**Transition**: Proceed to Phase 5.

---

## Phase 5: Closure

**Trigger**: Remediation action has been applied.

**Skills**: `server-health`, `ticket-management`, `notification`

**Steps**:
1. **Verify resolution**:
   - Re-run `server-health` on all affected systems
   - Confirm the original symptom is no longer present
   - Wait 15 minutes, then re-check (for recurrence detection)
2. **Document resolution** in the ticket:
   - Root cause
   - Steps taken (timestamped)
   - Remediation applied
   - Resolution category tag
   - Recurrence risk assessment
3. **Notify stakeholders**:
   - Send resolution notification to affected users
   - Post update to relevant Slack channel

**Decision Point — Autonomy Gate**:

| Autonomy Level | Action |
|----------------|--------|
| Level 1 | Present resolution summary. Human closes the ticket. |
| Level 2 | Present resolution summary. Human approves closure. |
| Level 3 | Auto-close after verification passes and 15-minute monitoring period completes. |
| Level 4 | Auto-close with notification. |

4. **Pattern check**:
   - If this is the 3rd+ occurrence with the same root cause: recommend problem record creation
   - If a manual procedure was used: recommend runbook creation or update
   - If resolution involved a workaround: flag the permanent fix needed

**Output**: Ticket closed, stakeholders notified, patterns flagged.

**Transition**: For P1-P2 incidents → Phase 6. For P3-P4 → workflow complete.

---

## Phase 6: Post-Incident Review (P1-P2 Only)

**Trigger**: Priority 1 or 2 incident has been closed.

**Skills**: `report-generation`

**Steps**:
1. Generate a post-incident report using `templates/incident-report.md`:
   - Timeline of events (detection → triage → diagnosis → resolution → closure)
   - Root cause analysis
   - Impact assessment (duration, affected users/services)
   - What went well
   - What could be improved
   - Action items with owners
2. Schedule a post-incident review meeting (recommend, don't auto-schedule)
3. Propose spec or runbook updates if the incident revealed gaps:
   - New categorization pattern needed? → suggest `specs/incident-management.md` update
   - New procedure discovered? → suggest new runbook
   - Existing runbook missing steps? → suggest runbook update

**Output**: Post-incident report generated, improvement actions proposed.

---

## SLA Monitoring (Background)

Throughout all phases, continuously monitor SLA compliance:

- **Response SLA**: Time from ticket creation to first meaningful action (triage completion)
- **Resolution SLA**: Time from ticket creation to verified resolution

If an SLA is at risk:
- At 50% elapsed: warning to assigned analyst
- At 75% elapsed: warning + recommend escalation
- At 100% elapsed: SLA breach notification to team lead per `config/escalation-matrix.yaml`

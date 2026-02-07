# SLA Definitions

Behavioral specification for Service Level Agreement targets, clock rules, breach handling, and compliance reporting.

## Priority Definitions

### Priority 1 — Critical
- **Criteria**: Business-critical service is completely unavailable; revenue-impacting outage; security breach confirmed; multiple business units affected
- **Examples**: Payment processing down, main website unreachable, data breach detected, email system outage
- **Assigned when**: Any single criterion above is met
- **Escalation**: Immediate — triggers major incident process

### Priority 2 — High
- **Criteria**: Business-critical service is degraded (partial functionality); standard service completely unavailable; single business unit severely impacted
- **Examples**: Website slow but functional, internal application down, database replication lag causing data inconsistency
- **Assigned when**: Service is impaired but workarounds may exist
- **Escalation**: If not acknowledged within response target

### Priority 3 — Medium
- **Criteria**: Standard service degraded; non-critical system issue affecting multiple users; intermittent issues with workaround available
- **Examples**: Printer offline, VPN slow for a group, non-critical application errors, scheduled report failing
- **Assigned when**: Impact is limited and workarounds exist
- **Escalation**: If SLA resolution target is at risk (>75% elapsed)

### Priority 4 — Low
- **Criteria**: Single-user issue with workaround; cosmetic defect; informational request; non-urgent enhancement
- **Examples**: Desktop shortcut missing, font rendering issue, how-to question, feature suggestion
- **Assigned when**: Minimal business impact; user can continue working
- **Escalation**: Only if SLA is breached

## SLA Targets

SLA targets are defined per environment in `config/environments/<env>.yaml`. The production targets are:

| Priority | Response Time | Resolution Time |
|----------|--------------|-----------------|
| P1 — Critical | 15 minutes | 4 hours |
| P2 — High | 30 minutes | 8 hours |
| P3 — Medium | 4 hours | 24 hours |
| P4 — Low | 8 hours | 72 hours |

### Response time
- Measured from ticket creation to first meaningful response
- A "meaningful response" is: assignment to an analyst, first work note with diagnostic content, or direct communication with the reporter
- Auto-acknowledgment messages do NOT count as a response

### Resolution time
- Measured from ticket creation to status changed to "Resolved"
- The resolution must actually address the reported issue
- Workaround applied counts as resolution if the workaround is documented and user confirms functionality restored

## SLA Clock Rules

### When the clock starts
- **Incidents**: When the ticket is created in ITSM (regardless of source — monitoring alert, user report, morning check)
- **Service Requests**: When the request ticket is submitted with all required fields

### When the clock pauses
- **Pending Customer**: Waiting for information or confirmation from the reporter
- **Pending Vendor**: Waiting for response from a third-party vendor
- **Pending Change**: Resolution requires a scheduled change window
- The reason for pause must be documented in the ticket work notes

### When the clock resumes
- When the reporter responds (Pending Customer)
- When the vendor responds (Pending Vendor)
- When the change window begins (Pending Change)
- Clock resumes automatically — no manual action needed

### When the clock stops
- When the ticket status is changed to "Resolved" or "Closed"
- If reopened: a new SLA clock starts from the reopen timestamp

### Clock rules — guardrails
- Tickets cannot be placed in "Pending Customer" without sending a communication to the customer
- Tickets cannot remain in "Pending" statuses for more than 5 business days without follow-up
- Placing tickets on hold to avoid SLA breach is tracked and flagged as potential SLA gaming

## Breach Handling

### When response SLA is breached

1. **Immediate notification**: Alert the team channel via `notification` skill (urgency: important)
2. **Escalate**: If unassigned, escalate per `specs/escalation-policy.md` Level 1
3. **Track**: Record the breach in the ticket and in SLA metrics
4. **For P1**: Notify IT Manager immediately

### When resolution SLA is breached

1. **Notification**: Alert the team channel + assigned analyst + team lead
2. **Escalate**: Move to next escalation level per `specs/escalation-policy.md`
3. **For P1/P2**: Notify IT Manager, provide impact assessment and ETA
4. **Track**: Record the breach, elapsed time, and current status
5. **Post-resolution**: Include in post-incident review (for P1/P2)

### SLA breach — autonomy behavior
- **L1**: Present breach notification for human to send and escalation for human to execute
- **L2**: Send breach notifications automatically; present escalation for human approval
- **L3+**: Send notifications and execute escalation automatically

### At-risk warnings
- When a ticket reaches **75% of SLA elapsed**: generate an at-risk warning
- Notify the assigned analyst and team lead
- Include: ticket ID, priority, time remaining, current status, suggested actions

## Reporting Requirements

### Daily SLA Report
- Generated as part of morning checks (or on demand via `/status`)
- Contents:
  - Overall compliance % (last 24 hours)
  - Compliance % by priority
  - Number of breaches (last 24 hours)
  - At-risk tickets (list with time remaining)
  - Trends: compliance % compared to last 7 days

### Weekly SLA Report
- Generated at end of business Friday (or on demand)
- Contents:
  - Weekly compliance % by priority
  - Total tickets resolved within SLA / total resolved
  - Breach analysis: which tickets breached and why
  - Average resolution time by priority vs target
  - Trend: compliance % over the last 4 weeks
  - Recommendations: patterns causing breaches, suggested improvements

### Monthly SLA Report
- For management review and governance
- Contents:
  - Monthly compliance % by priority
  - Breach root cause analysis
  - Top 5 categories with longest resolution times
  - SLA target appropriateness assessment (are targets realistic?)
  - Recommendations for threshold adjustments

### Report generation
- Use the `report-generation` skill and `sla-check` skill data
- Reports are local artifacts — distribution is via `notification` skill or manual

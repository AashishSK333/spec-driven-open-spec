# Escalation Policy

Behavioral specification for when and how to escalate incidents and requests — routing rules, context requirements, and anti-ping-pong measures.

## Escalation Triggers

### When to escalate

### SLA At Risk
- Response SLA has been breached or will breach within 30 minutes
- Resolution SLA is at risk (>75% elapsed) and no clear path to resolution
- Action: Escalate to team lead, then IT manager if no response in 30 minutes

### Complexity Beyond Scope
- Diagnosis requires access or expertise the current analyst does not have
- Issue spans multiple technology domains (e.g., network + application + database)
- Root cause cannot be determined with available tools and knowledge
- Action: Escalate to the specialist team per `config/escalation-matrix.yaml`

### Multi-Team Coordination Required
- Resolution requires changes by more than one team
- Dependencies exist between actions by different teams
- Action: Escalate to IT manager for coordination, create sub-tasks per team

### Security Incidents
- Any confirmed or suspected security breach
- Unauthorized access detected
- Data exposure or loss
- Action: Immediate escalation to Security Operations — do NOT wait for SLA

### Major Incident (P1)
- Business-critical service completely unavailable
- Multiple users or services affected simultaneously
- Action: Trigger major incident process — escalate to IT manager immediately, post to `#major-incidents`

### Customer/VIP Escalation
- Requestor or affected user is flagged as VIP in ITSM
- Explicit escalation request from management
- Action: Prioritize handling, escalate to team lead for visibility

## Context Requirements

Every escalation must include the following information. Escalations without this context will be rejected.

### Mandatory Context Package
1. **Ticket ID** and current status
2. **Timeline**: When the issue was reported, what has been done so far, and how long each step took
3. **What was checked**: List of diagnostic steps performed
4. **What was found**: Results of each diagnostic step
5. **What was tried**: Any remediation attempts and their outcomes
6. **What was ruled out**: Systems or causes confirmed to not be the issue
7. **Why escalation is needed**: Specific reason — lack of access, need expertise, SLA pressure
8. **Recommended next steps**: What the analyst believes should be done next

### Why this matters
- Prevents the receiving team from re-doing work already completed
- Reduces resolution time by giving clear next steps
- Creates an audit trail of the diagnostic process
- Prevents "I don't know, figure it out" escalations

## Routing Rules

Use `config/escalation-matrix.yaml` to determine the target team based on incident category:

### Category-Based Routing
- **Infrastructure > Server**: Server Operations team
- **Infrastructure > Network**: Network Operations team
- **Application > Web**: Web Platform team
- **Application > API**: API/Backend team
- **Database**: DBA team
- **Security**: Security Operations team (always immediate)
- **End User > Desktop**: Desktop Support team
- **End User > Email/Collaboration**: Messaging team

### When category is unclear
- If the incident category is ambiguous, escalate to the team lead for routing decision
- Do NOT guess or bounce the ticket between teams
- If the team lead is unavailable, escalate to IT manager

## Escalation Chain

From `config/escalation-matrix.yaml`:

| Level | Role | Response Expected |
|-------|------|-------------------|
| 1 | Specialist team member | 30 minutes |
| 2 | Specialist team lead | 30 minutes |
| 3 | IT Manager | 15 minutes |
| 4 | IT Director | 15 minutes |

### Automatic escalation progression
- If Level 1 does not respond within the expected time: escalate to Level 2
- If Level 2 does not respond within the expected time: escalate to Level 3
- Level 3 and 4 are reserved for P1 incidents and SLA breach situations

## Anti-Ping-Pong Rules

### Preventing ticket bouncing

### When a ticket is bounced back
- If a ticket is reassigned back to the originating team without resolution:
  - The receiving team **must** provide a documented reason for returning it
  - The reason must include: what they checked, why it's not their issue, who they believe should handle it
- If no reason is provided: reject the bounce-back and escalate to Level 2

### Second bounce
- If a ticket is bounced between teams a second time:
  - **Immediately escalate to IT Manager** (Level 3)
  - IT Manager assigns ownership and resolution responsibility
  - The assigned team cannot re-escalate without IT Manager approval

### Third bounce
- Should never happen. If it does:
  - Escalate to IT Director (Level 4)
  - Flag as a process failure for retrospective review

### Tracking
- Record each reassignment in the ticket with timestamp, from-team, to-team, and reason
- Track bounce count as a metric for process improvement

## Communication Rules

### Who to notify at each escalation level

### Level 1 (to specialist team)
- Notify: target team channel on Slack
- Update: ticket assignee and work notes
- No management notification needed

### Level 2 (to team lead)
- Notify: team lead directly (Slack DM or email) + team channel
- Update: ticket with escalation reason
- CC: original analyst for awareness

### Level 3 (to IT Manager)
- Notify: IT Manager directly + `#it-management` channel
- Update: ticket with full context package
- CC: original analyst + team lead
- Frequency: status update every 30 minutes until resolved

### Level 4 (to IT Director)
- Notify: IT Director directly + IT Manager
- Update: ticket with executive summary
- Status update: every 15 minutes
- This level indicates a critical process or service failure

### Notification format
- Use the `notification` skill with appropriate urgency level
- Include: ticket ID, summary, escalation level, reason, time remaining on SLA
- For P1: include business impact assessment

# Domain Storytelling Interview Guide
## IT Support Team Lead Discussion

**Purpose**: Gather detailed information about IT support activities to create domain storytelling narratives for the product team.

**Date**: [To be filled]
**Interviewee**: Support Team Lead
**Duration**: 90-120 minutes

---

## 1. Team Overview & Context

### 1.1 Team Structure
- [ ] How many people are on the IT support team?
- [ ] What are the different roles? (L1, L2, L3, specialists)
- [ ] What are typical shift patterns? (24/7, business hours, on-call rotation)
- [ ] How do responsibilities differ across levels/roles?

### 1.2 Current Tooling Landscape
- [ ] What is your primary ticketing/ITSM system? (Jira, ServiceNow, other)
- [ ] What monitoring tools do you use? (Datadog, Prometheus, Nagios, Zabbix)
- [ ] Communication platforms? (Slack, Teams, email)
- [ ] Knowledge base/wiki? (Confluence, SharePoint, internal wiki)
- [ ] CMDB/Asset management system?
- [ ] Other critical tools?

### 1.3 Scope & Volume
- [ ] What types of issues does your team handle? (hardware, software, network, access, etc.)
- [ ] Average tickets per day/week?
- [ ] What's the split between incidents vs. service requests?
- [ ] Peak hours/days for support activity?

---

## 2. Incident Management Deep Dive

### 2.1 Incident Discovery & Intake
**Story Starter**: *"Walk me through what happens when an incident is first discovered..."*

- [ ] **How do incidents reach your team?**
  - User-reported (email, portal, phone, Slack)?
  - System-generated alerts from monitoring?
  - Discovered during proactive checks?
  - Escalated from other teams?

- [ ] **First response actions:**
  - Who typically picks up the new incident?
  - What information do you gather first?
  - What questions do you ask the user?
  - What systems do you check immediately?

- [ ] **Real example**: Can you describe a recent incident from discovery to resolution?

### 2.2 Triage & Categorization
**Story Starter**: *"Once you have a new incident, how do you determine its priority and category..."*

- [ ] **Categorization process:**
  - What categories do you use? (hardware, software, network, security, access, etc.)
  - Who decides the category?
  - How often do you need to recategorize?

- [ ] **Priority assignment:**
  - What priority levels do you use? (P1/P2/P3/P4, Critical/High/Medium/Low)
  - What criteria determine each priority?
  - Who can change priority levels?
  - What happens when priority is bumped up?

- [ ] **SLA awareness:**
  - What are your SLA targets for each priority?
  - How do you track SLA compliance?
  - What happens when approaching SLA breach?
  - How often do SLA breaches occur?

### 2.3 Diagnosis & Investigation
**Story Starter**: *"After triaging, how do you investigate the root cause..."*

- [ ] **Diagnostic steps:**
  - What's your typical investigation workflow?
  - What logs do you check first?
  - What monitoring dashboards do you consult?
  - Do you have runbooks or procedures you follow?

- [ ] **Information gathering:**
  - What data do you collect from the user?
  - What data do you collect from systems?
  - How do you document your findings?
  - Where do you record investigation notes?

- [ ] **Knowledge resources:**
  - Do you consult a knowledge base?
  - Do you search past similar tickets?
  - Do you ask colleagues for help? How?
  - How do you know if an issue is "known" vs. new?

### 2.4 Resolution & Remediation
**Story Starter**: *"Once you know the problem, how do you fix it..."*

- [ ] **Resolution paths:**
  - What types of fixes can you apply yourself?
  - What requires approvals or change management?
  - What needs to be escalated to other teams?
  - What percentage of issues can you resolve at first contact?

- [ ] **Execution:**
  - Do you have standard runbooks for common issues?
  - What actions require supervisor approval?
  - How do you handle high-risk changes (restarts, config changes)?
  - What rollback procedures exist?

- [ ] **Verification:**
  - How do you confirm the fix worked?
  - Do you test before informing the user?
  - Who validates the resolution?
  - How do you handle recurrence?

### 2.5 Communication & Updates
**Story Starter**: *"How do you keep stakeholders informed during incident resolution..."*

- [ ] **User communication:**
  - How often do you update the user?
  - What channels do you use? (ticket comments, email, Slack, phone)
  - What do you communicate at each stage?
  - How do you manage user expectations?

- [ ] **Team communication:**
  - How do you notify your team about critical incidents?
  - Do you have dedicated channels for urgent issues?
  - How do you coordinate when multiple people are involved?

- [ ] **Management reporting:**
  - What updates go to management?
  - How do you report on P1/P2 incidents?
  - What triggers executive visibility?

### 2.6 Escalation Scenarios
**Story Starter**: *"Tell me about situations where you need to escalate..."*

- [ ] **When to escalate:**
  - What are the triggers for escalation? (skill gap, time elapsed, complexity, impact)
  - Who makes the escalation decision?
  - What priority levels typically get escalated?

- [ ] **Escalation targets:**
  - What teams do you escalate to? (L2, L3, network, security, database, infrastructure)
  - How do you determine the right team?
  - Do you have a decision tree or routing rules?

- [ ] **Escalation handoff:**
  - What information do you provide during escalation?
  - How do you hand over context?
  - Do you stay involved after escalation?
  - How do you prevent "ping-pong" escalations?

- [ ] **Real example**: Can you describe a recent complex escalation?

### 2.7 Closure & Documentation
**Story Starter**: *"When do you consider an incident closed, and what happens then..."*

- [ ] **Closure criteria:**
  - What must be true before closing a ticket?
  - Who can close tickets?
  - Do you wait for user confirmation?
  - How long do you wait before auto-closing?

- [ ] **Documentation requirements:**
  - What do you document in the resolution notes?
  - Is there a template or standard format?
  - How detailed should documentation be?
  - Who reviews documentation quality?

- [ ] **Post-incident activities:**
  - Do you conduct post-mortems? For what incidents?
  - How do you capture lessons learned?
  - How do you update runbooks/KB articles?
  - Do you track recurring issues?

---

## 3. Service Request Management

### 3.1 Request Types & Catalog
**Story Starter**: *"What types of service requests does your team handle..."*

- [ ] **Common request types:**
  - User provisioning/de-provisioning (onboarding/offboarding)
  - Access requests (applications, systems, permissions)
  - Software installations
  - Hardware requests (laptops, monitors, peripherals)
  - Password resets
  - Email/distribution list management
  - VPN access
  - Other?

- [ ] **Service catalog:**
  - Do you have a formal service catalog?
  - Are there standard request forms?
  - What information is required for each request type?

### 3.2 Request Fulfillment Workflow
**Story Starter**: *"Walk me through fulfilling a typical access request..."*

- [ ] **Intake & validation:**
  - How do requests come in?
  - What validation do you perform?
  - What happens if information is incomplete?

- [ ] **Approval process:**
  - Which requests require approval?
  - Who are the approvers? (manager, data owner, security)
  - How do you route for approval?
  - What if approval is delayed or denied?

- [ ] **Fulfillment:**
  - Who executes the request?
  - What procedures do you follow?
  - How long does typical fulfillment take?
  - What can be automated vs. manual?

- [ ] **Completion:**
  - How do you notify the requestor?
  - What documentation is required?
  - Do you track fulfillment SLAs?

### 3.3 Special Request Scenarios
- [ ] **Bulk requests** (e.g., 50 new hires): How do you handle these?
- [ ] **Urgent/expedited requests**: What's the process?
- [ ] **Denied/cancelled requests**: How do you handle these?
- [ ] **Request dependencies**: How do you manage multi-step requests?

---

## 4. Proactive Operations

### 4.1 Morning/Daily Health Checks
**Story Starter**: *"Tell me about your daily operational checks..."*

- [ ] **Check routine:**
  - Do you perform daily health checks?
  - Who is responsible?
  - What time do they occur?
  - How long does it take?

- [ ] **What gets checked:**
  - Production servers (CPU, memory, disk space)
  - Critical services/applications
  - Backup job status
  - Database health
  - Network connectivity
  - SSL certificate expiry
  - Monitoring system health
  - Pending alerts/tickets

- [ ] **Check execution:**
  - Is there a checklist or procedure?
  - What tools do you use?
  - How do you document findings?
  - What thresholds indicate problems?

- [ ] **Response to findings:**
  - What happens when you find an issue?
  - Do you create tickets proactively?
  - Who gets notified?
  - What's the priority of proactive findings?

### 4.2 Monitoring & Alerting
**Story Starter**: *"How do alerts from monitoring systems reach your team..."*

- [ ] **Alert sources:**
  - What monitoring tools send alerts?
  - What channels receive alerts? (email, Slack, PagerDuty, SMS)
  - How are alerts routed to the right person?

- [ ] **Alert handling:**
  - How do you acknowledge alerts?
  - Do all alerts create tickets?
  - How do you filter noise from actionable alerts?
  - What's your alert fatigue situation?

- [ ] **On-call process:**
  - Do you have on-call rotation?
  - How do critical alerts reach on-call engineer?
  - What's the expected response time?
  - What authority does on-call have?

### 4.3 Preventive Maintenance
- [ ] **Scheduled maintenance:**
  - What preventive tasks do you perform?
  - How often? (daily, weekly, monthly)
  - How do you track completion?

- [ ] **Patching & updates:**
  - Who handles system patching?
  - How do you schedule and coordinate?
  - How do you handle emergency patches?

---

## 5. Knowledge Management

### 5.1 Knowledge Capture
**Story Starter**: *"How does knowledge get documented in your team..."*

- [ ] **Documentation triggers:**
  - When do you create new KB articles?
  - When do you update existing articles?
  - Who is responsible for documentation?
  - Is documentation mandatory?

- [ ] **Documentation process:**
  - What tool do you use for KB?
  - Is there a template or standard format?
  - Who reviews and approves articles?
  - How do you ensure quality?

- [ ] **Runbook creation:**
  - When do you create a runbook?
  - What goes into a runbook vs. KB article?
  - How do you maintain runbooks?

### 5.2 Knowledge Usage
**Story Starter**: *"How do you find and use existing knowledge during troubleshooting..."*

- [ ] **Search behavior:**
  - How do you search for solutions?
  - What keywords or tags do you use?
  - How often do you find what you need?
  - What do you do when KB doesn't help?

- [ ] **Knowledge gaps:**
  - How do you identify missing documentation?
  - How do you report gaps?
  - Who prioritizes documentation work?

### 5.3 Knowledge Quality
- [ ] **Review cycles**: How often are articles reviewed?
- [ ] **Deprecation**: How do you retire outdated content?
- [ ] **Metrics**: Do you track KB usage/helpfulness?

---

## 6. Team Collaboration & Handoffs

### 6.1 Internal Team Collaboration
**Story Starter**: *"How does your team collaborate on complex issues..."*

- [ ] **Collaboration scenarios:**
  - When do you ask colleagues for help?
  - How do you ask? (Slack, in-person, ticket notes)
  - How do you share expertise?

- [ ] **Shift handoffs:**
  - Do you have shift handoffs?
  - What gets communicated during handoff?
  - How do you ensure continuity?

- [ ] **Ticket reassignment:**
  - When do you reassign tickets?
  - How do you ensure context transfer?

### 6.2 Cross-Team Collaboration
**Story Starter**: *"Tell me about working with other teams..."*

- [ ] **Common collaborators:**
  - Network team
  - Security team
  - Database team
  - Application teams
  - Infrastructure/DevOps
  - Vendors

- [ ] **Collaboration patterns:**
  - How do you engage other teams?
  - What information do you provide?
  - How do you track cross-team work?
  - How do you handle dependencies?

---

## 7. Pain Points & Challenges

### 7.1 Current Frustrations
**Story Starter**: *"What slows you down or frustrates you the most in your daily work..."*

- [ ] **Tooling issues:**
  - Slow systems?
  - Missing integrations?
  - Too many tools/context switching?
  - Poor search/findability?

- [ ] **Process issues:**
  - Unclear procedures?
  - Too much manual work?
  - Approval bottlenecks?
  - Communication gaps?

- [ ] **Information issues:**
  - Incomplete user reports?
  - Missing documentation?
  - Stale runbooks?
  - Hard to find historical context?

### 7.2 Recurring Problems
- [ ] What issues come up repeatedly?
- [ ] What tickets get reopened often?
- [ ] What causes SLA breaches?
- [ ] What creates the most escalations?

### 7.3 Edge Cases & Exceptions
- [ ] What unusual scenarios cause problems?
- [ ] What falls through the cracks?
- [ ] What doesn't fit standard workflows?

---

## 8. Metrics & Success Criteria

### 8.1 Current Metrics
**Story Starter**: *"How do you measure your team's performance..."*

- [ ] **Volume metrics:**
  - Tickets created/closed
  - Backlog size
  - First contact resolution rate
  - Escalation rate

- [ ] **Time metrics:**
  - Average resolution time
  - SLA compliance %
  - Response time
  - Time to escalation

- [ ] **Quality metrics:**
  - Customer satisfaction (CSAT)
  - Ticket reopen rate
  - Knowledge base usage
  - Documentation completeness

### 8.2 Success Indicators
- [ ] What does a "good day" look like?
- [ ] What does a "bad day" look like?
- [ ] What would make your team 50% more effective?

---

## 9. Automation & Tool Augmentation

### 9.1 Current Automation
- [ ] What processes are already automated?
- [ ] What tools provide automation?
- [ ] How well does automation work?
- [ ] What automation has failed in the past?

### 9.2 Automation Opportunities
**Story Starter**: *"If you could automate one thing, what would it be..."*

- [ ] **Top automation wishes:**
  - What's most repetitive?
  - What's most time-consuming?
  - What's most error-prone?
  - What requires the least judgment?

- [ ] **Automation concerns:**
  - What should NOT be automated?
  - What requires human judgment?
  - What safety checks are needed?
  - What approval gates must remain?

### 9.3 AI/Agent Assistance Perspective
- [ ] Where could an AI agent help most?
- [ ] What decisions should remain human?
- [ ] What level of autonomy would you trust? (suggest, draft, execute with approval, fully autonomous)
- [ ] What would make you trust an AI agent's recommendations?

---

## 10. Scenario Deep Dives

### 10.1 Critical Incident Scenario
**Story Starter**: *"Describe the last P1/critical incident from start to finish..."*

- [ ] **What happened?**
- [ ] **Who was involved at each stage?**
- [ ] **What actions were taken and when?**
- [ ] **What systems/tools were used?**
- [ ] **What information was needed?**
- [ ] **What communication occurred?**
- [ ] **What went well?**
- [ ] **What could have been better?**

### 10.2 Smooth Resolution Scenario
**Story Starter**: *"Tell me about a ticket that went perfectly smoothly..."*

- [ ] **What made it smooth?**
- [ ] **What information was available?**
- [ ] **What made it quick/easy?**
- [ ] **Could this be replicated for other tickets?**

### 10.3 Frustrating Ticket Scenario
**Story Starter**: *"Describe a ticket that was unnecessarily difficult..."*

- [ ] **What made it frustrating?**
- [ ] **What information was missing?**
- [ ] **What blockers were encountered?**
- [ ] **How could it have been avoided?**

---

## 11. Future State & Vision

### 11.1 Ideal Workflow
**Story Starter**: *"If you could redesign how support works, what would you change..."*

- [ ] **Process improvements:**
  - What steps could be eliminated?
  - What could be parallelized?
  - What handoffs could be smoother?

- [ ] **Tool improvements:**
  - What information should be easier to find?
  - What actions should be one-click?
  - What should be integrated better?

### 11.2 Agent/Copilot Integration
- [ ] **Agent assistance scenarios:**
  - Where could an agent triage for you?
  - Where could an agent gather diagnostics?
  - Where could an agent suggest solutions?
  - Where could an agent execute runbooks?

- [ ] **Trust & verification:**
  - What would you want to verify before trusting agent actions?
  - What guardrails are needed?
  - How would you audit agent decisions?

---

## 12. Organizational Context

### 12.1 Stakeholder Landscape
- [ ] Who are your primary stakeholders?
- [ ] Who are your internal customers?
- [ ] Who do you report to?
- [ ] Who depends on your team's performance?

### 12.2 Compliance & Governance
- [ ] What compliance requirements affect your work? (SOX, GDPR, HIPAA, etc.)
- [ ] What audit trails are required?
- [ ] What change management processes apply?
- [ ] What security policies constrain your actions?

### 12.3 Business Impact
- [ ] What business processes depend on systems you support?
- [ ] What's the cost of downtime for critical systems?
- [ ] How does your team's performance affect the business?

---

## Notes & Observations

### Key Actors Identified
-
-
-

### Key Work Objects Identified
-
-
-

### Critical Workflows to Diagram
-
-
-

### Pain Points Summary
-
-
-

### Automation Opportunities
-
-
-

### Follow-up Questions
-
-
-

---

## Next Steps

- [ ] Schedule follow-up session if needed
- [ ] Request access to sample tickets (anonymized)
- [ ] Request access to monitoring dashboards
- [ ] Shadow a support engineer for a shift
- [ ] Review actual runbooks and procedures
- [ ] Create domain storytelling diagrams
- [ ] Present findings to product team

---

## Domain Storytelling Output Plan

Based on this interview, create the following deliverables:

1. **Core Activity Diagrams** (using domain storytelling notation):
   - Incident triage & resolution flow
   - Service request fulfillment flow
   - Escalation workflow
   - Morning check routine
   - Knowledge capture process

2. **Actor-Activity Matrix**:
   - Map each actor to their typical activities
   - Identify collaboration points
   - Highlight pain points

3. **Tool & System Landscape**:
   - Visual map of all systems involved
   - Integration points
   - Data flows

4. **Pain Points & Opportunity Map**:
   - Current state bottlenecks
   - Automation opportunities
   - Agent augmentation potential

5. **Autonomy Level Scenarios**:
   - What happens at Level 1 (Assisted)
   - What happens at Level 2 (Supervised)
   - What happens at Level 3 (Semi-Autonomous)
   - What happens at Level 4 (Autonomous)

---

**Interview Tips:**
- Use "tell me about the last time..." to get real examples
- Ask "why" to understand motivations and constraints
- Sketch diagrams together during the conversation
- Record the session (with permission) for later review
- Take photos of any whiteboard sketches
- Follow up on interesting tangents
- Listen for emotion words ("frustrating", "smooth", "painful") and dig deeper

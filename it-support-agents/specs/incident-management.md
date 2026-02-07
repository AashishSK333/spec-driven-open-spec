# Incident Management

Behavioral specification for how incidents are categorized, prioritized, triaged, resolved, and documented. This spec is referenced by the `incident-responder` agent and the `incident-triage` skill.

---

## Categorization

Assign a category based on the affected system type and symptom. Use the CMDB to determine system type and criticality.

### When a server is unreachable

- Categorize as **Infrastructure > Server**
- Check CMDB for affected configuration items and downstream dependencies
- Suggest diagnosis steps from runbook `server-unresponsive.md`
- Identify all affected downstream services and estimate blast radius

### When a server has high resource utilization

- Categorize as **Infrastructure > Server > Performance**
- If CPU > critical threshold: check for runaway processes, recent deployments
- If memory > critical threshold: check for memory leaks, OOM events
- If disk > critical threshold: suggest runbook `disk-space-critical.md`

### When an application returns errors

- Categorize as **Application > [application name]**
- Check application logs for error patterns and stack traces
- Check if a recent deployment occurred (last 24 hours)
- Cross-reference with monitoring for correlated infrastructure issues

### When performance is degraded but service is available

- Categorize as **Performance > [affected area]**
- Measure response time against SLA baselines
- Check for increased load, resource contention, or upstream dependency issues
- Lower priority than full outage — see prioritization rules below

### When a security alert is triggered

- Categorize as **Security > [alert type]**
- Always escalate to security-ops team regardless of severity
- Do not attempt remediation — security team handles all security incidents
- Preserve evidence: do not restart services or clear logs

### When a user reports an issue

- Categorize based on the affected system as described by the user
- Verify the reported symptoms against monitoring data
- If monitoring shows no issue: categorize as **End User > Investigation Needed**
- If monitoring confirms the issue: categorize per the matching system type above

### When the incident type is unknown

- Categorize as **Unclassified**
- Assign Priority 3 as default
- Flag for human review with message: "No matching pattern found — manual categorization required"
- Suggest the three closest matching patterns with confidence scores

---

## Prioritization

Assign priority based on **business impact** (from CMDB criticality tag) and **scope** (number of users/services affected). Reference SLA targets from the active environment config.

### Priority 1 — Critical

**Criteria**: Business-critical service is completely unavailable, OR data loss is occurring, OR security breach is confirmed.

**Actions**:
- Trigger immediate escalation per `config/escalation-matrix.yaml`
- Post to Slack `#major-incidents` channel
- Notify on-call via PagerDuty
- Begin incident response immediately — do not wait for ticket creation
- SLA: 15-minute response, 4-hour resolution

### Priority 2 — High

**Criteria**: Business-critical service is degraded, OR standard service is completely unavailable, OR issue affects a large user group (>50 users).

**Actions**:
- Assign to appropriate team immediately
- Post to Slack `#it-incidents` channel
- SLA: 30-minute response, 8-hour resolution

### Priority 3 — Medium

**Criteria**: Standard service is degraded, OR non-critical issue affecting multiple users (5-50), OR workaround is available for a higher-severity symptom.

**Actions**:
- Queue for next available analyst
- SLA: 2-hour response, 24-hour resolution

### Priority 4 — Low

**Criteria**: Single-user issue with workaround available, cosmetic problem, informational request, or scheduled maintenance notification.

**Actions**:
- Queue for standard processing
- SLA: 8-hour response, 72-hour resolution

---

## Triage Process

When triaging an incident, gather information in this order:

### 1. Immediate context

- What is the symptom? (error message, behavior, impact)
- When did it start? (timestamp, gradual or sudden onset)
- Who or what reported it? (monitoring alert, user, automated check)
- How many users/services are affected?

### 2. System context

- Which system(s) are affected? (hostname, service name, application)
- What is the CMDB criticality of the affected system?
- What are the upstream and downstream dependencies?
- Is there a scheduled maintenance window for any affected system?

### 3. Historical context

- Has this happened before? Search knowledge base and past incidents.
- Was there a recent change? Check change management for last 48 hours.
- Is there a known problem record for this symptom?
- Is there a runbook for this scenario?

### 4. Diagnostic data

- Server health: CPU, memory, disk, network (via `server-health` skill)
- Application logs: errors, warnings, patterns (via `log-analysis` skill)
- Monitoring alerts: active alerts on affected systems

---

## Resolution Documentation

When resolving an incident, document the following in the ticket:

### Required fields

- **Root cause**: What caused the incident (be specific, not "server issue")
- **Steps taken**: Numbered list of diagnostic and remediation actions
- **Resolution**: What fixed it and when the fix was applied
- **Resolution category**: Tag from this list:
  - `config-change` — configuration was corrected
  - `service-restart` — service was restarted
  - `capacity` — resource limits were adjusted
  - `code-fix` — application code was patched
  - `network` — network configuration or hardware was fixed
  - `external` — resolved by external vendor or team
  - `user-error` — issue was caused by user action
  - `monitoring-false-positive` — no actual issue existed
  - `unknown` — root cause could not be determined
- **Recurrence risk**: Low / Medium / High — likelihood of this happening again

### Pattern tracking

- If this incident matches 3+ previous incidents with the same root cause: create a problem record
- If a manual procedure was followed that could be automated: flag for runbook creation
- If the resolution involved a workaround rather than a fix: note the permanent fix needed

---

## Closure Criteria

An incident can be closed when ALL of the following are true:

1. The reported symptom is no longer occurring
2. Service health checks confirm normal operation
3. The root cause has been documented
4. Affected users/stakeholders have been notified of resolution
5. At least 15 minutes have passed since the fix with no recurrence
6. For Priority 1-2: a post-incident review has been scheduled or completed

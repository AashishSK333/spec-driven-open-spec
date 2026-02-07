# Server Unresponsive

Step-by-step procedure for diagnosing and resolving a server that is reported as unresponsive, unreachable, or not performing as expected.

---

## Prerequisites

- Server hostname or IP address
- Alert source: monitoring alert, user report, or morning check finding
- Access to monitoring system (via monitoring MCP)
- Access to CMDB (for dependencies and expected services)

## Expected Duration

- Steps 1-3 (Diagnosis): 10-15 minutes
- Steps 4-5 (Remediation & Verification): 5-15 minutes
- Step 6 (Documentation): 5 minutes

---

## Steps

### 1. Network Connectivity

**Goal**: Determine if the server is reachable on the network.

- Query the monitoring system for the latest ping/availability status for the target host
- Check the last successful contact timestamp

**If the server is reachable** (ping responds):
- Record response time. If response time > 200ms, flag as "degraded connectivity"
- Proceed to Step 2 (Service Status)

**If the server is unreachable** (ping fails after 3+ attempts):
- Verify the host exists in CMDB — if not found, it may be decommissioned
- Check if the host is in a scheduled maintenance window
- If in maintenance: log finding, update ticket, close as "planned maintenance"
- If NOT in maintenance:
  - Check if other servers in the same network segment are also unreachable
  - If multiple servers down: likely a network issue → escalate to **Network team** per `config/escalation-matrix.yaml`
  - If only this server: likely a host-level issue → escalate to **Server team**

### 2. Service Status

**Goal**: Verify all expected services are running.

- Query the monitoring system for service states on the target server
- Retrieve the expected services list from CMDB for this server
- Compare running services against expected services

**If all expected services are running**:
- Proceed to Step 3 (Resource Utilization)

**If a critical service is stopped**:
- Check service logs for the last 30 minutes (use `log-analysis` skill)
- Look for: crash stack traces, OOM killer events, configuration errors
- Check if the service was manually stopped (maintenance, deployment)
- **At Autonomy Level 1-2**: Recommend service restart command to human
- **At Autonomy Level 3+**: Attempt service restart if this is a known safe pattern
  - Rate limit: maximum 2 restart attempts for the same service per hour
  - If restart fails twice: escalate to **Application team**
- After restart: wait 2 minutes, then re-check service status

**If an unexpected service is running**:
- Flag as a potential security concern
- Do not stop the service — report to human for investigation

### 3. Resource Utilization

**Goal**: Check for resource exhaustion or abnormal consumption.

- Query current CPU, memory, and disk usage from monitoring
- Read thresholds from the active environment config

**CPU above critical threshold**:
- Query monitoring for top processes by CPU consumption
- Check for runaway processes, stuck jobs, or infinite loops
- Check if a deployment or batch job started recently
- If a specific process is consuming >80% CPU: report the process name, PID, and duration
- **At Autonomy Level 3+**: If the runaway process matches a known safe-to-kill pattern, terminate it

**Memory above critical threshold**:
- Check for OOM killer events in system logs
- Query monitoring for top processes by memory consumption
- Check if memory usage has been trending up (memory leak indicator)
- If a memory leak is suspected: report the process, recommend application team review

**Disk above critical threshold**:
- Identify which mount point(s) are full
- Check for: large log files, temp file accumulation, database growth, core dumps
- Reference runbook `disk-space-critical.md` for cleanup procedures
- **At Autonomy Level 3+**: Execute safe cleanup actions (clear old logs, temp files)
  - Safety limit: do not delete more than configured `max_auto_cleanup_gb` without human approval

### 4. Application-Layer Checks

**Goal**: If infrastructure checks pass but the issue persists, investigate the application layer.

- Check application health endpoints (HTTP health checks) if available
- Query application logs for errors in the last 30 minutes
- Check database connectivity from the application server
- Check external dependency connectivity (APIs, message queues, caches)
- Check if a deployment occurred in the last 24 hours — if yes, consider rollback

**If application errors are found**:
- Categorize the error (connection failure, timeout, data error, authentication error)
- If the error matches a known pattern in the knowledge base: follow the corresponding procedure
- If no match: compile diagnostic package and escalate to **Application team**

### 5. Resolution Verification

**Goal**: Confirm the fix actually resolved the problem.

- Re-run all health checks (connectivity, services, resources) using the `server-health` skill
- Verify all previously failing checks now pass
- Confirm the original symptom is no longer present

**If resolved**:
- Wait 15 minutes and re-check to confirm no recurrence
- Proceed to Step 6 (Documentation)

**If not resolved**:
- Review what was attempted and why it didn't work
- Escalate to the appropriate team with full diagnostic context
- Include: what was checked, what was found, what was attempted, what failed

### 6. Documentation

**Goal**: Record everything for future reference and pattern tracking.

- Update the incident ticket with:
  - Root cause (specific, not generic)
  - All diagnostic steps taken (numbered, with timestamps)
  - Remediation action and when it was applied
  - Resolution verification results
  - Resolution category tag (from `specs/incident-management.md`)
- If this is the 3rd+ occurrence of this pattern:
  - Flag for problem record creation
  - Suggest a runbook update or new runbook if procedures have evolved
- Notify affected users and stakeholders of resolution

---

## Escalation Triggers

Escalate immediately (do not continue diagnosis) if:

- Server hosts a business-critical service and has been down > 15 minutes
- Multiple servers in the same group are affected (potential infrastructure-wide issue)
- Security-related indicators are found (unauthorized processes, suspicious files)
- The issue is outside your technical scope (network hardware, SAN, hypervisor)

## Related Resources

- `runbooks/disk-space-critical.md` — detailed disk cleanup procedures
- `specs/incident-management.md` — categorization and priority rules
- `config/escalation-matrix.yaml` — team routing for escalations
- `knowledge/troubleshooting/servers.md` — general server troubleshooting knowledge
- `knowledge/troubleshooting/applications.md` — application-layer troubleshooting (for Step 4)

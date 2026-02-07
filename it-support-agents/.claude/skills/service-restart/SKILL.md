---
name: service-restart
description: Safely restart a service on a target host with pre/post checks, dependency awareness, and blast radius controls.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 3
  requires_approval: true
---

Restart a service on a target host following a controlled procedure with mandatory pre/post health checks, dependency analysis, and blast radius assessment. This is a **write operation** that modifies system state.

**Input:** Service name, target host (hostname or IP), reason for restart, and optionally the matching runbook name (e.g., `runbooks/server-unresponsive.md`).

## Steps

### 1. Verify service exists and state

- Query the monitoring system or CMDB for the target service on the specified host
- Confirm: service is a known, managed service
- Record current state: running, stopped, degraded, or unknown
- If service does not exist on the target host: STOP and report as a finding

### 2. Check maintenance windows

- Query the ITSM system or calendar for active maintenance windows on the target host
- If the host is in a scheduled maintenance window: log this and proceed (maintenance context)
- If NOT in maintenance: this is a live restart — proceed with caution

### 3. Assess blast radius

Query CMDB for dependency information:
- **What depends on this service?** (downstream services, user-facing applications)
- **What does this service depend on?** (databases, message queues, APIs)
- **How many users/systems are affected** if this service is briefly unavailable?
- Present blast radius assessment before proceeding

| Impact | Downstream Services | Estimated Users Affected |
|--------|--------------------|-----------------------|
| <High/Medium/Low> | <list> | <count or "unknown"> |

### 4. Pre-restart: Capture current state

Before restarting, record:
- Current resource utilization (CPU, memory, disk) via `server-health` skill
- Last 5 minutes of logs via `log-analysis` skill
- Active connections count (if available)
- Current uptime

### 5. Execute restart

- Send the restart command via the server management MCP
- **At L1-L2**: Present the command for human execution — do NOT execute directly
  - Display: `[YOU EXECUTE] systemctl restart <service> on <host>`
- **At L3+**: Execute the restart command automatically
  - Log: "Service restart initiated by IT Support Agent — reason: <reason>"

### 6. Post-restart: Verify health

After executing the restart:
- Wait 2 minutes for the service to stabilize
- Re-run health checks via `server-health` skill
- Verify:
  - Service is running
  - No new errors in logs (check last 2 minutes via `log-analysis`)
  - Resource utilization is within normal range
  - Dependent services are still healthy

### 7. Handle restart failure

If the service does not come back healthy after restart:
- Capture the error state (logs, status, error messages)
- **Retry once** — maximum 2 restart attempts per service per hour
- If second attempt fails: **STOP** and escalate
  - Do NOT attempt further restarts
  - Compile diagnostic package for escalation

## Output

```
## Service Restart: <service> on <host>

### Pre-Restart State
| Metric        | Value   |
|---------------|---------|
| Status        | <state> |
| Uptime        | <time>  |
| CPU           | <value> |
| Memory        | <value> |
| Connections   | <count> |

### Blast Radius
- Downstream: <services>
- Estimated impact: <assessment>

### Restart Result
- **Action**: <executed / presented for human execution>
- **Result**: <SUCCESS / FAILED>
- **Duration**: <time from restart to healthy>

### Post-Restart State
| Metric        | Value   |
|---------------|---------|
| Status        | <state> |
| Uptime        | <time>  |
| CPU           | <value> |
| Memory        | <value> |
| New Errors    | <count> |

### Follow-up
- <monitoring recommendation — e.g., "Monitor for 30 minutes for stability">
```

## Guardrails

- **NEVER restart without checking maintenance windows and dependencies** — Steps 2 and 3 are mandatory
- **Maximum 2 restart attempts** per service per hour — prevent restart loops
- **NEVER restart database services** (PostgreSQL, MySQL, Oracle, MongoDB) without DBA approval — even at L3+
- **NEVER restart at L1-L2** without explicit human approval — present the command for human execution
- **Always log the restart action** in the incident ticket via `ticket-management` skill
- **Always capture pre/post state** — this is the evidence trail for post-incident review
- If blast radius is HIGH (>3 downstream services or >100 affected users): require human approval even at L3
- If the service is part of a cluster: consider restarting only the affected node, not the entire cluster

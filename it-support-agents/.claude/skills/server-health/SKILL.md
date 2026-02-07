---
name: server-health
description: Check health status of servers and services via monitoring APIs — connectivity, services, and resource utilization.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 1
  requires_approval: false
---

Check server and service health status by querying the monitoring system and comparing results against configured thresholds.

**Input:** Server hostname, IP address, or service name. Optionally specify check type: `connectivity`, `services`, `resources`, or `all` (default).

## Steps

### 1. Resolve target

- If hostname or IP provided: look up in CMDB for full details (OS, role, owning team, criticality)
- If service name provided: find all hosting servers from CMDB
- Validate target exists and is a managed asset
- If target not found in CMDB: report this as a finding (unmanaged asset)

### 2. Check connectivity

- Query the monitoring system for the latest ping/availability status
- Note the last check timestamp — if data is older than 15 minutes, flag as potentially stale
- Record: reachable (yes/no), response time (ms), packet loss (%)

### 3. Check service status

- Query the monitoring system for the status of all services running on the server
- Compare the running services against the expected services list from CMDB
- Flag any expected service that is not running
- Flag any unexpected service that is running (potential security concern)

### 4. Check resource utilization

- Query current values for: CPU usage, memory usage, disk usage (per mount point)
- Read thresholds from active environment config (`config/environments/<env>.yaml`):
  - CPU: warning at `cpu_warning_percent`, critical at `cpu_critical_percent`
  - Memory: warning at `memory_warning_percent`, critical at `memory_critical_percent`
  - Disk: warning at `disk_warning_percent`, critical at `disk_critical_percent`
- Compare current values against thresholds

### 5. Compile results

Produce a structured health report with an overall assessment:
- **HEALTHY**: All checks pass, all values within normal range
- **WARNING**: One or more values exceed warning threshold but below critical
- **CRITICAL**: One or more values exceed critical threshold, or a service is down
- **UNREACHABLE**: Server cannot be contacted

## Output

```
## Server Health: <hostname>

**CMDB**: <role> | <criticality> | <owning-team>
**Last Check**: <timestamp>

| Check        | Status   | Value    | Threshold  |
|-------------|----------|----------|------------|
| Ping         | OK       | 12ms     | <100ms     |
| CPU          | WARNING  | 85%      | <80%       |
| Memory       | OK       | 62%      | <90%       |
| Disk /       | OK       | 45%      | <85%       |
| Disk /var    | CRITICAL | 95%      | <85%       |
| nginx        | RUNNING  | —        | —          |
| postgresql   | RUNNING  | —        | —          |

**Overall: CRITICAL** — Disk /var at 95% exceeds critical threshold (90%)

### Trend (24h)
- CPU: stable (avg 78%)
- Disk /var: increasing (+5% in last 24h)
```

## Guardrails

- This skill is **read-only** — it never modifies server state, restarts services, or clears disk space
- Always show the data source (which monitoring system) and timestamp
- If monitoring data is stale (> 15 minutes old), flag it: "Data may be stale — last updated <timestamp>"
- If the monitoring system is unreachable, report this as a finding rather than failing silently
- Never execute commands directly on the server — all data comes from the monitoring API
- If trend data is available, include it (helps distinguish spikes from steady growth)

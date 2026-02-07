# Database Connection Failure

Step-by-step procedure for diagnosing and resolving database connection failures, from initial assessment through resolution and root cause identification.

## Prerequisites

- Database hostname or instance name
- Application or service experiencing the connection failure
- Error message (e.g., "connection refused", "too many connections", "authentication failed")
- Alert source (monitoring, application logs, user report)

## Expected Duration

- **Diagnosis**: 10–20 minutes
- **Remediation (known issue)**: 5–15 minutes
- **Remediation (complex)**: 30–60 minutes (may require DBA)
- **Verification**: 5–10 minutes

---

## Steps

### 1. Assess Connection Status

Check the basic connectivity to the database:
- Is the database server reachable? (ping, port check on database port)
- Is the database service running? (via monitoring or `server-health` skill)
- What is the current connection count vs. maximum allowed?
- What is the error message from the failing application?

**Error classification**:
- **"Connection refused"**: Database service may be down, port blocked, or host unreachable
- **"Too many connections"**: Connection pool exhausted
- **"Authentication failed"**: Credential issue, expired password, permission change
- **"Connection timed out"**: Network issue, database overloaded, or firewall change
- **"Read-only"**: Database may be in recovery mode or replication failover

**Autonomy Gate**:
| Level | Action |
|-------|--------|
| L1 | Present assessment findings; recommend next diagnostic steps |
| L2 | Present assessment; auto-categorize the issue type |
| L3 | Present assessment; begin remediation for known patterns |
| L4 | Assess and remediate known patterns; only escalate for novel issues |

### 2. Check Database Server Health

Use the `server-health` skill on the database server:
- **CPU**: High CPU on DB server can cause connection timeouts
- **Memory**: Memory exhaustion can cause OOM kills of DB processes
- **Disk**: Full disk prevents DB from writing (transaction logs, temp files)
- **Disk I/O**: High I/O wait indicates storage performance issues

If the database server is unhealthy:
- If disk is full → reference `runbooks/disk-space-critical.md`
- If service is down → proceed to Step 3
- If resources are constrained → note as a contributing factor

### 3. Check Database Service Status

Verify the database service specifically:
- Is the database process running?
- Check database logs for recent errors (via `log-analysis` skill):
  - Crash or restart events
  - Corruption warnings
  - Replication errors
  - Configuration errors
- Check if the database was recently restarted (uptime)

**If database service is down**:
- Check logs for the reason it stopped
- **NEVER restart a database without DBA awareness** — even at L3+
- Contact DBA team with findings
- If it's a known restart scenario (e.g., after patching): verify this is expected

### 4. Check Connection Pool

If the error is "too many connections":
- Query current active connections (if monitoring provides this)
- Identify which applications are consuming the most connections
- Check for connection leaks:
  - Connections in "idle" state for extended periods
  - Same application holding many connections without releasing
- Check connection pool settings:
  - Maximum pool size vs. current usage
  - Connection timeout settings
  - Idle connection reclaim settings

**Remediation for connection pool exhaustion**:
- **L1**: Present the findings; recommend the application team adjust pool settings or restart the leaking application
- **L2**: Present findings; draft notification to application team
- **L3+**: Present findings; notify application team; if a specific application is leaking connections, recommend restarting it (but do NOT restart without approval since it affects the database)

### 5. Check Authentication

If the error is "authentication failed":
- Verify the application's database credentials are correct
- Check if credentials were recently rotated
- Check if the database user account is locked
- Check if permissions were changed (GRANT/REVOKE)
- **NEVER display or log actual database credentials**

**Remediation**:
- Credential rotation issue: coordinate with the team that rotated credentials
- Account locked: escalate to DBA to unlock (if appropriate)
- Permission change: escalate to DBA to review and correct

### 6. Check Replication Status

For replicated databases:
- Is the replica in sync with the primary?
- What is the replication lag?
- Has a failover occurred recently?
- Is the application connecting to the correct endpoint (primary vs. replica)?

**If replication is broken**:
- Do NOT attempt to fix replication without DBA involvement
- Document the current state: lag time, last applied transaction, error messages
- Escalate to DBA immediately

### 7. Resolution Verification

After remediation:
- Verify the application can connect to the database
- Check that the original error is no longer occurring (via `log-analysis`)
- Monitor for 10 minutes to confirm stability
- Verify that all dependent services are functioning
- If connecting through a connection pool: verify pool is healthy (active connections normal, no queued requests)

### 8. Documentation

Update the incident ticket with:
- Root cause identified
- Steps taken to diagnose
- Remediation applied
- Verification results
- **If this is a recurring issue**: flag for root cause analysis and long-term fix

## Escalation Triggers

- Database service is down and reason is unknown → immediate escalation to DBA team
- Data corruption detected → immediate escalation to DBA + IT Manager
- Replication broken → escalate to DBA team
- Authentication issues on multiple databases → escalate to Security Operations (possible credential compromise)
- Connection pool exhaustion across multiple applications → escalate to Application Architecture team

## Related Resources

- `knowledge/troubleshooting/databases.md` — general database troubleshooting
- `knowledge/troubleshooting/servers.md` — server-level health checks
- `runbooks/disk-space-critical.md` — if disk space is the cause
- `specs/incident-management.md` — for incident categorization
- `config/escalation-matrix.yaml` — routing for database escalations

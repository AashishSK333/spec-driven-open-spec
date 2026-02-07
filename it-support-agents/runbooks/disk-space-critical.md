# Disk Space Critical

Step-by-step procedure for diagnosing and resolving critical disk space usage on a server.

---

## Prerequisites

- Server hostname or IP address with disk space alert
- Mount point(s) exceeding the critical threshold
- Access to monitoring system (via monitoring MCP)

## Expected Duration

- Steps 1-2 (Assessment): 5-10 minutes
- Step 3 (Cleanup): 5-30 minutes depending on approach
- Step 4 (Verification): 5 minutes

---

## Steps

### 1. Assess Current State

- Query monitoring for current disk usage per mount point
- Identify which mount point(s) exceed the critical threshold (default: 90%)
- Determine the rate of growth — is it sudden or gradual?
- Check CMDB for the server role and what data is expected on each mount

### 2. Identify Space Consumers

- Check monitoring for top directories by size on the affected mount
- Common culprits to investigate:
  - **Log files**: `/var/log/` — look for large or rapidly growing log files
  - **Temp files**: `/tmp/`, `/var/tmp/` — stale temporary files
  - **Core dumps**: `/var/crash/`, `/var/core/` — application crash dumps
  - **Application data**: database files, cache directories
  - **Old deployments**: previous application versions not cleaned up
  - **Backups**: local backup files that should be on remote storage

### 3. Cleanup Actions

Perform cleanup in order of safety (safest first):

**Safe to auto-clean (at Autonomy Level 3+)**:
- Old log files (rotated logs older than 7 days): `*.gz`, `*.old`, `*.1`
- Temp files older than 24 hours
- Package manager cache (`apt`, `yum` cache)
- Safety limit: do not delete more than configured `max_auto_cleanup_gb` without human approval

**Requires human approval**:
- Active log files (may need log rotation config fix)
- Application cache or data directories
- Core dumps (may be needed for debugging)
- Database files (coordinate with DBA team)
- Files owned by other teams

**Never auto-clean**:
- Application binaries or configuration files
- Database data files without DBA approval
- Files in home directories
- Anything in `/etc/`, `/usr/`, `/bin/`, `/sbin/`

### 4. Verify and Monitor

- Re-check disk usage after cleanup
- Confirm usage dropped below the warning threshold
- If still critical after safe cleanup: escalate to **Server team** or **Application team**
- Set monitoring to alert if usage crosses warning threshold again within 24 hours

### 5. Root Cause and Prevention

- Determine why disk filled up:
  - Missing log rotation? → fix logrotate config
  - Application generating excessive logs? → escalate to Application team
  - Data growth exceeding capacity? → plan storage expansion
  - One-time event (large deployment, bulk import)? → document and close
- Update the incident ticket with findings and preventive recommendation

---

## Escalation Triggers

- Disk at 98%+ and no safe cleanup options available: escalate immediately
- Database files consuming space: escalate to **DBA team**
- Root filesystem (`/`) critical: escalate to **Server team** — high risk of system failure
- Cleanup did not reduce usage below critical: escalate to **Server team**

## Related Resources

- `runbooks/server-unresponsive.md` — server may become unresponsive if disk fills to 100%
- `specs/incident-management.md` — categorization and priority rules
- `config/escalation-matrix.yaml` — team routing

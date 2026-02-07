# Database Troubleshooting Guide

General troubleshooting methodology and common scenarios for database-related issues.

---

## General Approach

When troubleshooting a database issue, follow this systematic approach:

1. **Identify the database**: Which database instance? (hostname, port, database name)
2. **Classify the symptom**: Connection failure, slow queries, data inconsistency, replication lag?
3. **Check the server**: Is the database server healthy? (CPU, memory, disk, I/O)
4. **Check the service**: Is the database process running? Any recent restarts?
5. **Check the logs**: What do the database error logs show?
6. **Check connections**: Is the connection pool healthy? Are connections being exhausted?
7. **Escalate to DBA**: For anything beyond basic diagnostics — DBAs own database remediation

**Important**: Always escalate database remediation to the DBA team. IT support diagnoses and gathers information; DBAs execute fixes.

---

## Common Scenarios

### Connection Pool Exhaustion

**Symptoms**: "Too many connections" errors, applications unable to connect, new connections queued.

**Investigation**:
- Check current active connections vs. maximum allowed
- Identify which applications are consuming the most connections
- Look for idle connections that should have been released
- Check connection pool settings in the application configuration

**Common causes**:
- Application connection leak (connections opened but never closed)
- Application crash leaving orphaned connections
- Sudden traffic spike exceeding pool capacity
- Connection pool misconfiguration (max pool size too low, or timeout too long)

**Immediate mitigation**: Application teams can restart the leaking application to release connections. Coordinate with DBA if manual connection termination is needed.

### Slow Query Performance

**Symptoms**: Application response times increased, specific operations timing out.

**Investigation**:
- Check monitoring for slow query logs
- Identify the specific queries that are slow
- Check if query execution plans have changed (missing indexes, table statistics stale)
- Check for lock contention (blocking queries)
- Check database server I/O — high I/O wait indicates storage bottleneck

**Common causes**:
- Missing or dropped index
- Table statistics out of date (causing bad query plans)
- Lock contention from long-running transactions
- Table growth without corresponding index optimization
- Storage performance degradation

**Escalation**: Always escalate query performance issues to DBA — they can analyze execution plans and optimize.

### Replication Lag

**Symptoms**: Read replicas serving stale data, replication monitoring alerts.

**Investigation**:
- What is the current replication lag? (seconds, minutes, hours)
- Is lag increasing (getting worse) or stable?
- Check the primary database: high write volume? Long-running transactions?
- Check the replica: CPU, I/O, disk space constraints?
- Check network between primary and replica

**Common causes**:
- High write volume on primary overwhelming the replica
- Replica resource constraints (CPU, I/O)
- Network issues between primary and replica
- Large DDL operation (schema change) blocking replication
- Replication configuration issue

**Escalation**: Always escalate replication issues to DBA immediately — data consistency is at risk.

### Backup Failures

**Symptoms**: Backup monitoring alerts, missing backup files.

**Investigation**:
- Check backup job logs for errors
- Check disk space on backup destination
- Check network connectivity to backup storage
- Verify backup schedule hasn't changed
- Check if the database was accessible during the backup window

**Common causes**:
- Backup destination disk full
- Network connectivity to backup storage failed
- Backup job conflicting with maintenance window
- Database lock preventing consistent backup
- Backup tool configuration change

---

## Useful Diagnostic Information to Gather

When escalating database issues, always include:

- Database type and version (PostgreSQL, MySQL, Oracle, SQL Server, MongoDB)
- Instance hostname and port
- Specific error messages from application and database logs
- Current connection count and pool status
- Server health metrics (CPU, memory, disk, I/O)
- Recent changes (deployments, schema changes, configuration updates)
- Timeline of when the issue started
- Which applications are affected

---

## Related Resources

- `runbooks/database-connection-failure.md` — detailed procedure for connection failures
- `knowledge/troubleshooting/servers.md` — server-level health checks
- `knowledge/architecture/service-dependencies.md` — service dependency maps
- `config/escalation-matrix.yaml` — DBA team routing

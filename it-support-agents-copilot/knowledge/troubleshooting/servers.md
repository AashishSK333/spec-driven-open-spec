# Server Troubleshooting Guide

General troubleshooting methodology and common scenarios for server-related issues.

---

## General Approach

When troubleshooting a server issue, follow this systematic approach:

1. **Define the problem**: What exactly is the symptom? When did it start?
2. **Check monitoring**: What do the metrics show? Is the issue visible in monitoring?
3. **Check for changes**: Was anything deployed, updated, or modified recently?
4. **Check dependencies**: Are upstream/downstream services healthy?
5. **Check logs**: What do system and application logs show?
6. **Isolate the cause**: Narrow down to the specific component or layer
7. **Apply fix and verify**: Fix the issue and confirm it's resolved

---

## Common Scenarios

### High CPU Usage

**Symptoms**: Slow response times, monitoring alerts for CPU > threshold.

**Investigation**:
- Check monitoring for top processes by CPU
- Look for: runaway processes, stuck jobs, infinite loops, excessive logging
- Check if a deployment or batch job started recently
- Check if CPU usage correlates with traffic patterns (expected load vs. anomaly)

**Common causes**:
- Application bug causing infinite loop or excessive computation
- Batch job running longer than expected
- Insufficient capacity for current traffic level
- Runaway log rotation or compression process

### High Memory Usage

**Symptoms**: OOM killer events, swap usage increasing, slow performance.

**Investigation**:
- Check monitoring for top processes by memory
- Look for memory trends — steady increase suggests a leak
- Check for OOM killer events in system logs
- Verify expected memory usage for the application

**Common causes**:
- Memory leak in application code
- Cache growing without bounds
- Too many concurrent connections/sessions
- JVM heap misconfiguration (Java applications)

### Disk Space Issues

**Symptoms**: Disk usage alerts, write failures, application errors.

**Investigation**:
- Identify which mount point is full
- Find the largest directories/files consuming space
- Check log rotation configuration
- See `runbooks/disk-space-critical.md` for detailed procedure

### Service Not Starting

**Symptoms**: Service shows as "stopped" or "failed" in monitoring.

**Investigation**:
- Check service logs for startup errors
- Check for port conflicts (another process using the port)
- Verify configuration files are valid (syntax errors)
- Check file permissions on binaries and config files
- Check if dependent services (database, message queue) are running

### Network Connectivity Issues

**Symptoms**: Server unreachable, intermittent connectivity, high latency.

**Investigation**:
- Check if the issue is server-specific or network-segment-wide
- Verify DNS resolution is working
- Check for network interface errors or drops
- Verify firewall rules haven't changed
- Check if the server's network interface is up
- See `knowledge/troubleshooting/network.md` for network-specific guidance

---

## Useful Diagnostic Information to Gather

When escalating or documenting, always include:

- Server hostname, IP, and role (from CMDB)
- Current health metrics (CPU, memory, disk, network)
- Recent changes (deployments, config changes, patches)
- Relevant log excerpts (errors, warnings from the last 30-60 minutes)
- Timeline of when the issue started and any pattern to the symptoms
- What has already been tried and the result

---

## Related Resources

- `runbooks/server-unresponsive.md` — specific procedure for unresponsive servers
- `runbooks/disk-space-critical.md` — specific procedure for disk space issues
- `knowledge/architecture/service-dependencies.md` — service dependency maps
- `specs/incident-management.md` — categorization and priority assignment

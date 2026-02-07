# Application Troubleshooting Guide

General troubleshooting methodology and common scenarios for application-related issues.

---

## General Approach

When troubleshooting an application issue, follow this systematic approach:

1. **Identify the application**: Which application, which environment, which component?
2. **Classify the symptom**: Error pages, slow response, incorrect behavior, intermittent failures?
3. **Check the infrastructure**: Is the underlying server healthy? (via `server-health` skill)
4. **Check the application logs**: What errors are being logged? (via `log-analysis` skill)
5. **Check dependencies**: Are databases, APIs, and external services accessible?
6. **Check for changes**: Was anything deployed or configured recently?
7. **Reproduce and isolate**: Can the issue be reproduced? Is it specific to certain inputs/users?

---

## Common Scenarios

### Application Errors (5xx)

**Symptoms**: Users seeing error pages, monitoring showing elevated error rates, 500/502/503 responses.

**Investigation**:
- Check application logs for stack traces and error messages
- Identify error pattern: all requests failing vs. specific endpoints
- Check application server health (CPU, memory, thread pools)
- Check downstream dependencies (database, external APIs)

**Common causes by error type**:
- **500 Internal Server Error**: Application bug, unhandled exception, configuration error
- **502 Bad Gateway**: Application process crashed, upstream service unreachable
- **503 Service Unavailable**: Application overloaded, in maintenance mode, or starting up
- **504 Gateway Timeout**: Downstream service or database call taking too long

### Performance Degradation

**Symptoms**: Slow response times, high latency, users reporting the application is "slow."

**Investigation**:
- Check response time metrics in monitoring — when did degradation start?
- Check application resource usage (CPU, memory, threads, connections)
- Check database query times — has query performance degraded?
- Check external API response times — is a dependency slow?
- Check for traffic changes — is volume higher than usual?
- Check for recent deployments or configuration changes

**Common causes**:
- Database query performance degradation (missing index, lock contention)
- External API latency increase
- Memory leak causing garbage collection pauses
- Thread pool exhaustion
- Increased traffic without scaling

### Deployment Issues

**Symptoms**: Application errors immediately after a deployment.

**Investigation**:
- What was deployed? (version, changes, configuration)
- Did the deployment complete successfully?
- Are all instances running the new version? (partial rollout issues)
- Check logs for startup errors or new error patterns
- Compare error rates before and after deployment

**Common causes**:
- Code bug in the new release
- Configuration mismatch (new code expecting config that wasn't updated)
- Database schema mismatch (migration not run or partially run)
- Missing environment variables or secrets
- Incompatible dependency version

**Immediate mitigation**: If the deployment clearly caused the issue, recommend rollback to the previous version.

### Intermittent Failures

**Symptoms**: Issues that come and go, not consistently reproducible.

**Investigation**:
- Look for patterns: specific times of day, specific users, specific request types
- Check for resource contention (CPU spikes, memory pressure, connection pool limits)
- Check for timeout-related errors (network timeouts, database timeouts)
- Check for race conditions or concurrency issues in logs
- Check load balancer distribution — is one instance unhealthy?

**Common causes**:
- Resource exhaustion under load (connections, threads, memory)
- Network intermittency (packet loss, DNS resolution delays)
- Load balancer sending traffic to an unhealthy instance
- Timeout misconfiguration (too aggressive for peak load)
- Caching inconsistency

---

## Useful Diagnostic Information to Gather

When escalating application issues, always include:

- Application name, environment, and version
- Specific error messages and stack traces
- Affected URL/endpoint/feature
- Timeline of when the issue started
- Recent deployments or changes
- Server health metrics for the application host
- Response time metrics and error rate trends
- Downstream dependency health (database, APIs)

---

## Related Resources

- `knowledge/troubleshooting/servers.md` — server-level health checks
- `knowledge/troubleshooting/databases.md` — if database is the root cause
- `runbooks/server-unresponsive.md` — if the application server is unresponsive
- `specs/incident-management.md` — categorization for application incidents

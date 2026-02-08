# Network Troubleshooting Guide

General troubleshooting methodology and common scenarios for network-related issues.

---

## General Approach

When troubleshooting a network issue, follow this systematic approach:

1. **Define the scope**: Is it one user, one server, one subnet, or network-wide?
2. **Check monitoring**: Are there active network alerts? Link status changes? Bandwidth anomalies?
3. **Check for changes**: Were firewall rules, routes, or DNS records modified recently?
4. **Test connectivity**: Ping, traceroute, DNS lookup — isolate where the failure occurs
5. **Check the path**: Work from the client toward the server (or vice versa) to find the break point
6. **Verify resolution**: After fixing, confirm connectivity from the original failure point

---

## Common Scenarios

### DNS Resolution Failure

**Symptoms**: "Name not found" errors, applications failing to connect by hostname (but IP works).

**Investigation**:
- Is the DNS server reachable?
- Can the server resolve known-good hostnames?
- Check if the specific DNS record exists and is correct
- Check for DNS propagation delays after recent changes
- Verify `/etc/resolv.conf` (Linux) or DNS settings (Windows) on the affected system

**Common causes**:
- DNS server down or unreachable
- Missing or incorrect DNS record
- DNS cache poisoning or stale cache
- Split-horizon DNS misconfiguration
- DHCP lease renewal changed DNS settings

### Routing Issues

**Symptoms**: Intermittent connectivity, asymmetric routing, traffic going to wrong destination.

**Investigation**:
- Check the routing table on the affected server
- Trace the network path to the destination (traceroute)
- Compare with the expected path (from network documentation)
- Check for recent routing changes in network devices

**Common causes**:
- Missing or incorrect static route
- Default gateway unreachable
- Routing protocol convergence after a topology change
- VPN split-tunnel routing conflict

### Firewall Blocking

**Symptoms**: "Connection refused" or timeout on specific ports, new application cannot connect.

**Investigation**:
- Identify the exact port and protocol being blocked
- Check host-based firewall rules (iptables, Windows Firewall)
- Check network firewall rules (if access is available)
- Verify if a recent change request modified firewall rules

**Common causes**:
- New application deployed without corresponding firewall rule request
- Firewall rule expired (time-limited rules)
- Rule accidentally removed or modified during maintenance
- Security policy change blocking previously allowed traffic

### General Connectivity Issues

**Symptoms**: Server unreachable, high latency, packet loss.

**Investigation**:
- Ping the target from multiple source locations to isolate the failure point
- Check for network interface errors (CRC errors, collisions, drops)
- Check physical cable connections and link status (if applicable)
- Check network device CPU and memory (overloaded switches/routers)
- Check for bandwidth saturation on the network link

**Common causes**:
- Physical cable failure or loose connection
- Network interface failure
- Switch port failure or misconfiguration
- Bandwidth exhaustion (DDoS, backup job, large data transfer)
- VLAN misconfiguration

### VPN Issues

**Symptoms**: VPN connection failing, slow VPN performance, intermittent disconnects.

**Investigation**:
- See `runbooks/vpn-connectivity.md` for detailed procedure
- Check VPN service status
- Check authentication server
- Verify client configuration

---

## Useful Diagnostic Information to Gather

When escalating network issues, always include:

- Source and destination (IP addresses, hostnames, ports)
- Error messages (exact text)
- Scope (single user, subnet, site-wide)
- Connectivity test results (ping, traceroute, port check)
- Recent changes (firewall rules, routing changes, DNS updates)
- Timeline (when it started, intermittent or constant)
- Network path diagram if applicable (from `knowledge/architecture/network-topology.md`)

---

## Related Resources

- `runbooks/vpn-connectivity.md` — VPN-specific troubleshooting procedure
- `runbooks/certificate-expiry.md` — if SSL/TLS issues are causing connectivity problems
- `knowledge/architecture/network-topology.md` — network topology overview
- `specs/escalation-policy.md` — routing rules for network team escalations
- `config/escalation-matrix.yaml` — network operations team routing

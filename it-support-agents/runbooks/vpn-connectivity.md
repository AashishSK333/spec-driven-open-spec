# VPN Connectivity

Step-by-step procedure for diagnosing and resolving VPN connectivity issues, covering service-side and client-side problems.

## Prerequisites

- VPN service type (SSL VPN, IPsec, WireGuard, OpenVPN)
- Whether the issue affects a single user, a group, or all users
- User's reported symptoms (cannot connect, slow, disconnects, partial access)
- VPN server hostname or gateway address

## Expected Duration

- **Single-user issue**: 10–15 minutes
- **Group/service issue**: 15–30 minutes
- **VPN service outage**: 30–60 minutes (likely requires Network team)
- **Verification**: 5 minutes

---

## Steps

### 1. Determine Scope

Establish the scope of the VPN issue:
- **Single user affected**: Likely a client-side or account issue → proceed to client-side checks
- **Multiple users affected**: Likely a service-side issue → proceed to service-side checks
- **All users affected**: VPN service outage → proceed immediately to service-side checks with P1/P2 urgency

Check monitoring for:
- VPN server status (up/down)
- Active VPN session count (is it within normal range?)
- Recent alerts related to VPN infrastructure

**Autonomy Gate**:
| Level | Action |
|-------|--------|
| L1 | Present scope assessment; recommend diagnostic path |
| L2 | Present assessment; auto-categorize scope |
| L3 | Present assessment; begin diagnostics automatically |
| L4 | Assess, diagnose, and remediate known patterns |

### 2. Service-Side Checks

If the issue affects multiple users or the VPN service itself:

**2a. VPN Server Health**
- Use `server-health` skill on the VPN server(s)
- Check: CPU, memory, disk, process status
- Check if VPN service process is running
- Check current session count vs. maximum licensed/configured sessions

**2b. Authentication Server**
- Is the authentication backend reachable? (LDAP, RADIUS, AD)
- Check authentication server logs for errors (via `log-analysis`)
- Are authentication timeouts occurring?
- Has the authentication configuration changed recently?

**2c. Network Infrastructure**
- Is the VPN gateway's internet-facing interface reachable?
- Check firewall rules: have any rules changed that could block VPN traffic?
- Check for ISP issues or network path changes
- Verify DNS resolution for VPN hostname

**2d. Certificate/License**
- Check VPN server certificate: is it expired or near expiry?
  - If expired → reference `runbooks/certificate-expiry.md`
- Check VPN license: is the concurrent session limit reached?
- Check for certificate revocation list (CRL) issues

**Escalation**: If any service-side component is down or misconfigured, escalate to Network Operations team with findings.

### 3. Client-Side Checks

If the issue affects a single user:

**3a. Client Software**
- Which VPN client is the user running? (version, OS)
- Is the client software up to date?
- Has the client configuration changed (profile, server address)?
- Can the user connect to other VPN profiles (if available)?

**3b. User Account**
- Is the user's account active in the authentication system?
- Is the user's VPN access enabled? (group membership, policy)
- Has the user's password expired?
- Is multi-factor authentication (MFA) configured and working?
- Has the user been recently on/offboarded?

**3c. Network Environment**
- Is the user on a network that blocks VPN traffic? (corporate guest WiFi, hotel, country-level blocks)
- Is there a local firewall blocking VPN ports?
- Can the user reach the VPN gateway address? (ping, traceroute)
- Is the user behind a restrictive proxy?

**3d. Split Tunnel vs. Full Tunnel**
- Is the VPN configured for split tunnel or full tunnel?
- If split tunnel: can the user access VPN-only resources?
- If full tunnel: is general internet access working through the tunnel?
- Are DNS settings correct for the tunnel type?

**Autonomy Gate**:
| Level | Action |
|-------|--------|
| L1 | Present diagnostic checklist; human works through it with the user |
| L2 | Present checklist; draft troubleshooting guide for the user |
| L3 | Present checklist; auto-check service-side items; compile findings |
| L4 | Full automated diagnosis; present only the findings and recommendations |

### 4. Common Resolutions

Based on the diagnosis, apply the appropriate resolution:

**VPN service not running**:
- Check logs for why it stopped
- Escalate to Network team for restart (do NOT restart VPN service without Network team approval)

**Authentication failure (single user)**:
- Verify account status
- Reset password if expired (coordinate with user)
- Check MFA enrollment
- Verify group membership for VPN access

**Connection limit reached**:
- Check for stale sessions (users who disconnected without proper logoff)
- If stale sessions exist and within policy: present for cleanup
- If legitimately at capacity: escalate for capacity planning

**Certificate expired**:
- Follow `runbooks/certificate-expiry.md`
- This is a service-affecting issue if the server certificate is expired

**Client configuration issue**:
- Guide user to reimport VPN profile
- Verify server address, authentication method, and certificate settings

**Network blocking VPN**:
- If on restricted network: recommend alternative network or TCP-based VPN fallback
- If firewall change: escalate to Network team to review and revert if necessary

### 5. Resolution Verification

After remediation:
- Confirm the user (or affected users) can establish a VPN connection
- Verify access to internal resources through the VPN
- Check VPN session stability (no disconnects within 5 minutes)
- Verify DNS resolution through the VPN tunnel
- If service-side issue: monitor for 15 minutes for stability

### 6. Documentation

Update the incident ticket with:
- Scope (single user / group / all users)
- Root cause identified
- Steps taken to diagnose
- Resolution applied
- Verification results
- If recurring: flag for root cause analysis

## Escalation Triggers

- VPN service is completely down → escalate to Network Operations (P1 if affecting all users)
- Authentication server issues affecting VPN → escalate to Identity/Security team
- Suspected network infrastructure issue (firewall, routing) → escalate to Network Operations
- License capacity reached → escalate to IT Manager for procurement
- Security concern (unauthorized access attempts, certificate compromise) → escalate to Security Operations

## Related Resources

- `knowledge/troubleshooting/network.md` — general network troubleshooting
- `runbooks/certificate-expiry.md` — if VPN certificate is expired
- `specs/escalation-policy.md` — escalation routing rules
- `config/escalation-matrix.yaml` — network team routing

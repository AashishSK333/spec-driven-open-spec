# Certificate Expiry

Step-by-step procedure for handling SSL/TLS certificate expiry alerts, from detection through renewal and verification.

## Prerequisites

- Certificate hostname or domain name
- Alert source (monitoring system, morning check, or manual check)
- Access to certificate management system or PKI team contact

## Expected Duration

- **Assessment**: 5–10 minutes
- **Renewal (standard)**: 30–60 minutes (including approval)
- **Emergency renewal**: 15–30 minutes (expedited process)
- **Verification**: 5–10 minutes

---

## Steps

### 1. Assess Certificate Status

Check the current certificate details:
- Domain name and subject alternative names (SANs)
- Current expiry date and days remaining
- Certificate issuer (internal CA, Let's Encrypt, commercial CA)
- Which services use this certificate (from CMDB)

**Classification**:
- **> 30 days**: Informational — schedule renewal during next maintenance window
- **14–30 days**: Warning — initiate renewal process within 1 week
- **7–14 days**: Urgent — initiate renewal process immediately
- **< 7 days**: Critical — emergency renewal procedure
- **Expired**: Critical — emergency renewal + incident creation

**Autonomy Gate**:
| Level | Action |
|-------|--------|
| L1 | Present assessment; recommend action timeline |
| L2 | Present assessment; create tracking ticket automatically |
| L3 | Present assessment; create ticket; initiate renewal request |
| L4 | All of L3; auto-renew if using automated CA (e.g., Let's Encrypt) |

### 2. Identify Renewal Path

Determine the certificate type and renewal method:

**Automated CA (Let's Encrypt, ACME)**:
- Check if auto-renewal is configured and functioning
- If auto-renewal failed: check logs for the failure reason (DNS challenge, HTTP challenge, permissions)
- If auto-renewal is working: this finding is informational — verify renewal will occur before expiry

**Internal CA (corporate PKI)**:
- Generate a certificate signing request (CSR) or reference existing CSR
- Submit renewal request to the PKI team
- Track the request in the incident ticket

**Commercial CA (DigiCert, Sectigo, etc.)**:
- Log into the CA portal (human must perform this step)
- Initiate renewal or reissue
- Complete domain validation if required

**Autonomy Gate**:
| Level | Action |
|-------|--------|
| L1 | Present the renewal path; human executes all steps |
| L2 | Present renewal path; draft communication to PKI team |
| L3 | Present renewal path; send renewal request to PKI team automatically |
| L4 | Same as L3; for automated CAs, trigger renewal command |

### 3. Coordinate Certificate Installation

After the new certificate is issued:

**Standard renewal (> 7 days remaining)**:
- Schedule installation during the next maintenance window
- Notify the application team that a certificate update is pending
- Prepare the installation steps (server-specific: nginx, Apache, load balancer, application server)

**Emergency renewal (< 7 days or expired)**:
- Coordinate immediate installation
- Notify affected service owners
- Prepare rollback plan (keep the old certificate available)

**Important**: The actual certificate installation on servers ALWAYS requires human execution — the agent never installs certificates directly.

**Autonomy Gate**:
| Level | Action |
|-------|--------|
| L1 | Present installation steps; human coordinates and executes |
| L2 | Present steps; send coordination notifications automatically |
| L3 | Present steps; send notifications; track progress |
| L4 | Same as L3 |

### 4. Verify Renewal

After installation:
- Check the new certificate is served correctly:
  - Correct domain and SANs
  - Valid date range (new expiry date)
  - Correct certificate chain (intermediate certificates present)
  - No mixed content warnings
- Test from multiple endpoints if the service is behind a load balancer
- Verify that monitoring has picked up the new expiry date

**If verification fails**:
- Check for certificate chain issues (missing intermediate)
- Check for configuration errors (wrong certificate file path)
- Check for caching (old certificate cached by CDN or proxy)
- Escalate to the application team if configuration issues persist

### 5. Documentation and Prevention

- Update the incident ticket with:
  - Old certificate details (expiry date, issuer)
  - New certificate details (expiry date, issuer)
  - Installation steps taken
  - Verification results
- Check monitoring configuration:
  - Is the certificate being monitored for expiry?
  - Are alert thresholds appropriate (30/14/7 days)?
  - Is auto-renewal configured and tested (if applicable)?
- If this was an emergency renewal: create a follow-up task to review why it wasn't caught earlier

## Escalation Triggers

- Certificate has expired and services are affected → P1 incident
- Unable to obtain renewed certificate (CA issues, domain validation failure) → escalate to Security Operations
- Certificate chain issues after installation → escalate to Application team
- Wildcard or EV certificate renewal → always involves Security team approval

## Related Resources

- `knowledge/troubleshooting/network.md` — network-related certificate issues
- `specs/incident-management.md` — for incident creation if certificate is expired
- `config/escalation-matrix.yaml` — routing for security-related escalations

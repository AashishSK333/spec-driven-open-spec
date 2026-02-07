# IT Offboarding Procedure

Standard procedure for revoking IT access and recovering assets when an employee departs.

---

## Prerequisites

- Confirmed departure date from HR
- Employee name, department, and manager
- HR confirmation of offboarding type (resignation, termination, transfer)
- Manager notification of any data handover requirements

## Timeline

- **Immediate termination**: Execute all steps within 1 hour of HR notification
- **Planned departure**: Begin data backup T-5 days, execute revocation on departure date
- **Transfer**: Modify access rather than revoke — coordinate with new manager

---

## Checklist

### 1. Account Deactivation (execute on departure date or immediately for terminations)

- [ ] Disable Active Directory / identity provider account (do NOT delete — retain for audit trail)
- [ ] Disable email account
- [ ] Remove from all security groups
- [ ] Revoke VPN access
- [ ] Revoke MFA tokens
- [ ] Change shared account passwords if the employee had access to any

**Important**: For immediate terminations, this step takes priority over all others. Execute account deactivation first.

### 2. Application Access Revocation

- [ ] Revoke access to all business applications:
  - Office suite
  - Communication platforms (Slack, Teams)
  - CRM, financial systems, admin tools
  - Development tools and repositories
  - Cloud service accounts (AWS, Azure, GCP)
- [ ] Remove from shared folders and document repositories
- [ ] Revoke API keys and service account credentials associated with the employee
- [ ] Remove SSH keys from servers (if applicable)

### 3. Data Handling

- [ ] Confirm with manager: any data to be preserved or transferred?
- [ ] Back up email mailbox (per retention policy)
- [ ] Transfer ownership of shared documents to manager
- [ ] Transfer ownership of shared calendars to manager
- [ ] Archive (do not delete) the employee's home directory / personal drive
- [ ] If the employee had access to customer data: note for compliance team

### 4. Equipment Recovery

- [ ] Recover laptop/workstation (record return in asset management)
- [ ] Recover mobile devices (phone, tablet)
- [ ] Recover access cards and security badges
- [ ] Recover any other IT-issued equipment (monitors, peripherals, headsets)
- [ ] Wipe recovered devices per data security policy

### 5. Communication Cleanup

- [ ] Remove from Slack/Teams channels
- [ ] Remove from email distribution lists
- [ ] Set up email forwarding to manager (if requested — time-limited, max 30 days)
- [ ] Update out-of-office message on email (if applicable)
- [ ] Update internal directory (mark as inactive)

### 6. Compliance and Documentation

- [ ] Verify all access has been revoked (run access audit report)
- [ ] Document all actions taken in the offboarding ticket
- [ ] Confirm with HR that IT offboarding is complete
- [ ] If the employee had privileged access: notify Security team for audit review
- [ ] Retain account records per data retention policy (do NOT delete accounts)

---

## Security Considerations

- **Immediate terminations**: Prioritize account deactivation over everything else
- **Shared credentials**: If the employee had access to shared accounts, change those passwords immediately
- **Admin access**: If the employee had IT admin privileges, audit recent admin actions
- **Code repositories**: Remove access but do NOT delete the employee's commits or contributions
- **Never delete an account** — disable it. Deletion destroys audit trails

---

## Documentation

Record the following in the service request ticket:
- All accounts deactivated (with timestamps)
- Applications revoked
- Equipment recovered (asset tags)
- Data transferred to (manager name)
- Completion date
- Any items pending (e.g., equipment not yet returned)

---

## Related Resources

- `knowledge/procedures/access-provisioning.md` — access management procedures
- `specs/request-management.md` — service request handling rules

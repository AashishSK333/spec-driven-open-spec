# Access Provisioning Procedures

Standard procedures for granting, modifying, and revoking system and application access.

---

## General Principles

1. **Least privilege**: Grant only the minimum access required for the user's role
2. **Approval required**: All access changes require documented approval
3. **Audit trail**: Every access change is logged with who requested, who approved, and when
4. **Regular review**: Access should be reviewed quarterly and on role changes
5. **Temporary access**: Time-limited access should have an automatic expiry date

---

## Access Request Types

### New Access

**Required information**:
- Requestor name and employee ID
- Target system or application
- Access level requested (read-only, read-write, admin)
- Business justification
- Duration (permanent or temporary with end date)

**Approval chain**:
- Standard access: Manager approval
- Elevated access (admin, root, database): Manager + IT Manager approval
- Cross-department access: Manager + target department manager approval
- Financial system access: Manager + Finance director approval

### Access Modification

**Required information**:
- Current access level
- Requested change (upgrade, downgrade, additional permissions)
- Reason for change (role change, project assignment)

**Approval**: Same as new access for the target level

### Access Revocation

**Required information**:
- User account and target system
- Reason for revocation (departure, role change, project end)

**Approval**: Manager request or HR notification (for departures)

---

## Standard Access Provisioning Steps

### 1. Validate the request
- Confirm requestor identity
- Verify all required fields are present
- Check for duplicate or conflicting access requests

### 2. Obtain approval
- Route to appropriate approver per the approval chain above
- Document approval in the ticket (approver name, timestamp)

### 3. Provision access
- Create or modify the user's account/permissions
- For AD/LDAP: add to appropriate security groups
- For applications: configure user account with correct role/permissions
- For servers: add SSH key or grant login access
- For databases: create database user with appropriate grants

### 4. Verify access
- Confirm the user can log in to the target system
- Confirm the access level is correct (not more than requested)
- If temporary: confirm expiry date is set

### 5. Notify and document
- Notify the requestor that access has been provisioned
- Provide login instructions if needed
- Document in the ticket: system, access level, date provisioned, expiry (if applicable)

---

## Privileged Access Procedures

### Admin / Root Access

- Requires IT Manager approval in addition to manager approval
- Must have a documented business justification
- Should be time-limited when possible
- Must be reviewed quarterly
- Actions performed with privileged access should be auditable

### Service Accounts

- Service accounts must have an owner (a person responsible)
- Passwords/keys for service accounts must be stored in the organization's secret manager
- Service accounts should have minimum required permissions
- Service account access should be documented in `knowledge/architecture/service-dependencies.md`

### Emergency Access

- For critical incidents requiring immediate elevated access:
  - IT Manager can grant temporary access verbally, with documented ticket follow-up within 1 hour
  - Access must be revoked within 24 hours or formally approved
  - All actions taken with emergency access must be documented

---

## Access Review Process

### Quarterly Review
- Pull access reports for all systems
- Compare against approved access in ITSM tickets
- Identify accounts with no recent activity (>90 days)
- Identify access that no longer matches the user's role
- Revoke or modify as needed

### On Role Change
- When an employee changes roles or departments:
  - Review all current access
  - Revoke access no longer needed for the new role
  - Grant access required for the new role (requires new manager approval)

---

## Related Resources

- `knowledge/procedures/onboarding.md` — new employee IT setup
- `knowledge/procedures/offboarding.md` — access revocation for departing employees
- `specs/request-management.md` — service request handling rules

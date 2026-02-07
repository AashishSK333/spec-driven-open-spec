# IT Onboarding Procedure

Standard procedure for setting up IT resources for a new employee.

---

## Prerequisites

- Confirmed start date from HR
- Employee name, department, role, and manager
- Manager approval for access requests
- Equipment requirements (standard or role-specific)

## Timeline

- **T-5 business days**: Begin account creation and equipment preparation
- **T-2 business days**: Complete access provisioning, verify all accounts
- **T-1 business day**: Equipment staged, welcome email prepared
- **Day 1**: Employee receives equipment and credentials, orientation support

---

## Checklist

### 1. Account Creation

- [ ] Create Active Directory / identity provider account
- [ ] Create email account (set up mailbox, add to distribution groups)
- [ ] Create ITSM account (for submitting support tickets)
- [ ] Set temporary password and force change on first login
- [ ] Add to department and role-based security groups

### 2. Application Access

- [ ] Provision access to standard applications per role:
  - Office suite (email, calendar, documents)
  - Internal communication platform (Slack, Teams)
  - HR self-service portal
  - Time tracking system
- [ ] Provision access to role-specific applications (per manager request):
  - Development tools (if engineering)
  - CRM access (if sales/support)
  - Financial systems (if finance — requires additional approval)
  - Admin tools (if IT — requires IT manager approval)

### 3. VPN and Remote Access

- [ ] Set up VPN access (if role requires remote work capability)
- [ ] Configure MFA enrollment (provide instructions for first-time setup)
- [ ] Test VPN connectivity before Day 1

### 4. Equipment Provisioning

- [ ] Assign laptop/workstation from inventory (record asset tag)
- [ ] Configure with standard OS image
- [ ] Install required software
- [ ] Set up email client and calendar
- [ ] Configure VPN client
- [ ] Print and prepare credentials sheet (temporary password, WiFi, etc.)

### 5. Communication Setup

- [ ] Add to relevant Slack/Teams channels
- [ ] Add to department email distribution list
- [ ] Add to department calendar
- [ ] Schedule introductory meetings (IT orientation, manager 1:1)

### 6. Day 1 Handover

- [ ] Provide equipment and credentials
- [ ] Walk through login process and password change
- [ ] Demonstrate MFA setup
- [ ] Show how to submit IT support tickets
- [ ] Provide IT support contact information

---

## Documentation

Record the following in the service request ticket:
- All accounts created (with usernames)
- Applications provisioned
- Equipment assigned (asset tag, serial number)
- Completion date
- Any pending items and their expected completion date

---

## Related Resources

- `knowledge/procedures/access-provisioning.md` — detailed access provisioning procedures
- `specs/request-management.md` — service request handling rules
- `templates/knowledge-article.md` — for documenting role-specific onboarding variations

# Request Management

Behavioral specification for handling IT service requests — from intake through fulfillment and confirmation.

## Service Catalog

### Types of Requests

### Access Provisioning
- System access, application permissions, VPN access, shared drive access
- Requires: manager approval for all access grants
- Reference: `knowledge/procedures/access-provisioning.md`

### Account Creation
- New user accounts (AD, email, application-specific)
- Requires: HR confirmation of employment + manager approval
- Reference: `knowledge/procedures/onboarding.md`

### Software Installation
- Standard software (from approved list): can be fulfilled directly
- Non-standard software: requires IT manager approval + license check
- Always verify: license availability, system compatibility, security scan

### Equipment Requests
- Standard equipment (laptop, monitor, keyboard): fulfill from inventory
- Non-standard equipment: requires IT manager approval + procurement
- Track: asset tag, serial number, assigned user

### Environment Setup
- Development environment, test server, sandbox access
- Requires: team lead approval
- Verify: resource availability, naming conventions, network segmentation

## Validation Rules

### Required Fields (all request types)
- Requestor name and contact
- Request type (from catalog above)
- Business justification
- Urgency (standard | expedited)
- Target date (when the request is needed by)

### Additional Required Fields (by type)
- **Access Provisioning**: target system, access level, duration (permanent/temporary)
- **Account Creation**: employee name, department, role, start date
- **Software Installation**: software name, version, target machine, license type
- **Equipment**: equipment type, specifications, delivery location
- **Environment Setup**: environment type, required resources, project name

### When required fields are missing
- List the missing fields explicitly
- Request the information from the requestor via the ticket
- Do NOT proceed with fulfillment until all required fields are provided
- Set ticket status to "Pending Customer" until response received

## Approval Requirements

### Standard Requests (no additional approval)
- Password reset (self-service verified)
- Standard software installation (approved list)
- Standard equipment replacement (like-for-like)

### Manager Approval Required
- New system access
- Account creation
- New equipment (not replacement)
- Temporary contractor access

### IT Manager Approval Required
- Non-standard software
- Non-standard equipment
- Elevated access (admin, root, database)
- Cross-department access

### When approval is pending
- Set ticket status to "Pending Approval"
- Notify the approver via `notification` skill
- If no response within 48 hours: send reminder
- If no response within 72 hours: escalate to approver's manager

## Fulfillment Process

### 1. Receive and validate
- Verify all required fields are present
- Confirm the request type matches the catalog
- Check for duplicate requests (same requestor, same request within 7 days)

### 2. Obtain approvals
- Determine required approval level from rules above
- Route approval request to the appropriate approver
- Track approval status in the ticket

### 3. Execute fulfillment
- Follow the matching procedure from `knowledge/procedures/`
- Document each step taken in the ticket work notes
- If the procedure requires system changes: follow the relevant runbook

### 4. Verify completion
- Confirm the request has been fulfilled as specified
- Test access/functionality where applicable
- Document the verification in the ticket

### 5. Confirm with requestor
- Notify the requestor that their request is complete
- Provide: what was done, any relevant details (usernames, access instructions)
- Ask for confirmation that the request meets their needs
- If requestor confirms: close the ticket
- If requestor reports issues: reopen and address

## Documentation Requirements

Every fulfilled request must include in the ticket:
- Steps taken to fulfill the request
- Any systems or accounts created/modified
- Asset tags or license keys assigned
- Approval chain (who approved, when)
- Completion verification details
- Requestor confirmation

## Completion Criteria

A service request can be marked as complete when:
1. All required fields were provided
2. Required approvals were obtained
3. The request was fulfilled per the matching procedure
4. Completion was verified (access tested, equipment delivered, etc.)
5. Requestor was notified
6. All work notes are documented in the ticket

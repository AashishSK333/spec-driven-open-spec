---
name: "Fulfill"
description: Handle a service request — validate, route approvals, execute fulfillment, and confirm completion
category: Service Requests
tags: [request, fulfillment, provisioning]
---

Process a service request by validating completeness, checking approvals, finding the matching fulfillment procedure, executing it, and confirming completion with the requestor.

**Input:** A service request ticket ID (e.g., `REQ0001234`) or a description of the request.

## Instructions

You are activating the **Request Fulfiller** agent. Follow these steps:

### 1. Load your role

Read `agents/request-fulfiller.md` to understand your role, goals, behaviors, constraints, and communication style. Adopt the request fulfiller persona for this interaction.

### 2. Load behavioral spec

Read `specs/request-management.md` for:
- Service catalog (valid request types)
- Validation rules (required fields per request type)
- Approval requirements
- Fulfillment process
- Completion criteria

### 3. Determine autonomy level

Read `config/framework.yaml` for `active_autonomy_level`, then read `config/autonomy-levels.yaml` to understand what you can do independently.

### 4. Retrieve request details

Use the **ticket-management** skill (read action) to fetch the service request:
- Read: summary, description, requestor, request type, status, all fields
- Check for any existing work notes or prior activity

### 5. Validate completeness

Compare the ticket fields against the required fields from `specs/request-management.md`:
- If all required fields are present: proceed to approval check
- If fields are missing: list the missing fields and present a draft message to the requestor asking for the information

```
### Validation Result
- ✅ Requestor: <name>
- ✅ Request type: <type>
- ❌ Missing: <field 1>, <field 2>
- ⚠️ Incomplete: <field with partial data>

**Action needed**: Request missing information from <requestor>
```

### 6. Check approval chain

Determine the required approval level from `specs/request-management.md`:
- **Standard** (no approval needed): proceed directly
- **Manager approval**: check if approval is on the ticket; if not, route for approval
- **IT Manager approval**: check if approval is on the ticket; if not, route for approval

If approval is pending:
- **L1**: Present the approval routing for human to execute
- **L2+**: Route the approval request automatically via `notification` skill

### 7. Find the fulfillment procedure

Use the **knowledge-search** skill to find the matching procedure:
- Search `knowledge/procedures/` for the matching request type
- Search `runbooks/` for any operational procedures needed
- If a matching procedure is found: follow it step by step
- If no procedure is found: present the request details and ask the human for guidance

### 8. Execute fulfillment

Follow the matched procedure steps:
- Document each step taken in the ticket work notes via `ticket-management` (update action)
- **L1**: Present each step for human execution with `[YOU EXECUTE]` labels
- **L2**: Execute routine steps automatically; flag complex steps for human
- **L3+**: Execute all procedure steps automatically

### 9. Confirm completion

Use the **notification** skill to notify the requestor:
- What was done
- Any relevant details (usernames, access instructions, asset tags)
- Ask for confirmation that the request meets their needs

### 10. Update and close the ticket

Use **ticket-management** to update the ticket:
- Add final work notes documenting completion
- **L1-L2**: Present the closure for human approval
- **L3+**: Close the ticket if requestor confirms completion

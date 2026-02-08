# Request Fulfillment Workflow

Orchestrates the end-to-end service request lifecycle from intake to completion confirmation.

## References

- **Agent**: `.github/agents/request-fulfiller.agent.md`
- **Spec**: `specs/request-management.md`
- **Config**: `config/framework.yaml`, `config/autonomy-levels.yaml`
- **Integrations**: `integrations/jira/field-mappings.yaml`

## Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. Intake   │───▶│  2. Approval │───▶│  3. Procedure│───▶│  4. Execute  │───▶│  5. Verify   │
│  & Validate  │    │  Check       │    │  Lookup      │    │  Fulfillment │    │  & Confirm   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## Phase 1: Intake & Validation

**Trigger**: `/fulfill <request-id>` command executed

**Skills used**: `ticket-management`

**Steps**:
1. Use `ticket-management` (read action) to fetch the service request
2. Identify the request type from the service catalog in `specs/request-management.md`
3. Validate all required fields are present (per request type):
   - General: requestor, request type, justification, urgency, target date
   - Type-specific: additional fields per `specs/request-management.md`
4. If fields are missing:
   - Compile the list of missing fields
   - Draft a message to the requestor asking for the information
   - Set ticket status to "Pending Customer"

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Present validation results; human sends the information request |
| L2 | Send information request to requestor automatically; update ticket status |
| L3 | Same as L2 |
| L4 | Same as L2 |

**Output**: Validated request with all required fields confirmed, or information request sent

**Transition**: If all fields present → Phase 2. If fields missing → wait for response, then re-validate

---

## Phase 2: Approval Check

**Trigger**: All required fields validated

**Skills used**: `ticket-management`, `notification`

**Steps**:
1. Determine required approval level from `specs/request-management.md`:
   - **Standard** (no approval): proceed to Phase 3
   - **Manager approval**: check ticket for existing approval
   - **IT Manager approval**: check ticket for existing approval
2. If approval exists on the ticket: verify approver identity and proceed
3. If approval is needed:
   a. Identify the approver (requestor's manager, or IT manager)
   b. Use `notification` to send approval request
   c. Set ticket status to "Pending Approval"
   d. If no response in 48 hours: send reminder
   e. If no response in 72 hours: escalate to approver's manager

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Present approval routing for human to execute |
| L2 | Route approval request automatically; human tracks response |
| L3 | Route approval; auto-follow-up on reminders |
| L4 | Route approval; auto-escalate if no response |

**Output**: Approval confirmed or approval request sent

**Transition**: When approval is obtained → Phase 3

---

## Phase 3: Procedure Lookup

**Trigger**: Request validated and approved

**Skills used**: `knowledge-search`

**Steps**:
1. Use `knowledge-search` to find the matching fulfillment procedure:
   - Search `knowledge/procedures/` by request type
   - Search `runbooks/` for operational procedures
2. If a matching procedure is found:
   - Load the procedure
   - Present the steps that will be followed
3. If no procedure is found:
   - Flag this as a gap: "No standard procedure exists for this request type"
   - Ask the human for guidance on how to proceed
   - Recommend creating a procedure after this request is fulfilled

**Output**: Matched procedure or human guidance

**Transition**: Procedure identified → Phase 4

---

## Phase 4: Fulfillment Execution

**Trigger**: Procedure identified

**Skills used**: `ticket-management`, various (depending on request type)

**Steps**:
1. Follow the procedure step by step
2. Document each step in the ticket work notes via `ticket-management` (update action)
3. If the procedure requires system changes:
   - Follow the relevant runbook
   - Capture evidence of each change (screenshots, command output descriptions)
4. If a step fails or encounters an unexpected situation:
   - Stop and report the issue
   - Do NOT proceed with remaining steps until the issue is resolved

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Present each step with `[YOU EXECUTE]` labels; human performs all actions |
| L2 | Execute routine steps automatically (standard software install, access grant); flag complex steps for human |
| L3 | Execute all procedure steps automatically; only flag unexpected situations |
| L4 | Execute all steps; handle exceptions for known patterns |

**Output**: All procedure steps completed or blocked (with details)

**Transition**: All steps complete → Phase 5

---

## Phase 5: Verification & Confirmation

**Trigger**: Fulfillment steps complete

**Skills used**: `notification`, `ticket-management`

**Steps**:

### 5a. Verify completion
- Confirm the request has been fulfilled as specified:
  - Access granted: test the access works
  - Software installed: confirm it launches
  - Equipment delivered: confirm receipt
  - Account created: verify login works
- Document verification in ticket work notes

### 5b. Confirm with requestor
- Use `notification` to contact the requestor:
  - What was done
  - Any relevant details (usernames, URLs, instructions)
  - Ask for confirmation: "Does this meet your needs?"

### 5c. Close the ticket
- If requestor confirms: close the ticket via `ticket-management`
- If requestor reports issues: reopen and return to Phase 4
- Add final documentation: steps taken, approvals obtained, assets assigned

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Present completion summary; human sends confirmation and closes ticket |
| L2 | Send confirmation automatically; human closes ticket |
| L3 | Send confirmation; close ticket if requestor confirms |
| L4 | Full auto: send confirmation, close on confirmation, reopen if issues |

**Output**: Request fulfilled, confirmed, and ticket closed

---

## Completion

The request fulfillment workflow is complete when:
1. All required fields were validated
2. Required approvals were obtained
3. The procedure was executed successfully
4. Completion was verified
5. Requestor confirmed satisfaction
6. Ticket is closed with full documentation

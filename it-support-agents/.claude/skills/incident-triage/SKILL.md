---
name: incident-triage
description: Categorize and prioritize an incident based on affected systems, symptoms, and historical patterns.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 1
  requires_approval: false
---

Categorize and prioritize an incoming incident by gathering context, matching patterns, and applying the rules defined in `specs/incident-management.md`.

**Input:** An incident ticket ID (e.g., INC0012345), a monitoring alert, or a free-text description of the issue.

## Steps

### 1. Parse incident context

Extract key information from the input:
- Affected system(s) — hostname, service name, application
- Symptom description — what is happening, when it started
- Reporter — monitoring system, user, or automated alert
- Severity indicators — error messages, error counts, affected user count

### 2. Query ITSM for ticket details

If a ticket ID is provided:
- Fetch the ticket from the ITSM system (Jira Service Management)
- Read: summary, description, reporter, creation time, any existing comments
- Check for related or duplicate tickets

### 3. Check CMDB for configuration items

For each affected system:
- Look up the configuration item in the CMDB
- Identify: business criticality tag, owning team, dependent services
- Map upstream and downstream dependencies

### 4. Search knowledge base for matching patterns

Using the `knowledge-search` skill:
- Search `runbooks/` for procedures matching the symptoms
- Search `knowledge/troubleshooting/` for relevant guides
- Search resolved incident history for similar past incidents
- Note: if a matching runbook is found, include it in the output

### 5. Assign category and priority

Apply the rules from `specs/incident-management.md`:
- **Category**: Based on affected system type and symptom (e.g., Infrastructure > Server, Application > Web)
- **Priority**: Based on business criticality (from CMDB) and impact scope
  - P1: Business-critical service completely unavailable
  - P2: Business-critical degraded, OR standard service unavailable
  - P3: Standard service degraded, OR multiple users affected
  - P4: Single-user, cosmetic, or informational

### 6. Calculate confidence score

Rate the confidence of the categorization:
- **High (90-100%)**: Exact match to a known pattern with matching runbook
- **Medium (70-89%)**: Partial match or similar pattern found
- **Low (<70%)**: No matching pattern — flag for human review

## Output

Present a structured triage summary:

```
## Incident Triage: <ticket-id>

**Source**: <alert source or reporter>
**Affected**: <system> (<type>, <criticality>)
**Dependencies**: <upstream/downstream services>

### Category & Priority
- **Category**: <category> > <subcategory>
- **Priority**: <P1-P4> — <rationale>
- **Confidence**: <score>%

### Pattern Match
- <Matching runbook or "No matching pattern found">
- <Similar past incidents if any>

### Recommended Next Steps
1. <action 1>
2. <action 2>
3. <action 3>
```

## Guardrails

- This skill is **read-only** — it never creates or modifies tickets
- Always show the source of categorization decisions (which spec rule was applied)
- If confidence is below 70%, explicitly state "Recommend human review before proceeding"
- If multiple categories could apply, list the top 2 with confidence scores for each
- Never suppress information — even if results look benign, present all findings

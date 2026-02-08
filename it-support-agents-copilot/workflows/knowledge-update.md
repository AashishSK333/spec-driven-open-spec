# Knowledge Update Workflow

Orchestrates the continuous improvement of the knowledge base by scanning resolved incidents, identifying documentation gaps, and proposing updates.

## References

- **Agent**: `agents/knowledge-curator.md`
- **Spec**: `specs/incident-management.md` (closure criteria, pattern tracking)
- **Config**: `config/framework.yaml`
- **Template**: `templates/knowledge-article.md`

## Overview

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. Scan     │───▶│  2. Identify │───▶│  3. Draft    │───▶│  4. Submit   │
│  Resolved    │    │  Gaps        │    │  Updates     │    │  for Review  │
│  Incidents   │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**Important**: This workflow always requires human review. The knowledge-curator agent never auto-publishes content to the knowledge base.

---

## Phase 1: Scan Resolved Incidents

**Trigger**: Periodic review (weekly recommended) or on-demand via human request

**Skills used**: `ticket-management`

**Steps**:
1. Use `ticket-management` (query action) to fetch recently resolved incidents:
   - Time range: last 7 days (or since last knowledge review)
   - Status: Resolved or Closed
   - Sort by: priority (P1 first), then resolution time
2. For each incident, extract:
   - Category and subcategory
   - Root cause (from resolution details)
   - Resolution steps taken
   - Resolution category tags
   - Whether a runbook was referenced (from work notes)
   - Whether the incident was a repeat (check for similar past incidents)
3. Group incidents by pattern:
   - Same root cause
   - Same affected system/service
   - Same resolution approach

**Output**: Categorized list of resolved incidents with patterns identified

**Transition**: Proceed to Phase 2

---

## Phase 2: Identify Documentation Gaps

**Trigger**: Incident scan complete

**Skills used**: `knowledge-search`

**Steps**:
1. For each identified pattern, use `knowledge-search` to check:
   - Does a runbook exist for this type of incident?
   - Does a knowledge article exist for this troubleshooting scenario?
   - Does the spec cover this categorization correctly?

2. Classify gaps:

### Gap Type A: Missing Runbook
- An incident pattern has occurred 3+ times
- No runbook exists for the resolution procedure
- Resolution steps were manually executed each time
- **Recommendation**: Create a new runbook

### Gap Type B: Incomplete Runbook
- A runbook was referenced but did not fully cover the scenario
- Resolution required steps not in the runbook
- **Recommendation**: Update the existing runbook

### Gap Type C: Missing Knowledge Article
- Troubleshooting steps were discovered during the incident
- No knowledge article documents these steps
- Future analysts would benefit from this documentation
- **Recommendation**: Create a new knowledge article

### Gap Type D: Spec Drift
- Categorization applied during the incident differs from `specs/incident-management.md`
- Priority assigned doesn't match spec criteria
- **Recommendation**: Update the spec to reflect actual practice

### Gap Type E: Stale Content
- An existing article was found but contained outdated information
- Last modified date > 90 days and content contradicts recent incident findings
- **Recommendation**: Review and update the article

3. Prioritize gaps:
   - High: P1/P2 incidents without runbooks, repeated patterns without documentation
   - Medium: Incomplete procedures, knowledge gaps for P3 incidents
   - Low: Minor spec adjustments, style improvements, stale content

**Output**: Prioritized list of documentation gaps with recommended actions

**Transition**: Proceed to Phase 3

---

## Phase 3: Draft Updates

**Trigger**: Gaps identified and prioritized

**Skills used**: `report-generation`, `knowledge-search`

**Steps**:

### For new runbooks (Gap Type A):
1. Compile resolution steps from all matching incidents
2. Consolidate into a single procedure following the runbook format:
   - Prerequisites
   - Expected Duration
   - Numbered Steps with decision branches
   - Autonomy gates
   - Escalation triggers
3. Reference: use existing runbooks (`runbooks/server-unresponsive.md`, `runbooks/disk-space-critical.md`) as format templates

### For runbook updates (Gap Type B):
1. Identify the specific sections that need updating
2. Draft the additions or modifications
3. Present the diff (what changes, what stays the same)

### For new knowledge articles (Gap Type C):
1. Use `report-generation` with `templates/knowledge-article.md`
2. Populate from incident data:
   - Summary, symptoms, affected systems
   - Diagnosis steps, resolution, prevention
3. Add references to related runbooks and specs

### For spec updates (Gap Type D):
1. Identify the specific spec section that needs updating
2. Draft the proposed change
3. Include the rationale (which incidents prompted this change)

### For stale content (Gap Type E):
1. Identify what is outdated
2. Draft the corrected content
3. Note what changed and why

**Output**: Draft updates ready for human review

**Transition**: Proceed to Phase 4

---

## Phase 4: Submit for Review

**Trigger**: Drafts prepared

**Skills used**: `notification`

**Steps**:
1. Compile all proposed changes into a review summary:

```
## Knowledge Base Update Proposal

**Generated**: <timestamp>
**Review Period**: <date range of incidents scanned>
**Incidents Analyzed**: <count>
**Updates Proposed**: <count>

### Proposed Changes

#### 1. [NEW RUNBOOK] <title>
- **Reason**: Pattern identified in <count> incidents (<ticket IDs>)
- **File**: runbooks/<proposed-filename>.md
- **Priority**: <High/Medium/Low>
- <link to draft>

#### 2. [UPDATE] <existing-file>
- **Reason**: <why the update is needed>
- **Changes**: <summary of what changes>
- <link to diff>

#### 3. [NEW ARTICLE] <title>
- **Reason**: <knowledge gap identified>
- **File**: knowledge/<path>/<proposed-filename>.md
- <link to draft>
```

2. Present the review summary to the human
3. Use `notification` to alert the team that a knowledge review is ready (routine urgency)

**Decision Point — Autonomy Gate**:

| Level | Behavior |
|-------|----------|
| L1 | Present all proposals; human reviews, edits, and commits |
| L2 | Present all proposals; human reviews and approves; agent commits approved changes |
| L3 | Present all proposals; human approves; agent commits |
| L4 | Present all proposals; human approves; agent commits. Agent may also flag urgent gaps in real-time (not just during weekly review) |

**Important**: At ALL levels, the knowledge-curator presents proposals and waits for human approval before any content is published or committed. Knowledge base changes always go through human review.

**Output**: Review summary presented, awaiting human decision

---

## Completion

The knowledge update workflow is complete when:
1. Resolved incidents have been scanned
2. Documentation gaps have been identified
3. Draft updates have been prepared
4. Review summary has been presented to the team
5. (Post-review) Approved changes have been committed to the repository

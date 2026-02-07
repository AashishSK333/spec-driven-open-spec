---
name: knowledge-search
description: Search the knowledge base, runbooks, and specs for troubleshooting guides, procedures, and matching patterns.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 1
  requires_approval: false
---

Search across the framework's knowledge base for relevant troubleshooting information, operational procedures, and behavioral specifications.

**Input:** A search query, incident description, error message, or symptom keywords.

## Steps

### 1. Parse search context

Extract searchable terms from the input:
- Error messages and error codes
- System names and service names
- Symptom keywords (e.g., "slow", "unreachable", "high CPU", "connection refused")
- Technology keywords (e.g., "nginx", "postgresql", "VPN", "certificate")

### 2. Search knowledge articles

Search files in `knowledge/` directory:
- `knowledge/troubleshooting/` — diagnostic guides organized by technology area
- `knowledge/procedures/` — standard operating procedures (onboarding, access provisioning, etc.)
- `knowledge/architecture/` — system topology, service dependencies, network diagrams

### 3. Search runbooks

Search files in `runbooks/` directory:
- Look for runbooks matching the affected system type and symptoms
- Match against runbook prerequisites and step descriptions
- Prioritize runbooks that have been successfully used for similar incidents

### 4. Search specs

Search files in `specs/` directory:
- Check `specs/incident-management.md` for categorization guidance
- Check `specs/escalation-policy.md` for routing rules
- Check `specs/sla-definitions.md` for SLA targets

### 5. Rank and present results

Order results by relevance:
1. Exact pattern match (runbook specifically for this symptom) — highest
2. Partial match (related technology or similar symptom) — medium
3. General guidance (troubleshooting methodology, architecture context) — lower

## Output

```
## Knowledge Search Results

**Query**: <search terms used>
**Results**: <N> matches found

### 1. [RUNBOOK] <runbook-name>
**File**: runbooks/<filename>.md
**Relevance**: <High/Medium/Low> — <why this matches>
**Summary**: <1-2 sentence description of what this runbook covers>

### 2. [KNOWLEDGE] <article-title>
**File**: knowledge/troubleshooting/<filename>.md
**Relevance**: <High/Medium/Low> — <why this matches>
**Summary**: <1-2 sentence description>

### 3. [SPEC] <spec-section>
**File**: specs/<filename>.md
**Relevance**: <High/Medium/Low> — <why this matches>
**Summary**: <1-2 sentence description>

---
No additional matches found.
```

## Guardrails

- **Always include file paths** so humans can navigate directly to the source
- If no matches are found, say so explicitly: "No matching knowledge articles, runbooks, or specs found for this query"
- Never fabricate or hallucinate knowledge articles — only return content that actually exists in the repository
- If an article appears outdated (not modified in > 90 days), flag it: "This article may be outdated — last modified <date>"
- Limit results to **top 5** most relevant matches to avoid overwhelming the user
- If the search yields a runbook match, prominently highlight it as the recommended procedure

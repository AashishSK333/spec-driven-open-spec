# IT Support AI Agent Framework — Brainstorming & Feasibility Design

## Context

**Problem**: An IT Support Team currently runs Incident Management, Request Management, and daily Morning Checks as heavily manual processes. The goal is to introduce AI assistance that progressively automates these workflows.

**Strategy**: Two-tiered approach:
- **Tactical** (short-term): Custom AI agents in VS Code with human-in-the-loop
- **Strategic** (long-term): Transition to fully autonomous agents

**Design Principle**: This is a **purpose-built IT support agent framework** — not an extension of any SDD framework. SDD frameworks (OpenSpec, SpecKit, BMAD, AI-DLC) are referenced only for structural inspiration (folder conventions, markdown-based definitions, the idea of specs driving behavior). The framework should work independently and not depend on or couple to any specific SDD tooling.

**Confirmed Parameters**:
- **ITSM Tool**: Jira Service Management (reference integration)
- **Scope**: Tool-agnostic framework with pluggable integrations
- **Team**: Already using VS Code + Claude Code
- **Deliverable**: Feasibility + prototype scaffold + stakeholder-ready document

---

## 1. Architecture: VS Code-Based Framework Structure

### 1.1 Repository Layout

Delivered as a Git repo. IT staff clone it, open in VS Code with Claude Code, and interact via slash commands. The structure is organized by **what things are** (agents, skills, workflows, knowledge) rather than by any framework convention.

```
it-support-agents/
│
├── .claude/
│   ├── settings.local.json                # MCP permissions (deny-by-default)
│   ├── commands/                           # Slash commands (user-facing entry points)
│   │   ├── triage.md                       # /triage — incident triage
│   │   ├── morning-check.md               # /morning-check — daily checks
│   │   ├── fulfill.md                      # /fulfill — service request handling
│   │   ├── escalate.md                     # /escalate — route to team
│   │   ├── postmortem.md                   # /postmortem — post-incident review
│   │   └── status.md                       # /status — workload overview
│   └── skills/                             # Atomic capabilities (reusable units)
│       ├── incident-triage/SKILL.md
│       ├── server-health/SKILL.md
│       ├── ticket-management/SKILL.md
│       ├── log-analysis/SKILL.md
│       ├── service-restart/SKILL.md
│       ├── knowledge-search/SKILL.md
│       ├── sla-check/SKILL.md
│       ├── notification/SKILL.md
│       └── report-generation/SKILL.md
│
├── agents/                                 # Agent definitions (role + behavior + constraints)
│   ├── incident-responder.md
│   ├── request-fulfiller.md
│   ├── morning-check-operator.md
│   ├── knowledge-curator.md
│   └── escalation-manager.md
│
├── workflows/                              # Multi-step process orchestrations
│   ├── incident-lifecycle.md
│   ├── request-fulfillment.md
│   ├── morning-check.md
│   └── knowledge-update.md
│
├── specs/                                  # Behavioral specifications
│   ├── incident-management.md              # How incidents should be handled
│   ├── request-management.md               # How requests should be fulfilled
│   ├── morning-checks.md                   # What daily checks cover
│   ├── escalation-policy.md                # When and how to escalate
│   └── sla-definitions.md                  # SLA targets and thresholds
│
├── runbooks/                               # Step-by-step operational procedures
│   ├── server-unresponsive.md
│   ├── disk-space-critical.md
│   ├── certificate-expiry.md
│   ├── database-connection-failure.md
│   ├── vpn-connectivity.md
│   └── password-reset-bulk.md
│
├── knowledge/                              # Curated knowledge base
│   ├── troubleshooting/
│   │   ├── network.md
│   │   ├── servers.md
│   │   ├── databases.md
│   │   └── applications.md
│   ├── procedures/
│   │   ├── onboarding.md
│   │   ├── offboarding.md
│   │   └── access-provisioning.md
│   └── architecture/
│       ├── network-topology.md
│       └── service-dependencies.md
│
├── integrations/                           # MCP server configs (pluggable, per-tool)
│   ├── jira/                               # Reference implementation
│   │   ├── mcp-config.json
│   │   └── field-mappings.yaml
│   ├── monitoring/
│   │   ├── mcp-config.json
│   │   └── alert-mappings.yaml
│   ├── slack/
│   │   └── mcp-config.json
│   ├── email/
│   │   └── mcp-config.json
│   └── cmdb/
│       └── mcp-config.json
│
├── config/
│   ├── framework.yaml                      # Core framework settings
│   ├── autonomy-levels.yaml                # What each level permits/requires
│   ├── escalation-matrix.yaml              # Routing rules
│   └── environments/
│       ├── dev.yaml
│       ├── staging.yaml
│       └── prod.yaml
│
├── templates/                              # Output document templates
│   ├── incident-report.md
│   ├── morning-check-report.md
│   └── knowledge-article.md
│
└── README.md
```

### 1.2 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Self-contained, no SDD framework dependency** | Framework works standalone; SDD patterns are structural inspiration only (folder layout, markdown-based definitions) |
| **Agents as top-level `.md` files** | Inspired by BMAD's "agent-as-code" concept — each agent is a single markdown file defining role, goals, constraints, and tools |
| **Skills in `.claude/skills/`** | Leverages Claude Code's native skill system — no custom runtime needed |
| **Commands in `.claude/commands/`** | Leverages Claude Code's native slash command system — direct IDE integration |
| **Specs as flat files** | Simple markdown specs defining expected behaviors — not tied to any spec framework's artifact workflow |
| **Integrations separate from skills** | MCP configs change per environment and tool choice; skills remain tool-agnostic |
| **Runbooks as structured markdown** | Step-by-step procedures in a consistent format the agent can follow and humans can read |

### 1.3 How Staff Interact

Since the team already uses VS Code + Claude Code, interaction is through slash commands:

```
/triage INC0012345          → Activate incident-responder agent, begin triage
/morning-check              → Activate morning-check-operator, run daily checks
/fulfill REQ0001234         → Activate request-fulfiller, handle service request
/escalate INC0012345        → Route to correct team per escalation matrix
/postmortem INC0012345      → Generate post-incident review from ticket history
/status                     → Show current open incidents, pending requests, SLA status
```

Each command loads the relevant agent definition, references the appropriate specs and workflows, and invokes skills as needed. The agent operates within the autonomy level configured for the environment.

### 1.4 MCP Integration Architecture

```
┌──────────────────── VS Code + Claude Code ──────────────────────┐
│                                                                   │
│   .claude/settings.local.json (permission boundary)              │
│                                                                   │
│   ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────┐  ┌──────┐  │
│   │  Jira   │  │ Monitor │  │  Slack   │  │ CMDB │  │Email │  │
│   │  MCP    │  │  MCP    │  │  MCP     │  │ MCP  │  │ MCP  │  │
│   └────┬────┘  └────┬────┘  └────┬─────┘  └──┬───┘  └──┬───┘  │
└────────┼────────────┼────────────┼────────────┼─────────┼───────┘
         │            │            │            │         │
    Jira Cloud   Datadog/      Slack API    Config    Email
                 Nagios/etc                Mgmt DB   Service
```

**Permission model**: Deny-by-default. The `settings.local.json` explicitly lists allowed MCP operations. At Level 1, only read operations are permitted. Write permissions are added as the team progresses through autonomy levels.

### 1.5 Extensibility

All framework components are markdown files in predictable locations:
- **New skill**: Create `.claude/skills/new-skill-name/SKILL.md`
- **New agent**: Create `agents/new-role.md`
- **New runbook**: Create `runbooks/new-procedure.md`
- **New integration**: Create `integrations/new-tool/mcp-config.json`

No code compilation, no deployment pipeline. Git commit = framework update.

---

## 2. Specs: Defining Agent Behavior

### 2.1 Role of Specs in This Framework

Specs are **behavioral contracts** — they define what the agent should do in specific situations. They are not tied to any SDD framework's artifact pipeline. They are simply structured markdown documents that agents reference to make decisions.

The structural idea of "specs driving behavior" is borrowed from SDD thinking, but the implementation is pragmatic: the spec is a markdown file the agent reads for context, not an artifact in a formal change workflow.

### 2.2 Spec Format

Specs use a simple, readable structure that both humans and agents can work with:

```markdown
# Incident Management

## Categorization

### When a server is unreachable
- Check CMDB for affected configuration items and dependencies
- Categorize as Priority 2 — Infrastructure
- Suggest diagnosis steps from runbook "server-unresponsive"
- Identify affected downstream services

### When the incident type is unknown
- Categorize as Priority 3 — Unclassified
- Flag for human review with message "No matching pattern found"
- Suggest three closest pattern matches with confidence scores

## Prioritization

### Priority 1 — Critical
- Business-critical service is completely unavailable
- Trigger immediate escalation per escalation-matrix.yaml
- Post to Slack channel "#major-incidents"

### Priority 2 — High
- Business-critical service is degraded, OR standard service is unavailable
- Queue for immediate attention

### Priority 3 — Medium
- Standard service degraded, OR non-critical issue affecting multiple users
- Queue for next available analyst

### Priority 4 — Low
- Single-user issue, cosmetic problem, or informational request
- Queue for standard processing
```

This format is intentionally simpler than formal WHEN/THEN/SHALL spec language. It reads like instructions that a human would give another human, which makes it:
- Easy for IT staff to write and maintain
- Easy for agents to interpret
- Easy to review in a PR

### 2.3 Runbooks as Structured Procedures

Runbooks are step-by-step procedures. They reference specs for decision points but are oriented toward **action** rather than **definition**:

```markdown
# Server Unresponsive

## Prerequisites
- Server hostname or IP
- Alert source (monitoring, user report, morning check)

## Steps

### 1. Network Connectivity
- Check monitoring system for last ping status
- If unreachable: verify host exists in CMDB, check maintenance windows
- If in maintenance: log and close
- If NOT in maintenance: escalate to Network team

### 2. Service Status
- Query monitoring API for service states
- Compare against expected services from CMDB
- If all services running: proceed to application-layer checks
- If critical service stopped: check logs, attempt restart (if autonomy permits)

### 3. Resource Utilization
- Check CPU, memory, disk against thresholds in config
- If disk > 90%: run cleanup procedures
- If CPU > 95%: identify top processes, check for runaway jobs

### 4. Resolution Verification
- Re-run health checks after remediation
- Confirm service returns to healthy state within 5 minutes
- If not resolved: escalate to Application team

### 5. Documentation
- Update ticket with root cause, steps taken, resolution
- Tag with resolution category for pattern tracking
- If this is a new pattern (3+ occurrences): flag for runbook creation
```

### 2.4 The Feedback Loop

```
INCIDENT → RESOLUTION → PATTERN IDENTIFIED → RUNBOOK/SPEC UPDATE → BETTER AUTOMATION
   ↑                                                                      │
   └──────────────────────────────────────────────────────────────────────┘
```

When a new incident pattern appears repeatedly, the knowledge-curator agent proposes updates:
- New runbook if no procedure exists
- Spec update if categorization/prioritization should change
- Knowledge article if troubleshooting steps should be documented

These updates go through normal Git PR review — the team validates before merging.

### 2.5 Knowledge Base Integration

The `knowledge/` directory is the team's curated documentation. The `knowledge-search` skill searches across:
- `knowledge/` — troubleshooting guides, procedures, architecture docs
- `runbooks/` — operational procedures
- `specs/` — behavioral expectations

Results include file paths so humans can verify and update sources.

---

## 3. Component Design

### 3.1 Agents (formerly "Personas")

Each agent is a single `.md` file defining role, behavior, and constraints. The term "agents" is used instead of "personas" because these are the active entities that perform work.

**Agent file structure**:

| Section | Purpose |
|---------|---------|
| **Role** | One-line description of what this agent does |
| **Goals** | Ordered priorities |
| **Behaviors** | What to do in specific situations |
| **Communication Style** | How to present output |
| **Constraints** | Hard limits — what NEVER to do |
| **Skills** | Which skills this agent can invoke |
| **Escalation Rules** | When and how to escalate |
| **Autonomy** | How behavior changes at each level |

**Proposed Agents**:

| Agent | Primary Function | Key Skills |
|-------|-----------------|------------|
| **Incident Responder** | Triage, diagnose, resolve incidents | triage, server-health, log-analysis, ticket-mgmt, knowledge-search |
| **Request Fulfiller** | Handle service requests, provisioning | ticket-mgmt, knowledge-search, notification, sla-check |
| **Morning Check Operator** | Daily health checks, trend reporting | server-health, log-analysis, sla-check, report-generation, notification |
| **Knowledge Curator** | Maintain docs, identify gaps, propose updates | knowledge-search, report-generation |
| **Escalation Manager** | Route issues, track SLA, prevent ping-pong | ticket-mgmt, notification, sla-check |

### 3.2 Skills (Atomic Capabilities)

Each skill is a `SKILL.md` file leveraging Claude Code's native skill system. Skills are tool-agnostic — they describe *what* to do, not *which specific tool* to use. The MCP integration layer handles tool-specific translation.

| Skill | Function | Read/Write | Min Autonomy |
|-------|----------|-----------|--------------|
| `incident-triage` | Categorize and prioritize incidents | Read | 1 |
| `server-health` | Check server/service status via monitoring | Read | 1 |
| `log-analysis` | Query and analyze logs | Read | 1 |
| `ticket-management` | CRUD operations on ITSM tickets | Read+Write | 1 (read) / 2 (write) |
| `service-restart` | Restart services via runbook | Write | 3 |
| `knowledge-search` | Search knowledge base, runbooks, specs | Read | 1 |
| `sla-check` | Query SLA compliance metrics | Read | 1 |
| `notification` | Send Slack/email notifications | Write | 2 |
| `report-generation` | Generate reports from templates | Read | 1 |

**Skill composition**: Workflows chain skills together. A workflow defines the sequence; the agent decides when to invoke each skill based on the situation and spec guidance.

### 3.3 Workflows

Each workflow defines a multi-step process with phases, skills used at each phase, and decision points where human input is needed.

**Incident Lifecycle**:
1. **Detection & Intake** → ticket-mgmt (create/link ticket)
2. **Triage** → incident-triage, knowledge-search, sla-check → **[HUMAN DECISION at L1-L2]**
3. **Diagnosis** → server-health, log-analysis, knowledge-search
4. **Resolution** → service-restart, ticket-mgmt → **[HUMAN DECISION at L1-L3]**
5. **Closure** → ticket-mgmt, notification → **[HUMAN DECISION at L1-L2]**
6. **Post-Incident** (P1-P2 only) → report-generation

**Morning Check**:
1. Load check definitions from `config/framework.yaml`
2. Execute checks per system group (server-health, log-analysis, sla-check)
3. Compare against yesterday's results for trends
4. Compile report → post to Slack
5. Create incidents for RED findings → **[HUMAN DECISION at L1-L2]**

**Request Fulfillment**:
1. Validate request completeness
2. Check approval chain
3. Execute fulfillment per matching procedure
4. Confirm completion with requestor

### 3.4 Configurations

**`config/framework.yaml`** — Core settings: active autonomy level, enabled integrations, morning check schedule, system groups, default notification channels.

**`config/autonomy-levels.yaml`** — What each level permits and requires approval for:
- Level 1: Read-only diagnostics, suggestions only
- Level 2: Routine ticket writes, auto-categorization
- Level 3: Known runbook execution, auto-close after verification
- Level 4: Full autonomy for known patterns, proactive detection

**`config/escalation-matrix.yaml`** — Routing rules by incident category with escalation chain (team member → team lead → IT manager).

**`config/environments/*.yaml`** — Environment-specific overrides: ITSM instance URLs, monitoring endpoints, Slack workspaces, active autonomy level.

---

## 4. Transition Path: Human-in-the-Loop → Autonomous

### 4.1 Maturity Model

```
L1: ASSISTED           L2: SUPERVISED         L3: SEMI-AUTONOMOUS     L4: AUTONOMOUS
Agent suggests         Agent executes          Agent handles            Agent operates
Human executes         Human oversees          Human for exceptions     Human governs
─────────────────────────────────────────────────────────────────────────────────────
VALUE: Faster          VALUE: Reduced          VALUE: Known issues      VALUE: Proactive
diagnosis, consistent  manual work for         resolved without         detection, self-
categorization         routine tasks           human intervention       improving system
```

### 4.2 Level 1 — Assisted (Immediate)

**What happens**: Agent gathers data, analyzes, and presents a structured recommendation. Human executes every action.

**Example interaction**:
```
User: /triage INC0012345

Agent: ## Incident Triage: INC0012345

Source: Monitoring alert — prod-web-03 high CPU
Affected: prod-web-03 (Web Server, Business-Critical)
Dependencies: api-gateway, user-auth-service, payment-service

### Health Check
| Check   | Status   | Value | Threshold |
|---------|----------|-------|-----------|
| CPU     | CRITICAL | 98%   | <80%      |
| Memory  | WARNING  | 87%   | <90%      |
| nginx   | RUNNING  | —     | —         |

### Log Analysis (last 30 min)
- 847x "connection pool exhausted" in nginx error log
- Error rate spiked at 14:23 UTC
- Matches known pattern (3 previous incidents)

### Recommended Actions
1. [YOU EXECUTE] Restart nginx: ssh prod-web-03 'systemctl restart nginx'
2. [YOU EXECUTE] Update ticket: Category=Infrastructure>WebServer, Priority=P2
3. [YOU EXECUTE] Notify #web-platform on Slack

Confidence: 92%
```

**MCP permissions**: Read-only — get incidents, alerts, logs, CMDB queries. No writes.
**Skills active**: All read-only skills.
**Guardrails**: Every recommendation includes confidence score; agent never modifies external systems.

### 4.3 Level 2 — Supervised

**Unlocks**: Auto-categorization, auto-prioritization, ticket creation (P3/P4), routine Slack notifications.
**MCP permissions**: Add writes for ticket create/update, Slack post.
**Guardrails**: Confidence threshold >= 90% for auto-execution; hourly digest of autonomous actions to team lead.
**Transition criteria**: Categorization accuracy >= 95%, false positive rate <= 5%, override rate <= 10%, min 90 days at L1, 500+ incidents.

### 4.4 Level 3 — Semi-Autonomous

**Unlocks**: End-to-end runbook execution, service restarts for known patterns, auto-close after verified resolution, fully autonomous morning checks.
**MCP permissions**: Add service restart operations.
**Guardrails**: Per-pattern confidence thresholds, rate limiting (max auto-remediations/day), blast radius controls, weekly human review.
**Transition criteria**: Runbook success rate >= 98%, SLA compliance >= 95%, escalation accuracy >= 90%, min 180 days at L2, 1000+ incidents.

### 4.5 Level 4 — Autonomous

**Unlocks**: Proactive detection, auto-escalation, cross-system correlation, self-tuning thresholds, auto-generated runbooks from patterns.
**Human role**: Governance reviews (monthly), pattern approval, strategic decisions.
**Guardrails**: Novel remediation still needs approval; infrastructure changes need approval; instant kill switch to revert to L2.
**Transition criteria**: E2E resolution rate >= 95%, MTTR improvement >= 30%, zero severity misclassification, min 365 days at L3, 2000+ incidents.

### 4.6 Transition is Configuration, Not Code

Moving between levels requires:
1. Verify metrics meet criteria in `config/autonomy-levels.yaml`
2. Update `active_autonomy_level` in `config/environments/prod.yaml`
3. Expand MCP permissions in `.claude/settings.local.json`

No changes to agents, skills, or workflows. Same files work at all levels.

---

## 5. Feasibility Assessment

### What Makes This Feasible

| Factor | Why |
|--------|-----|
| **Claude Code native** | Skills and commands use Claude Code's built-in system — no custom runtime |
| **Markdown-only authoring** | IT staff write markdown, not code |
| **MCP ecosystem** | MCP servers for Jira, Slack, monitoring tools exist or can be built |
| **Incremental adoption** | Level 1 delivers value immediately with zero risk (read-only) |
| **Git-native** | All artifacts version-controlled; changes reviewed via standard PR |
| **No framework dependency** | Self-contained — doesn't require any SDD framework to function |

### Key Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| MCP servers for specific tools may not exist | Medium | Build custom MCP servers or use API gateway MCP |
| IT staff resistance to new process | High | Start at Level 1 (advisory only); demonstrate time savings |
| Runbook/spec drift from reality | Medium | Knowledge curator agent flags stale docs; feedback loop from resolutions |
| Over-reliance on agent at higher levels | Medium | Maintain manual capability; governance rotation; kill switch |
| Credential management | High | Environment variables + secret manager; `.gitignore` for secrets |

### Remaining Open Questions

1. **Monitoring stack** — Datadog, Nagios, Zabbix, Prometheus/Grafana?
2. **Knowledge base format** — Confluence, SharePoint, wiki, scattered docs?
3. **Morning check scope** — how many systems? Current checklist?
4. **Compliance** — regulatory/audit constraints on automation?

---

## 6. Implementation Plan

### Current Progress

| Step | Status | Notes |
|------|--------|-------|
| Scaffold all directories | DONE | All dirs created under `it-support-agents/` |
| `config/framework.yaml` | DONE | Core settings, morning checks, notifications |
| `config/autonomy-levels.yaml` | DONE | 4 levels + transition criteria + confidence thresholds |
| `config/escalation-matrix.yaml` | DONE | Category routing + 4-level escalation chain |
| `config/environments/prod.yaml` | DONE | L1 autonomy, SLA defs, placeholder URLs |
| `config/environments/dev.yaml` | DONE | L3 autonomy, relaxed SLAs for testing |

### Remaining Work (Phase A continued)

All files below are created inside `it-support-agents/`. Skill/command files follow the existing repo conventions: YAML frontmatter (`---` delimiters), kebab-case names, `##`/`###` section headers, bold callouts, bullet lists.

#### Step 3: `agents/incident-responder.md` (full reference agent)

Full agent definition with sections: Role, Goals, Behaviors (on new incident, on escalation, on resolution), Communication Style, Constraints, Skills, Escalation Rules, Autonomy (behavior at each of the 4 levels). This is the reference implementation — all other agents follow the same structure.

#### Step 4: 3 core skills

**`.claude/skills/incident-triage/SKILL.md`** — Frontmatter (name, description, metadata with autonomy_level:1, requires_approval:false). Body: Input (incident ID or alert details), Steps (parse context → query ITSM for ticket → check CMDB for CI → search knowledge base for patterns → assign category/priority per `specs/incident-management.md` → present recommendation), Output (structured triage summary with confidence score), Guardrails (read-only, never modify tickets at this skill level).

**`.claude/skills/server-health/SKILL.md`** — Frontmatter (autonomy_level:1, requires_approval:false). Body: Input (hostname, IP, or service name), Steps (resolve target via CMDB → check connectivity via monitoring MCP → check service status → check resource utilization → compare against thresholds from environment config), Output (health table: check/status/value/threshold + overall assessment), Guardrails (read-only, flag stale data >15min, never modify server state).

**`.claude/skills/knowledge-search/SKILL.md`** — Frontmatter (autonomy_level:1, requires_approval:false). Body: Input (search query or incident context), Steps (extract keywords → search `knowledge/` → search `runbooks/` → search `specs/` → rank results), Output (top 3-5 matches with file paths and relevance reasoning), Guardrails (always show sources, flag outdated articles).

#### Step 5: `.claude/commands/triage.md`

Command frontmatter: name "Triage", description "Triage an incident — gather diagnostics, categorize, and recommend actions", category "Incident Management", tags [incident, triage, diagnosis]. Body instructs Claude to: load `agents/incident-responder.md` for role/behavior, read `specs/incident-management.md` for categorization rules, read `config/autonomy-levels.yaml` to determine current autonomy level, read `config/environments/prod.yaml` for SLA thresholds, then invoke skills (incident-triage, server-health, knowledge-search) to produce a structured triage report. At L1: present recommendations for human execution. At L2+: execute auto-categorization.

#### Step 6: `specs/incident-management.md`

Full behavioral spec covering: Categorization (rules for server unreachable, application error, performance degradation, security alert, user-reported, unknown), Prioritization (P1-P4 definitions with actions per priority), Triage Process (what information to gather, what order), Resolution Documentation (what to record, how to tag for pattern tracking), Closure Criteria (when an incident can be closed).

#### Step 7: `runbooks/server-unresponsive.md`

Full runbook: Prerequisites, Steps (1. Network Connectivity, 2. Service Status, 3. Resource Utilization, 4. Application-Layer Checks, 5. Resolution Verification, 6. Documentation), decision branches at each step, escalation triggers, expected time per step.

#### Step 8: `workflows/incident-lifecycle.md`

Full workflow: 6 phases (Detection & Intake, Triage, Diagnosis, Resolution, Closure, Post-Incident). Each phase lists: trigger, active skills, steps, decision points with autonomy-level gates, expected outputs, transition criteria to next phase.

#### Step 9: `integrations/jira/mcp-config.json` + `field-mappings.yaml`

JSM reference integration: mcp-config.json with server name, command, args, env vars for auth. field-mappings.yaml mapping framework concepts (priority, category, status) to Jira field names and values.

#### Step 10: Remaining agents (drafts)

`agents/morning-check-operator.md`, `agents/request-fulfiller.md`, `agents/knowledge-curator.md`, `agents/escalation-manager.md` — lighter-weight drafts following the same structure as incident-responder but with role-specific content. Each has: Role, Goals, Behaviors (2-3 key scenarios), Constraints, Skills list.

#### Step 11: Templates

`templates/incident-report.md` — template with placeholders for incident ID, summary, timeline, root cause, resolution, lessons learned. `templates/morning-check-report.md` — template with system group table (GREEN/AMBER/RED), trend indicators, action items. `templates/knowledge-article.md` — template for documenting troubleshooting procedures.

#### Step 12: `.claude/settings.local.json`

MCP permissions for Level 1 (read-only). Allow list for monitoring reads, ITSM reads, CMDB queries, filesystem. Deny list for all write operations. Comments indicating what to unlock at each level.

#### Step 13: `README.md`

Project overview, quick start guide (clone → open in VS Code → run `/triage`), directory structure explanation, how to add new skills/agents/runbooks, link to config files, maturity model summary.

### Phase B: Stakeholder Document

After Phase A prototype is complete, derive a stakeholder-ready summary covering:
- Executive summary: problem, approach, value proposition, risk profile
- Architecture diagram (from Section 1.4 of this plan)
- Maturity model visual (from Section 4.1)
- Demo walkthrough showing `/triage` interaction at Level 1
- Cost/benefit analysis: time saved per incident at each autonomy level

### Phase C: Full Build-out — Detailed Implementation Plan

All files follow the established patterns from Phase A (same frontmatter, same section structure, same naming). Base path: `it-support-agents/`.

---

#### C1. Remaining 6 Skills (`.claude/skills/*/SKILL.md`)

Each skill follows the pattern: YAML frontmatter → intro paragraph → **Input** → **Steps** (numbered) → **Output** (formatted) → **Guardrails**.

**C1.1 `ticket-management/SKILL.md`**
- Frontmatter: `autonomy_level: 1` (read) / `2` (write), `requires_approval: true` (for writes)
- Input: Action (read | create | update | query | close) + params (ticket ID, fields, JQL query)
- Steps: (1) Determine action type, (2) For **read**: fetch ticket via ITSM MCP, format fields, (3) For **create**: validate required fields, apply category/priority from `specs/incident-management.md`, present draft (at L1: show draft for human; at L2+: create), (4) For **update**: fetch current state, present diff, apply update, add work note with agent attribution, (5) For **query**: build search from filters, execute, return summary table, (6) For **close**: verify closure criteria from spec, present summary, close (at L3+)
- Output: Formatted ticket details or summary table for queries
- Guardrails: NEVER delete tickets; ALWAYS add work notes with "Automated by IT Support Agent"; ticket creation/status changes require human approval at L1-L2; always show changes before applying

**C1.2 `log-analysis/SKILL.md`**
- Frontmatter: `autonomy_level: 1`, `requires_approval: false`
- Input: Target system/service, time range (default: 30 minutes), optional pattern filter
- Steps: (1) Determine log source (centralized vs server-local), (2) Query logs via monitoring MCP with time range + pattern, (3) Identify error patterns (repeated errors, bursts, correlation with incident timeline), (4) Flag stack traces and exception types, (5) Identify log gaps (missing expected entries), (6) Summarize findings
- Output: Summary of key findings, top 5 most frequent errors with counts, error timeline, relevant excerpts (summarized, not full dumps)
- Guardrails: Read-only; never modify/delete logs; limit output volume (summarize, don't dump); flag sensitive data found in logs (credentials, PII) and do NOT reproduce it; if logs unavailable report as a finding

**C1.3 `service-restart/SKILL.md`**
- Frontmatter: `autonomy_level: 3`, `requires_approval: true` (at L1-L2)
- Input: Service name, host, reason for restart, matching runbook (if any)
- Steps: (1) Verify the service exists and is in a restartable state, (2) Check if host is in a maintenance window, (3) Check blast radius — what depends on this service? (from CMDB), (4) Pre-restart: capture current state (logs, metrics), (5) Execute restart via server MCP, (6) Post-restart: wait 2 minutes, verify service is healthy, (7) If restart fails: capture error, do NOT retry automatically more than once, escalate
- Output: Pre/post restart status comparison, success/failure result, follow-up monitoring recommendation
- Guardrails: NEVER restart without checking maintenance windows and dependencies; maximum 2 restart attempts per service per hour; NEVER restart database services without DBA approval; NEVER restart at L1-L2 without explicit human approval; always log the restart action in the incident ticket

**C1.4 `sla-check/SKILL.md`**
- Frontmatter: `autonomy_level: 1`, `requires_approval: false`
- Input: Incident ticket ID (for single-ticket SLA) OR "summary" (for overall SLA dashboard)
- Steps: (1) Read SLA definitions from active environment config (`config/environments/*.yaml`), (2) For single ticket: fetch ticket, determine priority, calculate elapsed time vs SLA targets, calculate time remaining, (3) For summary: query all open tickets, group by priority, calculate SLA compliance %, identify at-risk tickets, (4) Flag any tickets where SLA is breached or at risk (>75% elapsed)
- Output: For single ticket: priority, SLA targets, elapsed time, time remaining, status (On Track / At Risk / Breached). For summary: compliance table by priority, list of at-risk tickets
- Guardrails: Read-only; always show calculation basis (which SLA definition, when clock started); flag if ticket has been re-prioritized (SLA may need recalculation)

**C1.5 `notification/SKILL.md`**
- Frontmatter: `autonomy_level: 2`, `requires_approval: true` (at L1)
- Input: Channel (Slack channel name or email address), message content, urgency (routine | important | critical)
- Steps: (1) Determine notification target from input or from `config/framework.yaml` notification settings, (2) Format the message (structured, concise, include incident ID if relevant), (3) For **critical**: use `#major-incidents` channel + mention on-call, (4) For **routine**: use default channel, (5) Send via Slack MCP or email MCP
- Output: Confirmation of message sent with channel/recipient and timestamp
- Guardrails: At L1: draft the message and present for human to send; at L2+: send routine notifications automatically; NEVER send to external recipients without human approval; NEVER include credentials, PII, or sensitive data in notifications; rate limit: max 10 notifications per hour per channel

**C1.6 `report-generation/SKILL.md`**
- Frontmatter: `autonomy_level: 1`, `requires_approval: false`
- Input: Report type (incident-report | morning-check-report | knowledge-article), data to populate the template
- Steps: (1) Load the matching template from `templates/`, (2) Populate `{{PLACEHOLDER}}` fields with provided data, (3) Fill in any fields that can be derived (duration = resolution time - detection time), (4) Flag any required fields that are missing, (5) Format the final report
- Output: Complete markdown report ready for posting or filing
- Guardrails: NEVER fabricate data for missing fields — mark as "NOT PROVIDED"; always include generation timestamp; report is a local artifact — posting/sharing is handled by the notification skill or human

---

#### C2. Remaining 5 Commands (`.claude/commands/*.md`)

Each command follows the triage.md pattern: YAML frontmatter → intro → **Input** → **Instructions** (numbered steps loading agent → config → spec → skills → output format → autonomy handling).

**C2.1 `morning-check.md`**
- Frontmatter: name "Morning Check", category "Operations", tags [morning-check, health, monitoring]
- Instructions: (1) Load `agents/morning-check-operator.md`, (2) Read `config/framework.yaml` for system_groups and schedule, (3) Read `config/autonomy-levels.yaml`, (4) Read `specs/morning-checks.md` for check definitions, (5) Read active environment config for thresholds, (6) For each system group: invoke `server-health`, `log-analysis`, `sla-check`, (7) Compare results against yesterday's report if available, (8) Compile report using `report-generation` skill with `templates/morning-check-report.md`, (9) Post via `notification` skill, (10) For RED findings: invoke `ticket-management` to create incidents (per autonomy level)
- Output: Morning check report with GREEN/AMBER/RED per system group, trend indicators, action items

**C2.2 `fulfill.md`**
- Frontmatter: name "Fulfill", category "Service Requests", tags [request, fulfillment, provisioning]
- Instructions: (1) Load `agents/request-fulfiller.md`, (2) Read `specs/request-management.md`, (3) Read autonomy config, (4) Invoke `ticket-management` to read request details, (5) Validate completeness (all required fields), (6) Check approval chain, (7) Invoke `knowledge-search` for matching fulfillment procedure, (8) Follow the procedure steps, (9) Invoke `notification` to confirm completion with requestor, (10) Update ticket via `ticket-management`

**C2.3 `escalate.md`**
- Frontmatter: name "Escalate", category "Incident Management", tags [escalation, routing]
- Instructions: (1) Load `agents/escalation-manager.md`, (2) Read `config/escalation-matrix.yaml` for routing, (3) Read autonomy config, (4) Invoke `ticket-management` to read incident details, (5) Determine target team from escalation matrix based on incident category, (6) Compile context package (what was checked, found, tried, ruled out), (7) Invoke `ticket-management` to update ticket with escalation details, (8) Invoke `notification` to alert target team, (9) Invoke `sla-check` to set follow-up timer

**C2.4 `postmortem.md`**
- Frontmatter: name "Post-Mortem", category "Incident Management", tags [postmortem, review, report]
- Instructions: (1) Load `agents/incident-responder.md` (post-incident mode), (2) Invoke `ticket-management` to read full incident history (all work notes, status changes, timestamps), (3) Invoke `log-analysis` to retrieve relevant log data from incident timeframe, (4) Construct timeline from ticket history, (5) Invoke `report-generation` with `templates/incident-report.md`, (6) Identify improvement areas (was a runbook followed? was it effective? what was missing?), (7) Propose spec/runbook updates if gaps found, (8) Present report for human review

**C2.5 `status.md`**
- Frontmatter: name "Status", category "Operations", tags [status, dashboard, overview]
- Instructions: (1) Invoke `ticket-management` (query) to get all open incidents grouped by priority, (2) Invoke `ticket-management` (query) to get all open service requests, (3) Invoke `sla-check` (summary mode) for overall SLA compliance, (4) Present a structured dashboard:
  - Open Incidents: count by priority, any P1/P2 highlighted
  - Open Requests: count, oldest pending
  - SLA Compliance: % by priority, at-risk tickets listed
  - Recent Resolutions: last 5 closed incidents
  - Morning Check Status: latest report summary (if today's check ran)

---

#### C3. Remaining 4 Specs (`specs/*.md`)

Each spec follows the `incident-management.md` pattern: categorization rules → process steps → required documentation → closure/completion criteria.

**C3.1 `specs/request-management.md`**
- Sections: Service Catalog (types of requests: access provisioning, account creation, software installation, equipment, environment setup), Validation Rules (required fields per request type, approval requirements), Fulfillment Process (receive → validate → approve → execute → confirm), Documentation Requirements (what to record), Completion Criteria (when a request is fulfilled)

**C3.2 `specs/morning-checks.md`**
- Sections: Check Scope (which system groups, which check types per group — references `config/framework.yaml`), Thresholds (GREEN/AMBER/RED definitions — references environment config thresholds), Trend Analysis Rules (when to promote AMBER to RED, what constitutes a trend), Report Requirements (what must be included, format), Incident Creation Rules (when to auto-create incidents from findings)

**C3.3 `specs/escalation-policy.md`**
- Sections: Escalation Triggers (SLA breach, complexity beyond scope, multi-team coordination, security incidents), Context Requirements (what must be included in every escalation), Routing Rules (reference `config/escalation-matrix.yaml`), Anti-Ping-Pong Rules (when an issue is bounced back, escalate to next level), Communication Rules (who to notify at each escalation level)

**C3.4 `specs/sla-definitions.md`**
- Sections: Priority Definitions (P1-P4 criteria — extracted and expanded from incident-management.md), SLA Targets (response and resolution times per priority — references environment configs), SLA Clock Rules (when clock starts, pauses, stops), Breach Handling (what happens when SLA is breached — notifications, escalation), Reporting Requirements (daily/weekly SLA compliance metrics)

---

#### C4. Remaining 3 Runbooks (`runbooks/*.md`)

Each follows the established pattern: Prerequisites → Expected Duration → Steps (numbered with decision branches + autonomy gates) → Escalation Triggers → Related Resources.

**C4.1 `runbooks/certificate-expiry.md`** — Check certificate validity, alert thresholds (30/14/7 days), renewal process, emergency renewal procedure. Always requires human for actual certificate rotation.

**C4.2 `runbooks/database-connection-failure.md`** — Check database connectivity, connection pool status, authentication issues, disk space on DB server, replication status. Escalate to DBA for all non-trivial fixes.

**C4.3 `runbooks/vpn-connectivity.md`** — Check VPN service status, authentication server, client connectivity, tunnel establishment, split-tunnel vs full-tunnel issues. Escalate to Network team for infrastructure issues.

(Note: `password-reset-bulk.md` is deferred — it involves access provisioning which requires tighter security controls and is better implemented after the request-fulfillment workflow is tested)

---

#### C5. Remaining 3 Workflows (`workflows/*.md`)

Each follows the `incident-lifecycle.md` pattern: header with agent/spec/config references → overview diagram → numbered phases with triggers/skills/steps/decision points/outputs/transitions.

**C5.1 `workflows/morning-check.md`**
- Agent: morning-check-operator
- Spec: specs/morning-checks.md
- Phases: (1) Load Check Definitions, (2) Execute Checks per system group, (3) Trend Analysis (compare with yesterday), (4) Compile Report, (5) Distribute and Act (post to Slack, create incidents for RED findings)
- Autonomy gates at Phase 5 (incident creation)

**C5.2 `workflows/request-fulfillment.md`**
- Agent: request-fulfiller
- Spec: specs/request-management.md
- Phases: (1) Intake & Validation, (2) Approval Check, (3) Procedure Lookup, (4) Fulfillment Execution, (5) Verification & Confirmation
- Autonomy gates at Phase 4 (execution) and Phase 5 (confirmation)

**C5.3 `workflows/knowledge-update.md`**
- Agent: knowledge-curator
- Spec: specs/incident-management.md (closure + pattern tracking sections)
- Phases: (1) Scan Resolved Incidents, (2) Identify Documentation Gaps, (3) Draft Updates (new runbook/article or update existing), (4) Submit for Review (create PR or present draft)
- Always requires human review — knowledge-curator never auto-publishes

---

#### C6. Remaining 4 Integration Stubs (`integrations/*/`)

Each follows the Jira pattern: `mcp-config.json` (server config with env vars, expected tools, per-level permissions) + optional field/alert mappings YAML.

**C6.1 `integrations/monitoring/mcp-config.json` + `alert-mappings.yaml`**
- Generic monitoring MCP stub (works with Datadog, Prometheus, Nagios via adapter)
- Expected tools: get_alerts, get_server_status, get_metrics, get_logs, acknowledge_alert
- alert-mappings.yaml: maps monitoring alert severities to framework priorities

**C6.2 `integrations/slack/mcp-config.json`**
- Slack MCP config with workspace, default channels
- Expected tools: post_message, get_channels, get_messages
- Per-level permissions (L1: no posting; L2+: post to configured channels)

**C6.3 `integrations/email/mcp-config.json`**
- Email MCP stub for notification delivery
- Expected tools: send_email, get_inbox
- Always requires human approval for sending

**C6.4 `integrations/cmdb/mcp-config.json`**
- CMDB MCP stub for configuration item lookups
- Expected tools: query_ci, get_dependencies, get_ci_details
- Read-only at all levels

---

#### C7. Knowledge Base Seed Content (`knowledge/`)

Placeholder articles with structure (populated with general guidance, team fills in specifics):

- `knowledge/troubleshooting/network.md` — network troubleshooting guide (DNS, routing, firewall, connectivity)
- `knowledge/troubleshooting/databases.md` — database troubleshooting guide (connections, performance, replication)
- `knowledge/troubleshooting/applications.md` — application troubleshooting guide (errors, performance, deployment issues)
- `knowledge/procedures/onboarding.md` — new employee IT onboarding checklist
- `knowledge/procedures/offboarding.md` — employee IT offboarding checklist
- `knowledge/procedures/access-provisioning.md` — access request fulfillment procedures
- `knowledge/architecture/service-dependencies.md` — service dependency map (placeholder for team to fill)
- `knowledge/architecture/network-topology.md` — network topology overview (placeholder)

---

#### C8. Config Addition: `config/environments/staging.yaml`

Staging environment config (between dev and prod):
- `active_autonomy_level: 2` (supervised)
- Staging instance URLs
- Production-like SLA targets

---

### Implementation Order

Execute in this order to maximize incremental value and ensure cross-references work:

1. **Skills first** (C1.1–C1.6) — all 6 remaining skills. These are atomic and have no dependencies on each other.
2. **Specs next** (C3.1–C3.4) — the 4 remaining behavioral specs. Commands and workflows reference these.
3. **Commands** (C2.1–C2.5) — the 5 commands. They reference agents (already exist), specs (just created), and skills (just created).
4. **Workflows** (C5.1–C5.3) — the 3 workflows. They reference everything above.
5. **Runbooks** (C4.1–C4.3) — the 3 remaining runbooks. Independent but referenced by knowledge-search.
6. **Integrations** (C6.1–C6.4) — the 4 remaining integration stubs.
7. **Knowledge base** (C7) — the 8 knowledge articles. Independent.
8. **Staging config** (C8) — simple config file.

**Total: 34 files to create.**

### Verification (Phase C)

After all files are created:
1. Run a cross-reference audit (same as Phase A) — verify every file reference points to an existing file
2. Verify all 9 skill directories now contain SKILL.md files
3. Verify all 6 commands exist in `.claude/commands/`
4. Verify all 5 specs exist in `specs/`
5. Verify all 5 runbooks exist in `runbooks/` (server-unresponsive + disk-space-critical from Phase A + 3 new)
6. Verify all 4 workflows exist in `workflows/`
7. Run `/triage`, `/morning-check`, `/status` with mock data to test command → agent → skill chains
8. Verify format consistency: all skills have same frontmatter structure, all agents have same sections, all commands have same instruction pattern

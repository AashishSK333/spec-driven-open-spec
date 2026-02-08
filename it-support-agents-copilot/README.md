# IT Support Agent Framework — GitHub Copilot Edition

An autonomy-aware IT support framework that provides specialized agents, skills, and workflows for triaging incidents, processing service requests, and maintaining operational health. This is the **GitHub Copilot** variant of the framework, designed to work seamlessly with GitHub Copilot's extensibility features.

> **Related**: For the Claude Code variant, see [`it-support-agents/`](../it-support-agents/)

---

## Quick Start

1. **Open in VS Code** with the GitHub Copilot extension installed
2. **Set environment variables** for MCP servers (see [Integration Setup](#integration-setup) below)
3. **Invoke an agent** using `@agentName` or a prompt using `/promptName`

Example:
```
User: @incident-responder investigate server-web-01 high CPU

User: /triage INC0012345

User: /morning-check
```

---

## Available Agents

Invoke custom agents using `@agentName` in GitHub Copilot Chat:

| Agent | Invocation | Description |
|---|---|---|
| **Incident Responder** | `@incident-responder` | Triage, diagnose, and resolve IT incidents |
| **Morning Check Operator** | `@morning-check-operator` | Run daily health checks and report anomalies |
| **Request Fulfiller** | `@request-fulfiller` | Process service requests through validation and fulfillment |
| **Escalation Manager** | `@escalation-manager` | Route incidents to specialist teams with full context |
| **Knowledge Curator** | `@knowledge-curator` | Maintain knowledge base and identify documentation gaps |

---

## Available Prompts (Slash Commands)

Invoke custom prompts using `/promptName` in GitHub Copilot Chat:

| Prompt | Invocation | Description |
|---|---|---|
| **Triage** | `/triage <ticket-id or description>` | Triage an incident — gather diagnostics, categorize, recommend actions |
| **Morning Check** | `/morning-check [system-group]` | Run daily operational health checks and produce a status report |
| **Fulfill** | `/fulfill <request-id or description>` | Handle a service request — validate, approve, fulfill |
| **Escalate** | `/escalate <ticket-id> [target-team]` | Escalate an incident to the appropriate team with full context |
| **Post-Mortem** | `/postmortem <ticket-id>` | Generate a post-incident review report |
| **Status** | `/status [filter]` | Display real-time dashboard of open incidents and SLA compliance |

---

## Directory Structure

```
it-support-agents-copilot/
├── .github/
│   ├── copilot-instructions.md          # Global behavioral instructions
│   ├── agents/                          # Custom agents (5)
│   ├── prompts/                         # Custom slash commands (6)
│   └── skills/                          # Atomic agent skills (9)
├── .vscode/
│   └── mcp.json                         # MCP server configurations (Jira, Slack, etc.)
├── workflows/                           # Multi-step orchestration docs (reference)
├── specs/                               # Behavioral specifications (5 files)
├── runbooks/                            # Operational procedures (5 files)
├── knowledge/                           # Knowledge base (9 articles)
├── templates/                           # Report templates (3 files)
├── config/                              # Framework configuration including autonomy levels
├── integrations/                        # Field/alert mappings for ITSM and monitoring
└── README.md                            # This file
```

---

## Autonomy Levels

The framework operates at one of **four autonomy levels**, configured in `config/framework.yaml`:

| Level | Name | Capabilities | Use Case |
|---|---|---|---|
| **1** | **Assisted** | Read-only. Gather diagnostics, present recommendations. Human executes all actions. | Initial deployment, trust-building |
| **2** | **Supervised** | Auto-categorize, create P3/P4 tickets, send routine notifications. Human approves high-risk actions. | After 90 days, ≥95% categorization accuracy |
| **3** | **Semi-Autonomous** | Execute known runbooks end-to-end, create all tickets, close after verification. Human approves only novel remediation. | After 180 days, ≥98% runbook success rate |
| **4** | **Autonomous** | Full autonomy for known patterns, proactive detection, auto-escalation. Human approves only novel remediation and infrastructure changes. | After 365 days, ≥95% end-to-end resolution rate |

Transition criteria defined in `config/autonomy-levels.yaml`.

**Current level**: Read from `config/framework.yaml` → `active_autonomy_level`

---

## Agent Skills

Skills are atomic, reusable capabilities defined in `.github/skills/*/SKILL.md`. Each agent can use multiple skills:

**Read-only skills (Level 1+):**
- `incident-triage` — Categorize and prioritize incidents
- `server-health` — Check server/service status via monitoring
- `log-analysis` — Query and analyze logs
- `knowledge-search` — Search knowledge base, runbooks, specs
- `sla-check` — Check SLA compliance
- `report-generation` — Generate reports from templates

**Write-enabled skills (Level 2+ with approval, Level 3+ autonomous):**
- `ticket-management` — Create, read, update, close tickets
- `notification` — Send Slack/email notifications
- `service-restart` — Safely restart services with pre/post checks

---

## Integration Setup

MCP servers are configured in `.vscode/mcp.json`. Set the following environment variables:

### Jira (ITSM)
```bash
export JIRA_INSTANCE_URL="https://your-org.atlassian.net"
export JIRA_AUTH_TOKEN="your-api-token"
export JIRA_USER_EMAIL="your-email@company.com"
export JIRA_PROJECT_KEY="ITSUP"
```

### Slack
```bash
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_WORKSPACE="your-workspace"
```

### Monitoring (Datadog, Prometheus, Nagios, etc.)
```bash
export MONITORING_API_URL="https://api.datadoghq.com"  # or your monitoring URL
export MONITORING_API_KEY="your-api-key"
export MONITORING_PROVIDER="datadog"  # or prometheus, nagios, zabbix
```

### CMDB
```bash
export CMDB_API_URL="https://your-cmdb.company.com/api"
export CMDB_API_KEY="your-api-key"
export CMDB_PROVIDER="servicenow"  # or device42, i-doit, custom
```

### Email (optional fallback)
```bash
export EMAIL_SMTP_HOST="smtp.office365.com"
export EMAIL_SMTP_PORT="587"
export EMAIL_FROM_ADDRESS="it-support-agent@company.com"
export EMAIL_AUTH_USER="it-support-agent@company.com"
export EMAIL_AUTH_TOKEN="your-smtp-password"
```

---

## Example Workflows

### Incident Lifecycle
1. User: `/triage INC0012345` → **Incident Responder** triages the incident
2. Agent gathers diagnostics, categorizes as P2, finds matching runbook
3. At Level 3: Agent executes runbook end-to-end
4. If escalation needed: hands off to **Escalation Manager** (`@escalation-manager`)
5. After resolution: hands off to **Knowledge Curator** (`@knowledge-curator`) if pattern should be documented

### Morning Health Checks
1. User: `/morning-check` → **Morning Check Operator** runs daily checks
2. Agent checks all system groups (production-servers, databases, network, security)
3. Compiles GREEN/AMBER/RED report with trend analysis
4. Posts to Slack automatically (Level 2+)
5. For RED findings: creates incidents or hands off to **Incident Responder**

### Service Request Fulfillment
1. User: `/fulfill REQ0001234` → **Request Fulfiller** processes the request
2. Agent validates completeness, checks approval chain
3. Routes for manager approval if needed
4. Executes fulfillment procedure from `knowledge/procedures/`
5. Confirms with requestor and closes (Level 3+)

---

## Behavioral Specifications

Before taking action, agents consult behavioral specs in `specs/`:

- **`incident-management.md`**: Categorization, prioritization, triage, resolution, closure
- **`escalation-policy.md`**: Escalation triggers, routing rules, context requirements, anti-ping-pong
- **`morning-checks.md`**: Check scope, GREEN/AMBER/RED thresholds, trend analysis, incident creation
- **`sla-definitions.md`**: Priority definitions, SLA targets, breach handling
- **`request-management.md`**: Service catalog, validation, approvals, fulfillment, completion criteria

---

## Relationship to Claude Code Variant

This project is the **GitHub Copilot** equivalent of the [`it-support-agents/`](../it-support-agents/) Claude Code project. Key differences:

| Feature | Claude Code | GitHub Copilot |
|---|---|---|
| **Commands** | `.claude/commands/*.md` | `.github/prompts/*.prompt.md` |
| **Agents** | `.claude/agents/*.md` (activated by commands) | `.github/agents/*.agent.md` (invoked as @agentName) |
| **Skills** | `.claude/skills/*/SKILL.md` | `.github/skills/*/SKILL.md` (same format) |
| **Workflows** | `workflows/*.md` (standalone files) | Agent handoffs + `workflows/*.md` (reference docs) |
| **MCP Config** | `integrations/*/mcp-config.json` (5 files) | `.vscode/mcp.json` (1 consolidated file) |
| **Global Instructions** | `CLAUDE.md` | `.github/copilot-instructions.md` |

**Shared (unchanged):**
- `specs/`, `runbooks/`, `knowledge/`, `templates/`, `config/` — all framework-agnostic

---

## Configuration

### Active Autonomy Level
Set in `config/framework.yaml`:
```yaml
active_autonomy_level: 1  # 1=Assisted, 2=Supervised, 3=Semi-Autonomous, 4=Autonomous
```

### Active Environment
Set in `config/framework.yaml`:
```yaml
active_environment: prod  # prod, staging, or dev
```

Environment-specific settings (SLA targets, health thresholds) are in `config/environments/*.yaml`.

---

## Contributing

To extend the framework:

1. **Add a new skill**: Create `.github/skills/<skill-name>/SKILL.md` with YAML frontmatter + Input/Steps/Output/Guardrails
2. **Add a new agent**: Create `.github/agents/<agent-name>.agent.md` with tools and handoffs in frontmatter + persona in body
3. **Add a new prompt**: Create `.github/prompts/<prompt-name>.prompt.md` with mode/description/tools in frontmatter + instructions in body
4. **Add knowledge**: Add articles to `knowledge/troubleshooting/` or `knowledge/procedures/`
5. **Add a runbook**: Add procedure to `runbooks/` following the existing format
6. **Update specs**: Modify `specs/*.md` to adjust categorization, prioritization, or escalation rules

---

## License

[Your License Here]

---

## Support

For questions or issues:
- Internal: Contact the IT Operations team
- Documentation: See `knowledge/` directory and `specs/` for detailed behavioral specs

# IT Support Agent Framework

AI-assisted IT support automation for Incident Management, Request Management, and daily Morning Checks. Built for VS Code + Claude Code.

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> it-support-agents
cd it-support-agents

# 2. Open in VS Code
code .

# 3. Start Claude Code and run your first triage
/triage INC0012345
```

## How It Works

This framework provides AI agents that assist IT support staff through slash commands in VS Code. Each command activates a specialized agent that follows defined behavioral specs, uses atomic skills, and operates within a configured autonomy level.

```
You type:        /triage INC0012345
                        │
Claude loads:    agents/incident-responder.md    (role & behavior)
                 specs/incident-management.md     (categorization rules)
                 config/autonomy-levels.yaml      (what's auto vs. manual)
                        │
Agent invokes:   incident-triage skill           (categorize & prioritize)
                 server-health skill              (check affected systems)
                 knowledge-search skill           (find matching runbooks)
                        │
You get:         Structured triage report with recommendations
```

## Commands

| Command | Description |
|---------|-------------|
| `/triage <incident>` | Triage an incident — gather diagnostics, categorize, recommend actions |
| `/morning-check` | Run daily health checks across all system groups |
| `/fulfill <request>` | Handle a service request |
| `/escalate <incident>` | Route to the correct team per escalation matrix |
| `/postmortem <incident>` | Generate a post-incident review report |
| `/status` | Show current open incidents, pending requests, SLA status |

## Directory Structure

```
.claude/commands/        Slash commands — user-facing entry points
.claude/skills/          Atomic capabilities — reusable skill units
agents/                  Agent definitions — role, behavior, constraints
workflows/               Multi-step process orchestrations
specs/                   Behavioral specifications — how things should work
runbooks/                Step-by-step operational procedures
knowledge/               Curated knowledge base (troubleshooting, procedures, architecture)
integrations/            MCP server configs for external tools (Jira, monitoring, Slack)
config/                  Framework settings, autonomy levels, escalation matrix, environments
templates/               Output document templates (incident report, morning check, etc.)
```

## Autonomy Levels

The framework operates at 4 levels. The active level is configured in `config/framework.yaml`.

| Level | Name | Agent Does | Human Does |
|-------|------|-----------|------------|
| **1** | Assisted | Gathers data, analyzes, recommends | Executes all actions |
| **2** | Supervised | Executes routine tasks (P3/P4 tickets, notifications) | Oversees, approves non-routine |
| **3** | Semi-Autonomous | Handles known patterns end-to-end (runbooks, restarts) | Handles exceptions only |
| **4** | Autonomous | Full automation for known patterns, proactive detection | Governance reviews |

**Start at Level 1.** Progress to higher levels after meeting the metrics thresholds defined in `config/autonomy-levels.yaml`.

## Extending the Framework

### Add a new skill

Create `.claude/skills/my-new-skill/SKILL.md` with:
- YAML frontmatter (name, description, metadata)
- Input description
- Step-by-step procedure
- Output format
- Guardrails

### Add a new agent

Create `agents/my-new-agent.md` with sections: Role, Goals, Behaviors, Constraints, Skills, Escalation Rules, Autonomy.

### Add a new runbook

Create `runbooks/my-procedure.md` with: Prerequisites, Steps (numbered with decision branches), Escalation Triggers, Related Resources.

### Add a new integration

Create `integrations/my-tool/mcp-config.json` with MCP server configuration. Update `.claude/settings.local.json` with the appropriate permissions.

## Configuration

| File | Purpose |
|------|---------|
| `config/framework.yaml` | Active autonomy level, enabled integrations, morning check schedule |
| `config/autonomy-levels.yaml` | What each level permits, transition criteria |
| `config/escalation-matrix.yaml` | Team routing rules for escalations |
| `config/environments/prod.yaml` | Production URLs, SLA targets, thresholds |
| `config/environments/dev.yaml` | Development environment settings |
| `.claude/settings.local.json` | MCP permissions (deny-by-default) |

## Integration Setup (Jira Service Management)

1. Set environment variables:
   ```bash
   export JIRA_INSTANCE_URL=https://your-org.atlassian.net
   export JIRA_AUTH_TOKEN=your-api-token
   export JIRA_USER_EMAIL=your-email@org.com
   export JIRA_PROJECT_KEY=ITSUP
   ```
2. Update `integrations/jira/field-mappings.yaml` to match your project's field names
3. Add Jira MCP server to `.claude/settings.local.json`
4. See `integrations/jira/mcp-config.json` for the MCP server configuration

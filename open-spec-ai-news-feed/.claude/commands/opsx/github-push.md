---
name: "OPSX: GitHub Push"
description: Push archived changes to GitHub repository using MCP tools
category: Workflow
tags: [workflow, github, mcp, experimental]
---

Push archived changes to GitHub repository using MCP tools.

**Input**: Optionally specify an archived change name after `/opsx:github-push` (e.g., `/opsx:github-push 2026-02-01-add-auth`). If omitted, prompt for selection from recently archived changes.

**Prerequisites**
- MCP GitHub server must be configured in `.mcp.json`
- `GITHUB_TOKEN` environment variable must be set with repo access
- Repository must have a configured remote origin

**Steps**

1. **Verify MCP GitHub server availability**

   Check that the GitHub MCP tools are available. If not configured, display setup instructions:

   ```
   ## MCP GitHub Server Not Configured

   Add to your .mcp.json:
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-github"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
         }
       }
     }
   }

   Then set GITHUB_TOKEN environment variable.
   ```

2. **If no change specified, prompt for archived change selection**

   List archived changes from `openspec/changes/archive/`:
   ```bash
   ls -la openspec/changes/archive/
   ```

   Use **AskUserQuestion tool** to let user select which archived change to push.

   **IMPORTANT**: Only show changes that haven't been pushed yet (check git status).

3. **Gather repository information**

   Get the current repository details:
   ```bash
   git remote get-url origin
   git branch --show-current
   ```

   Parse owner and repo name from the remote URL.

4. **Check for uncommitted changes**

   Run git status to see current state:
   ```bash
   git status --porcelain
   ```

   If there are uncommitted changes related to the archived change, proceed to commit.
   If changes are already committed, skip to push step.

5. **Stage archived change files**

   Stage all files in the archived change directory:
   ```bash
   git add openspec/changes/archive/<archived-change-name>/
   ```

   Also stage any synced specs if applicable:
   ```bash
   git add openspec/specs/
   ```

6. **Create commit with descriptive message**

   Generate a commit message based on the change:
   - Read the proposal.md from the archived change for context
   - Create a conventional commit message

   ```bash
   git commit -m "docs(openspec): archive <change-name>

   - Archived change: <change-name>
   - Schema: <schema-name>
   - Artifacts: proposal, specs, design, tasks
   - Synced specs: <list of synced capabilities or 'none'>

   Co-Authored-By: OpenSpec Workflow <openspec@example.com>"
   ```

7. **Push to remote repository**

   **Option A: Direct push (if on main/feature branch)**
   ```bash
   git push origin <current-branch>
   ```

   **Option B: Create PR (recommended for team workflows)**

   Use **AskUserQuestion tool** to ask user preference:
   - "Push directly to current branch"
   - "Create a new branch and PR (recommended)"

   If PR option selected:
   ```bash
   git checkout -b openspec/archive-<change-name>
   git push -u origin openspec/archive-<change-name>
   ```

   Then use MCP GitHub tool to create PR:
   - Use `mcp__github__create_pull_request` with:
     - title: "docs(openspec): Archive <change-name>"
     - body: Summary from proposal.md
     - base: main (or detected default branch)
     - head: openspec/archive-<change-name>

8. **Display summary**

   Show push completion summary.

**Output On Success (Direct Push)**

```
## GitHub Push Complete

**Change:** <change-name>
**Commit:** <commit-sha>
**Branch:** <branch-name>
**Remote:** <remote-url>

✓ Archived change committed and pushed
✓ Specs synced (if applicable)
```

**Output On Success (PR Created)**

```
## GitHub PR Created

**Change:** <change-name>
**PR:** #<pr-number> - <pr-title>
**Branch:** openspec/archive-<change-name> → main
**URL:** <pr-url>

✓ Archived change committed
✓ Pull request created for review
```

**Output On Error (No MCP Server)**

```
## GitHub Push Failed

MCP GitHub server is not configured.

**Setup Instructions:**
1. Ensure .mcp.json exists with github server configuration
2. Set GITHUB_TOKEN environment variable
3. Restart Claude Code to load the MCP server
```

**Output On Error (Push Failed)**

```
## GitHub Push Failed

**Change:** <change-name>
**Error:** <error-message>

**Possible causes:**
- No network connection
- Invalid GITHUB_TOKEN
- Branch protection rules
- Merge conflicts

Please resolve the issue and try again.
```

**Guardrails**
- Never push to main without user confirmation
- Always verify MCP GitHub server is available before operations
- Use conventional commit format for consistency
- Include Co-Authored-By for traceability
- Prefer PR workflow for team collaboration
- Don't push if there are merge conflicts - notify user to resolve first
- Verify GITHUB_TOKEN has necessary permissions before operations

**MCP Tool Reference**

The following MCP GitHub tools may be used:

| Tool | Purpose |
|------|---------|
| `mcp__github__create_or_update_file` | Create/update individual files |
| `mcp__github__push_files` | Push multiple files in one commit |
| `mcp__github__create_branch` | Create new branch for PR |
| `mcp__github__create_pull_request` | Create PR from branch |
| `mcp__github__get_file_contents` | Read files from repo |

**Integration with Archive Workflow**

This command is designed to be called after `/opsx:archive`:

```
User: /opsx:archive
→ Archives the change to openspec/changes/archive/YYYY-MM-DD-<name>/

User: /opsx:github-push
→ Commits and pushes the archived change to GitHub
```

Or combine in one flow:
```
User: Archive and push to GitHub
→ Run /opsx:archive
→ Run /opsx:github-push
```

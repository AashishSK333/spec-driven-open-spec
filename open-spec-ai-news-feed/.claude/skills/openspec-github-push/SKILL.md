---
name: openspec-github-push
description: Push archived changes to GitHub repository using MCP GitHub tools. Use after archiving a change to commit and push the archived documents to the remote repository.
license: MIT
compatibility: Requires MCP GitHub server configured with GITHUB_TOKEN.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.1.1"
  mcpTools:
    - mcp__github__create_or_update_file
    - mcp__github__push_files
    - mcp__github__create_branch
    - mcp__github__create_pull_request
---

Push archived changes to GitHub repository using MCP tools.

**Input**: Optionally specify an archived change name. If omitted, prompt for selection from recently archived changes.

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

   Show push completion summary:

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
| `mcp__github__search_repositories` | Find repository info |

**Integration with Archive Workflow**

This skill is designed to be called after `openspec-archive-change`:

```
User: /opsx:archive
→ Archives the change to openspec/changes/archive/YYYY-MM-DD-<name>/

User: /opsx:github-push
→ Commits and pushes the archived change to GitHub
```

Or combine in one flow:
```
User: Archive and push to GitHub
→ Run openspec-archive-change skill
→ Run openspec-github-push skill
```

---
name: log-analysis
description: Query and analyze application and system logs to identify error patterns, anomalies, and correlations with incidents.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 1
  requires_approval: false
---

Query logs from centralized or server-local sources, identify error patterns and anomalies, and produce a structured analysis for incident diagnosis.

**Input:** Target system or service name, time range (default: last 30 minutes), and optionally a specific pattern or error message to filter on.

## Steps

### 1. Determine log source

- Check if the target system uses centralized logging (ELK, Splunk, Datadog Logs) or server-local logs
- Reference `integrations/monitoring/mcp-config.json` for the configured log query tool
- If multiple log sources exist for the target, query all of them

### 2. Query logs with filters

- Build the log query:
  - **Target**: hostname, service name, or application identifier
  - **Time range**: use provided range, or default to last 30 minutes
  - **Pattern filter**: if provided, include as a search term
  - **Log levels**: focus on ERROR, WARN, FATAL first, then INFO if needed for context
- Execute the query via the monitoring MCP
- If logs are unavailable or empty, report this as a finding (not an error)

### 3. Identify error patterns

Analyze the returned logs for:
- **Repeated errors**: Same error message appearing multiple times — count occurrences
- **Error bursts**: Sudden spike in error rate compared to baseline
- **Correlation with incident timeline**: Errors that started at or near the reported incident time
- **Cascading failures**: Errors in one service followed by errors in dependent services
- **New errors**: Error messages not seen in the past 7 days

### 4. Flag stack traces and exceptions

- Extract unique stack traces and exception types
- De-duplicate: if the same stack trace appears 100 times, show it once with the count
- Identify the root exception (bottom of the stack trace)
- Note the component/class/function where the error originates

### 5. Identify log gaps

- Check for missing log entries during the incident timeframe
- A gap in logging can indicate: service crash, disk full, logging pipeline failure
- Note expected log patterns that are absent (e.g., heartbeat entries, scheduled job logs)

### 6. Summarize findings

Compile findings into a structured analysis with:
- Top 5 most frequent errors
- Error timeline (when errors started, peaked, resolved)
- Key excerpts (individual log lines that are diagnostically significant)
- Correlation assessment: does the log evidence match the reported symptoms?

## Output

```
## Log Analysis: <target-system>

**Time Range**: <start> — <end>
**Log Source**: <centralized/local> via <tool>
**Total Entries Analyzed**: <N>

### Key Findings
- <finding 1 — most important>
- <finding 2>
- <finding 3>

### Top Errors (by frequency)
| # | Error Message (summarized)           | Count | First Seen | Last Seen |
|---|--------------------------------------|-------|------------|-----------|
| 1 | Connection pool exhausted            | 847   | 14:23 UTC  | 14:52 UTC |
| 2 | Timeout waiting for response         | 234   | 14:25 UTC  | 14:50 UTC |
| 3 | NullPointerException in UserService  | 12    | 14:30 UTC  | 14:35 UTC |

### Error Timeline
- **14:23** — First "connection pool exhausted" error
- **14:25** — Timeout errors begin (likely cascading)
- **14:30** — Application exceptions start appearing
- **14:52** — Error rate returns to baseline

### Log Gaps
- <any identified gaps, or "No gaps detected">

### Correlation
- <assessment of whether log findings match the reported incident symptoms>
```

## Guardrails

- This skill is **read-only** — never modify, delete, or rotate logs
- **Summarize, don't dump** — limit output to key findings and representative excerpts, not raw log streams
- If logs contain **sensitive data** (credentials, API keys, PII, session tokens): flag the finding but do **NOT** reproduce the sensitive content in the output
- If logs are unavailable (service down, permissions issue, retention expired): report this as a finding, not a failure
- Always include the log source and time range so findings can be independently verified
- If the time range returns more than 10,000 entries, summarize patterns rather than listing individual lines
- Never make causal claims — use "correlates with" or "appears related to" rather than "caused by"

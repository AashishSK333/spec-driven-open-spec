---
name: notification
description: Send structured notifications via Slack or email with urgency-based routing and rate limiting.
metadata:
  author: it-support-team
  version: "1.0"
  autonomy_level: 2
  requires_approval: true
---

Send notifications to Slack channels or email recipients with structured formatting, urgency-based routing, and appropriate approval controls. This is a **write operation** that sends messages externally.

**Input:** Notification channel (Slack channel name or email address), message content, and urgency level (`routine` | `important` | `critical`).

## Steps

### 1. Determine notification target

- If a specific channel/recipient is provided, use it
- If not, determine the target from `config/framework.yaml` notification settings:
  - **Critical**: Use `#major-incidents` channel + mention on-call contact
  - **Important**: Use default team channel (e.g., `#it-support`)
  - **Routine**: Use default team channel without mention

### 2. Format the message

Structure the notification for clarity:
- **Subject/Header**: Brief summary (1 line)
- **Context**: Incident ID, affected system, priority (if applicable)
- **Details**: Key findings or action items (bulleted, concise)
- **Action Required**: What the recipient needs to do (if anything)
- **Source**: "Sent by IT Support Agent" attribution

Format guidelines:
- Keep messages under 500 characters for Slack
- Use structured formatting (bold headers, bullet points)
- Include incident ticket link if relevant

### 3. Route by urgency

**Critical** (P1 incidents, major outages):
- Post to `#major-incidents` channel
- Mention on-call: `@on-call` or configured on-call handle
- Also send email to incident commander distribution list
- Include: affected systems, current status, immediate actions needed

**Important** (P2 incidents, SLA at risk, escalations):
- Post to team channel (e.g., `#it-support`)
- Include: ticket ID, summary, what attention is needed

**Routine** (status updates, morning check reports, FYI):
- Post to team channel without mentions
- Include: summary, link to full report/ticket

### 4. Check rate limits

Before sending:
- Count notifications sent to this channel in the last hour
- If at or near the rate limit (10 per hour per channel): consolidate with recent messages or defer
- For critical urgency: rate limit is relaxed (max 30 per hour)

### 5. Send notification

- **At L1**: Draft the message and present it for human review — do NOT send
  - Display: `[YOU SEND] Post to <channel>: <message preview>`
- **At L2+**: Send routine and important notifications automatically
- **Critical notifications**: Send automatically at L2+ but also present for visibility
- Use the appropriate MCP: Slack MCP for channels, email MCP for email addresses

## Output

```
## Notification Sent

| Field       | Value                    |
|-------------|--------------------------|
| Channel     | <channel or recipient>   |
| Urgency     | <routine/important/critical> |
| Sent At     | <timestamp>              |
| Status      | <Sent / Drafted for review / Rate limited> |

### Message Preview
<formatted message content>
```

## Guardrails

- **At L1**: Always draft and present — never send automatically
- **At L2+**: Send routine notifications automatically; critical notifications are sent but also surfaced for visibility
- **NEVER send to external recipients** (outside the organization) without explicit human approval — even at L4
- **NEVER include sensitive data** in notifications: credentials, PII, API keys, connection strings, passwords
- **Rate limit**: Maximum 10 notifications per hour per channel (30 for critical urgency)
- If a notification fails to send: report the failure, do NOT silently retry more than once
- **NEVER use @here or @channel** for routine notifications — reserve broadcast mentions for critical urgency only
- Always include agent attribution: "Sent by IT Support Agent" so recipients know the source
- Email notifications always include the sender as "IT Support Agent <noreply@...>" — never impersonate a human

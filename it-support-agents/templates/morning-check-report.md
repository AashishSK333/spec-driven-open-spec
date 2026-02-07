# Morning Check Report

**Date**: {{DATE}}
**Operator**: {{OPERATOR}}
**Check Window**: {{START_TIME}} — {{END_TIME}}
**Overall Status**: {{OVERALL_STATUS}}

---

## Summary

| System Group | Status | Issues | Trend |
|-------------|--------|--------|-------|
| Production Servers | {{PROD_STATUS}} | {{PROD_ISSUES}} | {{PROD_TREND}} |
| Databases | {{DB_STATUS}} | {{DB_ISSUES}} | {{DB_TREND}} |
| Network | {{NET_STATUS}} | {{NET_ISSUES}} | {{NET_TREND}} |
| Security | {{SEC_STATUS}} | {{SEC_ISSUES}} | {{SEC_TREND}} |

**Status Key**: GREEN = All checks pass | AMBER = Warning threshold exceeded | RED = Critical threshold exceeded or service down

**Trend Key**: stable = No change from yesterday | up = Metric increasing | down = Metric decreasing

---

## RED Findings (Immediate Action Required)

### {{RED_FINDING_1_TITLE}}
- **System**: {{SYSTEM}}
- **Check**: {{CHECK_TYPE}}
- **Current Value**: {{VALUE}}
- **Threshold**: {{THRESHOLD}}
- **Since**: {{SINCE_WHEN}}
- **Recommended Action**: {{ACTION}}
- **Incident Created**: {{INCIDENT_ID}} (or "Pending human approval")

---

## AMBER Findings (Monitor)

### {{AMBER_FINDING_1_TITLE}}
- **System**: {{SYSTEM}}
- **Check**: {{CHECK_TYPE}}
- **Current Value**: {{VALUE}}
- **Threshold**: {{THRESHOLD}}
- **Consecutive Days**: {{CONSECUTIVE_DAYS}}
- **Note**: {{NOTE}}

---

## Comparison with Yesterday

| Metric | Yesterday | Today | Change |
|--------|-----------|-------|--------|
| RED findings | {{YESTERDAY_RED}} | {{TODAY_RED}} | {{RED_CHANGE}} |
| AMBER findings | {{YESTERDAY_AMBER}} | {{TODAY_AMBER}} | {{AMBER_CHANGE}} |
| SLA compliance (24h) | {{YESTERDAY_SLA}} | {{TODAY_SLA}} | {{SLA_CHANGE}} |
| Open incidents | {{YESTERDAY_INCIDENTS}} | {{TODAY_INCIDENTS}} | {{INCIDENT_CHANGE}} |

---

## Checks Completed

| System | Check Type | Result | Duration |
|--------|-----------|--------|----------|
| {{SYSTEM_1}} | Connectivity | {{RESULT}} | {{DURATION}} |
| {{SYSTEM_1}} | Services | {{RESULT}} | {{DURATION}} |
| {{SYSTEM_1}} | Resources | {{RESULT}} | {{DURATION}} |

---

## Notes

{{ADDITIONAL_NOTES}}

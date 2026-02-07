# Service Dependency Map

Overview of service dependencies across the IT environment. This document should be maintained with accurate dependency information so agents and analysts can assess blast radius and identify cascading failures.

---

## How to Use This Document

When diagnosing an incident:
1. Find the affected service below
2. Check its dependencies (what it depends on) — issues there could be the root cause
3. Check its dependents (what depends on it) — those services may also be affected
4. Use this information when assessing blast radius for service restarts

**Note to team**: This document is a template. Replace the placeholder entries below with your actual service architecture. Keep this updated when services are added, removed, or their dependencies change.

---

## Service Dependency Overview

```
[User-Facing Applications]
        │
        ├── Web Application ──────┬── API Gateway ──────┬── User Auth Service
        │                         │                      ├── Payment Service
        │                         │                      └── Notification Service
        │                         │
        │                         └── Database Cluster ──┬── Primary DB
        │                                                └── Replica DB
        │
        ├── Internal Portal ──────┬── API Gateway (shared)
        │                         └── LDAP / Active Directory
        │
        └── Mobile App ───────────┬── API Gateway (shared)
                                  └── Push Notification Service
```

---

## Service Details

### Web Application
- **Type**: User-facing web application
- **Criticality**: Business-critical
- **Hosting**: `prod-web-01`, `prod-web-02` (load balanced)
- **Depends on**: API Gateway, Database Cluster, CDN, DNS
- **Depended on by**: End users, Mobile App (shared API)
- **Owning team**: Web Platform

### API Gateway
- **Type**: Application middleware
- **Criticality**: Business-critical
- **Hosting**: `prod-api-01`, `prod-api-02` (load balanced)
- **Depends on**: User Auth Service, downstream microservices, DNS
- **Depended on by**: Web Application, Internal Portal, Mobile App
- **Owning team**: API/Backend

### Database Cluster
- **Type**: PostgreSQL / MySQL (specify your DB)
- **Criticality**: Business-critical
- **Hosting**: `prod-db-01` (primary), `prod-db-02` (replica)
- **Depends on**: Storage, Network
- **Depended on by**: API Gateway, all backend services
- **Owning team**: DBA

### User Auth Service
- **Type**: Authentication and authorization
- **Criticality**: Business-critical
- **Hosting**: `prod-auth-01`, `prod-auth-02`
- **Depends on**: LDAP/AD, Database, Certificate infrastructure
- **Depended on by**: All user-facing applications, VPN
- **Owning team**: Identity/Security

### Monitoring System
- **Type**: Infrastructure monitoring
- **Criticality**: Standard
- **Hosting**: `prod-monitor-01`
- **Depends on**: Network, DNS, storage
- **Depended on by**: IT Operations (alerting, morning checks)
- **Owning team**: IT Operations

---

## Placeholder Entries

> **Team action required**: Replace these with your actual services

| Service | Criticality | Hosts | Depends On | Depended On By | Owner |
|---------|-------------|-------|------------|----------------|-------|
| _Your Service 1_ | _Business-critical_ | _hostname_ | _list_ | _list_ | _team_ |
| _Your Service 2_ | _Standard_ | _hostname_ | _list_ | _list_ | _team_ |
| _Your Service 3_ | _Non-critical_ | _hostname_ | _list_ | _list_ | _team_ |

---

## Maintenance Notes

- Update this document whenever a new service is deployed or decommissioned
- Cross-reference with CMDB for authoritative CI data
- Review quarterly for accuracy
- When a service dependency changes, update the blast radius assessments

---

## Related Resources

- `knowledge/architecture/network-topology.md` — network layout
- `config/escalation-matrix.yaml` — team routing based on service ownership
- `specs/incident-management.md` — categorization based on service type

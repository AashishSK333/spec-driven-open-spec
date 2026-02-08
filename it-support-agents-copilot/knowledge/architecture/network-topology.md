# Network Topology Overview

Overview of the network architecture, segmentation, and connectivity paths. This document helps agents and analysts understand network layout when diagnosing connectivity issues and assessing impact scope.

---

## How to Use This Document

When diagnosing a network-related incident:
1. Identify which network segment the affected system is in
2. Check connectivity paths between the source and destination
3. Identify network devices in the path (firewalls, load balancers, routers)
4. Use this information for escalations to the Network Operations team

**Note to team**: This document is a template. Replace the placeholder entries below with your actual network architecture. Keep this updated when network changes are made.

---

## Network Segmentation

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Internet                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Firewall   │
                    │  (External) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────┴──────┐ ┌──┴───┐ ┌──────┴──────┐
       │    DMZ      │ │ VPN  │ │  CDN/WAF    │
       │  (Web Tier) │ │ GW   │ │  Endpoint   │
       └──────┬──────┘ └──┬───┘ └─────────────┘
              │            │
       ┌──────┴──────┐    │
       │  Firewall   │    │
       │  (Internal) │    │
       └──────┬──────┘    │
              │            │
    ┌─────────┼────────────┼──────────┐
    │         │            │          │
┌───┴───┐ ┌──┴───┐ ┌──────┴──┐ ┌────┴────┐
│ App   │ │ DB   │ │ Mgmt    │ │ User    │
│ Tier  │ │ Tier │ │ Network │ │ Network │
└───────┘ └──────┘ └─────────┘ └─────────┘
```

---

## Network Zones

### DMZ (Demilitarized Zone)
- **Purpose**: Hosts public-facing services
- **Hosts**: Web servers, reverse proxies, load balancers
- **Access**: Internet → DMZ allowed (ports 80, 443); DMZ → App Tier allowed (specific ports)
- **Security**: Restricted outbound access; no direct database access
- **Subnet**: _10.0.1.0/24 (replace with actual)_

### Application Tier
- **Purpose**: Hosts application servers, API gateways, microservices
- **Hosts**: Application servers, message queues, cache servers
- **Access**: DMZ → App Tier allowed; App Tier → DB Tier allowed; no direct internet access
- **Subnet**: _10.0.2.0/24 (replace with actual)_

### Database Tier
- **Purpose**: Hosts database servers
- **Hosts**: Database primaries, replicas, backup servers
- **Access**: App Tier → DB Tier allowed (database ports only); no internet access
- **Security**: Most restricted zone; access logged and audited
- **Subnet**: _10.0.3.0/24 (replace with actual)_

### Management Network
- **Purpose**: IT operations, monitoring, configuration management
- **Hosts**: Monitoring servers, jump boxes, configuration management, backup systems
- **Access**: Restricted to IT staff via VPN or jump box
- **Subnet**: _10.0.10.0/24 (replace with actual)_

### User Network
- **Purpose**: End-user workstations and office devices
- **Hosts**: Desktops, laptops (wired), printers, IP phones
- **Access**: User → Internet (filtered); User → App Tier (specific apps)
- **Subnet**: _10.0.20.0/24 (replace with actual)_

### VPN
- **Purpose**: Remote access for employees
- **Gateway**: _vpn.your-org.com (replace with actual)_
- **Type**: _SSL VPN / IPsec (specify)_
- **Access**: VPN users get User Network-equivalent access
- **Subnet**: _10.0.30.0/24 (replace with actual)_

---

## Key Network Devices

> **Team action required**: Replace these with your actual devices

| Device | Type | Location | Purpose | IP |
|--------|------|----------|---------|-----|
| _fw-ext-01_ | Firewall | Edge | Internet boundary | _x.x.x.x_ |
| _fw-int-01_ | Firewall | Core | DMZ/App/DB separation | _x.x.x.x_ |
| _lb-01_ | Load Balancer | DMZ | Web traffic distribution | _x.x.x.x_ |
| _sw-core-01_ | Core Switch | Data Center | Core routing | _x.x.x.x_ |
| _vpn-gw-01_ | VPN Gateway | Edge | Remote access | _x.x.x.x_ |

---

## DNS Architecture

- **External DNS**: _dns-provider (e.g., Route53, Cloudflare)_
- **Internal DNS**: _internal-dns-01, internal-dns-02_
- **Split-horizon**: Internal hosts resolve to private IPs; external resolve to public IPs

---

## Maintenance Notes

- Update this document when network changes are made (new subnets, firewall rule changes, topology changes)
- Cross-reference with CMDB for authoritative device data
- Network diagrams should be reviewed quarterly for accuracy
- Firewall rule documentation should be maintained separately by the Network team

---

## Related Resources

- `knowledge/troubleshooting/network.md` — network troubleshooting guide
- `knowledge/architecture/service-dependencies.md` — service dependency map
- `runbooks/vpn-connectivity.md` — VPN troubleshooting procedure
- `config/escalation-matrix.yaml` — network team routing

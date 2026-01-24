# Security HomeLab – Complete Setup Roadmap

![Focus](https://img.shields.io/badge/focus-security%20homelab-critical)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> *"Build the foundation once and well, and every future enhancement will be stable."*

---

## Hardware

### HP EliteDesk 800 G3 (Host machine)

- **CPU:** Intel i5-7600
- **RAM:** 16 GB DDR4
- **SSD:** 512 GB NVMe
- **Function:** Router + IDS/IPS host + Virtualization

### Network Interfaces

1. **Base NIC (LAN)** – internal network (switch, HomeLab devices)
2. **Intel NIC (WAN)** – external network (ISP ZTE router)
   - Bracket installation required for stable mounting

### Display

- No dedicated monitor → **temporarily connected to Smart TV** if needed
- Long term: **SSH + web GUI** (Proxmox, Splunk) remote management

---

## OS and Virtualization

### 1. Debian 12 (bare metal)

- This will be the **core host**, providing:
  - Router function (WAN ↔ LAN separation)
  - Suricata IDS/IPS
  - Proxmox or KVM/QEMU virtualization

**Main installation steps**:

1. Minimal install (SSH + sudo + net-tools)
2. Static IP on LAN interface
3. NAT and basic firewall setup (iptables/nftables)
4. Suricata preparation (log mode only)
5. Hostname: `darklab-gateway`

---

### 2. Proxmox (or plain KVM/QEMU)

- Virtualization under Debian
- VM management via web GUI
- Snapshot, backup, resource control → **safe testing**

**VMs to start**:

- **Parrot Security OS** – pentest / sandbox environment
- (later) Kali Linux, Honeypot (Cowrie), Windows test VM

---

## Security Stack

### 1. Suricata (IDS/IPS)

- Installation on Debian host
- **Starts in IDS mode** – traffic observation
- EVE JSON log → Splunk input
- Later: **IPS mode** – active blocking

---

### 2. Fail2ban

- Monitors SSH and Suricata logs
- Automatically BANs suspicious IP addresses
- Log events → sent to Splunk

---

### 3. Splunk (SIEM)

- Central collection and analysis of all logs
- Dashboard: attack attempts, blocked IPs, IDS alerts
- Alerts via email / mobile

---

## Network Topology (Plan)

```ini
    [ISP Router/ZTE]
             │
       (WAN NIC)
     HP EliteDesk
       (Debian12)
             │
       (LAN NIC)
             │
     [Switch / AP]
 ┌────────────┼───────┐
 │            │       │
[Home PC] [Laptop] [VMs]
(Parrot, Honeypot, test network)
```

---

## Progress Timeline

1. **Hardware assembly**
   - Intel NIC + bracket installation
   - LAN/WAN cabling verification
2. **Debian installation**
   - Router and SSH access operational
3. **Proxmox or KVM virtualization**
   - Parrot Security OS installation
4. **Suricata installation (IDS mode)**
   - Basic rule sets configuration
   - Log understanding
5. **Fail2ban integration**
   - Reacts to Suricata + SSH logs
6. **Splunk installation**
   - Log centralization, dashboard
7. **Full test**
   - e.g., nmap portscan → log and blocking monitoring

---

## Note Metadata

- **Version:** 2025-07-21
- **Update:** Debian router installation steps and Suricata IDS configuration

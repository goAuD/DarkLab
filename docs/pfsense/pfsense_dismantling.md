# pfSense Dismantling - Session Log 2025_07_08

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

**Context**: This log documents the final week of testing and decommissioning of pfSense in a HomeLab environment. It contains firewall rule changes, NAT settings, Tailscale testing, Docker diagnostics, and the reasoning behind abandoning pfSense due to persistent instability.

---

## Initial Setup and Tests

## WAN Interface manually configured

- `IPv4 static (192.168.0.39)`  

- `IPv6 via DHCP6 (enabled)`  

- `Gateway: 192.168.0.1`

## Multiple `Firewall → Rules` added

- On **LAN**: Allow `TailscaleNet` to LAN, and default allow LAN to any.

- On **Tailscale** interface: Allow from `TailscaleNet` to any.

- On **WAN**: Port forwards for `TCP 2342` (PhotoPrism) and `TCP 32400` (Plex).

- `pfBlockerNG` enabled (v4 lists, GeoIP)

- Tailscale network range clarified (`100.x.x.x`), used in aliases and rules.

- NAT outbound changed from **Hybrid** to **Automatic** temporarily, tested with `100.64.0.0/10` mapping.

---

## Persistent Issues Encountered

**Tailscale instability**:

- Constant DNS/protocol lookups on port `41641/UDP`, even when not needed.

- External network access failed via exit node.

- Tailscale-related logs still present even after container and rules removed.

**pfSense syslog problems**:

- Workaround was needed to restore logs on each boot.

- Logs showed dropped IPv6 ICMP and UDP from WAN, though not in use.

**LAN dropouts**:

- Interface `ue0` (USB Ethernet) periodically dropped under load.

- Kernel messages showed block/reload issues.

**Docker/Tailscale config conflict**:

- Duplicate tailscale containers: `tailscale/tailscale`, `docker-extension`, etc.

- Login to PhotoPrism via reverse proxy resulted in `invalid credentials`.

- `docker-compose` misconfigured or missing config file.

**Firewall rules**:

- WAN port 32400 open (OK), 2342 closed (unexpected), despite correct NAT and rules.

- Some automatic outbound rules existed (ISAKMP), but didn't resolve issues.

---

## Decision: Decommissioning pfSense

> "The pfSense-based firewall was powerful but overcomplicated for current needs."

## Reasons for decommissioning

- **Overheating laptop hardware**

- **Unstable network stack (ue0 interface)**

- **DMZ + Double NAT caused confusion and connectivity issues**

- **Too much manual patching and daily troubleshooting**

- **Not suitable for long-term 24/7 home infrastructure**

> ### System replaced with a simpler setup (Docker host remains active)

---

## Next Steps (Planned)

- Possibly revisit **WireGuard** in the future for secure remote access.

- Evaluate **used hardware firewall appliances** (e.g. Netgate or similar).

- Continue with HomeLab projects without pfSense for now.

---

## Status

- pfSense officially removed.  

- Docker operational.  

- Exit node & remote access suspended.  

- Network simplified.

## Final Conclusions and Reasons Behind the Decision

## 1. Stability Issues - Continuous Overheating

The old HP laptop (from 2017, AMD A9-9410, 2 cores) turned out to be underpowered and prone to overheating, which led to system instability.

Due to thermal issues, the system would occasionally slow down or crash entirely, disrupting continuous network services.

---

## 2. Network Interruptions - USB-LAN Adapter Instability

The pfSense WAN interface was running via a USB Ethernet adapter (AX88179 chipset), which frequently disconnected from the system (link down/up events).

This unstable USB hardware connection caused major disruptions in network connectivity.

The root cause was partially related to inconsistent USB power delivery. Attempts were made to improve the situation with USB port changes and an external powered USB hub, but no permanent fix was found.

---

## 3. ISP 5G Internet Connection Instability

The internet access was based on an ISP-provided 5G connection, which occasionally dropped due to external factors like storms or interference.

This type of instability was outside the system’s control and difficult to mitigate, especially given the limitations of the old pfSense laptop setup.

---

## 4. Tailscale Performance - Stable but Not a Hardware Firewall Replacement

Tailscale VPN continues to work flawlessly across all clients, which is great.

However, Tailscale cannot replace the physical firewall/router in terms of stability, performance, and comprehensive network features.

While Tailscale remains a key part of the overall network security model, a physical firewall is still necessary to ensure baseline protection.

---

## 5. Workarounds and Their Limitations

Using an external USB hub and switching USB ports helped reduce adapter dropouts but didn’t solve the issue completely.

Although pfSense remained functional, the laptop’s limited performance prevented optimal operation of certain services.

Additionally, even after updates or reinstallations, the system experienced periodic reboots, which is unacceptable for an always-on infrastructure.

---

## 6. The Decision to Decommission the Laptop

Given all the issues above, the safest and most effective choice was to remove the laptop from the critical network infrastructure.

This resolved most of the instability, although it required reorganizing parts of the HomeLab environment.

Tailscale now handles secure remote access and basic network segmentation, but acquiring a dedicated, stable router is the next key milestone.

---

## Summary Table

| Problem                         | Root Cause                                | Workaround & Result                           | Final Decision                        |
|----------------------------------|--------------------------------------------|-----------------------------------------------|----------------------------------------|
| Overheating                     | Old laptop, insufficient cooling           | No reliable fix; system crashes or reboots    | Decommissioned the laptop              |
| USB Ethernet Adapter Instability | Weak USB power, hardware limitation        | Port changes, powered USB hub                 | Not stable enough for long-term use    |
| 5G Internet Instability         | External ISP-related issues                | Tailscale exit node as workaround             | Need for reliable hardware             |
| System Stability                | Limited CPU performance, overheating       | Frequent reboots and errors                   | Removed from the network               |

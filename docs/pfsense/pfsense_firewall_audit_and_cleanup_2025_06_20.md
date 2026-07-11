# Firewall Audit and Cleanup 2025|06|20

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

During troubleshooting and system hardening of the pfSense setup, I performed an extensive audit and cleanup of firewall rules and network gateways. Here’s what happened:

---

## Suspicious Rules Identified

Found two unknown rules under LAN:

- One IPv6 rule allowing all traffic.

- One IPv4 rule with no description and unknown origin.

> Removed both via WebGUI by disabling them.

---

## Outcome: All services remained operational after removal

- Confirmed that these rules were unnecessary.

> **IPv6 Disabled**

---

## My network does not use IPv6, so allowing IPv6 traffic was

- Useless for internal routing.

- Potentially dangerous as an unmonitored path.

> **Disabled:**

- IPv6 rule from LAN.

> (Optional: full IPv6 disabling under System → Advanced → Networking)

---

## WAN Gateway Issues Fixed

> **Problem: pfSense could not reach the upstream gateway (192.168.0.1)**
> **Cause: the WAN interface’s gateway field was blank (read-only).**
> **Solution: manually corrected the upstream gateway setting.**

After reboot:

- Internet access restored.

- dpinger stopped reporting sendto error: 65.

> Gateway misconfiguration was blocking all WAN-bound traffic temporarily.

---

## pfBlockerNG Optimized

Enabled TLD (Top-Level Domain) processing - this sped up DNSBL lookups.

Side effect: higher CPU usage.

DNSBL services restarted cleanly:

- DNSBL web server

- parser daemon

- filterlog daemon

- Removed extra cron entries to reduce overhead.

---

## Final result: pfBlockerNG now runs more efficiently

### Firewall Filter and Logs

The pfBlockerNG Firewall Filter Service restarted multiple times.

### Some entries like

- Firewall Filter Service stopped

- filterlog daemon stopped
were normal during configuration reloads.

Added description to rules to improve maintainability.

---

### Final State

> All active firewall rules now have a clear purpose.

Removed and disabled:

- Obsolete IPv6 allow rule

- Unused legacy IPv4 rule

- pfSense reports stable WAN link and restored connectivity.

- DNS and pfBlockerNG performance optimized.

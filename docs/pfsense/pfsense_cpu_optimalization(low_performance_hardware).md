# pfSense CPU Optimalization (Low-Performance Hardware)

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

---

My pfSense system runs on an older AMD dual-core laptop (2017 or older), so minimizing unnecessary CPU usage is critical. These settings help reduce overhead and improve responsiveness without sacrificing essential functionality.

---

## System tunables (under **System > Advanced > System Tunables**)

The following values are either already optimized in pfSense 2.8.0 or can be explicitly checked and set:

| Tunable Name                     | Recommended Value | Description |
|----------------------------------|-------------------|-------------|
| `kern.pti`                       | `0` *(disabled)*  | Disables Kernel Page Table Isolation (PTI). Recommended for older CPUs for performance, unless high security required. |
| `net.inet.tcp.syncookies`        | `1`               | Enables SYN cookies to prevent SYN flood attacks with minimal CPU overhead. |
| `net.inet.tcp.drop_synfin`       | `1`               | Drop suspicious SYN+FIN packets (common in scans). |
| `net.inet.ip.redirect`           | `0`               | Disable sending IP redirects. |
| `net.inet.icmp.icmplim`          | `50` or lower     | Limits ICMP rate (e.g., ping flood). |
| `net.link.bridge.pfil_onlyip`    | `1`               | Filter only IP packets on bridges (saves CPU). |
| `net.link.bridge.pfil_member`    | `0`               | Avoid redundant filtering on bridge members. |
| `net.inet.tcp.rfc1323`           | `0`               | Disables TCP window scaling — optional, may help older devices. |
| `net.inet.tcp.tso`               | `0`               | Disable TCP segmentation offloading if using USB NICs or buggy drivers. |

---

## Disable unnecessary services (in **Services** or **Interfaces** sections)

You should disable features you don't actively use:

- **UPnP**: `Services > UPnP & NAT-PMP` → Uncheck “Enable UPnP & NAT-PMP”

- **Captive Portal**: `Services > Captive Portal` → Disable any active zone.

- **Traffic Shaper**: `Firewall > Traffic Shaper` → Remove or avoid setting up shapers.

- **IPv6 Router Advertisements**: `Interfaces > LAN > Router Advertisements` → Set to "Disabled"

- **IPv6** entirely (optional): `Interfaces > WAN/LAN > Static IPv6 Configuration` → Set IPv6 Configuration Type to "None"

---

## Additional Suggestions

- Disable unused **interfaces** and **bridges**.

- Use **lightweight packages** only (avoid pfBlockerNG or Snort on low CPU).

- Regularly monitor system load via **Status > System Logs > System Activity**.

- Avoid running unnecessary **DNSBL**, **GeoIP** or **deep packet inspection** functions.

---

These optimizations have significantly reduced random CPU spikes and unnecessary ARP traffic in my home lab. Stability and responsiveness improved especially under typical loads (streaming, LAN routing, Plex, Tailscale, etc.).

> **Keeping pfSense and FreeBSD Updated (The Safe Way)**

---

## Should You Manually Update FreeBSD on pfSense?

**No — never update FreeBSD manually on a pfSense system.**  
Although pfSense is based on FreeBSD, it's a heavily customized and integrated system. Manual updates using tools like `freebsd-update` or `pkg upgrade` can break critical components of pfSense, such as:

- The web interface (GUI)

- Firewall rules and NAT

- Package manager compatibility (e.g. pfBlockerNG, Suricata, etc.)

---

## How to Properly Update pfSense (and FreeBSD)

> **Always use the **built-in pfSense update mechanism** to ensure compatibility and stability.**

### Steps to Update

1. Log in to the pfSense Web UI (e.g. `https://192.168.1.1`)

2. Go to:  
   `System` → `Update` → `Update Settings`  

   - Make sure the **Branch** is set to: `pfSense CE Latest` (or `pfSense Plus` if applicable)

3. Then go to:  
   `System` → `Update` → `System Update`

4. If an update is available, click **"Confirm"** to proceed.

5. The system may reboot after the update.

> This process updates both the FreeBSD base and pfSense components in a coordinated, safe way.

---

### How Often Should You Update?

- **Every 2-3 months**: Check for new versions manually

- **Immediately** if a **security update** is announced

- **When** you need bug fixes or new features

---

### Do *NOT* Run These Commands on pfSense

```sh
freebsd-update fetch
freebsd-update install
pkg update
pkg upgrade
```

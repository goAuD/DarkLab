# pfBlockerNG Setup and Optimization - Summary

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

## Installation

- Installed `pfBlockerNG-devel` via the pfSense Package Manager.

- After the wizard completed, we manually adjusted the key modules:

  - `DNSBL` (domain-based blocking)

  - `IPv4` (IP-based blacklists)

  - `GeoIP` (country-based IP filtering)

---

## Core Settings

- **DNS Resolver (Unbound)** is enabled.

- In `System > General Setup`, we **did not define external DNS servers** (like 8.8.8.8).

- DNS field is left empty or set to `127.0.0.1`.

- `Allow DNS server list to be overridden by DHCP/PPP on WAN` is **disabled**.

---

## DNSBL

- Activated the `StevenBlack_ADs` list (over 202,000 blocked domains).

- SafeSearch feature is currently disabled.

- Whitelist includes: `localhost.localdomain`.

---

## GeoIP

- Successfully downloaded and processed MaxMind GeoLite2 database.

- Continent and country-specific IP data was generated.

- Created a GeoIP blocking list:

  - Named `Block_RU_CN`, using `Deny Inbound` action for **Russia (RU)** and **China (CN)**.

---

## IP Blacklists (IPv4)

Active lists and number of blocked IPs:

| List name         | IP count | Notes                        |
|-------------------|----------|-------------------------------|
| CINS_army_v4      | 12,240   | Honeypot attacker IPs         |
| ET_Block_v4       | 1,470    | Emerging Threats blocklist    |
| ET_Comp_v4        | 438      | Supplementary ET list         |
| Spamhaus_Drop_v4  | 5        | Very reliable blacklist        |
| ISC_Block_v4      | 2        | Internet Storm Center         |
| Abuse_SSLBL_v4    | 1 (dummy)| Empty - to be removed       |
| Abuse_Feodo_C2_v4 | 1 (dummy)| Empty - to be removed       |
| Talos_BL_v4       | Error | Removed due to 403 failure  |

> All IP lists use `Deny Inbound` mode.

---

## Recommended IP Lists Added

| List name         | Source URL                                                              | Notes                         |
|-------------------|-------------------------------------------------------------------------|-------------------------------|
| Blocklist_de_all  | `https://lists.blocklist.de/lists/all.txt`                              | Attacker IPs from honeypots   |
| DShield           | `https://feeds.dshield.org/block.txt`                                   | Requires `+3` header lines    |
| FireHOL_Level1    | `https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset` | Trusted, low false positives |

---

## Updates & Issues

- Lists are refreshed automatically via `CRON`.

- `Talos_BL_v4` failed with 403 Forbidden and was removed manually.

- `Sanity Check FAILED`: minor 1-IP mismatch due to dummy IP (not critical).

---

## Top Spammers

- The `Top Spammers` list became available after GeoIP update.

- Can be safely blocked entirely using `Deny Inbound` mode.

- No false positives reported.

---

## Overall Status

- pfBlockerNG is running **smoothly and effectively**.

- Over **14,000 IPs** blocked via IPv4 blacklists.

- Over **202,000 domains** blocked via DNSBL.

- Country-specific GeoIP blocking is active (RU and CN).

---

**Next possible steps:**

- Enable SafeSearch

- Refine Whitelist settings

- Activate Top Spammers list

- Export config for backup or automation

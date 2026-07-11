# Network Topology - 2025 Summer Edition

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

## 1. ISP Router

- Acts as the upstream connection to the internet.

- Either in bridge mode or with DMZ pointing to pfSense.

- Connected via Ethernet to the pfSense WAN interface.

## 2. pfSense (running on an old laptop)

- Serves as the main router and firewall.

- Interfaces:

  - **WAN** → connected to ISP router.

  - **LAN** → connected to local network via a switch.

- Provides:

  - DHCP and DNS for the LAN.

  - NAT, port forwarding, and firewall rules.

  - Future plans: pfBlockerNG, Tailscale subnet routing.

## 3. LAN Switch

- Connected to the pfSense LAN port.

- Distributes LAN connectivity to wired devices and access points.

## 4. Devices connected to the switch

- **PC (Windows 11 Pro)**

  - Hosts Plex Media Server and PhotoPrism (via Docker/Portainer).

  - Also used for general administration and monitoring.

- **ZTE Router (WLAN Access Point Mode)**

  - Provides Wi-Fi only (DHCP disabled).

  - Connected via Ethernet to the switch.

## 5. Devices connected via Wi-Fi (through ZTE AP)

- Smartphones

- Tablets

- Smartwatch

- Nokia streaming box

- HP printer

- IoT gadgets

## Traffic Flow Summary

[Internet] → [ISP Router] → [pfSense WAN] → [pfSense LAN] → [Switch] → [PC / AP] → [Wi-Fi tools]

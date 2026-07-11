# Equipment Overview 2025

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

## Workstations and Servers

## MSI Thin 15 B12UC laptop

- CPU: Intel Core i5 (12th generation)  

- RAM: 32 GB  

- VGA: Nvidia RTX 3050  

- Storage: 1 TB NVMe SSD  

- OS: Fedora Linux  

- Purpose: Learning system administration, network simulations, monitoring

---

## Windows 11 Pro PC (main server):

- CPU: Intel Core i7-8700K  

- RAM: 32 GB  

- VGA: Nvidia RTX 3060 Ti  

- Storage: 2× 1 TB NVMe SSD, 1 TB HDD  

- Roles: Plex + Tailscale media server, planned NGINX web server

---

## HP 15-ba106ng laptop (pfSense router):

- CPU: AMD A9-9410  

- RAM: 8 GB  

- Storage: 1 TB HDD  

- OS: pfSense (fresh install, in configuration)  

- Roles: Firewall, DHCP, NAT, VLAN, port forwarding, VPN (WireGuard planned)  

---

## Network

- Netgear GS308E managed switch (8 ports)  

- UNI USB-Ethernet adapter for HP laptop  

- ISP Routers:  

  - ZTE MC888A Ultra (5G, main internet)  

  - ZTE H338A (4G, backup)

---

## Mobile Devices

- iPhone 11 (static public IP, uses Tailscale)  

- Samsung tablet (Android 14, media playback, remote access)  

---

## Backup and Security

- Using pfSense Firewall

- Weekly full system backup

- Planning incremental backups  

- Documents on OneDrive for mobile access  

- Plexamp + Tailscale used during commutes for music  

- Tailscale exit node automatically enabled on iPhone for public network security  

---

## Planned Developments

- Set up NGINX web server on Windows  

- Create basic static website for portfolio/monitoring  

- Finish pfSense full configuration  

- Update automation with Ansible

- Docker installation with Photoprism for photo cataloging and secure, remote access from mobile

- Planning Wake-on-LAN and remote server control automation

---

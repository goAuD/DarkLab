# Headless Debian Installation & Initial Setup

## Installation (Balena Etcher / Rufus)

1. Download Debian ISO: https://www.debian.org/distrib/
2. Flash it to USB using Balena Etcher or Rufus
3. Boot into the installer → Choose `Graphical Install`
4. Language: English (recommended)
5. Location: Austria (or your country)
6. Hostname: goaudd (or your choice)
7. Domain: local (or blank)
8. Set root password & create user

## Partitioning

- Use: `Guided - use entire disk`
- Enable swap unless low on RAM

## Software Selection

- Uncheck GUI/Desktop Environment
- Check only:
  - [x] SSH server
  - [x] standard system utilities

## First Boot (from another PC via SSH)

```bash
ssh youruser@<LAN IP>
```

---

## Update & Upgrade System

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Recommended Tools

```bash
sudo apt install -y curl sudo rsyslog ufw tailscale fail2ban
```

---

## Enable UFW Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
sudo ufw status verbose
```

---

## Enable IP forwarding (if needed)

```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Ready for:

    Secure remote access

    Tailscale exit node

    Web server / reverse proxy

    Hosting WASD platform

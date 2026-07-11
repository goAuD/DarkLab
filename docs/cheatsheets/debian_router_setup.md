# Debian Router Setup - Security HomeLab

![Platform](https://img.shields.io/badge/platform-debian-red)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> *"If the foundation is stable, every module built on top will be secure."*

---

## Goal

- HP EliteDesk (Debian 12) operates as **router** and **IDS host**
- WAN/LAN separation between the two NICs
- Basic firewall and NAT setup
- Suricata IDS preparation

---

## 1. Hardware Check

1. **Intel NIC + bracket installation** in the HP EliteDesk
2. Connections:
   - WAN (external): Intel NIC → ISP router (ZTE)
   - LAN (internal): base NIC → switch / AP
3. Temporary display: **Smart TV** or after SSH installation

---

## 2. Debian 12 Installation (bare metal)

1. Download the **Debian 12 netinstall ISO**
   → https://www.debian.org/distrib/netinst
2. Installation:
   - Minimal install (no GUI)
   - Select **"SSH server"** and **"Standard system utilities"** packages
   - Create **sudo user** (e.g., `viktor`)
3. After first boot, update:

   ```bash
   sudo apt update && sudo apt full-upgrade -y
   ```

---

## 3. NIC Identification

1. View network interface names:

```bash
ip a
```

2. Example:

- Intel NIC (WAN): enp3s0

- Base NIC (LAN): enp1s0

---

## 4. Static IP Setup (LAN)

1. Edit the netplan or interfaces file:

```bash
sudo nano /etc/network/interfaces
```

2. Configuration example:

```ini
auto enp1s0
iface enp1s0 inet static
  address 192.168.10.1
  netmask 255.255.255.0

auto enp3s0
iface enp3s0 inet dhcp
```

3. Restart networking:

```bash
sudo systemctl restart networking
```

---

## 5. NAT and Firewall

1. Enable IP forwarding:

```bash
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

2. Install iptables (if not present):

```bash
sudo apt install iptables-persistent -y
```

3. Basic NAT rule:

```bash
sudo iptables -t nat -A POSTROUTING -o enp3s0 -j MASQUERADE
sudo netfilter-persistent save
```

## 6. DHCP Server (LAN client side)

Configure dnsmasq or isc-dhcp-server for DHCP on the LAN interface.

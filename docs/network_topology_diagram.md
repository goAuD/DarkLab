# Network Topology Diagram - Security DarkLab

## Main components

> ISP Router/ZTE (WAN)

> HP EliteDesk (Debian router + Suricata) - WAN/LAN separation

> LAN Switch/AP - internal network

> VMs - on Proxmox (Parrot, Honeypot, Windows, etc.)

```ini

            Internet
                 │
            [ISP Router]
                 │
         (WAN NIC - Intel)
          HP EliteDesk 
      (Debian Router + IDS)
                 │
         (LAN NIC - on-board)
                 │
         ┌───────┴─────────┐
         │                 │
     [Switch/AP]        [Proxmox]
         │                 │
  ┌──────┼────────┐     ┌──┴─────────────┐
  │      │        │     │                │
Home  Windows   Laptop  Parrot        Honeypot
PC    Admin     (mobile Security OS    (Cowrie)
      Laptop     device)    VM             VM
```

## Diagram notes

HP EliteDesk → central router + Suricata IDS/IPS host

Proxmox → VMs (Parrot, Honeypot, test Windows, etc.)

Switch/AP → internal network devices (Home PC, Laptop, Smart TV, etc.)

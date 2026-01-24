# 🔁 SSH Cross Access Fedora ↔ Windows 11 Pro

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/💬_Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)  
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1">
  <a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a>
</div>

---

The goal: establish secure, key-based SSH access between two devices running different operating systems, **in both directions**.

✍️ Author: Viktor Halupka  
🗓️ Updated: 14-07-2025  
📄 Version: v1.0

---

## 🖧 Topology

```ini
MSI Laptop (Fedora 40)
      ↕  SSH over LAN (custom port)
Windows 11 Pro PC
```

---

## ⚙️ Environment Overview

| Component            | Fedora (MSI laptop) | Windows 11 Pro (PC) |
|---------------------|---------------------|----------------------|
| Hostname            | `goaudF`            | `myhomelabpc`        |
| LAN IP Address      | `192.168.X.X`       | `192.168.X.X`        |
| SSH Port            | default `22`        | custom `PORTXXXX`    |
| SSH User            | `goaud`             | `goaud`              |
| Shell               | `/bin/bash`         | native               |

---

## 🧩 Prerequisites

### Fedora side (MSI laptop)

- SSH client (usually pre-installed)
- SSH key pair (`~/.ssh/id_ed25519`)
- Either LAN IP or Tailscale IP of the Windows PC

### Windows side (Win11pro PC)

- OpenSSH Server installed and enabled
- A listening port (e.g., `PORTXXXX`) opened in Windows Defender Firewall
- `authorized_keys` properly placed in `C:\Users\USERNAME\.ssh\`
- Proper permissions (Windows sometimes needs reboots or logouts)

---

## 🚀 Fedora → Windows (SSH from Fedora)

### 1. Generate SSH key on Fedora

```bash
ssh-keygen -t ed25519 -C "fedora-to-win"
```

> - Public key: `~/.ssh/id_ed25519.pub`  
> - Private key: `~/.ssh/id_ed25519`

---

### 2. Transfer the public key to Windows

Paste the full content of `id_ed25519.pub` into:

```
C:\Users\<your_windows_user>\.ssh\authorized_keys
```

If the folder doesn't exist, create it manually.  
Use PowerShell if needed:

```powershell
New-Item -Path "$env:USERPROFILE\.ssh" -ItemType Directory -Force
New-Item -Path "$env:USERPROFILE\.ssh\authorized_keys" -ItemType File -Force
```

---

### 3. Test SSH connection from Fedora

```bash
ssh -p PORTXXXX goaud@192.168.X.X
```

✅ Success: You should log in **without being prompted for a password**.

---

## 🔁 Windows → Fedora (Reverse SSH)

### 1. Generate SSH key on Windows

In PowerShell:

```powershell
ssh-keygen -t ed25519 -C "win-to-fedora"
```

> Public key will be located at:  
> `C:\Users\<USERNAME>\.ssh\id_ed25519.pub`

---

### 2. Add public key to Fedora

On the Fedora machine:

```bash
mkdir -p ~/.ssh
cat /path/to/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Double-check permissions! SSH will refuse access otherwise.

---

### 3. Restart SSH service (if needed)

```bash
sudo systemctl restart sshd
```

---

### 4. Test SSH connection from Windows

```powershell
ssh -p 2222 goaud@192.168.X.X
```

✅ You should log in without password.

---

## 🖼️ Screenshot: Cross SSH Test

<img src="https://raw.githubusercontent.com/goAuD/TrustMindLab/main/assets/img/cross_ssh.jpg" alt="SSH connection success" width="350">

---

## 📘 Lessons Learned

- ⚠️ **Username is case-sensitive** – `goaud` ≠ `Goaud`
- 🧨 Fedora initially failed because `/usr/bin/zsh` was missing
- 🔐 Incorrect key permissions (`600` required) caused silent SSH failures
- 🌐 It works across LAN **and** via Tailscale private network

---

## 📎 SSH Cheat Sheet

| Command | Purpose |
|--------|---------|
| `ssh-keygen -t ed25519 -C "label"` | Create key pair |
| `ssh-copy-id user@host`           | Copy key to remote host |
| `ssh -i ~/.ssh/id_ed25519 user@host` | Use custom key |
| `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys` | Secure permissions |
| `sudo systemctl status sshd`      | Check SSH service |
| `sudo systemctl restart sshd`     | Restart SSH service |

---

✅ You now have fully working **cross-SSH access** between Fedora and Windows 11.  
Ready for scripting, system management, and remote access tasks.  

---

# Fedora + NVIDIA Akmods Guard

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)  
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1">
  <a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a>
</div>

A lightweight, scriptable safeguard for Fedora users running proprietary NVIDIA drivers with akmods, preventing sudden kernel upgrades from breaking boot or graphics support.

---

## Overview

This setup prevents Fedora from automatically upgrading the kernel beyond your current working version. It also monitors `akmods` availability and can alert you (via log) if the kernel module isn't ready yet. It includes scripts to lock/unlock the kernel and a cron-based monitor to alert for missing modules.

---

## Kernel Version Lock

We use `dnf versionlock` to pin the current kernel and its related packages:

```bash
sudo dnf versionlock add kernel kernel-core kernel-modules kernel-modules-extra
```

To unlock (e.g. before a controlled update):

```bash
sudo dnf versionlock delete kernel kernel-core kernel-modules kernel-modules-extra
```

---

## Scripts

### 1. `versionlock-kernel.sh`

```bash
#!/bin/bash
# Locks current kernel version
sudo dnf versionlock add kernel kernel-core kernel-modules kernel-modules-extra
```

### 2. `unlock-kernel-version.sh`

```bash
#!/bin/bash
# Removes version lock
sudo dnf versionlock delete kernel kernel-core kernel-modules kernel-modules-extra
```

### 3. `check_akmods.sh`

```bash
#!/bin/bash
# Checks if akmods are present for current kernel
LOG=~/.akmods-check.log
date "+%Y. %b. %d., %A, %T %Z:" >> "$LOG"
if ! rpm -q kmod-nvidia > /dev/null; then
  echo "akmods not yet available." >> "$LOG"
else
  echo "akmods present." >> "$LOG"
fi
```

---

## Cron Setup

You can set up a cron job to check every 15 minutes:

```bash
crontab -e
```

Then add:

```cron
*/15 * * * * ~/bin/check_akmods.sh
```

Make sure your script is executable:

```bash
chmod +x ~/bin/check_akmods.sh
```

---

## Logs

Script logs to:

```bash
~/.akmods-check.log
```

---

## Optional: GUI Cron (not recommended)

Fedora 43 has no maintained GUI cron tools. Use `crontab -e` instead.

---

## Recommended Use

- Run `versionlock-kernel.sh` after NVIDIA setup works.
- Use `check_akmods.sh` in cron to monitor module readiness.
- When ready to upgrade: run `unlock-kernel-version.sh`, update, reboot, re-lock.

---

## Future Improvements

- Email or desktop notification for akmod failure
- systemd-timer alternative to cron
- Integration with `dnf upgrade` script

---

## Contributions welcome!

Fork or pull request via: [https://github.com/goAuD/DarkLab](https://github.com/goAuD/DarkLab)

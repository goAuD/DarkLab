# pfSense Disaster Recovery Guide

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

---

In a critical failure scenario (e.g. failed update, hardware corruption, misconfiguration), it is important to be able to **fully recover your pfSense system** quickly — ideally within minutes. Below is a set of recommended methods and a backup strategy designed for a home lab environment.

---

## Components of a Full Backup Strategy

| Component       | Method                                  | Frequency        |
|----------------|------------------------------------------|------------------|
| System Image    | Clonezilla disk image                   | Weekly or Monthly |
| Configuration   | pfSense XML backup (via Web UI)         | After every change |
| Diagnostics     | PRTG monitoring system                  | Ongoing           |

---

## Method 1: Full Disk Image Backup with Clonezilla (Recommended)

**Why**: Clonezilla creates a full, bootable disk image, allowing you to restore pfSense with all packages (e.g. pfBlockerNG, DNSBL, GeoIP, Tailscale, etc.) and settings intact.

---

### Requirements

- Clonezilla Live USB: https://clonezilla.org/clonezilla-live.php

- External USB drive or second USB stick (as destination)

- Keyboard and screen attached to pfSense device (e.g. laptop)

---

### Steps

1. Gracefully shut down pfSense (`Diagnostics > Halt System`)

2. Boot from the Clonezilla Live USB stick

3. Select `device-image` mode → `savedisk`

4. Choose your external storage as the backup destination

5. Confirm and create full disk image

6. Store this safely (optionally versioned by date)

### Restore

- Boot Clonezilla again → `restoredisk` → select image → restore to the same disk

---

## Method 2: Manual Disk Image with `dd` (Advanced)

You can use the FreeBSD `dd` command to make a raw copy of the disk.

```sh
dd if=/dev/ada0 of=/mnt/usb/pfsense_backup.img bs=1M
```

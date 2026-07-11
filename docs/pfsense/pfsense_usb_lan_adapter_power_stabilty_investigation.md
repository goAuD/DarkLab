# USB Power Stability Investigation (pfSense USB-LAN Adapter)

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

## Goal

To diagnose and fix the unstable USB-LAN connection (AX88179) on a pfSense router running on an older laptop, which was randomly dropping the LAN interface.

---

## Symptoms

- Frequent `ue0: link state changed to DOWN/UP` messages in system logs.

- `php-fpm /rc.linkup` events triggered continuously.

- `DEVD Ethernet detached/attached` events suggesting the interface was being hotplugged.

- Internet drops with no automatic recovery.

---

## Investigation Steps

### 1. Check USB Device State with `usbconfig`

Command:

```bash
usbconfig
# Example output:
ugen1.4: <AX88179 Gigabit Ethernet ASIX Electronics Corp.> at usbus1, cfg=0 md=HOST spd=HIGH (480Mbps) pwr=ON (100mA)
```

---

#### Key observations

- spd=HIGH → indicates USB 2.0 mode (480 Mbps).

- pwr=ON (100mA) → relatively low power draw.

- Device was getting power but still disconnecting under load.

---

### 2. Switched to Another USB Port

- The adapter was physically moved to another USB port (from the left to the right side).

- The previously used port may have been damaged (due to a drop).

Result: connection became stable.

---

### 3. Added a Powered USB Hub

Introduced an external powered USB hub (VIA Labs VL813 chipset).

#### Purpose

- Delivers stable 5V power independently of the laptop’s USB rail.

- Offloads power delivery from the potentially degraded USB controller.

- Improves overall connection stability.

---

### 4. Disabled USB Suspend in FreeBSD

To prevent the OS from putting the USB interface into suspend mode:

File:

```bash
/boot/loader.conf.local
```

#### Added line

```sh
hw.usb.no_suspend=1
```

> This disables automatic USB power management that could cause disconnections due to idle suspend behavior.

#### Result

- The USB Ethernet adapter has remained stable since the above fixes.

- No more ue0 link flapping in the logs.

- Connection stays alive even overnight.

- pfSense operates as expected without interface drops.

---

## Notes

- BIOS settings had no USB power/suspend options available.

- NGINX-related syslog errors observed were unrelated (internal pfSense logging).

- USB 2.0 bandwidth is enough for 250 Mbps ISP line.

- Powered USB hub is an effective workaround for underpowered USB ports or hardware wear.

---

## Lessons Learned

- Physical issues like worn or damaged USB ports can appear as software instability.

- FreeBSD’s power-saving defaults may interfere with continuous interface use.

- A simple USB hub with external power can significantly increase reliability in low-cost homelab setups.

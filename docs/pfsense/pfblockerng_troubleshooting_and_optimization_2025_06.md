# pfBlockerNG - Troubleshooting and Optimization 06|2025

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

## Problem Summary

During normal pfSense operation on low-powered hardware (AMD A9-9410 CPU, 8 GB RAM, Realtek NIC, 1 GB HDD), several issues were encountered with **pfBlockerNG's DNSBL feature**:

- Multiple feed download failures (e.g., UT1_ddos, UT1_malware, StevenBlack_ADs)

- MIME type errors (`application/octet-stream|0`)

- PHP crash in `/etc/inc/filter.inc` (fclose() on non-resource)

- `pfBlockerNG` rules could not be generated or saved

- High usage of the `/var` partition due to `tmpfs` limits (128 MB)

---

## Root Causes

| Issue | Root Cause |
|-------|------------|
| `Local File Failure` | Temporary file could not be saved to `/var` (either due to lack of space or missing directory) |
| `Mime Type: application/octet-stream` | Feed returned invalid or empty content (0 bytes) |
| PHP `fclose()` crash | Rule generation failed because file handle was `false` (likely I/O failure) |
| DNSBL list download failures | Source URLs are invalid, broken, or blocked |
| WebGUI unresponsive after enabling PowerD on "min" | CPU scaled down too aggressively |

---

## Solution Steps

### 1. Clean up temporary files

Run in **Diagnostics > Command Prompt**:

```sh
rm -rf /var/db/pfblockerng/*
rm -rf /var/log/pfblockerng/*
rm -rf /var/tmp/*
# Then restart pfBlockerNG:
pfctl -d
pfctl -e
```

> Or use the WebUI: Status > Services > Restart pfBlockerNG

### 2. Disable problematic DNSBL feeds

```ini
# Navigate to:
Firewall > pfBlockerNG > DNSBL > DNSBL Feeds

# Set the following feeds to OFF:

UT1_ddos, UT1_malware, UT1_phishing, UT1_publicite, etc.

StevenBlack_ADs

# These were either broken, unreachable, or empty.
```

### 3. Update with working feeds only

**Go to: pfBlockerNG > Update**

Set: Force Reload = ON

Click: Run

> Recommended reliable, low-overhead DNSBL feeds:

AdAway → https://adaway.org/hosts.txt

NoCoin → https://raw.githubusercontent.com/hoshsadiq/adblock-nocoin-list/master/nocoin.txt

### 4. Avoid /var filling up again

> The /var partition is on tmpfs (128 MB), which reached 93% during DNSBL updates

**To avoid this:**

Keep DNSBL feeds minimal

Regularly clear /var/tmp, logs, and pfBlockerNG cache

Consider moving /var to ZFS (advanced, permanent fix)

**Check usage with:**

```bash
df -h
```

### 5. PowerD reconfiguration

- Previous PowerD setting: min

- Result: GUI unresponsive, possibly system-wide slowdown

**Recommended setting:**

- Enable PowerD:

- Mode: hiadaptive (AC, Battery, etc.)

Set in:
System > Advanced > Miscellaneous > Power Savings

**This balances performance and cooling.**

#### Crash Report Analysis

> PHP Fatal error:  Uncaught TypeError: fclose(): Argument #1 ($stream) must be of type resource, false given in /etc/inc/filter.inc:2997
This error occurred because filter_nat_rules_generate() tried to close a file stream that failed to open.

**Likely reason:**

```bash
/tmp or /var did not have enough space
# File creation failed silently
Rule generation process (NAT, firewall) aborted
# Fix:
/etc/rc.filter_configure_sync
# Or via WebUI: Diagnostics > Filter Reload
```

---

## Summary

```ini
Area	Action
DNSBL	Disable broken feeds, add 2-3 reliable sources
/var usage	Clean up temp/cache files, monitor size, avoid overfilling
PowerD	Set to hiadaptive
Crashes	Caused by I/O failures due to full /var, resolved by cleanup
System stability	Now improved, pfBlockerNG functional again
```

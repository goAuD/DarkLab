# Cron + Akmods Monitoring Guide (Fedora)

This cheatsheet explains how to use `cron` to regularly check whether the NVIDIA kernel module (`akmods`) is built correctly on Fedora systems. Especially useful when kernel updates are disabled and you want to know when akmods becomes available again.

---

## What does it monitor?

The script `check_akmods.sh` checks if the `kmod-nvidia` module exists for the current kernel.  
It logs the result into a timestamped log file: `~/.akmods-check.log`

---

## Sample Script: `check_akmods.sh`

```bash
#!/bin/bash
# Checks if akmods/nvidia kernel module is built for the current kernel

LOG=~/.akmods-check.log
date "+%Y. %b. %d., %A, %T %Z:" >> "$LOG"

if ! rpm -q kmod-nvidia > /dev/null; then
  echo "akmods not yet available." >> "$LOG"
else
  echo "akmods present." >> "$LOG"
fi
```

> Put this script into ~/scripts/check_akmods.sh

Make it executable:

```bash
chmod +x ~/scripts/check_akmods.sh
```

---

## How to add it to crontab

Edit your personal crontab:

```bash
crontab -e
```

Add this line to run every 15 minutes:

```cron
*/15 * * * * $HOME/scripts/check_akmods.sh
```

That’s it! Cron will now check akmods regularly and log to:

```bash
~/.akmods-check.log
```

---

## Test manually

You can also run the check anytime:

```bash
~/scripts/check_akmods.sh
```

---

## Clean the log (optional)

```bash
rm ~/.akmods-check.log
```

Or, if using Makefile:

```bash
make cleanlog
```

---

## What if you prefer systemd-timer instead?

>See the **systemd-akmods-check.md** file in this project for an alternative using systemd instead of cron.

---

## Why this is useful

- Detects when it's safe to unlock kernel and update

- No guesswork: clear logs show when akmods is ready

- Combines perfectly with versionlocked kernels + NVIDIA

---

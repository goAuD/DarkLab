# Linux Log Analysis Cheat Sheet

![Platform](https://img.shields.io/badge/platform-linux%20%7C%20windows-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Log File Locations

```bash
/var/log/
```

---

## Important Files

> /var/log/syslog – general system messages (Debian/Ubuntu)

> /var/log/messages – similar, on CentOS/RHEL systems

> /var/log/auth.log – authentication, sudo, ssh

> /var/log/dmesg – kernel messages

> /var/log/boot.log – system boot

> /var/log/Xorg.0.log – graphical interface startup

---

## Search and Filter

```bash
grep "error" /var/log/syslog         # only lines containing "error"
grep -i "error" /var/log/messages   # case insensitive
grep -v "ignored" auth.log          # everything EXCEPT "ignored"
```

---

## Real-time Monitoring

```bash
tail -f /var/log/syslog             # shows new lines live
journalctl -f                       # systemd log stream
```

---

## Time-based Filtering

```bash
journalctl --since "10 minutes ago"
journalctl --since yesterday --until today
```

---

## Boot-based Filtering

```bash
journalctl --list-boots
journalctl -b -1                    # previous boot log
```

---

## Service-specific Logs

```bash
journalctl -u ssh.service
```

---

## Other Useful Commands

```bash
less /var/log/syslog
dmesg | grep -i usb
```

---

## Logrotate (Optional Tip)

> Logs are automatically rotated by logrotate. To save command output:

```bash
journalctl -u ssh.service > ssh_logs.txt
```

---

## Windows (CMD & PowerShell)

## Event Logs

```powershell
Event Viewer → eventvwr.msc
→ System / Application / Security
```

---

## Command Line Queries

```powershell
Get-EventLog -LogName System -Newest 50
Get-EventLog -LogName Application | where {$_.EntryType -eq "Error"}
```

---

## New Event Viewer API (PowerShell 5+)

```powershell
Get-WinEvent -LogName System -MaxEvents 50
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4624}
```

---

## Date Filtering

```powershell
Get-EventLog -LogName System -After (Get-Date).AddDays(-1)
```

---

## Boot and Network Events

```ini
Boot ID: 6005 (start), 6006 (shutdown)

Network: 4201 (connect), 4202 (disconnect)
```

---

## Blue Screen Events

```powershell
Get-WinEvent -FilterHashtable @{LogName="System"; ID=1001}
```

## Export to CSV

```powershell
Get-EventLog -LogName System | Export-Csv -Path system_log.csv
```

---

## Helpful Tips

> ### If something seems strange, always check:

- **Linux: journalctl -xe**

- **Windows: Get-WinEvent -LogName System -MaxEvents 100 | Out-GridView**

- **Always search for: error, fail, denied, refused, timeout**

- **Remember: logs hold the key to everything.**

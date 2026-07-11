# TrustMindLab - Windows→Debian Backup Cheatsheet (SFTP + Duplicati)

## TL;DR

**Debian**: mount the external SSD under `/srv/backups` (`fstab + UUID`), create a `backupuser` account, restrict it to SFTP with `chroot`.
**Windows**: Duplicati → SFTP target `backupuser@<debian-ip>:/windows11` → encryption (AES-256), schedule, retention.
**Test**: `sftp backupuser@<debian-ip>` → `ls` shows only `lost+found` + `windows11`.

---

## [MODE:FAST] Step by step (what we actually ran)

### 1) Mount the external SSD on Debian (ext4, /srv/backups)

```bash
# 1) Check
lsblk

# 2) (If needed) format as ext4 - WARNING: this erases all data on sda1!
sudo mkfs.ext4 /dev/sda1

# 3) Mount point
sudo mkdir -p /srv/backups

# 4) Mount
sudo mount /dev/sda1 /srv/backups

# 5) Check
df -h | grep sda1

# 6) Look up the UUID for fstab
sudo blkid /dev/sda1
# Example: UUID="281783b3-ba91-406a-a205-695098696e81"
```

**`/etc/fstab` (for a permanent mount):**
```
UUID=281783b3-ba91-406a-a205-695098696e81  /srv/backups  ext4  defaults  0  2
```

**Activate:**

```bash
sudo mount -a
mount | grep /srv/backups
```

---

### 2) Dedicated backup user + permissions

```bash
# Shell-less user: SFTP only
sudo adduser backupuser --shell /usr/sbin/nologin

# Target directory (for Windows backups)
sudo mkdir -p /srv/backups/windows11
sudo chown backupuser:backupuser /srv/backups/windows11
```

---

### 3) SFTP chroot restriction (only the backup root should be visible)

```bash
sudo nano /etc/ssh/sshd_config
```

**Add at the end:**

```
Match User backupuser
    ChrootDirectory /srv/backups
    ForceCommand internal-sftp
    AllowTcpForwarding no
```

**Apply:**

```bash
sudo systemctl restart ssh
```

---

### 4) Quick SFTP test from Windows

**PowerShell:**
```powershell
sftp backupuser@<debian-ip>
# after entering the password:
sftp> ls
# Expected output: "lost+found  windows11"
sftp> exit
```

**WinSCP (optional):**

- Protocol: SFTP
- Host: `<debian-ip>` (a Tailscale IP works too)
- Port: 22
- User/Pass: backupuser / password

After logging in, only `windows11` should be visible on the right (lost+found is normal).

---

## [MODE:DEEP] Duplicati - recommended settings (Windows)

**Install + launch:**
Download → install → in browser: `http://localhost:8200`

### New backup (example: D: projects)

- **Name**: D-projects
- **Encryption**: AES-256, strong password (write it down!)
- **Target**:
  - Storage type: SFTP (SSH)
  - Server/Port: `<debian-ip>:22`
  - Path: `/windows11/d-projects`
  - User/Pass: backupuser / password
  - Test connection: must succeed

- **Source**: select the D:\ project folders

**Filters - typical exclusions:**

```
*\node_modules\*
*\__pycache__\*
*\.venv\*
*.iso
*.msi
*.exe
*.zip
```

> If you also back up installers, don't exclude these.

**Schedule**: daily at 22:00
**Retention (Custom)**: `7D:1D, 4W:1W, 12M:1M`
→ Meaning: daily snapshots for 7 days, weekly for 4 weeks, monthly for 12 months

---

### C: critical data (a separate job is recommended)

**Source - back up:**

```
C:\Users\<YOURNAME>\Documents
C:\Users\<YOURNAME>\Desktop
C:\Users\<YOURNAME>\Pictures
C:\Users\<YOURNAME>\.ssh\
C:\Users\<YOURNAME>\AppData\Roaming\
(selectively) C:\Users\<YOURNAME>\AppData\Local\
C:\ProgramData\
```

**Source - exclude:**

```
C:\Windows\
C:\Program Files\
C:\Program Files (x86)\
C:\$Recycle.Bin\
C:\pagefile.sys
C:\hiberfil.sys
C:\swapfile.sys
C:\Users\<YOURNAME>\AppData\Local\Temp\
C:\Users\<YOURNAME>\AppData\Local\Microsoft\Windows\INetCache\
```

**Schedule**: twice weekly (Tuesday + Friday at 22:00)
**Retention**: `4W:1W, 12M:1M`

---

## Smart vs. Custom retention - quick explanation

- **Smart**: simple, automated → `7D:4W:12M`
- **Custom**: manual → `<time span>:<sampling>` comma-separated:

```
7D:1D, 4W:1W, 12M:1M
30D:1D, 12M:1M, 3Y:1M
```

---

## Useful notes

- **UUID**: the partition's unique identifier:
  `sudo blkid /dev/sda1`

- We use the **UUID in fstab** because it's more stable than the `/dev/sdX` name.

- **lost+found** is ext4's own directory → leave it alone.

- **chroot rule**: the root directory must be owned by root:

```bash
sudo chown root:root /srv/backups
sudo chown backupuser:backupuser /srv/backups/windows11
```

- **Tailscale**: you can use the Tailscale IP in Duplicati.

- **Encryption**: if you lose the password → the backup is unreadable.

- **First run**: slow → this is normal (encryption + compression + uplink)

---

## Restore mini-test - recommended

1. Duplicati → Restore → select 1-2 files
2. Restore to a temporary folder
3. Check: do they open correctly?

---

## Restore - 60-second outline

1. Duplicati UI → Restore
2. Choose a date (version)
3. Select the files/folders
4. Restore files to... (a new location)
5. Open the file → if it's fine, proceed with the real restore

---

## CHECKLIST (quick audit)

- `/etc/fstab` → UUID line correct, `mount -a` runs without error
- `/srv/backups` owned by root, `windows11` folder owned by `backupuser`
- `sshd_config` → `Match User backupuser` block present, SSH restarted
- `sftp backupuser@<ip>` → you can see `windows11`
- **Duplicati D:** daily, `7D:1D,4W:1W,12M:1M`, exclusions configured
- **Duplicati C:** Tuesday+Friday at 22:00, `4W:1W,12M:1M`, system/cache excluded
- Trial restore completed (with at least 2 files)

---

## DECISION LOG (current)

- **Target**: External 2TB SSD, ext4 → `/srv/backups`
- **Protocol**: SFTP (SSH), chrooted `backupuser`
- **Backup client**: Duplicati (file-level, encryption, deduplication)
- **Retention**:
  - D: `7D:1D,4W:1W,12M:1M`
  - C: `4W:1W,12M:1M`
- **Schedule**:
  - D: daily at 22:00
  - C: Tuesday+Friday at 22:00

---

## NEXT ACTIONS

- **Duplicati - D:** check whether the first full backup has run, then set up an email notification (if used). *(You, 10-15min)*
- **Duplicati - C:** fine-tune the exclude list (make sure Temp/INetCache is excluded). *(You, 5-10min)*
- **Restore mini-test**: pick 2-3 files (one from AppData), restore to a temp folder, open them. *(You, 10min)*

# Docker - The beginning 2025_06_11

[![Join the TrustMindLab Discussions](https://img.shields.io/badge/Join-TrustMindLab-blueviolet)](https://github.com/goAuD/MyHomeLab/discussions/1)
<div class="badge-base LI-profile-badge" data-locale="hu_HU" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="viktor-halupka-weiz" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://at.linkedin.com/in/viktor-halupka-weiz?trk=profile-badge">Viktor Halupka</a></div>

---

As part of the HomeLab, I used Docker containerization to host isolated, manageable home services. During the project, I resolved several technical issues and successfully deployed several services, including:

---

## Problem

Installed Docker and WSL2 on Windows 11, but the WSL2 initially failed to start due to misconfigured .wslconfig.

**Fixing WSL `automount` Configuration**

> **Note:** `crossDistro = true` is **not** a valid key in the `[automount]` section, so WSL throws an unknown key error if you include it.

---

## Correct `[automount]` Configuration Example

```bash
[automount]
root = /mnt/host
options = "metadata"
```
---

## Restarting WSL and Docker Container

After saving the correct `.wslconfig` file, restart WSL and the Docker container:

```powershell
wsl --shutdown
wsl
powershell
docker compose up -d
```

> WSL2 should now run reliably, and Docker should successfully start the container.

<img src="https://raw.githubusercontent.com/goAuD/TrustMindLab/main/assets/img/Docker.png" alt="docker_hardening" width="450">

---

## Problem

- Docker Desktop Startup Issue on Windows

- When Docker Desktop is set to start automatically with Windows, the following issues occur:

1. **WSL Initialization Error**: On boot, Docker shows an error indicating that WSL is not loaded yet.

2. **Engine Startup Failure**: Shortly after, another message appears (e.g., *Fetching issue*), and the Docker engine does not become usable.

3. **Workaround Required**: Even if Docker Desktop is manually shut down, the issue persists unless further steps are taken.

---

## Solution

### To get Docker Desktop working properly again

1. Fully exit Docker Desktop (`Right-click → Quit Docker Desktop`).

2. Open `Event Viewer`, or alternatively use Task Manager or PowerShell.

3. Locate and terminate the `com.docker.build.exe` process.

4. Restart Docker Desktop manually.

---

## After performing these steps, Docker works normally

### Suspected Cause

This may be due to **slow WSL initialization on system startup**, especially if Docker and/or WSL-related components are located on a **mechanical HDD**. The delayed loading could cause Docker to attempt to start before WSL is fully ready.

---

### Suggested Fix

Try moving Docker's WSL-related files and configuration (or the entire Docker installation) to a **solid-state drive (SSD)**. This might ensure faster startup and proper synchronization with WSL during boot.

> **Note:** WSL2 boot speed improved: confirmed SSD is significantly faster than HDD when hosting the virtual disk.

**Feel free to open an issue or contribute a better workaround if you've faced the same problem!**

---

## Common Docker Commands with Explanations

> **It will come in handy someday**

| Command                           | Description                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| `docker compose up -d`            | Starts the containers defined in `docker-compose.yml` in detached (background) mode.        |
| `docker compose down`             | Stops and removes the containers, networks, and volumes created by `docker-compose up`.     |
| `docker compose restart`          | Restarts all containers defined in the compose file.                                        |
| `docker ps`                       | Lists all currently running containers.                                                     |
| `docker ps -a`                    | Lists all containers, including stopped ones.                                               |
| `docker logs photoprism`          | Displays the logs/output from the container named `photoprism`. Useful for troubleshooting. |
| `docker exec -it photoprism bash` | Opens an interactive shell (`bash`) inside the running `photoprism` container.              |
| `docker stop photoprism`          | Gracefully stops the `photoprism` container.                                                |
| `docker start photoprism`         | Starts a stopped `photoprism` container.                                                    |
| `docker rm photoprism`            | Removes the `photoprism` container. It must be stopped first.                               |
| `docker images`                   | Lists all downloaded Docker images.                                                         |
| `docker image prune`              | Cleans up unused Docker images to free disk space.                                          |
| `docker volume ls`                | Lists all Docker volumes.                                                                   |
| `docker volume prune`             | Removes unused Docker volumes.                                                              |

---

## Finally some tests and settings

- Tailscale integration: successfully tested secure remote access to Docker containers (e.g., PhotoPrism) from mobile and Fedora machines

- PhotoPrism AI photo library: set up and secured using Tailscale + port forwarding. A private, smart photo library with AI-assisted organization

- Plex and Plexamp integration: music library is now securely available on mobile, even while commuting

<img src="https://raw.githubusercontent.com/goAuD/TrustMindLab/main/assets/img/PhotoPrism.png" alt="docker_hardening" width="450">

---

## Planned next steps

- Install Portainer: a web-based Docker management interface for easier container control

- Use Docker Compose: to manage multi-container setups (e.g., webserver + database)

- Further harden container access using Tailscale or WireGuard

- Reverse proxy setup planned: using Caddy or Nginx to simplify HTTPS and routing

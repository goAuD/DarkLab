# Makefile Cheatsheet (for Fedora system tasks)

A quick reference for using Makefile as a task runner in Fedora-based systems. This file is meant to be stored in your `docs/` directory for easy recall.

---

## What is a Makefile?

A `Makefile` is a special configuration file used by the `make` command to automate repetitive tasks using **named targets**.

Instead of running long shell commands manually, you can just do:

```bash
make install
make lock
make unlock
```

---

## Basic Structure

```make
target-name:
<TAB>command to run
```

Note: The command line **must start with a real tab character**, not spaces.

---

## Common Targets (Examples)

```make
install:
	cp scripts/*.sh /usr/local/bin
	chmod +x /usr/local/bin/*.sh

lock:
	sudo ./scripts/versionlock-kernel.sh

unlock:
	sudo ./scripts/unlock-kernel.sh

check:
	./scripts/check_akmods.sh

cleanlog:
	rm -f ~/.akmods-check.log
```

---

## Run Targets

```bash
make                # Only runs the first target in the file
make check          # Runs the 'check' block
make cleanlog       # Deletes your akmods log
```

---

## Debug & Inspection

### List current version locks:

```bash
dnf versionlock list
```

### Delete all locks:

```bash
sudo dnf versionlock delete kernel*
```

---

## Pro Tips

- `Makefile` must be named exactly like that (no `.sh`, `.txt`, etc.)
- Store it in the root of your project repo
- Add a `.PHONY` section if needed to avoid filename conflicts:

```make
.PHONY: install lock unlock check cleanlog
```

---

## Why Use Make?

- Readable, organized, version-controlled tasks
- Easier than long `bash` scripts for routine system operations
- Works across Fedora, Debian, Arch, etc.

---

## Store this file as: `docs/makefile-cheatsheet.md`

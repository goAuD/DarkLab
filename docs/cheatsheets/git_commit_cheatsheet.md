# Git Commit Message Template Guide

This file explains how to set up and use a global Git commit message template on Windows.

---

## What is a commit message template?

A commit template helps you stay consistent with your commit messages by pre-filling a structure when you run `git commit`.

---

## Your setup (as used on this system):

You have your template stored at:

```
C:\Users\bigda\gitmessage.txt
```

---

## How to enable it globally

Run this command in PowerShell or Git Bash:

```bash
git config --global commit.template "C:\Users\bigda\gitmessage.txt"
```

This sets the file as the default template for all your Git repositories on this system.

---

## How to test it

1. Go into any Git repo (e.g. DarkLab):

```bash
cd D:\GitHub\DarkLab
```

2. Run:

```bash
git commit
```

3. Your configured template will open in the default Git editor (e.g. VS Code or Vim).

---

## If you want to disable it later

```bash
git config --global --unset commit.template
```

---

## Important:

- The template will **not be used** if you use `-m`, like this:

```bash
git commit -m "quick fix"
```

Only `git commit` without `-m` will trigger the template.

---

## Tip

You can version your `.gitmessage.txt` file by keeping it in a synced repo (like `DarkLab`), and pointing your config there instead:

```bash
git config --global commit.template "D:\GitHub\DarkLab\.gitmessage.txt"
```

---

Store this file as:  
**`docs/git-commit-template.md`**

# Kerberos Cheat Sheet (Human-Friendly Edition)

![Focus](https://img.shields.io/badge/focus-active%20directory-purple)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## What is Kerberos?

A ticket-based authentication protocol. Goal: secure network login WITHOUT sending passwords.

- Used by: mainly Windows Active Directory (but Unix systems also have support).
- Operating principle: "You log in, get a ticket, use that to access services."

## Reminder Analogy

```ini
TGT = annual pass
Service Ticket = ticket for a specific movie
KDC = movie ticket booth
Client = you, standing in line
```

## Basic Concepts

- **KDC** - Key Distribution Center (2 parts):
  - **AS** - Authentication Server
  - **TGS** - Ticket Granting Server
- **TGT** - Ticket Granting Ticket
- **ST** - Service Ticket
- **Principal** - anyone or anything that wants to log in (user, service)
- **Realm** - Kerberos domain (e.g., `MYDOMAIN.LOCAL`)

---

## Main Components

| Component | Role |
|----------|--------|
| **Client** | The user who wants to log in |
| **KDC (Key Distribution Center)** | The central brain, 2 parts: |
| → Authentication Server (AS) | Verifies you are who you say you are |
| → Ticket Granting Service (TGS) | Distributes tickets to services |
| **TGT (Ticket Granting Ticket)** | "ID card" given by AS, used to request other tickets |
| **Service Ticket** | Used to access a specific service (e.g., file server) |

---

## Authentication Process - 5 Steps

1. **User login → KDC/AS**
   → `username + timestamp` →
   KDC sends back a **TGT** (encrypted with password-derived key)

2. **User → decrypts TGT**
   If password is correct → gets the session key and TGT

3. **User → KDC/TGS**
   → sends the TGT + requested service name
   (e.g., `HTTP/server.example.com`)

4. **TGS → returns the Service Ticket**

5. **User → Service (e.g., Web server)**
   → sends the Service Ticket
   Service decrypts → **user authenticated**

---

## Notes

- Every ticket is time-bound (timestamp-based operation)
- Synchronized time is **critical** (e.g., NTP mandatory)
- Suitable for **SSO** (Single Sign-On)
- Mainly prevalent in **Windows Active Directory** environments

---

## Why is it Difficult?

- Symmetric encryption at every step.
- Time-based (clock drift = problems).
- Tickets are time-bound (they expire).
- Only works with centralized KDC.
- Platform-dependent (mainly Windows)
- Debugging: nightmare. *Dark Souls level challenge*

---

## What Attacks Exist?

| Attack | Brief Description |
|--------|-------------------|
| **Pass-the-Ticket** | Uses a stolen ticket |
| **Golden Ticket** | Forged TGT from master key |
| **Silver Ticket** | Forged service ticket |
| **Kerberoasting** | Offline brute-force of Service Account passwords |

---

## When Should You Deal With This?

**Yes, if:**

- Working in Active Directory environment
- You're a Pentester / Blue Team member
- Integrating Windows servers

**No (or rarely), if:**

- DevSecOps / Linux environments
- Modern auth: OAuth2, OpenID, SAML, JWT
- Cloud-native / CI/CD / microservices direction

---

## Linux Commands (if needed)

```bash
kinit viktor@REALM.COM        # Log in with Kerberos
klist                         # List active tickets
kdestroy                     # Delete tickets
```

---

## Survival Tip

> "If you don't have to, **don't configure Kerberos manually**. If you must: take notes, sync the clock, and call for help."

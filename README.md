<div align="center">

# 🎓 VidyaConnect

### Sri Lanka School Communication Platform

*A mobile-first, role-aware platform connecting schools, teachers, parents, and students.*

[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()
[![Architecture](https://img.shields.io/badge/architecture-microservices-blue)]()
[![Auth](https://img.shields.io/badge/auth-Keycloak%20%2F%20OIDC-orange)]()

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Target Users](#-target-users)
- [Key Features](#-key-features)
- [Extended Features](#-extended-features)
- [System Architecture](#-system-architecture)
- [Microservices](#-microservices)
- [Tech Stack](#-tech-stack)
- [Multi-Tenancy & Security](#-multi-tenancy--security)
- [Getting Started](#-getting-started)
- [Project Status](#-project-status)

---

## 🧭 Overview

**VidyaConnect** is a mobile-first, role-aware school communication platform designed specifically for Sri Lankan schools. It replaces fragmented communication channels — WhatsApp groups, printed notices, phone calls, and verbal messages — with a structured, secure, and centralized communication system.

School administrators, teachers, parents/guardians, and students all access the information relevant to them through a single platform, reducing administrative workload and improving communication reliability across the board.

---

## ❗ Problem Statement

Sri Lankan schools currently rely on fragmented and inefficient communication methods, including WhatsApp groups, printed circulars, phone calls, and verbal messages passed through students. These approaches consistently lead to:

- 📵 Parents missing important announcements
- 🔁 Teachers repeatedly sharing the same information across multiple channels
- 📉 Administrators lacking any delivery or response tracking
- ⏰ Students missing assignment deadlines
- 📝 Paper-based consent forms requiring manual follow-up

There is currently **no centralized platform** that brings announcements, assignments, attendance management, consent forms, notifications, and school events together in one place — VidyaConnect exists to close that gap.

---

## 🎯 Project Objectives

- Develop and deploy a functional **MVP** for school communication and administration.
- Implement structured communication between schools, teachers, parents, and students.
- Digitize attendance and absence management processes.
- Replace paper-based consent forms with digital workflows.
- Provide a unified calendar and event management system.

---

## 👥 Target Users

| Role | Description |
|---|---|
| 🏫 **School Administrators** | Manage school-wide operations, users, classes, and announcements |
| 👩‍🏫 **Teachers** | Manage their classes — attendance, assignments, class-level communication |
| 👨‍👩‍👧 **Parents / Guardians** | Stay informed on their children's school life and respond to forms/requests |
| 🎒 **Students** | Access assignments, announcements, and school updates directly |

---

## ✨ Key Features

- **Communication Hub** — centralized announcements and messaging across school, class, and individual levels
- **Assignment & Task Tracking** — teachers post, students and parents track deadlines
- **Smart Notification System** — timely, targeted alerts instead of noisy group chats
- **Digital Consent & Administrative Forms** — replace paper consent slips with trackable digital workflows
- **Attendance Management** — daily attendance recording and digital absence justification

---

## 🚀 Extended Features

- **Insights Dashboard** — visibility into engagement, attendance trends, and response rates
- **Bulk Data Management** — efficient onboarding of students, classes, and staff at scale
- **Calendar Integration** — unified view of school events, deadlines, and academic schedules

---

## 🏗 System Architecture

VidyaConnect follows a **three-tier architecture**, implemented as an underlying set of independently deployable **microservices**:

```
┌─────────────────────────────────────────────┐
│                Presentation Tier             │
│        Mobile App  •  Web / Admin Portal     │
└───────────────────────┬───────────────────────┘
                         │  HTTPS / REST (/api/v1)
┌───────────────────────▼───────────────────────┐
│                 Application Tier               │
│   API Gateway  →  Microservices  →  Keycloak   │
│   (auth, routing, tenant validation)           │
└───────────────────────┬───────────────────────┘
                         │
┌───────────────────────▼───────────────────────┐
│                    Data Tier                    │
│      PostgreSQL  •  S3 / LocalStack (files)     │
└─────────────────────────────────────────────────┘
```

- **Presentation Tier** — the mobile app and web/admin portal that users interact with.
- **Application Tier** — the API gateway and backend microservices, handling business logic, authentication, and tenant isolation.
- **Data Tier** — PostgreSQL for persistent data, plus S3-compatible storage (via LocalStack locally) for file uploads.

---

## 🧩 Microservices

| Service | Responsibility |
|---|---|
| `school-user-service` | Schools, users, profiles, classes, subjects, teacher assignments, student profiles, parent-student relationships |
| `announcement-service` | System-wide and school-wide announcements |
| `attendance-service` | Attendance records and absence justifications |
| `consent-form-service` | Digital consent forms and parent responses |
| `file-service` | Pre-signed S3 upload/download URLs and file metadata |
| `notification-service` | Notification history and delivery |

Each service owns its own data and is independently deployable — a change to attendance logic doesn't require redeploying announcements, and one service failing doesn't take the others down.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Containerization** | Docker, Docker Compose |
| **Reverse Proxy / Gateway** | Nginx |
| **Authentication** | Keycloak (OIDC), JWT |
| **Database** | PostgreSQL |
| **File Storage** | AWS S3 (LocalStack for local development) |
| **Backend** | Microservices architecture |
| **Testing** | Jest, Postman |
| **Project Management** | GitHub Issues, GitHub Projects |
| **Deployment** | AWS EC2 |

---

## 🔐 Multi-Tenancy & Security

VidyaConnect is built as a **multi-tenant** platform — each school operates as an isolated tenant:

- Every authenticated request carries a Keycloak-issued JWT containing a `school_id` claim.
- All state-changing operations validate that the target resource's `school_id` matches the caller's — enforced at the service layer, not just the gateway.
- Cross-tenant access attempts are rejected before reaching the database.
- Role-based access control (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `PARENT`, `STUDENT`) is enforced via Keycloak realm roles on every endpoint.

See [`API_CONTRACTS.md`](./API_CONTRACTS.md) for the full endpoint-by-endpoint contract, including tenant rules and error semantics.

---

## ⚙️ Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (for local service development)
- A `.env` file configured per service (see `.env.example`)

### Run the platform locally

```bash
# Clone the repository
git clone https://github.com/<org>/VidyaConnect.git
cd VidyaConnect

# Start all services
docker compose up -d --build

# Verify everything is healthy
curl http://localhost:8080/api/v1/health
```

See the **Local Development Startup Guide** for detailed setup, environment variable configuration, and troubleshooting steps.

---

## 📌 Project Status

VidyaConnect is currently in **active development**, building toward its first vertical slice (login + announcements) as part of the MVP milestone. See the [Project Board](../../projects) for current sprint progress.

---

<div align="center">

*Built for Sri Lankan schools, by the VidyaConnect team.*

</div>

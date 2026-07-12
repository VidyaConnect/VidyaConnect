# VidyaConnect Component Diagram

## Overview

This directory contains the **Component Diagram** for the **VidyaConnect** system. The diagram illustrates the internal backend architecture by clearly separating the application into controllers, middleware, services, repositories, infrastructure components, and external service adapters.

The architecture follows a layered design that improves maintainability, scalability, and separation of responsibilities.

## Architecture

The component diagram consists of the following major sections.

### Client Applications

* Mobile Application
* Web Admin Portal

### Shared Middleware

The middleware layer provides common request processing for all backend services, including:

* JWT Validation
* Tenant Context Resolution
* Request Validation

### Core Services

Each backend module follows the same internal layering:

`Controller → Middleware → Service → Repository`

The system includes the following services:

* User and Admin Service
* Communication Service
* Academic Service
* Consent Form Service
* Notification Service
* Report Service

### Infrastructure Layer

The infrastructure layer is responsible for persistence, storage, security, and communication with external platforms.

Components include:

* Security
* Persistence
* File Storage
* Notification Infrastructure

Each infrastructure component communicates with external systems through dedicated adapters:

* Postgres Adapter
* S3 Storage Adapter
* SNS Adapter

### External Services

The application integrates with the following external services:

* PostgreSQL Database
* AWS S3
* AWS SNS

## Architectural Principles

The component diagram follows these architectural principles:

* **Layered Architecture** – Requests flow through the layers in the following order:

  `Controller → Middleware → Service → Repository`

* **Separation of Concerns** – Each layer has a single responsibility, reducing coupling between business logic and infrastructure.

* **Centralized Middleware** – Authentication, tenant context resolution, and request validation are shared across all services instead of being implemented separately.

* **Repository Pattern** – Repositories are the only components that interact with persistence and infrastructure.

* **Adapter Pattern** – External integrations are isolated using dedicated adapters, allowing infrastructure implementations to be replaced without affecting business logic.

## Component Diagram

![VidyaConnect Component Diagram](./VidyaConnect-Component-Diagram.png)

## Editable Source

The editable Draw.io diagram is included in this directory.

## Google Drive

The latest version of the component diagram is available at:

https://drive.google.com/file/d/1xxNKl1LF9nTAQm4jUJBlWxwracrClNgf/view?usp=sharing

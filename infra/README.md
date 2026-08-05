# Infrastructure

## Overview

The **Infrastructure** directory contains all infrastructure-related configuration files required to run and support the **VidyaConnect platform**.

This directory manages the development and deployment environment, including containerization, authentication services, reverse proxy configuration, and local cloud service simulation.

The infrastructure setup provides a consistent environment for developers and ensures that all backend services can run together efficiently.

---

# Directory Structure

```
infrastructure
│
├── docker/
│   ├── docker-compose.local.yml
│   └── Docker configuration files
│
├── nginx/
│   └── Reverse proxy configuration
│
├── keycloak/
│   └── Authentication and authorization configuration
│
├── localstack/
│   └── Local AWS service simulation
│
└── README.md
```

---

# Infrastructure Components

## Docker

The Docker configuration manages containerized services required for local development.

Responsibilities:

- Running backend services in containers
- Managing service dependencies
- Creating isolated development environments
- Providing consistent setup across different machines

Services managed through Docker may include:

- PostgreSQL database
- Announcement Service
- Authentication services
- Other VidyaConnect backend services

Common Docker commands:

Build and start services:

```bash
docker compose up --build
```

Run services in background:

```bash
docker compose up -d
```

Stop services:

```bash
docker compose down
```

Check running containers:

```bash
docker ps
```

View container logs:

```bash
docker compose logs
```

---

# Nginx

The Nginx configuration provides reverse proxy functionality for the VidyaConnect platform.

Responsibilities:

- Routing client requests to backend services
- Managing API gateway communication
- Providing centralized service access
- Supporting future load balancing requirements

Example flow:

```
Client Application
        |
        v
      Nginx
        |
        |
 ---------------------
 |         |          |
 v         v          v
Auth   Backend    Services
```

---

# Keycloak

Keycloak provides authentication and authorization services for VidyaConnect.

Responsibilities:

- User authentication
- Identity management
- Role-based access control
- Secure login management
- Token generation using OAuth2 / OpenID Connect

Supported user roles may include:

- Super Admin
- School Admin
- Teacher
- Parent
- Student

Keycloak allows centralized management of user identities across multiple services.

---

# LocalStack

LocalStack provides local emulation of AWS services during development.

Responsibilities:

- Testing cloud-based features locally
- Reducing dependency on external cloud resources
- Providing an AWS-compatible development environment

Possible services:

- AWS S3 simulation for file storage
- AWS SNS simulation for notifications
- Other AWS service integrations

---

# Local Development Setup

## Prerequisites

Install the following tools:

- Docker Desktop
- Docker Compose
- Git
- Node.js
- npm

---

# Running Infrastructure Locally

Navigate to the infrastructure directory:

```bash
cd infrastructure
```

Start all infrastructure services:

```bash
docker compose -f docker/docker-compose.local.yml up --build
```

Run services in detached mode:

```bash
docker compose -f docker/docker-compose.local.yml up -d
```

Stop all services:

```bash
docker compose -f docker/docker-compose.local.yml down
```

---

# Checking Service Status

View running containers:

```bash
docker ps
```

View logs:

```bash
docker compose -f docker/docker-compose.local.yml logs
```

View logs for a specific service:

```bash
docker compose -f docker/docker-compose.local.yml logs <service-name>
```

Example:

```bash
docker compose -f docker/docker-compose.local.yml logs keycloak
```

---

# Environment Configuration

Infrastructure services use environment variables for configuration.

Example environment files:

```
.env
docker/.env
```

Common configurations include:

- Database credentials
- Service ports
- Authentication settings
- Cloud service configurations

Never commit sensitive credentials into the repository.

---

# Service Communication

The infrastructure layer enables communication between platform components.

Example architecture:

```
                Mobile Applications
                       |
                       v
                    Nginx
                       |
        --------------------------------
        |              |               |
        v              v               v
 Announcement     Keycloak       Other Services
 Service
        |
        v
 PostgreSQL Database
```

---

# Deployment Considerations

The infrastructure is designed to support:

- Local development environments
- Container-based deployments
- Service scalability
- Secure authentication
- Future cloud deployment

Future deployment environments may include:

- AWS
- Kubernetes
- CI/CD pipelines

---

# Troubleshooting

## Docker Container Not Starting

Restart containers:

```bash
docker compose down
docker compose up --build
```

---

## Port Conflicts

Check running containers:

```bash
docker ps
```

Stop unused containers:

```bash
docker stop <container-id>
```

---

## Authentication Issues

Check Keycloak logs:

```bash
docker compose logs keycloak
```

Verify:

- Keycloak container is running
- Environment variables are correct
- Realm configuration is loaded

---

## Database Connection Issues

Check PostgreSQL container:

```bash
docker ps
```

Verify database configuration:

```
DATABASE_URL
```

---

# Development Workflow

1. Pull the latest repository changes

```bash
git pull
```

2. Start infrastructure services

```bash
docker compose -f docker/docker-compose.local.yml up
```

3. Develop and test backend services

4. Stop services after development

```bash
docker compose down
```

---

# Best Practices

- Keep infrastructure configuration version controlled
- Do not commit secrets or passwords
- Use environment variables for sensitive data
- Test changes locally before creating pull requests
- Keep Docker images and dependencies updated

---

# Maintainer

VidyaConnect Development Team

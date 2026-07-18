# VidyaConnect Architecture Document Review Feedback 2

Reviewer: Ishan Liyanage  
Date: 2026-07-16  
Focus: second-round architecture correction after updated architecture document and meeting discussion

## Overall Feedback

The updated architecture work shows progress, but it still needs another correction round before it can be considered aligned with the intended VidyaConnect technical direction.

The main issue is that the document and diagrams still read partly like a single layered backend, while the agreed direction is a microservices-oriented, containerized system with clear service boundaries, Keycloak-based authentication, proper observability, and a stronger deployment/recovery architecture.

This feedback should be treated as a second review round. Do not remove the previous feedback; use this document as the next correction checklist.

## 1. Add Proper Observability Architecture

The architecture document should not only say "monitoring" generally. It must explain the observability stack and how the team will monitor the system in practice.

Please study and include:

- OpenTelemetry
- Prometheus
- Grafana
- service health checks
- CPU usage monitoring
- memory usage monitoring
- API latency monitoring
- error rate tracking
- service availability dashboards
- error alerts

Explain the role of each tool:

- OpenTelemetry: collects traces, metrics, and context from services.
- Prometheus: scrapes and stores metrics.
- Grafana: visualizes dashboards and alerts.
- CloudWatch: monitors AWS infrastructure and logs.

The document should also show what each backend service exposes:

- `/health`
- `/ready`
- `/metrics`

## 2. Add Keycloak Into The Architecture

Keycloak must be added to the diagrams and architecture document.

The team must explain:

- where Keycloak sits in the system
- how users log in
- how access tokens are issued
- how refresh tokens are handled
- how backend services validate JWTs
- how roles are represented
- how `school_id` / tenant access is enforced
- which responsibilities belong to Keycloak
- which responsibilities belong to VidyaConnect services

Important architecture rule:

```text
Keycloak handles authentication.
VidyaConnect services handle business authorization and school-level data access.
```

Do not just add Keycloak as a box in the diagram. The team must understand and document:

- realm
- clients
- roles
- users
- access tokens
- refresh tokens
- token validation
- OIDC/OAuth2 login flow

## 3. Fix C4 Diagram Standards

The current diagrams need to follow proper C4 notation.

Required diagrams:

- C1: System Context Diagram
- C2: Container Diagram
- C3: Component Diagram
- optional C4: Code-level diagram for one selected module

The diagrams should clearly separate:

- people / actors
- software systems
- containers
- components
- external systems
- relationships

Each relationship should have a clear label explaining the interaction.

The C2 diagram should not show only one generic `Backend REST API` if the architecture direction is microservices. It should show the real deployable containers/services.

## 4. Show Services And Integration Clearly

The architecture must clearly show backend services and how they are integrated.

Include at least:

- User / School Service
- Announcement Service
- Attendance Service
- Assignment Service
- Consent Form Service
- File Service
- Notification Service
- Report Service

For each service, explain:

- responsibility
- API boundary
- database/schema ownership
- communication with other services
- external dependencies
- health/metrics endpoints

Important rule:

```text
If the architecture says microservices, the design must show real service boundaries,
not only internal modules inside one backend.
```

## 5. Explain How Keycloak Fits Into The System

The team must learn and explain Keycloak properly before finalizing the authentication architecture.

At minimum, add an authentication flow:

1. User opens mobile app or web portal.
2. User is redirected to / authenticates with Keycloak.
3. Keycloak validates credentials.
4. Keycloak issues access token and refresh token.
5. Client sends access token to backend service.
6. Backend service validates token signature and expiry.
7. Backend service checks role and tenant rules.
8. Backend service executes the requested action only if authorized.

Also explain how service-to-service calls preserve user identity, role, and tenant context.

## 6. Improve Observability And Service Health Details

The observability section should include real operational concerns:

- is the service running?
- is the service ready to accept traffic?
- is memory usage too high?
- is CPU usage too high?
- are API errors increasing?
- are response times becoming slow?
- is the database reachable?
- is S3 reachable?
- are notification failures increasing?

Add alert examples:

- service down for more than 2 minutes
- API error rate above threshold
- API latency above threshold
- high memory usage
- high CPU usage
- database connection failures
- failed notification delivery spike

## 7. Introduce Kubernetes As Target Deployment Architecture

The document should introduce Kubernetes as the target deployment direction.

Running all containers directly on one EC2 instance is useful for learning and foundation setup, but it is not strong for availability. If EC2 is used initially, document it as a foundation/simple deployment only.

Add a target Kubernetes deployment model:

- services run as pods
- each backend service has a deployment
- Kubernetes services expose internal service networking
- ingress controller routes external traffic
- ConfigMaps manage non-secret configuration
- Secrets manage sensitive values
- readiness probes decide when a pod can receive traffic
- liveness probes restart unhealthy pods
- rolling deployments reduce downtime
- horizontal scaling can be added for busy services

Explain why Kubernetes improves:

- availability
- service recovery
- rolling deployments
- scaling
- operational control

## 8. Add Disaster Recovery, Backup, And Recovery Plan

The architecture document should include a DR and backup/recovery section.

Cover:

- database backup strategy
- point-in-time recovery if available
- recovery from accidental data deletion
- S3 versioning / backup strategy for uploaded documents
- restore process
- RTO and RPO basics
- what happens if one service fails
- what happens if the database is unavailable
- what happens if one EC2/node fails
- what happens if object storage is unavailable

Example terms to define:

- RTO: how long the system can be down before recovery.
- RPO: how much data loss is acceptable.

The document should show that the team has considered failure scenarios, not only happy-path deployment.

## 9. Keep Docker Compose As Foundation Step

Even though Kubernetes should be introduced as the target deployment architecture, the team should still start with Docker Compose locally.

Recommended progression:

1. Local Docker Compose
2. Single EC2 / simple container deployment for learning
3. Kubernetes target architecture

This keeps implementation practical while still showing industry-level architecture thinking.

## Final Expected Outcome

After this correction round, the architecture document should clearly explain:

- how the system works
- how services are separated
- how services communicate
- how authentication works through Keycloak
- how tenant isolation is enforced
- how the system is monitored
- how service health is checked
- how the system is deployed
- how the system recovers from failures

The goal is not to list technologies. The goal is to explain how the VidyaConnect system is designed, operated, monitored, secured, and recovered in a realistic environment.


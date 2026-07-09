# DevOps Plan — VidyaConnect
 
**Project:** VidyaConnect – Sri Lanka School Communication Platform  

### 1. Overview
 
This document is the master DevOps plan for VidyaConnect. It defines how the system will be built, deployed, monitored, and maintained across all environments using AWS and GitHub Actions.
 
### 2. Project Summary
 
VidyaConnect is a mobile-first, role-aware school communication platform for Sri Lankan schools. The backend is built with Node.js + Express, the database is PostgreSQL, and the mobile app is React Native. File uploads (absence letters, consent documents, assignment attachments) need secure cloud storage.
 
### 3. DevOps Goals
 
| Goal | Detail |
|---|---|
| Reliable deployment | Code pushed to GitHub automatically deploys to AWS without manual steps |
| Environment separation | Local, development, and production environments are clearly separated |
| Data security | All student data encrypted at rest and in transit |
| Cost control | Stay within AWS Free Tier limits during the 12-month pilot period |
| Observability | Errors and performance issues are detected and alerted automatically |
| Reproducibility | Any team member can set up a local environment in under 10 minutes |
 
### 4. Detailed Documents
 
Each section below summarises the approach. Full step-by-step details are in separate documents:
 
| Document | Task |
|---|---|
| `task-13-aws-account-setup.md` | AWS account types and setup process |
| `task-14-aws-services-research.md` | All AWS services used and justification |
| `task-15-backend-deployment.md` | EC2 + Docker backend deployment |
| `task-16-database-deployment.md` | RDS PostgreSQL deployment |
| `task-17-s3-file-storage.md` | S3 file storage approach |

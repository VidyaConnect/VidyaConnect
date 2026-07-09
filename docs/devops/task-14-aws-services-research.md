# Task 14: Research AWS Services Needed for VidyaConnect

**Project:** VidyaConnect – Sri Lanka School Communication Platform  
---

## 1. Overview

This document identifies and justifies every AWS service required to deploy and operate VidyaConnect. Each service is mapped to a specific need in the project — backend hosting, database, file storage, security, monitoring, and CI/CD integration.

---

## 2. VidyaConnect Infrastructure Needs

Before selecting services, here are the infrastructure requirements derived from the system design:

| Need | Description |
|---|---|
| Backend server | Run the Node.js + Express REST API continuously |
| Database | Host PostgreSQL with persistent data storage |
| File storage | Store absence letters, consent documents, assignment attachments, bulk import Excel files |
| Secret management | Store API keys, DB passwords, JWT secrets securely |
| Access control | Control who (developers, GitHub Actions) can access which AWS resources |
| Push notifications | Deliver push notifications to mobile devices |
| Monitoring & logs | Monitor server health, track errors, set alerts |
| CI/CD | Automatically deploy code from GitHub to AWS |
| Containerisation | Package the app consistently across environments |

---

## 3. Recommended AWS Services

### 3.1 Amazon EC2 — Backend Server

**What it is:** Elastic Compute Cloud. A virtual server running in the AWS cloud.

**Why for VidyaConnect:**  
The Node.js + Express REST API needs a server that runs continuously 24/7. EC2 gives full control over the server environment — you install Node.js, configure the port, and run the application directly.

**Recommended instance type:** `t2.micro` (Free Tier eligible)  
- 1 vCPU, 1 GB RAM
- Sufficient for a pilot school with ~500 concurrent users at low traffic
- Free for 750 hours/month (covers one full month continuously)

**Operating system:** Ubuntu Server 22.04 LTS

**Key concepts:**
- **Security Group** — acts as a firewall; open port 80 (HTTP), 443 (HTTPS), 22 (SSH)
- **Elastic IP** — a fixed public IP address that stays the same even if the server restarts
- **Key Pair** — SSH key used to log into the server securely

**AWS Console path:** EC2 → Instances → Launch Instance  
**Documentation:** docs.aws.amazon.com/ec2

---

### 3.2 Amazon RDS — PostgreSQL Database

**What it is:** Relational Database Service. A fully managed database hosting service.

**Why for VidyaConnect:**  
VidyaConnect uses PostgreSQL for all structured data — users, classes, announcements, assignments, attendance records, consent forms, notification logs, and audit logs. RDS manages backups, patching, and failover automatically so the team does not need to manage the database server manually.

**Recommended instance:** `db.t3.micro` (Free Tier eligible)  
- 2 vCPUs, 1 GB RAM
- 20 GB SSD storage (free tier)
- Sufficient for pilot school data volume

**Configuration:**
- Engine: PostgreSQL 15
- Multi-AZ: Disabled (not needed for pilot; enable for production)
- Automated backups: Enabled, 7-day retention
- Publicly accessible: No — only accessible from within the same VPC as EC2

**Security:**  
RDS should never be publicly accessible. The EC2 server connects to RDS using the internal VPC hostname. Database credentials are stored as environment variables on EC2, never hardcoded in code.

**AWS Console path:** RDS → Create Database → Standard Create → PostgreSQL  
**Documentation:** docs.aws.amazon.com/rds

---

### 3.3 Amazon S3 — File Storage

**What it is:** Simple Storage Service. Object storage for any type of file.

**Why for VidyaConnect:**  
VidyaConnect needs to store uploaded files from users:
- Absence letters and medical certificates (uploaded by parents)
- Consent form attachments (uploaded by admins)
- Assignment attachments (uploaded by teachers)
- Bulk import Excel files (uploaded by admins)

S3 is the industry standard for this use case — infinitely scalable, durable (99.999999999% durability), and cheap.

**Recommended configuration:**
- Bucket name: `vidyaconnect-pilot-files`
- Region: `ap-southeast-1` (Singapore)
- Block all public access: Yes — files accessed via signed URLs only
- Versioning: Disabled for MVP (enable later)
- Encryption: SSE-S3 (server-side encryption, enabled by default)

**Signed URLs:**  
When a teacher or admin needs to view an uploaded file, the backend generates a temporary signed URL (valid for 15 minutes). This means files are never publicly accessible but authorised users can view them on demand.

**Free Tier limits:** 5 GB storage, 20,000 GET requests, 2,000 PUT requests per month — sufficient for pilot.

**AWS Console path:** S3 → Create Bucket  
**Documentation:** docs.aws.amazon.com/s3

---

### 3.4 AWS IAM — Identity and Access Management

**What it is:** IAM controls who and what can access your AWS resources.

**Why for VidyaConnect:**  
Without proper IAM setup, your AWS account is a security risk. IAM allows you to:
- Create separate users for team members (no sharing root credentials)
- Create a service role for GitHub Actions to deploy code (no hardcoded AWS keys)
- Restrict what each user/service can do (least privilege principle)

**Recommended IAM setup for VidyaConnect:**

| IAM Entity | Type | Permissions | Purpose |
|---|---|---|---|
| `vidyaconnect-dev` | User | AdministratorAccess | Daily development work in console |
| `vidyaconnect-github-actions` | User | EC2 deploy + S3 access only | GitHub Actions CI/CD deployments |
| `vidyaconnect-ec2-role` | Role | S3 read/write + RDS connect | Attached to EC2 instance |
| `vidyaconnect-s3-policy` | Policy | s3:GetObject, s3:PutObject on bucket | Scoped S3 access |

**Never use root account credentials in code or GitHub Actions.**

**AWS Console path:** IAM → Users / Roles / Policies  
**Documentation:** docs.aws.amazon.com/IAM

---

### 3.5 Amazon CloudWatch — Monitoring and Logging

**What it is:** AWS monitoring service for metrics, logs, and alerts.

**Why for VidyaConnect:**  
You need to know when something goes wrong — server CPU spikes, application errors, database connections failing. CloudWatch collects this data automatically for EC2 and RDS.

**What to monitor for VidyaConnect:**

| Metric | Service | Alert threshold |
|---|---|---|
| CPUUtilization | EC2 | Alert if > 80% for 5 minutes |
| StatusCheckFailed | EC2 | Alert immediately |
| FreeStorageSpace | RDS | Alert if < 2 GB |
| DatabaseConnections | RDS | Alert if > 80 connections |
| 4XXError / 5XXError | Application logs | Alert on spike |

**Log Groups:**  
Application logs from Node.js (errors, request logs) should be sent to CloudWatch Logs using the `winston-cloudwatch` npm package. This gives searchable, persistent logs without filling up the EC2 disk.

**Free Tier:** 10 custom metrics, 1 million API requests, 5 GB log ingestion per month — sufficient for pilot.

**AWS Console path:** CloudWatch → Dashboards / Alarms / Log Groups  
**Documentation:** docs.aws.amazon.com/cloudwatch
---

## 4. Services NOT Used in MVP and Why

| Service | Reason not used in MVP |
|---|---|
| AWS Lambda | Serverless; adds complexity without benefit for a traditional REST API |
| AWS Elastic Beanstalk | Abstracts too much; harder to debug; EC2 gives more control |
| AWS ECS / EKS | Kubernetes/container orchestration — overkill for a pilot school deployment |
| AWS SES (email) | Push notifications via FCM are used instead of email |
| AWS SNS | FCM handles push notifications directly; SNS adds unnecessary routing |
| AWS Route 53 | A custom domain is optional for MVP; can be added later |
| Multi-AZ RDS | Not needed for pilot; add before full school rollout |
---

## 5. References

- AWS EC2: docs.aws.amazon.com/ec2
- AWS RDS: docs.aws.amazon.com/rds
- AWS S3: docs.aws.amazon.com/s3
- AWS IAM: docs.aws.amazon.com/IAM
- AWS CloudWatch: docs.aws.amazon.com/cloudwatch
- AWS ECR: docs.aws.amazon.com/ecr
- AWS Free Tier limits: aws.amazon.com/free

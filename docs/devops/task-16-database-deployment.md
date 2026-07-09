# Task 16: Propose PostgreSQL Database Deployment

**Project:** VidyaConnect – Sri Lanka School Communication Platform  
---

## 1. Overview

This document proposes how the VidyaConnect PostgreSQL database will be hosted on AWS. It covers the options considered, the recommended service, configuration details, security setup, backup strategy, and connection approach.

---

## 2. Database Hosting Options Considered

### Option A: Amazon RDS for PostgreSQL (Recommended)
AWS managed relational database service. AWS handles backups, patching, failover, and monitoring automatically.

| Pros | Cons |
|---|---|
| Fully managed — no manual server maintenance | Slightly higher cost than self-managed after free tier |
| Automated daily backups with point-in-time recovery | Less flexibility than self-managed |
| Free Tier eligible (db.t3.micro, 20 GB) | |
| Integrated with CloudWatch monitoring | |
| Multi-AZ failover available when needed | |
| Easy to scale up instance size | |

### Option B: PostgreSQL on EC2 (Self-Managed)
Install PostgreSQL directly on the same EC2 instance as the backend, or on a separate EC2 instance.

| Pros | Cons |
|---|---|
| No additional cost (uses existing EC2) | Manual backup setup required |
| Full control | Manual patching and maintenance |
| | If EC2 fails, both app and DB go down together |
| | Risk of data loss if disk fails |

### Option C: Supabase (Managed PostgreSQL)
Third-party managed PostgreSQL service with a generous free tier.

| Pros | Cons |
|---|---|
| Very easy setup | Not AWS — doesn't fulfil the AWS requirement |
| Free tier: 500 MB database, unlimited API calls | Project pauses after 1 week inactivity on free tier |
| Built-in REST API and Auth | Less control for custom configurations |

---

## 3. Recommendation — Amazon RDS for PostgreSQL

**Amazon RDS** is chosen because:
- It is the standard AWS managed database service — directly aligned with the mentor's requirement to use AWS
- Automated backups protect against data loss (critical for student data)
- Free Tier (db.t3.micro, 20 GB) is sufficient for a pilot school deployment
- It is isolated from the EC2 instance — if the app server crashes, the database is unaffected
- CloudWatch integration provides database monitoring out of the box

---

## 4. RDS Configuration

### 4.1 Instance Settings

| Setting | Value | Reason |
|---|---|---|
| Engine | PostgreSQL 15.x | Matches local development environment |
| Instance class | db.t3.micro | Free Tier eligible |
| Storage type | gp2 (SSD) | Good performance for low-traffic pilot |
| Allocated storage | 20 GB | Free Tier maximum; sufficient for pilot |
| Storage autoscaling | Disabled for MVP | Enable before full rollout |
| Multi-AZ | Disabled | Not needed for pilot; enable for production |
| DB instance identifier | `vidyaconnect-db` | |
| Master username | `vidyaconnect_admin` | |
| Master password | Strong generated password | Stored in AWS Secrets Manager or EC2 environment variable |

### 4.2 Network Settings

| Setting | Value | Reason |
|---|---|---|
| VPC | Same VPC as EC2 | Allows private connection |
| Subnet group | Private subnets | Database not directly internet-accessible |
| Publicly accessible | No | Security — only EC2 can connect |
| VPC security group | `vidyaconnect-db-sg` | Allow port 5432 from EC2 security group only |

### 4.3 Database Security Group Rule

| Type | Port | Source | Purpose |
|---|---|---|---|
| PostgreSQL | 5432 | EC2 security group ID | Allow backend to connect |

No other inbound rules. The database is never directly accessible from the internet.

---

## 5. RDS Setup — Step by Step

### Step 1 — Open RDS Console
AWS Console → RDS → Create Database

### Step 2 — Choose creation method
Select: **Standard Create**

### Step 3 — Engine options
- Engine type: PostgreSQL
- Engine version: PostgreSQL 15.x (latest stable)

### Step 4 — Templates
Select: **Free Tier**  
(This automatically selects db.t3.micro and disables Multi-AZ)

### Step 5 — Settings
- DB instance identifier: `vidyaconnect-db`
- Master username: `vidyaconnect_admin`
- Master password: generate a strong password and save it securely

### Step 6 — Instance configuration
- DB instance class: `db.t3.micro` (auto-selected by Free Tier template)

### Step 7 — Storage
- Storage type: gp2
- Allocated storage: 20 GB
- Enable storage autoscaling: unchecked

### Step 8 — Connectivity
- VPC: Select the default VPC (same as your EC2)
- Subnet group: default
- Public access: No
- VPC security group: Create new → name `vidyaconnect-db-sg`
- Availability Zone: ap-southeast-1a

### Step 9 — Database authentication
Select: Password authentication

### Step 10 — Additional configuration
- Initial database name: `vidyaconnect`
- Backup retention period: 7 days
- Enable automated backups: Yes
- Enable encryption: Yes (default)
- Enable CloudWatch Logs: Yes (PostgreSQL logs)

### Step 11 — Create Database
Click Create Database. Takes approximately 5–10 minutes to provision.

### Step 12 — Update Security Group
After creation:
1. Go to the RDS instance → Security group → Edit inbound rules
2. Add rule: PostgreSQL (5432) → Source: EC2 security group ID
3. Remove any rule allowing 0.0.0.0/0

---

## 6. Connecting EC2 to RDS

### Get the RDS Endpoint
RDS Console → vidyaconnect-db → Connectivity → Endpoint  
Example: `vidyaconnect-db.abc123xyz.ap-southeast-1.rds.amazonaws.com`

### Set Environment Variable on EC2
SSH into the EC2 instance and add to the `.env` file:
```env
DATABASE_URL=postgresql://vidyaconnect_admin:yourpassword@vidyaconnect-db.abc123xyz.ap-southeast-1.rds.amazonaws.com:5432/vidyaconnect
```

### Test Connection from EC2
```bash
# Install PostgreSQL client on EC2
sudo apt install -y postgresql-client

# Test connection
psql -h vidyaconnect-db.abc123xyz.ap-southeast-1.rds.amazonaws.com \
     -U vidyaconnect_admin \
     -d vidyaconnect \
     -c "SELECT version();"
```

---

## 7. Database Schema Management

**Migration tool:** Use `node-pg-migrate` or `db-migrate` for managing schema changes.

**Process:**
- All schema changes are written as numbered migration files (e.g., `001_create_users.sql`)
- Migrations run automatically during deployment via GitHub Actions
- Never modify the database schema manually on the production server

**Migration folder structure:**
```
backend/
└── migrations/
    ├── 001_create_users.sql
    ├── 002_create_classes.sql
    ├── 003_create_announcements.sql
    ├── 004_create_assignments.sql
    ├── 005_create_attendance.sql
    ├── 006_create_consent_forms.sql
    └── 007_create_notifications.sql
```

---

## 8. Backup Strategy

| Backup type | Frequency | Retention | Managed by |
|---|---|---|---|
| Automated RDS backup | Daily | 7 days | AWS RDS (automatic) |
| Manual snapshot | Before major deployments | Until manually deleted | DevOps team |
| Point-in-time recovery | Any point in last 7 days | 7 days | AWS RDS (automatic) |

**How to take a manual snapshot:**  
RDS Console → vidyaconnect-db → Actions → Take Snapshot → name: `vidyaconnect-pre-deploy-YYYY-MM-DD`

---

## 9. Monitoring

CloudWatch automatically collects these RDS metrics:

| Metric | Alert threshold | Action |
|---|---|---|
| FreeStorageSpace | < 2 GB | Investigate data growth |
| CPUUtilization | > 80% for 10 min | Review slow queries |
| DatabaseConnections | > 80 | Check for connection pool leak |
| FreeableMemory | < 100 MB | Consider upgrade to db.t3.small |

Set up CloudWatch alarms:  
CloudWatch → Alarms → Create Alarm → Select RDS metric → Set threshold → Notify via email

---

## 10. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| RDS free tier storage fills up (20 GB limit) | High | Monitor FreeStorageSpace; clean up old bulk import files |
| RDS instance connection limit exceeded | Medium | Use a connection pooler (pg-pool in Node.js) with max 10 connections |
| Accidental data deletion | High | Automated backups enabled; point-in-time recovery available |
| RDS endpoint changes after recreation | Medium | Always use endpoint hostname (not IP); update .env if endpoint changes |
| Free tier expires after 12 months | Medium | Budget ~$13/month for db.t3.micro after free tier; or migrate to smaller plan |

---

## 11. References

- AWS RDS PostgreSQL: docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html
- AWS RDS Free Tier: aws.amazon.com/rds/free
- PostgreSQL 15 documentation: postgresql.org/docs/15
- node-pg-migrate: github.com/salsita/node-pg-migrate
- AWS RDS security best practices: docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.Security.html

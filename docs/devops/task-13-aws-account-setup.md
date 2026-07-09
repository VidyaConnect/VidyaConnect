# Task 13: Research AWS Educate and AWS Account Setup

**Project:** SchoolLink – Sri Lanka School Communication Platform   

## 1. Overview

This document covers the research into AWS account types, a comparison of options suitable for the SchoolLink project, the recommended account choice, and the step-by-step setup process.

---

## 2. AWS Account Types — Comparison

There are three realistic options for a student project like SchoolLink.

### 2.1 AWS Educate

AWS Educate is Amazon's free learning programme for students and educators. It provides access to AWS services through a sandbox environment and learning resources.

| Item | Detail |
|---|---|
| Cost | Free |
| Credits | AWS Educate Starter Account provides sandbox access (no credit card needed) |
| Services available | Limited subset of AWS services via Vocareum sandbox |
| Account expiry | Session-based; sandbox resets between sessions in some modes |
| Persistent resources | Not always — some sandbox accounts lose resources between sessions |
| Sign up requirement | University email (.ac.lk or .edu) |
| Best for | Learning AWS concepts, completing badge courses, experimenting |
| Link | aws.amazon.com/education/awseducate |

**Limitation for SchoolLink:** AWS Educate sandbox environments are not suitable for hosting a persistent application. Resources may reset between sessions, meaning your database and server cannot stay running continuously. It is excellent for learning but not for deployment.

---

### 2.2 AWS Free Tier (Personal Account)

AWS Free Tier is a standard AWS account with 12 months of free usage limits on core services. It requires a credit or debit card for identity verification but does not charge if you stay within free tier limits.

| Item | Detail |
|---|---|
| Cost | Free for 12 months within limits |
| Credit card | Required for verification (not charged within limits) |
| EC2 | 750 hours/month — t2.micro or t3.micro instance |
| RDS | 750 hours/month — db.t3.micro, 20 GB storage |
| S3 | 5 GB storage, 20,000 GET requests, 2,000 PUT requests/month |
| Data transfer | 100 GB out per month free |
| Account expiry | Does not expire (free tier expires after 12 months but account remains) |
| Persistent resources | Yes — resources stay running continuously |
| Best for | Hosting a real application with persistent uptime |
| Link | aws.amazon.com/free |

**Advantage for SchoolLink:** Resources are persistent. Your Node.js backend, PostgreSQL database, and S3 file storage stay running continuously — exactly what a pilot school needs.

---

### 2.3 GitHub Student Developer Pack (AWS Credits via Activate)

GitHub Education partners with AWS to provide students with AWS Activate credits (typically $100–$200 USD) through the GitHub Student Developer Pack.

| Item | Detail |
|---|---|
| Cost | Free |
| Credits | Up to $100 USD AWS credits (varies by offer) |
| Requirement | GitHub Student Developer Pack approval (university email + student ID) |
| Credit card | Not required to start; needed to redeem AWS credits |
| Persistent resources | Yes |
| Best for | Teams who want real AWS hosting with more credit headroom |
| Link | education.github.com/pack |

---

## 3. Comparison Summary

| Feature | AWS Educate | AWS Free Tier | GitHub Student Pack |
|---|---|---|---|
| Cost | Free | Free (within limits) | Free |
| Credit card needed | No | Yes | No (to start) |
| Persistent hosting | No (sandbox resets) | Yes | Yes |
| EC2 (backend server) | Limited | Yes (t2.micro) | Yes |
| RDS PostgreSQL | Limited | Yes (db.t3.micro) | Yes |
| S3 file storage | Limited | Yes (5 GB) | Yes |
| CI/CD integration | No | Yes | Yes |
| Best use | Learning only | Project deployment | Project deployment |

---

## 4. Recommendation for SchoolLink

**Primary: AWS Free Tier (Personal Account)**

AWS Free Tier is the recommended account type for deploying SchoolLink because:

- Resources are **persistent** — the backend server, database, and file storage stay running continuously without resetting
- Free tier limits are sufficient for a pilot school deployment (one school, ~500 users, low traffic)
- All services needed for SchoolLink (EC2, RDS, S3, IAM, CloudWatch) are available
- GitHub Actions CI/CD integrates directly with AWS Free Tier accounts

**Secondary: AWS Educate**

AWS Educate should be used alongside the Free Tier account for:
- Completing learning badges and courses (already done — AWS Fundamentals badge earned)
- Experimenting with AWS services without risk to the production account

---

## 5. AWS Free Tier Account Setup — Step by Step

### Step 1 — Go to the AWS Free Tier page
Visit: **aws.amazon.com/free**  
Click **"Create a Free Account"**

### Step 2 — Enter your email and account name
- Use a personal email address (Gmail is fine)
- Account name suggestion: `schoollink-project` or your name
- Click **"Verify email address"**
- Enter the verification code sent to your email

### Step 3 — Set root user password
- Create a strong password (minimum 8 characters, mix of letters, numbers, symbols)
- Store this password securely — this is the root account

### Step 4 — Enter contact information
- Select **Personal** account type
- Fill in your full name, phone number, and address
- Country: Sri Lanka

### Step 5 — Enter payment information
- A valid credit or debit card is required
- AWS charges a small temporary authorisation hold ($1 USD) which is refunded
- You will **not be charged** as long as you stay within free tier limits
- Visa and Mastercard debit cards issued by Sri Lankan banks (Sampath, Commercial Bank, HNB) are accepted

### Step 6 — Identity verification
- AWS will call your phone number or send an SMS with a PIN
- Enter the PIN to verify your identity

### Step 7 — Select a support plan
- Choose **Basic Support (Free)**
- Do not select Developer or Business support plans (these cost money)

### Step 8 — Sign in to the AWS Console
- Go to **console.aws.amazon.com**
- Sign in with your email and password
- You are now in the AWS Management Console

### Step 9 — Set your default region
- In the top-right corner, click the region dropdown
- Select **Asia Pacific (Singapore) — ap-southeast-1**
- This is the closest AWS region to Sri Lanka with full service availability

### Step 10 — Enable MFA on root account (Security — Important)
- Go to **IAM → Security recommendations → Add MFA**
- Use Google Authenticator or Authy on your phone
- This protects your account from unauthorised access

### Step 11 — Create an IAM user for daily use
- Go to **IAM → Users → Create user**
- Username: `schoollink-dev`
- Attach policy: `AdministratorAccess` (for development)
- Enable console access with a password
- **Do not use the root account for daily work** — use this IAM user

---

## 6. Free Tier Usage Limits to Monitor

| Service | Free Limit | SchoolLink Usage Estimate |
|---|---|---|
| EC2 t2.micro | 750 hours/month | ~720 hours (1 instance running all month)  |
| RDS db.t3.micro | 750 hours/month | ~720 hours (1 instance)  |
| RDS Storage | 20 GB | ~2–5 GB for pilot  |
| S3 Storage | 5 GB | ~1–2 GB for pilot  |
| S3 GET requests | 20,000/month | Within range for pilot  |
| Data transfer out | 15 GB/month | Within range for pilot  |

Set up a **billing alert** to notify you if charges approach $1 USD:  
Go to **Billing → Budgets → Create budget → Zero spend budget**

---

## 7. References

- AWS Free Tier details: aws.amazon.com/free
- AWS Educate: aws.amazon.com/education/awseducate
- GitHub Student Developer Pack: education.github.com/pack
- AWS IAM best practices: docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- AWS Regions and endpoints: aws.amazon.com/about-aws/global-infrastructure/regions_az

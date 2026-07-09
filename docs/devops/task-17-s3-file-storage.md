# Task 17: Propose S3 File Storage Approach

**Project:** VidyaConnect – Sri Lanka School Communication Platform  
---

## 1. Overview

This document proposes how file storage will be handled in VidyaConnect using Amazon S3. It covers what files need to be stored, the bucket structure, security configuration, upload and access flow, and integration with the Node.js backend.

---

## 2. What Files VidyaConnect Needs to Store

| File Type | Uploaded by | Accessed by | Sensitivity |
|---|---|---|---|
| Absence letters / Medical certificates (MCs) | Parent / Guardian | Teacher, Admin | High — private student data |
| Consent form attachments | Admin | Parents | Medium |
| Assignment attachments | Teacher | Parents, Students | Low |
| Bulk import Excel files | Admin | Admin only | High — contains all student/parent data |

All files must be stored securely. No file should be publicly accessible via a direct URL.

---

## 3. Storage Options Considered

### Option A: Amazon S3 (Recommended)
AWS object storage service. Industry standard for file storage in web applications.

| Pros | Cons |
|---|---|
| Free Tier: 5 GB storage, 20K GET, 2K PUT/month | Requires AWS SDK integration in backend |
| 99.999999999% durability | |
| Signed URLs for secure private access | |
| Fine-grained IAM access control | |
| Integrates directly with EC2 and RDS stack | |
| Scales to unlimited storage | |

### Option B: Supabase Storage
Third-party managed file storage built on S3 underneath.

| Pros | Cons |
|---|---|
| Simple API | Not AWS — doesn't meet mentor's AWS requirement |
| Free tier available | Less control over security policies |
| | Project pauses after 1 week inactivity |

### Option C: Store files on EC2 disk
Save uploaded files directly to the EC2 server's filesystem.

| Pros | Cons |
|---|---|
| No additional service needed | Files lost if EC2 instance is terminated |
| | EC2 disk is limited (20 GB total, shared with OS and app) |
| | No redundancy — single point of failure |
| | Does not scale |

---

## 4. Recommendation — Amazon S3

Amazon S3 is chosen because:
- It is the AWS standard for file storage and directly required by the mentor
- Files are stored independently of the EC2 server — if EC2 is terminated, files are safe
- Signed URLs ensure files are never publicly accessible
- Free Tier is sufficient for the pilot school deployment
- The Node.js AWS SDK (`@aws-sdk/client-s3`) makes integration straightforward

---

## 5. S3 Bucket Structure

### 5.1 Bucket Design

**One bucket per environment:**

| Bucket Name | Environment | Purpose |
|---|---|---|
| `vidyaconnect-dev-files` | Development | Dev and testing uploads |
| `vidyaconnect-prod-files` | Production/Demo | Pilot school live data |

### 5.2 Folder Structure Inside Bucket

```
vidyaconnect-prod-files/
├── absence-documents/
│   └── {schoolId}/{studentId}/{year}/{month}/
│       └── {timestamp}-{filename}.pdf
├── consent-attachments/
│   └── {schoolId}/{formId}/
│       └── {timestamp}-{filename}.pdf
├── assignment-attachments/
│   └── {schoolId}/{classId}/{assignmentId}/
│       └── {timestamp}-{filename}.pdf
└── bulk-imports/
    └── {schoolId}/{year}/
        └── {timestamp}-students.xlsx
```

This structure ensures:
- Files are organised by school (supports future multi-school expansion)
- Easy to audit what was uploaded when
- Folder-level IAM policies can restrict access by school

---

## 6. S3 Bucket Configuration

### 6.1 Create the Bucket — Step by Step

1. AWS Console → S3 → Create Bucket
2. Bucket name: `vidyaconnect-prod-files`
3. Region: `ap-southeast-1` (Singapore — closest to Sri Lanka)
4. Object Ownership: ACLs disabled (recommended)
5. Block all public access: **Yes — enable all four options**
6. Bucket versioning: Disabled for MVP
7. Default encryption: SSE-S3 (Amazon S3 managed keys) — enabled by default
8. Click Create Bucket

### 6.2 Bucket Policy — Restrict Access to EC2 Role Only

After creating the bucket, add this bucket policy (replace `ACCOUNT-ID` and role name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEC2RoleAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:role/vidyaconnect-ec2-role"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::vidyaconnect-prod-files/*"
    }
  ]
}
```

This means only the EC2 instance (via its IAM role) can read, write, or delete files. No public access. No other AWS users.

---

## 7. File Upload and Access Flow

### 7.1 File Upload Flow (Example: Parent uploads absence letter)

```
1. Parent selects file in mobile app
2. React Native app sends file to Node.js backend via multipart/form-data POST
3. Backend receives file using multer (npm package)
4. Backend validates: file type (PDF, JPG, PNG only), file size (max 5 MB)
5. Backend generates unique S3 key:
   absence-documents/{schoolId}/{studentId}/2026/07/{timestamp}-letter.pdf
6. Backend uploads file to S3 using AWS SDK:
   s3.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }))
7. Backend saves the S3 key (not the URL) to PostgreSQL attendance record
8. Backend returns success response to mobile app
```

### 7.2 File Access Flow (Example: Teacher views absence letter)

```
1. Teacher opens student's absence record in app
2. React Native app requests the document via GET /attendance/{id}/document
3. Backend checks: is this teacher assigned to this student's class? (RBAC check)
4. If authorised: backend generates a signed URL from S3:
   s3.send(new GetSignedUrlCommand({ Bucket, Key, expiresIn: 900 }))
   (signed URL valid for 15 minutes)
5. Backend returns the signed URL to the app
6. App opens the signed URL in the device browser or in-app PDF viewer
7. After 15 minutes the signed URL expires — cannot be shared or reused
```

---

## 8. Backend Integration — Node.js AWS SDK

### 8.1 Install AWS SDK
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer
```

### 8.2 S3 Client Configuration
```javascript
// src/config/s3.js
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,           // ap-southeast-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3Client;
```

### 8.3 Upload Function
```javascript
// src/services/storageService.js
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');

async function uploadFile(fileBuffer, key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });
  await s3Client.send(command);
  return key; // Save this key in PostgreSQL, not the URL
}

module.exports = { uploadFile };
```

### 8.4 Generate Signed URL Function
```javascript
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

async function getFileUrl(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });
  // URL valid for 15 minutes (900 seconds)
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
}

module.exports = { uploadFile, getFileUrl };
```

---

## 9. Security Rules

| Rule | Detail |
|---|---|
| Block all public access | Enabled on bucket — no file is ever publicly accessible |
| Signed URLs only | All file access goes through the backend which checks permissions first |
| File type validation | Backend accepts only PDF, JPG, PNG — rejects executables and scripts |
| File size limit | Maximum 5 MB per file (enforced by multer on the backend) |
| S3 key never exposed | Only the S3 key is stored in PostgreSQL; signed URLs are generated on demand |
| IAM least privilege | EC2 role has only s3:GetObject, s3:PutObject, s3:DeleteObject on the specific bucket |
| Encryption at rest | SSE-S3 encryption enabled by default on all objects |
| Encryption in transit | All S3 API calls use HTTPS |

---

## 10. Environment Variables Required

```env
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=vidyaconnect-prod-files
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

These are stored in the `.env` file on EC2. Never committed to GitHub.

---

## 11. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Free tier S3 storage exceeded (5 GB) | Low | Monitor S3 usage in AWS Console; pilot school unlikely to exceed 5 GB |
| Sensitive file leaked via shared signed URL | High | Signed URLs expire in 15 minutes; educate users not to share links |
| Wrong file type uploaded (malicious file) | High | Validate MIME type and file extension on backend before upload |
| S3 key not saved to DB after upload (partial failure) | Medium | Wrap upload and DB insert in try-catch; if DB save fails, delete the S3 object |
| Bucket accidentally made public | Critical | Enable S3 Block Public Access at account level — applies to all buckets |

---

## 12. References

- Amazon S3 documentation: docs.aws.amazon.com/s3
- AWS SDK for JavaScript v3: docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest
- S3 presigned URLs: docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html
- multer npm package: github.com/expressjs/multer
- AWS S3 security best practices: docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html
- AWS S3 Free Tier: aws.amazon.com/s3/pricing

# LocalStack S3 Test Steps

## Overview

This document describes how to test Amazon S3 functionality locally using LocalStack before deploying to AWS.

The purpose is to allow developers to verify file upload and download functionality without requiring access to real AWS services.

---

## Prerequisites

The following services should be running:

- Docker Desktop
- Docker Compose
- PostgreSQL
- LocalStack
- Backend API

---

## Start Local Environment

Run the local Docker environment.

```bash
docker compose -f infra/docker/docker-compose.local.yml up
```

---

## Verify LocalStack

Confirm LocalStack is running.

```bash
http://localhost:4566
```

---

## Create Local S3 Bucket

Create the bucket using AWS CLI.

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://vidyaconnect-files
```

---

## Test File Upload

Request a signed upload URL from the backend.

Upload a sample file using the generated URL.

Expected Result:

- Upload succeeds.
- File is stored in the LocalStack S3 bucket.

---

## Test File Download

Request a signed download URL.

Open the generated URL.

Expected Result:

- The requested file downloads successfully.

---

## Verify Database

Confirm that file metadata has been stored in PostgreSQL.

Verify:

- File ID
- File Name
- Content Type
- School ID
- Uploaded By
- Upload Timestamp

---

## Access Control Test

Attempt to access a file belonging to another school.

Expected Result:

- HTTP 403 Forbidden
- Access attempt recorded in audit logs

---

## Expected Outcome

Successful testing confirms that:

- LocalStack S3 is operational.
- File uploads work correctly.
- File downloads work correctly.
- File metadata is stored in PostgreSQL.
- Access control is enforced before generating signed URLs.

# Story 9: Set Up LocalStack S3 for File Handling

## Goal

Simulate AWS S3 locally before using real AWS.

## Tasks

- Configure LocalStack S3.
- Create local bucket.
- Configure file-service to use LocalStack endpoint.
- Implement signed upload URL flow.
- Implement signed download URL flow.
- Store file metadata in PostgreSQL.
- Enforce access checks before URL generation.
- Document local S3 test steps.

## Acceptance Criteria

- File upload works locally through LocalStack S3.
- File download works locally through LocalStack S3.
- File metadata is stored in PostgreSQL.
- Access checks happen before URL generation.

## Suggested Labels

`story`, `files`, `localstack`, `s3`


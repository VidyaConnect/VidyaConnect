# Phase 3: Attendance and File Upload Slice

## Target Dates

2026-08-05 to 2026-08-18

## Goal

Build the attendance flow and absence response flow, including local file upload using LocalStack S3.

## Tasks

- Implement attendance-service.
- Add attendance schema/table.
- Add attendance marking endpoint.
- Add attendance history endpoint.
- Add teacher attendance marking UI.
- Add parent attendance history UI.
- Add absence reason submission endpoint.
- Add absence reason UI.
- Configure LocalStack S3.
- Add file-service signed upload/download URL flow.
- Store file metadata in PostgreSQL.
- Link uploaded absence document to absence record.

## Acceptance Criteria

- Teacher can mark student as Present, Absent, or Late.
- Parent can view absence record.
- Parent can submit absence reason.
- Parent can upload document locally using LocalStack S3.
- Teacher/Admin can view submitted reason and file metadata.
- Tenant isolation is enforced.

## Suggested Labels

`phase`, `attendance`, `files`, `localstack`


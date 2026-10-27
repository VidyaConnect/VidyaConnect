-- Align demo attendance data with the school-user demo class tenant.
UPDATE "attendance"."class_roster_entries"
SET "schoolId" = 'seed-school-vidyaconnect', "updatedAt" = NOW()
WHERE "classId" = 'seed-class-assignment-demo'
  AND "schoolId" = '11111111-1111-1111-1111-111111111111';

UPDATE "attendance"."attendance_records"
SET "schoolId" = 'seed-school-vidyaconnect', "updatedAt" = NOW()
WHERE "classId" = 'seed-class-assignment-demo'
  AND "schoolId" = '11111111-1111-1111-1111-111111111111';

UPDATE "attendance"."absence_responses" AS responses
SET "schoolId" = 'seed-school-vidyaconnect', "updatedAt" = NOW()
FROM "attendance"."attendance_records" AS records
WHERE responses."attendanceRecordId" = records."id"
  AND records."classId" = 'seed-class-assignment-demo'
  AND records."schoolId" = 'seed-school-vidyaconnect';

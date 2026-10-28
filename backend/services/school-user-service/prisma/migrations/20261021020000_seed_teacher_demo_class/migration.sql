-- Local demo school's seed tenant and teacher-owned class for role demonstrations.

UPDATE "school_user"."users" SET "schoolId"='seed-school-vidyaconnect', "updatedAt"=NOW()
WHERE "email" IN ('testuser1admin@vidyaconnect.local','testuser1student@vidyaconnect.local','testuser1teacher@vidyaconnect.local');

INSERT INTO "school_user"."teachers" ("id", "userId", "schoolId", "isActive", "createdAt", "updatedAt")
SELECT 'seed-teacher-testuser1teacher', u."id", 'seed-school-vidyaconnect', TRUE, NOW(), NOW()
FROM "school_user"."users" u
WHERE u."email" = 'testuser1teacher@vidyaconnect.local'
ON CONFLICT ("userId") DO UPDATE SET "schoolId"=EXCLUDED."schoolId", "isActive"=TRUE, "updatedAt"=NOW();

INSERT INTO "school_user"."classes" ("id", "schoolId", "classTeacherId", "className", "gradeLevel", "academicYear", "isActive", "createdAt", "updatedAt")
VALUES ('seed-class-assignment-demo', 'seed-school-vidyaconnect', 'seed-teacher-testuser1teacher', 'Grade 10-A Mathematics', '10', '2026', TRUE, NOW(), NOW())
ON CONFLICT ("classTeacherId") DO UPDATE SET "className"=EXCLUDED."className", "gradeLevel"=EXCLUDED."gradeLevel", "academicYear"=EXCLUDED."academicYear", "isActive"=TRUE, "updatedAt"=NOW();



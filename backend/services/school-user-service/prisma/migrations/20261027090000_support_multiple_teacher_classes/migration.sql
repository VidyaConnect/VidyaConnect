-- Teachers may teach more than one class. Keep the existing teacher-to-class
-- relation, but remove the one-to-one uniqueness constraint.
DROP INDEX IF EXISTS "school_user"."classes_classTeacherId_key";
CREATE INDEX IF NOT EXISTS "classes_classTeacherId_idx"
  ON "school_user"."classes"("classTeacherId");

-- Add the requested second class for the local demo teacher. The composite
-- class identity makes this safe to apply in databases that already have it.
INSERT INTO "school_user"."classes"
  ("id", "schoolId", "classTeacherId", "className", "gradeLevel", "academicYear", "isActive", "createdAt", "updatedAt")
VALUES
  ('seed-class-assignment-demo-9a', 'seed-school-vidyaconnect', 'seed-teacher-testuser1teacher', 'Grade 9-A Mathematics', '9', '2026', TRUE, NOW(), NOW())
ON CONFLICT ("schoolId", "className", "gradeLevel", "academicYear")
DO UPDATE SET
  "classTeacherId" = EXCLUDED."classTeacherId",
  "isActive" = TRUE,
  "updatedAt" = NOW();

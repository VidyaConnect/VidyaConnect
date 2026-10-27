-- Keep the seeded assignment demo teacher, teacher profile, and assigned class
-- in the same demo school tenant, including databases where a class existed first.
UPDATE "school_user"."users"
SET "schoolId" = 'seed-school-vidyaconnect', "updatedAt" = NOW()
WHERE "email" = 'testuser1teacher@vidyaconnect.local';

UPDATE "school_user"."teachers" AS teacher
SET "schoolId" = 'seed-school-vidyaconnect', "updatedAt" = NOW()
FROM "school_user"."users" AS users
WHERE teacher."userId" = users."id"
  AND users."email" = 'testuser1teacher@vidyaconnect.local';

UPDATE "school_user"."classes" AS class
SET "schoolId" = 'seed-school-vidyaconnect', "updatedAt" = NOW()
FROM "school_user"."teachers" AS teacher
JOIN "school_user"."users" AS users ON users."id" = teacher."userId"
WHERE class."classTeacherId" = teacher."id"
  AND users."email" = 'testuser1teacher@vidyaconnect.local';

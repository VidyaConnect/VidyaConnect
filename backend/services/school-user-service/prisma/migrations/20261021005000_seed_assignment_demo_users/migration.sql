-- Ensure the demo school exists before user foreign keys are inserted.
INSERT INTO "school_user"."schools" ("id", "name", "email", "isActive", "schoolType", "principalName", "region", "district", "studentCount", "teacherCount", "status", "adminEmail", "adminFirstName", "adminLastName", "createdAt", "updatedAt")
VALUES ('seed-school-vidyaconnect', 'VidyaConnect Demo School', 'demo-school@vidyaconnect.local', TRUE, 'Public', 'Demo Principal', 'Western', 'Colombo', 5, 1, 'APPROVED', 'testuser1admin@vidyaconnect.local', 'Test', 'ADMIN', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET "isActive"=TRUE, "status"='APPROVED', "updatedAt"=NOW();
INSERT INTO "school_user"."users" ("id", "keycloakId", "schoolId", "fullName", "email", "role", "isActive", "createdAt", "updatedAt")
VALUES
  ('seed-user-testuser1admin', 'e4bc57b6-92c1-41e3-b180-1fc2e30433d9', 'seed-school-vidyaconnect', 'Test ADMIN', 'testuser1admin@vidyaconnect.local', 'ADMIN', TRUE, NOW(), NOW()),
  ('seed-user-testuser1student', '8bc52444-a478-4049-9862-19ee98900534', 'seed-school-vidyaconnect', 'Test STUDENT', 'testuser1student@vidyaconnect.local', 'STUDENT', TRUE, NOW(), NOW()),
  ('seed-user-testuser1teacher', '5e00f0fc-a022-4ae1-a495-90afaee256dd', 'seed-school-vidyaconnect', 'Test TEACHER', 'testuser1teacher@vidyaconnect.local', 'TEACHER', TRUE, NOW(), NOW())
ON CONFLICT ("email") DO UPDATE SET
  "keycloakId" = EXCLUDED."keycloakId",
  "schoolId" = EXCLUDED."schoolId",
  "fullName" = EXCLUDED."fullName",
  "role" = EXCLUDED."role",
  "isActive" = TRUE,
  "updatedAt" = NOW();





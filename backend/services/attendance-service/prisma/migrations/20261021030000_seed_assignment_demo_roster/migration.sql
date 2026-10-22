INSERT INTO "attendance"."class_roster_entries" ("id", "schoolId", "classId", "className", "studentId", "studentName", "rollNumber", "isActive", "createdAt", "updatedAt")
VALUES
  ('assignment-demo-roster-001', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', 'assignment-demo-student-001', 'Alex Rivera', '10A001', TRUE, NOW(), NOW()),
  ('assignment-demo-roster-002', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', 'assignment-demo-student-002', 'Elena Rodriguez', '10A002', TRUE, NOW(), NOW()),
  ('assignment-demo-roster-003', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', 'assignment-demo-student-003', 'Marcus Chen', '10A003', TRUE, NOW(), NOW()),
  ('assignment-demo-roster-004', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', 'assignment-demo-student-004', 'Priya Fernando', '10A004', TRUE, NOW(), NOW()),
  ('assignment-demo-roster-005', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', 'assignment-demo-student-005', 'Dinuka Perera', '10A005', TRUE, NOW(), NOW())
ON CONFLICT ("schoolId", "studentId") DO UPDATE SET
  "classId" = EXCLUDED."classId",
  "className" = EXCLUDED."className",
  "studentName" = EXCLUDED."studentName",
  "rollNumber" = EXCLUDED."rollNumber",
  "isActive" = TRUE,
  "updatedAt" = NOW();

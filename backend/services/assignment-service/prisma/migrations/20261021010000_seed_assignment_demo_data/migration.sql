INSERT INTO "assignment"."assignments" ("id", "schoolId", "classId", "className", "teacherId", "teacherName", "title", "description", "subject", "dueAt", "publishAt", "publishedAt", "status", "createdAt", "updatedAt")
VALUES
  ('assignment-demo-math-01', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', '5e00f0fc-a022-4ae1-a495-90afaee256dd', 'Test TEACHER', 'Quadratic Equations Practice Set', 'Complete activities 1–5 in the mathematics textbook. Write your answers on paper and hand them to your teacher at school.', 'Mathematics', NOW() + INTERVAL '7 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 'PUBLISHED', NOW(), NOW()),
  ('assignment-demo-math-02', 'seed-school-vidyaconnect', 'seed-class-assignment-demo', 'Grade 10-A Mathematics', '5e00f0fc-a022-4ae1-a495-90afaee256dd', 'Test TEACHER', 'Geometry Review', 'Review the assigned geometry exercises and hand in your answer sheets at school.', 'Mathematics', NOW() + INTERVAL '14 days', NOW(), NOW(), 'PUBLISHED', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "assignment"."assignment_student_statuses" ("id", "assignmentId", "schoolId", "studentId", "studentName", "rollNumber", "status", "marks", "feedback", "markedAt", "createdAt", "updatedAt")
VALUES
  ('assignment-demo-status-001', 'assignment-demo-math-01', 'seed-school-vidyaconnect', 'assignment-demo-student-001', 'Alex Rivera', '10A001', 'COMPLETED', 92, 'Clear working and accurate answers.', NOW(), NOW(), NOW()),
  ('assignment-demo-status-002', 'assignment-demo-math-01', 'seed-school-vidyaconnect', 'assignment-demo-student-002', 'Elena Rodriguez', '10A002', 'COMPLETED', 86, 'Good effort. Review question four.', NOW(), NOW(), NOW()),
  ('assignment-demo-status-003', 'assignment-demo-math-01', 'seed-school-vidyaconnect', 'assignment-demo-student-003', 'Marcus Chen', '10A003', 'COMPLETED', 78, 'Please show more steps in your calculations.', NOW(), NOW(), NOW()),
  ('assignment-demo-status-004', 'assignment-demo-math-01', 'seed-school-vidyaconnect', 'assignment-demo-student-004', 'Priya Fernando', '10A004', 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
  ('assignment-demo-status-005', 'assignment-demo-math-01', 'seed-school-vidyaconnect', 'assignment-demo-student-005', 'Dinuka Perera', '10A005', 'MISSING', NULL, NULL, NOW(), NOW(), NOW()),
  ('assignment-demo-status-006', 'assignment-demo-math-02', 'seed-school-vidyaconnect', 'assignment-demo-student-001', 'Alex Rivera', '10A001', 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
  ('assignment-demo-status-007', 'assignment-demo-math-02', 'seed-school-vidyaconnect', 'assignment-demo-student-002', 'Elena Rodriguez', '10A002', 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
  ('assignment-demo-status-008', 'assignment-demo-math-02', 'seed-school-vidyaconnect', 'assignment-demo-student-003', 'Marcus Chen', '10A003', 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
  ('assignment-demo-status-009', 'assignment-demo-math-02', 'seed-school-vidyaconnect', 'assignment-demo-student-004', 'Priya Fernando', '10A004', 'PENDING', NULL, NULL, NULL, NOW(), NOW()),
  ('assignment-demo-status-010', 'assignment-demo-math-02', 'seed-school-vidyaconnect', 'assignment-demo-student-005', 'Dinuka Perera', '10A005', 'PENDING', NULL, NULL, NULL, NOW(), NOW())
ON CONFLICT ("assignmentId", "studentId") DO NOTHING;


ALTER TABLE "assignment"."assignments" ADD CONSTRAINT "assignments_due_after_publish_check" CHECK ("dueAt" > "publishAt");


BEGIN;

-- Remove earlier test data (only these two schools)
DELETE FROM school_user.students WHERE "schoolId" IN (SELECT id FROM school_user.schools WHERE email IN ('chat-school@test.local','office@vidyamv.lk'));
DELETE FROM school_user.classes  WHERE "schoolId" IN (SELECT id FROM school_user.schools WHERE email IN ('chat-school@test.local','office@vidyamv.lk'));
DELETE FROM school_user.parents  WHERE "schoolId" IN (SELECT id FROM school_user.schools WHERE email IN ('chat-school@test.local','office@vidyamv.lk'));
DELETE FROM school_user.teachers WHERE "schoolId" IN (SELECT id FROM school_user.schools WHERE email IN ('chat-school@test.local','office@vidyamv.lk'));
DELETE FROM school_user.users    WHERE "schoolId" IN (SELECT id FROM school_user.schools WHERE email IN ('chat-school@test.local','office@vidyamv.lk'));
DELETE FROM school_user.schools  WHERE email IN ('chat-school@test.local','office@vidyamv.lk');

DO $$
DECLARE
  sid text := gen_random_uuid()::text;
  t1u text := gen_random_uuid()::text;  t1 text := gen_random_uuid()::text;
  t2u text := gen_random_uuid()::text;  t2 text := gen_random_uuid()::text;
  c1 text := gen_random_uuid()::text;   c2 text := gen_random_uuid()::text;
  pu text; p text; su text; i int;
  parents  text[] := ARRAY['Mrs. Perera','Mr. Fernando','Mrs. Jayasinghe','Mr. Wickramasinghe','Mrs. Rajapaksa','Mr. Bandara','Mrs. De Mel','Mr. Kumar','Mrs. Gunawardena','Mr. Senanayake'];
  students text[] := ARRAY['Kavindu Perera','Nethmi Fernando','Sahan Jayasinghe','Dilini Wickramasinghe','Ishara Rajapaksa','Tharushi Bandara','Ravindu De Mel','Arjun Kumar','Hiruni Gunawardena','Dasun Senanayake'];
  genders  text[] := ARRAY['Male','Female','Male','Female','Female','Female','Male','Male','Female','Male'];
BEGIN
  INSERT INTO school_user.schools (id,name,email,phone,address,"schoolType","principalName",region,district,"studentCount","teacherCount","adminEmail","adminFirstName","adminLastName","updatedAt")
  VALUES (sid,'Vidya Maha Vidyalaya','office@vidyamv.lk','0112345678','No. 25, School Lane, Colombo 07','Government','Mr. Anura Dissanayake','Western','Colombo',10,2,'admin@vidyamv.lk','Nimali','Rathnayake',now());

  INSERT INTO school_user.users (id,"keycloakId","schoolId","fullName",email,phone,role,"updatedAt") VALUES
    (t1u,'b7e1a2c4-1111-4a5b-9c3d-2f8e6a1d0001',sid,'Mrs. Silva','silva@vidyamv.lk','0771234501','TEACHER',now()),
    (t2u,'b7e1a2c4-3333-4a5b-9c3d-2f8e6a1d0003',sid,'Mr. Jayawardena','jayawardena@vidyamv.lk','0771234502','TEACHER',now());
  INSERT INTO school_user.teachers (id,"userId","schoolId","updatedAt") VALUES (t1,t1u,sid,now()),(t2,t2u,sid,now());

  INSERT INTO school_user.classes (id,"schoolId","classTeacherId","className","gradeLevel","academicYear","updatedAt") VALUES
    (c1,sid,t1,'8-A','8','2026',now()),
    (c2,sid,t2,'8-B','8','2026',now());

  FOR i IN 1..10 LOOP
    pu := gen_random_uuid()::text; p := gen_random_uuid()::text; su := gen_random_uuid()::text;

    INSERT INTO school_user.users (id,"keycloakId","schoolId","fullName",email,phone,role,"updatedAt")
    VALUES (pu,
            CASE WHEN i = 1 THEN 'b7e1a2c4-2222-4a5b-9c3d-2f8e6a1d0002' ELSE gen_random_uuid()::text END,
            sid, parents[i], format('parent%s@vidyamv.lk', i), format('07712346%s', lpad(i::text,2,'0')), 'PARENT', now());
    INSERT INTO school_user.parents (id,"userId","schoolId","updatedAt") VALUES (p,pu,sid,now());

    INSERT INTO school_user.users (id,"keycloakId","schoolId","fullName",email,role,"updatedAt")
    VALUES (su, gen_random_uuid()::text, sid, students[i], format('student%s@vidyamv.lk', i), 'STUDENT', now());
    INSERT INTO school_user.students (id,"userId","schoolId","parentId","classId","admissionNumber",gender,"updatedAt")
    VALUES (gen_random_uuid()::text, su, sid, p, CASE WHEN i <= 8 THEN c1 ELSE c2 END,
            'VMV-2026-' || lpad(i::text,3,'0'), genders[i], now());
  END LOOP;
END $$;

COMMIT;
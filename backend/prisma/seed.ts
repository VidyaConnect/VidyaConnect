import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create School
  const school = await prisma.school.create({
    data: {
      name: 'VidyaConnect International',
      email: 'admin@vidyaconnect.com',
      address: '123 Education Way',
      academicYear: '2026-2027',
    },
  });

  // Create Users (Admin, Teacher)
  const teacher = await prisma.user.create({
    data: {
      schoolId: school.id,
      fullName: 'Ms. Sarah Jenkins',
      email: 'sarah.j@vidyaconnect.com',
      passwordHash: 'hashed_password', // Mock
      role: 'TEACHER',
    }
  });

  // Create Classes
  const classNames = ['Grade 1A', 'Grade 3B', 'Grade 5C', 'Grade 8A'];
  for (const name of classNames) {
    const cls = await prisma.class.create({
      data: {
        schoolId: school.id,
        className: name,
        gradeLevel: name.split(' ')[1].replace(/[a-zA-Z]/g, ''),
        academicYear: '2026-2027',
      },
    });

    // Assign Teacher to Class
    await prisma.teacherClassAssignment.create({
      data: {
        teacherId: teacher.id,
        classId: cls.id,
        subject: 'All Subjects',
      }
    });

    // Add 5 Students
    const studentNames = [
      { name: 'Alice Smith', gender: 'Female' },
      { name: 'Bob Jones', gender: 'Male' },
      { name: 'Charlie Brown', gender: 'Male' },
      { name: 'Diana Prince', gender: 'Female' },
      { name: 'Evan Wright', gender: 'Male' }
    ];

    for (let i = 0; i < studentNames.length; i++) {
      // First create a User for the student (required if any relations need it, but schema doesn't force User for Student)
      const studentUser = await prisma.user.create({
        data: {
          schoolId: school.id,
          fullName: studentNames[i].name,
          email: `student${cls.id.substring(0,4)}${i}@vidyaconnect.com`,
          passwordHash: 'hashed_password',
          role: 'STUDENT',
        }
      });

      const st = await prisma.student.create({
        data: {
          userId: studentUser.id,
          schoolId: school.id,
          classId: cls.id,
          studentNumber: `STU-${cls.className.replace(' ', '')}-${i+1}`,
          dateOfBirth: new Date('2010-01-01'),
          gender: studentNames[i].gender,
        }
      });
      
      // Create Parent
      const parentUser = await prisma.user.create({
        data: {
          schoolId: school.id,
          fullName: `${studentNames[i].name.split(' ')[0]} Parent`,
          email: `parent${st.id.substring(0,4)}@vidyaconnect.com`,
          phone: '+1 (555) 0123-456',
          passwordHash: 'hashed_password',
          role: 'PARENT',
        }
      });
      
      await prisma.studentParentLink.create({
        data: {
          studentId: st.id,
          parentId: parentUser.id,
          relationship: 'Mother',
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

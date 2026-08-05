import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

// Helper to get today's date
const getTodayIso = () => new Date().toISOString().split('T')[0];

app.get('/attendance/roster', async (req, res) => {
  const { classId } = req.query;
  const today = getTodayIso();
  
  try {
    let classes = [];
    if (classId && classId !== 'all') {
      classes = await prisma.class.findMany({
        where: {
          className: {
            contains: classId as string,
          }
        }
      });
    } else {
      classes = await prisma.class.findMany();
    }
    
    const classIds = classes.map(c => c.id);

    const students = await prisma.student.findMany({
      where: {
        classId: { in: classIds }
      },
      include: {
        attendance: {
          where: { date: new Date(today) }
        },
        parentLinks: {
          include: { parent: true }
        }
      }
    });

    const userIds = students.map(s => s.userId);
    const users = await prisma.user.findMany({ where: { id: { in: userIds } }});
    const userMap = new Map(users.map(u => [u.id, u]));

    const roster = students.map(s => {
      const currentRecord = s.attendance[0];
      let status = 'notMarked';
      let absenceReason = null;

      if (currentRecord) {
        status = currentRecord.status.toLowerCase();
      }

      const user = userMap.get(s.userId);

      return {
        id: s.id,
        name: user?.fullName || 'Unknown',
        rollNumber: s.studentNumber || '',
        status: status,
        absenceReason: absenceReason, // we'll populate this if needed
        parentContact: s.parentLinks[0]?.parent.phone || '',
        parentEmail: s.parentLinks[0]?.parent.email || ''
      };
    });

    res.json(roster.sort((a, b) => a.name.localeCompare(b.name)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch roster' });
  }
});

app.post('/attendance/roster/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { status } = req.body;
  const today = new Date(getTodayIso());
  
  try {
    const student = await prisma.student.findUnique({ where: { id: studentId }});
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    // We assume a single teacher for simplicity in this mockup backend
    const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' }});
    
    // Check if record exists
    let record = await prisma.attendanceRecord.findUnique({
      where: {
        studentId_date: {
          studentId,
          date: today
        }
      }
    });

    if (record) {
      record = await prisma.attendanceRecord.update({
        where: { id: record.id },
        data: { status }
      });
    } else {
      record = await prisma.attendanceRecord.create({
        data: {
          schoolId: student.schoolId,
          classId: student.classId,
          studentId,
          teacherId: teacher!.id,
          date: today,
          status
        }
      });
    }
    
    // If marked absent, randomly decide if it's justified (informed) or not for mockup purposes
    if (status === 'ABSENT' || status === 'absent') {
        const existingJustification = await prisma.absenceJustification.findUnique({
            where: { attendanceId: record.id }
        });
        
        if (!existingJustification) {
            // Mock: randomly uninformed (60%) or informed (40%)
            const isInformed = Math.random() > 0.6;
            if (isInformed) {
                const parentLink = await prisma.studentParentLink.findFirst({ where: { studentId }});
                if (parentLink) {
                    await prisma.absenceJustification.create({
                        data: {
                            attendanceId: record.id,
                            parentId: parentLink.parentId,
                            reasonType: 'SICKNESS',
                            description: 'Fever and cough',
                            reviewStatus: 'APPROVED'
                        }
                    });
                }
            }
        }
    }

    res.json({ success: true, data: record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

app.get('/attendance/summary', async (req, res) => {
  const { classId } = req.query;
  const today = getTodayIso();

  try {
    let classes = [];
    if (classId && classId !== 'all') {
      classes = await prisma.class.findMany({
        where: { className: { contains: classId as string } }
      });
    } else {
      classes = await prisma.class.findMany();
    }
    const classIds = classes.map(c => c.id);

    const students = await prisma.student.count({
      where: { classId: { in: classIds } }
    });

    const records = await prisma.attendanceRecord.findMany({
      where: {
        classId: { in: classIds },
        date: new Date(today)
      }
    });

    let present = 0, absent = 0, late = 0;
    records.forEach(r => {
      if (r.status === 'PRESENT') present++;
      else if (r.status === 'ABSENT') absent++;
      else if (r.status === 'LATE') late++;
    });

    const notMarked = students - (present + absent + late);

    res.json({
      className: classId || 'All Classes',
      date: today,
      present,
      absent,
      late,
      notMarked: notMarked > 0 ? notMarked : 0,
      progress: students === 0 ? 0 : Math.round((present + late) / students * 100)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

app.get('/attendance/admin/overview', async (req, res) => {
    const today = getTodayIso();
    try {
        const classes = await prisma.class.findMany({
            include: {
                students: {
                    include: {
                        attendance: {
                            where: { date: new Date(today) }
                        }
                    }
                },
                teacherLinks: {
                    include: { teacher: true }
                }
            }
        });

        let totalPresent = 0, totalAbsent = 0, totalLate = 0, totalNotMarked = 0;
        
        const classSummaries = classes.map(c => {
            let present = 0, absent = 0, late = 0, notMarked = 0;
            
            c.students.forEach(s => {
                if (s.attendance.length === 0) notMarked++;
                else {
                    const status = s.attendance[0].status;
                    if (status === 'PRESENT') present++;
                    else if (status === 'ABSENT') absent++;
                    else if (status === 'LATE') late++;
                }
            });

            totalPresent += present;
            totalAbsent += absent;
            totalLate += late;
            totalNotMarked += notMarked;

            const total = c.students.length;
            const progress = total === 0 ? 0 : Math.round(((present + late) / total) * 100);

            return {
                id: c.id,
                className: c.className,
                teacherName: c.teacherLinks[0]?.teacher?.fullName || 'Unassigned',
                status: 'Active',
                progress,
                students: []
            };
        });

        res.json({
            present: totalPresent,
            absent: totalAbsent,
            late: totalLate,
            notMarked: totalNotMarked,
            classes: classSummaries
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin overview' });
    }
});

app.get('/attendance/absences', async (req, res) => {
    const today = getTodayIso();
    try {
        const absences = await prisma.attendanceRecord.findMany({
            where: { date: new Date(today), status: 'ABSENT' },
            include: {
                student: {
                    include: {
                        parentLinks: {
                            include: { parent: true }
                        }
                    }
                },
                justification: true
            }
        });
        
        const studentUserIds = absences.map(a => a.student.userId);
        const users = await prisma.user.findMany({ where: { id: { in: studentUserIds } }});
        const userMap = new Map(users.map(u => [u.id, u]));

        const followUps = absences.map(a => {
            const parent = a.student.parentLinks[0]?.parent;
            const user = userMap.get(a.student.userId);
            return {
                studentId: a.studentId,
                studentName: user?.fullName || 'Unknown',
                parentContact: parent?.fullName || 'N/A',
                email: parent?.email || '',
                phone: parent?.phone || '',
                reason: a.justification ? 'Informed' : 'Uninformed',
                reasonDetails: a.justification?.description || null
            };
        });
        
        res.json(followUps);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch absences' });
    }
});

app.post('/attendance/absence-reason', async (req, res) => {
    const { studentId, status, reason } = req.body;
    const today = new Date(getTodayIso());

    try {
        // Find today's ABSENT record for this student
        const record = await prisma.attendanceRecord.findUnique({
            where: { studentId_date: { studentId, date: today } }
        });

        if (!record) {
            return res.status(404).json({ error: 'No attendance record found for today' });
        }

        if (status === 'Informed' && reason) {
            // Upsert justification
            const existing = await prisma.absenceJustification.findUnique({
                where: { attendanceId: record.id }
            });
            const parentLink = await prisma.studentParentLink.findFirst({ where: { studentId } });

            if (existing) {
                await prisma.absenceJustification.update({
                    where: { attendanceId: record.id },
                    data: { description: reason, reviewStatus: 'APPROVED' }
                });
            } else if (parentLink) {
                await prisma.absenceJustification.create({
                    data: {
                        attendanceId: record.id,
                        parentId: parentLink.parentId,
                        reasonType: 'TEACHER_NOTED',
                        description: reason,
                        reviewStatus: 'APPROVED'
                    }
                });
            }
        } else if (status === 'Uninformed') {
            // Remove any existing justification (mark as uninformed)
            await prisma.absenceJustification.deleteMany({
                where: { attendanceId: record.id }
            }).catch(() => {});
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update absence reason' });
    }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

# Reports API

All requests go to **report-service** (default `http://localhost:3008`) and need
`Authorization: Bearer <token>`. The school is always taken from the verified
login, never from the URL or body.

## GET /reports/super-admin/summary
Role: ADMIN (super admin). Platform-wide numbers, no student-level data.

Response fields:
- totalSchools, activeSchools, newSchoolsThisMonth (approved schools only)
- totalUsers, usersByRole[] (active parents, teachers, school admins; students and the super admin are excluded)
- newSchoolsByMonth[] (last 6 months)
- schoolsByStatus[] (Under review, Approved, Rejected)
- schoolAdoption[] (school, created, activated; top 10 approved schools)

Upstream: school-user-service `GET /api/reports/system-summary`

## GET /reports/school-admin/attendance
Role: SCHOOL_ADMIN. Own school only.

Query parameters:
- days: 7, 30 or 90 (default 30). Anything else returns 400.
- classId: optional class id. Omit or use "all" for every class.

Response fields:
- days, from, to, classes[]
- latestDate, todayAttendance, attendanceChange (percentage points vs same day last week)
- daily[] (date, rate), classComparison[], studentsBelow80[]
- statusSplit[] (Present, Late, Absent counts)

Upstream: attendance-service `GET /attendance/reports/school-summary`

## Definitions
- Attendance % = (present + late) / (present + late + absent). Not marked and exempted are excluded.
- Students below 80% need at least 5 marked days in the range.

## Errors
401 missing or expired token, 403 wrong role or account not linked to a school,
400 invalid query parameter, 502 an upstream service is unreachable, 500 query failure.

## Still sample data (no backend source yet)
Announcement reach, consent responses, never logged in, push delivery rate,
security events, notification delivery rate.

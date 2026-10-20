import {
  AdminAttendanceOverview,
  ParentAbsenceAlert,
  StudentAttendance
} from "../types/attendance";

export const teacherRosterMock: StudentAttendance[] = [
  { id: "t1", name: "Aaron Mitchell", rollNumber: "01", status: "present" },
  { id: "t2", name: "Bella Thorne", rollNumber: "02", status: "absent" },
  { id: "t3", name: "Casey Wright", rollNumber: "03", status: "late" },
  { id: "t4", name: "Daniel Choi", rollNumber: "04", status: "present" },
  { id: "t5", name: "Elena Rodriguez", rollNumber: "05", status: "present" }
];

export const adminRosterMock: StudentAttendance[] = [
  { id: "1", name: "Amara Jayawardena", rollNumber: "01", status: "present" },
  { id: "2", name: "Buddhika Silva", rollNumber: "02", status: "absent" },
  { id: "3", name: "Chamath Perera", rollNumber: "03", status: "late" },
  { id: "4", name: "Hirun Gunasekera", rollNumber: "05", status: "present" },
  { id: "5", name: "Kasun Maduranga", rollNumber: "06", status: "present" }
];

export const adminOverviewMock: AdminAttendanceOverview = {
  present: 842,
  absent: 42,
  late: 18,
  notMarked: 12,
  classes: [
    {
      id: "c1",
      className: "Grade 8A",
      teacherName: "Mr. Hashara",
      status: "marked",
      progress: 94,
      students: adminRosterMock
    },
    {
      id: "c2",
      className: "Grade 10C",
      teacherName: "Mrs. Perera",
      status: "pending",
      progress: 0,
      students: [
        { id: "p1", name: "Nimal Fernando", rollNumber: "01", status: "notMarked" },
        { id: "p2", name: "Sajani Perera", rollNumber: "02", status: "notMarked" }
      ]
    },
    {
      id: "c3",
      className: "Grade 9B",
      teacherName: "Mr. Silva",
      status: "marked",
      progress: 100,
      students: [
        { id: "s1", name: "Ishara Dias", rollNumber: "01", status: "present" },
        { id: "s2", name: "Malith Jayasuriya", rollNumber: "02", status: "present" }
      ]
    }
  ]
};

export const parentAbsenceMock: ParentAbsenceAlert = {
  studentName: "Kavya Sharma",
  className: "Grade 4-B",
  rollNumber: "24",
  dateLabel: "Monday, Oct 23rd",
  alertTime: "Just now"
};

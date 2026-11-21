import { fetchWithAuth } from "@/services/fetchWithAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
const BASE = `${API_BASE_URL}/academics`;

// ───────────────────────── Types ─────────────────────────
export interface ClassRef {
  id: string;
  className: string; // "Grade 1" when the grade has one class, "Grade 6A" when it has several
  gradeLevel: number;
  /** "A", "B"… or "" when the grade has only one class. */
  section: string;
  academicYear: number;
}

/** A class as stored in the DB: classTeacherId is null until a class teacher is assigned. */
export interface SchoolClass extends ClassRef {
  classTeacherId: string | null;
  studentCount: number;
}

/** "This teacher teaches <subject> to <class>". */
export interface TeachingAssignment {
  id: string;
  subject: string;
  classId: string;
  className: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  teacherCode?: string;
  /** The class this teacher is class teacher of, or null. */
  classTeacherOf: ClassRef | null;
  teaching: TeachingAssignment[];
}

export const CURRENT_ACADEMIC_YEAR = 2026;

/** The grades the screen offers. The backend accepts 1 to 13. */
export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export const SUBJECTS = [
  'Mathematics', 'Science', 'English', 'Sinhala', 'Tamil', 'History', 'Geography',
  'ICT', 'Religion', 'Art', 'Music', 'Health & PE', 'Commerce',
] as const;

/** "Grade 1" when a grade has one class, "Grade 6A" when it has sections. */
export const classNameOf = (gradeLevel: number, section: string) => (section ? `Grade ${gradeLevel}${section}` : `Grade ${gradeLevel}`);

export const SECTION_LETTERS = 'ABCDEFGHIJ';

// ───────────────────────── API calls ─────────────────────────
async function request<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetchWithAuth(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? `Request failed (${res.status})`);
  }
  return body as T;
}

const id = encodeURIComponent;

export const listTeachers = () => request<Teacher[]>("/teachers");

export const listClasses = (academicYear: number) =>
  request<SchoolClass[]>(`/classes?academicYear=${academicYear}`);

/** teacherId = null removes the class teacher. A teacher who led another class is moved. */
export async function setClassTeacher(classId: string, teacherId: string | null): Promise<void> {
  await request(`/classes/${id(classId)}/class-teacher`, { method: "PUT", body: JSON.stringify({ teacherId }) });
}

export async function addTeaching(teacherId: string, classId: string, subject: string): Promise<void> {
  await request(`/teachers/${id(teacherId)}/teaching`, { method: "POST", body: JSON.stringify({ classId, subject }) });
}

export async function removeTeaching(assignmentId: string): Promise<void> {
  await request(`/teaching/${id(assignmentId)}`, { method: "DELETE" });
}

/** Removes the teacher from the school: their class is freed, their subjects go, and the account is disabled. */
export async function deleteTeacher(teacherId: string): Promise<void> {
  await request(`/teachers/${id(teacherId)}`, { method: "DELETE" });
}

export async function createClass(gradeLevel: number, section: string): Promise<void> {
  await request(`/classes`, {
    method: "POST",
    body: JSON.stringify({ gradeLevel, section, academicYear: CURRENT_ACADEMIC_YEAR }),
  });
}

/** First-time setup: count 1 = "Grade 6", count 3 = Grade 6A, 6B, 6C. */
export async function createClasses(plan: { gradeLevel: number; count: number }[]): Promise<void> {
  await request(`/classes/bulk`, {
    method: "POST",
    body: JSON.stringify({ plan, academicYear: CURRENT_ACADEMIC_YEAR }),
  });
}

/** A class with students in it cannot be deleted. */
export async function deleteClass(classId: string): Promise<void> {
  await request(`/classes/${id(classId)}`, { method: "DELETE" });
}
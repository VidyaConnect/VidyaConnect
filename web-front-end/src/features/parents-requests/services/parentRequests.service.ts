// Replace the mock data / delays with your real API calls.
// Keep the types: the board component depends on them.

export type LinkStatus = "pending" | "approved" | "rejected";
export type Relationship = "Mother" | "Father" | "Guardian" | "Other";

/** What the school already has on file for the student. */
export interface StudentRecord {
  name: string;
  admissionNo: string;
  grade: string; // e.g. "Grade 5-A"
  dob: string; // YYYY-MM-DD
  guardianPhone: string; // phone number registered at admission
}

export interface ParentLinkRequest {
  id: string;
  status: LinkStatus;
  submittedAt: string; // ISO
  parent: { name: string; phone: string; email?: string; relationship: Relationship };
  /** Exactly what the parent typed in the mobile app form. */
  entered: { studentName: string; admissionNo: string; grade: string; dob: string };
  /** School record found by admission number (null = no student found). */
  record: StudentRecord | null;
  /** How many parents are already linked to this student. */
  linkedParents: number;
  parentNote?: string;
  reviewNote?: string;
  reviewedAt?: string;
}

const daysAgo = (d: number, h = 0) => new Date(Date.now() - d * 86400000 - h * 3600000).toISOString();

const MOCK: ParentLinkRequest[] = [
  {
    id: "1", status: "pending", submittedAt: daysAgo(0, 2),
    parent: { name: "Nimal Perera", phone: "0771234567", email: "nimal.p@mail.com", relationship: "Father" },
    entered: { studentName: "Kavindu Perera", admissionNo: "ADM-2031", grade: "Grade 5-A", dob: "2015-03-14" },
    record: { name: "Kavindu Perera", admissionNo: "ADM-2031", grade: "Grade 5-A", dob: "2015-03-14", guardianPhone: "0771234567" },
    linkedParents: 1,
  },
  {
    id: "2", status: "pending", submittedAt: daysAgo(1),
    parent: { name: "Sanduni Fernando", phone: "0712223344", relationship: "Mother" },
    entered: { studentName: "Dilini Fernando", admissionNo: "ADM-2044", grade: "Grade 5-A", dob: "2015-07-02" },
    record: { name: "Dilini S. Fernando", admissionNo: "ADM-2044", grade: "Grade 5-A", dob: "2015-07-02", guardianPhone: "0765550101" },
    linkedParents: 1,
    parentNote: "I am Dilini's mother. My husband already has access.",
  },
  {
    id: "3", status: "pending", submittedAt: daysAgo(2),
    parent: { name: "Ruwan Jayasinghe", phone: "0759988776", relationship: "Guardian" },
    entered: { studentName: "Hasini Silva", admissionNo: "ADM-2090", grade: "Grade 5-A", dob: "2014-11-21" },
    record: { name: "Hasini Wickrama", admissionNo: "ADM-2090", grade: "Grade 5-B", dob: "2015-01-09", guardianPhone: "0701112223" },
    linkedParents: 0,
    parentNote: "I look after her while her parents are abroad.",
  },
  {
    id: "4", status: "pending", submittedAt: daysAgo(3),
    parent: { name: "Chamari Weerasinghe", phone: "0774445566", relationship: "Mother" },
    entered: { studentName: "Sathsara Weerasinghe", admissionNo: "ADM-9999", grade: "Grade 5-A", dob: "2015-05-30" },
    record: null,
    linkedParents: 0,
  },
  {
    id: "5", status: "approved", submittedAt: daysAgo(5),
    parent: { name: "Pradeep Kumara", phone: "0778889900", relationship: "Father" },
    entered: { studentName: "Isuru Kumara", admissionNo: "ADM-2012", grade: "Grade 5-A", dob: "2015-02-11" },
    record: { name: "Isuru Kumara", admissionNo: "ADM-2012", grade: "Grade 5-A", dob: "2015-02-11", guardianPhone: "0778889900" },
    linkedParents: 2, reviewedAt: daysAgo(4),
  },
  {
    id: "6", status: "rejected", submittedAt: daysAgo(6),
    parent: { name: "Anura Dias", phone: "0723334455", relationship: "Other" },
    entered: { studentName: "Tharushi Perera", admissionNo: "ADM-2031", grade: "Grade 5-A", dob: "2015-03-14" },
    record: { name: "Kavindu Perera", admissionNo: "ADM-2031", grade: "Grade 5-A", dob: "2015-03-14", guardianPhone: "0771234567" },
    linkedParents: 1,
    reviewNote: "Details don’t match our records. Please visit the school office.",
    reviewedAt: daysAgo(5),
  },
];

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function getLinkRequests(): Promise<ParentLinkRequest[]> {
  await wait();
  return structuredClone(MOCK);
}

/** Approve = create the parent↔student link. Reject = parent sees `note` in the app. */
export async function reviewLinkRequest(id: string, status: LinkStatus, note?: string): Promise<void> {
  await wait(250);
  const r = MOCK.find((x) => x.id === id);
  if (r) {
    r.status = status;
    r.reviewNote = note;
    r.reviewedAt = status === "pending" ? undefined : new Date().toISOString();
  }
}
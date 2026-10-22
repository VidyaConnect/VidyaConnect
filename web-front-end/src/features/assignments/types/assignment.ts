export type ProgressStatus = 'PENDING' | 'COMPLETED' | 'MISSING'
export type AssignmentState = 'DRAFT' | 'PUBLISHED'
export interface AssignmentClass { id?: string; classId?: string; name?: string; className?: string }
export interface StudentStatus { studentId: string; studentName: string; rollNumber: string | null; status: ProgressStatus; marks: number | null; feedback: string | null; markedAt: string | null }
export interface Assignment { id: string; classId: string; className: string; title: string; description: string; subject: string; dueAt: string; publishAt: string; publishedAt: string | null; status: AssignmentState; attachments: { fileId: string; fileName: string }[]; studentStatuses: StudentStatus[] }

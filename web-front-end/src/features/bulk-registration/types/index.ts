export type RegType = 'class' | 'teacher' | 'student';
export type RowStatus = 'valid' | 'error' | 'warning';
export type ImportStatus = 'Completed' | 'Partial' | 'Failed' | 'Processing';

export interface PreviewRow {
  row: number;
  status: RowStatus;
  message?: string;
  errorField?: keyof PreviewRow;
  id: string; // employee ID or admission number
  firstName: string;
  lastName: string;
  email?: string;
  contact?: string;
  grade?: string;
  className?: string;
  guardian?: string;
}

export interface ImportRecord {
  id: string;
  type: RegType;
  file: string;
  total: number;
  ok: number;
  failed: number;
  by: string;
  date: string;
  status: ImportStatus;
}

export interface ColumnDef { label: string; key: keyof PreviewRow }

/** Response contract expected from the backend once it exists. */
export interface ImportResult {
  jobId: string;
  completedAt: string;
  processed: number;
  failed: number;
  skipped: number;
  class?: { created: number; skipped: number };
  teacher?: { provisioned: number; linkedToKeycloak: number; invitationsSent: number; provisioningFailures: number };
  student?: { profilesCreated: number; classAssignments: number; parentsLinked: number; parentsPending: number };
}
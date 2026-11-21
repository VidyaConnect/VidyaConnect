export type RequestStatus = "pending" | "under_review" | "needs_info" | "approved" | "rejected";
export type SchoolType = "Primary" | "Secondary" | "International" | "Private" | "Government";
export type StatusFilter = "all" | RequestStatus;

export interface TimelineEntry {
  id: string;
  action: string;
  actor: string;
  at: string;
  note?: string;
}

export interface RequestDocument {
  id: string;
  name: string;
  sizeKb: number;
}

export interface RequestNote {
  id: string;
  text: string;
  by: string;
  at: string;
}

export interface SchoolRequest {
  id: string;
  schoolName: string;
  type: SchoolType;
  address: string;
  district: string;
  country: string;
  phone: string;
  officialEmail: string;
  website?: string;
  students: number;
  teachers: number;
  registrationNumber: string;
  adminName: string;
  adminDesignation: string;
  adminEmail: string;
  adminPhone: string;
  submittedAt: string;
  decidedAt?: string;
  status: RequestStatus;
  documents: RequestDocument[];
  duplicateOf?: string;
  timeline: TimelineEntry[];
  notes: RequestNote[];
}

export type DecisionInput =
  | { type: "approve"; message?: string; sendEmail: boolean }
  | { type: "reject"; reason: string; comment: string; notify: boolean }
  | { type: "info"; message: string; items: string[] };

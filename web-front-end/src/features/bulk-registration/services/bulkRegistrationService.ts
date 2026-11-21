import { fetchWithAuth } from "@/services/fetchWithAuth";
import type { ImportResult, PreviewRow, RegType } from "../types";

// Same base URL as apiClient.ts (school-user-service)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

/* ---------- raw backend shapes ---------- */
interface ApiRowError {
  rowNumber: number;
  field: string;
  message: string;
}
interface ApiRow {
  rowNumber: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gradeLevel: string;
  className: string;
  admissionNumber?: string;
  teacherCode?: string;
  generatedEmail?: boolean;
}
interface ApiValidateResponse {
  total: number;
  validCount: number;
  errorCount: number;
  rows: ApiRow[];
  errors: ApiRowError[];
}
interface ApiCommitResponse {
  summary: { total: number; created: number; failed: number; skipped: number };
  results: {
    rowNumber: number;
    fullName: string;
    email: string;
    status: "created" | "failed";
    tempPassword?: string;
    error?: string;
  }[];
}

export class BulkApiError extends Error {}

const SEGMENT: Record<RegType, string> = {
  class: "classes",
  teacher: "teachers",
  student: "students",
};
const segment = (t: RegType) => SEGMENT[t];

async function postFile<T>(
  action: "validate" | "commit",
  type: RegType,
  file: File,
  academicYear: string,
  extra: Record<string, string> = {},
): Promise<T> {
  const form = new FormData();
  form.append("file", file);
  if (academicYear.trim()) form.append("academicYear", academicYear.trim());
  Object.entries(extra).forEach(([k, v]) => form.append(k, v));

  // No Content-Type here: the browser adds the multipart boundary itself.
  const res = await fetchWithAuth(
    `${API_BASE_URL}/bulk-registration/${segment(type)}/${action}`,
    { method: "POST", body: form },
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BulkApiError(
      body.message ?? body.error ?? `Request failed (${res.status})`,
    );
  }
  return body as T;
}

/* ---------- mapping to your PreviewRow ---------- */
const FIELD_TO_KEY: Record<string, keyof PreviewRow> = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone: "contact",
  grade_level: "grade",
  class_name: "className",
  admission_number: "id",
  teacher_code: "id",
};

function toPreviewRows(res: ApiValidateResponse): PreviewRow[] {
  const byRow = new Map<number, ApiRowError[]>();
  res.errors.forEach((e) =>
    byRow.set(e.rowNumber, [...(byRow.get(e.rowNumber) ?? []), e]),
  );

  return res.rows.map((r): PreviewRow => {
    const base: Omit<PreviewRow, "status"> = {
      row: r.rowNumber,
      id: r.admissionNumber ?? r.teacherCode ?? "",
      firstName: r.firstName ?? "",
      lastName: r.lastName ?? "",
      email: r.generatedEmail ? "" : (r.email ?? ""),
      contact: r.phone,
      grade: r.gradeLevel,
      className: r.className,
    };
    const errs = byRow.get(r.rowNumber);
    if (errs?.length) {
      return {
        ...base,
        status: "error",
        message: errs.map((e) => e.message).join("; "),
        errorField: FIELD_TO_KEY[errs[0].field],
      };
    }
    if (r.generatedEmail) {
      return {
        ...base,
        status: "warning",
        message: "No email: a placeholder login will be created",
      };
    }
    return { ...base, status: "valid" };
  });
}

/* ---------- public API ---------- */
export async function previewImport(
  type: RegType,
  file: File,
  academicYear: string,
) {
  const res = await postFile<ApiValidateResponse>(
    "validate",
    type,
    file,
    academicYear,
  );
  return {
    rows: toPreviewRows(res),
    total: res.total,
    valid: res.validCount,
    errors: res.errorCount,
  };
}

export interface ImportOutcome extends ImportResult {
  credentials: { fullName: string; email: string; tempPassword: string }[];
  failures: { row: number; name: string; error: string }[];
}

export async function runImport(
  type: RegType,
  file: File,
  academicYear: string,
  skipInvalid: boolean,
): Promise<ImportOutcome> {
  const res = await postFile<ApiCommitResponse>(
    "commit",
    type,
    file,
    academicYear,
    { skipInvalid: String(skipInvalid) },
  );
  const s = res.summary;

  const common = {
    jobId: crypto.randomUUID(), // no job table yet, so this is only an id for the UI
    completedAt: new Date().toISOString(),
    processed: s.created,
    failed: s.failed,
    skipped: s.skipped,
    credentials: res.results
      .filter((r) => r.status === "created")
      .map((r) => ({
        fullName: r.fullName,
        email: r.email,
        tempPassword: r.tempPassword ?? "",
      })),
    failures: res.results
      .filter((r) => r.status === "failed")
      .map((r) => ({
        row: r.rowNumber,
        name: r.fullName,
        error: r.error ?? "Unknown error",
      })),
  };

  if (type === "class") {
    return {
      ...common,
      credentials: [], // classes have no login credentials
      class: { created: s.created, skipped: s.skipped },
    };
  }

  return type === "teacher"
    ? {
        ...common,
        teacher: {
          provisioned: s.created,
          linkedToKeycloak: s.created,
          invitationsSent: 0, // temporary passwords are handed over instead of emailed
          provisioningFailures: s.failed,
        },
      }
    : {
        ...common,
        student: {
          profilesCreated: s.created,
          classAssignments: s.created,
          parentsLinked: 0, // parents link through the link-request flow
          parentsPending: 0,
        },
      };
}

export async function downloadTemplate(type: RegType): Promise<void> {
  const res = await fetchWithAuth(
    `${API_BASE_URL}/bulk-registration/${segment(type)}/template`,
  );
  if (!res.ok) throw new BulkApiError("Could not download the template");
  triggerDownload(await res.blob(), `${segment(type)}-template.csv`);
}

/* ---------- setup status (landing page counts) ---------- */
export async function fetchSetupStatus(academicYear: string) {
  const res = await fetchWithAuth(
    `${API_BASE_URL}/bulk-registration/status?academicYear=${encodeURIComponent(academicYear)}`,
  );
  if (!res.ok) throw new BulkApiError("Could not load setup status");
  return (await res.json()) as { classes: number; teachers: number; students: number };
}
/* ---------- credentials file (temporary passwords are shown only once) ---------- */
const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export function downloadCredentials(
  credentials: ImportOutcome["credentials"],
  type: RegType,
) {
  const csv = [
    "full_name,email,temporary_password",
    ...credentials.map((c) =>
      [c.fullName, c.email, c.tempPassword].map(csvCell).join(","),
    ),
  ].join("\n");
  triggerDownload(
    new Blob([csv], { type: "text/csv" }),
    `${segment(type)}-credentials.csv`,
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
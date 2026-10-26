// Talks to school-user-service. The board component depends on these types.

export type LinkStatus = "pending" | "approved" | "rejected";
export type Relationship = "Father" | "Mother" | "Guardian";

export interface ParentLinkRequest {
  id: string;
  status: LinkStatus;
  submittedAt: string; // ISO
  parent: { name: string; phone: string; nic: string; relationship: Relationship };
  /** Admission number exactly as the parent typed it */
  admissionNo: string;
  /** Student matched by that admission number in this teacher's class (null = no match) */
  student: { name: string; admissionNo: string; grade: string } | null;
  /** Another parent is already linked to this student */
  studentAlreadyLinked: boolean;
  /** Teacher's rejection message (what the parent sees) */
  reviewNote?: string;
  reviewedAt?: string;
}

/* ---------- config ---------- */

// Must point at school-user-service (e.g. http://localhost:3001/api).
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


async function getToken(): Promise<string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("You are not logged in. Please log in again.");
  return token;
}

/* ---------- helpers ---------- */

const REL: Record<string, Relationship> = {
  FATHER: "Father",
  MOTHER: "Mother",
  GUARDIAN: "Guardian",
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getToken()}`,
      ...init?.headers,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? "Something went wrong. Please try again.");
  return json.data as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toRequest = (r: any): ParentLinkRequest => ({
  id: r.id,
  status: String(r.status).toLowerCase() as LinkStatus,
  submittedAt: r.createdAt,
  parent: {
    name: r.parent.user.fullName,
    phone: r.parent.user.phone ?? "",
    nic: r.nic,
    relationship: REL[r.relationship] ?? "Guardian",
  },
  admissionNo: r.admissionNumber,
  student: r.student
    ? {
        name: r.student.user.fullName,
        admissionNo: r.student.admissionNumber,
        grade: r.student.class
          ? `${r.student.class.gradeLevel}-${r.student.class.className}`
          : "No class",
      }
    : null,
  studentAlreadyLinked: Boolean(r.studentAlreadyLinked),
  reviewNote: r.rejectReason ?? undefined,
  reviewedAt: r.reviewedAt ?? undefined,
});

/* ---------- API ---------- */

export async function getLinkRequests(): Promise<ParentLinkRequest[]> {
  const lists = await Promise.all(
    ["PENDING", "APPROVED", "REJECTED"].map((s) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      api<any[]>(`/children/link-requests/pending?status=${s}`)
    )
  );
  return lists.flat().map(toRequest);
}

/**
 * approved -> links the child to the parent
 * rejected -> `note` is required, the parent sees it in the app
 * pending  -> moves back to review (and removes the link if it was approved)
 */
export async function reviewLinkRequest(id: string, status: LinkStatus, note?: string): Promise<void> {
  const base = `/children/link-requests/${id}`;
  if (status === "approved") {
    await api(`${base}/approve`, { method: "PATCH", body: "{}" });
  } else if (status === "rejected") {
    await api(`${base}/reject`, { method: "PATCH", body: JSON.stringify({ reason: note }) });
  } else {
    await api(`${base}/revert`, { method: "PATCH", body: "{}" });
  }
}

/** The document endpoint needs the token, so a plain link would not work. */
export async function openBirthCertificate(id: string): Promise<void> {
  // Open the tab first so the browser's popup blocker allows it.
  const tab = window.open("", "_blank");
  try {
    const res = await fetch(`${BASE}/children/link-requests/${id}/document`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    if (!res.ok) throw new Error("Could not open the birth certificate.");
    const url = URL.createObjectURL(await res.blob());
    if (tab) tab.location.href = url;
    else window.location.href = url;
  } catch (e) {
    tab?.close();
    throw e;
  }
}
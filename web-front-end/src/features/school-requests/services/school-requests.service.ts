import type { DecisionInput, SchoolRequest } from "../types/school-request.types";

/**
 * Mock service. Replace the bodies with real API calls later
 * (e.g. fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/school-requests`)).
 * The function signatures are what the hook and components depend on.
 */

const ago = (days: number, hours = 0) =>
  new Date(Date.now() - days * 86_400_000 - hours * 3_600_000).toISOString();

const docs = (n: number) =>
  ["Registration certificate.pdf", "Authorization letter.pdf", "Admin ID proof.jpg"]
    .slice(0, n)
    .map((name, i) => ({ id: `d${i}`, name, sizeKb: 180 + i * 95 }));

const submitted = (at: string) => [{ id: "t0", action: "Request submitted", actor: "School admin", at }];

let db: SchoolRequest[] = [
  {
    id: "REQ-1042", schoolName: "Lakeview International School", type: "International",
    address: "14 Lake Road", district: "Colombo", country: "Sri Lanka", phone: "+94 11 234 5678",
    officialEmail: "office@lakeview.edu.lk", website: "https://lakeview.edu.lk", students: 1180, teachers: 74,
    registrationNumber: "INT/2019/0457", adminName: "Nadeesha Perera", adminDesignation: "Principal",
    adminEmail: "nadeesha@lakeview.edu.lk", adminPhone: "+94 77 123 4567", submittedAt: ago(0, 3),
    status: "pending", documents: docs(3), timeline: submitted(ago(0, 3)), notes: [],
  },
  {
    id: "REQ-1041", schoolName: "St. Xavier's Girls College", type: "Private",
    address: "7 Church Street", district: "Negombo", country: "Sri Lanka", phone: "+94 31 222 1100",
    officialEmail: "info@stxaviers.lk", students: 920, teachers: 51, registrationNumber: "PVT/2008/0912",
    adminName: "Mary Fernando", adminDesignation: "Deputy Principal", adminEmail: "mary@stxaviers.lk",
    adminPhone: "+94 71 998 2211", submittedAt: ago(1, 5), status: "under_review", documents: docs(3),
    duplicateOf: "St. Xavier's International",
    timeline: [
      ...submitted(ago(1, 5)),
      { id: "t1", action: "Review started", actor: "Platform Admin", at: ago(1) },
    ],
    notes: [{ id: "n1", text: "Name is close to an existing school. Checking the address.", by: "Platform Admin", at: ago(1) }],
  },
  {
    id: "REQ-1039", schoolName: "Greenfield Primary", type: "Primary",
    address: "22 Temple Lane", district: "Gampaha", country: "Sri Lanka", phone: "+94 33 456 7788",
    officialEmail: "greenfield.primary@gmail.com", students: 310, teachers: 19, registrationNumber: "GOV/2001/3320",
    adminName: "Kasun Silva", adminDesignation: "Principal", adminEmail: "kasun.silva@gmail.com",
    adminPhone: "+94 76 555 0199", submittedAt: ago(3), status: "needs_info", documents: docs(1),
    timeline: [
      ...submitted(ago(3)),
      { id: "t1", action: "More information requested", actor: "Platform Admin", at: ago(2),
        note: "Please upload the authorization letter and admin ID proof." },
    ],
    notes: [],
  },
  {
    id: "REQ-1037", schoolName: "Royal Heights College", type: "Secondary",
    address: "90 Hill Street", district: "Kandy", country: "Sri Lanka", phone: "+94 81 220 4411",
    officialEmail: "admin@royalheights.lk", students: 1540, teachers: 88, registrationNumber: "GOV/1994/1180",
    adminName: "Ruwan Jayasinghe", adminDesignation: "Principal", adminEmail: "ruwan@royalheights.lk",
    adminPhone: "+94 70 311 2200", submittedAt: ago(5), decidedAt: ago(2), status: "approved", documents: docs(3),
    timeline: [
      ...submitted(ago(5)),
      { id: "t1", action: "Approved", actor: "Platform Admin", at: ago(2), note: "All documents verified." },
    ],
    notes: [],
  },
  {
    id: "REQ-1035", schoolName: "Sunrise Montessori", type: "Private",
    address: "5 Beach Road", district: "Galle", country: "Sri Lanka", phone: "+94 91 223 3344",
    officialEmail: "hello@sunrisemontessori.lk", students: 120, teachers: 11, registrationNumber: "PVT/2022/0071",
    adminName: "Dilini Rathnayake", adminDesignation: "Director", adminEmail: "dilini@sunrisemontessori.lk",
    adminPhone: "+94 72 800 1212", submittedAt: ago(6), decidedAt: ago(1), status: "rejected", documents: docs(2),
    timeline: [
      ...submitted(ago(6)),
      { id: "t1", action: "Rejected", actor: "Platform Admin", at: ago(1),
        note: "Invalid documents: registration number could not be verified." },
    ],
    notes: [],
  },
];

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function patch(id: string, fn: (r: SchoolRequest) => SchoolRequest): SchoolRequest {
  const current = db.find((r) => r.id === id);
  if (!current) throw new Error("Request not found");
  const next = fn(clone(current));
  db = db.map((r) => (r.id === id ? next : r));
  return clone(next);
}

const entry = (action: string, note?: string) => ({
  id: crypto.randomUUID(), action, actor: "Platform Admin", at: new Date().toISOString(), note,
});

export async function getRequests(): Promise<SchoolRequest[]> {
  await delay();
  return clone(db);
}

export async function startReview(id: string): Promise<SchoolRequest> {
  return patch(id, (r) =>
    r.status !== "pending" ? r : { ...r, status: "under_review", timeline: [...r.timeline, entry("Review started")] },
  );
}

export async function decideRequest(id: string, input: DecisionInput): Promise<SchoolRequest> {
  await delay();
  return patch(id, (r) => {
    const now = new Date().toISOString();
    if (input.type === "approve")
      return { ...r, status: "approved", decidedAt: now,
        timeline: [...r.timeline, entry("Approved", input.message || (input.sendEmail ? "Onboarding email sent." : undefined))] };
    if (input.type === "reject")
      return { ...r, status: "rejected", decidedAt: now,
        timeline: [...r.timeline, entry("Rejected", `${input.reason}: ${input.comment}`)] };
    return { ...r, status: "needs_info",
      timeline: [...r.timeline, entry("More information requested", [input.message, ...input.items].filter(Boolean).join(" | "))] };
  });
}

export async function addNote(id: string, text: string): Promise<SchoolRequest> {
  return patch(id, (r) => ({
    ...r, notes: [...r.notes, { id: crypto.randomUUID(), text, by: "Platform Admin", at: new Date().toISOString() }],
  }));
}

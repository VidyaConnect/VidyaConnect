import { apiClient } from "../../../services/api";

export async function submitLinkRequest(p: {
  admissionNo: string;
  schoolName: string;
  censusNo: string;
  nic: string;
  relationship: string;
  file: { uri: string; name: string; mimeType?: string };
}) {
  const form = new FormData();
  form.append("admissionNo", p.admissionNo);
  form.append("schoolName", p.schoolName);
  form.append("censusNo", p.censusNo);
  form.append("nic", p.nic);
  form.append("relationship", p.relationship);
  form.append("document", {
    uri: p.file.uri,
    name: p.file.name,
    type: p.file.mimeType ?? "image/jpeg",
  } as any);

  const res = await apiClient.post("/children/link-requests", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export type MyChild = {
  id: string;
  status: "LINKED" | "PENDING" | "REJECTED";
  name: string | null;
  grade: string | null;
  school: string;
  admissionNumber: string | null;
  rejectReason?: string | null;
};

export async function getMyChildren(): Promise<MyChild[]> {
  const res = await apiClient.get("/children");
  return res.data.data;
}
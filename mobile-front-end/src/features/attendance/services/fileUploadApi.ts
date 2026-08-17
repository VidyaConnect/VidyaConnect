import { apiClient } from "../../../services/api";

export async function uploadAbsenceDocument(formData: FormData) {
  return apiClient.post("/attendance/absence/document", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

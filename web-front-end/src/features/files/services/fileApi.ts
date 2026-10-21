import apiClient from "@/services/apiClient";
import type {
  UploadUrlResponse,
  DownloadUrlResponse,
  ConfirmUploadResponse,
  FileMetadata,
} from "../types/file.types";

const FILE_API_BASE = process.env.NEXT_PUBLIC_FILE_API_URL || "http://localhost:3006";

function authHeaders(): Record<string, string> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getUploadUrl(payload: {
  fileName: string;
  contentType: string;
  fileSize: number;
  purpose?: string;
}): Promise<UploadUrlResponse> {
  const response = await apiClient.post(`${FILE_API_BASE}/files/upload-url`, payload, { headers: authHeaders() });
  return response.data.data;
}

export async function confirmUpload(fileId: string): Promise<ConfirmUploadResponse> {
  const response = await apiClient.post(`${FILE_API_BASE}/files/${fileId}/confirm`, undefined, { headers: authHeaders() });
  return response.data.data;
}

export async function getDownloadUrl(
  fileId: string,
  options: { inline?: boolean } = {}
): Promise<DownloadUrlResponse> {
  const response = await apiClient.get(`${FILE_API_BASE}/files/${fileId}/download-url`, {
    headers: authHeaders(),
    params: options.inline ? { inline: "true" } : undefined,
  });
  return response.data.data;
}

export async function getFileMetadata(fileId: string): Promise<FileMetadata> {
  const response = await apiClient.get(`${FILE_API_BASE}/files/${fileId}`, { headers: authHeaders() });
  return response.data.data;
}

export async function listFiles(params?: {
  purpose?: string;
  limit?: number;
  offset?: number;
}): Promise<FileMetadata[]> {
  const response = await apiClient.get(`${FILE_API_BASE}/files/`, { params, headers: authHeaders() });
  return response.data.data;
}

/** Upload one file for any feature page and return its reusable storage ID. */
export async function uploadFile(
  file: File,
  purpose?: string,
  onProgress?: (progress: number) => void
): Promise<{ fileId: string; fileName: string }> {
  const upload = await getUploadUrl({
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    fileSize: file.size,
    purpose,
  });

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed with status ${xhr.status}`));
    });
    xhr.addEventListener("error", () => reject(new Error("Upload failed")));
    xhr.open("PUT", upload.uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.send(file);
  });

  await confirmUpload(upload.fileId);
  return { fileId: upload.fileId, fileName: file.name };
}

/** Ask the API for an authorized, short-lived download URL. */
export async function downloadFile(fileId: string): Promise<DownloadUrlResponse> {
  return getDownloadUrl(fileId);
}

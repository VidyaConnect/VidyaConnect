import { fetchWithAuth } from "@/services/fetchWithAuth";
import type {
  UploadUrlResponse,
  DownloadUrlResponse,
  ConfirmUploadResponse,
  FileMetadata,
} from "../types/file.types";

const FILE_API_BASE = process.env.NEXT_PUBLIC_FILE_API_URL || "http://localhost:3006";

async function requestData<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetchWithAuth(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) || {}),
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || `Request failed with status code ${response.status}`);
  }
  return body.data as T;
}

export async function getUploadUrl(payload: {
  fileName: string;
  contentType: string;
  fileSize: number;
  purpose?: string;
  scope?: "system";
}): Promise<UploadUrlResponse> {
  return requestData<UploadUrlResponse>(`${FILE_API_BASE}/files/upload-url`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function confirmUpload(fileId: string): Promise<ConfirmUploadResponse> {
  return requestData<ConfirmUploadResponse>(`${FILE_API_BASE}/files/${encodeURIComponent(fileId)}/confirm`, {
    method: "POST",
  });
}

export async function getDownloadUrl(
  fileId: string,
  options: { inline?: boolean } = {}
): Promise<DownloadUrlResponse> {
  const query = options.inline ? "?inline=true" : "";
  return requestData<DownloadUrlResponse>(
    `${FILE_API_BASE}/files/${encodeURIComponent(fileId)}/download-url${query}`
  );
}

export async function getFileMetadata(fileId: string): Promise<FileMetadata> {
  return requestData<FileMetadata>(`${FILE_API_BASE}/files/${encodeURIComponent(fileId)}`);
}

export async function listFiles(params?: {
  purpose?: string;
  limit?: number;
  offset?: number;
}): Promise<FileMetadata[]> {
  const query = new URLSearchParams();
  if (params?.purpose) query.set("purpose", params.purpose);
  if (params?.limit !== undefined) query.set("limit", String(params.limit));
  if (params?.offset !== undefined) query.set("offset", String(params.offset));
  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : "";
  return requestData<FileMetadata[]>(`${FILE_API_BASE}/files/${suffix}`);
}

/** Upload one file for any feature page and return its reusable storage ID. */
export async function uploadFile(
  file: File,
  purpose?: string,
  onProgress?: (progress: number) => void,
  scope?: "system"
): Promise<{ fileId: string; fileName: string }> {
  const upload = await getUploadUrl({
    fileName: file.name,
    contentType: file.type || "application/octet-stream",
    fileSize: file.size,
    purpose,
    scope,
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

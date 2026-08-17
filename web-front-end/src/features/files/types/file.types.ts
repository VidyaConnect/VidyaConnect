export interface FileMetadata {
  fileId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "DELETED";
  purpose: string | null;
  uploadedBy: string;
  createdAt: string;
}

export interface UploadUrlResponse {
  fileId: string;
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

export interface DownloadUrlResponse {
  fileId: string;
  downloadUrl: string;
  fileName: string;
  contentType: string;
  expiresIn: number;
}

export interface ConfirmUploadResponse {
  fileId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  status: string;
  s3Key: string;
  createdAt: string;
}

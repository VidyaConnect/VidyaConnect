"use client";

import FileDownload from "./FileDownload";
import FileUpload from "./FileUpload";

interface FileFieldProps {
  purpose: string;
  onChange: (file: { fileId: string; fileName: string } | null) => void;
  fileId?: string | null;
  fileName?: string | null;
  accept?: string;
  maxFileSizeBytes?: number;
  label?: string;
}

/** Shared upload/display/download field for feature forms that store a file ID. */
export default function FileField({
  purpose,
  onChange,
  fileId,
  fileName,
  accept,
  maxFileSizeBytes,
  label,
}: FileFieldProps) {
  return (
    <div className="space-y-3">
      {fileId && fileName ? (
        <div className="flex flex-wrap items-center gap-3">
          <FileDownload fileId={fileId} fileName={fileName} />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-on-surface-variant underline"
          >
            Remove attachment
          </button>
        </div>
      ) : (
        <FileUpload
          purpose={purpose}
          accept={accept}
          maxFileSizeBytes={maxFileSizeBytes}
          label={label}
          onUploadComplete={(uploadedFileId, uploadedFileName) =>
            onChange({ fileId: uploadedFileId, fileName: uploadedFileName })
          }
        />
      )}
    </div>
  );
}

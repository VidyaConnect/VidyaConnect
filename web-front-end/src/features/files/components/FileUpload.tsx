"use client";

import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { useFileUpload } from "../hooks/useFileUpload";

interface FileUploadProps {
  purpose?: string;
  onUploadComplete: (fileId: string, fileName: string) => void;
  accept?: string;
}

export default function FileUpload({ purpose, onUploadComplete, accept }: FileUploadProps) {
  const { uploadFile, isUploading, error, progress } = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const { fileId } = await uploadFile(selectedFile, purpose);
      onUploadComplete(fileId, selectedFile.name);
      setSelectedFile(null);
    } catch {
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <div className="flex items-center gap-2 px-4 py-3 border border-dashed border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors">
            <Upload className="w-4 h-4 text-on-surface-variant" />
            <span className="text-sm text-on-surface-variant">
              {selectedFile ? selectedFile.name : "Choose file to upload"}
            </span>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept={accept}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg">
          <File className="w-4 h-4 text-primary" />
          <span className="text-sm text-on-surface flex-1 truncate">{selectedFile.name}</span>
          <span className="text-xs text-on-surface-variant">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </span>
          <button onClick={handleClear} className="text-on-surface-variant hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="w-full bg-surface-container-low rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}

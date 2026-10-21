"use client";

import { useEffect, useState } from "react";
import { getDownloadUrl } from "../services/fileApi";

interface FileImageProps {
  fileId: string;
  alt: string;
  className?: string;
}

/** Loads a school-scoped image through a short-lived inline signed URL. */
export default function FileImage({ fileId, alt, className }: FileImageProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setSrc(null);
    setError(false);
    getDownloadUrl(fileId, { inline: true })
      .then((result) => {
        if (active) setSrc(result.downloadUrl);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [fileId]);

  if (error) return null;
  if (!src) return <span className={className} aria-label="Loading image" />;
  return <img src={src} alt={alt} className={className} />;
}

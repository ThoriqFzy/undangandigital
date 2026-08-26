/**
 * MEDIA UPLOAD COMPONENT — React Island
 * Drag & drop + click-to-upload with preview.
 */

import { useState, useRef, useCallback } from "react";

interface UploadResult {
  assetId: string;
  objectKey: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
}

interface MediaUploadProps {
  invitationId: string;
  folder?: string;
  onUploadComplete?: (result: UploadResult) => void;
  multiple?: boolean;
  accept?: string;
}

export default function MediaUpload({
  invitationId,
  folder = "uploads",
  onUploadComplete,
  multiple = false,
  accept = "image/jpeg,image/png,image/webp,image/avif",
}: MediaUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<UploadResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);
    setError("");
    setProgress(0);

    const fileArray = Array.from(files);
    const total = fileArray.length;
    let completed = 0;

    for (const file of fileArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("invitationId", invitationId);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error?.message || "Upload gagal");
        }

        const data = await res.json();
        const result: UploadResult = data.data;
        setUploaded(prev => [...prev, result]);
        onUploadComplete?.(result);
      } catch (err: any) {
        setError(err.message || "Upload gagal");
      } finally {
        completed++;
        setProgress(Math.round((completed / total) * 100));
      }
    }

    setUploading(false);
  }, [invitationId, folder, onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) {
      handleUpload(e.dataTransfer.files);
    }
  }, [handleUpload]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
        }`}
      >
        <svg className={`mb-3 h-10 w-10 ${dragging ? "text-indigo-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm font-medium text-gray-700">
          {dragging ? "Lepaskan file di sini" : "Klik atau seret file ke sini"}
        </p>
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP, AVIF · Maks 10MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />

      {/* Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-gray-500">Mengupload... {progress}%</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Uploaded files */}
      {uploaded.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-700">{uploaded.length} file terupload:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {uploaded.map((file, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                {file.mimeType.startsWith("image/") ? (
                  <img src={file.publicUrl} alt="" className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-gray-100">
                    <span className="text-2xl">🎵</span>
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[10px] text-gray-500 truncate">{(file.fileSize / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

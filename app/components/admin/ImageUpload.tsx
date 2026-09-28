"use client";
import { useState } from "react";

/** Uploads an image to /api/upload (Cloudinary) and returns its URL. */
export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint,
  shape = "wide",
}: {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  shape?: "wide" | "square";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5 MB.");
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      onChange(json.url ?? json.path);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div
          className={`flex-shrink-0 overflow-hidden border rounded-lg border-border bg-cream flex items-center justify-center ${
            shape === "square" ? "w-24 h-24" : "w-40 h-24"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className={`w-full h-full ${shape === "square" ? "object-cover object-top" : "object-contain p-2"}`}
            />
          ) : (
            <span className="text-[11px] text-ink-muted font-body">No image</span>
          )}
        </div>
        <div className="space-y-2">
          <label
            className={`inline-block cursor-pointer bg-gold text-white px-4 py-2 rounded-md text-xs font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? "Uploading…" : value ? "Change image" : "Upload image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="block text-xs text-red-500 font-body hover:underline"
            >
              Remove
            </button>
          )}
          {hint && <p className="text-[11px] text-ink-muted font-body">{hint}</p>}
          {error && <p className="text-xs text-red-500 font-body">{error}</p>}
        </div>
      </div>
    </div>
  );
}

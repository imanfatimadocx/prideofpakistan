"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitStoryForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", shortdesc: "", content: "" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add this interface at the top of SubmitStoryForm.tsx
  interface ImageItem {
    src: string;
    caption: string;
    hidden?: boolean;
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return null;
    const json = await res.json();
    return json.url ?? json.path ?? null;
  }

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url)
        setImages((prev) => [
          ...prev,
          { src: url, caption: "", hidden: false },
        ]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function updateCaption(index: number, caption: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img)),
    );
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and story content are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let image: string | null = null;
      if (coverFile) image = await uploadFile(coverFile);

      const res = await fetch("/api/user-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image, images }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Something went wrong.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-10 text-center bg-white border border-border rounded-xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold font-display text-green">
          Story Submitted!
        </h2>
        <p className="mb-6 text-sm text-ink-muted font-body">
          Your story is under review and will appear once approved.
        </p>
        <button
          onClick={() => router.push("/your-stories")}
          className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors"
        >
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 font-body">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Story Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Give your story a title…"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Short Summary
          </label>
          <textarea
            value={form.shortdesc}
            onChange={(e) =>
              setForm((f) => ({ ...f, shortdesc: e.target.value }))
            }
            rows={2}
            placeholder="A brief summary of your story…"
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none"
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
        <h2 className="text-base font-bold font-display text-green">
          Cover Image
        </h2>
        {coverPreview && (
          <div
            className="w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: "600/350" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPreview}
              alt="Cover preview"
              className="object-top w-full h-full object-fit"
            />
          </div>
        )}
        <label className="w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block">
          {coverPreview ? "Change Cover Image" : "Upload Cover Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
        </label>
      </div>

      {/* Story content */}
      <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
        <h2 className="text-base font-bold font-display text-green">
          Your Story *
        </h2>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={12}
          placeholder="Write your story here…"
          className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none leading-relaxed"
        />
      </div>

      {/* Additional images */}
      <div className="p-5 space-y-4 bg-white border border-border rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-green">
            Additional Images
          </h2>
          <label
            className={`cursor-pointer bg-gold text-white px-4 py-2 rounded-md text-xs font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {uploading ? "Uploading…" : "+ Add Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddImage}
              disabled={uploading}
            />
          </label>
        </div>
        {images.length > 0 && (
          <div className="space-y-3">
            {images.map((img, i) => (
              <div
                key={i}
                className={`flex gap-3 items-start p-3 border rounded-xl ${img.hidden ? "border-border bg-gray-50" : "border-border bg-cream"}`}
              >
                <div
                  className="flex-shrink-0 w-24 overflow-hidden rounded-lg"
                  style={{ aspectRatio: "600/350" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.caption}
                    className={`w-full h-full object-cover ${img.hidden ? "grayscale opacity-40" : ""}`}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => updateCaption(i, e.target.value)}
                    placeholder="Caption…"
                    className="w-full px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) =>
                          prev.map((img, idx) =>
                            idx === i ? { ...img, hidden: !img.hidden } : img,
                          ),
                        )
                      }
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-body transition-colors ${
                        img.hidden
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-green/10 text-green border-green/20 hover:bg-green/20"
                      }`}
                    >
                      {img.hidden ? "● Hidden" : "● Live"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-xs text-red-500 font-body hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Story for Review"}
      </button>
    </form>
  );
}

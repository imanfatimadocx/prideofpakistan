"use client";
import { useState } from "react";

interface Section {
  section: string;
  label: string;
  content: Record<string, string>;
}

function resolveImage(img: string | null): string | null {
  if (!img || img.trim() === "") return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  return `/uploads/${img}`;
}

function SectionEditor({
  section,
  onSaved,
}: {
  section: Section;
  onSaved: (s: string, c: Record<string, string>) => void;
}) {
  const [content, setContent] = useState(section.content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    section.section === "hero"
      ? resolveImage(section.content.image ?? null)
      : null,
  );

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      const url = json.url ?? json.path ?? "";
      setContent((c) => ({ ...c, image: url }));
      setImagePreview(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/homepage/${section.section}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        setError("Failed to save.");
        return;
      }
      setSaved(true);
      onSaved(section.section, content);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const hasImage = section.section === "hero";

  return (
    <div className="overflow-hidden bg-white border border-border rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-cream">
        <h2 className="text-base font-bold font-display text-green">
          {section.label}
        </h2>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-semibold text-green font-body">
              ✓ Saved
            </span>
          )}
          {error && (
            <span className="text-xs text-red-500 font-body">{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Eyebrow */}
        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Eyebrow Label
          </label>
          <input
            type="text"
            value={content.eyebrow ?? ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, eyebrow: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
          />
        </div>

        {/* Heading */}
        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Heading
          </label>
          <input
            type="text"
            value={content.heading ?? ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, heading: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
          />
        </div>

        {/* Subtext */}
        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Subtext
          </label>
          <textarea
            value={content.subtext ?? ""}
            onChange={(e) =>
              setContent((c) => ({ ...c, subtext: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none"
          />
        </div>

        {/* Hero image — only shown for hero section */}
        {hasImage && (
          <div>
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
              Hero Image
            </label>
            {imagePreview ? (
              <div
                className="w-full mb-3 overflow-hidden border rounded-lg border-border"
                style={{ aspectRatio: "1200/500" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Hero"
                  className="object-cover object-top w-full h-full"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center w-full mb-3 overflow-hidden border-2 border-dashed rounded-lg border-border bg-cream"
                style={{ aspectRatio: "1200/500" }}
              >
                <p className="text-sm text-ink-muted font-body">
                  No hero image set — upload one below
                </p>
              </div>
            )}
            <label
              className={`w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploading
                ? "Uploading…"
                : imagePreview
                  ? "Change Hero Image"
                  : "Upload Hero Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
            <p className="text-[11px] text-ink-muted font-body mt-1.5">
              Recommended size: 1200 × 500px. Uploaded to Cloudinary.
            </p>
            {imagePreview && (
              <button
                onClick={() => {
                  setContent((c) => ({ ...c, image: "" }));
                  setImagePreview(null);
                }}
                className="block mt-2 text-xs text-red-500 font-body hover:underline"
              >
                Remove image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomepageEditorClient({
  sections: initial,
}: {
  sections: Section[];
}) {
  const [sections, setSections] = useState(initial);

  function handleSaved(sectionKey: string, content: Record<string, string>) {
    setSections((prev) =>
      prev.map((s) => (s.section === sectionKey ? { ...s, content } : s)),
    );
  }

  // Fixed ORDER — must match exact section keys from DB
  const ORDER = [
    "hero",
    "page_whoiswho",
    "page_products",
    "page_businesses",
    "page_news",
    "page_stories",
    "page_contact",
    "page_pridetv",
  ];

  const sorted = [...sections].sort(
    (a, b) => ORDER.indexOf(a.section) - ORDER.indexOf(b.section),
  );

  return (
    <div className="space-y-5">
      {sorted.map((s) => (
        <SectionEditor key={s.section} section={s} onSaved={handleSaved} />
      ))}
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ImageItem {
  src: string;
  caption: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  shortdesc: string;
  smallimage: string | null;
  status: number;
  images: ImageItem[];
}

export default function NewsEditClient({
  item: initial,
  isNew = false,
}: {
  item: NewsItem;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [images, setImages] = useState<ImageItem[]>(initial.images);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initial.smallimage,
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content: initial.description,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[240px] focus:outline-none font-body text-ink-dark leading-relaxed p-4 text-sm",
      },
    },
  });

  function toolbar(action: () => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
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
      if (url) setImages((prev) => [...prev, { src: url, caption: "" }]);
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

  function moveUp(index: number) {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    setImages((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let smallimage = form.smallimage;
      if (coverFile) {
        const url = await uploadFile(coverFile);
        if (url) smallimage = url;
      }
      const description = editor?.getHTML() ?? form.description;
      const payload = { ...form, description, smallimage, images };

      if (isNew) {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          setError("Failed to create.");
          return;
        }
        const json = await res.json();
        router.push(`/admin/news/${json.id}/edit`);
        return;
      }

      const res = await fetch(`/api/admin/news/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Failed to save.");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="text-sm no-underline text-gold font-body hover:underline"
          >
            ← News
          </Link>
          <span className="text-ink-muted">/</span>
          <h1 className="font-display text-xl font-bold text-green">
            {isNew ? "Write News" : form.title || "Edit News"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isNew ? "Publish" : "Save Changes"}
        </button>
      </div>

      {saved && (
        <div className="bg-green/10 border border-green/20 rounded-lg px-4 py-3 mb-5 text-sm text-green font-semibold font-body">
          Saved successfully.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm text-red-600 font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          {/* Title + shortdesc */}
          <div className="bg-white border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-green">
              News Details
            </h2>
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                Short Description
              </label>
              <textarea
                value={form.shortdesc}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortdesc: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none"
                placeholder="Brief summary shown on listing cards…"
              />
            </div>
          </div>

          {/* Full content */}
          <div className="bg-white border border-border rounded-xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-green">
              Content
            </h2>
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-cream">
                <button
                  onClick={toolbar(() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                  )}
                  className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}
                >
                  H2
                </button>
                <button
                  onClick={toolbar(() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run(),
                  )}
                  className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive("heading", { level: 3 }) ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}
                >
                  H3
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                  onClick={toolbar(() =>
                    editor?.chain().focus().toggleBold().run(),
                  )}
                  className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive("bold") ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}
                >
                  B
                </button>
                <button
                  onClick={toolbar(() =>
                    editor?.chain().focus().toggleItalic().run(),
                  )}
                  className={`px-2.5 py-1 rounded text-xs italic font-body transition-colors ${editor?.isActive("italic") ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}
                >
                  I
                </button>
                <div className="w-px h-4 bg-border mx-1" />
                <button
                  onClick={toolbar(() =>
                    editor?.chain().focus().toggleBulletList().run(),
                  )}
                  className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive("bulletList") ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}
                >
                  • List
                </button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().undo().run())}
                  className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border"
                >
                  ↩
                </button>
                <button
                  onClick={toolbar(() => editor?.chain().focus().redo().run())}
                  className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border"
                >
                  ↪
                </button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Multiple images */}
          <div className="bg-white border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-green">
                Images
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
            <p className="text-[11px] text-ink-muted font-body">
              Images float alongside the article text on the public page. Best
              size: 600 × 350px.
            </p>

            {images.length === 0 ? (
              <div className="border-2 border-dashed border-border rounded-xl py-8 text-center">
                <p className="text-sm text-ink-muted font-body">
                  No images yet. Click "Add Image" to upload.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-4 border border-border rounded-xl bg-cream"
                  >
                    <div
                      className="flex-shrink-0 w-28 overflow-hidden rounded-lg border border-border"
                      style={{ aspectRatio: "600/350" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateCaption(i, e.target.value)}
                        placeholder="Image caption…"
                        className="w-full px-3 py-2 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => moveUp(i)}
                          disabled={i === 0}
                          className="text-xs text-ink-muted font-body hover:text-green disabled:opacity-30"
                        >
                          ↑ Up
                        </button>
                        <button
                          onClick={() => moveDown(i)}
                          disabled={i === images.length - 1}
                          className="text-xs text-ink-muted font-body hover:text-green disabled:opacity-30"
                        >
                          ↓ Down
                        </button>
                        <button
                          onClick={() => removeImage(i)}
                          className="text-xs text-red-500 font-body hover:text-red-700 ml-auto"
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
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-green">
              Cover Image
            </h2>
            <div
              className="w-full overflow-hidden rounded-lg border border-border bg-cream"
              style={{ aspectRatio: "600/350" }}
            >
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm font-body">
                  No cover
                </div>
              )}
            </div>
            <label className="w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block">
              {coverPreview ? "Change Cover" : "Upload Cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </label>
          </div>

          {/* Status */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-green">
              Status
            </h2>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: Number(e.target.value) }))
              }
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
            >
              <option value={0}>Draft</option>
              <option value={1}>Published</option>
            </select>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gold text-white rounded-md py-3 text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isNew ? "Publish News" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

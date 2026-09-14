"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ImageItem {
  src: string;
  caption: string;
  hidden?: boolean;
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
  const [coverPreview, setCoverPreview] = useState<string | null>(initial.smallimage);
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
        class: "prose prose-neutral max-w-none min-h-[240px] focus:outline-none font-body text-ink-dark leading-relaxed p-4 text-sm",
      },
    },
  });

  function toolbar(action: () => void) {
    return (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); action(); };
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
      if (url) setImages((prev) => [...prev, { src: url, caption: "", hidden: false }]);
    } finally { setUploading(false); e.target.value = ""; }
  }

  function updateCaption(index: number, caption: string) {
    setImages((prev) => prev.map((img, i) => i === index ? { ...img, caption } : img));
  }

  function toggleHidden(index: number) {
    setImages((prev) => prev.map((img, i) => i === index ? { ...img, hidden: !img.hidden } : img));
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
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true); setError(null);
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
        if (!res.ok) { setError("Failed to create."); return; }
        const json = await res.json();
        router.push(`/admin/news/${json.id}/edit`);
        return;
      }

      const res = await fetch(`/api/admin/news/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { setError("Failed to save."); return; }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Something went wrong."); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-[900px] pt-14">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/news" className="text-sm no-underline text-gold font-body hover:underline">← Discussion Forum</Link>
          <span className="text-ink-muted">/</span>
          <h1 className="text-xl font-bold font-display text-green">
            {isNew ? "Write to Discussion Forum" : form.title || "Edit in Discussion Forum"}
          </h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50">
          {saving ? "Saving..." : isNew ? "Publish" : "Save Changes"}
        </button>
      </div>

      {saved && <div className="px-4 py-3 mb-5 text-sm font-semibold border rounded-lg bg-green/10 border-green/20 text-green font-body">Saved successfully.</div>}
      {error && <div className="px-4 py-3 mb-5 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 font-body">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Left */}
        <div className="space-y-5">

          {/* Title + shortdesc */}
          <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Discussion Forum Details</h2>
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">Short Description</label>
              <textarea value={form.shortdesc} onChange={(e) => setForm((f) => ({ ...f, shortdesc: e.target.value }))} rows={3} className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none" placeholder="Brief summary shown on listing cards…" />
            </div>
          </div>

          {/* Full content */}
          <div className="p-6 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Content</h2>
            <div className="overflow-hidden border border-border rounded-xl">
              <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-cream">
                <button onClick={toolbar(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())} className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}>H2</button>
                <button onClick={toolbar(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())} className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive("heading", { level: 3 }) ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}>H3</button>
                <div className="w-px h-4 mx-1 bg-border" />
                <button onClick={toolbar(() => editor?.chain().focus().toggleBold().run())} className={`px-2.5 py-1 rounded text-xs font-bold font-body transition-colors ${editor?.isActive("bold") ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}>B</button>
                <button onClick={toolbar(() => editor?.chain().focus().toggleItalic().run())} className={`px-2.5 py-1 rounded text-xs italic font-body transition-colors ${editor?.isActive("italic") ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}>I</button>
                <div className="w-px h-4 mx-1 bg-border" />
                <button onClick={toolbar(() => editor?.chain().focus().toggleBulletList().run())} className={`px-2.5 py-1 rounded text-xs font-body transition-colors ${editor?.isActive("bulletList") ? "bg-green text-white" : "text-ink-mid hover:bg-border"}`}>• List</button>
                <button onClick={toolbar(() => editor?.chain().focus().undo().run())} className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border">↩</button>
                <button onClick={toolbar(() => editor?.chain().focus().redo().run())} className="px-2.5 py-1 rounded text-xs text-ink-muted font-body hover:bg-border">↪</button>
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Multiple images */}
          <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-green">Images</h2>
              <label className={`cursor-pointer bg-gold text-white px-4 py-2 rounded-md text-xs font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {uploading ? "Uploading…" : "+ Add Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} disabled={uploading} />
              </label>
            </div>
            <p className="text-[11px] text-ink-muted font-body">Images float alongside the article text on the public page. Best size: 600 × 350px.</p>

            {images.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-sm text-ink-muted font-body">No images yet. Click "Add Image" to upload.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img, i) => (
                  <div key={i} className={`flex gap-4 items-start p-4 border rounded-xl ${img.hidden ? 'border-border bg-gray-50' : 'border-border bg-cream'}`}>
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 overflow-hidden border rounded-lg w-28 border-border" style={{ aspectRatio: '600/350' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.caption} className={`w-full h-full object-cover object-top ${img.hidden ? 'grayscale opacity-40' : ''}`} />
                    </div>
                    {/* Controls */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateCaption(i, e.target.value)}
                        placeholder="Image caption…"
                        className="w-full px-3 py-2 text-sm border rounded-md border-border font-body focus:outline-none focus:border-gold"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => moveUp(i)} disabled={i === 0} className="text-xs text-ink-muted font-body hover:text-green disabled:opacity-30">↑ Up</button>
                        <button onClick={() => moveDown(i)} disabled={i === images.length - 1} className="text-xs text-ink-muted font-body hover:text-green disabled:opacity-30">↓ Down</button>
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => toggleHidden(i)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-body transition-colors ${
                              img.hidden
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-green/10 text-green border-green/20 hover:bg-green/20'
                            }`}
                          >
                            {img.hidden ? '● Hidden' : '● Live'}
                          </button>
                          <button onClick={() => removeImage(i)} className="text-xs text-red-500 font-body hover:underline">Remove</button>
                        </div>
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
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Cover Image</h2>
            <div className="w-full overflow-hidden border rounded-lg border-border bg-cream" style={{ aspectRatio: "600/350" }}>
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="Cover" className="object-cover object-top w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-ink-muted font-body">No cover</div>
              )}
            </div>
            <label className="w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block">
              {coverPreview ? "Change Cover" : "Upload Cover"}
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            </label>
          </div>

          {/* Status */}
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">Status</h2>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: Number(e.target.value) }))} className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold">
              <option value={0}>Draft</option>
              <option value={1}>Published</option>
            </select>
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving} className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50">
            {saving ? "Saving..." : isNew ? "Publish Story" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
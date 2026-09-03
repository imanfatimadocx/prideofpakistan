"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Product {
  id: number;
  title: string;
  categoryid: number;
  description: string;
  shortdesc: string;
  status: number;
  feature: number;
  image: string | null;
  City: string;
  email: string;
  phone: string;
  address: string;
  meta_title: string;
  meta_desc: string;
  meta_keyword: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductEditClient({
  product: initial,
  categories,
  isNew = false,
}: {
  product: Product;
  categories: Category[];
  isNew?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial.image,
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content: initial.description,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[200px] focus:outline-none font-body text-ink-dark leading-relaxed p-4 text-sm",
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let imagePath = form.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const json = await uploadRes.json();
          imagePath = json.url ?? json.path ?? imagePath;
        }
      }
      const description = editor?.getHTML() ?? form.description;

      if (isNew) {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: imagePath, description }),
        });
        if (!res.ok) {
          setError("Failed to create.");
          return;
        }
        const json = await res.json();
        router.push(`/admin/products/${json.id}/edit`);
        return;
      }

      const res = await fetch(`/api/admin/products/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imagePath, description }),
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

  async function handleDelete() {
    if (!confirm("Delete this product permanently?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/products/${form.id}`, { method: "DELETE" });
      router.push("/admin/products");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-[900px] pt-14">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <NextLink
            href="/admin/products"
            className="text-sm no-underline text-gold font-body hover:underline"
          >
            ← Products
          </NextLink>
          <span className="text-ink-muted">/</span>
          <h1 className="font-display text-xl font-bold text-green">
            {isNew ? "Add New Product" : form.title || "Edit Product"}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
          </button>
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deleting ? "..." : "Delete"}
            </button>
          )}
        </div>
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
          {/* Basic info */}
          <div className="bg-white border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-green">
              Product Information
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
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
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
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Brief overview shown on listing cards…"
              />
            </div>
          </div>

          {/* Full description */}
          <div className="bg-white border border-border rounded-xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-green">
              Full Description
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
              </div>
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-border rounded-xl p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-green">SEO</h2>
            {[
              { label: "Meta Title", key: "meta_title" },
              { label: "Meta Description", key: "meta_desc" },
              { label: "Meta Keywords", key: "meta_keyword" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                  {label}
                </label>
                <input
                  type="text"
                  value={(form as unknown as Record<string, string>)[key] ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Image */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-green">
              Photo
            </h2>
            <div
              className="w-full overflow-hidden rounded-lg border border-border bg-cream"
              style={{ aspectRatio: "600/350" }}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm font-body">
                  No photo
                </div>
              )}
            </div>
            <label className="w-full cursor-pointer bg-cream border border-border rounded-md px-4 py-2.5 text-xs font-semibold text-ink-dark font-body hover:border-gold transition-colors text-center block">
              {imagePreview ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
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
              <option value={0}>Pending</option>
              <option value={1}>Approved</option>
              <option value={2}>Rejected</option>
            </select>
          </div>

          {/* Category */}
          <div className="bg-white border border-border rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-green">
              Category
            </h2>
            <select
              value={form.categoryid}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryid: Number(e.target.value) }))
              }
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
            >
              <option value={0}>— Select category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-green">
                  Featured
                </h2>
                <p className="text-xs text-ink-muted font-body mt-1">
                  Featured products appear on the homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, feature: f.feature === 1 ? 0 : 1 }))
                }
                className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors flex items-center ${form.feature === 1 ? "bg-gold" : "bg-border"}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.feature === 1 ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gold text-white rounded-md py-3 text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
            </button>
            {!isNew && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full bg-red-50 text-red-700 border border-red-200 rounded-md py-3 text-sm font-semibold font-body hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

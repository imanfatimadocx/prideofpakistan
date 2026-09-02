"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Business {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  address: string;
  site_url: string;
  shortdesc: string;
  description: string;
  status: number;
  feature: number;
  category_id: number | null;
  image: string | null;
}

interface Category {
  id: number;
  name: string;
}

function resolveImage(img: string | null): string | null {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return img;
  if (img.startsWith("uploads/")) return `/${img}`;
  return `/uploads/${img}`;
}

export default function BusinessEditClient({
  business: initial,
  categories,
  isNew = false,
}: {
  business: Business;
  categories: Category[];
  isNew?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    resolveImage(initial.image),
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
    if (!form.company_name.trim()) {
      setError("Company name is required.");
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
        const res = await fetch("/api/admin/business", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, image: imagePath, description }),
        });
        if (!res.ok) {
          setError("Failed to create.");
          return;
        }
        const json = await res.json();
        router.push(`/admin/business/${json.id}/edit`);
        return;
      }

      const res = await fetch(`/api/admin/business/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: imagePath, description }),
      });
      if (!res.ok) {
        setError("Failed to save.");
        return;
      }
      setForm((f) => ({ ...f, image: imagePath }));
      setImagePreview(resolveImage(imagePath));
      setImageFile(null);
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
    if (!confirm("Delete this business permanently?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/business/${form.id}`, { method: "DELETE" });
      router.push("/admin/business");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-[900px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pt-8">
        <div className="flex items-center gap-3">
          <NextLink
            href="/admin/business"
            className="text-sm no-underline text-gold font-body hover:underline"
          >
            ← Businesses
          </NextLink>
          <span className="text-ink-muted">/</span>
          <h1 className="text-xl font-bold font-display text-green">
            {isNew ? "Add New Business" : form.company_name || "Edit Business"}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : isNew ? "Create Business" : "Save Changes"}
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
        <div className="px-4 py-3 mb-5 text-sm font-semibold border rounded-lg bg-green/10 border-green/20 text-green font-body">
          Saved successfully.
        </div>
      )}
      {error && (
        <div className="px-4 py-3 mb-5 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          {/* Basic info */}
          <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">
              Business Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Company Name *", key: "company_name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Website URL", key: "site_url" },
                { label: "City", key: "city" },
                { label: "Country", key: "country" },
                { label: "Address", key: "address" },
              ].map(({ label, key }) => (
                <div
                  key={key}
                  className={key === "address" ? "sm:col-span-2" : ""}
                >
                  <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={
                      (form as unknown as Record<string, string>)[key] ?? ""
                    }
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Short description */}
          <div className="p-6 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">
              Short Description
            </h2>
            <textarea
              value={form.shortdesc}
              onChange={(e) =>
                setForm((f) => ({ ...f, shortdesc: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Brief description shown on listing cards…"
            />
          </div>

          {/* Full description */}
          <div className="p-6 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">
              Full Description
            </h2>
            <div className="overflow-hidden border border-border rounded-xl">
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
                <div className="w-px h-4 mx-1 bg-border" />
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
                <div className="w-px h-4 mx-1 bg-border" />
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
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Image */}
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">
              Photo
            </h2>
            <div
              className="w-full overflow-hidden border rounded-lg border-border bg-cream"
              style={{ aspectRatio: "600/350" }}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover object-top w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-ink-muted font-body">
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
            <p className="text-[11px] text-ink-muted font-body text-center">
              Best size: 600 × 350px
            </p>
          </div>

          {/* Status */}
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">
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
          <div className="p-5 space-y-3 bg-white border border-border rounded-xl">
            <h2 className="text-base font-bold font-display text-green">
              Category
            </h2>
            <select
              value={form.category_id ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category_id: e.target.value ? Number(e.target.value) : null,
                }))
              }
              className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
            >
              <option value="">— Select category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured */}
          <div className="p-5 bg-white border border-border rounded-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold font-display text-green">
                  Featured
                </h2>
                <p className="mt-1 text-xs text-ink-muted font-body">
                  Featured businesses appear on the homepage.
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

          {/* Save/Delete */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isNew
                  ? "Create Business"
                  : "Save Changes"}
            </button>
            {!isNew && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-3 text-sm font-semibold text-red-700 transition-colors border border-red-200 rounded-md bg-red-50 font-body hover:bg-red-100 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Business"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

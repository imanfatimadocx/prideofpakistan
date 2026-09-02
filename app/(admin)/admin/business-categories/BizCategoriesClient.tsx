"use client";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  status: number;
}

export default function BizCategoriesClient({
  categories: initial,
}: {
  categories: Category[];
}) {
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!newName.trim()) {
      setError("Name required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/business-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setCategories((prev) =>
        [...prev, { id: json.id, name: newName.trim(), status: 1 }].sort(
          (a, b) => a.name.localeCompare(b.name),
        ),
      );
      setNewName("");
    } catch {
      setError("Failed to add.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/business-categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editName.trim() } : c)),
      );
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/business-categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="p-5 bg-white border border-border rounded-xl">
        <h2 className="mb-4 text-base font-bold font-display text-green">
          Add New Category
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Category name…"
            className="flex-1 border border-border rounded-md px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gold"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
          >
            {saving ? "..." : "Add"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-500 font-body">{error}</p>
        )}
      </div>

      <div className="overflow-hidden bg-white border border-border rounded-xl">
        <div className="px-5 py-3 border-b border-border bg-cream">
          <p className="text-xs font-bold tracking-wide uppercase text-ink-muted font-body">
            {categories.length} categories
          </p>
        </div>
        <div className="divide-y divide-border">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-3">
              {editingId === c.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(c.id)}
                    autoFocus
                    className="flex-1 border border-gold rounded-md px-3 py-1.5 text-sm font-body focus:outline-none"
                  />
                  <button
                    onClick={() => handleUpdate(c.id)}
                    disabled={saving}
                    className="text-xs font-semibold text-green font-body hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-ink-muted font-body hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-sm font-body text-ink-dark">
                    {c.name}
                  </p>
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditName(c.name);
                    }}
                    className="text-xs font-semibold text-gold font-body hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deleting === c.id}
                    className="text-xs text-red-500 font-body hover:underline disabled:opacity-50"
                  >
                    {deleting === c.id ? "..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  status: number;
  count: number;
}

export default function VideoCategoriesClient({
  categories: initial,
  uncategorised,
}: {
  categories: Category[];
  uncategorised: number;
}) {
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error ?? "Request failed.");
    return json;
  }

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return setError("Name is required.");
    setBusy(true);
    setError(null);
    try {
      const json = await call("/api/admin/video-categories", "POST", { name });
      setCategories((prev) => [...prev, { id: json.id, name, status: 1, count: 0 }]);
      setNewName("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRename(id: number) {
    const name = editName.trim();
    if (!name) return;
    setBusy(true);
    try {
      await call(`/api/admin/video-categories/${id}`, "PATCH", { name });
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
      setEditingId(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(c: Category) {
    const status = c.status === 1 ? 0 : 1;
    setCategories((prev) => prev.map((x) => (x.id === c.id ? { ...x, status } : x)));
    try {
      await call(`/api/admin/video-categories/${c.id}`, "PATCH", { status });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    try {
      await call("/api/admin/video-categories", "PUT", { order: next.map((c) => c.id) });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(c: Category) {
    const msg = c.count
      ? `Delete "${c.name}"? Its ${c.count} video(s) will stay on the site as Uncategorised.`
      : `Delete "${c.name}"?`;
    if (!confirm(msg)) return;
    setBusy(true);
    try {
      await call(`/api/admin/video-categories/${c.id}`, "DELETE");
      setCategories((prev) => prev.filter((x) => x.id !== c.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="p-5 bg-white border border-border rounded-xl">
        <h2 className="mb-4 text-base font-bold font-display text-green">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Interviews, Events, Culture…"
            className="flex-1 border border-border rounded-md px-3 py-2.5 text-sm font-body focus:outline-none focus:border-gold"
          />
          <button
            onClick={handleAdd}
            disabled={busy}
            className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-500 font-body">{error}</p>}
      </div>

      <div className="overflow-hidden bg-white border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-cream">
          <p className="text-xs font-bold tracking-wide uppercase text-ink-muted font-body">
            {categories.length} categories
          </p>
          {uncategorised > 0 && (
            <p className="text-xs text-ink-muted font-body">
              {uncategorised} video(s) uncategorised ·{" "}
              <Link href="/admin/media" className="text-gold hover:underline">
                assign them
              </Link>
            </p>
          )}
        </div>
        {categories.length === 0 ? (
          <p className="px-5 py-10 text-sm text-center text-ink-muted font-body">
            No categories yet. Add your first one above.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-[10px] leading-none text-ink-muted hover:text-green disabled:opacity-25" aria-label="Move up">▲</button>
                  <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} className="text-[10px] leading-none text-ink-muted hover:text-green disabled:opacity-25" aria-label="Move down">▼</button>
                </div>
                {editingId === c.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(c.id)}
                      autoFocus
                      className="flex-1 border border-gold rounded-md px-3 py-1.5 text-sm font-body focus:outline-none"
                    />
                    <button onClick={() => handleRename(c.id)} disabled={busy} className="text-xs font-semibold text-green font-body hover:underline">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-ink-muted font-body hover:underline">Cancel</button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-body ${c.status === 1 ? "text-ink-dark" : "text-ink-muted line-through"}`}>{c.name}</p>
                      <p className="text-[11px] text-ink-muted font-body">{c.count} video{c.count === 1 ? "" : "s"}</p>
                    </div>
                    <button
                      onClick={() => toggle(c)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-body ${
                        c.status === 1
                          ? "bg-green/10 text-green border-green/20"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {c.status === 1 ? "● Live" : "● Hidden"}
                    </button>
                    <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="text-xs font-semibold text-gold font-body hover:underline">Rename</button>
                    <button onClick={() => handleDelete(c)} disabled={busy} className="text-xs text-red-500 font-body hover:underline disabled:opacity-50">Delete</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import ImageUpload from "@/app/components/admin/ImageUpload";

interface Sponsor {
  id: number;
  title: string;
  shortdesc: string;
  smallimage: string;
  website: string;
  status: number;
}

const EMPTY: Omit<Sponsor, "id"> = {
  title: "",
  shortdesc: "",
  smallimage: "",
  website: "",
  status: 1,
};

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors";
const labelCls =
  "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

export default function SponsorsClient({ sponsors: initial }: { sponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function reset() {
    setForm(EMPTY);
    setEditingId(null);
    setError(null);
  }

  function edit(s: Sponsor) {
    setForm({ title: s.title, shortdesc: s.shortdesc, smallimage: s.smallimage, website: s.website, status: s.status });
    setEditingId(s.id);
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!form.title.trim()) return setError("Sponsor name is required.");
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        editingId ? `/api/admin/sponsors/${editingId}` : "/api/admin/sponsors",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error ?? "Failed to save.");
      const website =
        form.website && !/^https?:\/\//i.test(form.website) ? `https://${form.website}` : form.website;
      if (editingId) {
        setSponsors((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form, website } : s)));
        setNotice("Sponsor updated.");
      } else {
        setSponsors((prev) => [...prev, { id: json.id, ...form, website }]);
        setNotice("Sponsor added.");
      }
      reset();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(s: Sponsor) {
    const status = s.status === 1 ? 0 : 1;
    setSponsors((prev) => prev.map((x) => (x.id === s.id ? { ...x, status } : x)));
    await fetch(`/api/admin/sponsors/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sponsors.length) return;
    const next = [...sponsors];
    [next[i], next[j]] = [next[j], next[i]];
    setSponsors(next);
    await fetch("/api/admin/sponsors", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((s) => s.id) }),
    });
  }

  async function remove(s: Sponsor) {
    if (!confirm(`Delete sponsor "${s.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/sponsors/${s.id}`, { method: "DELETE" });
    if (res.ok) {
      setSponsors((prev) => prev.filter((x) => x.id !== s.id));
      if (editingId === s.id) reset();
    }
  }

  return (
    <div className="space-y-8">
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <h2 className="text-lg font-bold font-display text-green">
          {editingId ? "Edit Sponsor" : "Add a Sponsor"}
        </h2>

        <div>
          <label className={labelCls}>
            Sponsor name <span className="text-gold">*</span>
          </label>
          <input className={input} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Habib Bank Limited" />
        </div>

        <ImageUpload
          label="Logo"
          value={form.smallimage || null}
          onChange={(url) => setForm((f) => ({ ...f, smallimage: url }))}
          hint="A PNG with a transparent background looks best."
        />

        <div>
          <label className={labelCls}>Website</label>
          <input className={input} value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://www.example.com" />
          <p className="text-[11px] text-ink-muted font-body mt-1">Visitors go here when they click the logo.</p>
        </div>

        <div>
          <label className={labelCls}>Short description</label>
          <textarea rows={3} className={`${input} resize-none`} value={form.shortdesc} onChange={(e) => setForm((f) => ({ ...f, shortdesc: e.target.value }))} placeholder="One or two lines about the sponsor…" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
          <input type="checkbox" checked={form.status === 1} onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked ? 1 : 0 }))} className="w-4 h-4 accent-[#C9992A]" />
          <span className="text-sm text-ink-dark font-body">Show on the website</span>
        </label>

        {error && <p className="text-sm text-red-500 font-body">{error}</p>}

        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Update Sponsor" : "Add Sponsor"}
          </button>
          {editingId && (
            <button onClick={reset} className="border border-border text-ink-mid px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:border-green hover:text-green transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display text-green">
            All Sponsors <span className="text-base font-normal text-ink-muted">({sponsors.length})</span>
          </h2>
          {notice && <p className="text-sm text-green font-body">{notice}</p>}
        </div>

        {sponsors.length === 0 ? (
          <div className="py-16 text-center bg-white border border-border rounded-xl">
            <p className="text-sm text-ink-muted font-body">No sponsors yet. Add the first one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sponsors.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-4 p-4 bg-white border border-border rounded-xl ${s.status === 1 ? "" : "opacity-60"}`}>
                <div className="flex flex-col">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="text-[10px] leading-none text-ink-muted hover:text-green disabled:opacity-25" aria-label="Move up">▲</button>
                  <button onClick={() => move(i, 1)} disabled={i === sponsors.length - 1} className="text-[10px] leading-none text-ink-muted hover:text-green disabled:opacity-25" aria-label="Move down">▼</button>
                </div>
                <div className="flex items-center justify-center flex-shrink-0 w-24 h-16 overflow-hidden border rounded-lg border-border bg-cream">
                  {s.smallimage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.smallimage} alt={s.title} className="object-contain w-full h-full p-1.5" />
                  ) : (
                    <span className="text-lg font-bold font-display text-green">{s.title.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-ink-dark font-body">{s.title}</p>
                  {s.website ? (
                    <a href={s.website} target="_blank" rel="noopener noreferrer" className="block text-xs no-underline truncate text-gold hover:underline font-body">
                      {s.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  ) : (
                    <p className="text-xs text-ink-muted font-body">No website</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-end flex-shrink-0 gap-3">
                  <button onClick={() => toggle(s)} className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-body ${s.status === 1 ? "bg-green/10 text-green border-green/20" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {s.status === 1 ? "● Live" : "● Hidden"}
                  </button>
                  <button onClick={() => edit(s)} className="text-xs font-semibold text-gold font-body hover:underline">Edit</button>
                  <button onClick={() => remove(s)} className="text-xs text-red-500 font-body hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

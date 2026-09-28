"use client";
import { useMemo, useState } from "react";
import ImageUpload from "@/app/components/admin/ImageUpload";

interface Member {
  id: number;
  fullname: string;
  designation: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  image: string;
  description: string;
  status: number;
}

const EMPTY: Omit<Member, "id"> = {
  fullname: "",
  designation: "",
  city: "",
  country: "Pakistan",
  phone: "",
  email: "",
  image: "",
  description: "",
  status: 1,
};

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors";
const labelCls =
  "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

const byName = (a: Member, b: Member) => a.fullname.localeCompare(b.fullname);

export default function TeamClient({ members: initial }: { members: Member[] }) {
  const [members, setMembers] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.fullname, m.designation, m.city, m.country].some((v) => v.toLowerCase().includes(q)),
    );
  }, [members, search]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function reset() {
    setForm(EMPTY);
    setEditingId(null);
    setError(null);
  }

  function edit(m: Member) {
    const { id: _id, ...rest } = m;
    void _id;
    setForm(rest);
    setEditingId(m.id);
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save() {
    if (!form.fullname.trim()) return setError("Name is required.");
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editingId ? `/api/admin/team/${editingId}` : "/api/admin/team", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error ?? "Failed to save.");
      if (editingId) {
        setMembers((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)).sort(byName));
        setNotice(`${form.fullname} updated.`);
      } else {
        setMembers((prev) => [...prev, { id: json.id, ...form }].sort(byName));
        setNotice(`${form.fullname} added.`);
      }
      reset();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(m: Member) {
    const status = m.status === 1 ? 0 : 1;
    setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, status } : x)));
    await fetch(`/api/admin/team/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(m: Member) {
    if (!confirm(`Remove ${m.fullname} from the Pride Team? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/team/${m.id}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((x) => x.id !== m.id));
      if (editingId === m.id) reset();
    }
  }

  return (
    <div className="space-y-8">
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <h2 className="text-lg font-bold font-display text-green">
          {editingId ? "Edit Team Member" : "Add a Team Member"}
        </h2>

        <ImageUpload
          label="Photo"
          shape="square"
          value={form.image || null}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
          hint="A square, head-and-shoulders photo works best."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Full name <span className="text-gold">*</span></label>
            <input className={input} value={form.fullname} onChange={set("fullname")} maxLength={50} />
          </div>
          <div>
            <label className={labelCls}>Designation</label>
            <input className={input} value={form.designation} onChange={set("designation")} placeholder="e.g. Regional Coordinator" />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input className={input} value={form.city} onChange={set("city")} />
          </div>
          <div>
            <label className={labelCls}>Country</label>
            <input className={input} value={form.country} onChange={set("country")} />
          </div>
          <div>
            <label className={labelCls}>Phone <span className="font-normal normal-case">(private)</span></label>
            <input className={input} value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className={labelCls}>Email <span className="font-normal normal-case">(private)</span></label>
            <input className={input} type="email" value={form.email} onChange={set("email")} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Short description</label>
          <textarea rows={4} className={`${input} resize-none`} value={form.description} onChange={set("description")} placeholder="A few lines about this person and their role…" />
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
          <input type="checkbox" checked={form.status === 1} onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked ? 1 : 0 }))} className="w-4 h-4 accent-[#C9992A]" />
          <span className="text-sm text-ink-dark font-body">Show on the website</span>
        </label>

        {error && <p className="text-sm text-red-500 font-body">{error}</p>}

        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Update Member" : "Add Member"}
          </button>
          {editingId && (
            <button onClick={reset} className="border border-border text-ink-mid px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:border-green hover:text-green transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold font-display text-green">
            Team Members <span className="text-base font-normal text-ink-muted">({shown.length})</span>
          </h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="px-3 py-2 text-sm bg-white border rounded-md border-border font-body focus:outline-none focus:border-gold"
          />
        </div>
        {notice && <p className="mb-3 text-sm text-green font-body">{notice}</p>}

        {shown.length === 0 ? (
          <div className="py-16 text-center bg-white border border-border rounded-xl">
            <p className="text-sm text-ink-muted font-body">
              {members.length === 0 ? "No team members yet. Add the first one above." : "No members match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((m) => (
              <div key={m.id} className={`flex items-center gap-4 p-4 bg-white border border-border rounded-xl ${m.status === 1 ? "" : "opacity-60"}`}>
                <div className="flex items-center justify-center flex-shrink-0 overflow-hidden rounded-full w-14 h-14 bg-green">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image} alt={m.fullname} className="object-cover object-top w-full h-full" />
                  ) : (
                    <span className="text-lg font-bold text-white font-display">{m.fullname.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-ink-dark font-body">{m.fullname}</p>
                  <p className="text-xs truncate text-ink-muted font-body">
                    {[m.designation, [m.city, m.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-end flex-shrink-0 gap-3">
                  <button onClick={() => toggle(m)} className={`text-[11px] font-bold px-2.5 py-1 rounded-md border font-body ${m.status === 1 ? "bg-green/10 text-green border-green/20" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {m.status === 1 ? "● Live" : "● Hidden"}
                  </button>
                  <button onClick={() => edit(m)} className="text-xs font-semibold text-gold font-body hover:underline">Edit</button>
                  <button onClick={() => remove(m)} className="text-xs text-red-500 font-body hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

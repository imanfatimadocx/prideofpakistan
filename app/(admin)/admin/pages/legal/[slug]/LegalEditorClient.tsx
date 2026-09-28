"use client";
import { useState } from "react";
import Link from "next/link";
import RichEditor from "@/app/components/admin/RichEditor";
import type { LegalContent, LegalSection } from "@/app/lib/legalContent";

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors";
const labelCls =
  "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

const newId = () => `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export default function LegalEditorClient({
  slug,
  label,
  publicPath,
  initial,
  defaults,
}: {
  slug: string;
  label: string;
  publicPath: string;
  initial: LegalContent;
  defaults: LegalContent;
}) {
  const [title, setTitle] = useState(initial.title);
  const [intro, setIntro] = useState(initial.intro);
  const [sections, setSections] = useState<LegalSection[]>(initial.sections);
  const [updatedAt, setUpdatedAt] = useState(initial.updatedAt);
  // Bumping this remounts every editor (used after "Reset")
  const [version, setVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function touch() {
    setDirty(true);
    setMessage(null);
  }

  function update(id: string, patch: Partial<LegalSection>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    touch();
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    setSections((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    touch();
  }

  function addSection(at?: number) {
    const s: LegalSection = { id: newId(), heading: "", html: "" };
    setSections((prev) => {
      const next = [...prev];
      next.splice(at ?? next.length, 0, s);
      return next;
    });
    touch();
  }

  function removeSection(s: LegalSection) {
    if (!confirm(`Delete the section "${s.heading || "untitled"}"?`)) return;
    setSections((prev) => prev.filter((x) => x.id !== s.id));
    touch();
  }

  function resetToOriginal() {
    if (!confirm("Replace everything on this page with the original website text? You can still cancel by not saving.")) return;
    setTitle(defaults.title);
    setIntro(defaults.intro);
    setSections(defaults.sections.map((s) => ({ ...s, id: newId() })));
    setVersion((v) => v + 1);
    touch();
  }

  async function save() {
    if (!title.trim()) return setMessage({ ok: false, text: "Page title is required." });
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/legal/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, intro, sections }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setMessage({ ok: false, text: json.error ?? "Failed to save." });
      setUpdatedAt(json.content.updatedAt);
      setSections(json.content.sections);
      setDirty(false);
      setMessage({ ok: true, text: "Saved. The page is updated on the website." });
    } catch {
      setMessage({ ok: false, text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[860px] pb-24">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <Link href="/admin/pages" className="text-sm no-underline text-gold font-body hover:underline">
          ← Pages
        </Link>
        <span className="text-ink-muted">/</span>
        <h1 className="text-2xl font-bold font-display text-green">{label}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-8 text-xs text-ink-muted font-body">
        <span>
          {updatedAt
            ? `Last saved ${new Date(updatedAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
            : "Showing the original website text - not edited yet"}
        </span>
        <a href={publicPath} target="_blank" className="font-semibold text-gold hover:underline">
          View page ↗
        </a>
        <button type="button" onClick={resetToOriginal} className="hover:text-red-500">
          Reset to original text
        </button>
      </div>

      <div className="p-6 mb-6 space-y-5 bg-white border border-border rounded-xl">
        <div>
          <label className={labelCls}>Page title</label>
          <input className={input} value={title} onChange={(e) => { setTitle(e.target.value); touch(); }} />
        </div>
        <div>
          <label className={labelCls}>Introduction (optional)</label>
          <RichEditor
            key={`intro-${version}`}
            value={intro}
            onChange={(html) => { setIntro(html); touch(); }}
            minHeight={80}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold font-display text-green">
          Sections <span className="text-base font-normal text-ink-muted">({sections.length})</span>
        </h2>
        <button type="button" onClick={() => addSection()} className="px-4 py-2 text-xs font-semibold text-white rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark">
          + Add Section
        </button>
      </div>

      {sections.length === 0 && (
        <div className="py-12 mb-4 text-center bg-white border-2 border-dashed border-border rounded-xl">
          <p className="text-sm text-ink-muted font-body">No sections yet. Click &quot;Add Section&quot; to start.</p>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={s.id} className={`p-5 space-y-3 border rounded-xl ${s.hidden ? "bg-gray-50 border-border" : "bg-white border-border"}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-ink-muted font-body">Section {i + 1}</span>
              <div className="flex items-center gap-3 ml-auto text-xs font-body">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-muted hover:text-green disabled:opacity-30">↑ Up</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="text-ink-muted hover:text-green disabled:opacity-30">↓ Down</button>
                <button
                  type="button"
                  onClick={() => update(s.id, { hidden: !s.hidden })}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${s.hidden ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green/10 text-green border-green/20"}`}
                >
                  {s.hidden ? "● Hidden" : "● Live"}
                </button>
                <button type="button" onClick={() => removeSection(s)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
            <input
              className={input}
              value={s.heading}
              onChange={(e) => update(s.id, { heading: e.target.value })}
              placeholder="Section heading (optional)"
            />
            <RichEditor
              key={`${s.id}-${version}`}
              value={s.html}
              onChange={(html) => update(s.id, { html })}
            />
            <button type="button" onClick={() => addSection(i + 1)} className="text-xs font-semibold text-gold font-body hover:underline">
              + Add a section below
            </button>
          </div>
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t lg:left-64 bg-white/95 backdrop-blur border-border">
        <div className="flex items-center gap-4 px-4 py-3 lg:px-8 max-w-[924px]">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-8 py-2.5 text-sm font-semibold text-white rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {message ? (
            <p className={`text-sm font-body ${message.ok ? "text-green" : "text-red-500"}`}>{message.text}</p>
          ) : dirty ? (
            <p className="text-sm text-amber-700 font-body">You have unsaved changes.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

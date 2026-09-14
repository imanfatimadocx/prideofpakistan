"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  section: string;
  label: string;
  initial: {
    eyebrow?: string;
    heading?: string;
    subtext?: string;
  };
}

export default function PageHeroEditor({ section, label, initial }: Props) {
  const [form, setForm] = useState({
    eyebrow: initial?.eyebrow ?? "",
    heading: initial?.heading ?? "",
    subtext: initial?.subtext ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/homepage/${section}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: form }),
      });
      if (!res.ok) {
        setError("Failed to save.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[700px]">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/pages"
          className="text-sm no-underline text-gold font-body hover:underline"
        >
          ← Pages
        </Link>
        <span className="text-ink-muted">/</span>
        <h1 className="text-2xl font-bold font-display text-green">{label}</h1>
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

      <div className="p-6 space-y-4 bg-white border border-border rounded-xl">
        <p className="text-xs text-ink-muted font-body">
          Changes go live instantly on the public page.
        </p>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Golden Label
          </label>
          <input
            type="text"
            value={form.eyebrow}
            onChange={(e) =>
              setForm((f) => ({ ...f, eyebrow: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Page Heading
          </label>
          <input
            type="text"
            value={form.heading}
            onChange={(e) =>
              setForm((f) => ({ ...f, heading: e.target.value }))
            }
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
            Subtext
          </label>
          <textarea
            value={form.subtext}
            onChange={(e) =>
              setForm((f) => ({ ...f, subtext: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

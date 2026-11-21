"use client";
import { useState } from "react";
import type { AdvertisePageContent } from "@/app/lib/advertisePage";

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-leaf transition-colors";
const labelCls = "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

export default function AdvertisePageClient({ page: initial }: { page: AdvertisePageContent }) {
  const [page, setPage] = useState(initial);
  const [audienceText, setAudienceText] = useState(initial.audience.join("\n"));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/ads/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: { ...page, audience: audienceText.split("\n").map((l) => l.trim()).filter(Boolean) } }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg({ text: json.error ?? "Failed to save.", ok: false });
      if (json.page) {
        setPage(json.page);
        setAudienceText(json.page.audience.join("\n"));
      }
      setMsg({ text: "Saved. Changes show on the website straight away.", ok: true });
    } catch {
      setMsg({ text: "Something went wrong.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
      <div className="flex justify-end">
        <a href="/advertise" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold no-underline text-leaf-dark font-body hover:underline">
          View page →
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Small heading</label>
          <input className={input} value={page.eyebrow} onChange={(e) => setPage((p) => ({ ...p, eyebrow: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>Page title</label>
          <input className={input} value={page.heading} onChange={(e) => setPage((p) => ({ ...p, heading: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Line under the title</label>
        <input className={input} value={page.subtext} onChange={(e) => setPage((p) => ({ ...p, subtext: e.target.value }))} />
      </div>
      <div>
        <label className={labelCls}>Introduction</label>
        <textarea rows={4} className={`${input} resize-y`} value={page.intro} onChange={(e) => setPage((p) => ({ ...p, intro: e.target.value }))} />
      </div>
      <div>
        <label className={labelCls}>Who visits the website (one point per line)</label>
        <textarea rows={5} className={`${input} resize-y`} value={audienceText} onChange={(e) => setAudienceText(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Email for advertising enquiries</label>
          <input className={input} value={page.email} onChange={(e) => setPage((p) => ({ ...p, email: e.target.value }))} />
        </div>
        <div>
          <label className={labelCls}>WhatsApp number (with country code)</label>
          <input className={input} value={page.whatsapp} inputMode="tel" onChange={(e) => setPage((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="e.g. 447700900123" />
          <p className="text-[11px] text-ink-muted font-body mt-1">Leave empty to hide the WhatsApp button.</p>
        </div>
      </div>
      <div>
        <label className={labelCls}>Note under the introduction</label>
        <textarea rows={3} className={`${input} resize-y`} value={page.note} onChange={(e) => setPage((p) => ({ ...p, note: e.target.value }))} />
      </div>
      {msg && <p className={`text-sm font-body ${msg.ok ? "text-green" : "text-red-500"}`}>{msg.text}</p>}
      <button onClick={save} disabled={saving} className="bg-leaf text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-leaf-dark disabled:opacity-50">
        {saving ? "Saving…" : "Save page"}
      </button>
    </div>
  );
}

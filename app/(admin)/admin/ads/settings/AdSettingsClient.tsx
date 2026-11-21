"use client";
import { useState } from "react";
import type { AdSettings, SlotMode } from "@/app/lib/ads";
import type { AdvertisePageContent } from "@/app/lib/advertisePage";

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-leaf transition-colors";
const labelCls = "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

interface SlotInfo {
  key: string;
  label: string;
  where: string;
}

export default function AdSettingsClient({
  settings: initial,
  slots,
  page: initialPage,
}: {
  settings: AdSettings;
  slots: SlotInfo[];
  page: AdvertisePageContent;
}) {
  const [settings, setSettings] = useState(initial);
  const [page, setPage] = useState(initialPage);
  const [audienceText, setAudienceText] = useState(initialPage.audience.join("\n"));
  const [saving, setSaving] = useState<"" | "settings" | "page">("");
  const [msg, setMsg] = useState<{ which: string; text: string; ok: boolean } | null>(null);

  type SlotKey = keyof AdSettings["slots"];
  function setSlot(key: string, patch: Partial<AdSettings["slots"][SlotKey]>) {
    const k = key as SlotKey;
    setSettings((s) => ({ ...s, slots: { ...s.slots, [k]: { ...s.slots[k], ...patch } } }));
  }

  async function save(which: "settings" | "page") {
    setSaving(which);
    setMsg(null);
    const body =
      which === "settings"
        ? { settings }
        : { page: { ...page, audience: audienceText.split("\n").map((l) => l.trim()).filter(Boolean) } };
    try {
      const res = await fetch("/api/admin/ads/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg({ which, text: json.error ?? "Failed to save.", ok: false });
      if (json.settings) setSettings(json.settings);
      if (json.page) {
        setPage(json.page);
        setAudienceText(json.page.audience.join("\n"));
      }
      setMsg({ which, text: "Saved. Changes show on the website straight away.", ok: true });
    } catch {
      setMsg({ which, text: "Something went wrong.", ok: false });
    } finally {
      setSaving("");
    }
  }

  const Msg = ({ which }: { which: string }) =>
    msg && msg.which === which ? (
      <p className={`text-sm font-body ${msg.ok ? "text-green" : "text-red-500"}`}>{msg.text}</p>
    ) : null;

  return (
    <div className="space-y-8">
      {/* ── Ad spaces ── */}
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <div>
          <h2 className="text-lg font-bold font-display text-green">Ad spaces</h2>
          <p className="text-xs text-ink-muted font-body mt-1">
            <strong>Our ads</strong> shows the sponsor ads you add in Advertisements. <strong>Google ad</strong> shows a Google ad in
            that spot, which needs a display ad unit ID from AdSense (Ads → By ad unit → Display ads). Without an ID the space
            stays empty, and Google&apos;s automatic ads carry on as usual.
          </p>
        </div>

        <div className="divide-y divide-border">
          {slots.map((s) => {
            const v = settings.slots[s.key as SlotKey];
            return (
              <div key={s.key} className="py-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-dark font-body">{s.label}</p>
                    <p className="text-xs text-ink-muted font-body">{s.where}</p>
                  </div>
                  <div className="flex overflow-hidden border rounded-md border-border" role="group" aria-label={`${s.label}: ad type`}>
                    {(["ours", "google"] as SlotMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSlot(s.key, { mode: m })}
                        aria-pressed={v.mode === m}
                        className={`px-4 py-2 text-xs font-semibold font-body transition-colors ${v.mode === m ? "bg-leaf text-white" : "bg-white text-ink-mid hover:bg-mint"}`}
                      >
                        {m === "ours" ? "Our ads" : "Google ad"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Google ad unit ID</label>
                    <input
                      className={input}
                      value={v.adsenseSlot}
                      inputMode="numeric"
                      onChange={(e) => setSlot(s.key, { adsenseSlot: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 1234567890"
                    />
                  </div>
                  {v.mode === "ours" && (
                    <label className="flex items-center gap-2.5 cursor-pointer select-none sm:mt-6">
                      <input
                        type="checkbox"
                        checked={v.googleFallback}
                        onChange={(e) => setSlot(s.key, { googleFallback: e.target.checked })}
                        className="w-4 h-4 accent-[#5BB56B]"
                      />
                      <span className="text-sm text-ink-dark font-body">Show the Google ad when no sponsor ad is booked</span>
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-xs">
          <label className={labelCls}>Label shown above sponsor ads</label>
          <input className={input} value={settings.label} onChange={(e) => setSettings((s) => ({ ...s, label: e.target.value }))} placeholder="Sponsored" />
        </div>

        <Msg which="settings" />
        <button onClick={() => save("settings")} disabled={saving !== ""} className="bg-leaf text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-leaf-dark disabled:opacity-50">
          {saving === "settings" ? "Saving…" : "Save ad spaces"}
        </button>
      </div>

      {/* ── Advertise with Us page ── */}
      <div id="advertise-page" className="scroll-mt-6 p-6 space-y-5 bg-white border border-border rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold font-display text-green">&ldquo;Advertise with Us&rdquo; page</h2>
          <a href="/advertise" target="_blank" className="text-sm font-semibold no-underline text-leaf-dark font-body hover:underline">
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
          <label className={labelCls}>Note at the bottom</label>
          <textarea rows={3} className={`${input} resize-y`} value={page.note} onChange={(e) => setPage((p) => ({ ...p, note: e.target.value }))} />
        </div>

        <Msg which="page" />
        <button onClick={() => save("page")} disabled={saving !== ""} className="bg-leaf text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-leaf-dark disabled:opacity-50">
          {saving === "page" ? "Saving…" : "Save page"}
        </button>
      </div>
    </div>
  );
}

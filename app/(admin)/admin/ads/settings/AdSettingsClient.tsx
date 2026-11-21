"use client";
import { useState } from "react";
import type { AdSettings, SlotMode } from "@/app/lib/ads";

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-leaf transition-colors";
const labelCls = "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

interface SlotInfo {
  key: string;
  label: string;
  where: string;
}

export default function AdSettingsClient({ settings: initial, slots }: { settings: AdSettings; slots: SlotInfo[] }) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  type SlotKey = keyof AdSettings["slots"];
  function setMode(key: string, mode: SlotMode) {
    const k = key as SlotKey;
    setSettings((s) => ({ ...s, slots: { ...s.slots, [k]: { mode } } }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/ads/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setMsg({ text: json.error ?? "Failed to save.", ok: false });
      if (json.settings) setSettings(json.settings);
      setMsg({ text: "Saved. Changes show on the website straight away.", ok: true });
    } catch {
      setMsg({ text: "Something went wrong.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
      <div>
        <h2 className="text-lg font-bold font-display text-green">Ad spaces</h2>
        <p className="mt-1 text-xs text-ink-muted font-body">
          <strong>Our ads</strong> shows the sponsor ads you add in Advertisements (the space stays empty if none are booked).{" "}
          <strong>Google ads</strong> leaves the space to Google, which places its automatic ads around the page as usual.
        </p>
      </div>

      <div className="divide-y divide-border">
        {slots.map((s) => {
          const mode = settings.slots[s.key as SlotKey].mode;
          return (
            <div key={s.key} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="text-sm font-semibold text-ink-dark font-body">{s.label}</p>
                <p className="text-xs text-ink-muted font-body">{s.where}</p>
              </div>
              <div className="flex overflow-hidden border rounded-md border-border" role="group" aria-label={`${s.label}: ad type`}>
                {(["ours", "google"] as SlotMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(s.key, m)}
                    aria-pressed={mode === m}
                    className={`px-4 py-2 text-xs font-semibold font-body transition-colors ${mode === m ? "bg-leaf text-white" : "bg-white text-ink-mid hover:bg-mint"}`}
                  >
                    {m === "ours" ? "Our ads" : "Google ads"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-xs">
        <label className={labelCls}>Label shown above sponsor ads</label>
        <input className={input} value={settings.label} onChange={(e) => setSettings((s) => ({ ...s, label: e.target.value }))} placeholder="Sponsored" />
      </div>

      {msg && <p className={`text-sm font-body ${msg.ok ? "text-green" : "text-red-500"}`}>{msg.text}</p>}
      <button onClick={save} disabled={saving} className="bg-leaf text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-leaf-dark disabled:opacity-50">
        {saving ? "Saving…" : "Save ad spaces"}
      </button>
    </div>
  );
}

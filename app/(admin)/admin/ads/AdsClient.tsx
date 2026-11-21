"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/app/components/admin/ImageUpload";

type SlotKey = string;

export interface AdminAd {
  id: number;
  title: string;
  advertiser: string;
  imageDesktop: string;
  imageMobile: string;
  imageSquare: string;
  preview: string;
  altText: string;
  linkUrl: string;
  placements: SlotKey[];
  startsAt: string;
  endsAt: string;
  status: number;
  priority: number;
  views: number;
  clicks: number;
  views30: number;
  clicks30: number;
}

interface SlotInfo {
  key: SlotKey;
  label: string;
  kind: "banner" | "showcase";
  mode: "ours" | "google";
}

type FormState = Omit<AdminAd, "id" | "preview" | "views" | "clicks" | "views30" | "clicks30">;

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (): FormState => ({
  title: "",
  advertiser: "",
  imageDesktop: "",
  imageMobile: "",
  imageSquare: "",
  altText: "",
  linkUrl: "",
  placements: [],
  startsAt: today(),
  endsAt: "",
  status: 1,
  priority: 1,
});

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-leaf transition-colors";
const labelCls = "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

type Filter = "all" | "live" | "scheduled" | "expired" | "paused";

function stateOf(a: { status: number; startsAt: string; endsAt: string }): Exclude<Filter, "all"> {
  const t = today();
  if (a.status !== 1) return "paused";
  if (a.startsAt && a.startsAt > t) return "scheduled";
  if (a.endsAt && a.endsAt < t) return "expired";
  return "live";
}

const STATE_STYLE: Record<Exclude<Filter, "all">, string> = {
  live: "bg-green/10 text-green border-green/20",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  expired: "bg-gray-100 text-ink-muted border-border",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
};

function daysUntil(day: string): number {
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today()}T00:00:00Z`)) / 86400000);
}

function ctr(clicks: number, views: number) {
  return views ? `${((clicks / views) * 100).toFixed(1)}%` : "–";
}

export default function AdsClient({ ads: initial, slots }: { ads: AdminAd[]; slots: SlotInfo[] }) {
  const [ads, setAds] = useState(initial);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [previewMobile, setPreviewMobile] = useState(false);

  const slotLabel = useMemo(() => new Map(slots.map((s) => [s.key, s.label])), [slots]);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  function reset() {
    setForm(emptyForm());
    setEditingId(null);
    setError(null);
  }

  function edit(a: AdminAd, copy = false) {
    const { id: _id, preview: _p, views: _v, clicks: _c, views30: _v3, clicks30: _c3, ...rest } = a;
    void _id; void _p; void _v; void _c; void _v3; void _c3;
    setForm(copy ? { ...rest, title: `${rest.title} (copy)`, startsAt: today(), endsAt: "", status: 0 } : rest);
    setEditingId(copy ? null : a.id);
    setError(null);
    setNotice(copy ? "Copied. Change what you need and click Add Ad." : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function togglePlacement(key: SlotKey) {
    set("placements", form.placements.includes(key) ? form.placements.filter((k) => k !== key) : [...form.placements, key]);
  }

  async function save() {
    if (!form.advertiser.trim()) return setError("Advertiser name is required.");
    if (!form.imageDesktop && !form.imageSquare) return setError("Please upload the desktop banner (or a square image for the showcase).");
    if (form.placements.length === 0) return setError("Choose at least one place for the ad to appear.");
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(editingId ? `/api/admin/ads/${editingId}` : "/api/admin/ads", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error ?? "Failed to save.");
      const preview = form.imageDesktop || form.imageSquare;
      if (editingId) {
        setAds((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form, preview } : a)));
        setNotice("Ad updated.");
      } else {
        setAds((prev) => [{ id: json.id, ...form, preview, views: 0, clicks: 0, views30: 0, clicks30: 0 }, ...prev]);
        setNotice("Ad added.");
      }
      reset();
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(a: AdminAd) {
    const status = a.status === 1 ? 0 : 1;
    setAds((prev) => prev.map((x) => (x.id === a.id ? { ...x, status } : x)));
    await fetch(`/api/admin/ads/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function remove(a: AdminAd) {
    if (!confirm(`Delete the ad "${a.title}" and all its statistics? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/ads/${a.id}`, { method: "DELETE" });
    if (res.ok) {
      setAds((prev) => prev.filter((x) => x.id !== a.id));
      if (editingId === a.id) reset();
    }
  }

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: ads.length, live: 0, scheduled: 0, expired: 0, paused: 0 };
    for (const a of ads) c[stateOf(a)]++;
    return c;
  }, [ads]);
  const shown = filter === "all" ? ads : ads.filter((a) => stateOf(a) === filter);
  const previewSrc = previewMobile ? form.imageMobile || form.imageDesktop : form.imageDesktop || form.imageSquare;
  const unusedOurs = form.placements.filter((k) => slots.find((s) => s.key === k)?.mode !== "ours");

  return (
    <div className="space-y-8">
      {/* ── Form ── */}
      <div className="p-6 space-y-5 bg-white border border-border rounded-xl">
        <h2 className="text-lg font-bold font-display text-green">{editingId ? "Edit Ad" : "Add an Ad"}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>
              Advertiser <span className="text-leaf-dark">*</span>
            </label>
            <input className={input} value={form.advertiser} onChange={(e) => set("advertiser", e.target.value)} placeholder="e.g. Habib Bank Limited" />
          </div>
          <div>
            <label className={labelCls}>Campaign name (only you see this)</label>
            <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Ramadan offer 2027" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <ImageUpload label="Desktop banner (1200 × 250)" value={form.imageDesktop || null} onChange={(url) => set("imageDesktop", url)} hint="Used for all banner spaces." />
          <ImageUpload label="Mobile banner (600 × 300)" value={form.imageMobile || null} onChange={(url) => set("imageMobile", url)} hint="Optional. Phones show this instead." />
          <ImageUpload label="Square (400 × 400)" value={form.imageSquare || null} onChange={(url) => set("imageSquare", url)} hint="For the sponsor showcase above the footer." shape="square" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Link</label>
            <input className={input} value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://www.example.com  or  https://wa.me/447700900123" />
            <p className="text-[11px] text-ink-muted font-body mt-1">Website, WhatsApp (wa.me), tel: or mailto:. Leave empty for no link.</p>
          </div>
          <div>
            <label className={labelCls}>Image description</label>
            <input className={input} value={form.altText} onChange={(e) => set("altText", e.target.value)} placeholder="e.g. HBL – 20% off for Pride members" />
            <p className="text-[11px] text-ink-muted font-body mt-1">Read out by screen readers. Defaults to the advertiser name.</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>
            Where it appears <span className="text-leaf-dark">*</span>
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {slots.map((s) => (
              <label key={s.key} className="flex items-start gap-2.5 px-3 py-2.5 border rounded-md cursor-pointer border-border hover:border-leaf">
                <input type="checkbox" checked={form.placements.includes(s.key)} onChange={() => togglePlacement(s.key)} className="w-4 h-4 mt-0.5 accent-[#5BB56B]" />
                <span className="text-sm text-ink-dark font-body">
                  {s.label}
                  {s.mode !== "ours" && <span className="block text-[11px] text-amber-700">Set to Google ads in Ad spaces</span>}
                </span>
              </label>
            ))}
          </div>
          {unusedOurs.length > 0 && (
            <p className="mt-2 text-xs text-amber-700 font-body">
              Some chosen spaces are set to Google ads, so this ad won&apos;t show there until you switch them to{" "}
              <strong>Our ads</strong> in{" "}
              <Link href="/admin/ads/settings" className="underline">Ad spaces &amp; settings</Link>.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className={labelCls}>Start date</label>
            <input type="date" className={input} value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>End date</label>
            <input type="date" className={input} value={form.endsAt} min={form.startsAt} onChange={(e) => set("endsAt", e.target.value)} />
            <p className="text-[11px] text-ink-muted font-body mt-1">Leave empty to run until you stop it.</p>
          </div>
          <div>
            <label className={labelCls}>Priority</label>
            <select className={input} value={form.priority} onChange={(e) => set("priority", Number(e.target.value))}>
              <option value={1}>Normal</option>
              <option value={2}>High (shown more often)</option>
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.status === 1} onChange={(e) => set("status", e.target.checked ? 1 : 0)} className="w-4 h-4 accent-[#5BB56B]" />
              <span className="text-sm text-ink-dark font-body">Active</span>
            </label>
          </div>
        </div>

        {previewSrc && (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={labelCls + " mb-0"}>Preview</span>
              <button type="button" onClick={() => setPreviewMobile(false)} className={`text-xs font-semibold font-body ${!previewMobile ? "text-green underline" : "text-ink-muted"}`}>Desktop</button>
              <button type="button" onClick={() => setPreviewMobile(true)} className={`text-xs font-semibold font-body ${previewMobile ? "text-green underline" : "text-ink-muted"}`}>Mobile</button>
            </div>
            <div className={`p-4 border rounded-xl bg-cream border-border ${previewMobile ? "max-w-[360px]" : ""}`}>
              <p className="mb-1.5 text-[10px] font-semibold tracking-[.14em] uppercase text-ink-muted font-body">Sponsored</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewSrc} alt="" className="block w-full h-auto border rounded-xl border-border" />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500 font-body">{error}</p>}

        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className="bg-leaf text-white px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-leaf-dark transition-colors disabled:opacity-50">
            {saving ? "Saving…" : editingId ? "Update Ad" : "Add Ad"}
          </button>
          {(editingId || form.advertiser || form.imageDesktop) && (
            <button onClick={reset} className="border border-border text-ink-mid px-6 py-2.5 rounded-md text-sm font-semibold font-body hover:border-green hover:text-green transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── List ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {(["all", "live", "scheduled", "expired", "paused"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold font-body border capitalize ${filter === f ? "bg-leaf text-white border-leaf" : "bg-white text-ink-mid border-border hover:border-leaf"}`}
              >
                {f} ({counts[f]})
              </button>
            ))}
          </div>
          {notice && <p className="text-sm text-green font-body">{notice}</p>}
        </div>

        {shown.length === 0 ? (
          <div className="py-16 text-center bg-white border border-border rounded-xl">
            <p className="text-sm text-ink-muted font-body">{ads.length ? "No ads in this view." : "No ads yet. Add the first one above."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((a) => {
              const st = stateOf(a);
              const left = a.endsAt && st === "live" ? daysUntil(a.endsAt) : null;
              return (
                <div key={a.id} className={`p-4 bg-white border border-border rounded-xl ${st === "live" ? "" : "opacity-75"}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-shrink-0 w-full overflow-hidden border rounded-lg sm:w-44 border-border bg-cream" style={{ aspectRatio: "1200/250" }}>
                      {a.preview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.preview} alt={a.advertiser} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold truncate text-ink-dark font-body">{a.advertiser}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase font-body ${STATE_STYLE[st]}`}>{st}</span>
                        {a.priority === 2 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase font-body bg-mint text-green border-sage">High priority</span>}
                      </div>
                      <p className="text-xs truncate text-ink-muted font-body">{a.title}</p>
                      <p className="text-xs text-ink-muted font-body mt-0.5">
                        {a.startsAt}
                        {" → "}
                        {a.endsAt || "no end date"}
                        {left !== null && left <= 7 && (
                          <span className="ml-2 font-semibold text-amber-700">{left <= 0 ? "Ends today" : `Ends in ${left} day${left === 1 ? "" : "s"}`}</span>
                        )}
                      </p>
                      <p className="text-[11px] text-ink-muted font-body mt-0.5 truncate">
                        {a.placements.map((k) => slotLabel.get(k) ?? k).join(" · ")}
                      </p>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-3 gap-3 text-center sm:w-56">
                      <div>
                        <p className="text-sm font-bold text-green font-body">{a.views30.toLocaleString()}</p>
                        <p className="text-[10px] uppercase text-ink-muted font-body">Views 30d</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green font-body">{a.clicks30.toLocaleString()}</p>
                        <p className="text-[10px] uppercase text-ink-muted font-body">Clicks 30d</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green font-body">{ctr(a.clicks30, a.views30)}</p>
                        <p className="text-[10px] uppercase text-ink-muted font-body">Click rate</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-3 mt-3 border-t border-border">
                    <button onClick={() => toggle(a)} className="text-xs font-semibold text-ink-mid font-body hover:text-green">
                      {a.status === 1 ? "Pause" : "Resume"}
                    </button>
                    <button onClick={() => edit(a)} className="text-xs font-semibold text-leaf-dark font-body hover:underline">Edit</button>
                    <button onClick={() => edit(a, true)} className="text-xs font-semibold text-ink-mid font-body hover:text-green">Duplicate</button>
                    <Link href={`/admin/ads/${a.id}`} className="text-xs font-semibold no-underline text-ink-mid font-body hover:text-green">
                      Report
                    </Link>
                    <span className="text-[11px] text-ink-muted font-body">
                      All time: {a.views.toLocaleString()} views · {a.clicks.toLocaleString()} clicks
                    </span>
                    <button onClick={() => remove(a)} className="ml-auto text-xs text-red-500 font-body hover:underline">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

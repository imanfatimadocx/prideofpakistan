"use client";
import { useState } from "react";
import type {
  ContactInfo,
  ContactItem,
  ContactItemType,
  SocialLink,
  SocialPlatform,
} from "@/app/lib/contactInfo";

const input =
  "w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors bg-white";
const labelCls =
  "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";
const card = "p-6 space-y-4 bg-white border border-border rounded-xl";

const TYPES: { value: ContactItemType; label: string; placeholder: string }[] = [
  { value: "email", label: "Email", placeholder: "info@prideofpakistan.com" },
  { value: "phone", label: "Phone", placeholder: "+44 20 1234 5678" },
  { value: "url", label: "Website", placeholder: "www.prideofpakistan.com" },
  { value: "text", label: "Text (e.g. address)", placeholder: "123 Street, London" },
];

const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Other" },
];

const newId = () => `i${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function moveIn<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function RowControls({
  index,
  total,
  hidden,
  onMove,
  onToggle,
  onRemove,
}: {
  index: number;
  total: number;
  hidden?: boolean;
  onMove: (dir: -1 | 1) => void;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-body">
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="text-ink-muted hover:text-green disabled:opacity-30">↑ Up</button>
      <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="text-ink-muted hover:text-green disabled:opacity-30">↓ Down</button>
      <button
        type="button"
        onClick={onToggle}
        className={`ml-auto text-[11px] font-bold px-2.5 py-1 rounded-md border ${hidden ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green/10 text-green border-green/20"}`}
      >
        {hidden ? "● Hidden" : "● Live"}
      </button>
      <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700">Remove</button>
    </div>
  );
}

export default function ContactInfoEditor({ initial }: { initial: ContactInfo }) {
  const [info, setInfo] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  }

  const field = (key: keyof ContactInfo) => ({
    value: info[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(key, e.target.value as never),
  });

  function updateItem(id: string, patch: Partial<ContactItem>) {
    set("items", info.items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }
  function updateSocial(id: string, patch: Partial<SocialLink>) {
    set("socials", info.socials.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/contact-info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setMessage({ ok: false, text: json.error ?? "Failed to save." });
      setInfo(json.content);
      setMessage({ ok: true, text: "Contact details saved. They're live on the Contact page." });
    } catch {
      setMessage({ ok: false, text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[700px] mt-10 space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-green">Contact Page Content</h2>
        <p className="mt-1 text-sm text-ink-muted font-body">
          Everything below the page heading. Empty rows are removed when you save.
        </p>
      </div>

      {/* Intro */}
      <div className={card}>
        <h3 className="text-base font-bold font-display text-green">Introduction</h3>
        <div>
          <label className={labelCls}>Heading</label>
          <input className={input} {...field("introHeading")} />
        </div>
        <div>
          <label className={labelCls}>Text</label>
          <textarea rows={4} className={`${input} resize-none`} {...field("introText")} />
        </div>
      </div>

      {/* Contact details */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-green">Contact Details</h3>
          <button
            type="button"
            onClick={() => set("items", [...info.items, { id: newId(), label: "", value: "", type: "email" }])}
            className="px-4 py-2 text-xs font-semibold text-white rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
          >
            + Add Detail
          </button>
        </div>
        <div>
          <label className={labelCls}>Box title</label>
          <input className={input} {...field("infoTitle")} />
        </div>
        {info.items.length === 0 && <p className="text-sm text-ink-muted font-body">No contact details yet.</p>}
        {info.items.map((it, i) => {
          const type = TYPES.find((t) => t.value === it.type) ?? TYPES[0];
          return (
            <div key={it.id} className={`p-4 space-y-3 border rounded-lg ${it.hidden ? "bg-gray-50 border-border" : "bg-cream border-border"}`}>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_170px]">
                <input className={input} value={it.label} onChange={(e) => updateItem(it.id, { label: e.target.value })} placeholder="Label, e.g. General Enquiries" />
                <select className={input} value={it.type} onChange={(e) => updateItem(it.id, { type: e.target.value as ContactItemType })}>
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <input className={input} value={it.value} onChange={(e) => updateItem(it.id, { value: e.target.value })} placeholder={type.placeholder} />
              <RowControls
                index={i}
                total={info.items.length}
                hidden={it.hidden}
                onMove={(d) => set("items", moveIn(info.items, i, d))}
                onToggle={() => updateItem(it.id, { hidden: !it.hidden })}
                onRemove={() => set("items", info.items.filter((x) => x.id !== it.id))}
              />
            </div>
          );
        })}
      </div>

      {/* Response time */}
      <div className={card}>
        <h3 className="text-base font-bold font-display text-green">Response Time Box</h3>
        <p className="text-xs text-ink-muted font-body">Leave both fields empty to hide this box.</p>
        <div>
          <label className={labelCls}>Title</label>
          <input className={input} {...field("responseTitle")} />
        </div>
        <div>
          <label className={labelCls}>Text</label>
          <input className={input} {...field("responseText")} />
        </div>
      </div>

      {/* Social */}
      <div className={card}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-green">Social Media</h3>
          <button
            type="button"
            onClick={() => set("socials", [...info.socials, { id: newId(), platform: "instagram", label: "", url: "" }])}
            className="px-4 py-2 text-xs font-semibold text-white rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
          >
            + Add Link
          </button>
        </div>
        <div>
          <label className={labelCls}>Box title</label>
          <input className={input} {...field("socialTitle")} />
        </div>
        {info.socials.length === 0 && <p className="text-sm text-ink-muted font-body">No social links - the box is hidden on the site.</p>}
        {info.socials.map((s, i) => (
          <div key={s.id} className={`p-4 space-y-3 border rounded-lg ${s.hidden ? "bg-gray-50 border-border" : "bg-cream border-border"}`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[170px_1fr]">
              <select className={input} value={s.platform} onChange={(e) => updateSocial(s.id, { platform: e.target.value as SocialPlatform })}>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <input className={input} value={s.label} onChange={(e) => updateSocial(s.id, { label: e.target.value })} placeholder="Button text (optional)" />
            </div>
            <input className={input} value={s.url} onChange={(e) => updateSocial(s.id, { url: e.target.value })} placeholder="https://..." />
            <RowControls
              index={i}
              total={info.socials.length}
              hidden={s.hidden}
              onMove={(d) => set("socials", moveIn(info.socials, i, d))}
              onToggle={() => updateSocial(s.id, { hidden: !s.hidden })}
              onRemove={() => set("socials", info.socials.filter((x) => x.id !== s.id))}
            />
          </div>
        ))}
      </div>

      {/* Form */}
      <div className={card}>
        <h3 className="text-base font-bold font-display text-green">Message Form</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Form heading</label>
            <input className={input} {...field("formHeading")} />
          </div>
          <div>
            <label className={labelCls}>Email shown under the form</label>
            <input className={input} {...field("formEmail")} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Text under the heading</label>
          <input className={input} {...field("formSubtext")} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>After sending - heading</label>
            <input className={input} {...field("successHeading")} />
          </div>
          <div>
            <label className={labelCls}>After sending - text</label>
            <input className={input} {...field("successText")} />
          </div>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 text-sm border rounded-lg font-body ${message.ok ? "bg-green/10 border-green/20 text-green" : "bg-red-50 border-red-200 text-red-600"}`}>
          {message.text}
        </div>
      )}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Contact Details"}
      </button>
    </div>
  );
}

"use client";
import { useState } from "react";
import { parseVideoUrl } from "@/app/lib/video";

export default function BusinessVideoField({
  businessId,
  initial,
}: {
  businessId: number;
  initial: string;
}) {
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const parsed = parseVideoUrl(value);
  const dirty = value.trim() !== saved;
  const invalid = value.trim() !== "" && !parsed;

  async function save(next: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/business/${businessId}/video`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ ok: false, text: json.error ?? "Failed to save." });
        return;
      }
      setSaved(json.video_url ?? "");
      setValue(json.video_url ?? "");
      setMessage({ ok: true, text: next ? "Video saved. It now shows on the business page." : "Video removed." });
    } catch {
      setMessage({ ok: false, text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  if (!businessId) {
    return (
      <div className="max-w-[900px] mt-6 p-6 bg-white border border-border rounded-xl">
        <h2 className="text-base font-bold font-display text-green">Business Video</h2>
        <p className="mt-1 text-sm text-ink-muted font-body">
          Save the business first, then you can add a video here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mt-6 p-6 space-y-4 bg-white border border-border rounded-xl">
      <div>
        <h2 className="text-base font-bold font-display text-green">Business Video</h2>
        <p className="mt-1 text-sm text-ink-muted font-body">
          Paste a YouTube or Vimeo link. It plays on this business&apos;s public page.
        </p>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setMessage(null);
        }}
        placeholder="https://www.youtube.com/watch?v=..."
        className={`w-full px-3 py-2.5 text-sm border rounded-md font-body focus:outline-none transition-colors ${
          invalid ? "border-red-300 focus:border-red-400" : "border-border focus:border-gold"
        }`}
      />
      {invalid && (
        <p className="text-xs text-red-500 font-body">
          That doesn&apos;t look like a YouTube or Vimeo link.
        </p>
      )}

      {parsed && (
        <div className="relative w-full max-w-[480px] overflow-hidden bg-black aspect-video rounded-lg">
          <iframe
            src={parsed.embedUrl}
            title="Video preview"
            className="absolute inset-0 w-full h-full border-0"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {message && (
        <p className={`text-sm font-body ${message.ok ? "text-green" : "text-red-500"}`}>
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => save(value.trim())}
          disabled={saving || !dirty || invalid}
          className="bg-gold text-white px-5 py-2.5 rounded-md text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Video"}
        </button>
        {saved && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Remove the video from this business?")) save("");
            }}
            disabled={saving}
            className="px-5 py-2.5 rounded-md text-sm font-semibold font-body border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Remove Video
          </button>
        )}
      </div>
    </div>
  );
}

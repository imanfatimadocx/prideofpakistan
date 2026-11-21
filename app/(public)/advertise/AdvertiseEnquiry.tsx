"use client";
import { useState } from "react";

const input =
  "w-full px-3.5 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-leaf transition-colors bg-white";

/** Sends the enquiry to Admin > Contact Queries, with the subject "Advertising enquiry". */
export default function AdvertiseEnquiry() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const business = String(f.get("business") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const details = String(f.get("message") ?? "").trim();
    if (!name || !email || !details) return setError("Please fill in your name, email and a short message.");

    const lines: string[] = [];
    if (business) lines.push(`Business: ${business}`);
    if (phone) lines.push(`Phone / WhatsApp: ${phone}`);
    const message = [...lines, ...(lines.length ? [""] : []), details].join("\n");

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: `Advertising enquiry${business ? ` – ${business}` : ""}`, message }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Sorry, your message couldn't be sent. Please email or WhatsApp us instead.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="p-6 text-center bg-white border rounded-xl border-border">
        <p className="text-lg font-bold font-display text-green">Thank you!</p>
        <p className="mt-1 text-sm text-ink-mid font-body">We&apos;ve received your enquiry and will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="p-6 space-y-4 bg-white border rounded-xl border-border sm:p-8">
      <h2 className="text-xl font-bold font-display text-green">Send us an enquiry</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="block mb-1.5 text-sm font-semibold text-ink-dark font-body">Your name *</span>
          <input name="name" required className={input} autoComplete="name" />
        </label>
        <label className="block">
          <span className="block mb-1.5 text-sm font-semibold text-ink-dark font-body">Email *</span>
          <input name="email" type="email" required className={input} autoComplete="email" />
        </label>
        <label className="block">
          <span className="block mb-1.5 text-sm font-semibold text-ink-dark font-body">Business name</span>
          <input name="business" className={input} autoComplete="organization" />
        </label>
        <label className="block">
          <span className="block mb-1.5 text-sm font-semibold text-ink-dark font-body">Phone or WhatsApp</span>
          <input name="phone" className={input} autoComplete="tel" />
        </label>
      </div>
      <label className="block">
        <span className="block mb-1.5 text-sm font-semibold text-ink-dark font-body">Tell us about your campaign *</span>
        <textarea name="message" required rows={4} className={`${input} resize-y`} placeholder="What you'd like to promote, when, and for how long…" />
      </label>
      {error && <p className="text-sm text-red-500 font-body">{error}</p>}
      <button type="submit" disabled={sending} className="w-full py-3 text-sm font-semibold text-white rounded-md bg-leaf font-body hover:bg-leaf-dark disabled:opacity-50 sm:w-auto sm:px-8">
        {sending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

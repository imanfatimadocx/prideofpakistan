"use client";
import { useState } from "react";

export default function ProductInquiryForm({
  productId,
  productTitle,
}: {
  productId: number;
  productTitle: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("All fields are required.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${productId}/inquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="bg-green/10 border-b border-border px-5 py-3">
        <h2 className="text-sm font-bold text-green font-display uppercase tracking-wide">
          Enquire About This Product
        </h2>
        <p className="text-xs text-ink-muted font-body mt-0.5">
          Interested in {productTitle}? Send us a message.
        </p>
      </div>
      <div className="px-5 py-5">
        {sent ? (
          <div className="bg-green/10 border border-green/20 rounded-lg px-4 py-4 text-center">
            <p className="text-sm font-semibold text-green font-body">
              Thank you for your enquiry!
            </p>
            <p className="text-xs text-ink-muted font-body mt-1">
              We will get back to you as soon as possible.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-gold font-semibold font-body hover:underline mt-3 block mx-auto"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 font-body">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="Your email"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                rows={4}
                placeholder="Enter your enquiry here…"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-md font-body focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-gold text-white rounded-md py-3 text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

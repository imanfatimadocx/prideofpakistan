"use client";
import type { PageHeroContent } from "@/app/lib/pageContent";
import { useState } from "react";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";

export default function ContactPageClient({ hero }: { hero: PageHeroContent }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      form.reset();
    } catch {
      setError(
        "Something went wrong. Please email us directly at info@prideofpakistan.com",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.heading}
          subtitle={hero.subtext}
        />

        <section className="py-16 sm:py-20">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-start">
              {/* Left — contact info */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-3 text-2xl font-bold font-display sm:text-3xl text-green">
                    We'd Love to Hear From You
                  </h2>
                  <div className="w-10 h-[3px] bg-gold rounded mb-5" />
                  <p className="leading-relaxed text-ink-mid font-body">
                    Pride of Pakistan is a growing movement. We welcome
                    individuals, businesses, organisations, and communities who
                    want to be part of redefining how the world sees Pakistan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-white border border-border rounded-xl">
                    <h3 className="mb-4 text-sm font-bold tracking-wide uppercase font-display text-green">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "General Enquiries",
                          value: "info@prideofpakistan.com",
                          href: "mailto:info@prideofpakistan.com",
                          icon: (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                          ),
                        },
                        {
                          label: "Marketing & Sponsorships",
                          value: "marketing@prideofpakistan.com",
                          href: "mailto:marketing@prideofpakistan.com",
                          icon: (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                          ),
                        },
                        {
                          label: "Website",
                          value: "www.prideofpakistan.com",
                          href: "https://www.prideofpakistan.com",
                          icon: (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          ),
                        },
                      ].map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-4 no-underline group"
                        >
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-colors rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted font-body">
                              {item.label}
                            </p>
                            <p className="text-sm font-semibold transition-colors text-ink-dark font-body group-hover:text-gold">
                              {item.value}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Response time */}
                  <div className="p-5 border bg-green/5 border-green/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-green"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green font-body">
                          Response Time
                        </p>
                        <p className="text-xs text-ink-muted font-body mt-0.5">
                          We aim to respond to all enquiries as soon as possible
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social — Facebook only*/}
                  <div className="p-5 bg-white border border-border rounded-xl">
                    <h3 className="mb-4 text-sm font-bold tracking-wide uppercase font-display text-green">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      <a
                        href="https://www.facebook.com/prideofpakistan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 no-underline transition-colors border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 font-body"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div className="p-6 bg-white border border-border rounded-2xl sm:p-8 lg:sticky lg:top-8">
                <h2 className="mb-1 text-2xl font-bold font-display text-green">
                  Send a Message
                </h2>
                <p className="mb-6 text-sm text-ink-muted font-body">
                  We aim to respond within 2 working days.
                </p>

                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14 bg-green/10">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-green"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold font-display text-green">
                      Message Sent!
                    </h3>
                    <p className="text-sm text-ink-muted font-body">
                      Thank you for reaching out. We'll be in touch shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-semibold text-gold font-body hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                          Name <span className="text-gold">*</span>
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          placeholder="Your full name"
                          className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                          Email <span className="text-gold">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                        Subject <span className="text-gold">*</span>
                      </label>
                      <input
                        name="subject"
                        type="text"
                        required
                        placeholder="e.g. Sponsorship enquiry"
                        className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body">
                        Message <span className="text-gold">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        placeholder="Tell us how we can help…"
                        className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-500 font-body">{error}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
                    >
                      {loading ? "Sending…" : "Send Message"}
                    </button>
                    <p className="text-xs text-center text-ink-muted font-body">
                      Or email us directly at{" "}
                      <a
                        href="mailto:info@prideofpakistan.com"
                        className="text-gold hover:underline"
                      >
                        info@prideofpakistan.com
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

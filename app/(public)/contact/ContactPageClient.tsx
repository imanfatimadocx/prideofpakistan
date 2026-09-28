"use client";
import type { PageHeroContent } from "@/app/lib/pageContent";
import type { ContactInfo, ContactItem, SocialPlatform } from "@/app/lib/contactInfo";
import { useState } from "react";
import Topbar from "@/app/components/layout/Topbar";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import PageHero from "@/app/components/shared/PageHero";

function contactHref(item: Pick<ContactItem, "type" | "value">): string | null {
  const v = item.value.trim();
  if (!v) return null;
  if (item.type === "email") return `mailto:${v}`;
  if (item.type === "phone") return `tel:${v.replace(/[^\d+]/g, "")}`;
  if (item.type === "url") return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  return null;
}

const svg = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ITEM_ICONS: Record<ContactItem["type"], React.ReactNode> = {
  email: (
    <svg {...svg}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  phone: (
    <svg {...svg}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  url: (
    <svg {...svg}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  text: (
    <svg {...svg}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

const SOCIAL_STYLE: Record<SocialPlatform, { name: string; cls: string }> = {
  facebook: { name: "Facebook", cls: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100" },
  instagram: { name: "Instagram", cls: "text-pink-600 border-pink-200 bg-pink-50 hover:bg-pink-100" },
  youtube: { name: "YouTube", cls: "text-red-600 border-red-200 bg-red-50 hover:bg-red-100" },
  linkedin: { name: "LinkedIn", cls: "text-sky-700 border-sky-200 bg-sky-50 hover:bg-sky-100" },
  tiktok: { name: "TikTok", cls: "text-ink-dark border-border bg-cream hover:bg-gold-pale" },
  whatsapp: { name: "WhatsApp", cls: "text-green-700 border-green-200 bg-green-50 hover:bg-green-100" },
  other: { name: "Website", cls: "text-ink-mid border-border bg-cream hover:bg-gold-pale" },
};

const FACEBOOK_PATH =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";

export default function ContactPageClient({
  hero,
  info,
}: {
  hero: PageHeroContent;
  info: ContactInfo;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = info.items.filter((i) => !i.hidden && i.value);
  const socials = info.socials.filter((s) => !s.hidden && s.url);
  const email = info.formEmail;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
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
        email
          ? `Something went wrong. Please email us directly at ${email}`
          : "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldCls =
    "w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors";
  const labelCls =
    "block text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5 font-body";

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero eyebrow={hero.eyebrow} title={hero.heading} subtitle={hero.subtext} />

        <section className="py-16 sm:py-20">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-start">
              {/* Left - contact info */}
              <div className="space-y-8">
                {(info.introHeading || info.introText) && (
                  <div>
                    {info.introHeading && (
                      <>
                        <h2 className="mb-3 text-2xl font-bold font-display sm:text-3xl text-green">
                          {info.introHeading}
                        </h2>
                        <div className="w-10 h-[3px] bg-gold rounded mb-5" />
                      </>
                    )}
                    {info.introText && (
                      <p className="leading-relaxed whitespace-pre-line text-ink-mid font-body">
                        {info.introText}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {items.length > 0 && (
                    <div className="p-5 bg-white border border-border rounded-xl">
                      {info.infoTitle && (
                        <h3 className="mb-4 text-sm font-bold tracking-wide uppercase font-display text-green">
                          {info.infoTitle}
                        </h3>
                      )}
                      <div className="space-y-4">
                        {items.map((item) => {
                          const href = contactHref(item);
                          const body = (
                            <>
                              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 transition-colors rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white">
                                {ITEM_ICONS[item.type]}
                              </div>
                              <div className="min-w-0">
                                {item.label && (
                                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted font-body">
                                    {item.label}
                                  </p>
                                )}
                                <p className="text-sm font-semibold break-words transition-colors text-ink-dark font-body group-hover:text-gold">
                                  {item.value}
                                </p>
                              </div>
                            </>
                          );
                          return href ? (
                            <a
                              key={item.id}
                              href={href}
                              {...(item.type === "url" && { target: "_blank", rel: "noopener noreferrer" })}
                              className="flex items-center gap-4 no-underline group"
                            >
                              {body}
                            </a>
                          ) : (
                            <div key={item.id} className="flex items-center gap-4">
                              {body}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(info.responseTitle || info.responseText) && (
                    <div className="p-5 border bg-green/5 border-green/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <div>
                          {info.responseTitle && (
                            <p className="text-sm font-bold text-green font-body">{info.responseTitle}</p>
                          )}
                          {info.responseText && (
                            <p className="text-xs text-ink-muted font-body mt-0.5">{info.responseText}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {socials.length > 0 && (
                    <div className="p-5 bg-white border border-border rounded-xl">
                      {info.socialTitle && (
                        <h3 className="mb-4 text-sm font-bold tracking-wide uppercase font-display text-green">
                          {info.socialTitle}
                        </h3>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {socials.map((s) => {
                          const style = SOCIAL_STYLE[s.platform] ?? SOCIAL_STYLE.other;
                          return (
                            <a
                              key={s.id}
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold no-underline transition-colors border rounded-lg font-body ${style.cls}`}
                            >
                              {s.platform === "facebook" ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                  <path d={FACEBOOK_PATH} />
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                              )}
                              {s.label || style.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right - form */}
              <div className="p-6 bg-white border border-border rounded-2xl sm:p-8 lg:sticky lg:top-8">
                <h2 className="mb-1 text-2xl font-bold font-display text-green">
                  {info.formHeading || "Send a Message"}
                </h2>
                {info.formSubtext && (
                  <p className="mb-6 text-sm text-ink-muted font-body">{info.formSubtext}</p>
                )}

                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="flex items-center justify-center mx-auto mb-4 rounded-full w-14 h-14 bg-green/10">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold font-display text-green">
                      {info.successHeading || "Message Sent!"}
                    </h3>
                    {info.successText && (
                      <p className="text-sm text-center text-ink-muted font-body">{info.successText}</p>
                    )}
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
                        <label className={labelCls}>
                          Name <span className="text-gold">*</span>
                        </label>
                        <input name="name" type="text" required placeholder="Your full name" className={fieldCls} />
                      </div>
                      <div>
                        <label className={labelCls}>
                          Email <span className="text-gold">*</span>
                        </label>
                        <input name="email" type="email" required placeholder="you@example.com" className={fieldCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>
                        Subject <span className="text-gold">*</span>
                      </label>
                      <input name="subject" type="text" required placeholder="e.g. Sponsorship enquiry" className={fieldCls} />
                    </div>
                    <div>
                      <label className={labelCls}>
                        Message <span className="text-gold">*</span>
                      </label>
                      <textarea name="message" required rows={6} placeholder="Tell us how we can help…" className={`${fieldCls} resize-none`} />
                    </div>
                    {error && <p className="text-sm text-red-500 font-body">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
                    >
                      {loading ? "Sending…" : "Send Message"}
                    </button>
                    {email && (
                      <p className="text-xs text-center text-ink-muted font-body">
                        Or email us directly at{" "}
                        <a href={`mailto:${email}`} className="text-gold hover:underline">
                          {email}
                        </a>
                      </p>
                    )}
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

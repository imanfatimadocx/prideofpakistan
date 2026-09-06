'use client'
import { useState } from 'react'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      form.reset()
    } catch {
      setError('Something went wrong. Please email us directly at info@prideofpakistan.com')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main className="min-h-screen bg-cream">
        <PageHero
          eyebrow="Get in Touch"
          title="Contact Us"
          subtitle="Whether you want to share your story, explore partnership opportunities, or learn more about the movement — we'd love to hear from you."
        />
        {/* Main content */}
        <section className="py-16 sm:py-20">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-start">
              {/* Left — contact info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-green mb-3">
                    We'd Love to Hear From You
                  </h2>
                  <div className="w-10 h-[3px] bg-gold rounded mb-5" />
                  <p className="text-ink-mid font-body leading-relaxed">
                    Pride of Pakistan is a growing movement. We welcome
                    individuals, businesses, organisations, and communities who
                    want to be part of redefining how the world sees Pakistan.
                  </p>
                </div>

                {/* Contact details */}
                <div className="space-y-4">
                  <div className="bg-white border border-border rounded-xl p-5">
                    <h3 className="font-display text-sm font-bold text-green uppercase tracking-wide mb-4">
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
                          label: "Marketing & Partnerships",
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
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-muted font-body">
                              {item.label}
                            </p>
                            <p className="text-sm font-semibold text-ink-dark font-body group-hover:text-gold transition-colors">
                              {item.value}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Response time */}
                  <div className="bg-green/5 border border-green/20 rounded-xl p-5">
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
                          We aim to respond to all enquiries within 2 working
                          days.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social */}
                  <div className="bg-white border border-border rounded-xl p-5">
                    <h3 className="font-display text-sm font-bold text-green uppercase tracking-wide mb-4">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      <a
                        href="https://www.facebook.com/prideofpakistan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors no-underline font-body"
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
              <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 lg:sticky lg:top-8">
                <h2 className="font-display text-2xl font-bold text-green mb-1">
                  Send a Message
                </h2>
                <p className="text-sm text-ink-muted font-body mb-6">
                  We aim to respond within 2 working days.
                </p>

                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
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
                    <h3 className="font-display text-xl font-bold text-green mb-2">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="e.g. Partnership enquiry"
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
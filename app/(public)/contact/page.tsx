'use client'
import { useState } from 'react'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import Link from 'next/link'

const CONTACT_DETAILS = [
  {
    icon: '📧',
    label: 'General Enquiries',
    value: 'info@prideofpakistan.com',
    href: 'mailto:info@prideofpakistan.com',
  },
  {
    icon: '📣',
    label: 'Marketing & Partnerships',
    value: 'marketing@prideofpakistan.com',
    href: 'mailto:marketing@prideofpakistan.com',
  },
  {
    icon: '🌐',
    label: 'Website',
    value: 'www.prideofpakistan.com',
    href: 'https://www.prideofpakistan.com',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      <main>
        {/* Hero */}
        <section className="relative py-20 overflow-hidden bg-green sm:py-24">
          <div className="absolute inset-0 opacity-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/aboutus_images/about1.jpg"
              alt=""
              className="object-cover w-full h-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
            <p className="text-[11px] font-bold tracking-[.16em] uppercase text-gold-light mb-4 font-body">
              Get in Touch
            </p>
            <h1 className="mb-5 text-4xl font-bold text-white font-display sm:text-5xl">
              Contact Us
            </h1>
            <div className="w-12 h-[3px] bg-gold mx-auto mb-5 rounded" />
            <p className="max-w-xl mx-auto leading-relaxed text-white/70 font-body">
              Whether you want to share your story, explore partnership opportunities, or simply learn more about the movement — we'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-cream sm:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid items-start grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">

              {/* Left */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-2xl font-bold font-display sm:text-3xl text-green">
                    We'd Love to Hear From You
                  </h2>
                  <div className="w-10 h-[3px] bg-gold rounded mt-3 mb-6" />
                  <p className="text-base leading-relaxed text-ink-mid font-body">
                    Pride of Pakistan is a growing movement and we welcome individuals, businesses, organisations, and communities who want to be part of redefining how the world sees Pakistan.
                  </p>
                </div>

                <div className="space-y-4">
                  {CONTACT_DETAILS.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="flex items-center gap-4 p-4 no-underline transition-colors bg-white border border-border rounded-xl hover:border-gold group"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-2xl rounded-lg bg-gold-pale">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-xs text-ink-muted font-body uppercase tracking-wide mb-0.5">{c.label}</p>
                        <p className="text-sm font-semibold transition-colors text-ink-dark font-body group-hover:text-gold">
                          {c.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/uploads/aboutus_images/larg_6.jpg"
                    alt="Pride of Pakistan team"
                    className="w-full h-full object-fit"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559304787-78989a7ef38c?w=800&q=80'
                    }}
                  />
                </div>

                <div className="p-5 bg-white border border-border rounded-xl">
                  <h3 className="mb-3 text-base font-bold font-display text-green">Quick Links</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Submit Your Profile', href: '/submit-profile' },
                      { label: 'List Your Business',  href: '/list-business' },
                      { label: 'Become a Member',     href: '/membership' },
                      { label: 'About the Founder',   href: '/about' },
                      { label: 'Our Mission',         href: '/mission' },
                    ].map(({ label, href }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center justify-between py-1 text-sm transition-colors border-b text-ink-mid font-body hover:text-gold border-border last:border-0"
                      >
                        {label}
                        <span className="text-gold">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div className="p-6 bg-white border border-border rounded-2xl sm:p-8">
                <h2 className="mb-1 text-2xl font-bold font-display text-green">Send a Message</h2>
                <p className="mb-6 text-sm text-ink-muted font-body">We aim to respond within 2 working days.</p>

                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="mb-4 text-5xl">✅</div>
                    <h3 className="mb-2 text-xl font-bold font-display text-green">Message Sent!</h3>
                    <p className="text-sm text-ink-muted font-body">
                      Thank you for reaching out. We'll be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                          Your Name <span className="text-gold">*</span>
                        </label>
                        <input
                          name="name"
                          type="text"
                          required
                          className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                          Email <span className="text-gold">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          required
                          className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                        Subject <span className="text-gold">*</span>
                      </label>
                      <input
                        name="subject"
                        type="text"
                        required
                        className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                        placeholder="e.g. Partnership enquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                        Message <span className="text-gold">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                        placeholder="Tell us how we can help, or share your story…"
                      />
                    </div>

                    {error && <p className="text-sm text-red-500 font-body">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
                    >
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>

                    <p className="text-xs text-center text-ink-muted font-body">
                      Or email us directly at{' '}
                      <a href="mailto:info@prideofpakistan.com" className="text-gold hover:underline">
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
  )
}
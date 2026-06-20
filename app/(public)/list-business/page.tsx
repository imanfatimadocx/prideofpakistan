'use client'
import { useState } from 'react'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'
import PageHero from '@/app/components/shared/PageHero'

export default function ListBusinessPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      form.reset()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar />
      <Navbar />
      <main>
        <PageHero
          eyebrow="Grow Your Reach"
          title="List Your Business"
          subtitle="Join Pakistan's premier business directory and connect with customers across the country and abroad."
        />

        <section className="py-12 bg-cream sm:py-16 lg:py-20">
          <div className="max-w-[700px] mx-auto px-4 sm:px-8 lg:px-12">
            {submitted ? (
              <div className="p-8 text-center bg-white border border-border rounded-xl">
                <div className="mb-4 text-5xl">✅</div>
                <h2 className="mb-2 text-2xl font-bold font-display text-green">
                  Thank You!
                </h2>
                <p className="leading-relaxed text-ink-muted font-body">
                  Your business has been submitted for review. We&apos;ll notify you once it&apos;s live.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5 bg-white border border-border rounded-xl sm:p-8"
              >
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Company Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="company_name"
                    type="text"
                    required
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="e.g. Innovation Excellence Pvt Ltd"
                  />
                </div>

                {/* Name + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Your Name <span className="text-gold">*</span>
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Last Name
                    </label>
                    <input
                      name="l_name"
                      type="text"
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Email <span className="text-gold">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* City + Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      City <span className="text-gold">*</span>
                    </label>
                    <input
                      name="city"
                      type="text"
                      required
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                      Country <span className="text-gold">*</span>
                    </label>
                    <input
                      name="country"
                      type="text"
                      defaultValue="Pakistan"
                      required
                      className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Website
                  </label>
                  <input
                    name="site_url"
                    type="url"
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="https://"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Short Description <span className="text-gold">*</span>
                  </label>
                  <textarea
                    name="shortdesc"
                    required
                    rows={3}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="One or two sentences about what your business does…"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Full Description
                  </label>
                  <textarea
                    name="company_description"
                    rows={5}
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us more about your business, services, history…"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Logo
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors file:bg-gold-pale file:text-gold file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:text-xs file:font-semibold file:cursor-pointer"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-body">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting…' : 'Submit for Review'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
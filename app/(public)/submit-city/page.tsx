'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export default function SubmitCityPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const name        = (form.elements.namedItem('name')        as HTMLInputElement).value
    const country     = (form.elements.namedItem('country')     as HTMLInputElement).value
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value

    try {
      const res = await fetch('/api/cities/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, description }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Submission failed.'); return }
      router.push('/dashboard?submitted=city')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <><Topbar /><Navbar /><main className="flex items-center justify-center min-h-screen bg-cream"><p className="text-sm text-ink-muted font-body">Loading...</p></main><Footer /></>
  }

  if (!session) {
    return (
      <><Topbar /><Navbar />
      <main className="flex items-center justify-center min-h-screen px-4 bg-cream">
        <div className="max-w-sm text-center">
          <h1 className="mb-3 text-2xl font-bold font-display text-green">Sign In Required</h1>
          <p className="mb-6 text-sm text-ink-muted font-body">You need to be signed in to submit a city.</p>
          <Link href="/login?redirect=/submit-city" className="bg-gold text-white px-5 py-2.5 rounded-md font-semibold text-sm font-body no-underline hover:bg-gold-light hover:text-ink-dark transition-colors">Sign In</Link>
        </div>
      </main><Footer /></>
    )
  }

  return (
    <><Topbar /><Navbar />
    <main className="py-12 bg-cream sm:py-16">
      <div className="max-w-[600px] mx-auto px-4 sm:px-8 lg:px-12">
        <Link href="/cities" className="inline-block mb-6 text-sm text-gold font-body hover:underline">Back to Cities</Link>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold font-display text-green">Introduce a City</h1>
          <p className="text-sm text-ink-muted font-body">Know a Pakistani city, town or village that should be featured? Submit it for review.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white border border-border rounded-xl sm:p-8">
          <div>
            <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">City / Town / Village Name <span className="text-gold">*</span></label>
            <input name="name" type="text" required className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Murree" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Province / Country <span className="text-gold">*</span></label>
            <input name="country" type="text" required defaultValue="Pakistan" className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Description</label>
            <textarea name="description" rows={5} className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none" placeholder="Tell us about this city — its history, significance, what makes it special..." />
          </div>

          {error && <p className="text-sm text-red-500 font-body">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-ink-muted font-body">Submitting as <strong>{session.user?.name ?? session.user?.email}</strong></p>
            <button type="submit" disabled={loading} className="py-3 text-sm font-semibold text-white transition-colors rounded-md bg-gold px-7 font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </main><Footer /></>
  )
}
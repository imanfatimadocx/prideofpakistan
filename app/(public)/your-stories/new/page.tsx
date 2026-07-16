'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Topbar from '@/app/components/layout/Topbar'
import Navbar from '@/app/components/layout/Navbar'
import Footer from '@/app/components/layout/Footer'

export default function NewStoryPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const title     = (form.elements.namedItem('title')     as HTMLInputElement).value
    const shortdesc = (form.elements.namedItem('shortdesc') as HTMLTextAreaElement).value
    const content   = (form.elements.namedItem('content')   as HTMLTextAreaElement).value

    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, shortdesc, content }),
      })

      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Submission failed.'); return }
      router.push('/dashboard?submitted=story')
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
          <p className="mb-6 text-sm text-ink-muted font-body">You need to be signed in to share your story.</p>
          <div className="flex justify-center gap-3">
            <Link href="/login" className="bg-gold text-white px-5 py-2.5 rounded-md font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline">Sign In</Link>
            <Link href="/register" className="border border-border text-ink-mid px-5 py-2.5 rounded-md font-semibold text-sm font-body hover:border-gold hover:text-green transition-colors no-underline">Register</Link>
          </div>
        </div>
      </main><Footer /></>
    )
  }

  return (
    <><Topbar /><Navbar />
    <main className="py-12 bg-cream sm:py-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-12">
        <Link href="/your-stories" className="inline-block mb-6 text-sm text-gold font-body hover:underline">Back to Stories</Link>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold font-display text-green">Share Your Story</h1>
          <p className="text-sm text-ink-muted font-body">Your story will be reviewed before it appears on the site.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white border border-border rounded-xl sm:p-8">
          <div>
            <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Title <span className="text-gold">*</span></label>
            <input name="title" type="text" required maxLength={255} className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors" placeholder="Give your story a compelling title" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Short Summary <span className="text-gold">*</span></label>
            <textarea name="shortdesc" required rows={3} className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none" placeholder="A brief summary that appears in the stories list (2-3 sentences)" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">Your Story <span className="text-gold">*</span></label>
            <textarea name="content" required rows={16} className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none leading-relaxed" placeholder="Write your full story here..." />
          </div>

          <div className="p-4 border rounded-lg bg-gold-pale border-gold/20">
            <p className="text-xs leading-relaxed text-ink-mid font-body">
              Stories should be original, respectful, and relevant to Pakistani culture or community. Our team reviews all submissions within 2-3 working days.
            </p>
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
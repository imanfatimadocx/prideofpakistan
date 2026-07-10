'use client'
import { useState, useEffect } from 'react'

interface Comment {
  id: number
  authorName: string
  content: string
  createdAt: string
}

interface Props {
  entityType: string
  entityId: number
}

export default function CommentSection({ entityType, entityId }: Props) {
  const [comments, setComments]   = useState<Comment[]>([])
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/comments?entityType=${entityType}&entityId=${entityId}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [entityType, entityId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      authorName:  (form.elements.namedItem('authorName')  as HTMLInputElement).value,
      authorEmail: (form.elements.namedItem('authorEmail') as HTMLInputElement).value,
      content:     (form.elements.namedItem('content')     as HTMLTextAreaElement).value,
      entityType,
      entityId,
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? 'Failed to submit.')
        return
      }

      setSubmitted(true)
      form.reset()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-12 border-t bg-cream sm:py-16 border-border">
      <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-12">
        <h2 className="mb-8 text-2xl font-bold font-display text-green">
          Comments {comments.length > 0 && <span className="text-lg font-normal text-ink-muted">({comments.length})</span>}
        </h2>

        {/* Existing comments */}
        {loading ? (
          <p className="mb-8 text-sm text-ink-muted font-body">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="mb-8 text-sm text-ink-muted font-body">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="mb-10 space-y-5">
            {comments.map((c) => (
              <div key={c.id} className="p-5 bg-white border border-border rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">
                      {c.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-ink-dark font-body">{c.authorName}</span>
                  </div>
                  <span className="text-xs text-ink-muted font-body">
                    {new Date(c.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-ink-mid font-body">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Submit form */}
        <div className="p-6 bg-white border border-border rounded-xl">
          <h3 className="mb-5 text-lg font-bold font-display text-green">Leave a Comment</h3>

          {submitted ? (
            <div className="py-6 text-center">
              <p className="mb-1 text-sm font-semibold text-green font-body">Comment submitted!</p>
              <p className="text-xs text-ink-muted font-body">
                Your comment is awaiting moderation and will appear once approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Name <span className="text-gold">*</span>
                  </label>
                  <input
                    name="authorName"
                    type="text"
                    required
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                    Email <span className="text-gold">*</span>
                  </label>
                  <input
                    name="authorEmail"
                    type="email"
                    required
                    className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="Not published"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-dark mb-1.5 font-body">
                  Comment <span className="text-gold">*</span>
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
              {error && <p className="text-sm text-red-500 font-body">{error}</p>}
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-muted font-body">
                  Comments are moderated before appearing.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gold text-white rounded-md px-6 py-2.5 font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
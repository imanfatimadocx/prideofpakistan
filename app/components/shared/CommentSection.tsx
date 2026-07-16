'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

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
  const { data: session, status } = useSession()
  const [comments, setComments]     = useState<Comment[]>([])
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [content, setContent]       = useState('')

  useEffect(() => {
    fetch(`/api/comments?entityType=${entityType}&entityId=${entityId}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [entityType, entityId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, entityType, entityId }),
      })

      const json = await res.json()

      if (json.requiresAuth) {
        setError('Please sign in to leave a comment.')
        return
      }

      if (!res.ok) {
        setError(json.error ?? 'Failed to submit.')
        return
      }

      setComments((prev) => [{
        id: json.comment.id,
        authorName: session?.user?.name ?? session?.user?.email ?? 'You',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      }, ...prev])

      setContent('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
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
          Comments{' '}
          {comments.length > 0 && (
            <span className="text-lg font-normal text-ink-muted">({comments.length})</span>
          )}
        </h2>

        {loading ? (
          <p className="mb-8 text-sm text-ink-muted font-body">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="mb-8 text-sm text-ink-muted font-body">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          <div className="mb-10 space-y-4">
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

        <div className="p-6 bg-white border border-border rounded-xl">
          <h3 className="mb-4 text-lg font-bold font-display text-green">Leave a Comment</h3>

          {status === 'loading' ? (
            <p className="text-sm text-ink-muted font-body">Loading...</p>
          ) : !session ? (
            <div className="p-5 text-center border rounded-lg bg-cream border-border">
              <p className="mb-4 text-sm text-ink-mid font-body">
                You need to be signed in to leave a comment.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-semibold text-white no-underline transition-colors rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-semibold no-underline transition-colors border rounded-md border-border text-ink-mid font-body hover:border-gold hover:text-green"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : submitted ? (
            <div className="py-4 text-center">
              <p className="text-sm font-semibold text-green font-body">Comment posted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white rounded-full w-9 h-9 bg-green font-display">
                  {(session.user?.name ?? session.user?.email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-dark font-body">
                    {session.user?.name ?? session.user?.email}
                  </p>
                  <p className="text-xs text-ink-muted font-body">Commenting as yourself</p>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="w-full border border-border rounded-md px-3.5 py-2.5 text-sm font-body focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Share your thoughts..."
              />

              {error && <p className="text-sm text-red-500 font-body">{error}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="bg-gold text-white rounded-md px-6 py-2.5 font-semibold text-sm font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
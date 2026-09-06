'use client'
import { useState } from 'react'

interface Query {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function ContactClient({ queries: initial }: { queries: Query[] }) {
  const [queries, setQueries] = useState(initial)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  async function markRead(id: number) {
    await fetch(`/api/admin/contact/${id}/read`, { method: 'PATCH' })
    setQueries((prev) => prev.map((q) => q.id === id ? { ...q, read: true } : q))
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this query?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/contact/${id}`, { method: 'DELETE' })
      setQueries((prev) => prev.filter((q) => q.id !== id))
      if (expanded === id) setExpanded(null)
    } finally { setDeleting(null) }
  }

  function toggleExpand(id: number) {
    setExpanded(expanded === id ? null : id)
    if (!queries.find((q) => q.id === id)?.read) markRead(id)
  }

  return (
    <div className="space-y-3">
      {queries.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-10 text-center">
          <p className="text-sm text-ink-muted font-body">No contact queries yet.</p>
        </div>
      ) : queries.map((q) => (
        <div
          key={q.id}
          className={`bg-white border rounded-xl overflow-hidden transition-all ${
            !q.read ? 'border-gold/40 shadow-sm' : 'border-border'
          }`}
        >
          {/* Header */}
          <button
            onClick={() => toggleExpand(q.id)}
            className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-cream/30 transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-white text-sm font-bold font-display flex-shrink-0">
                {q.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-ink-dark font-body">{q.name}</p>
                  {!q.read && (
                    <span className="text-[10px] font-bold bg-gold text-white px-2 py-0.5 rounded-full font-body">New</span>
                  )}
                </div>
                <p className="text-xs text-ink-muted font-body mt-0.5">{q.email}</p>
                <p className="text-sm font-medium text-ink-dark font-body mt-1 truncate max-w-[400px]">{q.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-ink-muted font-body hidden sm:block">
                {new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`text-ink-muted transition-transform ${expanded === q.id ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </button>

          {/* Expanded */}
          {expanded === q.id && (
            <div className="px-5 pb-5 border-t border-border">
              <div className="pt-4 space-y-3">
                <div className="bg-cream rounded-xl px-4 py-3">
                  <p className="text-sm text-ink-mid font-body leading-relaxed whitespace-pre-wrap">{q.message}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${q.email}?subject=Re: ${q.subject}`}
                    className="inline-flex items-center gap-1.5 bg-gold text-white px-4 py-2 rounded-md text-xs font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors no-underline"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    Reply by Email
                  </a>
                  <button
                    onClick={() => handleDelete(q.id)}
                    disabled={deleting === q.id}
                    className="text-xs text-red-500 font-body hover:underline disabled:opacity-50 ml-auto"
                  >
                    {deleting === q.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
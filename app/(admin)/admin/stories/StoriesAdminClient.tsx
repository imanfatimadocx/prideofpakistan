'use client'
import { useState } from 'react'

interface Story {
  id: number
  title: string
  shortdesc: string
  authorName: string
  status: string
  createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-700 border border-amber-200',
  approved: 'bg-green/10 text-green border border-green/20',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
}

export default function StoriesAdminClient({ stories: initial }: { stories: Story[] }) {
  const [stories, setStories] = useState(initial)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  async function updateStatus(id: number, status: string) {
    setLoading(id)
    try {
      await fetch('/api/admin/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setStories((prev) => prev.map((s) => s.id === id ? { ...s, status } : s))
    } finally {
      setLoading(null)
    }
  }

  const filtered = filter === 'all' ? stories : stories.filter((s) => s.status === filter)
  const pendingCount = stories.filter((s) => s.status === 'pending').length

  return (
    <div>
      <div className="flex gap-2 pb-4 mb-6 border-b border-border">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium font-body border transition-colors capitalize ${filter === f ? 'bg-green text-white border-green' : 'border-border text-ink-mid hover:border-green'}`}>
            {f}
            {f === 'pending' && pendingCount > 0 && <span className="ml-1.5 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-sm text-center text-ink-muted font-body">No {filter === 'all' ? '' : filter} stories.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="overflow-hidden bg-white border border-border rounded-xl">
              <div className="flex items-center justify-between px-5 py-4 transition-colors cursor-pointer hover:bg-cream" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                <div className="flex items-center min-w-0 gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded font-body flex-shrink-0 ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-ink-dark font-body">{s.title}</p>
                    <p className="text-xs text-ink-muted font-body">by {s.authorName} · {new Date(s.createdAt).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0 gap-2">
                  {s.status === 'pending' && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(s.id, 'approved') }} disabled={loading === s.id} className="bg-green text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-green-mid transition-colors disabled:opacity-50 font-body">Approve</button>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(s.id, 'rejected') }} disabled={loading === s.id} className="bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 font-body">Reject</button>
                    </>
                  )}
                  {s.status === 'approved' && <button onClick={(e) => { e.stopPropagation(); updateStatus(s.id, 'rejected') }} disabled={loading === s.id} className="text-xs transition-colors text-ink-muted font-body hover:text-red-600">Revoke</button>}
                  {s.status === 'rejected' && <button onClick={(e) => { e.stopPropagation(); updateStatus(s.id, 'approved') }} disabled={loading === s.id} className="text-xs text-green font-body hover:underline">Re-approve</button>}
                  <span className="text-sm text-ink-muted">{expanded === s.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expanded === s.id && (
                <div className="px-5 pt-4 pb-5 border-t border-border">
                  <p className="text-sm leading-relaxed text-ink-mid font-body">{s.shortdesc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}